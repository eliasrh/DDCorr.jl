# DDCorr manual — event SAC files, run settings and outputs

DDCorr measures the travel-time difference between two earthquakes recorded at the same station. Supply event-cut SAC waveforms with phase times, an origin and coordinates. The program compares P and S separately, writes accepted measurements to `dt.cc`, and identifies the events and stations in `catalog.txt` and `stations.txt`. You can use your own archive without the workshop dataset.

## First run on your own recordings

1. Download the code and install Julia. The [installation check for Windows, macOS and Linux](START_HERE.md#before-class) uses small generated recordings. Once the Julia packages are installed, DDCorr runs on local SAC files offline.
2. Create `MyData/sac` beside the code directory. Within it, put one folder per earthquake, using your own event ID as its name. Put that event’s binary SAC files directly inside its folder. For a measurement, two events must share a usable component at the same station for the same phase.
3. Copy the repository’s `DDCorr.toml` into `MyData`. In its existing `[input]` section set `sac_dir = "sac"`. In `[output]` set `directory = "results"`. These two paths are relative to the settings file, so the results stay with your data.
4. From the code directory, inspect several representative files with `julia --project=. bin/sac_info.jl ../MyData/sac` or give the exact path to a SAC file. Identify the numerical P and S fields using their text labels and the archive’s documentation. Define them under `[input]`. Set the depth units, passbands, sample rates and phase windows for the archive. The input table below explains what each header supplies.
5. Run the commands below from the directory containing `Project.toml`. The first reads headers. Open `phase_readiness.csv` in the inspection folder to see which recordings have a usable mark and sufficient coverage. The second reads the waveform samples, tests signal strength, compares the events and prints its new output directory.

```sh
julia --project=. bin/ddcorr.jl ../MyData/DDCorr.toml --inspect
julia --project=. --threads=2 bin/ddcorr.jl ../MyData/DDCorr.toml
```

Open `report.html` in the printed correlation directory. To find the result for a particular pair, look in `correlations.csv`. Keep the `dt.cc`, catalogue, station list and ID map from the same run together. The troubleshooting tables at the end of this manual explain missing measurements.

## Input waveforms and timing

Set `[input] sac_dir` in your run TOML to the folder containing one subfolder per event. Name the event folders with your own event IDs. Put the event's binary, evenly sampled SAC files directly inside. DDCorr reads one trace per network, station, location and channel in each event. It leaves the source files alone.

To display an example header, run `julia --project=. bin/sac_info.jl path/to/sac` from the DDCorr folder. The command prints the selected file path. Give it a single SAC filename to inspect a specific component. It lists the time and text label in each arrival slot.

| SAC fields | How DDCorr uses them |
|---|---|
| NZ reference date/time, B, DELTA, NPTS | Define the clock, the time of the first sample, the sample spacing and the number of samples. |
| O, EVLA, EVLO, EVDP | Give the event origin offset, latitude, longitude and depth. Origin UTC equals the SAC reference time plus O. Set `depth_unit` under `[input]` in the run TOML for the archive's EVDP units. Output depth is in kilometres. |
| MAG, IMAGTYP (optional) | Carry an existing magnitude and its SAC type code. A zero or negative magnitude is valid. Undefined fields are omitted when collecting magnitude values. |
| KNETWK, KSTNM, KHOLE, KCMPNM | Identify network, station, location and channel. The station name in outputs is NET.STA. |
| STLA, STLO, STEL | Give station latitude and longitude in degrees and elevation in metres. DDCorr checks that a station code refers to one location within the configured tolerances. |
| CMPINC, CMPAZ | Identify component inclination and azimuth. P uses vertical motion and S uses horizontal motion. A missing inclination falls back to the last letter of the channel code. |
| A, T0 through T9 and their KA/KT labels | These are archive-defined arrival slots measured in seconds from the SAC reference. Use the labels and archive documentation to identify the P and S times. Enter the slot names, such as `a` and `t0`, in the public TOML. A blank selected pick means that trace cannot supply that phase. By default both phases need a P anchor for the pre-event noise window. |

The window around each pick needs enough real samples for the lag search, pre-P noise estimate and filter padding. First run `julia --project=. bin/ddcorr.jl DDCorr.toml --inspect`. In the printed inspection directory, `phase_readiness.csv` explains which traces pass these header and window checks. Waveform amplitude and noise are checked during correlation.

## How the run TOML works

A table heading such as `[P]` applies to the lines below it until the next heading. Edit the TOML you pass to `bin/ddcorr.jl`. Package defaults come from `src/advanced.toml`. Each key in your run file overrides its own default. The other keys retain their values. For example, add the following line **under the existing `[P]` heading** to use a sixth-order P filter. The S filter keeps its fourth-order default.

```toml
[P]
filter_order = 6
```

Use `[P]` and `[S]` for phase settings. The longer names `[phase.P]` and `[phase.S]` are also accepted. Define each key once. Unknown names, incorrect types and invalid ranges stop the run with an error. The result’s `effective_config.toml` records the settings actually used, with the resolved phase settings under `[phase.P]` and `[phase.S]`. DDCorr, DDSync and GraphSplit each read their own TOML. Their section and key names are specific to each program.

### Input and output

| `[input]` key | Default | Meaning |
|---|---|---|
| `sac_dir` | `"examples/synthetic/sac"` | Directory of event folders. The command-line `--sac-dir PATH` overrides it and resolves relative to the current terminal directory. |
| `p_pick_header` | `"a"` | SAC time field that holds P. Use a numerical slot such as `"a"` or `"t8"`, as identified from the header. |
| `s_pick_header` | `"t0"` | SAC slot that holds S. Each phase requires its own usable time after the origin. Both mappings apply across the archive. |
| `depth_unit` | `"km"` | Units used by the source SAC EVDP. Choose `"m"` for metres. DDCorr exports depth in kilometres. |
| `strict_headers` | `true` | Stop on an event with invalid or inconsistent required headers. With `false`, exclude the affected event and record the reason in `input_issues.csv`. |
| `origin_tolerance_s` | `0.02` | Maximum disagreement in origin time across channels of one event, in seconds. |
| `coordinate_tolerance_deg` | `0.0001` | Maximum disagreement in event latitude or longitude across its channels, in degrees. |
| `depth_tolerance_km` | `0.01` | Maximum event depth disagreement across channels after unit conversion, in km. |
| `station_epoch_policy` | `"skip"` | For conflicting coordinates under one station name, `"skip"` omits that station from all events. `"error"` stops the run. `"split"` assigns distinct station names to coordinate groups. Inspect `station_epochs.csv`. |
| `station_coordinate_tolerance_deg` | `0.0001` | Allowed station latitude or longitude disagreement in degrees. |
| `station_elevation_tolerance_m` | `10.0` | Allowed station elevation disagreement in metres. |
| `component_inclination_tolerance_deg` | `10.0` | How close an axis must be to vertical for P or horizontal for S, in degrees. |

| `[output]` key | Default | Meaning |
|---|---|---|
| `directory` | `"results"` | Parent of the new `inspect_…` or `correlate_…` folder for each run. |
| `weight` | `"cc_squared"` | Writes the squared coefficient to `dt.cc`. `"cc"` writes its magnitude. The signed coefficient is in `correlations.csv`. |
| `coefficient_lag` | `"sampled"` | `"fitted"` remeasures r on the filtered recordings at the full-precision fitted lag for the export weight, matrices and near-identity flag. The original sampled peak and peak gap determine acceptance in both modes. |
| `dt_decimals` | `4` | Decimal places for exported differential times and lags in seconds, from 0 to 9. |
| `write_rejected_pairs` | `false` | Save `rejected_pairs.csv` with one reason per unsuccessful pair at each station and phase. Can be large. |
| `near_identity_cc` | `0.99` | Flag an accepted station/phase measurement when the absolute coefficient reaches this threshold. All observations stay in the output. |

### Phase windows, filtering and acceptance

Set each option under `[P]` or `[S]`. A phase marker is the time around which DDCorr looks for the arrival. It may be measured or predicted.

| Key | Default P / S | Meaning |
|---|---|---|
| `band_hz` | `[2.0, 14.0]` / same | Lower and upper Butterworth corners in Hz. The upper corner must be below 0.45 times both the target and native sample rates. |
| `filter_order` | `4` / `4` | Butterworth order for each filtering pass, from 1 to 8. A higher order steepens the transition at each corner. DDCorr filters in both time directions. |
| `filter_padding_s` | `5.0` / `5.0` | Extra recorded data required beyond the search and noise windows at each end, in seconds. Allow at least three periods at the low corner. |
| `window_s` | `[-0.5, 2.0]` / `[-0.5, 3.0]` | First and last seconds relative to that phase’s marker. The duration must span a whole number of analysis sample intervals. |
| `sample_rate_hz` | `50.0` / `50.0` | Rate on the comparison grid, in samples/s. Choose a value at or below the native rate. At 50 Hz, adjacent trial lags are 0.020 s apart. |
| `max_lag_s` | `0.5` / `0.5` | Search earlier and later by this many seconds. Choose a whole number of analysis sample intervals, leaving a peak inside the boundary guard. |
| `min_snr` | `1.5` / `1.5` | Minimum ratio of filtered RMS amplitude in the phase window to RMS amplitude in the pre-P background window. Applied to each component before matching events. |
| `min_components` | `1` / `1` | Minimum number of shared, compatible components. Two for S requires two usable horizontals. |
| `min_cc` | `0.70` / `0.70` | Minimum peak score for acceptance. The polarity setting controls whether DDCorr scores the signed coefficient or its magnitude. |
| `min_peak_gap` | `0.10` / `0.08` | Minimum difference in height between the winning peak and its strongest competing local maximum. A smaller gap can admit alignments one cycle apart. |
| `sidelobe_exclusion_s` | `0.04` / `0.04` | Ignore competing maxima this close in time to the winner when measuring the peak gap. |

### Waveform preparation and pair quality

| `[preprocess]` key | Default | Meaning |
|---|---|---|
| `trace_taper_fraction` | `0.02` | Fraction of each end of the raw trace tapered before filtering. Allowed range 0–0.1. |
| `noise_pick_header` | `"auto"` | SAC time field anchoring the noise window for **both** phases. `"auto"` uses the configured P field. |
| `noise_window_s` | `[-8.0, -2.0]` | Start and end of the background interval in seconds before the noise anchor. Both offsets must be negative. |
| `orientation_tolerance_deg` | `10.0` | Maximum difference in inclination or azimuth between like-named components of two events, in degrees. |

| `[quality]` key | Default | Meaning |
|---|---|---|
| `polarity` | `"positive"` | Score positive similarity. `"absolute"` can select a strong negative match for reversed motion. The recorded coefficient retains its sign. |
| `subsample` | `true` | Fit the winning peak and its two neighbours with a parabola to refine lag between samples. The export coefficient follows `output.coefficient_lag`. With subsample timing off, both modes use the same grid lag. |
| `boundary_guard_samples` | `1` | Reject a peak this many grid samples from either end, including the endpoint. A peak at the edge may continue beyond the search. |
| `component_pick_tolerance_s` | `0.001` | Maximum spread, in seconds, of the two events’ marker-minus-origin differences across shared components. |
| `max_pair_distance_km` | `0.0` | Maximum initial epicentral separation for a pair, in km. Zero allows any distance for events sharing usable channels. |

### Report and example selection

| `[plots]` key | Default | Meaning |
|---|---|---|
| `enabled` | `true` | Produce the HTML report and selected figures. `--no-plots` suppresses them for a single invocation. |
| `summary` | `true` | Plot coefficient and lag distributions, per-station coverage, graph degree and pair decisions. |
| `closure` | `true` | For three linked events at one station and phase, compare the timing difference along two edges to the direct edge. |
| `filters` | `true` | Plot the frequency response, measured test-tone gains and example waveform spectra. |
| `examples` | `true` | Plot accepted pairs before and after alignment, with the lag curve. |
| `max_examples` | `12` | Maximum size of the automatic waveform gallery. Explicitly requested accepted pairs use the separate diagnostic budget below. |
| `event_pairs` | `[]` | Pairs of sequential output IDs, for example `[[85, 86]]`. Empty uses automatic selection unless original IDs are supplied. |
| `original_event_pairs` | `[]` | Alternative pairs of original event folder names, for example `[["eventA", "eventB"]]`. Choose one pair-ID convention. |
| `example_stations` | `[]` | Restrict the example candidates to named stations, such as `["Z7.STAM"]`. Empty includes all. |
| `example_phases` | `["P", "S"]` | Phases eligible for examples. Use `["S"]` to restrict selection to S. |

Automatic selection first takes the weakest, middle and strongest accepted absolute coefficients in each eligible station/phase group. The gallery then samples the ordered list evenly up to `max_examples`. The **filter spectrum** uses the last candidate for each phase *before* the gallery cap, displaying the lower-ID event and its first shared component. The title identifies the displayed trace. To choose a particular accepted trace, give one pair, one station and one phase under `[plots]`. These selectors are shared with the waveform gallery. If there is no eligible example for a phase, the response and tone checks still appear and its waveform spectrum is empty.

### Matrices and resources

| `[matrices]` key | Default | Meaning |
|---|---|---|
| `enabled` | `true` | Write sparse lists of accepted pairs by station and phase, plus the matrix index and event ordering. |
| `plots` | `true` | Draw heatmaps when matrix export and report figures are enabled. |
| `max_plot_events` | `500` | Skip heatmaps above this catalogue size. |
| `max_plot_groups` | `24` | Maximum number of station/phase groups to draw. |
| `dense` | `false` | Also write square coefficient, time and lag CSVs. Unmeasured cells and the diagonal contain `NA`. |
| `max_dense_events` | `500` | Largest catalogue allowed for dense export. |
| `max_dense_cells` | `2000000` | Total cell budget for the three dense matrices over all nonempty groups: 3 × events² × groups. |

| `[runtime]` key | Default | Meaning |
|---|---|---|
| `max_events` | `0` | Zero uses all event folders. A positive limit selects evenly spaced entries from the sorted folder list. |
| `resume` | `true` | Reuse cached station/phase calculations when inputs, source and relevant settings match. |
| `cache_dir` | `".ddcorr_cache"` | Cache path relative to the run TOML. |
| `max_pairs_per_group` | `2000000` | Limit possible comparisons at one station and phase before reading waveforms. For N events there are N(N−1)/2 pairs. Zero removes the limit. |
| `max_group_memory_mib` | `1024` | Positive allowance in MiB for estimated waveform and FFT working memory per group. Julia, retained outputs and graphics need additional memory. |

| `[diagnostics]` key | Default | Meaning |
|---|---|---|
| `max_requested_examples` | `200` | Upper bound on explicit pair/station/phase example requests. Narrow the selection or raise the allowance. |
| `max_closure_triangles` | `100000` | Maximum number of three-edge closure values retained per station and phase for the diagnostic. |

Older run files may provide `[advanced] file = "other.toml"`. Its path is relative to the run TOML. It overrides the package’s advanced defaults before the run file is applied. Its historical `[interface.*]` sections supply the common-option defaults. Use the ordinary section names above when setting values in a new run file.

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

In `report.html`, expand a waveform example marked **near-identity flag**. Its table lists the signed coefficient, differential travel time and exported `dt.cc` weight for every accepted station and phase of that pair. The default uses the coefficient at the best sampled lag. For `[output] coefficient_lag = "fitted"`, DDCorr shifts a window on each filtered parent recording, evaluates the normalized correlation in both event orders, and averages the same components as in the lag search. `coefficient_audit.csv` records the two lags and coefficients. A constant shifted window has undefined Pearson r and the audit labels that row `sampled_fallback`. The fitted coefficient can fall below the sampled peak. A cutoff of 0.99 on |r| corresponds to 0.9801 in a squared-weight export. To check whether two picks mark the same physical arrival, compare the original recordings on a shared UTC time axis at several stations.

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
