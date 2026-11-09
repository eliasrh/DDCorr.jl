# Windows PowerShell commands

Run these commands from the extracted `DDCorr.jl` folder. Install Julia 1.12.3 from https://julialang.org/downloads/ and Python 3.12 from https://www.python.org/downloads/ first. These PowerShell forms are documented; this revision was executed on macOS, not Windows.

## Synthetic example

```powershell
julia --version
julia --project=. -e 'using Pkg; Pkg.instantiate()'
py -3.12 scripts/make_synthetic.py --output examples/synthetic
julia --project=. bin/ddcorr.jl DDCorr.toml --inspect
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml
```

Open the printed correlation result folder in Explorer, then open `report.html` in a browser. Edit the existing TOML sections in a plain-text editor, save, run the correlation command again and open the new report to see the effect.

## Archive tools

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-download.txt
.\.venv\Scripts\python.exe -c "import obspy; print(obspy.__version__)"
New-Item -ItemType Directory -Force work
```

Expect ObsPy 1.5.1. Download Data Set S1 from the Supporting Information at https://doi.org/10.1029/2018JB016010 and save the text as `work\S1.txt`. The `s1` parser accepts this specific published layout. These commands deliberately use the environment's Python executable every time.

```powershell
.\.venv\Scripts\python.exe scripts/prepare_tables.py s1 --input work/S1.txt --start 2014-08-23T12:00:00Z --end 2014-08-23T15:00:00Z --limit 5 --output work/tables
.\.venv\Scripts\python.exe scripts/prepare_tables.py stations --network Z7 --channels "HH?" --start 2014-08-23T11:59:00Z --end 2014-08-23T15:01:00Z --near-lat 64.85 --near-lon -16.85 --limit 3 --output work/tables
.\.venv\Scripts\python.exe scripts/download_sac.py --events work/tables/events.csv --stations-file work/tables/stations.csv --network Z7 --channels "HH?" --location=-- --pick-mode predicted --max-combinations 15 --total-mib 64 --output work/iceland_demo
```

Duplicate `DDCorr.toml` as `Iceland.toml`. In its existing `[input]` section set `sac_dir="work/iceland_demo/sac"`, `p_pick_header="a"`, `s_pick_header="t0"`. In `[plots]`, set `event_pairs=[]`, `original_event_pairs=[]`, `example_stations=[]`, `example_phases=["P","S"]`. Keep plotting enabled.

```powershell
julia --project=. bin/ddcorr.jl Iceland.toml --inspect
julia --project=. --threads=4 bin/ddcorr.jl Iceland.toml
```

For other commands in the slides, replace `.venv/bin/python` with `.\.venv\Scripts\python.exe` and use the complete single-line form from the written guide. Unix backslashes at line ends do not continue commands in PowerShell.
