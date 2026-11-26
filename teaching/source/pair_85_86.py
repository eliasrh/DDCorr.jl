"""Plot the two Iceland event cuts on a common UTC clock.

Usage: python teaching/source/pair_85_86.py ../Iceland100 teaching/assets/iceland_pair_85_86.png
"""
import argparse
import csv
import struct
from datetime import datetime, timedelta, timezone
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np


def recording(path):
    data = path.read_bytes()
    endian = "<" if struct.unpack_from("<i", data, 304)[0] == 6 else ">"
    floats = struct.unpack_from(endian + "70f", data)
    year, day, hour, minute, second, ms, version, _, _, count = struct.unpack_from(endian + "10i", data, 280)
    if version != 6:
        raise ValueError(f"This teaching example expects SAC version 6: {path}")
    ref = datetime(year, 1, 1, tzinfo=timezone.utc) + timedelta(
        days=day-1, hours=hour, minutes=minute, seconds=second, milliseconds=ms)
    samples = np.frombuffer(data, dtype=endian+"f4", count=count, offset=632)
    labels = [data[480:488].rstrip(b" \0"), data[488:496].rstrip(b" \0")]
    if labels != [b"P_pred", b"S_pred"]:
        raise ValueError(f"Unexpected phase labels in {path}: {labels}")
    return ref, floats, samples


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("iceland", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    reference = args.iceland / "reference"
    with (reference/"event_id_map.csv").open() as file:
        folders = {r["event_id"]: args.iceland/"sac"/r["original_event_id"] for r in csv.DictReader(file)}
    with (reference/"correlations.csv").open() as file:
        rows = {(r["station"], r["phase"]): float(r["cc_signed"]) for r in csv.DictReader(file)
                if (r["event_i"], r["event_j"]) == ("85", "86")}
    files = sorted(p.name for p in folders["85"].glob("*.sac"))
    if set(files) != {p.name for p in folders["86"].glob("*.sac")}:
        raise ValueError("The event cuts have different channel sets")
    overlap = {}
    for name in files:
        (ra, a, x), (rb, b, y) = [recording(folders[event]/name) for event in ("85", "86")]
        offset = ((rb-ra).total_seconds()+b[5]-a[5])/a[0]
        shift = round(offset)
        assert a[0] == b[0] and abs(offset-shift) < 1e-4 and 0 <= shift < len(x)
        n = min(len(x)-shift, len(y))
        overlap[name] = n, np.array_equal(x[shift:shift+n], y[:n])
    print(f"{len(files)} channels. Overlap (samples, all equal): {set(overlap.values())}")

    colors = ("#006E68", "#A64829")
    anchor = datetime(2014, 8, 23, 13, 32, 44, tzinfo=timezone.utc)
    fig, axes = plt.subplots(1, 2, figsize=(12.7, 4.05), sharey=True, layout="constrained")
    for ax, (station, channel, phase, field) in zip(axes, (("Z7.STAM", "HHE", "S", 10),
                                                          ("Z7.DYSA", "HHZ", "P", 8))):
        recordings = [recording(folders[event]/f"{station}..{channel}.sac") for event in ("85", "86")]
        marks = [(ref-anchor).total_seconds()+f[field] for ref,f,raw in recordings]
        left, right = marks[0]-0.8, marks[0]+2.3
        segments=[]
        for ref,f,raw in recordings:
            times=(ref-anchor).total_seconds()+f[5]+np.arange(len(raw))*f[0]
            cut=(times>=left)&(times<=right)
            segments.append((times[cut],raw[cut]))
        scale=max(np.max(np.abs(y)) for _,y in segments)
        for (t,y),mark,level,color in zip(segments,marks,(1.05,-1.05),colors):
            ax.plot(t,level+0.88*y/scale,color=color,lw=1.45)
            ax.vlines(mark,level-.92,level+.92,colors=color,linestyles="dashed",linewidth=1.7)
        ax.set_title(f'{station}  ·  {channel}  ·  {phase}       r = {rows[station,phase]:.3f}',loc="left",fontsize=17)
        ax.set(xlim=(left,right),ylim=(-2.05,2.05),xlabel="Seconds after 13:32:44 UTC",yticks=[-1.05,1.05],
               yticklabels=["Event 86","Event 85"])
        ax.tick_params(labelsize=12)
        ax.spines[["top","right","left"]].set_visible(False)
        ax.grid(axis="x",color="#D6DFDC",lw=.6)
        ax.set_axisbelow(True)
    fig.supxlabel("Dashed lines mark the predicted arrivals in the two SAC headers.",fontsize=14)
    fig.savefig(args.output,dpi=145,facecolor="white")
    plt.close(fig)


if __name__ == "__main__":
    main()
