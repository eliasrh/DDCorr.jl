#!/usr/bin/env python3
"""Independently compare exported DDCorr differential times with synthetic truth.

Uses CSV and Python's standard library only. It does not import the correlator,
repeat its signal-processing implementation, or assume that output IDs equal
the original labels. Positive dt is travel_time_i - travel_time_j.
"""
import argparse
import csv
import json
import math
from pathlib import Path
import statistics
import sys


def rows(path):
    with Path(path).open(newline="") as handle:
        return list(csv.DictReader(handle))


def boolean(value):
    if value.lower() not in ("true", "false"):
        raise ValueError(f"Expected a truth boolean, got {value!r}")
    return value.lower() == "true"


def finite(value, field):
    number = float(value)
    if not math.isfinite(number):
        raise ValueError(f"Nonfinite {field}")
    return number


def summarize(errors):
    if not errors:
        return {"count": 0, "median_absolute_error_s": None,
                "maximum_absolute_error_s": None, "rms_error_s": None}
    return {"count": len(errors),
            "median_absolute_error_s": statistics.median(map(abs, errors)),
            "maximum_absolute_error_s": max(map(abs, errors)),
            "rms_error_s": math.sqrt(statistics.mean(x*x for x in errors))}


def check(truth_dir, run_dir, max_error_s=None, require_noise_isolated=False):
    truth_dir, run_dir = Path(truth_dir), Path(run_dir)
    if max_error_s is not None and (not math.isfinite(max_error_s) or max_error_s <= 0):
        raise ValueError("--max-error-s must be positive and finite")
    truth = {}
    for row in rows(truth_dir/"truth_pairs.csv"):
        a, b = row["event_i_original_id"], row["event_j_original_id"]
        if a == b:
            raise ValueError("Truth must not contain self-pairs")
        key = (a, b, row["station"], row["phase"])
        reverse = (b, a, row["station"], row["phase"])
        if key in truth:
            raise ValueError(f"Duplicate truth observation: {key}")
        value = finite(row["dt_i_minus_j_s"], "truth dt")
        present = boolean(row["both_have_signal"])
        truth[key] = (value, present)
        truth[reverse] = (-value, present)
    if not truth:
        raise ValueError("Empty timing truth")
    event_signals = {}
    for row in rows(truth_dir/"truth_picks.csv"):
        event_signals.setdefault(row["original_id"], []).append(boolean(row["signal_present"]))
    noise = sorted(label for label, flags in event_signals.items() if not any(flags))
    ids = {}
    for row in rows(run_dir/"event_id_map.csv"):
        identifier = int(row["event_id"])
        if identifier <= 0 or identifier in ids:
            raise ValueError("Output IDs must be unique positive integers")
        if row["original_event_id"] not in event_signals:
            raise ValueError(f"Output event is not in the supplied truth: {row['original_event_id']}")
        ids[identifier] = row["original_event_id"]
    if sorted(ids) != list(range(1, len(ids)+1)) or len(set(ids.values())) != len(ids):
        raise ValueError("ID map must contain contiguous 1,...,N and unique original IDs")
    accepted = rows(run_dir/"correlations.csv")
    if not accepted:
        raise ValueError("No accepted observations: timing recovery cannot be checked")
    seen, errors, phase_errors, noise_edges, nonsignal = set(), [], {}, [], []
    for row in accepted:
        i, j = int(row["event_i"]), int(row["event_j"])
        if i not in ids or j not in ids or i == j:
            raise ValueError("Correlation row uses missing or identical event IDs")
        a, b = ids[i], ids[j]
        key = (a, b, row["station"], row["phase"])
        canonical = (min(a, b), max(a, b), row["station"], row["phase"])
        if canonical in seen:
            raise ValueError(f"Duplicate accepted observation: {canonical}")
        seen.add(canonical)
        if key not in truth:
            raise ValueError(f"Accepted observation missing from truth: {key}")
        expected, both_have_signal = truth[key]
        measured = finite(row["dt_s"], "exported dt")
        error = measured-expected
        errors.append(error); phase_errors.setdefault(row["phase"], []).append(error)
        detail = {"event_i": i, "event_j": j, "original_i": a, "original_j": b,
                  "station": row["station"], "phase": row["phase"], "dt_s": measured,
                  "truth_dt_s": expected, "error_s": error}
        if a in noise or b in noise:
            noise_edges.append(detail)
        if not both_have_signal:
            nonsignal.append(detail)
    missing_noise = sorted(set(noise)-set(ids.values()))
    report = {"sign_convention": "travel_time_i - travel_time_j",
              "output_events": len(ids), "accepted_observations": len(accepted),
              "all": summarize(errors), "by_phase": {p: summarize(e) for p, e in sorted(phase_errors.items())},
              "noise_control_original_ids": noise, "missing_noise_controls": missing_noise,
              "noise_control_accepted_observations": noise_edges,
              "accepted_observations_without_two_true_signals": len(nonsignal),
              "criteria": {"max_error_s": max_error_s, "require_noise_isolated": require_noise_isolated},
              "failures": []}
    if max_error_s is not None and max(map(abs, errors)) > max_error_s:
        report["failures"].append(f"Maximum absolute timing error exceeds {max_error_s:g} s")
    if require_noise_isolated:
        if not noise:
            report["failures"].append("Truth contains no noise-only control")
        if missing_noise:
            report["failures"].append("Noise-only control is missing from the output catalogue")
        if noise_edges:
            report["failures"].append("Noise-only control has accepted observations")
    report["passed"] = not report["failures"]
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--truth-dir", type=Path, required=True, help="Directory containing truth_picks.csv and truth_pairs.csv")
    parser.add_argument("--run-dir", type=Path, required=True, help="One completed timestamped DDCorr output directory")
    parser.add_argument("--max-error-s", type=float, help="Optional maximum absolute error for every accepted observation, seconds")
    parser.add_argument("--require-noise-isolated", action="store_true", help="Require truth-labelled noise controls in the catalogue with zero accepted observations")
    parser.add_argument("--output", type=Path, help="Also save the JSON result to this file")
    args = parser.parse_args()
    try:
        report = check(args.truth_dir, args.run_dir, args.max_error_s, args.require_noise_isolated)
    except (ValueError, KeyError, FileNotFoundError) as error:
        print(f"Cannot validate: {error}", file=sys.stderr); return 2
    text = json.dumps(report, indent=2)+"\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True); args.output.write_text(text)
    print(text, end="")
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    sys.exit(main())
