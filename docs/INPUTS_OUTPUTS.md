# DDCorr inputs and outputs

## Input waveforms and timing

Set `[input] sac_dir` in your run TOML to the folder containing one subfolder per event. Name the event folders with your own event IDs. Put the event's binary, evenly sampled SAC files directly inside. DDCorr reads one trace per network, station, location and channel in each event. It leaves the source files alone.

To display an example header, run `julia --project=. bin/sac_info.jl path/to/sac` from the DDCorr folder. The command prints the selected file path. Give it a single SAC filename to inspect a specific component. It lists the time and text label in each arrival slot.

| SAC fields | How DDCorr uses them |
|---|---|
| NZ reference date/time, B, DELTA, NPTS | Define the clock, the time of the first sample, the sample spacing and the number of samples. |
| O, EVLA, EVLO, EVDP | Give the event origin offset, latitude, longitude and depth. Origin UTC equals the SAC reference time plus O. Set `depth_unit` in `src/advanced.toml` for the archive's EVDP units. Output depth is in kilometres. |
| MAG, IMAGTYP (optional) | Carry an existing magnitude and its SAC type code. A zero or negative magnitude is valid. Undefined fields are omitted when collecting magnitude values. |
| KNETWK, KSTNM, KHOLE, KCMPNM | Identify network, station, location and channel. The station name in outputs is NET.STA. |
| STLA, STLO, STEL | Give station latitude and longitude in degrees and elevation in metres. DDCorr checks that a station code refers to one location within the configured tolerances. |
| CMPINC, CMPAZ | Identify component inclination and azimuth. P uses vertical motion and S uses horizontal motion. A missing inclination falls back to the last letter of the channel code. |
| A, T0 through T9 and their KA/KT labels | These are archive-defined arrival slots measured in seconds from the SAC reference. Use the labels and archive documentation to identify the P and S times. Enter the slot names, such as `a` and `t0`, in the public TOML. A blank selected pick means that trace cannot supply that phase. By default both phases need a P anchor for the pre-event noise window. |

The window around each pick needs enough real samples for the lag search, pre-P noise estimate and filter padding. First run `julia --project=. bin/ddcorr.jl DDCorr.toml --inspect`. In the printed inspection directory, `phase_readiness.csv` explains which traces pass these header and window checks. Waveform amplitude and noise are checked during correlation.

## Which settings to change

Edit `DDCorr.toml` for the SAC path, P and S passbands and windows, lag range, minimum correlation, sampling rate, minimum signal-to-noise ratio, figures and matrices. Each P or S window gives its start and end in seconds relative to that phase pick. A lag range of 0.5 s searches both early and late by up to 0.5 s. The signal-to-noise ratio compares the waveform's RMS amplitude in the phase window to its RMS amplitude in a quiet interval before P. 

DDCorr automatically loads `src/advanced.toml` for the remaining settings. Edit that file directly and rerun. The `[interface.*]` entries at its end fill in public keys that your run TOML omits. Each result directory contains the settings actually used in `effective_config.toml`.

A **group** contains all the candidate waveforms at one station for one phase. With 100 events at a station, the P group has up to 4,950 distinct event pairs. Each pair can give one P time difference. An S observation can combine measurements from both shared horizontal components. DDCorr processes one group at a time. It works through the pairs without building an all-pairs array at startup.

| `[runtime]` option in the advanced file | What happens when you change it |
|---|---|
| `max_events` | Zero uses all event folders. A positive limit selects evenly spaced positions in the sorted folder list. |
| `max_pairs_per_group` | Before reading waveform samples, DDCorr checks the possible comparisons for each station and phase, using n(n−1)/2 for n candidate events. A group over the limit stops the run. Zero removes this time/work safeguard. |
| `max_group_memory_mib` | DDCorr estimates the space to filter the longest raw trace, retain short phase windows and spectra, and give each active worker FFT buffers. It checks the estimate against this many mebibytes. Julia itself, event headers, retained observations, plots, and filesystem cache require additional memory. |
| `resume`, `cache_dir` | With reuse enabled, DDCorr checks file contents and processing settings before reusing a completed station and phase. Altered data or correlation settings trigger recalculation. Cache files contain derived measurements and may occupy substantial disk space. |

A dense swarm can still produce nearly n(n−1)/2 **accepted** observations for a single station and phase. Accepted rows are retained for writing, sorting and diagnostics. Turning on per-pair rejection records also retains failed rows. Use the pair allowance to keep these workloads manageable on a laptop. Sparse matrix files contain only accepted observations. Dense CSV output and heatmaps have separate size limits in the public TOML.

