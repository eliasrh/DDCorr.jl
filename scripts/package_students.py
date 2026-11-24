#!/usr/bin/env python3
"""Package the student code, short guides, slides and report walkthrough.

From the repository folder run:
    python3 scripts/package_students.py --output ../DDCorr_student_package.zip

Share the separate Iceland100.zip alongside this handout. It contains the SAC
files and the DDCorr reference report for the Iceland practical.
"""
import argparse
import hashlib
from pathlib import Path
import zipfile


def course_files(root):
    files = [root / name for name in (
        ".gitignore", "README.md", "Project.toml", "Manifest.toml", "DDCorr.toml",
        "requirements-download.txt", "docs/START_HERE.md", "docs/INPUTS_OUTPUTS.md",
        "teaching/DDCorr_minicourse.pptx", "teaching/SOLUTIONS.txt",
    )]
    for pattern in ("bin/*.jl", "src/*.jl", "src/*.toml", "scripts/*.py", "test/*.jl",
                    "examples/*.toml", "examples/download/*.toml", "examples/download/*.csv",
                    "examples/download/*.json", "examples/download/iceland100/*.csv",
                    "examples/download/iceland100/*.json", "examples/download/iceland100/*.toml"):
        files.extend(root.glob(pattern))
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
