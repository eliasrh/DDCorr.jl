#!/usr/bin/env python3
"""Download bounded event snippets, preserve provenance, and write DDCorr SAC.

Waveforms alone do not identify earthquakes or contain picks. Supply an event
catalogue and observed picks, or explicitly request labelled teaching predictions.
Only this optional helper needs ObsPy; the Julia correlator does not.
"""
import argparse
import csv
import hashlib
import io
import json
import math
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def atomic_json(path, value):
    part = path.with_suffix(path.suffix+".part")
    part.write_text(json.dumps(value, indent=2, sort_keys=True)+"\n")
    part.replace(path)


class NoData(Exception):
    """A successful FDSN query returned no waveform/metadata observations."""


class RequestCache:
    """Exact-request cache: verify bytes on every reuse, never silently replace them."""
    def __init__(self, root, total_bytes, per_file_bytes=4*1024**2, opener=None):
        self.root = Path(root); self.root.mkdir(parents=True, exist_ok=True)
        self.limit = total_bytes; self.per_file_limit = per_file_bytes
        self.used = 0; self.new = 0; self.records = []; self.seen = set()
        self.opener = opener or urllib.request.urlopen

    def get(self, url, suffix):
        key = hashlib.sha256(url.encode()).hexdigest()
        target = self.root/(key+suffix); receipt = self.root/(key+".json")
        if receipt.exists():
            entry = json.loads(receipt.read_text())
            if entry["url"] != url:
                raise ValueError("Cache request identity mismatch")
            if entry["status"] == "no_data":
                raise NoData(url)
            if not target.exists() or sha256(target) != entry["sha256"]:
                raise ValueError(f"Cache file missing or changed: {target}; inspect it or choose another cache.")
            source = "cache"
        else:
            if target.exists():
                raise ValueError(f"Unreceipted cache file: {target}; inspect it or choose another cache.")
            part = target.with_suffix(target.suffix+".part")
            for attempt in range(3):
                try:
                    request = urllib.request.Request(url, headers={"User-Agent": "DDCorr-course/0.1"})
                    with self.opener(request, timeout=60) as response:
                        if response.status == 204:
                            atomic_json(receipt, {"url": url, "status": "no_data"})
                            raise NoData(url)
                        size = 0
                        with part.open("wb") as f:
                            while block := response.read(65536):
                                size += len(block)
                                if size > self.per_file_limit or self.used+size > self.limit:
                                    raise ValueError("Download byte limit reached; reduce the example or explicitly raise --total-mib.")
                                f.write(block)
                    if size == 0:
                        atomic_json(receipt, {"url": url, "status": "no_data"})
                        raise NoData(url)
                    entry = {"url": url, "status": "ok", "bytes": size, "sha256": sha256(part)}
                    part.replace(target); atomic_json(receipt, entry)
                    self.new += size; source = "download"; break
                except urllib.error.HTTPError as error:
                    if error.code in (429, 500, 502, 503, 504) and attempt < 2:
                        time.sleep(2**attempt); continue
                    # 204 is requested explicitly. A 404 could be a wrong endpoint,
                    # so retain the error instead of calling it a missing station.
                    raise RuntimeError(f"Archive HTTP {error.code}: {url}") from error
                except urllib.error.URLError as error:
                    if attempt < 2:
                        time.sleep(2**attempt); continue
                    raise RuntimeError(f"Archive connection failed: {error.reason}") from error
                finally:
                    part.unlink(missing_ok=True)
        if key not in self.seen:
            if self.used+entry["bytes"] > self.limit:
                raise ValueError("Selected cached inputs exceed --total-mib; narrow the selection or explicitly raise the limit.")
            self.used += entry["bytes"]; self.seen.add(key)
            self.records.append({**entry, "cache_file": str(target.resolve()), "source": source})
        print(f"{source}: {suffix[1:]} ({entry['bytes']:,} bytes)", flush=True)
        return target


def read_events(path, UTCDateTime):
    with Path(path).open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    result = []
    for row in rows:
        label = row["event_id"]
        if not re.fullmatch(r"[A-Za-z0-9_.-]+", label) or label in (".", ".."):
            raise ValueError(f"Unsafe event_id: {label!r}")
        event = {"event_id": label, "origin_utc": str(UTCDateTime(row["origin_utc"])),
                 "latitude": float(row["latitude"]), "longitude": float(row["longitude"]),
                 "depth_km": float(row["depth_km"]), "source": row.get("source", "user supplied")}
        if not all(math.isfinite(event[k]) for k in ("latitude", "longitude", "depth_km")):
            raise ValueError(f"Nonfinite event metadata: {label}")
        if not -90 <= event["latitude"] <= 90 or not -180 <= event["longitude"] <= 180:
            raise ValueError(f"Invalid event coordinates: {label}")
        if row.get("magnitude", "").strip():
            event["magnitude"] = float(row["magnitude"])
            if not math.isfinite(event["magnitude"]):
                raise ValueError(f"Nonfinite magnitude: {label}")
        result.append(event)
    if not result or len({r["event_id"] for r in result}) != len(result):
        raise ValueError("Event CSV must have at least one event and unique event_id values")
    return result


