# Find events, stations and phase information before downloading

DDCorr starts with event-centred waveforms and phase-window centres. It does not discover earthquakes in continuous data. A SAC file combines waveform samples with a **header**: labelled metadata fields stored at the beginning of the binary file. Opening it in a text editor will not expose those fields usefully. Use `bin/sac_info.jl`.

Three sources answer different questions:

| Question | Source | Result |
|---|---|---|
| When and where did an event occur? | Regional published catalogue or FDSN event service | Origin UTC, coordinates, depth, event identifier |
| What sensor recorded there? | EarthScope FDSN **station** service | StationXML: network/station/location/channel, coordinates, orientation, operating epochs |
| What did that channel record? | EarthScope FDSN **dataselect** service | Time series in miniSEED |

Use [EarthScope's service index](https://service.earthscope.org/) to find documentation, not an invented server name. The former IRIS endpoint redirects to EarthScope. Its [waveform service](https://service.earthscope.org/fdsnws/dataselect/docs/1/) currently supplies miniSEED, so our optional **`scripts/download_sac.py`** downloads miniSEED plus StationXML and uses ObsPy to construct SAC. It does not download synthetic files.

## Isolate the optional Python tools

Use Python 3.12. On macOS/Linux:
```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-download.txt
.venv/bin/python scripts/prepare_tables.py --help
```
On Windows PowerShell:
```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-download.txt
.\.venv\Scripts\python.exe scripts/prepare_tables.py --help
```

`-m venv` creates a project-local environment. `-m pip` invokes the installer belonging to that exact Python. `-r` reads the requirements file, which pins **ObsPy 1.5.1**; pip also installs its numerical dependencies such as NumPy and SciPy. This leaves your other ObsPy environments alone. We use the environment's executable directly, so no shell activation or PowerShell execution-policy change is needed. [Python's venv documentation](https://docs.python.org/3/library/venv.html) explains the platform differences. On some Linux installations, the operating-system Python venv package must first be installed. Recreate `.venv` on each computer; do not copy one between operating systems.

Below, `python` means the appropriate `.venv` executable above. Commands are single lines so they work without shell-specific continuation characters.

## Route A: a regional published catalogue

For the dense Bárðarbunga swarm, obtain **Data Set S1** from the Supporting Information for [Ágústsdóttir et al., DOI 10.1029/2018JB016010](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018JB016010), or use the instructor-provided copy of that file. Save it as `work/S1.txt`. The importer is explicitly for this headerless format; do not feed it an unrelated catalogue.

```sh
python scripts/prepare_tables.py s1 --input work/S1.txt --start 2014-08-23T12:00:00Z --end 2014-08-23T15:00:00Z --limit 100 --output work/tables
```

This produces `work/tables/events.csv`, an empty `picks.csv` header, and `events_receipt.json`. The selected events are the first 100 in chronological order inside the half-open interval [start,end). They were not selected for good correlations. `S1_009900` means source line 9900; S1 has no original unique-ID column. The receipt records the source checksum and selection. Depth is interpreted as kilometres, times as UTC. The unused seventh source column is not silently reinterpreted. Rounded `:60.000` seconds carry into the next minute.

## Route B: discover an event service

For another region, start with [USGS earthquake search](https://earthquake.usgs.gov/earthquakes/search/) or the regional network's catalogue. Find a time/area selection with enough events; a global catalogue may omit the small swarm earthquakes of interest. Look for an FDSN event service or downloadable QuakeML.

Example event-service selection (adapt the bounds to your scientific question):
```sh
python scripts/prepare_tables.py events --service https://earthquake.usgs.gov --start 2014-08-23T00:00:00Z --end 2014-08-24T00:00:00Z --min-lat 64 --max-lat 66 --min-lon -18 --max-lon -16 --limit 100 --output work/usgs_tables
```

This requests at most 100 events; it cannot guarantee that many exist. The receipt stores the exact query URL. Raw XML is kept in the hash-verified `work/table_cache`. To import QuakeML obtained elsewhere:
```sh
python scripts/prepare_tables.py quakeml --input work/catalog.xml --start 2014-08-23T00:00:00Z --end 2014-08-24T00:00:00Z --limit 100 --output work/tables
```

The original event URI is retained in `events.csv`'s `source` column; generated safe folder labels appear in `event_id`. The preferred origin is used, falling back to the first origin if none is preferred. Review this choice when comparing catalogues.

## Where observed picks come from

A location catalogue is not necessarily a pick catalogue. Ask for analyst phase bulletins, the project's picker output, or QuakeML containing picks **and arrivals associated with the selected origin**. The importer exports explicit P/S arrivals and their source IDs when present. It does not manufacture an S arrival or silently resolve duplicate phase picks. USGS documents `includearrivals` as unimplemented; do not expect its event query to supply your phase table. See [the service documentation](https://earthquake.usgs.gov/fdsnws/event/1/).

`picks.csv` columns are `event_id,network,station,location,phase,arrival_utc,provenance`. Provenance means **where this time came from**: analyst/method, source pick ID and processing version if known. “Prediction” and “observed pick” are different claims. A header-only pick CSV means no observed picks were available.

You can explicitly choose `--pick-mode predicted` for a teaching demonstration. It uses straight-ray distance divided by `--vp` and `--vs` to centre windows. These are approximate model predictions, not measured arrivals and not the Cambridge velocity model. A bad prediction can miss the true phase or align a different signal. For scientific work, inspect and improve picks or use an appropriate travel-time model before interpreting dt.

## Find a network and channels, then choose stations

Use the station service documentation/query builder to inspect codes and operating dates. A code alone is not enough: temporary network codes can be reused in different years. A channel ID has **network.station.location.channel**; `--` in an FDSN query denotes blank location. `HH?` requests all matching three-letter HH channels; not every station has all three or the same sample rate.

For the course, query Z7 in August 2014, then choose 12 three-component stations nearest a declared point:
```sh
python scripts/prepare_tables.py stations --network Z7 --channels "HH?" --start 2014-08-23T11:59:00Z --end 2014-08-23T15:01:00Z --near-lat 64.85 --near-lon -16.85 --limit 12 --output work/tables
```

`stations.csv` lists channel codes, location, coordinates, orientation and sampling rates. Selection requires Z/N/E suffixes at a common location and metadata covering the whole interval. This example uses blank location; check your table before using another network. The receipt explains the selection. Metadata availability does not guarantee waveform availability.

An existing StationXML can be inspected without a download by adding `--input path/to/stations.xml`. If your instruments use `HH1/HH2`, change `--require-components Z,1,2` and check orientations. The downloader checks each channel epoch and sample rate again against the waveform.

## Download event snippets and create SAC

```sh
python scripts/download_sac.py --events work/tables/events.csv --stations-file work/tables/stations.csv --network Z7 --channels "HH?" --location=-- --pick-mode predicted --max-combinations 1200 --total-mib 256 --output work/iceland100
```

For observed picks, replace `--pick-mode predicted` with `--pick-mode observed --picks work/tables/picks.csv`. Network and location must agree with your selected table. Each snippet normally spans origin −25 s to +70 s. Increase `--before`/`--after` if phases or padding fall outside it. The 1,200 combination limit means 100 events ×12 stations, not 1,200 files: three components can yield up to 3,600 SAC files.

`--total-mib` bounds archive input bytes, including selected cached requests. It is not a bound on uncompressed SAC disk space. Requests are sequential. Identical repeat requests verify cached hashes and require no new waveform transfer. Changed requests are distinct, even if intervals overlap. Archive failures are reported; missing data become manifest entries.

The result is **`work/iceland100/manifest.json`** plus `work/iceland100/sac/<event_id>/*.sac`. The manifest names each request/source hash, generated SAC file, pick provenance, sampling, missing selection and byte count. It is a JSON text file, not Julia's `Manifest.toml`.

To reuse already downloaded local miniSEED, add BOTH options:
```sh
--waveform-dir path/to/archive --stationxml path/to/stations.xml
```
With both present, the converter makes no network request and reads one selected station's interval at a time. Local files must have `.mseed` extension. Gaps are rejected, not filled with made-up samples. The manifest lists local input hashes. Do not edit source code to switch between local reuse and remote download.

## Inspect, correlate, assess

```sh
julia --project=. bin/ddcorr.jl DDCorr.toml --sac-dir work/iceland100/sac --inspect
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml --sac-dir work/iceland100/sac
```

Open the printed `correlate_.../report.html`. Review weak and strong examples, lag peaks near boundaries, component SNR exclusions, matrix blocks and missing edges. High correlation does not certify phase identity or a true earthquake. Neither graph connectedness nor triangle closure independently establishes location accuracy.
