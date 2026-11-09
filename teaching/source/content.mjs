export const slides = [
  {
    "title": "DDCorr: from waveforms to relative times",
    "body": [
      "A practical course: find data, prepare event SAC files, measure waveform shifts, and assess the results.",
      "The objective is a defensible set of differential travel times for DDSync and GraphSplit."
    ],
    "cover": true,
    "subtitle": "Revised student edition · November 2026",
    "notes": "Text, tables and commands are editable PowerPoint objects. Scientific figures, rendered equations and exact source excerpts are PNG images. Figure-generation and equation source are included. Instructor solutions are distributed separately.",
    "section": "LOCATION CONTEXT",
    "oldSlide": 1
  },
  {
    "title": "An earthquake location from individual arrivals",
    "body": [],
    "section": "LOCATION CONTEXT",
    "size": 27,
    "gap": 22,
    "diagram": "single",
    "notes": "Illustrative teaching schematic with editable shapes. Example times on slide 4 are constructed to demonstrate cancellation of a shared error, not measured travel times.\nTo locate one earthquake, we estimate its origin time and position from P and S arrival times at several stations.\nA velocity model gives the predicted travel time from a trial source to each station. We adjust the source until predicted and measured arrivals agree as well as possible.\nErrors in the phase picks, station geometry and velocity model can spread events that actually occurred close together."
  },
  {
    "title": "Why nearby events can be located more precisely",
    "body": [],
    "section": "LOCATION CONTEXT",
    "size": 27,
    "gap": 22,
    "diagram": "shared",
    "notes": "Illustrative teaching schematic with editable shapes. Example times on slide 4 are constructed to demonstrate cancellation of a shared error, not measured travel times.\nTwo nearby earthquakes often send the same phase along nearly the same path to a distant station. Much of the velocity-model error is therefore shared.\nSubtracting the two travel times reduces that shared error. Cross-correlation can measure their relative waveform timing more precisely than picking each onset independently.\nThis advantage is strongest when sources are close relative to the station distance and the waveforms represent the same phase. It does not remove all model error."
  },
  {
    "title": "A double difference at one station",
    "body": [],
    "section": "LOCATION CONTEXT",
    "size": 27,
    "gap": 22,
    "diagram": "difference",
    "notes": "Illustrative teaching schematic with editable shapes. Example times on slide 4 are constructed to demonstrate cancellation of a shared error, not measured travel times.\nFor an event pair at one station, a double difference is the measured travel-time difference minus the difference predicted by the velocity model.\nThe relocation problem combines many such differences to estimate changes in event positions and origin times. After linearization, these changes are found by solving a system of linear equations.\nGood relative precision does not guarantee an accurate absolute position. Station coverage, reference constraints and the velocity model still matter."
  },
  {
    "title": "DDCorr, DDSync and GraphSplit in this course",
    "body": [],
    "section": "LOCATION CONTEXT",
    "size": 27,
    "gap": 22,
    "diagram": "pipeline",
    "notes": "Illustrative teaching schematic with editable shapes. Example times on slide 4 are constructed to demonstrate cancellation of a shared error, not measured travel times.\nIn DDCorr, we prepare event waveforms and measure differential travel times for event pairs at each station and phase.\nIn DDSync, we use redundant measurements in each event graph to estimate consistent relative arrival times and identify contradictory edges.\nIn GraphSplit, we combine those timing constraints with stations and a velocity model to relocate events. This first course block ends with the DDCorr files needed for those later steps."
  },
  {
    "title": "What does the correlator measure?",
    "body": [
      "We compare two events recorded on the same station and component, around the same phase.",
      "The coefficient r measures similarity of shape. The lag is the time shift that gives the best similarity within a specified search interval.",
      "The output combines that lag with the two picks and catalogue origins to estimate a differential travel time. It does not detect events in continuous data."
    ],
    "section": "QUICK START",
    "oldSlide": 2
  },
  {
    "title": "The sign of a correlation lag",
    "body": [
      "Each trace has its own pick at time zero. A stays fixed; B is sampled later and displayed shifted left."
    ],
    "image": "teaching/assets/lag_introduction.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "These are constructed pulses with a known +0.18 s delay. Their absolute event dates need not be close. The plot demonstrates the display convention B(t+lag), not a change to SAC origin times.",
    "section": "QUICK START",
    "oldSlide": 3
  },
  {
    "title": "The route through this course",
    "body": [
      "1. Run a controlled synthetic example and learn the files.",
      "2. Prepare a small real-data download, then expand to a larger selection.",
      "3. Run real correlations and read the diagnostic evidence.",
      "4. Follow the processing and mathematics; then complete an independent data exercise."
    ],
    "size": 28,
    "gap": 20,
    "section": "QUICK START",
    "oldSlide": 4
  },
  {
    "title": "Quick start with known signals",
    "body": [
      "We start offline, where we know the correct time shifts. This separates installation problems from scientific interpretation."
    ],
    "cover": true,
    "subtitle": "Section 1 · DDCorr.jl minicourse",
    "section": "QUICK START",
    "oldSlide": 5
  },
  {
    "title": "Software and the course folder",
    "body": [
      "Obtain DDCorr.jl from github.com/eliasrh/DDCorr.jl using Code > Download ZIP, or unzip the instructor handout. GitHub access is required while the repository is private.",
      "Open a terminal and change into the extracted DDCorr.jl folder. Run pwd and ls on macOS/Linux. You should see DDCorr.toml, Project.toml, bin, scripts and teaching.",
      "Install Julia 1.12.3 and Python 3.12 before class. Use the download links in the slide notes and docs/START_HERE.md. Enter the commands in your operating-system terminal. Windows alternatives are in docs/WINDOWS.md."
    ],
    "sources": [
      "https://julialang.org/downloads/",
      "https://www.python.org/downloads/"
    ],
    "notes": "Choose the Julia binary for your CPU. The package declares Julia ≥1.10 compatibility, but the course Manifest and local verification use 1.12.3. Do not infer testing of every allowed version. Install Julia and Python before entering the commands.",
    "section": "QUICK START",
    "oldSlide": 6
  },
  {
    "title": "Installing the Julia packages",
    "body": [
      "In Project.toml, you can read the list of Julia packages needed by DDCorr. In Manifest.toml, you can read the exact package versions used for this course.",
      "The dot in --project=. means the current terminal directory. With this option, Julia uses the package settings in this DDCorr.jl folder.",
      "The second command installs those package versions. Run it once before the first calculation and allow several minutes for installation and compilation."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "command": "julia --version\njulia --project=. -e 'using Pkg; Pkg.instantiate()'",
    "commandHeight": 72,
    "bodyY": 274,
    "codeSize": 23
  },
  {
    "title": "Generating waveforms with known timing",
    "body": [
      "Run this command from the DDCorr.jl folder. It uses the included script to create artificial waveforms locally, with no earthquake download or extra Python packages.",
      "You will find 72 SAC waveform files inside examples/synthetic/sac: six event folders, with four stations and three components per event.",
      "You will also find truth_pairs.csv in examples/synthetic. It contains the known timing differences so that we can test the calculation."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "command": "python3 scripts/make_synthetic.py --output examples/synthetic",
    "commandHeight": 41,
    "bodyY": 243,
    "codeSize": 23
  },
  {
    "title": "The generated directory structure",
    "body": [
      "The display above is a directory example, not a terminal command. Each event folder contains its own station and component files.",
      "There are six event folders in total. Event 905 contains independent noise. We expect it to have no accepted correlations. SAC is the format name, while sac is the lowercase directory name."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "command": "examples/synthetic/\n  sac/1201/XX.S01..HHZ.sac\n  sac/17/XX.S01..HHZ.sac\n  sac/203/XX.S01..HHZ.sac\n  truth_pairs.csv",
    "commandHeight": 165,
    "bodyY": 367,
    "codeSize": 23
  },
  {
    "title": "Checking the inputs before correlation",
    "body": [
      "DDCorr uses the settings in DDCorr.toml to check event and station metadata, the configured phase-pick fields, sampling rates and available time coverage.",
      "These checks apply to any dataset. They test whether the inputs are usable, without requiring known event locations or a synthetic answer key.",
      "For this generated dataset, expect “6 valid events” and “Inspection complete.” At this point, you have only an inspect_… result folder. No correlations have been calculated."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "command": "julia --project=. bin/ddcorr.jl DDCorr.toml --inspect",
    "commandHeight": 41,
    "bodyY": 243,
    "codeSize": 23
  },
  {
    "title": "Reading the inspection results",
    "body": [
      "The terminal prints the full path of results/inspect_YYYY-MM-DD_HHMMSS_mmm. Open that folder in your file browser. Its suffix is the UTC time of this run.",
      "In inventory.csv, inspect the P_pick_s and S_pick_s columns. In phase_readiness.csv, check which traces have the selected picks and enough waveform coverage.",
      "In input_issues.csv, read any metadata errors. A file containing only column headings has no issue rows. Inspection does not yet test filtered signal strength."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Calculating the correlations",
    "body": [
      "Now run the correlation command above. DDCorr creates a new results/correlate_… folder. The earlier inspect_… folder remains available.",
      "For the unchanged synthetic settings, expect 80 accepted observations. Each observation is one event pair at one station and phase.",
      "Open report.html in this new correlate_… folder. DDCorr produces this report for synthetic and real datasets when plotting is enabled and the run completes."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "command": "julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml",
    "commandHeight": 41,
    "bodyY": 243,
    "codeSize": 23
  },
  {
    "title": "Reviewing the first report",
    "body": [
      "In report.html, examine summary.png and the waveform examples. Compare the traces before and after the measured shift, then check the correlation peak.",
      "The summary includes coefficient and lag distributions, support from stations and phases, and isolated events. Event 905 should be isolated.",
      "Open the numerical files in the same result folder next. Keep this folder together so that the report, event indices and differential times refer to the same run."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Reading one differential-time observation",
    "body": [
      "This is an actual excerpt from the synthetic dt.cc file, not a command. The header identifies events 1 and 2. The final header value is the origin-correction field, set to zero.",
      "The observation gives the station XX.S01, differential time +0.1353 seconds, weight 0.969757 and phase P. Positive dt means the travel time for event 1 exceeds that for event 2.",
      "The default weight is the squared correlation coefficient. The differential time also includes the pick-minus-origin times, so it is generally different from the correlation lag."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "command": "# 1 2 0.0\nXX.S01        0.1353 0.969757 P",
    "commandHeight": 72,
    "bodyY": 274,
    "codeSize": 23
  },
  {
    "title": "Reading the catalogue and station coordinates",
    "body": [
      "In catalog.txt, each row contains one initial event origin time in UTC, latitude, longitude, depth in kilometres and the integer event index.",
      "In stations.txt, each row contains a station code, latitude, longitude and elevation in metres. These station codes are identical to the codes in dt.cc."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "command": "catalog.txt columns:\nyear month day hour minute second lat lon depth_km event_id\n\nstations.txt example:\nXX.S01 64.6999969 -16.9699993 0.000",
    "commandHeight": 165,
    "bodyY": 367,
    "codeSize": 23
  },
  {
    "title": "Event names and sequential catalogue indices",
    "body": [
      "For every dataset, DDCorr assigns catalogue indices 1 through N to valid event folders, using text-sorted folder names. This simplifies the transfer to DDSync and GraphSplit.",
      "Open event_id_map.csv in either the inspect_… or correlate_… result folder. The event_id column is the new index. The original_event_id column is the input folder name.",
      "For these synthetic inputs, index 1 corresponds to folder 1201, index 2 to 17 and index 3 to 203. Isolated events keep their indices. Adding event folders can change the assignment."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Where arrival picks come from",
    "body": [
      "Inside each SAC file, numeric header fields store the arrival times. In the synthetic example, the P time is in A and the S time is in T0.",
      "DDCorr reads the configured numeric fields. It does not determine arrival times from the filename. A file named XX.S01..HHZ.sac identifies a channel, but does not specify its P arrival.",
      "Before processing your own data, use bin/sac_info.jl to inspect those fields and labels. Different archives may store arrivals in T8/T9 or other fields."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Changing the P settings in DDCorr.toml",
    "body": [
      "Open DDCorr.toml in a plain-text editor and find the existing [P] section. These are the settings you will edit, rather than adding a second [P] section.",
      "The comparison window runs from 0.5 seconds before the P pick to 2.0 seconds after it. The lag search covers corrections from −0.5 to +0.5 seconds. The minimum coefficient is 0.70."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "command": "[P]\nband_hz = [2.0, 14.0]\nwindow_s = [-0.5, 2.0]\nmax_lag_s = 0.5\nmin_cc = 0.70",
    "commandHeight": 165,
    "bodyY": 367,
    "codeSize": 23
  },
  {
    "title": "An experiment with the correlation threshold",
    "body": [
      "In DDCorr.toml, change only [P] min_cc from 0.70 to 0.90. Save the file and repeat the correlation command. Open report.html in the newly printed result folder.",
      "Compare the P observation count, coefficient distribution and event connectivity with your first run. The S settings have not changed.",
      "Restore [P] min_cc to 0.70 before continuing. The default report chooses representative accepted examples automatically. To examine a particular pair, use the next exercise."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Requesting specific event-pair figures",
    "body": [
      "Edit these lines in the existing [plots] section of DDCorr.toml. The pair numbers are the event_id indices in this run’s event_id_map.csv.",
      "Repeat the correlation command and open the new report.html. You should see four requested examples if both pairs pass for both phases at S01. Explicit pair requests override max_examples, which applies only to automatic selection."
    ],
    "section": "QUICK START",
    "size": 25,
    "gap": 22,
    "command": "[plots]\nevent_pairs = [[1, 2], [2, 3]]\noriginal_event_pairs = []\nexample_stations = [\"XX.S01\"]\nexample_phases = [\"P\", \"S\"]\nmax_examples = 12",
    "commandHeight": 196,
    "bodyY": 398,
    "codeSize": 23
  },
  {
    "title": "Requesting a figure by original event name",
    "body": [
      "As an alternative, use the original folder names above. Repeat the correlation command and open the new report. In the requested correlation figure, the title includes indices 1/2 and folders 1201/17.",
      "The selection is listed in example_selection.csv. Requested pairs still have to pass the measurement checks. Use specific examples to investigate unusually low or high coefficients and large lags."
    ],
    "section": "QUICK START",
    "size": 25,
    "gap": 22,
    "command": "[plots]\nevent_pairs = []\noriginal_event_pairs = [[\"1201\", \"17\"]]\nexample_stations = [\"XX.S01\"]\nexample_phases = [\"P\"]",
    "commandHeight": 165,
    "bodyY": 367,
    "codeSize": 23
  },
  {
    "title": "Understanding the rejection counts",
    "body": [
      "Open group_summary.csv in the correlation result folder. Each row describes one station, one phase and one status. The count is the number of pairs in that category.",
      "For XX.S01 P in the unchanged synthetic run, files=6 and prepared_events=5: the noise trace failed preprocessing. The accepted count is 10, equal to all pairs among the five prepared events.",
      "A low_cc count means the maximum coefficient was below min_cc. A boundary count means the winning sample was at a search edge. An ambiguous_peak count means a competing peak was too similar in height."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Finding why a trace or figure is missing",
    "body": [
      "Read phase_readiness.csv for missing picks and insufficient time coverage. Read preprocessing_issues.csv for failed filtering, padding or signal-to-noise checks.",
      "Read example_selection.csv when a requested figure is absent. Figure selection cannot force a rejected correlation to pass.",
      "The complete file definitions are in docs/OUTPUTS_AND_HANDOFF.md and at the web address below."
    ],
    "section": "QUICK START",
    "size": 27,
    "gap": 22,
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/OUTPUTS_AND_HANDOFF.md"
    ],
    "notes": "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/OUTPUTS_AND_HANDOFF.md\nReference: https://github.com/eliasrh/DDCorr.jl/blob/main/docs/OUTPUTS_AND_HANDOFF.md",
    "link": "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/OUTPUTS_AND_HANDOFF.md"
  },
  {
    "title": "Find real data and prepare SAC",
    "body": [
      "Next we will choose real earthquakes, identify recording stations and download short waveform snippets. We will use an Iceland example first, then explain what changes for another study area."
    ],
    "cover": true,
    "subtitle": "Section 2 · DDCorr.jl minicourse",
    "section": "DATA AND SAC",
    "oldSlide": 18
  },
  {
    "title": "The real-data example: Bárðarbunga, Iceland",
    "body": [
      "During the 2014 rifting episode, earthquakes accompanied the lateral propagation of a magma intrusion. Ágústsdóttir and colleagues published a catalogue for this sequence.",
      "We will start with five events after 12:00 UTC on 23 August 2014 and three nearby stations in temporary network Z7. This is a small download test before expanding the selection.",
      "The catalogue gives event times and locations. We still need recording-channel metadata, waveforms and a deliberate choice of phase-window centres."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "sources": [
      "https://doi.org/10.1029/2018JB016010"
    ],
    "link": "https://doi.org/10.1029/2018JB016010",
    "notes": "\nReference: https://doi.org/10.1029/2018JB016010"
  },
  {
    "title": "The information needed to construct event SAC files",
    "body": [
      "For each event, we need an identifier, origin time, latitude, longitude and depth. You can obtain these from a regional catalogue or an earthquake database.",
      "For each recording channel, we need its network/station codes, position, orientation, sampling rate and operating dates. These are available as StationXML metadata.",
      "We also need the recorded samples, usually supplied as miniSEED, and P/S times to centre the comparison windows. In scripts/download_sac.py, we combine this information into SAC files."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22
  },
  {
    "title": "What an FDSN service is",
    "body": [
      "FDSN is the International Federation of Digital Seismograph Networks. Its service standards let different data centres accept similar requests for earthquakes, stations or waveforms.",
      "You make a request by opening an HTTPS address with search fields such as dates, coordinates and channel codes. The data centre returns a file.",
      "An event request returns earthquake information. A station request returns instrument metadata. A dataselect request returns waveform samples. We use separate requests because these are different data products."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "sources": [
      "https://www.fdsn.org/webservices/"
    ],
    "link": "https://www.fdsn.org/webservices/",
    "notes": "\nReference: https://www.fdsn.org/webservices/"
  },
  {
    "title": "Finding data for your own study area",
    "body": [
      "Start with a catalogue that includes the event population you want to study. For small local events, ask the regional network or data provider. The USGS earthquake search is another starting point.",
      "Record the catalogue source, time reference and depth units. Look for downloadable QuakeML, or a table with the event fields explained on the preceding slide.",
      "Then find which stations recorded during that interval. At EarthScope, use the station query builder below. A station listed in metadata may still have waveform gaps."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "sources": [
      "https://earthquake.usgs.gov/earthquakes/search/",
      "https://service.earthscope.org/fdsnws/station/1/builder"
    ],
    "link": "https://service.earthscope.org/fdsnws/station/1/builder",
    "notes": "\nReference: https://service.earthscope.org/fdsnws/station/1/builder"
  },
  {
    "title": "EarthScope services and the included scripts",
    "body": [
      "For this example, the recordings are hosted at EarthScope, formerly IRIS. You can inspect the service documentation at service.earthscope.org.",
      "Use scripts/prepare_tables.py to prepare event and station CSV tables. Use scripts/download_sac.py to request miniSEED and metadata and write the event SAC files.",
      "These are optional Python utilities. DDCorr itself runs in Julia after the SAC files exist. The following setup installs ObsPy, the Python library used to read and write seismic formats."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "sources": [
      "https://service.earthscope.org/"
    ],
    "link": "https://service.earthscope.org/",
    "notes": "\nReference: https://service.earthscope.org/"
  },
  {
    "title": "Installing the optional Python tools: macOS/Linux",
    "body": [
      "Run these commands from the DDCorr.jl folder using Python 3.12. The first creates .venv. The second installs ObsPy, NumPy, SciPy and other required Python packages there.",
      "The third checks the installation. Expect 1.5.1. In every following archive command, use .venv/bin/python explicitly. A plain python3 command may use a different installation without ObsPy."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "command": "python3.12 -m venv .venv\n.venv/bin/python -m pip install -r requirements-download.txt\n.venv/bin/python -c \"import obspy; print(obspy.__version__)\"",
    "commandHeight": 103,
    "bodyY": 305,
    "codeSize": 23
  },
  {
    "title": "Windows and Python command paths",
    "body": [
      "The download commands in the main slides use macOS/Linux paths. In Windows PowerShell, first create the environment with py -3.12 -m venv .venv.",
      "For each subsequent Python command, replace .venv/bin/python with .\\.venv\\Scripts\\python.exe. The complete single-line PowerShell commands are in docs/WINDOWS.md.",
      "You do not need to activate the environment. By naming the executable explicitly, you select the Python installation containing ObsPy. If the import check fails, stop and fix installation before requesting data."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Obtaining the published catalogue",
    "body": [
      "Open doi.org/10.1029/2018JB016010 in a browser. In Supporting Information, download Data Set S1, the text file whose name ends in Data_Set_SI-S01.txt.",
      "The command above creates a work folder inside DDCorr.jl. Save the downloaded text file there as S1.txt. Check that the path is work/S1.txt, rather than work/S1.txt.txt.",
      "This catalogue has no observed P/S pick table. If publisher access fails, ask the instructor for this same S1 text file before continuing."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "command": "mkdir -p work",
    "commandHeight": 41,
    "bodyY": 243,
    "codeSize": 23,
    "sources": [
      "https://doi.org/10.1029/2018JB016010"
    ],
    "link": "https://doi.org/10.1029/2018JB016010",
    "notes": "\nReference: https://doi.org/10.1029/2018JB016010"
  },
  {
    "title": "Reading the published catalogue format",
    "body": [
      "This is one catalogue row, not a command. The first field is day of year, followed by UTC date/time, latitude, longitude, depth and two further fields.",
      "The s1 option in scripts/prepare_tables.py is a parser written specifically for this published format. It reads depth in kilometres and magnitude from the last field. The seventh field is retained only in the original source file.",
      "For a different catalogue format, first convert its documented columns to our events.csv layout, or use the QuakeML importer. The s1 parser is not a general text-catalogue reader."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "command": "#228 2014-08-16 03:54:41.750 64.6134 -17.3512 3.127 0.35250 1.670",
    "commandHeight": 41,
    "bodyY": 243,
    "codeSize": 19
  },
  {
    "title": "Selecting five events for the first download",
    "body": [
      "Copy the whole command, including .venv/bin/python. On macOS/Linux, each backslash continues the same command on the next line. Do not type spaces after it.",
      "We select the first five events chronologically in this UTC interval. Open work/tables/events.csv and events_receipt.json to inspect the rows and source information. The empty picks.csv contains only headings."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "command": ".venv/bin/python scripts/prepare_tables.py s1 \\\n  --input work/S1.txt --start 2014-08-23T12:00:00Z \\\n  --end 2014-08-23T15:00:00Z --limit 5 --output work/tables",
    "commandHeight": 103,
    "bodyY": 305,
    "codeSize": 23,
    "notes": ""
  },
  {
    "title": "The event CSV and adaptation to another catalogue",
    "body": [
      "In work/tables/events.csv, each row has event_id, origin_utc, latitude, longitude, depth_km, magnitude and source. The source field identifies where the event information came from.",
      "Here, S1_009900 means line 9900 of the downloaded S1 file. We create a folder-safe label because this source has no unique event-ID field. This label is separate from the later DDCorr integer index.",
      "For another study, prepare the same CSV columns with your own documented event IDs and UTC origins. You can also import QuakeML using prepare_tables.py quakeml."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Alternative: requesting a USGS event catalogue",
    "body": [
      "This is an alternative to the S1 example. For another region, change the dates and coordinate bounds after checking coverage at earthquake.usgs.gov/earthquakes/search/.",
      "The request returns up to 100 events as QuakeML. The files are written under work/usgs_tables. A global catalogue may omit small local events. Continue the Iceland exercise using work/tables."
    ],
    "command": ".venv/bin/python scripts/prepare_tables.py events \\\n  --service https://earthquake.usgs.gov \\\n  --start 2014-08-23T00:00:00Z --end 2014-08-24T00:00:00Z \\\n  --min-lat 64 --max-lat 66 --min-lon -18 --max-lon -16 \\\n  --limit 100 --output work/usgs_tables",
    "commandHeight": 165,
    "bodyY": 365,
    "codeSize": 23,
    "size": 27,
    "sources": [
      "https://earthquake.usgs.gov/fdsnws/event/1/"
    ],
    "notes": "The event route requests QuakeML and records the URL. It uses the preferred origin or explicitly falls back to the first. Save an existing QuakeML catalogue and use prepare_tables.py quakeml --input FILE for a local import. The USGS event query is an illustrative alternative; the validated 100-event example uses regional S1.\nReference: https://earthquake.usgs.gov/fdsnws/event/1/",
    "section": "DATA AND SAC",
    "oldSlide": 26,
    "link": "https://earthquake.usgs.gov/fdsnws/event/1/"
  },
  {
    "title": "Where would a pick table come from?",
    "body": [
      "Ask the data provider for phase bulletins or QuakeML containing arrival picks linked to the event origins. A location catalogue alone may have no phase information.",
      "For observed picks, prepare picks.csv with event_id, network, station, location, phase, arrival_utc and provenance. For example, provenance can identify the analyst or automatic picker.",
      "The QuakeML importer exports associated P/S arrivals when available. Review their source and phase names. With no observed arrivals, the pick CSV contains only headings."
    ],
    "sources": [
      "https://earthquake.usgs.gov/fdsnws/event/1/"
    ],
    "notes": "The importer follows arrivals attached to the preferred/first origin and exports P/S phase names only. Multiple picks for the same event/network/station/location/phase require explicit resolution. “Observed” can be analyst or automatic, but the method and source must be documented. A header-only picks.csv is not a usable measured-pick table.\nReference: https://earthquake.usgs.gov/fdsnws/event/1/",
    "section": "DATA AND SAC",
    "oldSlide": 27,
    "link": "https://earthquake.usgs.gov/fdsnws/event/1/"
  },
  {
    "title": "How this example handles missing phase picks",
    "body": [
      "For this teaching download, we explicitly choose --pick-mode predicted. The converter estimates straight-ray travel times using distance and constant P/S velocities to centre the windows.",
      "These approximate times are labelled as predictions in the SAC headers and acquisition manifest. They are not the measured picks or velocity model used in the published catalogue.",
      "Before scientific use, inspect the phase timing and use an appropriate model or measured picks. A correlation peak outside max_lag_s cannot be found, even if an unrelated peak inside the search passes."
    ],
    "notes": "The converter includes station elevation in straight-ray distance. This is a clearly labelled demonstration route, not a model-free picker. Use --pick-mode observed --picks FILE when measured picks are available. The core correlation engine does not claim predicted or observed SAC header values are correct merely because they exist.",
    "section": "DATA AND SAC",
    "oldSlide": 28
  },
  {
    "title": "Identify a complete recording channel",
    "body": [
      "A complete channel name contains network.station.location.channel. For example, Z7.DYSA..HHZ has network Z7, station DYSA, a blank location code and vertical channel HHZ.",
      "The network distinguishes groups of stations, and the location code distinguishes instruments or installations at one station. StationXML contains their coordinates and orientations for specific operating dates.",
      "In a request, HH? matches channels beginning with HH. Quote the question mark so the terminal does not interpret it. A blank FDSN location is requested with --location=--."
    ],
    "sources": [
      "https://service.earthscope.org/fdsnws/station/1/"
    ],
    "notes": "In FDSN URL parameters, -- denotes blank location; pass --location=-- to avoid command-line parsing ambiguity. A trailing Z/N/E is a convention, not a substitute for orientation metadata. Some networks use 1/2 horizontal suffixes; select those deliberately and inspect azimuth/inclination.\nReference: https://service.earthscope.org/fdsnws/station/1/",
    "section": "DATA AND SAC",
    "oldSlide": 29,
    "link": "https://service.earthscope.org/fdsnws/station/1/"
  },
  {
    "title": "Choosing three nearby three-component stations",
    "body": [
      "This requests station metadata from EarthScope and selects the three nearest eligible stations to the stated point. Each must have Z, N and E channels at a common location throughout the interval.",
      "Open work/tables/stations.csv and stations_receipt.json. Check the channel codes, coordinates, sample rates and selection. For another region, change network, dates and selection point."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "command": ".venv/bin/python scripts/prepare_tables.py stations \\\n  --network Z7 --channels \"HH?\" --start 2014-08-23T11:59:00Z \\\n  --end 2014-08-23T15:01:00Z --near-lat 64.85 \\\n  --near-lon -16.85 --limit 3 --output work/tables",
    "commandHeight": 134,
    "bodyY": 336,
    "codeSize": 23,
    "notes": ""
  },
  {
    "title": "Downloading snippets and writing SAC files",
    "body": [
      "Five events and three stations give at most 15 event–station selections and 45 SAC component files. Requests are sequential and limited to 64 MiB of archive input. Extracted SAC files can occupy more space.",
      "The default snippet spans 25 seconds before to 70 seconds after each event origin. The converter adds event and station metadata and the explicitly predicted P/S times. Missing recordings are recorded as skipped selections."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "command": ".venv/bin/python scripts/download_sac.py \\\n  --events work/tables/events.csv --stations-file work/tables/stations.csv \\\n  --network Z7 --channels \"HH?\" --location=-- --pick-mode predicted \\\n  --max-combinations 15 --total-mib 64 --output work/iceland_demo",
    "commandHeight": 134,
    "bodyY": 336,
    "codeSize": 23,
    "notes": ""
  },
  {
    "title": "Checking the downloaded files",
    "body": [
      "Open work/iceland_demo/manifest.json. This JSON text file contains request information, source hashes, SAC filenames, phase-time sources and missing selections.",
      "The waveform files are in work/iceland_demo/sac/<event_id>/*.sac. Check the manifest file list before choosing a file to inspect. The number of files can be smaller than the requested maximum.",
      "Repeat the identical download command to verify cache reuse. Identical requests reuse hash-checked inputs. Changed or merely overlapping requests can require new downloads."
    ],
    "notes": "An identical repeat verifies cached bytes and avoids another waveform download. A changed request is a different cache key, even if it overlaps in time. The current helper does not assemble arbitrary overlapping remote cache requests. Output definitions must match before an existing output directory is reused.",
    "section": "DATA AND SAC",
    "oldSlide": 32
  },
  {
    "title": "Reusing your own miniSEED archive",
    "body": [
      "If you already have miniSEED and station metadata, add both --waveform-dir path/to/archive and --stationxml path/to/stations.xml to the download_sac.py command.",
      "With both options, the converter reads local .mseed files and makes no archive requests. StationXML must cover the selected dates and channels. It records input hashes in manifest.json.",
      "Choose bounded event intervals and check for missing or gapped recordings. The converter rejects gaps. It does not replace missing samples with artificial values."
    ],
    "notes": "Local archive files must end in .mseed and have complete channel metadata. The converter is bounded by selected input bytes and processes stations sequentially. A very long selected interval at one station can still consume substantial memory; use course-sized intervals rather than treating this helper as an unbounded archive processor.",
    "section": "DATA AND SAC",
    "oldSlide": 33
  },
  {
    "title": "What is inside a SAC header?",
    "body": [
      "The header is metadata inside the binary file. The sample array follows it; a text editor is not a SAC reader."
    ],
    "table": [
      [
        "Meaning",
        "Header fields",
        "Units / reference"
      ],
      [
        "Sampling and trace start",
        "DELTA, NPTS, B, NZ*",
        "s/sample; B from NZ reference"
      ],
      [
        "Event origin and position",
        "O, EVLA, EVLO, EVDP",
        "O from NZ reference; confirm depth units"
      ],
      [
        "Station and component",
        "STLA, STLO, STEL, CMPAZ/INC",
        "Elevation in m; angles in degrees"
      ],
      [
        "Phase-window centres",
        "A (P), T0 (S), by default",
        "Seconds from the same NZ reference"
      ]
    ],
    "widths": [
      330,
      410,
      412
    ],
    "tableHeight": 350,
    "bodyY": 555,
    "notes": "DDCorr accepts evenly sampled binary SAC v6/v7 and decodes byte order. The converter writes event depth in km and station elevation in metres. Header presence cannot detect an incorrectly supplied physical unit. Missing fields are not recovered from filenames.",
    "section": "DATA AND SAC",
    "oldSlide": 34
  },
  {
    "title": "Inspecting a downloaded SAC file",
    "body": [
      "Replace EVENT and NET.STA..HHZ.sac with one actual path from manifest.json. The quoted path is a placeholder, not a file guaranteed to exist.",
      "The terminal output includes timing, station/event coordinates and A/T0–T9 times with their text labels. Open work/one_real_sac.png to see the waveform and selected phase markers."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "command": "julia --project=. bin/sac_info.jl \\\n  \"work/iceland_demo/sac/EVENT/NET.STA..HHZ.sac\" \\\n  --p-header a --s-header t0 --plot work/one_real_sac.png",
    "commandHeight": 103,
    "bodyY": 305,
    "codeSize": 23
  },
  {
    "title": "Reference, trace start, origin and pick differ",
    "body": [
      "NZ fields define a reference UTC. B is the first-sample offset from that reference. O is the event-origin offset; A and T0 are phase offsets.",
      "Absolute P time = reference + A. P travel time from the catalogue = A − O when all offsets share that reference.",
      "The trace can begin before the origin. Do not interpret A as seconds from the first sample or reset the reference without updating all offsets."
    ],
    "notes": "sac_info.jl prints both relative and absolute times so students can verify this directly. The conversion code keeps one NZ reference and updates O/A/T0 consistently. SAC stores many header numbers as Float32, so additional display decimals are not evidence of additional measurement precision.",
    "section": "DATA AND SAC",
    "oldSlide": 36
  },
  {
    "title": "A separate settings file for the real data",
    "body": [
      "Duplicate DDCorr.toml as Iceland.toml in the same repository folder. In Iceland.toml, edit the existing [input] section to match the lines above. These pick fields match the included SAC converter.",
      "In [plots], reset event_pairs=[], original_event_pairs=[] and example_stations=[]. Set example_phases=[\"P\", \"S\"]. This removes the synthetic figure requests from the earlier exercise."
    ],
    "section": "DATA AND SAC",
    "size": 27,
    "gap": 22,
    "command": "[input]\nsac_dir = \"work/iceland_demo/sac\"\np_pick_header = \"a\"\ns_pick_header = \"t0\"",
    "commandHeight": 134,
    "bodyY": 336,
    "codeSize": 23
  },
  {
    "title": "Run real correlations and assess them",
    "body": [
      "We now have an event SAC directory and a separate Iceland.toml settings file. First inspect the real inputs, then calculate and review the measurements."
    ],
    "cover": true,
    "subtitle": "Section 3 · DDCorr.jl minicourse",
    "section": "REAL CORRELATIONS",
    "oldSlide": 37
  },
  {
    "title": "Inspecting and correlating the downloaded events",
    "body": [
      "Run the first command and inspect phase_readiness.csv in its printed inspect_… folder. Then run the second command and open report.html in its printed correlate_… folder.",
      "The event count depends on the available recordings. Accepted correlations also depend on phase-window placement and signal quality. The following 100-event figures are a reference example, not expected counts for this small download."
    ],
    "section": "REAL CORRELATIONS",
    "size": 27,
    "gap": 22,
    "command": "julia --project=. bin/ddcorr.jl Iceland.toml --inspect\njulia --project=. --threads=4 bin/ddcorr.jl Iceland.toml",
    "commandHeight": 72,
    "bodyY": 274,
    "codeSize": 23
  },
  {
    "title": "Reference: a larger 100-event Iceland run",
    "body": [
      "100 chronologically selected events; 12 selected stations; 11 with cached waveform coverage; 3,300 generated SAC files.",
      "Default processing accepted 2,412 P and 4,625 S observations: 7,037 total, linking 1,914 distinct event pairs.",
      "These use explicitly labelled predicted window centres. This demonstrates the workflow and its diagnostics; it does not independently validate the phases or relocated locations."
    ],
    "notes": "Actual validation: October 22, 2026; Julia 1.12.3 on macOS Apple Silicon, four Julia threads. Station/phase correlation took about 8.4 s after package loading; full wall time with graphics was about 43 s on this run. These are observations, not a portable benchmark. 52,588,544 selected cached archive bytes; zero newly downloaded waveform bytes. Receipts in examples/download/iceland100.",
    "section": "REAL CORRELATIONS",
    "oldSlide": 39
  },
  {
    "title": "Reference: a near-perfect match requiring review",
    "body": [
      "These catalogue origins are only 0.06 s apart. Their windows may capture the same physical arrival; this pair is flagged in near_identity.csv."
    ],
    "image": "teaching/assets/real_strong.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "Actual strongest stored example, events 44 and 45: S1 source lines 9943 and 9944, origins 12:28:55.940 and 12:28:56.000 UTC. The run flags 22 station/phase near-identity observations in total. High similarity is not independent evidence for two distinct earthquakes. This example is deliberately retained as QC evidence; no automatic event deletion was performed. The curve averages SNR-qualified components; displayed samples are the first common component.",
    "section": "REAL CORRELATIONS",
    "oldSlide": 40
  },
  {
    "title": "Reference: a noisy correlation near threshold",
    "body": [
      "r near 0.70 is visibly imperfect. Check phase identity, waveform shape and competing lag peaks before trusting the measurement."
    ],
    "image": "teaching/assets/real_weak.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "Actual weakest stored automatic example from the validated run. This replaces a noiseless-only discussion. A high coefficient is neither an uncertainty estimate nor proof of a real event. Automatic examples sample accepted observations; they do not show every rejected or problematic pair.",
    "section": "REAL CORRELATIONS",
    "oldSlide": 41
  },
  {
    "title": "Reference: the lag distribution",
    "body": [
      "The search limit is ±0.5 s. Accumulation near an edge would motivate checking pick placement and the full lag curves."
    ],
    "image": "teaching/assets/real_lags.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "Actual accepted observations from the 100-event run, separated by P and S. Boundary maxima are rejected before export. A histogram of accepted lags is therefore conditioned on quality criteria and cannot by itself describe all original pick errors.",
    "section": "REAL CORRELATIONS",
    "oldSlide": 42
  },
  {
    "title": "Reference: a station/phase correlation matrix",
    "body": [
      "Rows and columns are event_id values. Coloured cells are accepted correlations; grey cells are absent measurements, including self-pairs."
    ],
    "image": "teaching/assets/real_matrix.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "Z7.DYSA P, 100 events. The matrix is symmetric because exchanging event order preserves coefficient; the signed dt and lag matrices are antisymmetric. Missing cells may reflect unavailable components, preprocessing rejection, quality rejection, or no measurement. They are not zero similarity. Block structure can motivate graph inspection, not automatic event deletion.",
    "section": "REAL CORRELATIONS",
    "oldSlide": 43
  },
  {
    "title": "Make PNG matrices and optional dense CSVs",
    "body": [
      "Edit the existing [matrices] section of Iceland.toml as shown. Save it, repeat the Iceland.toml correlation command, then open report.html in the new result folder.",
      "With enabled=true, sparse entries are exported. With plots=true, PNG matrices appear in the report. With dense=true, square CSV matrices are also exported."
    ],
    "command": "[matrices]\nenabled = true\nplots = true\ndense = true\nmax_plot_events = 500\nmax_plot_groups = 24",
    "commandHeight": 196,
    "bodyY": 396,
    "codeSize": 23,
    "size": 25,
    "notes": "These are exact TOML keys in the existing [matrices] section. Dense arrays use NA for missing data/diagonal. max_dense_events and max_dense_cells independently bound dense CSV export. matrices/matrix_plots.csv records rendered/skipped groups. All figures are raster PNG, with no PDF or SVG output.",
    "section": "REAL CORRELATIONS",
    "oldSlide": 44
  },
  {
    "title": "If a requested pair has no figure",
    "body": [
      "Confirm event_id in event_id_map.csv, or use original_event_pairs with quoted folder names. Check example_stations and example_phases.",
      "Read example_selection.csv. A request with no accepted observation is reported, rather than silently replaced by another pair.",
      "Use phase_readiness.csv, preprocessing_issues.csv and group_summary.csv to explain losses. Optional rejected_pairs.csv gives per-pair decisions."
    ],
    "notes": "To enable the optional rejection ledger, put [output] write_rejected_pairs=true in an advanced override file and reference it with [advanced] file=\"advanced.toml\" in the current public TOML, here Iceland.toml. This can be large for many events. Do not confuse a figure selector with an acceptance override.",
    "section": "REAL CORRELATIONS",
    "oldSlide": 45
  },
  {
    "title": "The handoff has a specific sign and weight",
    "body": [
      "dt.cc stores travel time of event i minus travel time of event j. catalog.txt and event_id_map.csv define the same sequential IDs.",
      "By default the weight is r². The generated ddsync.toml uses base_mode=\"cc\" so that exported weight is applied once.",
      "graphsplit_inputs.toml is an input fragment; combine it with your velocity model and GraphSplit solver settings. Isolated events remain in the catalogue."
    ],
    "notes": "The correlation engine writes reduced travel-time differences, not raw absolute arrival differences. Do not square the exported r² again by choosing a downstream cc2 mode without understanding its effect. Four-decimal timing output is representation, not an uncertainty claim. DDSync/GraphSplit compatibility is documented in OUTPUTS_AND_HANDOFF.md.",
    "section": "REAL CORRELATIONS",
    "oldSlide": 46
  },
  {
    "title": "Expanding the real-data test",
    "body": [
      "After the small download works, select 100 events with the same s1 command using --limit 100, and select 12 stations using --limit 12. Keep the tables in a separate directory such as work/tables100.",
      "Use those tables in download_sac.py with --max-combinations 1200, --total-mib 256 and --output work/iceland100. Use a separate TOML with sac_dir=\"work/iceland100/sac\".",
      "Exact file and correlation counts can vary with archive coverage and metadata changes. The reference figures show a prior 100-event run, rather than a promise of a fixed result for every download."
    ],
    "section": "REAL CORRELATIONS",
    "size": 27,
    "gap": 22
  },
  {
    "title": "Follow one waveform through the code",
    "body": [
      "Now that we have run and inspected the outputs, we can explain each operation and the parameter it controls."
    ],
    "cover": true,
    "subtitle": "Section 4 · DDCorr.jl minicourse",
    "section": "METHODS",
    "oldSlide": 47
  },
  {
    "title": "The processing sequence has a purpose",
    "body": [
      "We read a SAC trace and its phase pick, remove the mean and linear trend, reduce its ends smoothly with a taper, and filter it in the selected phase band.",
      "Apply anti-alias resampling if reducing the sampling rate. Extract a fixed comparison window, a wider lag-search window, and pre-P noise.",
      "Compare matched components at trial lags, combine usable component curves, choose a clear peak, refine its lag and export the differential time."
    ],
    "notes": "This is the sequence in src/signal.jl and src/pipeline.jl. Whole-trace filtering precedes window extraction so the short core is not filtered as an isolated discontinuous snippet. All interpolation and coverage checks refer to actual sample times.",
    "section": "METHODS",
    "oldSlide": 48
  },
  {
    "title": "One SAC: raw, detrended and bandpassed",
    "body": [
      "All three panels follow synthetic/1201/XX.S01..HHZ.sac. The dashed line is its P pick; processing changes the samples, not the pick time."
    ],
    "image": "teaching/assets/trace_stages.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "Exported using DDCorr.filtered_trace and the actual detrend function. The full trace is processed before this zoomed display. Source in teaching/source/export_trace.jl; values in the teaching build data. Signals are the synthetic course input, not field data.",
    "section": "METHODS",
    "oldSlide": 49
  },
  {
    "title": "Remove baseline and linear drift",
    "body": [
      "A large constant offset or gradual drift should not determine a short arrival comparison. Subtract the mean and least-squares linear trend.",
      "This operation prepares the entire trace; Pearson normalization later also centres each compared window."
    ],
    "code": {
      "file": "src/signal.jl",
      "anchors": [
        [
          "function detrend(x)",
          7
        ]
      ]
    },
    "codeTop": 330,
    "codeHeight": 285,
    "size": 27,
    "section": "METHODS",
    "oldSlide": 50
  },
  {
    "title": "Taper the ends of the available trace",
    "body": [
      "A cosine taper smoothly reduces the trace ends. It reduces artificial edge jumps; it is not an arrival detector."
    ],
    "image": "teaching/assets/taper.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "Actual synthetic trace before and after DDCorr.taper!. The default taper is 2% at each end of the full trace. A core too close to an edge is still unsuitable. Do not replace missing waveform padding with zeros and assume tapering fixes it.",
    "section": "METHODS",
    "oldSlide": 51
  },
  {
    "title": "The taper is a smooth sample weight",
    "body": [
      "The weight rises smoothly from near zero to one at the left edge and falls symmetrically at the right edge.",
      "Advanced setting: [preprocess] trace_taper_fraction=0.02. Later we require real data beyond the noise and phase windows."
    ],
    "code": {
      "file": "src/signal.jl",
      "anchors": [
        [
          "function taper!(x,fraction)",
          8
        ]
      ]
    },
    "codeTop": 330,
    "codeHeight": 285,
    "size": 27,
    "section": "METHODS",
    "oldSlide": 52
  },
  {
    "title": "Choose a band for the signal you are comparing",
    "body": [
      "A bandpass suppresses frequencies below the low corner and above the high corner, while retaining a middle band.",
      "[P] band_hz=[2.0,14.0] and [S] band_hz=[2.0,14.0] are the course starting point. Different sources, paths and instruments can justify other bands.",
      "A narrow band can make unrelated oscillatory signals look similar. Inspect both the waveform and lag curve when changing the band."
    ],
    "notes": "Corners are transition frequencies, not a brick wall. In this implementation they parameterize a Butterworth prototype. The native sample rate must support the requested band; the code errors instead of silently clipping it. Filter settings do not prove phase identity.",
    "section": "METHODS",
    "oldSlide": 53
  },
  {
    "title": "One pass and forward–reverse filtering differ",
    "body": [
      "At a Butterworth corner, one-pass amplitude gain is about 0.707. Two passes give about 0.5: the gains multiply."
    ],
    "image": "teaching/assets/filter_gain.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "Actual DSP.jl frequency response for the configured native-rate 2–14 Hz Butterworth filter. A gain of 0.5 means half the sinusoidal amplitude, not half the power. The forward–reverse application is the same configured bandpass run twice; it is not a separate choice of band.",
    "section": "METHODS",
    "oldSlide": 54
  },
  {
    "title": "A filter changes amplitude and phase",
    "body": [
      "H(f) is the complex response at frequency f. Its magnitude scales a sinusoid; its angle φ(f) shifts that sinusoid in time.",
      "Phase delay τφ is that phase shift expressed in seconds. It may differ by frequency, changing a transient’s shape."
    ],
    "image": "teaching/assets/math_phase.png",
    "position": {
      "left": 64,
      "top": 155,
      "width": 1152,
      "height": 180
    },
    "bodyY": 370,
    "size": 28,
    "notes": "Equation source: teaching/assets/equations.json. f is in Hz, φ in radians. The formula applies to a sinusoidal component at f>0. Phase delay and group delay are not generally identical; only phase delay is needed for this explanation.",
    "section": "METHODS",
    "oldSlide": 55
  },
  {
    "title": "Why filtering in both directions helps",
    "body": [
      "A forward pass applies H; a reverse pass applies its complex conjugate for a real-coefficient filter. The phases cancel and the magnitudes multiply.",
      "This gives zero net phase in the ideal interior and squared amplitude gain. Finite trace edges still need taper and real padding."
    ],
    "image": "teaching/assets/math_filter.png",
    "position": {
      "left": 64,
      "top": 155,
      "width": 1152,
      "height": 180
    },
    "bodyY": 370,
    "size": 28,
    "notes": "The DDCorr call is DSP.filtfilt. H* denotes complex conjugate, X/Y are Fourier-domain input/output. Four is the Butterworth prototype order; bandpass transformation and forward–reverse filtering each increase effective order. This explains the previous response plot rather than introducing an unrelated filter.",
    "section": "METHODS",
    "oldSlide": 56
  },
  {
    "title": "Filter at the native sampling rate",
    "body": [
      "Filtering uses the original sample interval before any downsampling. The filter is represented as second-order sections for numerical stability.",
      "In DDCorr.toml or Iceland.toml, band_hz sets the filter corners. If needed, use [phase.P] or [phase.S] filter_order in an advanced TOML to change the Butterworth prototype order."
    ],
    "code": {
      "file": "src/signal.jl",
      "anchors": [
        [
          "function filtered_trace(h,pc,prep)",
          5
        ]
      ]
    },
    "codeTop": 330,
    "codeHeight": 285,
    "size": 27,
    "section": "METHODS",
    "oldSlide": 57
  },
  {
    "title": "Aliasing: a high frequency can look low",
    "body": [
      "At 20 samples/s, frequencies above 10 Hz cannot be represented uniquely. Filtering before discarding samples suppresses those ambiguous frequencies."
    ],
    "image": "teaching/assets/aliasing.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "Upper panel: 12 Hz and a phase-reversed 8 Hz sine have the same values at a 20 Hz grid. Lower panel: a constructed 3+12 Hz signal, naive decimation versus a polyphase FIR low-pass/downsample. This conceptual example uses SciPy; production DDCorr uses DSP.jl resample, separately verified numerically.",
    "section": "METHODS",
    "oldSlide": 58
  },
  {
    "title": "What the anti-alias filter does",
    "body": [
      "Before reducing sample rate, a low-pass filter attenuates frequencies above the new Nyquist frequency: half the new sampling rate.",
      "DDCorr uses DSP.resample, a delay-compensated polyphase FIR resampler. FIR means a finite set of weights applied to nearby samples.",
      "The signal bandpass and anti-alias filter have different jobs. The first selects useful seismic frequencies; the second protects the coarser sampling grid."
    ],
    "notes": "This is not a claim that filtering can recover information already aliased in the original recording. At the default 50 Hz target, Nyquist is 25 Hz, above the 14 Hz upper band corner. A low-pass finite impulse response filter has a transition band; the library designs the resampling filter for the ratio.",
    "section": "METHODS",
    "oldSlide": 59
  },
  {
    "title": "Resample without moving the time origin",
    "body": [
      "sample_rate_hz controls the target grid. If it already equals the native rate, no resampling is applied.",
      "The returned sample interval and original SAC B define the new times. Picks are then sampled on a common pick-relative grid."
    ],
    "code": {
      "file": "src/signal.jl",
      "anchors": [
        [
          "ratio=rationalize(target/native_fs",
          4
        ]
      ]
    },
    "codeTop": 330,
    "codeHeight": 285,
    "size": 27,
    "notes": "DDCorr does not upsample beyond the native rate by default. Rationalization supplies a ratio for the polyphase resampler. Linear interpolation extracts windows when a pick falls between samples; this is different from interpolation of the correlation peak.",
    "section": "METHODS",
    "oldSlide": 60
  },
  {
    "title": "Three windows, each with a different job",
    "body": [
      "In the code, core means comparison window. The search window permits shifts. Pre-P noise estimates background strength."
    ],
    "image": "teaching/assets/windows.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "P defaults: core [−0.5,2.0], lag ±0.5 gives extended [−1.0,2.5]; noise [−8,−2]; 5 s filter margin requires coverage at least [−13,7.5] relative to P. Diagram rounds the right endpoint to 8 for display. For S, the core is centred on S but noise is still referenced to P, avoiding P coda as S background.",
    "section": "METHODS",
    "oldSlide": 61
  },
  {
    "title": "Use the pick as a centre, not as proof",
    "body": [
      "The supplied pick defines the starting alignment. We compare the configured comparison window with shifted portions of the other event’s longer search window.",
      "A very short comparison window may contain too few distinctive cycles. A very long window may include another event or a different phase.",
      "max_lag_s limits the correction around the supplied picks. Widening it can reveal a stronger peak, but can also introduce competing matches. Inspect those peaks before accepting the measurement."
    ],
    "notes": "The whole search interval must exist in actual data. filter_padding_s is additional coverage, not a request to invent zeros. phase_readiness.csv checks timing and coverage before expensive processing; later SNR and peak tests use the actual samples.",
    "section": "METHODS",
    "oldSlide": 62
  },
  {
    "title": "Normalized discrete cross-correlation",
    "body": [
      "At shift k, compare N samples of A with N samples drawn from B. Ā and B̄k are their means. k is an integer sample lag.",
      "The numerator measures co-variation; the denominator divides by both signal norms. r=1 means matching centred shapes up to positive amplitude scale."
    ],
    "image": "teaching/assets/math_pearson.png",
    "position": {
      "left": 64,
      "top": 155,
      "width": 1152,
      "height": 180
    },
    "bodyY": 370,
    "size": 28,
    "notes": "Use the figure from slide 3 as context. r=−1 is a polarity reversal; r near zero is weak linear shape agreement, not proof that either waveform is noise. The B window mean and norm change as it slides. A/B here refer to a single common component. Properly typeset equation is a PNG; its LaTeX source is retained in equations.json.",
    "section": "METHODS",
    "oldSlide": 63
  },
  {
    "title": "Comparison window against search window",
    "body": [
      "The two comparisons use different fixed comparison windows. Swapping equal full windows would be redundant; these finite comparison/search comparisons need not be."
    ],
    "image": "teaching/assets/core_extended.png",
    "position": {
      "left": 64,
      "top": 150,
      "width": 1152,
      "height": 405
    },
    "bodyY": 570,
    "size": 25,
    "notes": "In the first term the A core is fixed and the B search window is shifted +lag. In the second term the B core is fixed and the A search window is shifted −lag. The extended signals contain samples outside each core, so their edge content may contribute differently. The core width in this conceptual illustration is shortened for readability; actual defaults are in DDCorr.toml.",
    "section": "METHODS",
    "oldSlide": 64
  },
  {
    "title": "Average the two directional comparisons",
    "body": [
      "In the equation, Acore means event A’s fixed comparison window, and Bcore means event B’s. The word core is an internal code label for the same comparison window.",
      "Averaging reduces dependence on which event supplied the short comparison window. Exchanging event order reverses the lag axis."
    ],
    "image": "teaching/assets/math_symmetric.png",
    "position": {
      "left": 64,
      "top": 155,
      "width": 1152,
      "height": 180
    },
    "bodyY": 370,
    "size": 28,
    "notes": "This is the code’s symmetric core-versus-extended definition, not a claim that ordinary correlation of two identical full windows requires both directions. Correlation uses a common lag across accepted horizontal components. The two-direction average may attenuate a peak when window-edge content differs.",
    "section": "METHODS",
    "oldSlide": 65
  },
  {
    "title": "The implementation follows that definition",
    "body": [
      "The first product compares A’s comparison window with B’s search window. The second reverses those roles.",
      "The index r=m−k+1 reverses the second lag direction before averaging the two normalized terms."
    ],
    "code": {
      "file": "src/signal.jl",
      "anchors": [
        [
          "r=m-k+1",
          3
        ]
      ]
    },
    "codeTop": 330,
    "codeHeight": 285,
    "size": 27,
    "section": "METHODS",
    "oldSlide": 66
  },
  {
    "title": "Why use an FFT here?",
    "body": [
      "Directly shifting and multiplying every sample works, but repeats many operations for every lag and event pair.",
      "An FFT computes the convolution used in the numerator efficiently. Reversing the core turns that convolution into correlation.",
      "Zero-padding prevents the end of one finite sequence from wrapping around to its beginning. Only valid full-window overlaps are kept."
    ],
    "notes": "The implementation uses nfft=nextpow(2,ncore+length(ext)−1), preventing circular wrap for linear convolution. Sliding sums/squares supply the moving window normalization. FFT acceleration should give the same statistic as direct Pearson sums; the independent numerical test checks this equality.",
    "section": "METHODS",
    "oldSlide": 67
  },
  {
    "title": "Cache transforms and moving-window norms",
    "body": [
      "Each trace’s transforms are reused across many pairs. Prefix sums provide means and energies for the sliding windows.",
      "This saves repeated work; it does not change the cross-correlation definition."
    ],
    "code": {
      "file": "src/signal.jl",
      "anchors": [
        [
          "nf=nextpow(2,ncore+length(ext)-1)",
          4
        ]
      ]
    },
    "codeTop": 330,
    "codeHeight": 285,
    "size": 27,
    "notes": "See earlier lines in cache_vector for sliding sums and sum-of-squares norms. FFT plans and buffers are private to workers, and station/phase groups are processed sequentially to limit memory. Do not interpret the cache as a permanent scientific result; source/data/configuration hashes control reuse.",
    "section": "METHODS",
    "oldSlide": 68
  },
  {
    "title": "From pick correction to differential time",
    "body": [
      "pi and pj are absolute pick times; oi and oj are catalogue origins. Positive lag ℓ means j is later relative to its own pick.",
      "Keep i fixed and sample j at t+ℓ. Subtract ℓ from the difference of pick-minus-origin times to obtain Δtij."
    ],
    "image": "teaching/assets/math_dt.png",
    "position": {
      "left": 64,
      "top": 155,
      "width": 1152,
      "height": 180
    },
    "bodyY": 370,
    "size": 28,
    "notes": "Absolute event dates can be years apart. In the implementation reduced times are formed carefully to avoid subtracting large Unix epochs unnecessarily. Example: reduced picks 10 and 11 s, lag +0.2 s gives dt=10−11−0.2=−1.2 s. This sign is verified against independent synthetic truth.",
    "section": "METHODS",
    "oldSlide": 69
  },
  {
    "title": "Subtracting origins does not erase their errors",
    "body": [
      "A catalogue origin can be wrong. The value pick − catalogue origin still contains that event’s origin-time error.",
      "Such event-specific timing errors can be mutually consistent across a graph and still affect differential times.",
      "Relocation uses many stations/phases and geometry to separate location and origin-time corrections. Correlation alone cannot do that."
    ],
    "notes": "This corrects the earlier implication that origin subtraction removes all origin-time error. Synchronization enforces relative-time consistency but is not independently sensitive to every event-specific bias. Distant-in-time events can still be correlated when their waveforms and instrumentation are compatible.",
    "section": "METHODS",
    "oldSlide": 70
  },
  {
    "title": "Refine the peak between sample lags",
    "body": [
      "a, b and c are the scores just left of, at, and right of a discrete maximum. A parabola estimates an offset δ in samples.",
      "The estimated fractional correction lies within half a sample of the discrete peak. The total lag can still be many samples, up to the configured search limit."
    ],
    "image": "teaching/assets/math_parabola.png",
    "position": {
      "left": 64,
      "top": 155,
      "width": 1152,
      "height": 180
    },
    "bodyY": 370,
    "size": 28,
    "notes": "k is the integer peak lag relative to zero; fs is sample rate. δ modifies that integer peak, not the entire lag. A measured lag can span many samples within max_lag_s. Flat/degenerate curvature is not fitted. Acceptance uses the conservative discrete coefficient rather than an inflated fitted amplitude. This interpolation is not an uncertainty estimator.",
    "section": "METHODS",
    "oldSlide": 71
  },
  {
    "title": "Export precision is a different decision",
    "body": [
      "A half-sample fractional correction does not limit the total lag. Nor does it justify arbitrarily many printed decimals.",
      "By default, differential times are written to four decimal places, giving a 0.0001 s increment. This is an output format choice, not a timing-accuracy claim.",
      "Advanced setting [output] dt_decimals changes the representation. More digits can preserve numerical detail without improving the physical measurement."
    ],
    "notes": "Set dt_decimals in an advanced override file referenced from the public configuration. Valid range is 0–9. The primary dt.cc output uses fixed decimal formatting; CSV timing fields are rounded to that precision. Internal calculations remain Float64. SAC header precision, picking/model errors, noise and waveform differences all matter to actual accuracy.",
    "section": "METHODS",
    "oldSlide": 72
  },
  {
    "title": "Estimate background before judging a component",
    "body": [
      "s is the filtered comparison window; q is a filtered noise window before P. Their centred RMS ratio measures signal strength relative to background.",
      "A component below min_snr is excluded before combining correlation curves. For S, background still comes from before P."
    ],
    "image": "teaching/assets/math_snr.png",
    "position": {
      "left": 64,
      "top": 155,
      "width": 1152,
      "height": 180
    },
    "bodyY": 370,
    "size": 28,
    "notes": "N and M are counts of core/noise samples; they need not be equal. This is a band-limited RMS ratio, not a probabilistic detection confidence. A preceding event or tremor can contaminate the noise window. The configured pre-P interval and observed samples must be reviewed for dense swarms.",
    "section": "METHODS",
    "oldSlide": 73
  },
  {
    "title": "One horizontal may carry the useful S energy",
    "body": [
      "If one horizontal fails its own SNR check, do not average its noise curve into the useful component’s curve. DDCorr excludes that trace first.",
      "The course default [S] min_components=1 permits a common usable horizontal. Set min_components=2 to require both; the mining preset keeps that choice.",
      "When both pass, their correlation curves are averaged at a common trial lag. A strong RMS alone does not prove the component contains the intended S phase."
    ],
    "notes": "Components are matched by channel identity and compatible orientation. Both events must have a qualified common component. The exported ncomponents/components columns show what contributed. Example waveforms show the first common component, while an S lag curve may average two; the plot caption says so. We do not introduce an unvalidated SNR weighting formula.",
    "section": "METHODS",
    "oldSlide": 74
  },
  {
    "title": "What the peak-quality checks test",
    "body": [
      "min_cc requires enough waveform similarity. A boundary guard rejects a maximum at the edge of the permitted search: the true maximum may lie outside.",
      "min_peak_gap compares the winning peak with another local maximum outside its immediate neighbourhood. A small gap means another shift competes.",
      "These are measurement checks, not an earthquake classifier. Periodic tremor can still produce coherent correlations."
    ],
    "notes": "The coefficient threshold is public [P]/[S] min_cc. The peak-gap and sidelobe exclusion settings are advanced per-phase options; boundary_guard_samples is advanced [quality]. Interpret rejection ledgers and curve shapes together instead of adjusting every threshold to increase counts.",
    "section": "METHODS",
    "oldSlide": 75
  },
  {
    "title": "Where the advanced quality checks are set",
    "body": [
      "Save the settings above as my_advanced.toml next to the public TOML you are using. In that public file, add [advanced] with file=\"my_advanced.toml\". Edit [phase.S] separately to change S quality checks."
    ],
    "command": "# my_advanced.toml\n[phase.P]\nmin_peak_gap = 0.10\nsidelobe_exclusion_s = 0.04\n[quality]\nboundary_guard_samples = 1",
    "commandHeight": 196,
    "bodyY": 396,
    "codeSize": 23,
    "size": 25,
    "notes": "The caption uses compact notation; in the actual public TOML, put [advanced] on one line and file=\"my_advanced.toml\" on the next. A partial advanced file is allowed. Unknown keys error, helping catch typos. effective_config.toml contains the final merged settings. min_cc remains in the ordinary public [P]/[S] sections.",
    "section": "METHODS",
    "oldSlide": 76
  },
  {
    "title": "A graph check: does a triangle close?",
    "body": [
      "For one station and phase, add three directed differential times around events i, j and k. Consistent relative arrivals should sum to about zero.",
      "Large closure residuals flag contradictory measurements. Coherent noise and event-specific biases can still close, so zero closure is not independent truth."
    ],
    "image": "teaching/assets/math_closure.png",
    "position": {
      "left": 64,
      "top": 155,
      "width": 1152,
      "height": 180
    },
    "bodyY": 370,
    "size": 28,
    "notes": "This motivates DDSync without pretending correlation QC solves event authenticity. The report reservoir-samples triangles up to diagnostics.max_closure_triangles. All three edges must exist; a disconnected or sparse graph can have little closure evidence. Do not reject a remote or isolated event solely because it lacks neighbours.",
    "section": "METHODS",
    "oldSlide": 77
  },
  {
    "title": "Near-identity is evidence to review",
    "body": [
      "[output] near_identity_cc=0.99 flags highly similar accepted observations in near_identity.csv. It does not automatically delete events.",
      "Inspect whether supposedly separate events use the same physical samples and phase timing. Repeating earthquakes can also have very high similarity.",
      "Use waveform identity, origin/pick separation and multi-station support together. A connected cluster or remote location alone is not a truth label."
    ],
    "notes": "This advanced setting uses absolute coefficient for the flag. The public polarity policy determines accepted observations first. The correlator intentionally retains all valid input events; duplicate-catalogue decisions belong to a documented QC step with supporting evidence.",
    "section": "METHODS",
    "oldSlide": 78
  },
  {
    "title": "Find the implementation by responsibility",
    "body": [
      "Code screenshots in this deck use exact source lines; the source index and slide notes identify their locations."
    ],
    "table": [
      [
        "File",
        "What to inspect"
      ],
      [
        "src/sac.jl / bin/sac_info.jl",
        "Read headers, validate metadata, expose one SAC"
      ],
      [
        "src/signal.jl",
        "Preprocessing, windows, correlation, peak lag"
      ],
      [
        "src/pipeline.jl",
        "Components, pair decisions, cache, dt.cc"
      ],
      [
        "src/report.jl / src/matrices.jl",
        "Example selection, PNG report, matrix exports"
      ],
      [
        "scripts/prepare_tables.py / download_sac.py",
        "Source tables, archive requests, SAC conversion"
      ]
    ],
    "widths": [
      570,
      582
    ],
    "tableHeight": 365,
    "bodyY": 575,
    "section": "METHODS",
    "oldSlide": 79
  },
  {
    "title": "Independent data exercise",
    "body": [
      "Use the guides as references, but make and document your own source and parameter choices. Instructor solutions are distributed after the exercise."
    ],
    "cover": true,
    "subtitle": "Section 5 · DDCorr.jl minicourse",
    "section": "PRACTICE",
    "oldSlide": 80
  },
  {
    "title": "Exercise A: find the information",
    "body": [
      "Choose an active interval and suitable catalogue. Locate its original download or service endpoint; aim for roughly 100 events.",
      "Find a recording network and about 12 stations with the right dates, components and location codes. Declare how you selected them.",
      "Determine whether observed P/S picks exist. If you use predictions, state why and identify their limitations."
    ],
    "notes": "See docs/EXERCISES.md. Students should find server names, network/channel IDs and catalogue formats themselves. Record source URLs and choices. A smaller justified selection is acceptable when coverage is limited; do not invent events or stations to reach a target count.",
    "section": "PRACTICE",
    "oldSlide": 81
  },
  {
    "title": "Exercise B: build and inspect the inputs",
    "body": [
      "Use subcommand --help and the data guide to create the tables, then choose bounded requests and generate SAC. Explain each directory you create.",
      "Locate manifest.json. Compare requested and successful combinations; explain missing data. Repeat an unchanged request and inspect downloaded-byte counts.",
      "Expose one SAC with sac_info.jl. Identify reference time, B, O, P/S headers and data coverage; attach its PNG."
    ],
    "notes": "This is a guided investigation rather than a complete sequence of solved commands. Students should choose the correct service/format route and inspect actual output. Do not hide archive errors or fill waveform gaps. The instructor guide contains a worked sequence and expected baseline counts, separately from this student deck.",
    "section": "PRACTICE",
    "oldSlide": 82
  },
  {
    "title": "Exercise C: assess and hand off the results",
    "body": [
      "Inspect, correlate, and request two specific pairs at one station. Explain any unplotted request using the audit tables.",
      "Annotate a strong and a noisy example, plus one matrix PNG. Change one justified setting and compare what changed.",
      "Submit source receipts, settings, commands and evidence. Identify the matching dt.cc, catalogue, stations and ID map for relocation."
    ],
    "notes": "A successful result is reproducible and scientifically reasoned, even if some inputs or pairs fail. Do not maximize accepted counts as a grading objective. Discuss phase identity, lag ambiguity, incomplete support and model/pick limitations. The exercise replaces the earlier arithmetic-only tasks.",
    "section": "PRACTICE",
    "oldSlide": 83
  },
  {
    "title": "Keep a useful record of your experiment",
    "body": [
      "Keep the original data sources, commands, settings and result folder together. Explain the evidence supporting each measurement you intend to use.",
      "Use the audit tables to explain exclusions and repeat the processing after any justified parameter change. Compare results with the previous run.",
      "In later course blocks, we will assess graph consistency in DDSync and source geometry in GraphSplit. Both steps require scientific judgment in addition to software execution."
    ],
    "notes": "Student references: docs/START_HERE.md, docs/DATA_DISCOVERY.md, docs/EXERCISES.md, docs/OUTPUTS_AND_HANDOFF.md. The main deck does not include the instructor exercise solutions.",
    "section": "PRACTICE",
    "oldSlide": 84
  }
];
