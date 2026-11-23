# Running the workshop

## 1. Before class

Get `DDCorr_student_package.zip` and `Iceland100.zip` from the instructor. Extract both in the same parent folder. If you already have the DDCorr repository, that checkout can serve as the `DDCorr.jl` folder. If your unzip tool adds a wrapper folder, move the inner folder into the layout below.

```text
Workshop/
  DDCorr.jl/     Project.toml, bin/, teaching/
  Iceland100/    DDCorr.toml, sac/, prepare_run.jl, reference/, PREFLIGHT.txt, START.txt
```

Install Julia 1.12.3 for your platform. Open a terminal in `DDCorr.jl`, the folder containing `Project.toml`. Run these two commands in the terminal on macOS, Linux or Windows PowerShell.

```sh
julia --version
julia --project=. -e 'using Pkg; Pkg.instantiate(); using DDCorr'
```

The second command downloads and loads the Julia packages listed in the project. Allow time for the first compilation. Open **Iceland100/PREFLIGHT.txt** before class for the DDSync and GraphSplit installations. From the parent folder containing all three packages, run `julia --threads=2 Iceland100/preflight.jl` to check that they load. The 100-event correlation exercise uses Julia alone. Python is optional unless you plan to run the synthetic or live-download exercises. [Julia downloads](https://julialang.org/downloads/)

## 2. Friday • Look at a waveform and its arrival fields

Run this exact example from `DDCorr.jl`. It prints a readable SAC header and writes a waveform with both arrivals marked.

```sh
julia --project=. bin/sac_info.jl ../Iceland100/sac/S1_009900/Z7.HRIM..HHZ.sac --plot ../Iceland100/first_trace.png
```

Open `Iceland100/first_trace.png`. Find **A** and **T0** in the terminal table. Their text labels are **P_pred** and **S_pred**. The authors’ event table supplies the earthquake origins and locations. Our waveform preparation estimated when P and S would reach each station from the distance and assumed wave speed. DDCorr uses these times to place the windows it compares. SAC stores A, T0 and O in seconds from the same reference clock, so A − O gives seconds after the origin.

**Using your own SAC?** Run the same header command on several representative files. Find the numeric field for each phase and check its label with the data provider. In a copy of `DDCorr.toml`, edit the existing `[input]` section. Set `sac_dir` to the directory containing the event subfolders and set `p_pick_header` and `s_pick_header` to field names such as `t8` and `t9` if your files use those fields. Relative paths start in the folder holding that TOML. Select the P field carefully because the default S noise estimate uses data before P. To draw those same picks on a waveform, add `--p-header t8 --s-header t9` to the header command for that example. The viewer reads its markers from the command-line options.

## 3. Friday • Correlate the 100 events

```sh
julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/DDCorr.toml --inspect
julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/DDCorr.toml
```

The first command reads headers. Check for 100 valid events and 3,300 SAC files. The second calculates correlations and prints its result directory. Open **report.html in that correlate directory**. A fresh run with the class settings gives **2,412 P and 4,625 S measurements**. A pair can contribute separate measurements at multiple stations.

In the report, select a waveform figure. Compare the phase before and after the shift and check whether one peak stands out in the correlation curve. Look up the same station, phase and event IDs in `correlations.csv`. To request particular figures, edit `event_pairs`, `example_stations` and `example_phases` in `[plots]` of the same TOML. Save and repeat the second command. Each run prints its own output folder.

For the optional threshold exercise, copy `Iceland100/DDCorr.toml` to **Iceland100/Threshold.toml**. Set only `[P] min_cc = 0.90` there and rerun the second command with `../Iceland100/Threshold.toml`. Compare the new P and S counts. Preserve the baseline output directory printed by the original command for the downstream practical. [Worked answers](../teaching/SOLUTIONS.txt)

## 4. Saturday • Continue with DDSync and GraphSplit

Use the same baseline run’s `dt.cc`, `catalog.txt`, `stations.txt` and `event_id_map.csv` throughout. The integer event IDs identify the same earthquakes in all three programs. DDSync reconciles the pair measurements for one station and phase at a time. GraphSplit uses those relative arrival times at multiple stations and a velocity model to relocate the earthquakes.

If your latest DDCorr run is the baseline, the following commands start from the `DDCorr.jl` folder on either platform after the downstream setup in `Iceland100/START.txt`.

```sh
cd ../Iceland100
julia prepare_run.jl latest run
cd run
julia --threads=2 ../../DDSync/DDSyncJulia/run_ddsync.jl sync.toml
julia --project=../../GraphSplit.jl --threads=2 ../../GraphSplit.jl/run_graphsplit.jl DD.toml
```

If you ran a threshold experiment after the baseline, use the printed path to the baseline run in place of `latest`. To use the instructor’s baseline checkpoint even if you missed the correlation session, use `julia prepare_run.jl reference run` instead of the first preparation command. Open `sync_metrics.txt` for the synchronization results and `graphsplit_output/` for the relocated catalogue and diagnostics. To compare two runs, give each a separate new preparation folder.

## Optional • Download a few records yourself

From `DDCorr.jl`, install Python 3.12 and prepare the waveform reader. Use the same Python executable for all three commands on your platform. [Python downloads](https://www.python.org/downloads/)

**macOS or Linux**

```sh
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements-download.txt
.venv/bin/python scripts/download_example.py
```

**Windows PowerShell**

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-download.txt
.\.venv\Scripts\python.exe scripts/download_example.py
```

The script takes the first five events from the published subset and the three nearest eligible stations in the supplied channel table. It asks EarthScope for 25 seconds before to 70 seconds after each origin. It writes event folders under `work/iceland_small/sac` and prints a path to a real file you can inspect. Repeat the command to see the number of new bytes downloaded. An unchanged request reuses cached waveform and metadata files. The full 100-event classroom archive remains available if the live service is slow.

```sh
julia --project=. bin/ddcorr.jl examples/download/small.toml --inspect
julia --project=. --threads=2 bin/ddcorr.jl examples/download/small.toml
```

To recreate the larger **selection** using live archive coverage, append `--event-count 100 --station-count 12 --total-mib 512 --output work/iceland_large` to the Python download command. Inspect those results with `--sac-dir work/iceland_large/sac`. The shared cache reuses identical requests. A different metadata interval may require a new request.

### Where do the event IDs come from?

`examples/download/iceland100/events.csv` contains the 100 origins we selected from Data Set S1 of Ágústsdóttir et al. (2019). Each identifier preserves its row number in the original catalogue. `stations.csv` lists the station channels active at the time. The downloader supplies the station waveforms and metadata through the FDSN station and dataselect services. [Study and Data Set S1](https://doi.org/10.1029/2018JB016010)

To retrieve the full supplementary catalogue, run the following command from `DDCorr.jl`. In PowerShell replace `curl` with `curl.exe`. If the publisher declines a command-line request, the supplied event table already contains the full 100-event workshop selection.

```sh
curl --fail --location --create-dirs --output work/S1.txt "https://agupubs.onlinelibrary.wiley.com/doi/suppl/10.1029/2018JB016010/supinfo/jgrb53519-sup-0002-2018JB016010-Data_Set_SI-S01.txt"
```

To extract the 100 events from that download, run the next command with your environment’s Python. The importer writes `events.csv`. An empty `picks.csv` is expected because S1 describes event origins and magnitudes and supplies no station arrivals.

```sh
.venv/bin/python scripts/prepare_tables.py s1 --input work/S1.txt --start 2014-08-23T12:00:00Z --end 2014-08-23T15:00:00Z --limit 100 --output work/tables
```

The general commands are `scripts/prepare_tables.py MODE --help` for S1, QuakeML or service queries and `scripts/download_sac.py --help` for supplying picks, selecting another network or reading local miniSEED with StationXML. Run them with `.venv/bin/python` or `.\.venv\Scripts\python.exe`.

## Optional • Check the sign against a known signal

From `DDCorr.jl`, generate six synthetic event folders with `python3 scripts/make_synthetic.py` (PowerShell `py -3.12 scripts/make_synthetic.py`). Inspect and run:

```sh
julia --project=. bin/ddcorr.jl DDCorr.toml --inspect
julia --project=. --threads=2 bin/ddcorr.jl DDCorr.toml
```

Run the truth checker with the path printed by the second command, replacing `RESULT_FOLDER` below. In PowerShell use `py -3.12` for the Python command.

```sh
python3 scripts/check_synthetic.py --truth-dir examples/synthetic --run-dir "RESULT_FOLDER" --max-error-s 0.01 --require-noise-isolated
```

The script pairs each observation with the known travel-time difference by original event ID, station and phase. Read `passed` and `maximum_absolute_error_s`. For a deliberate header experiment, make a separate TOML copy, change one field, and compare its inspection output with that from the original file.