## The relocation files

Run the same command without `--inspect` to calculate differential times. Use one **completed** correlation folder for each handoff. Keep these four files together.

| File | Format and meaning |
|---|---|
| `catalog.txt` | UTC year, month, day, hour, minute, second, latitude, longitude, depth in km, optional SAC magnitude, final event ID. The magnitude column is present if at least one event has a usable MAG. In that case `NaN` means that no consistent magnitude is available for that event. |
| `event_id_map.csv` | Maps each folder name to its sequential event ID. IDs follow lexical folder order. The map includes isolated events, the available magnitude and its status. If specified SAC values or magnitude types disagree across channels, the event is retained with unknown magnitude. Individual headers appear in `inventory.csv`. |
| `stations.txt` | Station key, latitude, longitude and elevation in metres. The same key labels the station in `dt.cc`. |
| `dt.cc` | Each pair header gives two event IDs and the origin-correction field 0.0. Subsequent rows give station, differential travel time in seconds, nonnegative weight and phase. By default the weight is the square of the correlation coefficient. |

A short illustrative record is

```text
# 1 2 0.0
XX.STA1 -0.0270 0.960400 P
```

Let the supplied P travel times for events 1 and 2 be 4.100 s and 4.120 s. After each trace is centred on its own P pick, suppose the matching pulse on trace 2 occurs 0.007 s later. Shifting trace 2 earlier aligns the pulses. DDCorr writes 4.100 − 4.120 − 0.007 = −0.027 s. The signed coefficient for this example could be 0.98, giving weight 0.9604. In general, `dt(i,j) = (pick_i − origin_i) − (pick_j − origin_j) − lag`.

DDSync takes `dt.cc` and the matching catalogue. Configure it to consume the existing weight once. GraphSplit uses the synchronized station/phase arrival times and their uncertainties, the same station names and event indexing, and the supplied velocity model. The workshop handoff uses the same 100 events across the three stages. Read each program's configuration in its own checkout.

## Reading the results

| File | What to look for |
|---|---|
| `report.html`, `example_selection.csv` | Open the report in a browser. An example compares the original pick-centred windows, the aligned traces and correlation versus lag. The selection table names each plotted event pair and station/phase. |
| `correlations.csv` | One row per accepted pair measurement. Read the signed coefficient, lag correction, final differential time, weight, strongest competing peak, peak separation in score, minimum component SNR, shared components and map distance. |
| `group_summary.csv` | For each station and phase, compare input component files, prepared events and the number of pairs in each recorded outcome. Only outcomes seen in the data are listed. |
| `input_issues.csv`, `station_exclusions.csv`, `station_epochs.csv` | Identify invalid event metadata and coordinate conflicts. The default excludes a conflicting station across both phases and continues processing. |
| `phase_readiness.csv`, `preprocessing_issues.csv` | Find missing picks, short traces, sampling-rate mismatches and traces whose filtered phase windows have too little signal above noise. A preparation exclusion occurs before pair counting. |
| `rejected_pairs.csv` (optional) | Identify individual failed pairs. Enable `write_rejected_pairs` only if needed. |
| `near_identity.csv` | Inspect highly similar arrivals for repeated or overlapping records. Correlation alone cannot distinguish a copied trace from closely repeating earthquakes. |
| `event_connectivity.csv`, `triangle_closure_summary.csv` | Count distinct event neighbors. For three events at the same station and phase, check whether dt(i,j) + dt(j,k) agrees with dt(i,k). Large discrepancies indicate inconsistent relative times. |
| `matrices/index.csv` | Look up the sparse matrix filenames by station and phase. Each accepted pair appears once. In optional dense matrices `NA` marks missing cells, including the diagonal. Swapping two events reverses the sign of lag and differential time. |
| `run_info.toml`, `run_summary.toml`, `effective_config.toml`, `software_provenance.toml` | Check completion, result counts, catalogue magnitude-column availability, settings and code version. A failed run records its error in `failure.txt`. |

A `low_cc` pair fell below that phase's coefficient threshold. A `boundary` peak lies at the edge of the permitted lag range, where the optimum may lie beyond the window. An `ambiguous_peak` has a competing peak too close in score. `insufficient_components` means the two events lacked enough usable shared components. `pair_distance` means the initial epicentres exceeded the chosen distance limit. `component_pick_mismatch` means the shared components disagree on the starting pick difference.
