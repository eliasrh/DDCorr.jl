# Start here for the DDCorr lab

In this lab you will run DDCorr twice. The short synthetic run introduces the command. The second run uses 100 real earthquakes at Bárðarbunga. At 14:05 we will walk through the Iceland settings, figures and measurement files together. The open SAC clinic runs from 16:00 to 18:00.

## Before class

You need **one copy of the DDCorr code** and **one Iceland100 data folder**. If you already downloaded the GitHub ZIP, you have the code. The instructor supplies `Iceland100.zip` separately.

1. Create a folder called `Workshop` wherever you keep your course files.
2. For the code, use **Code → Download ZIP** on the DDCorr GitHub page, or use the instructor’s `DDCorr_student_package.zip`. Both contain the files needed for the lab. GitHub requires access to the private repository.
3. Extract the code ZIP. On Windows, right-click the ZIP and choose **Extract All**. On macOS, double-click it. Find the extracted folder that directly contains `Project.toml`, `bin` and `scripts`. Place that folder in `Workshop` and name it `DDCorr.jl`.
4. Extract `Iceland100.zip` the same way. Place the folder that directly contains `sac`, `reference` and `DDCorr.toml` in `Workshop` and name it `Iceland100`. Some ZIP tools add an extra outer folder. The two folders below must sit side by side.

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

To read these directions in a browser from the extracted files, double-click **DDCorr.jl → docs → START_HERE.html**. Both the guide and the supplied Iceland report work offline.

Install **Julia 1.12.3** for DDCorr. The short synthetic example also uses **Python 3**. Python 3.12 is the version used for the separate optional archive downloader. If you already have the Iceland files, the Iceland run only requires Julia. [Julia downloads](https://julialang.org/downloads/) · [Python downloads](https://www.python.org/downloads/)

**Open a terminal in the code folder.** A terminal is the window where you paste the commands below.

- **Windows:** In File Explorer, open the extracted `DDCorr.jl` folder so you can see `Project.toml`. Click the address bar, type `powershell` and press Enter.
- **macOS:** In Finder, open `Workshop`, select the `DDCorr.jl` folder and use **Finder → Services → New Terminal at Folder**. You can also open Terminal, type `cd ` with a space, drag the folder from Finder into the window and press Return.
- **Linux:** In your file manager, open `DDCorr.jl` and use **Open in Terminal**. Alternatively, type `cd ` and the folder path in your terminal, placing quotes around a path containing spaces.

Keep this terminal in `DDCorr.jl` for both runs. Paste one command at a time and press Enter. If you see a `julia>` prompt, enter `exit()` to return to your terminal first.

**Install the Julia packages once.** Run this command before class while connected to the internet. Julia downloads the packages, then compiles them. On the rehearsal Mac, the new package folder used about 1 GB and setup took about six minutes. Other computers may take longer, and the output may pause. Continue when your terminal prompt returns. Both classroom runs can then work offline.

```sh
julia --project=. -e "using Pkg; Pkg.instantiate(); using DDCorr"
```

If the terminal says it cannot find `julia`, finish the Julia installation and open a new terminal in `DDCorr.jl`. If setup is still in progress when class reaches the Iceland report, you can join immediately by opening **Iceland100 → reference → report.html** in your file manager.

## Synthetic data

**Before lunch.** Generate the example recordings. Use the command for your system. This step uses only Python’s standard library.

| macOS or Linux | Windows PowerShell |
|---|---|
| `python3 scripts/make_synthetic.py` | `py -3 scripts/make_synthetic.py` |

If Windows installed Python as `python` and cannot find `py`, use `python scripts/make_synthetic.py`. If Python is unavailable during class, continue with the Iceland run below.

The generator writes one folder for each earthquake under `examples/synthetic/sac`. Inside a folder such as `44`, each SAC file contains one component at one station. For example, `XX.S01..HHZ.sac` contains the vertical component from station S01 in network XX.

Run DDCorr with the repository's `DDCorr.toml`. This command works on both platforms.

```sh
julia --project=. --threads=2 bin/ddcorr.jl DDCorr.toml
```

DDCorr prints the path to a new `results/correlate_…` directory. It contains its own `report.html` and measurement files. You will use the same command with a different settings file for the real data.

## Iceland data

**After lunch, keep the terminal in DDCorr.jl.** The supplied `Iceland100/sac` contains the real event cuts. Each of its 100 folders holds the available three-component records at eleven Z7 stations. The starting origins and magnitudes come from Data Set S1 of Ágústsdóttir et al. The example SAC files use predicted P and S times to centre the waveform windows. [Catalogue paper and supplement](https://doi.org/10.1029/2018JB016010) · [Z7 network](https://doi.org/10.7914/SN/Z7_2010)

Run the same program with **Iceland100/DDCorr.toml**. The path in this command selects the Iceland settings file. The `sac_dir = "sac"` line in that file points to `Iceland100/sac`.

```sh
julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/DDCorr.toml
```

**Open the Iceland report.** When DDCorr finishes it prints an “Open in your browser” line. In Finder or File Explorer, open **Workshop → Iceland100 → results**, choose the `correlate_` folder whose date and time match the printed path, and double-click **report.html**. Windows may display the file as **report** with a browser icon. The Iceland report opens with **100 events**, **2,412 P observations** and **4,625 S observations**.

If you cannot finish the run on your computer, double-click **Workshop → Iceland100 → reference → report.html**. It contains the same Iceland figures and measurement tables. Open the HTML in its extracted folder so its figure links work.

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
