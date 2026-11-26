#!/usr/bin/env python3
"""Run the workshop installation check using Julia and Python's standard library."""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from check_synthetic import check
from make_synthetic import make_example


def main():
    root = Path(__file__).resolve().parents[1]
    julia = shutil.which("julia")
    if not julia:
        raise RuntimeError("Julia was not found. Install Julia, open a new terminal and try julia --version.")
    command = [julia, "--startup-file=no", "--project=.", "--threads=2"]
    print("Installing or checking the Julia packages. First-time setup may take several minutes.", flush=True)
    subprocess.run(command + ["-e", "using Pkg; Pkg.instantiate(); using DDCorr"], cwd=root, check=True)
    parent = root / "work" / "install-check"
    parent.mkdir(parents=True, exist_ok=True)
    trial = Path(tempfile.mkdtemp(prefix="trial-", dir=parent))
    print(f"Writing the practice run in {trial}", flush=True)
    data = trial / "synthetic"
    make_example(data)
    config = trial / "run.toml"
    config.write_text('[input]\nsac_dir = "synthetic/sac"\n[output]\ndirectory = "results"\n'
                      '[plots]\nmax_examples = 2\n[runtime]\ncache_dir = "cache"\n', encoding="utf-8")
    cli = command + ["bin/ddcorr.jl", str(config)]
    subprocess.run(cli + ["--inspect"], cwd=root, check=True)
    subprocess.run(cli, cwd=root, check=True)
    result, = (trial / "results").glob("correlate_*")
    for name in ("dt.cc", "report.html", "summary.png"):
        artifact = result / name
        if not artifact.is_file() or not artifact.stat().st_size:
            raise RuntimeError(f"Expected output is missing or empty: {artifact}")
    truth = check(data, result, max_error_s=0.01, require_noise_isolated=True)
    if not truth["passed"] or any(not truth["by_phase"].get(p, {}).get("count") for p in ("P", "S")):
        raise RuntimeError(f"Synthetic P/S timing check failed: {truth['failures']}")
    print(f"DDCorr installation check passed. {truth['accepted_observations']} P and S measurements.")
    print(f"Open the report in your browser: {result / 'report.html'}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, RuntimeError, ValueError, subprocess.CalledProcessError) as error:
        print(f"Installation check stopped: {error}", file=sys.stderr)
        sys.exit(1)
