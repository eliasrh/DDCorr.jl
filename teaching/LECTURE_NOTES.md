# DDCorr.jl lecture notes

The PowerPoint contains editable text, commands and tables; equations, scientific figures and source excerpts are PNG images with source included. Code excerpts are images of the exact source listed below.

# 1. DDCorr: from waveforms to relative times

A practical course: find data, prepare event SAC files, measure waveform shifts, and assess the results.

The objective is a defensible set of differential travel times for DDSync and GraphSplit.

Text, tables and commands are editable PowerPoint objects. Scientific figures, rendered equations and exact source excerpts are PNG images. Figure-generation and equation source are included. Instructor solutions are distributed separately.

---

# 2. An earthquake location from individual arrivals



Illustrative teaching schematic with editable shapes. Example times on slide 4 are constructed to demonstrate cancellation of a shared error, not measured travel times.
To locate one earthquake, we estimate its origin time and position from P and S arrival times at several stations.
A velocity model gives the predicted travel time from a trial source to each station. We adjust the source until predicted and measured arrivals agree as well as possible.
Errors in the phase picks, station geometry and velocity model can spread events that actually occurred close together.

---

# 3. Why nearby events can be located more precisely



Illustrative teaching schematic with editable shapes. Example times on slide 4 are constructed to demonstrate cancellation of a shared error, not measured travel times.
Two nearby earthquakes often send the same phase along nearly the same path to a distant station. Much of the velocity-model error is therefore shared.
Subtracting the two travel times reduces that shared error. Cross-correlation can measure their relative waveform timing more precisely than picking each onset independently.
This advantage is strongest when sources are close relative to the station distance and the waveforms represent the same phase. It does not remove all model error.

---

# 4. A double difference at one station



Illustrative teaching schematic with editable shapes. Example times on slide 4 are constructed to demonstrate cancellation of a shared error, not measured travel times.
For an event pair at one station, a double difference is the measured travel-time difference minus the difference predicted by the velocity model.
The relocation problem combines many such differences to estimate changes in event positions and origin times. After linearization, these changes are found by solving a system of linear equations.
Good relative precision does not guarantee an accurate absolute position. Station coverage, reference constraints and the velocity model still matter.

---

# 5. DDCorr, DDSync and GraphSplit in this course



Illustrative teaching schematic with editable shapes. Example times on slide 4 are constructed to demonstrate cancellation of a shared error, not measured travel times.
In DDCorr, we prepare event waveforms and measure differential travel times for event pairs at each station and phase.
In DDSync, we use redundant measurements in each event graph to estimate consistent relative arrival times and identify contradictory edges.
In GraphSplit, we combine those timing constraints with stations and a velocity model to relocate events. This first course block ends with the DDCorr files needed for those later steps.

---

# 6. What does the correlator measure?

We compare two events recorded on the same station and component, around the same phase.

The coefficient r measures similarity of shape. The lag is the time shift that gives the best similarity within a specified search interval.

The output combines that lag with the two picks and catalogue origins to estimate a differential travel time. It does not detect events in continuous data.



---

# 7. The sign of a correlation lag

Each trace has its own pick at time zero. A stays fixed; B is sampled later and displayed shifted left.

These are constructed pulses with a known +0.18 s delay. Their absolute event dates need not be close. The plot demonstrates the display convention B(t+lag), not a change to SAC origin times.

---

# 8. The route through this course

1. Run a controlled synthetic example and learn the files.

2. Prepare a small real-data download, then expand to a larger selection.

3. Run real correlations and read the diagnostic evidence.

4. Follow the processing and mathematics; then complete an independent data exercise.



---

# 9. Quick start with known signals

We start offline, where we know the correct time shifts. This separates installation problems from scientific interpretation.



---

# 10. Software and the course folder

Obtain DDCorr.jl from github.com/eliasrh/DDCorr.jl using Code > Download ZIP, or unzip the instructor handout. GitHub access is required while the repository is private.

Open a terminal and change into the extracted DDCorr.jl folder. Run pwd and ls on macOS/Linux. You should see DDCorr.toml, Project.toml, bin, scripts and teaching.

Install Julia 1.12.3 and Python 3.12 before class. Use the download links in the slide notes and docs/START_HERE.md. Enter the commands in your operating-system terminal. Windows alternatives are in docs/WINDOWS.md.

Choose the Julia binary for your CPU. The package declares Julia ≥1.10 compatibility, but the course Manifest and local verification use 1.12.3. Do not infer testing of every allowed version. Install Julia and Python before entering the commands.

Sources:
https://julialang.org/downloads/
https://www.python.org/downloads/

---

# 11. Installing the Julia packages

In Project.toml, you can read the list of Julia packages needed by DDCorr. In Manifest.toml, you can read the exact package versions used for this course.

The dot in --project=. means the current terminal directory. With this option, Julia uses the package settings in this DDCorr.jl folder.

The second command installs those package versions. Run it once before the first calculation and allow several minutes for installation and compilation.

```sh
julia --version
julia --project=. -e 'using Pkg; Pkg.instantiate()'
```



---

# 12. Generating waveforms with known timing

Run this command from the DDCorr.jl folder. It uses the included script to create artificial waveforms locally, with no earthquake download or extra Python packages.

You will find 72 SAC waveform files inside examples/synthetic/sac: six event folders, with four stations and three components per event.

You will also find truth_pairs.csv in examples/synthetic. It contains the known timing differences so that we can test the calculation.

```sh
python3 scripts/make_synthetic.py --output examples/synthetic
```



---

# 13. The generated directory structure

The display above is a directory example, not a terminal command. Each event folder contains its own station and component files.

There are six event folders in total. Event 905 contains independent noise. We expect it to have no accepted correlations. SAC is the format name, while sac is the lowercase directory name.

```sh
examples/synthetic/
  sac/1201/XX.S01..HHZ.sac
  sac/17/XX.S01..HHZ.sac
  sac/203/XX.S01..HHZ.sac
  truth_pairs.csv
```



---

# 14. Checking the inputs before correlation

DDCorr uses the settings in DDCorr.toml to check event and station metadata, the configured phase-pick fields, sampling rates and available time coverage.

These checks apply to any dataset. They test whether the inputs are usable, without requiring known event locations or a synthetic answer key.

For this generated dataset, expect “6 valid events” and “Inspection complete.” At this point, you have only an inspect_… result folder. No correlations have been calculated.

```sh
julia --project=. bin/ddcorr.jl DDCorr.toml --inspect
```



---

# 15. Reading the inspection results

The terminal prints the full path of results/inspect_YYYY-MM-DD_HHMMSS_mmm. Open that folder in your file browser. Its suffix is the UTC time of this run.

