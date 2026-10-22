# Start here: from an unzipped folder to a report

Use Julia **1.12.3** for the class environment (the supplied Manifest was resolved on this version). The package declares Julia ≥1.10 compatibility; that is broader than the tested course environment. Install the appropriate 64-bit build for your CPU from [Julia's platform guide](https://julialang.org/downloads/platform/). macOS Apple Silicon and Ubuntu are tested; Windows commands below are provided but have not been executed on Windows.

Use Python **3.12** for the optional archive tools. The offline signal generator only uses Python's standard library; it needs no ObsPy installation. Python and Julia are separate programs. Installing Julia packages does not install Python packages.

## 1. Get a local copy

With repository access, use Git clone or GitHub's **Code → Download ZIP**. This repository is private: downloading its ZIP still needs access. A student without GitHub can instead receive the instructor's `DDCorr_student_package.zip`, unzip it, and enter the `DDCorr.jl` folder. That handout excludes the instructor solutions.

Open a terminal **in the extracted repository folder**, where `Project.toml` and `DDCorr.toml` are visible. Commands below are entered in the operating-system terminal, not at Julia's `julia>` prompt.

`Project.toml` names DDCorr and its dependencies. `Manifest.toml` records the exact resolved dependency versions for the class. Keep both. `--project=.` means “use the Julia project in this current folder”; `Pkg.instantiate()` installs the versions recorded there. It does not replace your other Julia projects. Packages may share a download cache under your home directory.

```sh
julia --version
julia --project=. -e 'using Pkg; Pkg.instantiate()'
```

The quotes above work in macOS/Linux shells and PowerShell. In Windows Command Prompt use double quotes around the Julia expression. First setup downloads dependencies and compiles code; allow several minutes. Subsequent runs reuse that work.

## 2. Create known signals

macOS/Linux:
```sh
python3 scripts/make_synthetic.py --output examples/synthetic
```
Windows PowerShell (Python launcher):
```powershell
py -3.12 scripts/make_synthetic.py --output examples/synthetic
```

`--output` chooses the generated example directory. Expect **6 event folders × 4 stations × 3 components = 72 SAC files** under `examples/synthetic/sac`. The script constructs pulses with known shifts and noise; folder `905` contains independent noise. The matching `truth_pairs.csv` is an answer key for timing, not input to the correlator. It does not download earthquakes. Repeating an unchanged generation verifies existing files; it does not silently overwrite changed files.

## 3. Inspect before calculating

```sh
julia --project=. bin/ddcorr.jl DDCorr.toml --inspect
```

`bin/ddcorr.jl` is the program. `DDCorr.toml` supplies settings. `--inspect` reads headers and checks required times and coverage. The expected message is **6 valid events** and **Inspection complete. No waveforms correlated.** That is success, not an error. It does not yet evaluate signal-to-noise ratio (SNR).

The command prints an absolute directory ending in `results/inspect_YYYY-MM-DD_HHMMSS_mmm`. Open its `README.txt`, `event_id_map.csv`, `input_issues.csv` and `phase_readiness.csv` in a text editor or spreadsheet. A table with only a header has no issue rows.

To see a SAC header and its waveform:
```sh
julia --project=. bin/sac_info.jl examples/synthetic/sac/1201/XX.S01..HHZ.sac --plot work/one_sac.png
```

## 4. Calculate and find your results

```sh
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml
```

This produces a separate `results/correlate_YYYY-MM-DD_HHMMSS_mmm` directory. The date/time is UTC, not a random ID. The inspection folder remains unchanged. Inside the new directory, **open `report.html` in a browser**. All figure files are PNG; no PDF/SVG files are generated.

The default synthetic example gives **80 accepted observations** and leaves the noise-only event isolated. An observation means one event pair at one station and one phase; it is not an extra event. Counts are checked by the synthetic verifier:
```sh
python3 scripts/check_synthetic.py --truth-dir examples/synthetic --run-dir results/correlate_YOUR_ACTUAL_FOLDER --max-error-s 0.01 --require-noise-isolated
```
Replace the run directory with the actual path printed by your command. On Windows use `py -3.12` instead of `python3`.

## 5. Read and edit TOML

TOML is a plain-text settings format. `[P]`, `[S]` and `[plots]` are section names: the lines below a heading belong to that section until the next heading. Text after `#` is a comment. Save as plain text, not a Word document.

`[P] band_hz = [2.0, 14.0]` chooses the P frequency band. In the actual file place the section heading on its own line. `window_s` defines the core waveform around its pick. `max_lag_s=0.5` searches from −0.5 to +0.5 seconds around the pick alignment. `min_cc=0.70` is the minimum signed correlation **coefficient r** (the option is called `min_cc`); it is not the squared weight in `dt.cc`.

Paths in the TOML are relative to that TOML. `--sac-dir PATH` overrides only the input path and is relative to your terminal's current directory. You do not need to edit source code to change input data or normal processing choices.

## 6. Make specific pair figures

Edit the existing `[plots]` section; do not add a second section with the same name:
```toml
[plots]
enabled = true
examples = true
max_examples = 12
event_pairs = [[1, 2], [2, 3]]
original_event_pairs = []
example_stations = ["XX.S01"]
example_phases = ["P", "S"]
```

These numbers are the **`event_id` column** in `event_id_map.csv`. They are not the original folders. With the synthetic example, 1→`1201`, 2→`17`, 3→`203`, 4→`44`, 5→`8`, 6→`905`. Folder names can contain letters: they are retained in `original_event_id` and assigned sequential integers in lexical folder order.

This selection gives four figures: two pairs × one station × two phases, if all observations pass the checks. `max_examples` caps **automatic** examples only. Explicit selections are all shown, with a separate advanced safety limit of 200 figures. Use `example_stations=[]` for all stations: this example then produces 16 figures, even with `max_examples=1`. Every example's title includes both integer IDs and original folder names. Read `example_selection.csv` if a requested pair has no accepted observations.

Alternatively set `event_pairs=[]` and `original_event_pairs=[["1201","17"]]`. Do not fill both lists. Re-run to create a new report. Automatic selection uses weak/middle/strong accepted coefficients per group and evenly samples the resulting ordered list if needed; it does not claim to show all problems.

## 7. Matrix pictures and numbers

```toml
[matrices]
enabled = true
plots = true
dense = true
max_plot_events = 500
max_plot_groups = 24
max_dense_events = 500
max_dense_cells = 2000000
```

Set these in the existing section. `enabled=true` exports sparse edge CSVs plus `matrices/index.csv`. `plots=true` adds PNG heatmaps to `report.html`; it does not require `dense=true`. `dense=true` **also** writes square coefficient/differential-time/lag CSVs. The dense limit counts three N×N matrices per station/phase. Grey pixels and `NA` are missing observations, including the uncomputed diagonal, not a zero correlation. `matrices/matrix_plots.csv` lists rendered or skipped groups.

## 8. Keep matching outputs together

Each run's `README.txt` describes the files it actually contains. For relocation, copy **that run's** `dt.cc`, `catalog.txt`, `stations.txt`, `event_id_map.csv` and settings together. Mixing a dt file with another run's catalogue can assign measurements to the wrong events. Keeping the complete result directory also preserves the diagnostic evidence and settings; it does not mean rerunning the directory.

Timing exports use four decimals (0.1 ms) by default. To change that representation, create `advanced.toml` with `[output]` and `dt_decimals=6`, then point `[advanced] file="advanced.toml"` in the public TOML. Extra digits do not create timing accuracy. Fractional-sample interpolation is distinct from both total search lag and export precision.
