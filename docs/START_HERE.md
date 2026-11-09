# Start here: from an unzipped folder to a report

Use Julia **1.12.3** for the class environment (the supplied Manifest was resolved on this version). The package declares Julia ≥1.10 compatibility; that is broader than the tested course environment. Install the appropriate 64-bit build for your CPU from [Julia's platform guide](https://julialang.org/downloads/platform/). macOS Apple Silicon and Ubuntu are tested; Windows commands below are provided but have not been executed on Windows.

Install Python **3.12** from [python.org](https://www.python.org/downloads/) for the optional archive tools. Confirm it with `python3.12 --version` on macOS/Linux or `py -3.12 --version` on Windows. The offline signal generator only uses Python's standard library; it needs no ObsPy installation. Python and Julia are separate programs. Installing Julia packages does not install Python packages.

## 1. Get a local copy

With repository access, use Git clone or GitHub's **Code → Download ZIP**. This repository is private: downloading its ZIP still needs access. A student without GitHub can instead receive the instructor's `DDCorr_student_package.zip`, unzip it, and enter the `DDCorr.jl` folder. That handout excludes the instructor solutions.

Open a terminal **in the extracted repository folder**, where `Project.toml` and `DDCorr.toml` are visible. Commands below are entered in the operating-system terminal, not at Julia's `julia>` prompt.

In `Project.toml`, you can read the Julia package names required to run DDCorr. In `Manifest.toml`, you can read the exact package versions used for this course. Keep both files. In `--project=.`, the dot means your current terminal folder. Julia then uses the package settings in this DDCorr.jl folder. The second command installs those package versions. The first run may take several minutes.

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

### If you are using your own SAC files: identify the pick fields first

Skip the signal-generation step above for an existing dataset. DDCorr expects one immediate subfolder per event under `sac_dir`, containing that event's SAC traces. **Do not assume the example's P=`A` and S=`T0` settings match your files.** SAC stores arrival times in numeric header fields, and archives choose different fields for P and S.

From the repository folder, list the headers of one of your SAC files. Replace the quoted path with an actual file, not an event directory; quotes preserve spaces in a path:

```sh
julia --project=. bin/sac_info.jl "/path/to/events/event_001/NET.STA..HHZ.sac"
```

No SAC application or Python installation is needed for this command. It reads the file without changing it. It lists **A and T0–T9**, their times, and the associated text labels **KA and KT0–KT9**. A time is in seconds from the SAC reference time, not necessarily from the start of the recording or from the event origin. `NaN` means the numeric field is undefined; `(undefined)` in the label column means no label is provided.

For illustration, an archive might store arrivals as follows. This is an example of how to read the output, not a required layout:

| Numeric field | Contents | Text-label field | Label supplied by the data author |
| --- | --- | --- | --- |
| A | Undefined | KA | Undefined |
| T0 | Undefined | KT0 | Undefined |
| T8 | P arrival time | KT8 | `P` |
| T9 | S arrival time | KT9 | `S` |

**The TOML needs the numeric field name (`t8`), not its label (`P`).** Label conventions vary: for example, a provider might use `Pm` for a manual P pick and `Pt` for a theoretical P prediction, but you must confirm that meaning with the provider. DDCorr does not automatically discover phases from labels or prefer manual arrivals over theoretical ones. If an archive uses different fields for manual and theoretical arrivals, choose deliberately which to use; the current settings select one field per phase for the entire dataset.

Edit the **existing** `[input]` section of `DDCorr.toml`; do not append a second `[input]` section. For the illustrative T8/T9 layout above:

```toml
[input]
sac_dir = "/path/to/events"
p_pick_header = "t8"
s_pick_header = "t9"
```

Use your own directory and field names for another dataset. The synthetic example uses `sac_dir = "examples/synthetic/sac"`, `p_pick_header = "a"`, and `s_pick_header = "t0"`. Paths in the TOML are relative to the TOML file; supplying `--sac-dir` changes the directory only, **not the pick fields**.

Inspect several events and stations, including vertical and horizontal components, to check that the same mapping applies. If labels are missing or unclear, ask the data provider which fields represent P and S; do not infer the phase just from a populated number. To view a raw waveform with your selected arrivals marked:

```sh
julia --project=. bin/sac_info.jl "/path/to/events/event_001/NET.STA..HHZ.sac" --p-header t8 --s-header t9 --plot work/one_sac.png
```

The viewer's `--p-header` and `--s-header` flags only choose its markers. **They do not update `DDCorr.toml`**, which you must edit separately. Likewise, the viewer does not read the TOML: without these flags its selected markers still use A/T0.

A missing arrival excludes that trace for the affected phase; it does not invalidate all other events. With the default noise-window settings, S processing also needs a P arrival to place the pre-P noise window. Theoretical arrivals can centre correlation windows, but correlation searches only within `max_lag_s` of the initial alignment; it does not automatically pick an unmarked phase. Missing picks are not filled by this workflow.

### Check the complete dataset with your chosen settings

```sh
julia --project=. bin/ddcorr.jl DDCorr.toml --inspect
```

`bin/ddcorr.jl` is the program. `DDCorr.toml` supplies settings. `--inspect` reads headers and checks required times and coverage. For the **synthetic example**, the expected message is **6 valid events** and **Inspection complete. No waveforms correlated.** Your own dataset will have a different event count. A valid event count confirms event metadata; it does **not** mean the P/S picks are populated or usable. Inspection does not yet evaluate signal-to-noise ratio (SNR).

The command prints an absolute directory ending in `results/inspect_YYYY-MM-DD_HHMMSS_mmm`. Open its `README.txt`, `event_id_map.csv`, `input_issues.csv` and `phase_readiness.csv` in a text editor or spreadsheet. A table with only a header has no issue rows.

- In `inventory.csv`, check `P_pick_s` and `S_pick_s`: these are the values read using your TOML mappings. All-`NaN` columns are a reason to check the mappings before correlating.
- In `phase_readiness.csv`, look for `ready` rows for the phases/stations you plan to use. Repeated `missing a pick` or `missing t0 pick` messages can mean that the configured fields are empty, even if another field contains the arrival. Other rows explain missing P noise anchors, sampling or window-coverage problems.
- Correct the settings and repeat `--inspect` before calculating. Inspection also checks station coordinate consistency across events. It is a preflight check, not a guarantee that later waveform processing will pass.

### Check source units and station locations

DDCorr assumes SAC EVDP is in kilometres by default and always exports catalogue depths in kilometres. Confirm your source convention. If EVDP is stored in metres, create an `advanced.toml` alongside your public TOML containing:

```toml
[input]
depth_unit = "m"
```

Then add this section to the public TOML (or edit it if it already exists):

```toml
[advanced]
file = "advanced.toml"
```

The conversion occurs in memory; source SAC files are never changed. This setting applies to the whole dataset. Mixed source units must be normalised explicitly before processing.

If a station code has coordinates that disagree beyond the configured tolerances, **DDCorr excludes that station from all events and both phases, warns you, and continues with the remaining stations**. This is the default `station_epoch_policy = "skip"`. It applies both across events and across components of an event. `station_exclusions.csv` records the station, reason, affected file/event counts and coordinate ranges. `station_epochs.csv` retains the individual source-file coordinates and marks the station as excluded. The report and run README highlight the exclusion. Events and their IDs remain in the catalogue, even if an event loses all usable stations and becomes isolated.

Check whether a conflict represents a real station move or incorrect metadata before restoring that station. For other behaviour, set `station_epoch_policy = "error"` to stop, or `station_epoch_policy = "split"` to explicitly treat recorded locations separately, under the **existing `[input]` section of the advanced TOML**. Do not increase the coordinate tolerance to hide a real move. These choices handle conflicting valid coordinates; malformed or missing required metadata still follow the separate `strict_headers` setting.

With `split`, DDCorr assigns separate output station codes to coordinate groups before correlation. It does not correlate across those groups. Codes use up to five characters of the original station name followed by a three-digit group number; the network code is retained. Group numbers identify recorded locations, not chronological epochs. `station_epochs.csv` maps each original file to its output station. Review and retain this file with the run. Different coordinates among components of the same event still require correction. Splitting accepts the supplied coordinates; it cannot establish whether those coordinates are correct.

If any stage fails, open `failure.txt` in the printed result directory. `run_info.toml` and `README.txt` record `failed`; partial exports from that directory must not be used for relocation. A failed run may have no `dt.cc` or figures even when some correlations were calculated. After resolving the error, rerun the command to create a new result directory.

To inspect the synthetic example's header and waveform with its A/T0 defaults:
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

`[P] band_hz = [2.0, 14.0]` chooses the P frequency band. In the actual file place the section heading on its own line. `window_s` defines the core waveform around its pick. `max_lag_s=0.5` searches from −0.5 to +0.5 seconds around the pick alignment. A peak outside this interval cannot be found, even if a smaller peak inside it passes QC. With uncertain initial picks, inspect a wider lag curve and competing peaks before accepting the timing. `min_cc=0.70` is the minimum signed correlation **coefficient r** (the option is called `min_cc`); it is not the squared weight in `dt.cc`.

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

## 9. Optional real-data download

After the synthetic exercise, follow [DATA_DISCOVERY.md](DATA_DISCOVERY.md) to obtain a published catalogue, station metadata and waveform snippets. Start with five events and three stations, then expand. The Python archive utilities need a separate installation of ObsPy. Every macOS/Linux archive command explicitly starts with `.venv/bin/python`. For PowerShell, use [WINDOWS.md](WINDOWS.md). Do not switch back to plain `python3` after installing ObsPy into `.venv`.

Use a separate `Iceland.toml` for the real data and clear the synthetic figure selections as described in that guide. The 100-event slide figures are reference results, not fixed counts for the small test.