In inventory.csv, inspect the P_pick_s and S_pick_s columns. In phase_readiness.csv, check which traces have the selected picks and enough waveform coverage.

In input_issues.csv, read any metadata errors. A file containing only column headings has no issue rows. Inspection does not yet test filtered signal strength.



---

# 16. Calculating the correlations

Now run the correlation command above. DDCorr creates a new results/correlate_… folder. The earlier inspect_… folder remains available.

For the unchanged synthetic settings, expect 80 accepted observations. Each observation is one event pair at one station and phase.

Open report.html in this new correlate_… folder. DDCorr produces this report for synthetic and real datasets when plotting is enabled and the run completes.

```sh
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml
```



---

# 17. Reviewing the first report

In report.html, examine summary.png and the waveform examples. Compare the traces before and after the measured shift, then check the correlation peak.

The summary includes coefficient and lag distributions, support from stations and phases, and isolated events. Event 905 should be isolated.

Open the numerical files in the same result folder next. Keep this folder together so that the report, event indices and differential times refer to the same run.



---

# 18. Reading one differential-time observation

This is an actual excerpt from the synthetic dt.cc file, not a command. The header identifies events 1 and 2. The final header value is the origin-correction field, set to zero.

The observation gives the station XX.S01, differential time +0.1353 seconds, weight 0.969757 and phase P. Positive dt means the travel time for event 1 exceeds that for event 2.

The default weight is the squared correlation coefficient. The differential time also includes the pick-minus-origin times, so it is generally different from the correlation lag.

```sh
# 1 2 0.0
XX.S01        0.1353 0.969757 P
```



---

# 19. Reading the catalogue and station coordinates

In catalog.txt, each row contains one initial event origin time in UTC, latitude, longitude, depth in kilometres and the integer event index.

In stations.txt, each row contains a station code, latitude, longitude and elevation in metres. These station codes are identical to the codes in dt.cc.

```sh
catalog.txt columns:
year month day hour minute second lat lon depth_km event_id

stations.txt example:
XX.S01 64.6999969 -16.9699993 0.000
```



---

# 20. Event names and sequential catalogue indices

For every dataset, DDCorr assigns catalogue indices 1 through N to valid event folders, using text-sorted folder names. This simplifies the transfer to DDSync and GraphSplit.

Open event_id_map.csv in either the inspect_… or correlate_… result folder. The event_id column is the new index. The original_event_id column is the input folder name.

For these synthetic inputs, index 1 corresponds to folder 1201, index 2 to 17 and index 3 to 203. Isolated events keep their indices. Adding event folders can change the assignment.



---

# 21. Where arrival picks come from

Inside each SAC file, numeric header fields store the arrival times. In the synthetic example, the P time is in A and the S time is in T0.

DDCorr reads the configured numeric fields. It does not determine arrival times from the filename. A file named XX.S01..HHZ.sac identifies a channel, but does not specify its P arrival.

Before processing your own data, use bin/sac_info.jl to inspect those fields and labels. Different archives may store arrivals in T8/T9 or other fields.



---

# 22. Changing the P settings in DDCorr.toml

Open DDCorr.toml in a plain-text editor and find the existing [P] section. These are the settings you will edit, rather than adding a second [P] section.

The comparison window runs from 0.5 seconds before the P pick to 2.0 seconds after it. The lag search covers corrections from −0.5 to +0.5 seconds. The minimum coefficient is 0.70.

```sh
[P]
band_hz = [2.0, 14.0]
window_s = [-0.5, 2.0]
max_lag_s = 0.5
min_cc = 0.70
```



---

# 23. An experiment with the correlation threshold

In DDCorr.toml, change only [P] min_cc from 0.70 to 0.90. Save the file and repeat the correlation command. Open report.html in the newly printed result folder.

Compare the P observation count, coefficient distribution and event connectivity with your first run. The S settings have not changed.

Restore [P] min_cc to 0.70 before continuing. The default report chooses representative accepted examples automatically. To examine a particular pair, use the next exercise.



---

# 24. Requesting specific event-pair figures

Edit these lines in the existing [plots] section of DDCorr.toml. The pair numbers are the event_id indices in this run’s event_id_map.csv.

Repeat the correlation command and open the new report.html. You should see four requested examples if both pairs pass for both phases at S01. Explicit pair requests override max_examples, which applies only to automatic selection.

```sh
[plots]
event_pairs = [[1, 2], [2, 3]]
original_event_pairs = []
example_stations = ["XX.S01"]
example_phases = ["P", "S"]
max_examples = 12
```



---

# 25. Requesting a figure by original event name

As an alternative, use the original folder names above. Repeat the correlation command and open the new report. In the requested correlation figure, the title includes indices 1/2 and folders 1201/17.

The selection is listed in example_selection.csv. Requested pairs still have to pass the measurement checks. Use specific examples to investigate unusually low or high coefficients and large lags.

```sh
[plots]
event_pairs = []
original_event_pairs = [["1201", "17"]]
example_stations = ["XX.S01"]
example_phases = ["P"]
```



---

# 26. Understanding the rejection counts

Open group_summary.csv in the correlation result folder. Each row describes one station, one phase and one status. The count is the number of pairs in that category.

For XX.S01 P in the unchanged synthetic run, files=6 and prepared_events=5: the noise trace failed preprocessing. The accepted count is 10, equal to all pairs among the five prepared events.

A low_cc count means the maximum coefficient was below min_cc. A boundary count means the winning sample was at a search edge. An ambiguous_peak count means a competing peak was too similar in height.



---

# 27. Finding why a trace or figure is missing

Read phase_readiness.csv for missing picks and insufficient time coverage. Read preprocessing_issues.csv for failed filtering, padding or signal-to-noise checks.

Read example_selection.csv when a requested figure is absent. Figure selection cannot force a rejected correlation to pass.

The complete file definitions are in docs/OUTPUTS_AND_HANDOFF.md and at the web address below.

https://github.com/eliasrh/DDCorr.jl/blob/main/docs/OUTPUTS_AND_HANDOFF.md
Reference: https://github.com/eliasrh/DDCorr.jl/blob/main/docs/OUTPUTS_AND_HANDOFF.md

Sources:
https://github.com/eliasrh/DDCorr.jl/blob/main/docs/OUTPUTS_AND_HANDOFF.md

---

# 28. Find real data and prepare SAC

Next we will choose real earthquakes, identify recording stations and download short waveform snippets. We will use an Iceland example first, then explain what changes for another study area.



---

# 29. The real-data example: Bárðarbunga, Iceland

During the 2014 rifting episode, earthquakes accompanied the lateral propagation of a magma intrusion. Ágústsdóttir and colleagues published a catalogue for this sequence.

