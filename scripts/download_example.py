#!/usr/bin/env python3
"""Download five Bárðarbunga earthquakes at three Z7 stations into event SAC folders.

From DDCorr.jl use .venv/bin/python scripts/download_example.py on macOS/Linux.
In PowerShell use .\\.venv\\Scripts\\python.exe scripts/download_example.py.
The included event table is ordered by origin time; the station table is ordered
by distance to 64.85° N, 16.85° W. Use --help to change the size or destination.
"""
import argparse
import csv
from pathlib import Path
import sys
import tempfile

from download_sac import make_parser, run

TABLES = Path(__file__).resolve().parents[1] / "examples/download/iceland100"


def read_table(name):
    with (TABLES / name).open(encoding="utf-8", newline="") as stream:
        return list(csv.DictReader(stream))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--event-count", type=int, default=5, help="First N earthquakes by origin time, up to 100.")
    parser.add_argument("--station-count", type=int, default=3, help="First N stations by distance, up to 12.")
    parser.add_argument("--output", type=Path, default=Path("work/iceland_small"),
                        help="Folder for event SAC files and manifest. Choose a new folder for a different selection.")
    parser.add_argument("--cache-dir", type=Path, default=Path("work/download_cache"),
                        help="Folder that stores waveform requests and metadata for reuse.")
    parser.add_argument("--total-mib", type=float, default=64,
                        help="Maximum MiB of selected archive data, including cached bytes. Default 64.")
    args = parser.parse_args()
    events = sorted(read_table("events.csv"), key=lambda row: row["origin_utc"])
    channels = sorted(read_table("stations.csv"),
                      key=lambda row: (float(row["distance_to_selection_point_km"]), row["station"]))
    stations = list(dict.fromkeys(row["station"] for row in channels))
    for count, available, label in ((args.event_count, len(events), "event"), (args.station_count, len(stations), "station")):
        if not 1 <= count <= available:
            parser.error(f"--{label}-count must be between 1 and {available}")
    events = events[:args.event_count]
    stations = stations[:args.station_count]
    print(f"Selected {len(events)} earthquakes, {events[0]['event_id']} to {events[-1]['event_id']}, "
          f"at {', '.join(stations)}.", flush=True)

    with tempfile.TemporaryDirectory() as tmp:
        selection = Path(tmp) / "events.csv"
        with selection.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=list(events[0]))
            writer.writeheader()
            writer.writerows(events)
        download_options = make_parser().parse_args([
            "--events", str(selection), "--stations", ",".join(stations), "--network", "Z7",
            "--channels", "HH?", "--location=--", "--pick-mode", "predicted",
            "--max-combinations", str(len(events) * len(stations)), "--total-mib", str(args.total_mib),
            "--output", str(args.output), "--cache-dir", str(args.cache_dir),
        ])
        manifest = run(download_options)
    print(f"Downloaded {manifest['downloaded_bytes_this_run']:,} new bytes on this run.")
    print(f"One file to inspect: {args.output / manifest['sac_files'][0]['path']}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, RuntimeError) as error:
        sys.exit(f"Download failed: {error}")
