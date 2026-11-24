# Start here for the DDCorr practical

Keep the Friday slides open beside this guide. Start the commands when the slide **Open START HERE on GitHub** appears. The five lab headings below match the stops in the deck. Each command assumes your terminal is in the `DDCorr.jl` folder.

## Before class

1. Get **DDCorr_student_package.zip** and **Iceland100.zip** from the instructor. Extract them in the same parent folder. You can also get the code from GitHub using **Code → Download ZIP** or `git clone https://github.com/eliasrh/DDCorr.jl.git`. A private repository requires access. If the code ZIP expands to `DDCorr.jl-main`, rename that folder to `DDCorr.jl`. The instructor supplies the waveform archive separately.
2. Check the folder structure. Some extractors create an extra wrapper folder. You should see `Project.toml` directly inside the code directory and `sac` directly inside the data directory.

   ```text
   Workshop/
     DDCorr.jl/     Project.toml, DDCorr.toml, bin/, scripts/, teaching/
     Iceland100/    DDCorr.toml, sac/, reference/
   ```

3. Install **Julia 1.12.3** for the classroom configuration and **Python 3.12** for the synthetic and live-download exercises. Open Terminal on macOS/Linux or PowerShell on Windows, in the folder containing `Project.toml`. A terminal opened in `Workshop` can reach this folder with `cd DDCorr.jl`. [Julia downloads](https://julialang.org/downloads/) · [Python downloads](https://www.python.org/downloads/)
4. Run these two commands on either platform. The second installs and loads the Julia packages required by this project. Wait for the terminal prompt to return. Initial package installation needs an internet connection and initial compilation can take several minutes.

   ```sh
   julia --version
   julia --project=. -e 'using Pkg; Pkg.instantiate(); using DDCorr'
   ```

For offline teaching, finish the installation beforehand and bring both extracted folders. The synthetic generator uses Python's standard library. Lab B additionally uses ObsPy and a live archive. The 100-event practical in Labs C–D runs locally in Julia.

## Lab A

**Generate six synthetic events and check the sign against a known answer.** From `DDCorr.jl`, run the command for your platform.

| macOS or Linux | Windows PowerShell |
|---|---|
| `python3 scripts/make_synthetic.py` | `py -3.12 scripts/make_synthetic.py` |

Open `examples/synthetic/sac`. Five folders contain simulated P and S arrivals at four stations. The sixth event, named `905`, contains noise. The supplied markers have deliberate errors. The generator records the true travel-time differences in `examples/synthetic/truth_pairs.csv`. Return to **Inspect first, then measure the synthetic data** in the slides.

Run these commands on either platform.

```sh
julia --project=. bin/ddcorr.jl DDCorr.toml --inspect
julia --project=. --threads=2 bin/ddcorr.jl DDCorr.toml
```

The first command should find **6 valid events**. The second measures waveforms and prints a new `results/correlate_...` folder. Open its `report.html`; keep the terminal in `DDCorr.jl`. At XX.S01 P, integer IDs 1 and 2 map to folders 1201 and 17. Use the slides to calculate the expected sign.

**Check every observation.** Immediately after the completed synthetic run, paste the two lines for your platform. They select the latest timestamped synthetic result, then check each accepted differential time in `correlations.csv` against the generated truth. To check the export separately, open `dt.cc`, go to the header `# 1 2 0.0`, and find the XX.S01 P row for +0.1353 s.

**macOS or Linux**

```sh
syn=$(ls -dt results/correlate_* | head -1)
python3 scripts/check_synthetic.py --truth-dir examples/synthetic --run-dir "$syn" --max-error-s 0.001 --require-noise-isolated
```

**Windows PowerShell**

```powershell
$syn = (Get-ChildItem results/correlate_* -Directory | Sort-Object Name)[-1].FullName
py -3.12 scripts/check_synthetic.py --truth-dir examples/synthetic --run-dir "$syn" --max-error-s 0.001 --require-noise-isolated
```

**Return to the slides** at **Check every measured row against the generator**. Find `"passed": true`, 80 accepted observations, a maximum absolute error of about 0.0006 s and zero observations involving event 905. If the check fails, confirm that the selected folder is the completed six-event run and check these quantities individually.

## Lab B

**Download five real events from the archive.** The event IDs and origin times come from `examples/download/iceland100/events.csv`. The related `stations.csv` lists eligible Z7 channels and their distance from the classroom selection point. The example requests the first five events by origin time at the three nearest eligible stations, HRIM, TOHR and FLUR. It obtains metadata and waveforms from EarthScope, cuts 25 s before to 70 s after each origin, and writes SAC event folders. [Ágústsdóttir et al. and Data Set S1](https://doi.org/10.1029/2018JB016010)

Create a local Python environment, install the dependencies, verify that the same Python can import ObsPy, and use it for the download. The Julia installation in **Before class** handles the Julia side only.

**macOS or Linux**

```sh
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements-download.txt
.venv/bin/python -c "import obspy; print(obspy.__version__)"
.venv/bin/python scripts/download_example.py
```

**Windows PowerShell**

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-download.txt
.\.venv\Scripts\python.exe -c "import obspy; print(obspy.__version__)"
.\.venv\Scripts\python.exe scripts/download_example.py
```

Open one event folder under `work/iceland_small/sac`. A complete classroom request yielded 45 traces across five events. Archive coverage can vary. Run the final download command again: a completely cached, identical request prints **Downloaded 0 new bytes on this run**. `work/download_cache` holds the cached files for reuse. Check what DDCorr sees with these commands on either platform.

```sh
julia --project=. bin/sac_info.jl work/iceland_small/sac
julia --project=. bin/ddcorr.jl examples/download/small.toml --inspect
```

**Return to the slides** at **Download, then repeat the same request**. Identify an actual event ID, station and component. If the service is unavailable, continue with the supplied local `Iceland100/sac` in Lab C. To correlate just the five-event exercise later, run `julia --project=. --threads=2 bin/ddcorr.jl examples/download/small.toml`.

## Lab C

**Inspect and correlate the same 100 earthquakes as the rest of the class.** For this exercise, switch from the small live download to the supplied `Iceland100` folder. In the terminal, stay in `DDCorr.jl`.

1. **Read a real SAC header.** This exact file is included with the classroom archive. The command reads the file and writes a labelled waveform plot.

   ```sh
   julia --project=. bin/sac_info.jl ../Iceland100/sac/S1_009900/Z7.HRIM..HHZ.sac --plot ../Iceland100/first_trace.png
   ```

   Find A = 2.597578 s with label KA = P_pred and T0 = 4.452990 s with label KT0 = S_pred. O = 0 s is the event origin on the same reference clock. The source catalogue supplies the origin and event coordinates. The archive preparation calculated these two station arrivals using assumed speeds of 6.0 km/s for P and 3.5 km/s for S. Open `Iceland100/first_trace.png`.

2. **Inspect the whole archive.**

   ```sh
   julia --project=. bin/ddcorr.jl ../Iceland100/DDCorr.toml --inspect
   ```

   Open `phase_readiness.csv` in the printed `inspect_...` folder. Read the header and time-window checks. Expect 100 valid events and 3,300 records in `inventory.csv` (100 events × 11 stations × 3 components). Twelve stations were selected from metadata; STJA had no usable waveform cuts here. `event_id_map.csv` maps each original SAC folder to a sequential integer.

3. **Run DDCorr.**

   ```sh
   julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/DDCorr.toml
   ```

   Copy the printed `correlate_...` directory name into your notes and open its `report.html` in your browser. Each run creates a new folder below `Iceland100/results`. Paths named in the TOML are resolved relative to the TOML file. The instructor's completed baseline report is also available at `Iceland100/reference/report.html`.

**Return to the slides** at **Measure the 100 events and open your report**. Find the P and S counts. Explain how one event pair can contribute several observations.

## Lab D

**Investigate the field measurements and test one setting.**

1. **Find your way around the baseline.** In `correlations.csv`, locate events 1 and 2 at Z7.KVER P. Find `Z7.KVER -0.0035 0.639765 P` below the `# 1 2 0.0` header of `dt.cc`. The second entry is the estimated travel time of event 1 minus that of event 2 in seconds. The third is the weight, here the squared coefficient. The CSV also reports the signed coefficient and the correction between the two marker-centred windows.
2. **Identify measurements rejected before export.** In `group_summary.csv` locate Z7.DYSA P. Its 66 prepared events yield 2,145 possible pairs. What happened to 800, 1,307 and 38 of them? For an earlier exclusion at the waveform-preparation stage, consult `preprocessing_issues.csv`.
3. **Request two specific waveform examples.** Copy the baseline TOML alongside itself using the appropriate command. If you already have a Figures.toml that you edited, keep it and check its settings before running.

   | macOS or Linux | Windows PowerShell |
   |---|---|
   | `cp ../Iceland100/DDCorr.toml ../Iceland100/Figures.toml` | `Copy-Item ../Iceland100/DDCorr.toml ../Iceland100/Figures.toml` |

   In the **existing** `[plots]` section of `Iceland100/Figures.toml`, replace these four entries. Preserve the other settings and a single copy of each key.

   ```toml
   event_pairs = [[44, 45], [28, 45]]
   original_event_pairs = []
   example_stations = ["Z7.RODG", "Z7.STAM"]
   example_phases = ["S"]
   ```

   ```sh
   julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/Figures.toml
   ```

   Open the new report and `example_selection.csv`. Find **44/45 at Z7.RODG S** and **28/45 at Z7.STAM S**. For each, compare the waveforms before and after the shift and read the lag curve. Check the catalogue origin spacing and other stations. The baseline's automatic gallery samples weak, middle and strong accepted observations across the station and phase groups. Explicit selections make sure you see both requested examples.

4. **Read a matrix and a lag distribution.** In the report, open one station/phase matrix. `matrices/index.csv` lists the sparse data files and `matrices/matrix_plots.csv` lists the figure files. Identify one coloured cell. Find that station and phase in `correlations.csv`, placing the smaller event ID first. The displayed coefficient is mirrored across the diagonal. Reversing a pair reverses the signed lag and differential time. A grey cell has no accepted measurement. Group totals describe aggregate rejections. To record the exact reason for a tested pair, set `write_rejected_pairs = true` under `[output]` in `src/advanced.toml`, rerun, and inspect `rejected_pairs.csv`. Restore that switch afterward if you want smaller results. In the summary lag plot, identify which side represents event j later than i on marker-centred clocks.
5. **Change only the P correlation threshold.** Create a second copy of the original baseline under a new name.

   | macOS or Linux | Windows PowerShell |
   |---|---|
   | `cp ../Iceland100/DDCorr.toml ../Iceland100/Threshold.toml` | `Copy-Item ../Iceland100/DDCorr.toml ../Iceland100/Threshold.toml` |

   In **Iceland100/Threshold.toml**, change only the `min_cc` line in `[P]` from 0.70 to **0.90**. Keep `[S] min_cc` at 0.70. Predict what will happen to P support and S support. Then run:

   ```sh
   julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/Threshold.toml
   ```

   Open the new `report.html` and compare it with your baseline. The baseline gave 2,412 P and 4,625 S observations on 1,914 pairs. The change gives 233 P and 4,625 S on 1,260 pairs. Count the distinct event IDs appearing on either side of the accepted P rows to find how many events kept any P support.

**Return to the slides** at **How much P coverage did the stricter cut cost?** Bring one example of a defensible measurement and one that deserves further inspection. The next part of the lecture explains how DDCorr prepared these windows and evaluated their lag curves. [Worked answers, items 1–5](../teaching/SOLUTIONS.txt)

## Lab E

Choose one of the two exercises for the 16:50 practical.

### Option 1 · Test a different P band on Iceland100

Make a fresh copy of the original baseline.

| macOS or Linux | Windows PowerShell |
|---|---|
| `cp ../Iceland100/DDCorr.toml ../Iceland100/BandTest.toml` | `Copy-Item ../Iceland100/DDCorr.toml ../Iceland100/BandTest.toml` |

In **BandTest.toml**, replace only the `band_hz` line inside `[P]` with `band_hz = [4.0, 8.0]`. Leave both correlation thresholds at 0.70 and all S settings as in the baseline. From `DDCorr.jl`, run:

```sh
julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/BandTest.toml
```

Open `run_summary.toml` in the printed folder and compare the P and S counts with the baseline. Look up Z7.KVER P, events 13 and 27, in both `correlations.csv` files. Return to **The highest coefficient can belong to an ambiguous curve** to see why a pair can disappear even when its strongest peak gets higher. [Worked answer, item 6](../teaching/SOLUTIONS.txt)

### Option 2 · Try your own event-cut SAC files

 Create `MyData` beside `Iceland100` and `DDCorr.jl`. Place copies of your SAC files in `MyData/sac/<original event ID>/`, directly inside each event's folder. Start with a few events sharing stations; correlating an event pair requires both waveforms for the same station and phase.

1. Copy `Iceland100/DDCorr.toml` to `MyData/DDCorr.toml` using Finder or File Explorer. It already sets `[input] sac_dir = "sac"` and writes results below `MyData/results`. To point to an existing event-cut archive instead, set `sac_dir` to its path inside double quotes; on Windows, forward slashes work in a TOML path.
2. Inspect the first available header using the command below. Then run the same command with individual SAC filenames from several stations and events. Check the reference clock, event origin, station and event coordinates, depth units, component and phase times. Confirm the meaning and source of each marker with the provider.

   ```sh
   julia --project=. bin/sac_info.jl ../MyData/sac
   ```

3. In `MyData/DDCorr.toml`, set the existing `p_pick_header` and `s_pick_header` to the numeric fields identified in your archive. For example, if T8 is P and T9 is S, use `p_pick_header = "t8"` and `s_pick_header = "t9"`. Labels such as `Pm` and `S_pred` describe the values for the reader. Add `--p-header t8 --s-header t9` to the SAC viewer for that example. The default S noise estimate requires a pre-P window too. See the input guide for timing, depth and resource settings. [Input requirements and diagnostics](INPUTS_OUTPUTS.md)
4. Inspect and correlate with the new TOML. Each run prints its directory.

   ```sh
   julia --project=. bin/ddcorr.jl ../MyData/DDCorr.toml --inspect
   julia --project=. --threads=2 bin/ddcorr.jl ../MyData/DDCorr.toml
   ```

   When measurements are missing, start with `input_issues.csv` and `station_exclusions.csv` for input conflicts, `phase_readiness.csv` for header or time-window problems, `preprocessing_issues.csv` for waveform rejections and `group_summary.csv` for pair outcomes. Confirm that the plotting switches are enabled and use the report from the completed correlate run.

**Return to the slides** at **Finish with a defensible measurement**. Name the two original events, station and phase, give the lag and differential time with their signs, and identify one feature that supports or weakens the alignment. If you have no personal dataset, use a different station or event pair from Iceland100.

### Files to keep

Keep `dt.cc`, `catalog.txt`, `stations.txt` and `event_id_map.csv` from the **same baseline correlation folder**. The map connects the integer IDs to the original event folders. Keep the baseline configuration and report with them. The supplied `Iceland100/START.txt` introduces the archive; `reference/report.html` inside that folder contains the baseline checkpoint. The Friday DDCorr practical ends here.

### Optional archive exercises

To recreate the 100-event selection from the archive, append `--event-count 100 --station-count 12 --total-mib 512 --output work/iceland_large` to the Lab B download command. Inspect it with `julia --project=. bin/ddcorr.jl examples/download/small.toml --sac-dir work/iceland_large/sac --inspect`. The shared cache reuses exact requests; different metadata intervals can require a new request. The full classroom archive is already supplied.

To obtain the original supplement, run the following from `DDCorr.jl`. In PowerShell replace `curl` with `curl.exe`. The supplied `examples/download/iceland100/events.csv` contains the full classroom selection if the publisher declines the request.

```sh
curl --fail --location --create-dirs --output work/S1.txt "https://agupubs.onlinelibrary.wiley.com/doi/suppl/10.1029/2018JB016010/supinfo/jgrb53519-sup-0002-2018JB016010-Data_Set_SI-S01.txt"
```

Extract those 100 origins from the supplement with the Lab B Python, substituting `.\.venv\Scripts\python.exe` in PowerShell.

```sh
.venv/bin/python scripts/prepare_tables.py s1 --input work/S1.txt --start 2014-08-23T12:00:00Z --end 2014-08-23T15:00:00Z --limit 100 --output work/tables
```

The importer writes `events.csv`. An empty `picks.csv` is expected for Data Set S1, which supplies event origins and magnitudes. The Iceland example adds its own predicted arrival fields. For other archived data, use `scripts/prepare_tables.py MODE --help` and `scripts/download_sac.py --help` with the environment Python. The latter can also cut local miniSEED using station metadata and an event table.