We will start with five events after 12:00 UTC on 23 August 2014 and three nearby stations in temporary network Z7. This is a small download test before expanding the selection.

The catalogue gives event times and locations. We still need recording-channel metadata, waveforms and a deliberate choice of phase-window centres.


Reference: https://doi.org/10.1029/2018JB016010

Sources:
https://doi.org/10.1029/2018JB016010

---

# 30. The information needed to construct event SAC files

For each event, we need an identifier, origin time, latitude, longitude and depth. You can obtain these from a regional catalogue or an earthquake database.

For each recording channel, we need its network/station codes, position, orientation, sampling rate and operating dates. These are available as StationXML metadata.

We also need the recorded samples, usually supplied as miniSEED, and P/S times to centre the comparison windows. In scripts/download_sac.py, we combine this information into SAC files.



---

# 31. What an FDSN service is

FDSN is the International Federation of Digital Seismograph Networks. Its service standards let different data centres accept similar requests for earthquakes, stations or waveforms.

You make a request by opening an HTTPS address with search fields such as dates, coordinates and channel codes. The data centre returns a file.

An event request returns earthquake information. A station request returns instrument metadata. A dataselect request returns waveform samples. We use separate requests because these are different data products.


Reference: https://www.fdsn.org/webservices/

Sources:
https://www.fdsn.org/webservices/

---

# 32. Finding data for your own study area

Start with a catalogue that includes the event population you want to study. For small local events, ask the regional network or data provider. The USGS earthquake search is another starting point.

Record the catalogue source, time reference and depth units. Look for downloadable QuakeML, or a table with the event fields explained on the preceding slide.

Then find which stations recorded during that interval. At EarthScope, use the station query builder below. A station listed in metadata may still have waveform gaps.


Reference: https://service.earthscope.org/fdsnws/station/1/builder

Sources:
https://earthquake.usgs.gov/earthquakes/search/
https://service.earthscope.org/fdsnws/station/1/builder

---

# 33. EarthScope services and the included scripts

For this example, the recordings are hosted at EarthScope, formerly IRIS. You can inspect the service documentation at service.earthscope.org.

Use scripts/prepare_tables.py to prepare event and station CSV tables. Use scripts/download_sac.py to request miniSEED and metadata and write the event SAC files.

These are optional Python utilities. DDCorr itself runs in Julia after the SAC files exist. The following setup installs ObsPy, the Python library used to read and write seismic formats.


Reference: https://service.earthscope.org/

Sources:
https://service.earthscope.org/

---

# 34. Installing the optional Python tools: macOS/Linux

Run these commands from the DDCorr.jl folder using Python 3.12. The first creates .venv. The second installs ObsPy, NumPy, SciPy and other required Python packages there.

The third checks the installation. Expect 1.5.1. In every following archive command, use .venv/bin/python explicitly. A plain python3 command may use a different installation without ObsPy.

```sh
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements-download.txt
.venv/bin/python -c "import obspy; print(obspy.__version__)"
```



---

# 35. Windows and Python command paths

The download commands in the main slides use macOS/Linux paths. In Windows PowerShell, first create the environment with py -3.12 -m venv .venv.

For each subsequent Python command, replace .venv/bin/python with .\.venv\Scripts\python.exe. The complete single-line PowerShell commands are in docs/WINDOWS.md.

You do not need to activate the environment. By naming the executable explicitly, you select the Python installation containing ObsPy. If the import check fails, stop and fix installation before requesting data.



---

# 36. Obtaining the published catalogue

Open doi.org/10.1029/2018JB016010 in a browser. In Supporting Information, download Data Set S1, the text file whose name ends in Data_Set_SI-S01.txt.

The command above creates a work folder inside DDCorr.jl. Save the downloaded text file there as S1.txt. Check that the path is work/S1.txt, rather than work/S1.txt.txt.

This catalogue has no observed P/S pick table. If publisher access fails, ask the instructor for this same S1 text file before continuing.

```sh
mkdir -p work
```


Reference: https://doi.org/10.1029/2018JB016010

Sources:
https://doi.org/10.1029/2018JB016010

---

# 37. Reading the published catalogue format

This is one catalogue row, not a command. The first field is day of year, followed by UTC date/time, latitude, longitude, depth and two further fields.

The s1 option in scripts/prepare_tables.py is a parser written specifically for this published format. It reads depth in kilometres and magnitude from the last field. The seventh field is retained only in the original source file.

For a different catalogue format, first convert its documented columns to our events.csv layout, or use the QuakeML importer. The s1 parser is not a general text-catalogue reader.

```sh
#228 2014-08-16 03:54:41.750 64.6134 -17.3512 3.127 0.35250 1.670
```



---

# 38. Selecting five events for the first download

Copy the whole command, including .venv/bin/python. On macOS/Linux, each backslash continues the same command on the next line. Do not type spaces after it.

We select the first five events chronologically in this UTC interval. Open work/tables/events.csv and events_receipt.json to inspect the rows and source information. The empty picks.csv contains only headings.

```sh
.venv/bin/python scripts/prepare_tables.py s1 \
  --input work/S1.txt --start 2014-08-23T12:00:00Z \
  --end 2014-08-23T15:00:00Z --limit 5 --output work/tables
```



---

# 39. The event CSV and adaptation to another catalogue

In work/tables/events.csv, each row has event_id, origin_utc, latitude, longitude, depth_km, magnitude and source. The source field identifies where the event information came from.

Here, S1_009900 means line 9900 of the downloaded S1 file. We create a folder-safe label because this source has no unique event-ID field. This label is separate from the later DDCorr integer index.

For another study, prepare the same CSV columns with your own documented event IDs and UTC origins. You can also import QuakeML using prepare_tables.py quakeml.



---

# 40. Alternative: requesting a USGS event catalogue

This is an alternative to the S1 example. For another region, change the dates and coordinate bounds after checking coverage at earthquake.usgs.gov/earthquakes/search/.

The request returns up to 100 events as QuakeML. The files are written under work/usgs_tables. A global catalogue may omit small local events. Continue the Iceland exercise using work/tables.

```sh
.venv/bin/python scripts/prepare_tables.py events \
  --service https://earthquake.usgs.gov \
  --start 2014-08-23T00:00:00Z --end 2014-08-24T00:00:00Z \
  --min-lat 64 --max-lat 66 --min-lon -18 --max-lon -16 \
  --limit 100 --output work/usgs_tables
```

The event route requests QuakeML and records the URL. It uses the preferred origin or explicitly falls back to the first. Save an existing QuakeML catalogue and use prepare_tables.py quakeml --input FILE for a local import. The USGS event query is an illustrative alternative; the validated 100-event example uses regional S1.
Reference: https://earthquake.usgs.gov/fdsnws/event/1/

