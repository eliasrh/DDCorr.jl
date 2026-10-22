export const slides = [
  {
    "title": "DDCorr: from waveforms to relative times",
    "body": [
      "A practical course: find data, prepare event SAC files, measure waveform shifts, and assess the results.",
      "The objective is a defensible set of differential travel times for DDSync and GraphSplit."
    ],
    "cover": true,
    "subtitle": "Revised course · October 2026 · Editable teaching package",
    "notes": "Text, tables and commands are editable PowerPoint objects. Scientific figures, rendered equations and exact source excerpts are PNG images. Figure-generation and equation source are included. Instructor solutions are distributed separately."
  },
  {
    "title": "What does the correlator measure?",
    "body": [
      "We compare two events recorded on the same station and component, around the same phase.",
      "The coefficient r measures similarity of shape. The lag is the time shift that gives the best similarity within a specified search interval.",
      "The output combines that lag with the two picks and catalogue origins to estimate a differential travel time. It does not detect events in continuous data."
    ]
  },
  {
    "title": "First, see what a positive lag means",
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
    "notes": "These are constructed pulses with a known +0.18 s delay. Their absolute event dates need not be close. The plot demonstrates the display convention B(t+lag), not a change to SAC origin times."
  },
  {
    "title": "The route through this course",
    "body": [
      "1. Run a controlled synthetic example and learn the files.",
      "2. Find real event, station and waveform data; prepare SAC.",
      "3. Run real correlations and read the diagnostic evidence.",
      "4. Follow the processing and mathematics; then complete an independent data exercise."
    ],
    "size": 28,
    "gap": 20
  },
  {
    "title": "Quick start with known signals",
    "body": [
      "We start offline, where we know the correct time shifts. This separates installation problems from scientific interpretation."
    ],
    "cover": true,
    "subtitle": "Section 1 · DDCorr.jl minicourse"
  },
  {
    "title": "Get the code and choose the environment",
    "body": [
      "Clone with Git, download a ZIP from GitHub, or use the instructor’s student ZIP. Open a terminal in the extracted DDCorr.jl folder.",
      "This repository is private. GitHub downloads require access; an instructor-provided ZIP needs no GitHub account.",
      "Use Julia 1.12.3 and Python 3.12 for the class. macOS Apple Silicon and Ubuntu are tested; Windows commands are provided but have not been tested on Windows."
    ],
    "sources": [
      "https://julialang.org/downloads/platform/"
    ],
    "notes": "Choose the Julia binary for your CPU. The package declares Julia ≥1.10 compatibility, but the course Manifest and local verification use 1.12.3. Do not infer testing of every allowed version. Install Julia and Python before entering the commands."
  },
  {
    "title": "Project and Manifest choose Julia packages",
    "body": [
      "Project.toml names dependencies. Manifest.toml records exact resolved versions. Keep both files.",
      "--project=. selects this folder’s Julia environment. Instantiate installs its recorded packages; first setup may take several minutes."
    ],
    "command": "julia --version\njulia --project=. -e 'using Pkg; Pkg.instantiate()'",
    "commandHeight": 72,
    "bodyY": 272,
    "codeSize": 23,
    "size": 27,
    "notes": "These commands are for the operating-system terminal, not the julia> prompt. Single quotes work in macOS/Linux shells and PowerShell; in Windows Command Prompt use double quotes. Julia environments select package versions; downloaded packages may share a cache in your home directory."
  },
  {
    "title": "Create the synthetic SAC directory",
    "body": [
      "The script creates pulses with known delays and added noise. It does not download earthquakes.",
      "Expect 6 event folders × 4 stations × 3 components = 72 SAC files. Folder 905 is an independent-noise control."
    ],
    "command": "python3 scripts/make_synthetic.py --output examples/synthetic",
    "commandHeight": 41,
    "bodyY": 241,
    "codeSize": 23,
    "size": 27,
    "notes": "On Windows replace python3 with py -3.12. This generator uses only the standard library, so no pip installation is required. --output sets the generated example directory. truth_pairs.csv gives known timing differences; DDCorr does not use this answer key. Repeating unchanged generation verifies existing files."
  },
  {
    "title": "Inspect the synthetic input before processing",
    "body": [
      "Expect “6 valid events” and “Inspection complete. No waveforms correlated.” This is a successful inspection.",
      "--inspect reads SAC metadata and checks picks and window coverage. It does not yet filter waveforms or test SNR."
    ],
    "command": "julia --project=. bin/ddcorr.jl DDCorr.toml --inspect",
    "commandHeight": 41,
    "bodyY": 241,
    "codeSize": 23,
    "size": 27,
    "notes": "DDCorr.toml is the settings file. The optional --sac-dir examples/synthetic/sac overrides its input path. Open phase_readiness.csv and input_issues.csv in the printed inspection directory; a header-only issues file means no issue rows."
  },
  {
    "title": "Two commands create two named directories",
    "body": [
      "results/inspect_2026-10-22_130000_000 contains metadata checks. It has no dt.cc and no correlation figures.",
      "results/correlate_2026-10-22_130500_000 contains calculated results. Open its report.html in a browser.",
      "These suffixes are UTC date/time stamps. Each folder has README.txt and run_info.toml describing its purpose and status."
    ],
    "size": 28,
    "notes": "Names shown are examples, not paths to copy literally. Each command prints the absolute output path on your computer. Inspection and correlation deliberately preserve separate results. Older runs used unlabelled timestamp directories; new runs use the inspect_/correlate_ prefixes."
  },
  {
    "title": "Run the actual correlations",
    "body": [
      "With the default synthetic settings, expect 80 accepted station/phase observations and one isolated noise event.",
      "Open report.html inside the newly printed correlate_… folder. It links PNG figures and the audit tables."
    ],
    "command": "julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml",
    "commandHeight": 41,
    "bodyY": 241,
    "codeSize": 23,
    "size": 27,
    "notes": "One observation is one event pair at one station and phase, not an extra event. Four threads are a modest starting point. The code processes one station/phase group at a time. --no-plots suppresses report graphics when only numerical outputs are needed."
  },
  {
    "title": "Read TOML as a small experiment description",
    "body": [
      "TOML is a plain-text settings file. A heading such as [P] starts a section; the following key = value lines belong to that section.",
      "band_hz chooses the frequency band. window_s chooses the core around the pick. max_lag_s limits the time correction searched in either direction.",
      "min_cc is the option name for the minimum signed coefficient r. A value of 0.70 does not mean the r² weight is 0.70."
    ],
    "notes": "Comments start with #. Paths are relative to the public TOML. Keep the normal settings in DDCorr.toml; additional documented settings live in src/defaults.toml and can be overridden with a separate advanced TOML."
  },
  {
    "title": "A concrete P-wave configuration",
    "body": [
      "The core spans −0.5 to +2.0 s from P. The lag search spans −0.5 to +0.5 s around the pick alignment."
    ],
    "command": "[P]\nband_hz = [2.0, 14.0]\nwindow_s = [-0.5, 2.0]\nmax_lag_s = 0.5\nmin_cc = 0.70\nsample_rate_hz = 50.0\nmin_snr = 1.5",
    "commandHeight": 227,
    "bodyY": 427,
    "codeSize": 23,
    "size": 27,
    "notes": "This is TOML text, not a terminal command. Edit the existing [P] section rather than adding a duplicate. [S] has its own settings. Later sections explain SNR, resampling and why larger windows/lags can include unrelated signals."
  },
  {
    "title": "Original names and new event IDs",
    "body": [
      "Immediate SAC subfolders identify events. Names can be nonnumeric, such as event_alpha; filenames are not used to infer picks.",
      "event_id_map.csv has an event_id column (new integer) and original_event_id column (original folder label).",
      "The synthetic mapping begins 1 → 1201, 2 → 17, 3 → 203. IDs follow lexical folder order; isolated events remain in the catalogue."
    ],
    "notes": "The name original_event_id does not imply a number. Adding/removing input folders can change sequential IDs. Changing only a correlation threshold does not remove valid events from the map. Never mix maps and catalogues from different input sets."
  },
  {
    "title": "Request exactly the pairs you want",
    "body": [
      "These are event_id values from the map. This selection gives four figures if both pairs pass for P and S at S01."
    ],
    "command": "[plots]\nevent_pairs = [[1, 2], [2, 3]]\noriginal_event_pairs = []\nexample_stations = [\"XX.S01\"]\nexample_phases = [\"P\", \"S\"]\nmax_examples = 12",
    "commandHeight": 196,
    "bodyY": 396,
    "codeSize": 23,
    "size": 27,
    "notes": "Edit the existing section; enabled and examples should remain true. Explicit pairs bypass max_examples, which controls automatic selection only. With example_stations=[] both pairs appear for all four synthetic stations (16 figures). A separate advanced max_requested_examples=200 guard prevents accidental huge reports. See example_selection.csv for an unplotted request."
  },
  {
    "title": "Or request the original folder names",
    "body": [
      "Fill one pair list, not both. A plot title now shows both integer IDs and original folder labels.",
      "The exact figures and unavailable requests are listed in example_selection.csv."
    ],
    "command": "[plots]\nevent_pairs = []\noriginal_event_pairs = [[\"1201\", \"17\"]]\nexample_stations = [\"XX.S01\"]\nexample_phases = [\"P\"]",
    "commandHeight": 165,
    "bodyY": 365,
    "codeSize": 23,
    "size": 27,
    "notes": "Unknown IDs/folders fail with a clear error, rather than silently generating a different pair. Only accepted observations receive example figures. Manual figure requests do not alter acceptance or scientific outputs."
  },
  {
    "title": "Know which output answers your question",
    "body": [
      "report.html: visual review. correlations.csv: accepted measurements. group_summary.csv: decisions by station and phase.",
      "input_issues.csv, phase_readiness.csv and preprocessing_issues.csv explain header, coverage and signal-quality losses.",
      "dt.cc, catalog.txt, stations.txt and event_id_map.csv form the relocation handoff. The run’s README.txt describes every file actually present."
    ],
    "notes": "effective_config.toml records the merged settings; software_provenance.toml records versions/source hashes; near_identity.csv flags highly similar measurements; event_connectivity.csv includes isolated events; matrices/index.csv locates exports. Keep the matching handoff files together because their integer IDs refer to the same events. Keeping the whole result folder also preserves evidence and provenance."
  },
  {
    "title": "Find real data and prepare SAC",
    "body": [
      "Now we replace known synthetic signals with a real catalogue and recording network. Event locations, waveforms and phase picks are separate pieces of information."
    ],
    "cover": true,
    "subtitle": "Section 2 · DDCorr.jl minicourse"
  },
  {
    "title": "Start with a scientific selection",
    "body": [
      "Choose a region, time interval and event population. A global catalogue may omit the small swarm events you want.",
      "For the Bárðarbunga example, use Data Set S1 from Ágústsdóttir et al., DOI 10.1029/2018JB016010.",
      "For another region, find a regional catalogue or an FDSN event service. Record the source URL, time zone, depth units and event-ID convention."
    ],
    "sources": [
      "https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018JB016010",
      "https://earthquake.usgs.gov/earthquakes/search/"
    ],
    "notes": "The instructor has a user-supplied copy of the named S1 attachment. The importer documents its headerless columns and source checksum; this is not an automatic endorsement of every catalogue field. Students should locate a suitable source instead of accepting an unexplained event CSV."
  },
  {
    "title": "Three services provide different information",
    "body": [
      "Our script combines these with phase information to write event SAC files. miniSEED alone does not contain a catalogue and phase picks."
    ],
    "table": [
      [
        "Need",
        "Source",
        "What you receive"
      ],
      [
        "Event origin and location",
        "Regional catalogue / event service",
        "Table or QuakeML"
      ],
      [
        "Station and channel metadata",
        "EarthScope station service",
        "StationXML"
      ],
      [
        "Recorded samples",
        "EarthScope dataselect service",
        "miniSEED"
      ]
    ],
    "widths": [
      345,
      410,
      397
    ],
    "tableHeight": 310,
    "bodyY": 515,
    "sources": [
      "https://service.earthscope.org/",
      "https://service.earthscope.org/fdsnws/dataselect/docs/1/"
    ]
  },
  {
    "title": "What is EarthScope / IRIS here?",
    "body": [
      "EarthScope hosts the waveform and station web services used in this example. Legacy service.iris.edu requests redirect to service.earthscope.org.",
      "A web-service request is a URL specifying codes and times. The station request asks about instruments; dataselect asks for recorded samples.",
      "scripts/download_sac.py is our optional acquisition/conversion script. It downloads miniSEED and metadata, then writes SAC using ObsPy."
    ],
    "sources": [
      "https://service.earthscope.org/fdsnws/dataselect/docs/1/"
    ],
    "notes": "EarthScope documentation currently lists SAC output as not yet supported by this waveform endpoint. We therefore do not tell students to expect a ready-picked SAC file directly from an archive request. Use HTTPS and direct EarthScope URLs."
  },
  {
    "title": "A separate Python environment: macOS / Linux",
    "body": [
      "venv creates a local environment. pip installs ObsPy 1.5.1 and its dependencies into that environment.",
      "Using .venv/bin/python explicitly avoids changing another ObsPy installation."
    ],
    "command": "python3 -m venv .venv\n.venv/bin/python -m pip install -r requirements-download.txt\n.venv/bin/python scripts/prepare_tables.py --help",
    "commandHeight": 103,
    "bodyY": 303,
    "codeSize": 23,
    "size": 27,
    "sources": [
      "https://docs.python.org/3/library/venv.html"
    ],
    "notes": "Use Python 3.12 for the tested optional tools. NumPy/SciPy and other ObsPy dependencies are installed automatically. The Julia correlator itself does not use Python. Linux may need the operating-system venv package. Activation is optional because these commands name the interpreter directly."
  },
  {
    "title": "The same setup in Windows PowerShell",
    "body": [
      "Windows puts the environment’s Python in Scripts rather than bin. No activation-policy change is needed.",
      "In the following slides, “python” means your local environment’s executable. Use the platform-specific commands in DATA_DISCOVERY.md."
    ],
    "command": "py -3.12 -m venv .venv\n.\\.venv\\Scripts\\python.exe -m pip install -r requirements-download.txt\n.\\.venv\\Scripts\\python.exe scripts/prepare_tables.py --help",
    "commandHeight": 103,
    "bodyY": 303,
    "codeSize": 23,
    "size": 27,
    "sources": [
      "https://docs.python.org/3/library/venv.html"
    ],
    "notes": "These PowerShell commands are documented, not Windows-tested in this revision. Do not copy Unix backslash line continuations into PowerShell. The written guide provides complete one-line commands. Do not move a prebuilt .venv between computers; recreate it."
  },
  {
    "title": "An event table should have an explained origin",
    "body": [
      "The S1 importer reads the published date/time, coordinates, depth and magnitude. It selects the first N events in a declared interval.",
      "For a service query, prepare_tables.py events saves the request URL and raw XML cache. For an existing QuakeML file, use its quakeml subcommand.",
      "The result is events.csv plus events_receipt.json. The receipt records the source hash and selection; the CSV’s source column retains origin information."
    ],
    "notes": "All importer command help is available through python scripts/prepare_tables.py MODE --help. The helper names are explicit, rather than unexplained shell scripts. Service discovery is part of the student exercise. Limit=100 is a maximum; it does not create 100 events when fewer exist."
  },
  {
    "title": "Select 100 events from the published S1 file",
    "body": [
      "Save the named Supporting Information file as work/S1.txt first. This command uses chronological selection, not correlation quality.",
      "Inspect work/tables/events.csv and events_receipt.json. S1_009900 means source line 9900."
    ],
    "command": "python scripts/prepare_tables.py s1 --input work/S1.txt \\\n  --start 2014-08-23T12:00:00Z --end 2014-08-23T15:00:00Z \\\n  --limit 100 --output work/tables",
    "commandHeight": 103,
    "bodyY": 303,
    "codeSize": 23,
    "size": 27,
    "notes": "Shown with macOS/Linux line continuations; use the one-line version in DATA_DISCOVERY.md on Windows. Selection uses start inclusive, end exclusive. S1 has no unique event-ID column, so the importer generates source-line labels. No observed phase picks are in this source; picks.csv therefore contains only column headings."
  },
  {
    "title": "A second route: query an event service",
    "body": [
      "Change region, dates and service after checking its documentation. A sparse global result is not equivalent to the regional swarm catalogue."
    ],
    "command": "python scripts/prepare_tables.py events \\\n  --service https://earthquake.usgs.gov \\\n  --start 2014-08-23T00:00:00Z --end 2014-08-24T00:00:00Z \\\n  --min-lat 64 --max-lat 66 --min-lon -18 --max-lon -16 \\\n  --limit 100 --output work/usgs_tables",
    "commandHeight": 165,
    "bodyY": 365,
    "codeSize": 23,
    "size": 27,
    "sources": [
      "https://earthquake.usgs.gov/fdsnws/event/1/"
    ],
    "notes": "The event route requests QuakeML and records the URL. It uses the preferred origin or explicitly falls back to the first. Save an existing QuakeML catalogue and use prepare_tables.py quakeml --input FILE for a local import. The USGS event query is an illustrative alternative; the validated 100-event example uses regional S1."
  },
  {
    "title": "Where would a pick table come from?",
    "body": [
      "Look for analyst phase bulletins, a picker’s output, or QuakeML containing picks associated with the selected event origin. A location catalogue may contain none.",
      "picks.csv requires event_id, network, station, location, phase, arrival_utc and provenance. Provenance says who or what produced that time.",
      "The importer preserves explicit P/S picks when available. It does not manufacture missing S picks. USGS does not currently implement includearrivals."
    ],
    "sources": [
      "https://earthquake.usgs.gov/fdsnws/event/1/"
    ],
    "notes": "The importer follows arrivals attached to the preferred/first origin and exports P/S phase names only. Multiple picks for the same event/network/station/location/phase require explicit resolution. “Observed” can be analyst or automatic, but the method and source must be documented. A header-only picks.csv is not a usable measured-pick table."
  },
  {
    "title": "Predicted window centres are an explicit choice",
    "body": [
      "For a teaching run without observed picks, choose --pick-mode predicted. Distance divided by vp or vs gives an approximate P or S window centre.",
      "The SAC labels and manifest mark these as predictions. The simple homogeneous model is not the Cambridge velocity model.",
      "For scientific interpretation, inspect phase identity and window placement. A correlation can align the wrong signal if the centre is wrong."
    ],
    "notes": "The converter includes station elevation in straight-ray distance. This is a clearly labelled demonstration route, not a model-free picker. Use --pick-mode observed --picks FILE when measured picks are available. The core correlation engine does not claim predicted or observed SAC header values are correct merely because they exist."
  },
  {
    "title": "Identify a complete recording channel",
    "body": [
      "A channel identifier has four parts: network.station.location.channel, for example Z7.DYSA..HHZ. The blank part is a valid location code.",
      "Use station-service documentation to find codes and operating epochs. A temporary network code without a year can be ambiguous.",
      "Check coordinates, sample rate and orientation. HH? asks for matching channels; metadata availability does not guarantee waveform coverage."
    ],
    "sources": [
      "https://service.earthscope.org/fdsnws/station/1/"
    ],
    "notes": "In FDSN URL parameters, -- denotes blank location; pass --location=-- to avoid command-line parsing ambiguity. A trailing Z/N/E is a convention, not a substitute for orientation metadata. Some networks use 1/2 horizontal suffixes; select those deliberately and inspect azimuth/inclination."
  },
  {
    "title": "Select 12 stations using a declared rule",
    "body": [
      "The rule is nearest metadata-eligible stations to this point, with Z/N/E channels at one location across the interval.",
      "Inspect stations.csv and stations_receipt.json before downloading. Check location codes, dates and sample rates."
    ],
    "command": "python scripts/prepare_tables.py stations --network Z7 \\\n  --channels \"HH?\" --start 2014-08-23T11:59:00Z \\\n  --end 2014-08-23T15:01:00Z --near-lat 64.85 \\\n  --near-lon -16.85 --limit 12 --output work/tables",
    "commandHeight": 134,
    "bodyY": 334,
    "codeSize": 23,
    "size": 27,
    "notes": "This is geometric/metadata selection, independent of waveform correlation. Add --input stations.xml to inspect existing metadata offline. The point is a declared course selection point, not a rejection criterion based on distance to the dike. More appropriate station subsets can be chosen for a different scientific problem."
  },
  {
    "title": "Make the event SAC snippets",
    "body": [
      "100 events ×12 stations means at most 1,200 selections and 3,600 three-component SAC files. The byte cap covers archive inputs."
    ],
    "command": "python scripts/download_sac.py --events work/tables/events.csv \\\n  --stations-file work/tables/stations.csv --network Z7 \\\n  --channels \"HH?\" --location=-- --pick-mode predicted \\\n  --max-combinations 1200 --total-mib 256 \\\n  --output work/iceland100",
    "commandHeight": 165,
    "bodyY": 365,
    "codeSize": 23,
    "size": 27,
    "notes": "Use your environment’s Python. Default snippets cover origin −25 to +70 seconds. The converter checks channel epochs and sampling; it rejects gaps rather than inventing samples. For measured picks, replace the prediction option with --pick-mode observed --picks work/tables/picks.csv. SAC disk space can exceed compressed miniSEED input size."
  },
  {
    "title": "Know the exact provenance file",
    "body": [
      "work/iceland100/manifest.json records requests, source hashes, SAC filenames, phase provenance and skipped selections.",
      "work/iceland100/sac/<event_id>/*.sac holds the generated waveforms. Missing station/event combinations appear in the manifest.",
      "This JSON acquisition manifest is different from Julia’s Manifest.toml, which records software dependencies."
    ],
    "notes": "An identical repeat verifies cached bytes and avoids another waveform download. A changed request is a different cache key, even if it overlaps in time. The current helper does not assemble arbitrary overlapping remote cache requests. Output definitions must match before an existing output directory is reused."
  },
  {
    "title": "Reuse a local archive without downloading again",
    "body": [
      "Add --waveform-dir path/to/archive and --stationxml path/to/stations.xml to the same converter command.",
      "With both supplied, the converter makes no network requests. It reads one selected station’s interval at a time and records local file hashes.",
      "The course validation reused the existing miniSEED archive. STJA had metadata but no waveform coverage; the manifest kept that missing selection."
    ],
    "notes": "Local archive files must end in .mseed and have complete channel metadata. The converter is bounded by selected input bytes and processes stations sequentially. A very long selected interval at one station can still consume substantial memory; use course-sized intervals rather than treating this helper as an unbounded archive processor."
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
        "O from NZ; depth in km"
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
    "notes": "DDCorr accepts evenly sampled binary SAC v6/v7 and decodes byte order. The converter writes event depth in km and station elevation in metres. Header presence cannot detect an incorrectly supplied physical unit. Missing fields are not recovered from filenames."
  },
  {
    "title": "Expose a real file in the terminal",
    "body": [
      "The command prints reference UTC, origin, sampling, station/event coordinates, orientation and P/S header times. It also saves a PNG.",
      "Use a filename that exists in your manifest. --p-header and --s-header let you inspect another pick-slot convention."
    ],
    "command": "julia --project=. bin/sac_info.jl \\\n  work/iceland100/sac/S1_009900/Z7.DYSA..HHZ.sac \\\n  --plot work/one_real_sac.png",
    "commandHeight": 103,
    "bodyY": 303,
    "codeSize": 23,
    "size": 27,
    "notes": "The demonstrated Z7.DYSA file exists in the validated local example. Unix line continuations are shown; use a single line on Windows. This utility uses the same SAC reader as the correlator. Undefined numeric headers display NaN. Displaying a pick does not verify its accuracy."
  },
  {
    "title": "Reference, trace start, origin and pick differ",
    "body": [
      "NZ fields define a reference UTC. B is the first-sample offset from that reference. O is the event-origin offset; A and T0 are phase offsets.",
      "Absolute P time = reference + A. P travel time from the catalogue = A − O when all offsets share that reference.",
      "The trace can begin before the origin. Do not interpret A as seconds from the first sample or reset the reference without updating all offsets."
    ],
    "notes": "sac_info.jl prints both relative and absolute times so students can verify this directly. The conversion code keeps one NZ reference and updates O/A/T0 consistently. SAC stores many header numbers as Float32, so additional display decimals are not evidence of additional measurement precision."
  },
  {
    "title": "Run real correlations and assess them",
    "body": [
      "A completed run is a set of measurements and exclusions. Use the plots to understand both; a large accepted count alone is not the objective."
    ],
    "cover": true,
    "subtitle": "Section 3 · DDCorr.jl minicourse"
  },
  {
    "title": "Inspect and correlate your new SAC directory",
    "body": [
      "Read the inspection ledgers first. Then open the report.html path printed by the correlation run."
    ],
    "command": "julia --project=. bin/ddcorr.jl DDCorr.toml \\\n  --sac-dir work/iceland100/sac --inspect\njulia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml \\\n  --sac-dir work/iceland100/sac",
    "commandHeight": 134,
    "bodyY": 334,
    "codeSize": 23,
    "size": 27,
    "notes": "The --sac-dir override is relative to the current working directory, whereas TOML paths are relative to the public configuration file. This prevents needing to edit source code. Before comparing runs, confirm the same event set and inspect effective_config.toml."
  },
  {
    "title": "What the 100-event demonstration produced",
    "body": [
      "100 chronologically selected events; 12 selected stations; 11 with cached waveform coverage; 3,300 generated SAC files.",
      "Default processing accepted 2,412 P and 4,625 S observations: 7,037 total, linking 1,914 distinct event pairs.",
      "These use explicitly labelled predicted window centres. This demonstrates the workflow and its diagnostics; it does not independently validate the phases or relocated locations."
    ],
    "notes": "Actual validation: October 22, 2026; Julia 1.12.3 on macOS Apple Silicon, four Julia threads. Station/phase correlation took about 8.4 s after package loading; full wall time with graphics was about 43 s on this run. These are observations, not a portable benchmark. 52,588,544 selected cached archive bytes; zero newly downloaded waveform bytes. Receipts in examples/download/iceland100."
  },
  {
    "title": "A near-perfect match that needs review",
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
    "notes": "Actual strongest stored example, events 44 and 45: S1 source lines 9943 and 9944, origins 12:28:55.940 and 12:28:56.000 UTC. The run flags 22 station/phase near-identity observations in total. High similarity is not independent evidence for two distinct earthquakes. This example is deliberately retained as QC evidence; no automatic event deletion was performed. The curve averages SNR-qualified components; displayed samples are the first common component."
  },
  {
    "title": "A noisy real example near the threshold",
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
    "notes": "Actual weakest stored automatic example from the validated run. This replaces a noiseless-only discussion. A high coefficient is neither an uncertainty estimate nor proof of a real event. Automatic examples sample accepted observations; they do not show every rejected or problematic pair."
  },
  {
    "title": "Read the lag distribution with the search limit",
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
    "notes": "Actual accepted observations from the 100-event run, separated by P and S. Boundary maxima are rejected before export. A histogram of accepted lags is therefore conditioned on quality criteria and cannot by itself describe all original pick errors."
  },
  {
    "title": "The matrix is a station/phase graph in a grid",
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
    "notes": "Z7.DYSA P, 100 events. The matrix is symmetric because exchanging event order preserves coefficient; the signed dt and lag matrices are antisymmetric. Missing cells may reflect unavailable components, preprocessing rejection, quality rejection, or no measurement. They are not zero similarity. Block structure can motivate graph inspection, not automatic event deletion."
  },
  {
    "title": "Make PNG matrices and optional dense CSVs",
    "body": [
      "enabled writes sparse edges and matrices/index.csv. plots adds PNG heatmaps to report.html. dense adds square CSVs; PNGs do not require it."
    ],
    "command": "[matrices]\nenabled = true\nplots = true\ndense = true\nmax_plot_events = 500\nmax_plot_groups = 24",
    "commandHeight": 196,
    "bodyY": 396,
    "codeSize": 23,
    "size": 27,
    "notes": "These are exact TOML keys in the existing [matrices] section. Dense arrays use NA for missing data/diagonal. max_dense_events and max_dense_cells independently bound dense CSV export. matrices/matrix_plots.csv records rendered/skipped groups. All figures are raster PNG, with no PDF or SVG output."
  },
  {
    "title": "If a requested pair has no figure",
    "body": [
      "Confirm event_id in event_id_map.csv, or use original_event_pairs with quoted folder names. Check example_stations and example_phases.",
      "Read example_selection.csv. A request with no accepted observation is reported, rather than silently replaced by another pair.",
      "Use phase_readiness.csv, preprocessing_issues.csv and group_summary.csv to explain losses. Optional rejected_pairs.csv gives per-pair decisions."
    ],
    "notes": "To enable the optional rejection ledger, put [output] write_rejected_pairs=true in an advanced override file and reference it with [advanced] file=\"advanced.toml\" in DDCorr.toml. This can be large for many events. Do not confuse a figure selector with an acceptance override."
  },
  {
    "title": "The handoff has a specific sign and weight",
    "body": [
      "dt.cc stores travel time of event i minus travel time of event j. catalog.txt and event_id_map.csv define the same sequential IDs.",
      "By default the weight is r². The generated ddsync.toml uses base_mode=\"cc\" so that exported weight is applied once.",
      "graphsplit_inputs.toml is an input fragment; combine it with your velocity model and GraphSplit solver settings. Isolated events remain in the catalogue."
    ],
    "notes": "The correlation engine writes reduced travel-time differences, not raw absolute arrival differences. Do not square the exported r² again by choosing a downstream cc2 mode without understanding its effect. Four-decimal timing output is representation, not an uncertainty claim. DDSync/GraphSplit compatibility is documented in OUTPUTS_AND_HANDOFF.md."
  },
  {
    "title": "Follow one waveform through the code",
    "body": [
      "Now that we have run and inspected the outputs, we can explain each operation and the parameter it controls."
    ],
    "cover": true,
    "subtitle": "Section 4 · DDCorr.jl minicourse"
  },
  {
    "title": "The processing sequence has a purpose",
    "body": [
      "Start with one SAC waveform and its phase pick. Read the complete trace; remove mean/trend, taper its ends, and apply the phase bandpass.",
      "Apply anti-alias resampling if reducing the sampling rate. Extract a fixed core, a wider lag-search window, and pre-P noise.",
      "Compare matched components at trial lags, combine usable component curves, choose a clear peak, refine its lag and export the differential time."
    ],
    "notes": "This is the sequence in src/signal.jl and src/pipeline.jl. Whole-trace filtering precedes window extraction so the short core is not filtered as an isolated discontinuous snippet. All interpolation and coverage checks refer to actual sample times."
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
    "notes": "Exported using DDCorr.filtered_trace and the actual detrend function. The full trace is processed before this zoomed display. Source in teaching/source/export_trace.jl; values in the teaching build data. Signals are the synthetic course input, not field data."
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
    "size": 27
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
    "notes": "Actual synthetic trace before and after DDCorr.taper!. The default taper is 2% at each end of the full trace. A core too close to an edge is still unsuitable. Do not replace missing waveform padding with zeros and assume tapering fixes it."
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
    "size": 27
  },
  {
    "title": "Choose a band for the signal you are comparing",
    "body": [
      "A bandpass suppresses frequencies below the low corner and above the high corner, while retaining a middle band.",
      "[P] band_hz=[2.0,14.0] and [S] band_hz=[2.0,14.0] are the course starting point. Different sources, paths and instruments can justify other bands.",
      "A narrow band can make unrelated oscillatory signals look similar. Inspect both the waveform and lag curve when changing the band."
    ],
    "notes": "Corners are transition frequencies, not a brick wall. In this implementation they parameterize a Butterworth prototype. The native sample rate must support the requested band; the code errors instead of silently clipping it. Filter settings do not prove phase identity."
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
    "notes": "Actual DSP.jl frequency response for the configured native-rate 2–14 Hz Butterworth filter. A gain of 0.5 means half the sinusoidal amplitude, not half the power. The forward–reverse application is the same configured bandpass run twice; it is not a separate choice of band."
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
    "notes": "Equation source: teaching/assets/equations.json. f is in Hz, φ in radians. The formula applies to a sinusoidal component at f>0. Phase delay and group delay are not generally identical; only phase delay is needed for this explanation."
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
    "notes": "The DDCorr call is DSP.filtfilt. H* denotes complex conjugate, X/Y are Fourier-domain input/output. Four is the Butterworth prototype order; bandpass transformation and forward–reverse filtering each increase effective order. This explains the previous response plot rather than introducing an unrelated filter."
  },
  {
    "title": "Filter at the native sampling rate",
    "body": [
      "Filtering uses the original sample interval before any downsampling. The filter is represented as second-order sections for numerical stability.",
      "Public band_hz chooses the corners; advanced [phase.P/S] filter_order chooses the Butterworth prototype order."
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
    "size": 27
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
    "notes": "Upper panel: 12 Hz and a phase-reversed 8 Hz sine have the same values at a 20 Hz grid. Lower panel: a constructed 3+12 Hz signal, naive decimation versus a polyphase FIR low-pass/downsample. This conceptual example uses SciPy; production DDCorr uses DSP.jl resample, separately verified numerically."
  },
  {
    "title": "What the anti-alias filter does",
    "body": [
      "Before reducing sample rate, a low-pass filter attenuates frequencies above the new Nyquist frequency: half the new sampling rate.",
      "DDCorr uses DSP.resample, a delay-compensated polyphase FIR resampler. FIR means a finite set of weights applied to nearby samples.",
      "The signal bandpass and anti-alias filter have different jobs. The first selects useful seismic frequencies; the second protects the coarser sampling grid."
    ],
    "notes": "This is not a claim that filtering can recover information already aliased in the original recording. At the default 50 Hz target, Nyquist is 25 Hz, above the 14 Hz upper band corner. A low-pass finite impulse response filter has a transition band; the library designs the resampling filter for the ratio."
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
    "notes": "DDCorr does not upsample beyond the native rate by default. Rationalization supplies a ratio for the polyphase resampler. Linear interpolation extracts windows when a pick falls between samples; this is different from interpolation of the correlation peak."
  },
  {
    "title": "Three windows, each with a different job",
    "body": [
      "The core is compared; the wider trace lets it move; pre-P noise estimates background level. Extra real waveform protects filtering near both ends."
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
    "notes": "P defaults: core [−0.5,2.0], lag ±0.5 gives extended [−1.0,2.5]; noise [−8,−2]; 5 s filter margin requires coverage at least [−13,7.5] relative to P. Diagram rounds the right endpoint to 8 for display. For S, the core is centred on S but noise is still referenced to P, avoiding P coda as S background."
  },
  {
    "title": "Use the pick as a centre, not as proof",
    "body": [
      "A pick gives the starting alignment. We compare a short core around it against shifted portions of the other event’s longer trace.",
      "Too short a core may contain too few distinctive cycles. Too long a core may include another event or a different phase.",
      "max_lag_s limits correction around that initial alignment. A wide search is not automatically better; it can offer more unrelated peaks."
    ],
    "notes": "The whole search interval must exist in actual data. filter_padding_s is additional coverage, not a request to invent zeros. phase_readiness.csv checks timing and coverage before expensive processing; later SNR and peak tests use the actual samples."
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
    "notes": "Use the figure from slide 3 as context. r=−1 is a polarity reversal; r near zero is weak linear shape agreement, not proof that either waveform is noise. The B window mean and norm change as it slides. A/B here refer to a single common component. Properly typeset equation is a PNG; its LaTeX source is retained in equations.json."
  },
  {
    "title": "Core against extended trace, then swap roles",
    "body": [
      "The two comparisons use different fixed cores. Swapping equal full windows would be redundant; these finite core/search comparisons need not be."
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
    "notes": "In the first term the A core is fixed and the B search window is shifted +lag. In the second term the B core is fixed and the A search window is shifted −lag. The extended signals contain samples outside each core, so their edge content may contribute differently. The core width in this conceptual illustration is shortened for readability; actual defaults are in DDCorr.toml."
  },
  {
    "title": "Average the two directional comparisons",
    "body": [
      "Acore is fixed in the first term; Bcore is fixed in the second. The opposite shift makes both terms refer to the same relative delay.",
      "Averaging reduces dependence on which event supplied the short core. Exchanging event order reverses the lag axis."
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
    "notes": "This is the code’s symmetric core-versus-extended definition, not a claim that ordinary correlation of two identical full windows requires both directions. Correlation uses a common lag across accepted horizontal components. The two-direction average may attenuate a peak when window-edge content differs."
  },
  {
    "title": "The implementation follows that definition",
    "body": [
      "The first product compares A’s core with B’s extended trace; the second compares B’s core with A’s extended trace.",
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
    "size": 27
  },
  {
    "title": "Why use an FFT here?",
    "body": [
      "Directly shifting and multiplying every sample works, but repeats many operations for every lag and event pair.",
      "An FFT computes the convolution used in the numerator efficiently. Reversing the core turns that convolution into correlation.",
      "Zero-padding prevents the end of one finite sequence from wrapping around to its beginning. Only valid full-core overlaps are kept."
    ],
    "notes": "The implementation uses nfft=nextpow(2,ncore+length(ext)−1), preventing circular wrap for linear convolution. Sliding sums/squares supply the moving window normalization. FFT acceleration should give the same statistic as direct Pearson sums; the independent numerical test checks this equality."
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
    "notes": "See earlier lines in cache_vector for sliding sums and sum-of-squares norms. FFT plans and buffers are private to workers, and station/phase groups are processed sequentially to limit memory. Do not interpret the cache as a permanent scientific result; source/data/configuration hashes control reuse."
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
    "notes": "Absolute event dates can be years apart. In the implementation reduced times are formed carefully to avoid subtracting large Unix epochs unnecessarily. Example: reduced picks 10 and 11 s, lag +0.2 s gives dt=10−11−0.2=−1.2 s. This sign is verified against independent synthetic truth."
  },
  {
    "title": "Subtracting origins does not erase their errors",
    "body": [
      "A catalogue origin can be wrong. The value pick − catalogue origin still contains that event’s origin-time error.",
      "Such event-specific timing errors can be mutually consistent across a graph and still affect differential times.",
      "Relocation uses many stations/phases and geometry to separate location and origin-time corrections. Correlation alone cannot do that."
    ],
    "notes": "This corrects the earlier implication that origin subtraction removes all origin-time error. Synchronization enforces relative-time consistency but is not independently sensitive to every event-specific bias. Distant-in-time events can still be correlated when their waveforms and instrumentation are compatible."
  },
  {
    "title": "Refine the peak between sample lags",
    "body": [
      "a, b and c are the scores just left of, at, and right of a discrete maximum. A parabola estimates an offset δ in samples.",
      "Since b≥a and b≥c, the fitted vertex already lies within half a sample when the peak is curved. The redundant clamp has been removed."
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
    "notes": "k is the integer peak lag relative to zero; fs is sample rate. δ modifies that integer peak, not the entire lag. A measured lag can span many samples within max_lag_s. Flat/degenerate curvature is not fitted. Acceptance uses the conservative discrete coefficient rather than an inflated fitted amplitude. This interpolation is not an uncertainty estimator."
  },
  {
    "title": "Export precision is a different decision",
    "body": [
      "A half-sample fractional correction does not limit the total lag. Nor does it justify arbitrarily many printed decimals.",
      "The new default is four decimal places in timing exports: 0.0001 s, or 0.1 ms. It is a practical representation, not claimed accuracy.",
      "Advanced setting [output] dt_decimals changes the representation. More digits can preserve numerical detail without improving the physical measurement."
    ],
    "notes": "Set dt_decimals in an advanced override file referenced from the public configuration. Valid range is 0–9. The primary dt.cc output uses fixed decimal formatting; CSV timing fields are rounded to that precision. Internal calculations remain Float64. SAC header precision, picking/model errors, noise and waveform differences all matter to actual accuracy."
  },
  {
    "title": "Estimate background before judging a component",
    "body": [
      "s is the filtered core; q is a filtered noise window before P. Their centred RMS ratio measures signal strength relative to background.",
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
    "notes": "N and M are counts of core/noise samples; they need not be equal. This is a band-limited RMS ratio, not a probabilistic detection confidence. A preceding event or tremor can contaminate the noise window. The configured pre-P interval and observed samples must be reviewed for dense swarms."
  },
  {
    "title": "One horizontal may carry the useful S energy",
    "body": [
      "If one horizontal fails its own SNR check, do not average its noise curve into the useful component’s curve. DDCorr excludes that trace first.",
      "The course default [S] min_components=1 permits a common usable horizontal. Set min_components=2 to require both; the mining preset keeps that choice.",
      "When both pass, their correlation curves are averaged at a common trial lag. A strong RMS alone does not prove the component contains the intended S phase."
    ],
    "notes": "Components are matched by channel identity and compatible orientation. Both events must have a qualified common component. The exported ncomponents/components columns show what contributed. Example waveforms show the first common component, while an S lag curve may average two; the plot caption says so. We do not introduce an unvalidated SNR weighting formula."
  },
  {
    "title": "Now define peak quality checks",
    "body": [
      "min_cc requires enough waveform similarity. A boundary guard rejects a maximum at the edge of the permitted search: the true maximum may lie outside.",
      "min_peak_gap compares the winning peak with another local maximum outside its immediate neighbourhood. A small gap means another shift competes.",
      "These are measurement checks, not an earthquake classifier. Periodic tremor can still produce coherent correlations."
    ],
    "notes": "The coefficient threshold is public [P]/[S] min_cc. The peak-gap and sidelobe exclusion settings are advanced per-phase options; boundary_guard_samples is advanced [quality]. Interpret rejection ledgers and curve shapes together instead of adjusting every threshold to increase counts."
  },
  {
    "title": "Where the advanced quality checks are set",
    "body": [
      "Then set [advanced] file=\"my_advanced.toml\" in DDCorr.toml. Edit [phase.S] separately if needed."
    ],
    "command": "# my_advanced.toml\n[phase.P]\nmin_peak_gap = 0.10\nsidelobe_exclusion_s = 0.04\n[quality]\nboundary_guard_samples = 1",
    "commandHeight": 196,
    "bodyY": 396,
    "codeSize": 23,
    "size": 27,
    "notes": "The caption uses compact notation; in the actual public TOML, put [advanced] on one line and file=\"my_advanced.toml\" on the next. A partial advanced file is allowed. Unknown keys error, helping catch typos. effective_config.toml contains the final merged settings. min_cc remains in the ordinary public [P]/[S] sections."
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
    "notes": "This motivates DDSync without pretending correlation QC solves event authenticity. The report reservoir-samples triangles up to diagnostics.max_closure_triangles. All three edges must exist; a disconnected or sparse graph can have little closure evidence. Do not reject a remote or isolated event solely because it lacks neighbours."
  },
  {
    "title": "Near-identity is evidence to review",
    "body": [
      "[output] near_identity_cc=0.99 flags highly similar accepted observations in near_identity.csv. It does not automatically delete events.",
      "Inspect whether supposedly separate events use the same physical samples and phase timing. Repeating earthquakes can also have very high similarity.",
      "Use waveform identity, origin/pick separation and multi-station support together. A connected cluster or remote location alone is not a truth label."
    ],
    "notes": "This advanced setting uses absolute coefficient for the flag. The public polarity policy determines accepted observations first. The correlator intentionally retains all valid input events; duplicate-catalogue decisions belong to a documented QC step with supporting evidence."
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
    "bodyY": 575
  },
  {
    "title": "Independent data exercise",
    "body": [
      "Use the guides as references, but make and document your own source and parameter choices. Instructor solutions are distributed after the exercise."
    ],
    "cover": true,
    "subtitle": "Section 5 · DDCorr.jl minicourse"
  },
  {
    "title": "Exercise A: find the information",
    "body": [
      "Choose an active interval and suitable catalogue. Locate its original download or service endpoint; aim for roughly 100 events.",
      "Find a recording network and about 12 stations with the right dates, components and location codes. Declare how you selected them.",
      "Determine whether observed P/S picks exist. If you use predictions, state why and identify their limitations."
    ],
    "notes": "See docs/EXERCISES.md. Students should find server names, network/channel IDs and catalogue formats themselves. Record source URLs and choices. A smaller justified selection is acceptable when coverage is limited; do not invent events or stations to reach a target count."
  },
  {
    "title": "Exercise B: build and inspect the inputs",
    "body": [
      "Use subcommand --help and the data guide to create the tables, then choose bounded requests and generate SAC. Explain each directory you create.",
      "Locate manifest.json. Compare requested and successful combinations; explain missing data. Repeat an unchanged request and inspect downloaded-byte counts.",
      "Expose one SAC with sac_info.jl. Identify reference time, B, O, P/S headers and data coverage; attach its PNG."
    ],
    "notes": "This is a guided investigation rather than a complete sequence of solved commands. Students should choose the correct service/format route and inspect actual output. Do not hide archive errors or fill waveform gaps. The instructor guide contains a worked sequence and expected baseline counts, separately from this student deck."
  },
  {
    "title": "Exercise C: assess and hand off the results",
    "body": [
      "Inspect, correlate, and request two specific pairs at one station. Explain any unplotted request using the audit tables.",
      "Annotate a strong and a noisy example, plus one matrix PNG. Change one justified setting and compare what changed.",
      "Submit source receipts, settings, commands and evidence. Identify the matching dt.cc, catalogue, stations and ID map for relocation."
    ],
    "notes": "A successful result is reproducible and scientifically reasoned, even if some inputs or pairs fail. Do not maximize accepted counts as a grading objective. Discuss phase identity, lag ambiguity, incomplete support and model/pick limitations. The exercise replaces the earlier arithmetic-only tasks."
  },
  {
    "title": "Keep a useful record of your experiment",
    "body": [
      "Record what you asked for, what you received, the settings applied and why you trust or doubt the resulting measurements.",
      "The report is an inspection tool. The ledgers explain exclusions. The source receipts and effective configuration make the experiment repeatable.",
      "Use DDSync and relocation to test additional consistency and geometry; keep uncertainty and event authenticity as explicit scientific questions."
    ],
    "notes": "Student references: docs/START_HERE.md, docs/DATA_DISCOVERY.md, docs/EXERCISES.md, docs/OUTPUTS_AND_HANDOFF.md. The main deck does not include the instructor exercise solutions."
  }
];