def read_picks(path, UTCDateTime):
    result = {}
    if path is None:
        return result
    with Path(path).open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    for row in rows:
        phase = row["phase"].upper()
        if phase not in ("P", "S"):
            raise ValueError("Pick phase must be P or S")
        key = (row["event_id"], row["network"], row["station"], row["location"].replace("--", ""), phase)
        if key in result:
            raise ValueError(f"Duplicate pick: {key}")
        if not row.get("provenance", "").strip():
            raise ValueError("Each supplied pick needs a provenance (manual analyst, automatic picker, etc.)")
        result[key] = {"arrival": UTCDateTime(row["arrival_utc"]), "provenance": row["provenance"]}
    return result


def coherent_trace(stream, trace_id, start, end, np):
    """Merge only a continuous trace. Never fill real gaps with zeros or interpolate."""
    subset = stream.select(id=trace_id).copy()
    if len({float(tr.stats.sampling_rate) for tr in subset}) != 1:
        raise ValueError("Changing sample rate in requested snippet")
    # ObsPy may consolidate exact duplicate or adjacent records. Contradictory
    # overlap becomes masked with method=0 and is rejected below.
    subset.merge(method=0, fill_value=None)
    if len(subset) != 1:
        raise ValueError("Could not construct one continuous trace")
    trace = subset[0]
    trace.trim(starttime=start, endtime=end, nearest_sample=False, pad=False)
    tolerance = 1.01/trace.stats.sampling_rate
    if not len(trace) or trace.stats.starttime > start+tolerance or trace.stats.endtime < end-tolerance:
        raise ValueError("Incomplete waveform coverage")
    if np.ma.isMaskedArray(trace.data) and np.ma.getmaskarray(trace.data).any():
        raise ValueError("Gap or contradictory overlap; no samples invented")
    if not np.isfinite(trace.data).all():
        raise ValueError("Nonfinite waveform samples")
    trace.data = np.asarray(trace.data, dtype=np.float32)
    return trace


def exact_channel(inventory, network, station, location, channel, start, end):
    matches = []
    for net in inventory.select(network=network, station=station, location=location, channel=channel):
        for sta in net:
            for cha in sta:
                if (cha.start_date is None or cha.start_date <= start) and (cha.end_date is None or cha.end_date >= end):
                    matches.append(cha)
    if len(matches) != 1:
        raise ValueError("No unique channel metadata epoch covering the whole snippet")
    cha = matches[0]
    if any(x is None or not math.isfinite(float(x)) for x in
           (cha.latitude, cha.longitude, cha.elevation, cha.depth, cha.azimuth, cha.dip, cha.sample_rate)):
        raise ValueError("Incomplete station coordinates, orientation or sampling metadata")
    return cha


def make_parser():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--events", type=Path, required=True, help="CSV: event_id,origin_utc,latitude,longitude,depth_km[,magnitude,source]")
    parser.add_argument("--network", required=True, help="One network code (no wildcard)")
    parser.add_argument("--stations", required=True, help="Explicit comma-separated station codes")
    parser.add_argument("--channels", default="HH?", help="FDSN channel selection, quoted when it contains wildcards")
    parser.add_argument("--location", default="--", help="-- means blank; pass --location=--")
    parser.add_argument("--pick-mode", required=True, choices=("observed", "predicted"))
    parser.add_argument("--picks", type=Path, help="Required for observed mode; P and S arrival times in UTC")
    parser.add_argument("--vp", type=float, default=6.0, help="Teaching homogeneous P velocity, km/s")
    parser.add_argument("--vs", type=float, default=3.5, help="Teaching homogeneous S velocity, km/s")
    parser.add_argument("--before", type=float, default=25, help="Seconds before each origin")
    parser.add_argument("--after", type=float, default=70, help="Seconds after each origin")
    parser.add_argument("--service", default="https://service.earthscope.org", help="FDSN service base URL")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--cache-dir", type=Path, default=Path("work/download_cache"))
    parser.add_argument("--total-mib", type=float, default=20, help="Limit total selected archive input bytes, including cached inputs")
    return parser