Sources:
https://earthquake.usgs.gov/fdsnws/event/1/

---

# 41. Where would a pick table come from?

Ask the data provider for phase bulletins or QuakeML containing arrival picks linked to the event origins. A location catalogue alone may have no phase information.

For observed picks, prepare picks.csv with event_id, network, station, location, phase, arrival_utc and provenance. For example, provenance can identify the analyst or automatic picker.

The QuakeML importer exports associated P/S arrivals when available. Review their source and phase names. With no observed arrivals, the pick CSV contains only headings.

The importer follows arrivals attached to the preferred/first origin and exports P/S phase names only. Multiple picks for the same event/network/station/location/phase require explicit resolution. “Observed” can be analyst or automatic, but the method and source must be documented. A header-only picks.csv is not a usable measured-pick table.
Reference: https://earthquake.usgs.gov/fdsnws/event/1/

Sources:
https://earthquake.usgs.gov/fdsnws/event/1/

---

# 42. How this example handles missing phase picks

For this teaching download, we explicitly choose --pick-mode predicted. The converter estimates straight-ray travel times using distance and constant P/S velocities to centre the windows.

These approximate times are labelled as predictions in the SAC headers and acquisition manifest. They are not the measured picks or velocity model used in the published catalogue.

Before scientific use, inspect the phase timing and use an appropriate model or measured picks. A correlation peak outside max_lag_s cannot be found, even if an unrelated peak inside the search passes.

The converter includes station elevation in straight-ray distance. This is a clearly labelled demonstration route, not a model-free picker. Use --pick-mode observed --picks FILE when measured picks are available. The core correlation engine does not claim predicted or observed SAC header values are correct merely because they exist.

---

# 43. Identify a complete recording channel

A complete channel name contains network.station.location.channel. For example, Z7.DYSA..HHZ has network Z7, station DYSA, a blank location code and vertical channel HHZ.

The network distinguishes groups of stations, and the location code distinguishes instruments or installations at one station. StationXML contains their coordinates and orientations for specific operating dates.

In a request, HH? matches channels beginning with HH. Quote the question mark so the terminal does not interpret it. A blank FDSN location is requested with --location=--.

In FDSN URL parameters, -- denotes blank location; pass --location=-- to avoid command-line parsing ambiguity. A trailing Z/N/E is a convention, not a substitute for orientation metadata. Some networks use 1/2 horizontal suffixes; select those deliberately and inspect azimuth/inclination.
Reference: https://service.earthscope.org/fdsnws/station/1/

Sources:
https://service.earthscope.org/fdsnws/station/1/

---

# 44. Choosing three nearby three-component stations

This requests station metadata from EarthScope and selects the three nearest eligible stations to the stated point. Each must have Z, N and E channels at a common location throughout the interval.

Open work/tables/stations.csv and stations_receipt.json. Check the channel codes, coordinates, sample rates and selection. For another region, change network, dates and selection point.

```sh
.venv/bin/python scripts/prepare_tables.py stations \
  --network Z7 --channels "HH?" --start 2014-08-23T11:59:00Z \
  --end 2014-08-23T15:01:00Z --near-lat 64.85 \
  --near-lon -16.85 --limit 3 --output work/tables
```



---

# 45. Downloading snippets and writing SAC files

Five events and three stations give at most 15 event–station selections and 45 SAC component files. Requests are sequential and limited to 64 MiB of archive input. Extracted SAC files can occupy more space.

The default snippet spans 25 seconds before to 70 seconds after each event origin. The converter adds event and station metadata and the explicitly predicted P/S times. Missing recordings are recorded as skipped selections.

```sh
.venv/bin/python scripts/download_sac.py \
  --events work/tables/events.csv --stations-file work/tables/stations.csv \
  --network Z7 --channels "HH?" --location=-- --pick-mode predicted \
  --max-combinations 15 --total-mib 64 --output work/iceland_demo
```



---

# 46. Checking the downloaded files

Open work/iceland_demo/manifest.json. This JSON text file contains request information, source hashes, SAC filenames, phase-time sources and missing selections.

