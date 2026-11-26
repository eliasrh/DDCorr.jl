#!/usr/bin/env python3
"""Package the student code, short guides, slides and report walkthrough.

From the repository folder run:
    python3 scripts/package_students.py --output ../DDCorr_student_package.zip

The code handout includes the completed Friday report. Share Iceland100.zip
alongside it for students who want to rerun the lab on the SAC recordings.
"""
import argparse
import hashlib
from pathlib import Path
import zipfile


def course_files(root):
    files = [root / name for name in (
        ".gitignore", "README.md", "Project.toml", "Manifest.toml", "DDCorr.toml",
        "requirements-download.txt", "docs/START_HERE.md", "docs/START_HERE.html", "docs/INPUTS_OUTPUTS.md", "docs/INPUTS_OUTPUTS.html",
        "teaching/DDCorr_minicourse.pptx", "teaching/SOLUTIONS.txt", "teaching/assets/method_stam_s_peak.png",
        "examples/download/iceland100/solutions/RESULTS.txt",
        "examples/download/iceland100/solutions/s_horizontal_components.csv",
    )]
    for pattern in ("bin/*.jl", "src/*.jl", "src/*.toml", "scripts/*.py", "test/*.jl",
                    "examples/*.toml", "examples/download/*.toml", "examples/download/*.csv",
                    "examples/download/*.json", "examples/download/iceland100/*.csv",
                    "examples/download/iceland100/*.json", "examples/download/iceland100/*.toml"):
        files.extend(root.glob(pattern))
    # Include the portable report and its linked figures and tables.
    report = root / "examples/download/iceland100/reference"
    formats = {".cc", ".csv", ".html", ".md", ".png", ".toml", ".txt"}
    files.extend(p for p in report.rglob("*")
                 if p.is_file() and p.suffix in formats and not p.name.startswith("."))
    missing = [p for p in files if not p.is_file()]
    if missing:
        raise ValueError("Missing student file: " + str(missing[0]))
    return sorted(files)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--output", type=Path, required=True, help="Destination ZIP file.")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    files = course_files(root)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    hashes = []
    archive_path = args.output.with_suffix(".zip.part")
    with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for source in files:
            rel = source.relative_to(root).as_posix()
            contents = source.read_bytes()
            archive.writestr("DDCorr.jl/" + rel, contents)
            hashes.append(hashlib.sha256(contents).hexdigest() + "  " + rel)
        archive.writestr("DDCorr.jl/PACKAGE_CONTENTS.sha256", "\n".join(hashes) + "\n")
    archive_path.replace(args.output)
    print(f"Created {args.output.resolve()} with {len(files)} student files.")


if __name__ == "__main__":
    main()
