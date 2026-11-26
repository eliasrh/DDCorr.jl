# Start here for the DDCorr lab

Before the workshop, run the laptop check below. It installs the Julia packages and makes a small report using generated SAC files. During Friday’s lab we will use the Iceland100 recordings, then follow the individual measurements through the report. For an independent project, use the [DDCorr manual and complete TOML reference](INPUTS_OUTPUTS.md).

## Before class

**Download and extract the code.** On the [public DDCorr GitHub page](https://github.com/eliasrh/DDCorr.jl), choose **Code → Download ZIP**. On Windows choose **Extract All**, on macOS double-click the ZIP, and on Linux choose **Extract Here** in your file manager. Open the extracted folder that directly contains **Project.toml**, **bin** and **scripts**. You can put it anywhere you own, including a path with spaces. Keep it for the workshop. The instructor’s code ZIP works the same way.

**Install Julia and Python for your system.** The classroom environment uses Julia **1.12.3**. The installation check and the synthetic generator use ordinary Python 3 with its standard library. The optional EarthScope downloader later in this guide uses Python 3.12 with ObsPy. You can complete the laptop check without downloading any seismic data.

### Windows

1. Install Julia using the Windows link on the [official Julia installation page](https://julialang.org/install/). It installs the Juliaup version manager. Install Python 3 from [Python for Windows](https://www.python.org/downloads/windows/) if it is missing.
2. Open the extracted code folder in File Explorer. Click its address bar, type `powershell` and press Enter. A PowerShell prompt opens in that folder. Run `dir Project.toml` to confirm the location.
3. Run `py -3 --version`. It should print a Python 3 version. If your installer provides `python` instead, use `python --version` and substitute `python` for `py -3` below.

### macOS

1. If needed, install Julia with [Juliaup for macOS](https://julialang.org/install/). Look for the macOS/Linux command on that page and run it in Terminal. Install Python 3 from [Python for macOS](https://www.python.org/downloads/macos/) if `python3 --version` is unavailable.
2. Open a fresh Terminal window. Type `cd ` with a space, drag the extracted code folder from Finder into the window, and press Return. Run `ls Project.toml`, then `python3 --version`.

### Linux

1. If needed, install Julia using the Linux command on the [official Julia installation page](https://julialang.org/install/). Check `python3 --version`. If it is missing, install Python 3 using your distribution’s package manager (on Ubuntu or Debian, the package is `python3`).
2. Open a fresh terminal in the extracted code folder using the file manager’s **Open in Terminal**, or use `cd "/path/to/DDCorr.jl-main"` with your own path. Run `ls Project.toml`.

### Select Julia and check the laptop

Run `julia --version` in that same terminal. If it already prints `julia version 1.12.3`, continue to the installation check. With Juliaup, the following selects the workshop version for this folder. Your normal Julia default still applies in other projects. [Juliaup directory overrides](https://github.com/JuliaLang/juliaup#overrides)

```sh
juliaup add 1.12.3
juliaup override set 1.12.3
julia --version
```

While you have internet access, run **one** of the commands below. The first Julia setup downloads and compiles packages, including the graphics library. Allow time for this initial setup. Later runs reuse the installed packages.

| Windows PowerShell | macOS or Linux Terminal |
|---|---|
| `py -3 scripts/check_install.py` | `python3 scripts/check_install.py` |

Look for **DDCorr installation check passed**. Open the `report.html` path printed on the next line. You should see six synthetic events and their figures. The check has also verified P and S time differences against known values and a nonempty `dt.cc`. It writes to `work/install-check` under the code folder and can be repeated. Being able to see this report is enough preparation for Friday.

**If the check stops:** If `Project.toml` or `scripts/check_install.py` cannot be found, open the *inner extracted folder* containing both. If `julia` or Python cannot be found, finish its installation and open a new terminal. If you see `julia>`, type `exit()` to return to the ordinary terminal before pasting commands. If a download failed, reconnect to the internet and repeat the same check. For help, send the operating system, the command you ran and the first error shown above the final “Installation check stopped” message.

**The Iceland recordings for Friday.** The instructor supplies `Iceland100.zip` separately. Extract it beside the code folder. If you received the combined Friday package, extracting that one ZIP gives you both folders. The Iceland run needs Julia and the extracted data. The included `Iceland100/reference/report.html` can also be opened straight from your file manager.

```text
Workshop/
  DDCorr.jl/          (or DDCorr.jl-main)
    Project.toml
    bin/
    scripts/
  Iceland100/
    DDCorr.toml
    sac/
    reference/
```

In an extracted copy, double-click **docs → START_HERE.html** to follow this guide offline. Keep the terminal in the code folder for the commands below.

**Also attending Saturday?** The full GitHub download includes DDSync, GraphSplit and ready-made differential times. To check both stages before class, run the two lines below from the same code folder. They use the included Iceland measurements and a separate run named `laptop-check`. If you received separate Friday and Saturday ZIPs, use the [Saturday guide](https://github.com/eliasrh/DDCorr.jl/blob/main/teaching/saturday/START_HERE.md) in the Saturday folder.

```sh
julia --threads=2 teaching/saturday/workshop.jl sync --run laptop-check
julia --threads=2 teaching/saturday/workshop.jl relocate --run laptop-check
```

## Synthetic data

**Before lunch.** Generate the example recordings. Use the command for your system. This step uses only Python’s standard library.

| macOS or Linux | Windows PowerShell |
|---|---|
| `python3 scripts/make_synthetic.py` | `py -3 scripts/make_synthetic.py` |

If Windows installed Python as `python` and cannot find `py`, use `python scripts/make_synthetic.py`. If Python is unavailable during class, continue with the Iceland run below.

The generator writes one folder for each earthquake under `examples/synthetic/sac`. Inside a folder such as `44`, each SAC file contains one component at one station. For example, `XX.S01..HHZ.sac` contains the vertical component from station S01 in network XX.

Run DDCorr with the repository's `DDCorr.toml`. This command works on all three operating systems.

```sh
julia --project=. --threads=2 bin/ddcorr.jl DDCorr.toml
```

DDCorr prints the path to a new `results/correlate_…` directory. It contains its own `report.html` and measurement files. You will use the same command with a different settings file for the real data.

## Iceland data

**After lunch, keep the terminal in DDCorr.jl.** The supplied `Iceland100/sac` contains the real event cuts. Each of its 100 folders holds the available three-component records at eleven Z7 stations. The starting origins and magnitudes come from Data Set S1 of Ágústsdóttir et al. The example SAC files use predicted P and S times to centre the waveform windows. [Catalogue paper and supplement](https://doi.org/10.1029/2018JB016010) · [Z7 network](https://doi.org/10.7914/SN/Z7_2010)

Open **Iceland100 → DDCorr.toml**. Under `[output]`, Friday’s settings include `coefficient_lag = "fitted"`. If you have an earlier Iceland100 ZIP, copy **DDCorr.toml** from **DDCorr.jl → examples → download → iceland100** into the extracted **Iceland100** folder beside **sac** and replace the old settings file. You can reuse all the recordings. [Friday’s Iceland settings](../examples/download/iceland100/DDCorr.toml)

Run the same program with **Iceland100/DDCorr.toml**. The path in this command selects the Iceland settings file. The `sac_dir = "sac"` line in that file points to `Iceland100/sac`.

```sh
julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/DDCorr.toml
```

**Open the Iceland report.** When DDCorr finishes it prints an “Open in your browser” line. In Finder or File Explorer, open **Workshop → Iceland100 → results**, choose the `correlate_` folder whose date and time match the printed path, and double-click **report.html**. Windows may display the file as **report** with a browser icon. The Iceland report opens with **100 events**, **2,412 P observations** and **4,625 S observations**.

If you want to open the completed Friday report, double-click **DDCorr.jl → examples → download → iceland100 → reference → report.html** in the extracted GitHub download. The current instructor handout also includes it under **Iceland100 → reference**. Keep the report in its folder so its figures open. The fitted-weight report has 61 station–phase measurements in `near_identity.csv`.

**At 14:05, leave the Iceland report open and return to slide 25**, “The Iceland run uses its own settings and SAC directory.” The instructor will walk through the figures with the class.

## Reading the report

The instructor will use the real Iceland report for the plot walkthrough. The sections below follow the order in the browser.

| Section in report.html | Figures shown |
|---|---|
| Station/phase matrices (PNG) | Each station/phase image contains the signed coefficient, differential time and residual lag on event-by-event grids. |
| Quality and connectivity | Peak coefficients before and after acceptance, accepted lags, distinct event partners, observations by station, and pair outcomes. |
| Cycle consistency | P and S histograms of timing disagreement around three-event loops, plus a linked table for individual stations. |
| Filter audit | Configured P and S frequency responses above, spectra from real raw and filtered SAC traces below. |
| Accepted pair examples | Original phase-centred waveforms, the same traces after alignment, and correlation coefficient as a function of lag. |
| Files and conventions | Measurements in `correlations.csv` and `dt.cc`, their matching catalogue and stations, and the event ID map. |

**The P observation used in the slides.**

1. Under **Accepted pair examples**, expand `example_01_Z7.DYSA_P`. The upper panel shows events 93 and 97 with the time axis centred on each P marker. The middle panel shows their alignment after the measured shift. The lower panel shows the correlation coefficient at each sampled lag. At DYSA the highest sample is at +0.060 s. The fitted lag is +0.0586 s.
2. Under **Station/phase matrices (PNG)**, expand the Z7.DYSA P figure. The row and column numbers are integer event IDs. A coloured entry means that DDCorr retained a measurement for the pair.
3. In **Files and conventions**, the **Correlation audit** link opens `correlations.csv`. In a spreadsheet, filter for `station = Z7.DYSA`, `phase = P`, `event_i = 93` and `event_j = 97` to see the row behind the figure. The same section links to `dt.cc`, `catalog.txt`, `stations.txt` and `event_id_map.csv`. The ID map identifies the two input folders as `S1_009992` and `S1_009996`.

The DYSA P markers differ by +0.3558 s relative to the respective event origins. After the +0.0586 s lag correction, DDCorr writes +0.2972 s for event 93 minus event 97.

**Which coefficient goes into the weight?** Open `example_11_Z7.STAM_S` for events 85 and 86. The table lists all seven measurements for this pair. At FLUR S, `dt.cc` reads `Z7.FLUR 0.4612 0.995830 S`. The travel-time difference is 0.4612 s. The best 20 ms grid point gives r = 0.904098 at −240 ms. Shifting the filtered waveforms to the fitted lag of −232.55 ms gives r = 0.997913. The square of that value is the exported weight. All seven observations pass the 0.99 near-identity threshold. The Friday TOMLs select `coefficient_lag = "fitted"` under `[output]`. Older sampled-weight reports show 0.817394 at FLUR. Each run records the setting in `effective_config.toml`.

**What if the two S components disagree?** Expand an S example in the report. The table **S correlation on each shared horizontal** gives each channel’s preferred grid lag, its own peak coefficient, and its coefficient at the common lag. DDCorr checks signal-to-noise separately on each component in both events. It then tests the peak of the mean sampled curve. At STAM for events 28/45, east gives 0.673144 and north 0.726868 at zero lag. Their mean of 0.700006 passes the 0.70 cutoff. At DYSA for events 1/2, the horizontal grid peaks differ by 20 ms and the pair passes. The 1 ms consistency check compares the two input pick differences. DDCorr has no separate rejection threshold for the difference between the component coefficients or their preferred waveform lags. Slides 65–68 show the measurements.

The [Iceland report walkthrough](../teaching/SOLUTIONS.txt) explains each figure, including its axes, colours and units, and follows a missing P observation through the output tables.

## Your own SAC files

**Friday clinic, 16:00–18:00.** The same procedure works with any event-cut SAC archive. You can bring your own files or explore a different Iceland pair. DDCorr reads the original waveforms in place. Each correlation run writes to a new timestamped directory.

### Set up one event per folder

Create `MyData` beside the code directory. Copy the code folder’s `DDCorr.toml` to `MyData/DDCorr.toml`. In the copy’s existing `[input]` section, set `sac_dir = "sac"`. Under `[output]` set `directory = "results"`. Put each earthquake’s binary, evenly sampled records directly in its own folder. These names illustrate the layout.

```text
MyData/
  DDCorr.toml
  sac/
    earthquake_A/XX.STA..HHZ.sac
    earthquake_A/XX.STA..HHN.sac
    earthquake_B/XX.STA..HHZ.sac
    earthquake_B/XX.STA..HHN.sac
```

### Identify the phase times before choosing the settings

From the code directory, run the header viewer. Supplying a folder opens one example and prints its name. Supplying a file opens that exact recording.

```sh
julia --project=. bin/sac_info.jl ../MyData/sac
```

Look at **Arrival fields**. The numerical SAC slot such as **A**, **T0** or **T8** holds a time. Its label, for example `Pm` or `P_pred`, tells you how the producer described that time. Check a few stations, events and components. Confirm with the data provider whether the times are manual, automatic or predicted. Set the slot names in the existing `[input]` section. For example, use `p_pick_header = "t8"` and `s_pick_header = "t9"` only if those are your P and S fields throughout the archive. A missing marker prevents that recording from supplying that phase. By default both phases also need a P reference for the background window.

Check that the event origin, coordinates and station/channel identification are present. Confirm the event depth units and set `depth_unit = "m"` or `"km"` in `[input]`. P uses vertical components and S uses available horizontals. Both events need a compatible shared channel at the same station. To require both horizontals, set `min_components = 2` under `[S]`. The [manual](INPUTS_OUTPUTS.md) lists the header fields, units and station coordinate checks.

### Set the filter and windows for your recordings

Under `[P]` and `[S]`, choose the band in Hz, window before and after the phase marker, and maximum lag in seconds. Main-run values override the package defaults one key at a time. Put `filter_order = 6` under the existing `[P]` if you want to change the P filter order for this run. Choose a comparison rate at or below the original rate, with its upper filter corner below 0.45 times both rates.

The recording must reach back far enough for the background before P and extend beyond the comparison window by the allowed lag and filter padding. A narrow passband may make several successive waveform cycles look alike. In the report, inspect the separation between competing peaks as well as the winning coefficient.

### Inspect, correlate and trace a missing result

```sh
julia --project=. bin/ddcorr.jl ../MyData/DDCorr.toml --inspect
julia --project=. --threads=2 bin/ddcorr.jl ../MyData/DDCorr.toml
```

Open the `report.html` in the printed **correlate_…** directory. To trace a missing P or S, read `phase_readiness.csv` for marker, sampling and coverage checks, then `preprocessing_issues.csv` for individual recordings dropped before comparison. `correlations.csv` lists the accepted pairs with coefficients, components, lags and measured time differences. `group_summary.csv` gives pair decisions by station and phase. To audit a particular rejected pair on a new run, set `write_rejected_pairs = true` under `[output]`. For a missing whole station, check `station_exclusions.csv`. Read `effective_config.toml` to see the actual settings.

### Display a pair and keep the measurements

Choose an accepted pair from `correlations.csv`. In the **existing** `[plots]` section, set `event_pairs` using the integer IDs in `event_id_map.csv`, or set `original_event_pairs` using two folder labels. Use one form and leave the other list empty. For example, for the included Iceland data:

```toml
[plots]
enabled = true
examples = true
filters = true
event_pairs = [[85, 86]]
example_stations = ["Z7.STAM"]
example_phases = ["S"]
```

Rerun with your copied TOML. These settings select the station, phase and pair for the waveform example and restrict the filter spectrum to its first event and shared component. The selection table identifies the figures. For your own data substitute an accepted pair and station from your run. `[matrices] enabled = true` exports the sparse measurements by station and phase; add `plots = true` for heatmaps or `dense = true` for square CSVs within the size limits. Keep `dt.cc` with `catalog.txt`, `stations.txt` and `event_id_map.csv` for relocation.


## Optional archive download

For an example of how event SAC folders are made, the downloader requests five events at three stations from EarthScope and cuts the records around each origin. It puts the result in `work/iceland_small/sac`. This is separate from the two classroom runs, which use local data. Install the download dependencies and run the script with the same Python environment.

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

The example reads the supplied event and station tables in `examples/download/iceland100`. The cache in `work/download_cache` reuses completed matching requests. Run the same downloader again to resume an interrupted download. The supplied Iceland100 archive remains available if the data service is unavailable.