The waveform files are in work/iceland_demo/sac/<event_id>/*.sac. Check the manifest file list before choosing a file to inspect. The number of files can be smaller than the requested maximum.

Repeat the identical download command to verify cache reuse. Identical requests reuse hash-checked inputs. Changed or merely overlapping requests can require new downloads.

An identical repeat verifies cached bytes and avoids another waveform download. A changed request is a different cache key, even if it overlaps in time. The current helper does not assemble arbitrary overlapping remote cache requests. Output definitions must match before an existing output directory is reused.

---

# 47. Reusing your own miniSEED archive

If you already have miniSEED and station metadata, add both --waveform-dir path/to/archive and --stationxml path/to/stations.xml to the download_sac.py command.

With both options, the converter reads local .mseed files and makes no archive requests. StationXML must cover the selected dates and channels. It records input hashes in manifest.json.

Choose bounded event intervals and check for missing or gapped recordings. The converter rejects gaps. It does not replace missing samples with artificial values.

Local archive files must end in .mseed and have complete channel metadata. The converter is bounded by selected input bytes and processes stations sequentially. A very long selected interval at one station can still consume substantial memory; use course-sized intervals rather than treating this helper as an unbounded archive processor.

---

# 48. What is inside a SAC header?

The header is metadata inside the binary file. The sample array follows it; a text editor is not a SAC reader.

DDCorr accepts evenly sampled binary SAC v6/v7 and decodes byte order. The converter writes event depth in km and station elevation in metres. Header presence cannot detect an incorrectly supplied physical unit. Missing fields are not recovered from filenames.

---

# 49. Inspecting a downloaded SAC file

Replace EVENT and NET.STA..HHZ.sac with one actual path from manifest.json. The quoted path is a placeholder, not a file guaranteed to exist.

The terminal output includes timing, station/event coordinates and A/T0–T9 times with their text labels. Open work/one_real_sac.png to see the waveform and selected phase markers.

```sh
julia --project=. bin/sac_info.jl \
  "work/iceland_demo/sac/EVENT/NET.STA..HHZ.sac" \
  --p-header a --s-header t0 --plot work/one_real_sac.png
```



---

# 50. Reference, trace start, origin and pick differ

NZ fields define a reference UTC. B is the first-sample offset from that reference. O is the event-origin offset; A and T0 are phase offsets.

Absolute P time = reference + A. P travel time from the catalogue = A − O when all offsets share that reference.

The trace can begin before the origin. Do not interpret A as seconds from the first sample or reset the reference without updating all offsets.

sac_info.jl prints both relative and absolute times so students can verify this directly. The conversion code keeps one NZ reference and updates O/A/T0 consistently. SAC stores many header numbers as Float32, so additional display decimals are not evidence of additional measurement precision.

---

# 51. A separate settings file for the real data

Duplicate DDCorr.toml as Iceland.toml in the same repository folder. In Iceland.toml, edit the existing [input] section to match the lines above. These pick fields match the included SAC converter.

In [plots], reset event_pairs=[], original_event_pairs=[] and example_stations=[]. Set example_phases=["P", "S"]. This removes the synthetic figure requests from the earlier exercise.

```sh
[input]
sac_dir = "work/iceland_demo/sac"
p_pick_header = "a"
s_pick_header = "t0"
```



---

# 52. Run real correlations and assess them

We now have an event SAC directory and a separate Iceland.toml settings file. First inspect the real inputs, then calculate and review the measurements.



---

# 53. Inspecting and correlating the downloaded events

Run the first command and inspect phase_readiness.csv in its printed inspect_… folder. Then run the second command and open report.html in its printed correlate_… folder.

The event count depends on the available recordings. Accepted correlations also depend on phase-window placement and signal quality. The following 100-event figures are a reference example, not expected counts for this small download.

```sh
julia --project=. bin/ddcorr.jl Iceland.toml --inspect
julia --project=. --threads=4 bin/ddcorr.jl Iceland.toml
```



---

# 54. Reference: a larger 100-event Iceland run

100 chronologically selected events; 12 selected stations; 11 with cached waveform coverage; 3,300 generated SAC files.

Default processing accepted 2,412 P and 4,625 S observations: 7,037 total, linking 1,914 distinct event pairs.

These use explicitly labelled predicted window centres. This demonstrates the workflow and its diagnostics; it does not independently validate the phases or relocated locations.

Actual validation: October 22, 2026; Julia 1.12.3 on macOS Apple Silicon, four Julia threads. Station/phase correlation took about 8.4 s after package loading; full wall time with graphics was about 43 s on this run. These are observations, not a portable benchmark. 52,588,544 selected cached archive bytes; zero newly downloaded waveform bytes. Receipts in examples/download/iceland100.

---

# 55. Reference: a near-perfect match requiring review

These catalogue origins are only 0.06 s apart. Their windows may capture the same physical arrival; this pair is flagged in near_identity.csv.

Actual strongest stored example, events 44 and 45: S1 source lines 9943 and 9944, origins 12:28:55.940 and 12:28:56.000 UTC. The run flags 22 station/phase near-identity observations in total. High similarity is not independent evidence for two distinct earthquakes. This example is deliberately retained as QC evidence; no automatic event deletion was performed. The curve averages SNR-qualified components; displayed samples are the first common component.

---

# 56. Reference: a noisy correlation near threshold

r near 0.70 is visibly imperfect. Check phase identity, waveform shape and competing lag peaks before trusting the measurement.

Actual weakest stored automatic example from the validated run. This replaces a noiseless-only discussion. A high coefficient is neither an uncertainty estimate nor proof of a real event. Automatic examples sample accepted observations; they do not show every rejected or problematic pair.

---

# 57. Reference: the lag distribution

The search limit is ±0.5 s. Accumulation near an edge would motivate checking pick placement and the full lag curves.

Actual accepted observations from the 100-event run, separated by P and S. Boundary maxima are rejected before export. A histogram of accepted lags is therefore conditioned on quality criteria and cannot by itself describe all original pick errors.

---

# 58. Reference: a station/phase correlation matrix

Rows and columns are event_id values. Coloured cells are accepted correlations; grey cells are absent measurements, including self-pairs.

Z7.DYSA P, 100 events. The matrix is symmetric because exchanging event order preserves coefficient; the signed dt and lag matrices are antisymmetric. Missing cells may reflect unavailable components, preprocessing rejection, quality rejection, or no measurement. They are not zero similarity. Block structure can motivate graph inspection, not automatic event deletion.

---

# 59. Make PNG matrices and optional dense CSVs

Edit the existing [matrices] section of Iceland.toml as shown. Save it, repeat the Iceland.toml correlation command, then open report.html in the new result folder.

With enabled=true, sparse entries are exported. With plots=true, PNG matrices appear in the report. With dense=true, square CSV matrices are also exported.

```sh
[matrices]
enabled = true
plots = true
dense = true
max_plot_events = 500
max_plot_groups = 24
```

These are exact TOML keys in the existing [matrices] section. Dense arrays use NA for missing data/diagonal. max_dense_events and max_dense_cells independently bound dense CSV export. matrices/matrix_plots.csv records rendered/skipped groups. All figures are raster PNG, with no PDF or SVG output.

---

# 60. If a requested pair has no figure

Confirm event_id in event_id_map.csv, or use original_event_pairs with quoted folder names. Check example_stations and example_phases.

Read example_selection.csv. A request with no accepted observation is reported, rather than silently replaced by another pair.

Use phase_readiness.csv, preprocessing_issues.csv and group_summary.csv to explain losses. Optional rejected_pairs.csv gives per-pair decisions.

To enable the optional rejection ledger, put [output] write_rejected_pairs=true in an advanced override file and reference it with [advanced] file="advanced.toml" in the current public TOML, here Iceland.toml. This can be large for many events. Do not confuse a figure selector with an acceptance override.

---

# 61. The handoff has a specific sign and weight

dt.cc stores travel time of event i minus travel time of event j. catalog.txt and event_id_map.csv define the same sequential IDs.

By default the weight is r². The generated ddsync.toml uses base_mode="cc" so that exported weight is applied once.

graphsplit_inputs.toml is an input fragment; combine it with your velocity model and GraphSplit solver settings. Isolated events remain in the catalogue.

The correlation engine writes reduced travel-time differences, not raw absolute arrival differences. Do not square the exported r² again by choosing a downstream cc2 mode without understanding its effect. Four-decimal timing output is representation, not an uncertainty claim. DDSync/GraphSplit compatibility is documented in OUTPUTS_AND_HANDOFF.md.

---

# 62. Expanding the real-data test

After the small download works, select 100 events with the same s1 command using --limit 100, and select 12 stations using --limit 12. Keep the tables in a separate directory such as work/tables100.

Use those tables in download_sac.py with --max-combinations 1200, --total-mib 256 and --output work/iceland100. Use a separate TOML with sac_dir="work/iceland100/sac".

Exact file and correlation counts can vary with archive coverage and metadata changes. The reference figures show a prior 100-event run, rather than a promise of a fixed result for every download.



---

# 63. Follow one waveform through the code

Now that we have run and inspected the outputs, we can explain each operation and the parameter it controls.



---

# 64. The processing sequence has a purpose

We read a SAC trace and its phase pick, remove the mean and linear trend, reduce its ends smoothly with a taper, and filter it in the selected phase band.

Apply anti-alias resampling if reducing the sampling rate. Extract a fixed comparison window, a wider lag-search window, and pre-P noise.

Compare matched components at trial lags, combine usable component curves, choose a clear peak, refine its lag and export the differential time.

This is the sequence in src/signal.jl and src/pipeline.jl. Whole-trace filtering precedes window extraction so the short core is not filtered as an isolated discontinuous snippet. All interpolation and coverage checks refer to actual sample times.

---

# 65. One SAC: raw, detrended and bandpassed

All three panels follow synthetic/1201/XX.S01..HHZ.sac. The dashed line is its P pick; processing changes the samples, not the pick time.

Exported using DDCorr.filtered_trace and the actual detrend function. The full trace is processed before this zoomed display. Source in teaching/source/export_trace.jl; values in the teaching build data. Signals are the synthetic course input, not field data.

---

# 66. Remove baseline and linear drift

A large constant offset or gradual drift should not determine a short arrival comparison. Subtract the mean and least-squares linear trend.

This operation prepares the entire trace; Pearson normalization later also centres each compared window.



Implementation: src/signal.jl:2–8

Exact source excerpt:
2: function detrend(x)
3:     y=Float64.(x); n=length(y); y .-= mean(y)
4:     t=range(-1,1;length=n)
5:     slope=dot(t,y)/sum(abs2,t)
6:     y .-= slope .* t
7:     return y
8: end

---

# 67. Taper the ends of the available trace

A cosine taper smoothly reduces the trace ends. It reduces artificial edge jumps; it is not an arrival detector.

Actual synthetic trace before and after DDCorr.taper!. The default taper is 2% at each end of the full trace. A core too close to an edge is still unsuitable. Do not replace missing waveform padding with zeros and assume tapering fixes it.

---

# 68. The taper is a smooth sample weight

The weight rises smoothly from near zero to one at the left edge and falls symmetrically at the right edge.

Advanced setting: [preprocess] trace_taper_fraction=0.02. Later we require real data beyond the noise and phase windows.



Implementation: src/signal.jl:10–17

Exact source excerpt:
10: function taper!(x,fraction)
11:     n=min(length(x)÷2,round(Int,fraction*length(x)))
12:     for k in 1:n
13:         w=0.5*(1-cospi(k/(n+1)))
14:         x[k]*=w; x[end-k+1]*=w
15:     end
16:     return x
17: end

---

# 69. Choose a band for the signal you are comparing

A bandpass suppresses frequencies below the low corner and above the high corner, while retaining a middle band.

[P] band_hz=[2.0,14.0] and [S] band_hz=[2.0,14.0] are the course starting point. Different sources, paths and instruments can justify other bands.

A narrow band can make unrelated oscillatory signals look similar. Inspect both the waveform and lag curve when changing the band.

Corners are transition frequencies, not a brick wall. In this implementation they parameterize a Butterworth prototype. The native sample rate must support the requested band; the code errors instead of silently clipping it. Filter settings do not prove phase identity.

---

# 70. One pass and forward–reverse filtering differ

At a Butterworth corner, one-pass amplitude gain is about 0.707. Two passes give about 0.5: the gains multiply.

Actual DSP.jl frequency response for the configured native-rate 2–14 Hz Butterworth filter. A gain of 0.5 means half the sinusoidal amplitude, not half the power. The forward–reverse application is the same configured bandpass run twice; it is not a separate choice of band.

---

# 71. A filter changes amplitude and phase

H(f) is the complex response at frequency f. Its magnitude scales a sinusoid; its angle φ(f) shifts that sinusoid in time.

Phase delay τφ is that phase shift expressed in seconds. It may differ by frequency, changing a transient’s shape.

Equation source: teaching/assets/equations.json. f is in Hz, φ in radians. The formula applies to a sinusoidal component at f>0. Phase delay and group delay are not generally identical; only phase delay is needed for this explanation.

---

# 72. Why filtering in both directions helps

A forward pass applies H; a reverse pass applies its complex conjugate for a real-coefficient filter. The phases cancel and the magnitudes multiply.

This gives zero net phase in the ideal interior and squared amplitude gain. Finite trace edges still need taper and real padding.

The DDCorr call is DSP.filtfilt. H* denotes complex conjugate, X/Y are Fourier-domain input/output. Four is the Butterworth prototype order; bandpass transformation and forward–reverse filtering each increase effective order. This explains the previous response plot rather than introducing an unrelated filter.

---

# 73. Filter at the native sampling rate

Filtering uses the original sample interval before any downsampling. The filter is represented as second-order sections for numerical stability.

In DDCorr.toml or Iceland.toml, band_hz sets the filter corners. If needed, use [phase.P] or [phase.S] filter_order in an advanced TOML to change the Butterworth prototype order.



Implementation: src/signal.jl:26–30

Exact source excerpt:
26: function filtered_trace(h,pc,prep)
27:     raw=read_samples(h)
28:     x=taper!(detrend(raw),prep["trace_taper_fraction"])
29:     native_fs=1/h.floats[1]
30:     y=filtfilt(bandfilter(native_fs,pc),x)

---

# 74. Aliasing: a high frequency can look low

At 20 samples/s, frequencies above 10 Hz cannot be represented uniquely. Filtering before discarding samples suppresses those ambiguous frequencies.

Upper panel: 12 Hz and a phase-reversed 8 Hz sine have the same values at a 20 Hz grid. Lower panel: a constructed 3+12 Hz signal, naive decimation versus a polyphase FIR low-pass/downsample. This conceptual example uses SciPy; production DDCorr uses DSP.jl resample, separately verified numerically.

---

# 75. What the anti-alias filter does

Before reducing sample rate, a low-pass filter attenuates frequencies above the new Nyquist frequency: half the new sampling rate.

DDCorr uses DSP.resample, a delay-compensated polyphase FIR resampler. FIR means a finite set of weights applied to nearby samples.

The signal bandpass and anti-alias filter have different jobs. The first selects useful seismic frequencies; the second protects the coarser sampling grid.

This is not a claim that filtering can recover information already aliased in the original recording. At the default 50 Hz target, Nyquist is 25 Hz, above the 14 Hz upper band corner. A low-pass finite impulse response filter has a transition band; the library designs the resampling filter for the ratio.

---

# 76. Resample without moving the time origin

sample_rate_hz controls the target grid. If it already equals the native rate, no resampling is applied.

The returned sample interval and original SAC B define the new times. Picks are then sampled on a common pick-relative grid.

DDCorr does not upsample beyond the native rate by default. Rationalization supplies a ratio for the polyphase resampler. Linear interpolation extracts windows when a pick falls between samples; this is different from interpolation of the correlation peak.

Implementation: src/signal.jl:34–37

Exact source excerpt:
34:     ratio=rationalize(target/native_fs;tol=1e-7)
35:     z=ratio==1 ? y : resample(y,ratio)
36:     return raw,y,z,h.floats[1]/Float64(ratio)
37: end

---

# 77. Three windows, each with a different job

In the code, core means comparison window. The search window permits shifts. Pre-P noise estimates background strength.

P defaults: core [−0.5,2.0], lag ±0.5 gives extended [−1.0,2.5]; noise [−8,−2]; 5 s filter margin requires coverage at least [−13,7.5] relative to P. Diagram rounds the right endpoint to 8 for display. For S, the core is centred on S but noise is still referenced to P, avoiding P coda as S background.

---

# 78. Use the pick as a centre, not as proof

The supplied pick defines the starting alignment. We compare the configured comparison window with shifted portions of the other event’s longer search window.

A very short comparison window may contain too few distinctive cycles. A very long window may include another event or a different phase.

max_lag_s limits the correction around the supplied picks. Widening it can reveal a stronger peak, but can also introduce competing matches. Inspect those peaks before accepting the measurement.

The whole search interval must exist in actual data. filter_padding_s is additional coverage, not a request to invent zeros. phase_readiness.csv checks timing and coverage before expensive processing; later SNR and peak tests use the actual samples.

---

# 79. Normalized discrete cross-correlation

At shift k, compare N samples of A with N samples drawn from B. Ā and B̄k are their means. k is an integer sample lag.

The numerator measures co-variation; the denominator divides by both signal norms. r=1 means matching centred shapes up to positive amplitude scale.

Use the figure from slide 3 as context. r=−1 is a polarity reversal; r near zero is weak linear shape agreement, not proof that either waveform is noise. The B window mean and norm change as it slides. A/B here refer to a single common component. Properly typeset equation is a PNG; its LaTeX source is retained in equations.json.

---

# 80. Comparison window against search window

The two comparisons use different fixed comparison windows. Swapping equal full windows would be redundant; these finite comparison/search comparisons need not be.

In the first term the A core is fixed and the B search window is shifted +lag. In the second term the B core is fixed and the A search window is shifted −lag. The extended signals contain samples outside each core, so their edge content may contribute differently. The core width in this conceptual illustration is shortened for readability; actual defaults are in DDCorr.toml.

---

# 81. Average the two directional comparisons

In the equation, Acore means event A’s fixed comparison window, and Bcore means event B’s. The word core is an internal code label for the same comparison window.

Averaging reduces dependence on which event supplied the short comparison window. Exchanging event order reverses the lag axis.

This is the code’s symmetric core-versus-extended definition, not a claim that ordinary correlation of two identical full windows requires both directions. Correlation uses a common lag across accepted horizontal components. The two-direction average may attenuate a peak when window-edge content differs.

---

# 82. The implementation follows that definition

The first product compares A’s comparison window with B’s search window. The second reverses those roles.

The index r=m−k+1 reverses the second lag direction before averaging the two normalized terms.



Implementation: src/signal.jl:131–133

Exact source excerpt:
131:         r=m-k+1
132:         w.curve[k]=clamp(0.5*(w.ab[n+k-1]/(a.template_norm*b.sliding_norm[k])+
133:                               w.ba[n+r-1]/(b.template_norm*a.sliding_norm[r])),-1.0,1.0)

---

# 83. Why use an FFT here?

Directly shifting and multiplying every sample works, but repeats many operations for every lag and event pair.

An FFT computes the convolution used in the numerator efficiently. Reversing the core turns that convolution into correlation.

Zero-padding prevents the end of one finite sequence from wrapping around to its beginning. Only valid full-window overlaps are kept.

The implementation uses nfft=nextpow(2,ncore+length(ext)−1), preventing circular wrap for linear convolution. Sliding sums/squares supply the moving window normalization. FFT acceleration should give the same statistic as direct Pearson sums; the independent numerical test checks this equality.

---

# 84. Cache transforms and moving-window norms

Each trace’s transforms are reused across many pairs. Prefix sums provide means and energies for the sliding windows.

This saves repeated work; it does not change the cross-correlation definition.

See earlier lines in cache_vector for sliding sums and sum-of-squares norms. FFT plans and buffers are private to workers, and station/phase groups are processed sequentially to limit memory. Do not interpret the cache as a permanent scientific result; source/data/configuration hashes control reuse.

Implementation: src/signal.jl:72–75

Exact source excerpt:
72:     nf=nextpow(2,ncore+length(ext)-1)
73:     tf=rfft(vcat(reverse(core),zeros(nf-ncore)))
74:     ef=rfft(vcat(ext,zeros(nf-length(ext))))
75:     return tf,ef,norms,tn,nf

---

# 85. From pick correction to differential time

pi and pj are absolute pick times; oi and oj are catalogue origins. Positive lag ℓ means j is later relative to its own pick.

Keep i fixed and sample j at t+ℓ. Subtract ℓ from the difference of pick-minus-origin times to obtain Δtij.

Absolute event dates can be years apart. In the implementation reduced times are formed carefully to avoid subtracting large Unix epochs unnecessarily. Example: reduced picks 10 and 11 s, lag +0.2 s gives dt=10−11−0.2=−1.2 s. This sign is verified against independent synthetic truth.

---

# 86. Subtracting origins does not erase their errors

A catalogue origin can be wrong. The value pick − catalogue origin still contains that event’s origin-time error.

Such event-specific timing errors can be mutually consistent across a graph and still affect differential times.

Relocation uses many stations/phases and geometry to separate location and origin-time corrections. Correlation alone cannot do that.

This corrects the earlier implication that origin subtraction removes all origin-time error. Synchronization enforces relative-time consistency but is not independently sensitive to every event-specific bias. Distant-in-time events can still be correlated when their waveforms and instrumentation are compatible.

---

# 87. Refine the peak between sample lags

a, b and c are the scores just left of, at, and right of a discrete maximum. A parabola estimates an offset δ in samples.

The estimated fractional correction lies within half a sample of the discrete peak. The total lag can still be many samples, up to the configured search limit.

k is the integer peak lag relative to zero; fs is sample rate. δ modifies that integer peak, not the entire lag. A measured lag can span many samples within max_lag_s. Flat/degenerate curvature is not fitted. Acceptance uses the conservative discrete coefficient rather than an inflated fitted amplitude. This interpolation is not an uncertainty estimator.

---

# 88. Export precision is a different decision

A half-sample fractional correction does not limit the total lag. Nor does it justify arbitrarily many printed decimals.

By default, differential times are written to four decimal places, giving a 0.0001 s increment. This is an output format choice, not a timing-accuracy claim.

Advanced setting [output] dt_decimals changes the representation. More digits can preserve numerical detail without improving the physical measurement.

Set dt_decimals in an advanced override file referenced from the public configuration. Valid range is 0–9. The primary dt.cc output uses fixed decimal formatting; CSV timing fields are rounded to that precision. Internal calculations remain Float64. SAC header precision, picking/model errors, noise and waveform differences all matter to actual accuracy.

---

# 89. Estimate background before judging a component

s is the filtered comparison window; q is a filtered noise window before P. Their centred RMS ratio measures signal strength relative to background.

A component below min_snr is excluded before combining correlation curves. For S, background still comes from before P.

N and M are counts of core/noise samples; they need not be equal. This is a band-limited RMS ratio, not a probabilistic detection confidence. A preceding event or tremor can contaminate the noise window. The configured pre-P interval and observed samples must be reviewed for dense swarms.

---

# 90. One horizontal may carry the useful S energy

If one horizontal fails its own SNR check, do not average its noise curve into the useful component’s curve. DDCorr excludes that trace first.

The course default [S] min_components=1 permits a common usable horizontal. Set min_components=2 to require both; the mining preset keeps that choice.

When both pass, their correlation curves are averaged at a common trial lag. A strong RMS alone does not prove the component contains the intended S phase.

Components are matched by channel identity and compatible orientation. Both events must have a qualified common component. The exported ncomponents/components columns show what contributed. Example waveforms show the first common component, while an S lag curve may average two; the plot caption says so. We do not introduce an unvalidated SNR weighting formula.

---

# 91. What the peak-quality checks test

min_cc requires enough waveform similarity. A boundary guard rejects a maximum at the edge of the permitted search: the true maximum may lie outside.

min_peak_gap compares the winning peak with another local maximum outside its immediate neighbourhood. A small gap means another shift competes.

These are measurement checks, not an earthquake classifier. Periodic tremor can still produce coherent correlations.

The coefficient threshold is public [P]/[S] min_cc. The peak-gap and sidelobe exclusion settings are advanced per-phase options; boundary_guard_samples is advanced [quality]. Interpret rejection ledgers and curve shapes together instead of adjusting every threshold to increase counts.

---

# 92. Where the advanced quality checks are set

Save the settings above as my_advanced.toml next to the public TOML you are using. In that public file, add [advanced] with file="my_advanced.toml". Edit [phase.S] separately to change S quality checks.

```sh
# my_advanced.toml
[phase.P]
min_peak_gap = 0.10
sidelobe_exclusion_s = 0.04
[quality]
boundary_guard_samples = 1
```

The caption uses compact notation; in the actual public TOML, put [advanced] on one line and file="my_advanced.toml" on the next. A partial advanced file is allowed. Unknown keys error, helping catch typos. effective_config.toml contains the final merged settings. min_cc remains in the ordinary public [P]/[S] sections.

---

# 93. A graph check: does a triangle close?

For one station and phase, add three directed differential times around events i, j and k. Consistent relative arrivals should sum to about zero.

Large closure residuals flag contradictory measurements. Coherent noise and event-specific biases can still close, so zero closure is not independent truth.

This motivates DDSync without pretending correlation QC solves event authenticity. The report reservoir-samples triangles up to diagnostics.max_closure_triangles. All three edges must exist; a disconnected or sparse graph can have little closure evidence. Do not reject a remote or isolated event solely because it lacks neighbours.

---

# 94. Near-identity is evidence to review

[output] near_identity_cc=0.99 flags highly similar accepted observations in near_identity.csv. It does not automatically delete events.

Inspect whether supposedly separate events use the same physical samples and phase timing. Repeating earthquakes can also have very high similarity.

Use waveform identity, origin/pick separation and multi-station support together. A connected cluster or remote location alone is not a truth label.

This advanced setting uses absolute coefficient for the flag. The public polarity policy determines accepted observations first. The correlator intentionally retains all valid input events; duplicate-catalogue decisions belong to a documented QC step with supporting evidence.

---

# 95. Find the implementation by responsibility

Code screenshots in this deck use exact source lines; the source index and slide notes identify their locations.



---

# 96. Independent data exercise

Use the guides as references, but make and document your own source and parameter choices. Instructor solutions are distributed after the exercise.



---

# 97. Exercise A: find the information

Choose an active interval and suitable catalogue. Locate its original download or service endpoint; aim for roughly 100 events.

Find a recording network and about 12 stations with the right dates, components and location codes. Declare how you selected them.

Determine whether observed P/S picks exist. If you use predictions, state why and identify their limitations.

See docs/EXERCISES.md. Students should find server names, network/channel IDs and catalogue formats themselves. Record source URLs and choices. A smaller justified selection is acceptable when coverage is limited; do not invent events or stations to reach a target count.

---

# 98. Exercise B: build and inspect the inputs

Use subcommand --help and the data guide to create the tables, then choose bounded requests and generate SAC. Explain each directory you create.

Locate manifest.json. Compare requested and successful combinations; explain missing data. Repeat an unchanged request and inspect downloaded-byte counts.

Expose one SAC with sac_info.jl. Identify reference time, B, O, P/S headers and data coverage; attach its PNG.

This is a guided investigation rather than a complete sequence of solved commands. Students should choose the correct service/format route and inspect actual output. Do not hide archive errors or fill waveform gaps. The instructor guide contains a worked sequence and expected baseline counts, separately from this student deck.

---

# 99. Exercise C: assess and hand off the results

Inspect, correlate, and request two specific pairs at one station. Explain any unplotted request using the audit tables.

Annotate a strong and a noisy example, plus one matrix PNG. Change one justified setting and compare what changed.

Submit source receipts, settings, commands and evidence. Identify the matching dt.cc, catalogue, stations and ID map for relocation.

A successful result is reproducible and scientifically reasoned, even if some inputs or pairs fail. Do not maximize accepted counts as a grading objective. Discuss phase identity, lag ambiguity, incomplete support and model/pick limitations. The exercise replaces the earlier arithmetic-only tasks.

---

# 100. Keep a useful record of your experiment

Keep the original data sources, commands, settings and result folder together. Explain the evidence supporting each measurement you intend to use.

Use the audit tables to explain exclusions and repeat the processing after any justified parameter change. Compare results with the previous run.

In later course blocks, we will assess graph consistency in DDSync and source geometry in GraphSplit. Both steps require scientific judgment in addition to software execution.

Student references: docs/START_HERE.md, docs/DATA_DISCOVERY.md, docs/EXERCISES.md, docs/OUTPUTS_AND_HANDOFF.md. The main deck does not include the instructor exercise solutions.
