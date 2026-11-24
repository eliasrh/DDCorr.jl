# Start here for the DDCorr lab

In this lab you will run DDCorr twice. The short synthetic run introduces the command. The second run uses 100 real earthquakes at Bárðarbunga. At 14:05 we will walk through the Iceland settings, figures and measurement files together. The open SAC clinic runs from 16:00 to 18:00.

## Before class

Get `DDCorr_student_package.zip` and `Iceland100.zip` from the instructor. Extract them into the same parent folder. If you use GitHub for the code, choose **Code → Download ZIP**, extract it and rename `DDCorr.jl-main` to `DDCorr.jl`. You can also use `git clone https://github.com/eliasrh/DDCorr.jl.git` with access to the private repository. The instructor supplies the Iceland recordings separately.

Your folders should look like this.

```text
Workshop/
  DDCorr.jl/
    Project.toml
    DDCorr.toml
    bin/
    scripts/
  Iceland100/
    DDCorr.toml
    sac/
    reference/
```

Install Julia 1.12.3 and Python 3.12. Open Terminal on macOS/Linux or PowerShell on Windows in the `DDCorr.jl` directory, the folder containing `Project.toml`. If you opened the terminal in `Workshop`, type `cd DDCorr.jl`. All the commands below run from this same directory. [Julia downloads](https://julialang.org/downloads/) · [Python downloads](https://www.python.org/downloads/)

Install the Julia dependencies once, while connected to the internet. Allow several minutes for this first setup. Both classroom runs then work offline.

```sh
julia --project=. -e "using Pkg; Pkg.instantiate(); using DDCorr"
```

## Synthetic data

**Before lunch.** Generate the example SAC recordings from the repository. Use the command for your system.

| macOS or Linux | Windows PowerShell |
|---|---|
| `python3 scripts/make_synthetic.py` | `py -3.12 scripts/make_synthetic.py` |

The generator writes one folder for each earthquake under `examples/synthetic/sac`. Inside a folder such as `44`, each SAC file contains one component at one station. For example, `XX.S01..HHZ.sac` contains the vertical component from station S01 in network XX.

Run DDCorr with the repository's `DDCorr.toml`. This command works on both platforms.

```sh
julia --project=. --threads=2 bin/ddcorr.jl DDCorr.toml
```

DDCorr prints the path to a new `results/correlate_…` directory. It contains its own `report.html` and measurement files. You will use the same command with a different settings file for the real data.

## Iceland data

**After lunch.** The supplied `Iceland100/sac` contains the real event cuts. Each of its 100 folders holds the available three-component records at eleven Z7 stations. The starting origins and magnitudes come from Data Set S1 of Ágústsdóttir et al. The example SAC files use predicted P and S times to centre the waveform windows. [Catalogue paper and supplement](https://doi.org/10.1029/2018JB016010) · [Z7 network](https://doi.org/10.7914/SN/Z7_2010)

Run the same program with **Iceland100/DDCorr.toml**. The path in this command selects the Iceland settings file. The `sac_dir = "sac"` line in that file points to `Iceland100/sac`.

```sh
julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/DDCorr.toml
```

Open **report.html** in the newly printed `Iceland100/results/correlate_…` directory. If your local run is still in progress, open **Iceland100/reference/report.html**. The reference folder contains the complete Iceland result, including its figures and tables.

**Return to the slides at 14:05 with the Iceland report open.** The guided lab is complete.

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

The **Near-identical arrival flags** link near the top of the Iceland report opens a table of flagged observations. The row for events 44 and 45 at Z7.RODG, S, corresponds to `example_09_Z7.RODG_S` under **Accepted pair examples**. The slides also show the two original cuts on a common UTC clock.

The [Iceland report walkthrough](../teaching/SOLUTIONS.txt) explains each figure, including its axes, colours and units, and follows a missing P observation through the output tables.

## Your own SAC files

**Open clinic, 16:00–18:00.** Bring your own event-cut SAC files and work through them with the instructor. You can use the supplied Iceland recordings for the same hands-on work, including trying a different band or selecting waveform examples. For a separate Iceland run, copy its TOML beside the original and run the copy. Its output will have a new timestamped directory.

For your own archive, keep the same directory layout, with a single folder for each earthquake. For example, place `MyData` beside `DDCorr.jl` and put the files in `MyData/sac/<original event ID>/`. Copy `Iceland100/DDCorr.toml` to `MyData/DDCorr.toml`. Its relative SAC and results paths will then refer to `MyData`.

To see the header of a recording, give the SAC viewer its path. This classroom example opens the exact file shown in the slides.

```sh
julia --project=. bin/sac_info.jl ../Iceland100/sac/S1_009992/Z7.DYSA..HHZ.sac
```

For your archive, replace the path with one of your own files. Giving the viewer `../MyData/sac` opens the first SAC file it finds. Look at the **Arrival fields** table. In the Iceland file, field A contains the numerical P arrival time and has the text label P_pred. Field T0 holds the S time and has label S_pred. Other producers may place these times in different fields. Inspect representative headers and use the provider's phase convention when assigning P and S.

In `MyData/DDCorr.toml`, set the existing `[input]` entries `p_pick_header` and `s_pick_header` to the numerical **field names** that hold your arrivals. For example, if P is in T8 and S in T9, use `p_pick_header = "t8"` and `s_pick_header = "t9"`. Set the P and S passbands and windows for your recordings. An inspection lists event metadata, component and phase-window availability before correlation.

```sh
julia --project=. bin/ddcorr.jl ../MyData/DDCorr.toml --inspect
julia --project=. --threads=2 bin/ddcorr.jl ../MyData/DDCorr.toml
```

Open the printed correlation report in `MyData/results`. If the expected station or phase is absent, the [inputs and outputs guide](INPUTS_OUTPUTS.md) describes the relevant tables.

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
