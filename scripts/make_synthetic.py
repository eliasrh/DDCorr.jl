#!/usr/bin/env python3
"""Make a deterministic SAC exercise without Python packages or network access.

These are synthetic signals, coordinates and picks. They are not earthquakes.
The timing truth is independent of the deliberately imperfect supplied picks.
"""
import argparse
import csv
import datetime as dt
import hashlib
import itertools
import json
import math
from pathlib import Path
import random
import struct


def write_sac(path, data, *, origin, begin, rate, event_id, station, channel,
              p, s, latitude, longitude, depth, station_lat, station_lon,
              azimuth, inclination):
    """Write evenly sampled little-endian SAC v6; time fields share one reference."""
    floats = [-12345.0] * 70
    ints = [-12345] * 40
    chars = bytearray(b" " * 192)
    def word(offset, text, size=8):
        chars[offset:offset+size] = text.encode("ascii")[:size].ljust(size, b" ")
    # NZ reference is the origin rounded DOWN to a millisecond; O preserves remainder.
    reference = origin.replace(microsecond=origin.microsecond // 1000 * 1000)
    offset = (origin - reference).total_seconds()
    for i, value in {0: 1/rate, 1: min(data), 2: max(data), 5: begin+offset,
                     6: begin+offset+(len(data)-1)/rate, 7: offset,
                     8: p+offset, 10: s+offset, 31: station_lat, 32: station_lon,
                     33: 0.0, 35: latitude, 36: longitude, 38: depth,
                     56: sum(data)/len(data), 57: azimuth, 58: inclination}.items():
        floats[i] = value
    for i, value in {0: reference.year, 1: reference.timetuple().tm_yday,
                     2: reference.hour, 3: reference.minute, 4: reference.second,
                     5: reference.microsecond//1000, 6: 6, 9: len(data),
                     15: 1, 17: 11, 35: 1, 37: 1, 38: 0}.items():
        ints[i] = value
    word(0, station); word(8, event_id, 16); word(32, "O_synth")
    word(40, "P_synth"); word(48, "S_synth")
    word(136, "SYNTH"); word(160, channel); word(168, "XX")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(struct.pack("<70f40i", *floats, *ints) + chars +
                     struct.pack(f"<{len(data)}f", *data))


def pulse(t, frequency):
    """An asymmetric wave packet: broadband enough to distinguish nearby lags."""
    return (math.exp(-0.5*(t/0.23)**2) * math.sin(2*math.pi*frequency*t) +
            0.35*math.exp(-0.5*((t-0.43)/0.35)**2) * math.sin(2*math.pi*(frequency+2.3)*t))


def make_example(output):
    output = Path(output)
    signature = {"generator": "DDCorr synthetic v1", "seed": 419, "sample_rate_hz": 100,
                 "labels": ["17", "203", "8", "905", "44", "1201"]}
    if output.exists() and any(output.iterdir()):
        manifest = output / "manifest.json"
        if manifest.is_file():
            old = json.loads(manifest.read_text())
            if old.get("definition") == signature and all(
                (output/p).is_file() and hashlib.sha256((output/p).read_bytes()).hexdigest() == h
                for p, h in old["sha256"].items()):
                print(f"Verified existing synthetic example: {output}")
                return
        raise ValueError("Output is not an unchanged example; choose a new output directory.")
    output.mkdir(parents=True, exist_ok=True)
    rate, begin, npts = 100, -15.0, 4501
    base = dt.datetime(2020, 1, 1, tzinfo=dt.timezone.utc)
    rows = []
    for event_index, label in enumerate(signature["labels"]):
        signal_present = label != "905"  # A labelled noise-only control, never a real event.
        origin = base + dt.timedelta(seconds=60*event_index)
        for station_index in range(4):
            station = f"S{station_index+1:02d}"
            p = 4.0 + 0.36*station_index + (event_index-2)*0.027 + station_index*event_index*0.004
            s = 7.0 + 0.64*station_index + (event_index-2)*0.049 - station_index*event_index*0.003
            bias = (event_index-2)*0.045
            for phase, travel in [("P", p), ("S", s)]:
                rows.append({"original_id": label, "station": "XX."+station, "phase": phase,
                             "true_travel_time_s": travel, "supplied_pick_travel_time_s": travel+bias,
                             "signal_present": signal_present})
            for component, az, inc in [("Z", 0, 0), ("N", 0, 90), ("E", 90, 90)]:
                seed = 419 + 1000*event_index + 10*station_index + ord(component)
                rng = random.Random(seed)
                data = []
                for i in range(npts):
                    t = begin + i/rate
                    x = 0.045*rng.gauss(0, 1) + 0.0005*t
                    if signal_present:
                        x += (1.8 if component == "Z" else 0.5)*pulse(t-p, 5.0+station_index*.35)
                        x += (0.5 if component == "Z" else 2.0)*pulse(t-s, 4.2+station_index*.25)
                    data.append(x)
                write_sac(output/"sac"/label/f"XX.{station}..HH{component}.sac", data,
                          origin=origin, begin=begin, rate=rate, event_id=label, station=station,
                          channel="HH"+component, p=p+bias, s=s+bias,
                          latitude=64.75+event_index*.0002, longitude=-16.9+event_index*.0002,
                          depth=6.0+event_index*.01, station_lat=64.70+station_index*.04,
                          station_lon=-16.97+station_index*.03, azimuth=az, inclination=inc)
    with (output/"truth_picks.csv").open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0])); writer.writeheader(); writer.writerows(rows)
    truth = {(r["original_id"], r["station"], r["phase"]): r for r in rows}
    with (output/"truth_pairs.csv").open("w", newline="") as f:
        writer = csv.writer(f); writer.writerow(["event_i_original_id", "event_j_original_id", "station", "phase", "dt_i_minus_j_s", "both_have_signal"])
        for first, second in itertools.combinations(sorted(signature["labels"]), 2):
            for station in sorted({r["station"] for r in rows}):
                for phase in ("P", "S"):
                    a, b = truth[first, station, phase], truth[second, station, phase]
                    writer.writerow([first, second, station, phase,
                                     a["true_travel_time_s"]-b["true_travel_time_s"],
                                     a["signal_present"] and b["signal_present"]])
    files = {str(p.relative_to(output)): hashlib.sha256(p.read_bytes()).hexdigest()
             for p in sorted(output.rglob("*")) if p.is_file()}
    (output/"manifest.json").write_text(json.dumps({"definition": signature,
        "description": "Synthetic signals with known differential travel times; 905 is a noise-only control. No real observations.",
        "sha256": files}, indent=2)+"\n")
    print(f"Created 6 synthetic event folders, 72 SAC traces: {output}/sac")
    print("905 is a noise-only control; truth_pairs.csv uses travel_time_i - travel_time_j.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("examples/synthetic"))
    make_example(parser.parse_args().output)