def run(args):
    try:
        import numpy as np
        import obspy
        from obspy import UTCDateTime, read, read_inventory
        from obspy.geodetics import gps2dist_azimuth
        from obspy.io.sac import SACTrace
    except ImportError as error:
        raise RuntimeError("Install optional dependencies first: python -m pip install -r requirements-download.txt") from error
    if not re.fullmatch(r"[A-Za-z0-9]+", args.network):
        raise ValueError("Use one explicit network code")
    stations = args.stations.split(",")
    if len(stations) != len(set(stations)) or not all(re.fullmatch(r"[A-Za-z0-9]+", x) for x in stations):
        raise ValueError("Use unique explicit comma-separated station codes, without spaces")
    if not (args.before > 0 and args.after > 0 and args.total_mib > 0 and args.vp > args.vs > 0):
        raise ValueError("Positive durations/limits and vp > vs > 0 are required")
    if args.before+args.after > 600:
        raise ValueError("This event-snippet teaching helper limits each request to 600 seconds")
    if args.pick_mode == "observed" and args.picks is None:
        raise ValueError("Observed mode requires --picks; waveform data do not supply phase picks")
    if args.pick_mode == "predicted" and args.picks is not None:
        raise ValueError("Choose either supplied observed picks or teaching predictions")
    events = read_events(args.events, UTCDateTime)
    if len(events)*len(stations) > 200:
        raise ValueError("Teaching helper limits requests to 200 event/station combinations; split the catalogue")
    picks = read_picks(args.picks, UTCDateTime)
    definition = {"events_sha256": sha256(args.events), "picks_sha256": sha256(args.picks) if args.picks else None,
        "network": args.network, "stations": stations, "channels": args.channels, "location": args.location,
        "pick_mode": args.pick_mode, "vp": args.vp, "vs": args.vs, "before": args.before, "after": args.after,
        "service": args.service.rstrip("/"), "format_version": 1}
    output = args.output; output.mkdir(parents=True, exist_ok=True)
    manifest_path = output/"manifest.json"
    if manifest_path.exists():
        old = json.loads(manifest_path.read_text())
        if old["definition"] != definition:
            raise ValueError("Output belongs to a different request; choose another --output")
        for row in old["sac_files"]:
            path = output/row["path"]
            if not path.exists() or sha256(path) != row["sha256"]:
                raise ValueError(f"Previously generated SAC missing/changed: {path}")
    elif any(output.iterdir()):
        raise ValueError("Output directory is not empty and has no matching manifest")
    cache = RequestCache(args.cache_dir, int(args.total_mib*1024**2))
    manifest = {"definition": definition, "complete": False, "obspy_version": obspy.__version__,
                "events": events, "sac_files": [], "skipped": [], "requests": [],
                "pick_warning": "Predicted P/S are homogeneous-model window centres, NOT observed arrivals." if args.pick_mode == "predicted" else "P/S were supplied by the user; consult per-pick provenance.",
                "amplitude_units": "archive digital counts; no instrument response removal or filtering"}
    atomic_json(manifest_path, manifest)
    first = min(UTCDateTime(e["origin_utc"]) for e in events)-args.before
    last = max(UTCDateTime(e["origin_utc"]) for e in events)+args.after
    def url(service, **selection):
        return definition["service"]+f"/fdsnws/{service}/1/query?"+urllib.parse.urlencode(selection)
    def journal():
        manifest.update(requests=cache.records, selected_archive_bytes=cache.used, downloaded_bytes_this_run=cache.new)
        atomic_json(manifest_path, manifest)
    metadata = {}
    for station in stations:
        request = url("station", network=args.network, station=station, location=args.location,
                      channel=args.channels, starttime=str(first), endtime=str(last), level="channel", format="xml", nodata=204)
        try:
            path = cache.get(request, ".xml"); metadata[station] = read_inventory(str(path))
        except NoData:
            manifest["skipped"].append({"station": station, "reason": "No station metadata for selection"})
        journal()
    for event in events:
        origin = UTCDateTime(event["origin_utc"]); start, end = origin-args.before, origin+args.after
        for station, inventory in metadata.items():
            request = url("dataselect", network=args.network, station=station, location=args.location,
                          channel=args.channels, starttime=str(start), endtime=str(end), format="miniseed", nodata=204)
            try:
                raw_path = cache.get(request, ".mseed"); stream = read(str(raw_path), format="MSEED")
            except NoData:
                manifest["skipped"].append({"event_id": event["event_id"], "station": station, "reason": "Archive returned no waveform data"})
                journal(); continue
            for trace_id in sorted({tr.id for tr in stream}):
                try:
                    trace = coherent_trace(stream, trace_id, start, end, np)
                    network, sta, location, channel = trace.id.split(".")
                    if network != args.network or sta != station:
                        raise ValueError("Archive returned an unexpected network or station")
                    cha = exact_channel(inventory, network, sta, location, channel, trace.stats.starttime, trace.stats.endtime)
                    if abs(trace.stats.sampling_rate-cha.sample_rate) > 1e-6:
                        raise ValueError("Waveform and metadata sampling rates differ")
                    phase_times, phase_sources = {}, {}
                    if args.pick_mode == "predicted":
                        horizontal = gps2dist_azimuth(event["latitude"], event["longitude"], cha.latitude, cha.longitude)[0]/1000
                        vertical = event["depth_km"] + (cha.elevation-cha.depth)/1000
                        distance = math.hypot(horizontal, vertical)
                        for phase, velocity in [("P", args.vp), ("S", args.vs)]:
                            phase_times[phase] = origin+distance/velocity
                            phase_sources[phase] = f"predicted: straight ray in homogeneous {velocity:g} km/s medium"
                    else:
                        for phase in ("P", "S"):
                            row = picks.get((event["event_id"], network, sta, location, phase))
                            if row:
                                phase_times[phase] = row["arrival"]; phase_sources[phase] = row["provenance"]
                    if "P" not in phase_times:
                        raise ValueError("No P pick: default pre-P noise window cannot be defined")
                    if any(t <= origin for t in phase_times.values()):
                        raise ValueError("Pick is not after origin")
                    if "S" in phase_times and phase_times["S"] <= phase_times["P"]:
                        raise ValueError("S pick is not after P")
                    if phase_times["P"]-15 < trace.stats.starttime or max(phase_times.values())+10 > trace.stats.endtime:
                        raise ValueError("Insufficient real pre-P/post-S data; increase --before/--after")
                    sac = SACTrace.from_obspy_trace(trace)
                    # All relative times must refer to the SAME NZ reference.
                    reference = origin-(origin.microsecond % 1000)*1e-6
                    sac.reftime = reference
                    sac.o = float(origin-reference); sac.ko = "origin"
                    sac.a = float(phase_times["P"]-reference)
                    sac.ka = "P_pred" if args.pick_mode == "predicted" else "P_obs"
                    if "S" in phase_times:
                        sac.t0 = float(phase_times["S"]-reference)
                        sac.kt0 = "S_pred" if args.pick_mode == "predicted" else "S_obs"
                    sac.evla, sac.evlo, sac.evdp = event["latitude"], event["longitude"], event["depth_km"]
                    if "magnitude" in event:
                        sac.mag = event["magnitude"]
                    sac.stla, sac.stlo, sac.stel, sac.stdp = cha.latitude, cha.longitude, cha.elevation, cha.depth
                    sac.cmpaz, sac.cmpinc = cha.azimuth, cha.dip+90
                    sac.knetwk, sac.kstnm, sac.khole, sac.kcmpnm = network, sta, location, channel
                    sac.kevnm = event["event_id"][:16]
                    sac.kuser0 = "PREDICT" if args.pick_mode == "predicted" else "SUPPLIED"
                    path = output/"sac"/event["event_id"]/(trace.id+".sac")
                    path.parent.mkdir(parents=True, exist_ok=True)
                    part = path.with_suffix(".sac.part"); sac.write(str(part), byteorder="little")
                    digest = sha256(part)
                    if path.exists() and sha256(path) != digest:
                        part.unlink(); raise ValueError(f"Generated SAC differs from existing output: {path}; use a fresh output")
                    part.replace(path)
                    manifest["sac_files"].append({"path": str(path.relative_to(output)), "sha256": digest,
                        "event_id": event["event_id"], "trace_id": trace.id, "miniSEED_sha256": sha256(raw_path),
                        "start_utc": str(trace.stats.starttime), "end_utc": str(trace.stats.endtime),
                        "sample_rate_hz": trace.stats.sampling_rate, "npts": trace.stats.npts,
                        "arrivals_utc": {k: str(v) for k, v in phase_times.items()}, "pick_provenance": phase_sources})
                except (ValueError, IndexError) as error:
                    manifest["skipped"].append({"event_id": event["event_id"], "trace_id": trace_id, "reason": str(error)})
            journal()
    manifest["complete"] = True; journal()
    print(f"Ready: {len(manifest['sac_files'])} SAC traces; {len(manifest['skipped'])} skipped selections. See {manifest_path}")
    if not manifest["sac_files"]:
        raise ValueError("No usable SAC traces were produced; inspect skipped entries in the manifest")
    if args.pick_mode == "predicted":
        print("Teaching predictions are window centres, not measured picks. Inspect waveforms before scientific interpretation.")
    return manifest


if __name__ == "__main__":
    try:
        run(make_parser().parse_args())
    except (ValueError, RuntimeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(2)
