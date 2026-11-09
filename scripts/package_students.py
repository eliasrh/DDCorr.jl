#!/usr/bin/env python3
"""Build the instructor's ZIP handout without solutions or local run data.

Run from a Git checkout. Students only extract the resulting ZIP; they do not
need Git, this packaging script, or access to the private GitHub repository.
"""
import argparse
import hashlib
from pathlib import Path
import subprocess
import zipfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    entries = subprocess.check_output(
        ["git", "ls-files", "--cached", "-z"],
        cwd=root,
    ).decode().split("\0")
    excluded = {".git", ".github", "work", "results", "node_modules", ".ddcorr_cache", "__pycache__"}
    files = []
    for entry in sorted(set(entries)):
        rel = Path(entry)
        source = root / rel
        if not entry or any(p in excluded or p.startswith(".venv") for p in rel.parts):
            continue
        if entry.startswith("teaching/instructor/") or not source.is_file() or source.is_symlink():
            continue
        if source.suffix in {".pyc", ".part", ".tmp", ".zip"}:
            continue
        files.append((entry, source))
    assert any(entry == "teaching/DDCorr_minicourse.pptx" for entry, _ in files)
    assert any(entry == "src/DDCorr.jl" for entry, _ in files)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    hashes = []
    with zipfile.ZipFile(args.output, "w", zipfile.ZIP_DEFLATED) as archive:
        for entry, source in files:
            data = source.read_bytes()
            # Keep the handout's link honest: solutions are distributed later.
            if entry == "teaching/README.md":
                data = data.decode().replace(
                    "The worked [instructor solution guide](instructor/INSTRUCTOR_SOLUTIONS.md) is separate and should be distributed after the exercise. The student ZIP excludes that directory.",
                    "The instructor solution guide is distributed separately after the exercise; it is not included in this student handout.",
                ).encode()
            archive.writestr("DDCorr.jl/" + entry, data)
            hashes.append(hashlib.sha256(data).hexdigest() + "  " + entry)
        archive.writestr("DDCorr.jl/PACKAGE_CONTENTS.sha256", "\n".join(hashes) + "\n")
        archive.writestr("DDCorr.jl/READ_ME_FIRST.txt",
                         "Open docs/START_HERE.md for installation and the first run.\n"
                         "Open teaching/DDCorr_minicourse.pptx for the course slides.\n"
                         "Instructor solutions and downloaded waveforms are not included.\n")
    print(f"Created {args.output.resolve()}: {len(files)} files, {args.output.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
