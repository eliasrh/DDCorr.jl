# Outputs and graph-method handoff

Keep a complete timestamped DDCorr output directory together. Do not combine an ID map from one run with a catalogue or differential-time file from another.

## What a differential time means

Let `p_i` be the supplied absolute pick, `o_i` the event origin, and `L_ij` the measured lag. A positive lag means event j's waveform arrives later relative to its own pick. DDCorr writes

```text
dt_ij = (p_i − o_i) − (p_j − o_j) − L_ij
```

This is the travel time for i minus the travel time for j. It excludes the potentially large separation between the catalogue origin times, but errors in those origins remain in the reduced times. The lag alone is a correction to the supplied picks; it is not the differential travel time.

The `dt.cc` format is:

```text
# 1 2 0.0
XX.STA1   -0.0270  0.960400 P
XX.STA1   -0.0490  0.902500 S
```

The example numbers above illustrate the format. The header identifies the event pair. Each observation supplies station key, seconds, nonnegative weight and phase. Signed coefficients are retained separately in `correlations.csv`. Default weights are `r²`; they express similarity, not an independently calibrated timing variance.

`catalog.txt` is numeric, with columns:

```text
year month day hour minute second latitude longitude depth_km event_id
```

`stations.txt` contains `NET.STA latitude longitude elevation_m`. The same station key is used in `dt.cc` and downstream theta filenames. By default a station with conflicting coordinates is excluded from all events and both phases, while processing continues. Read station_exclusions.csv and station_epochs.csv before deciding whether metadata need correction or separate station locations should be used.

IDs are assigned in lexical order of valid event-folder names. For example `1201` sorts before `17`; it is not a chronological or numeric ordering. `event_id_map.csv` is the authority. Isolated events keep their rows and IDs. No fake edge is created to make them connected.

## Run DDSync

Clone [DDSync](https://github.com/eliasrh/DDSync) beside your DDCorr checkout, or use an existing installation. In a terminal, change into the **completed DDCorr output folder**, then run the DDSync script using its actual path:

```sh
cd /path/to/DDCorr.jl/results/correlate_TIMESTAMP
julia /path/to/DDSync/DDSyncJulia/run_ddsync.jl ddsync.toml
```

Replace both paths and `TIMESTAMP` with yours. DDSync's relative paths are working-directory relative, which is why this `cd` matters. No DDCorr Julia project is needed for the standalone DDSync runner, whose dependencies are standard libraries.

The generated configuration sets `[weights] base_mode = "cc"`: DDSync consumes DDCorr's existing weight unchanged. Using `cc2` with the default DDCorr output would produce `r⁴`. It requests 512 Hutchinson probes as a modest teaching run, a 0.005 s uncertainty floor, and `[robust] MIN_EDGES = 3` so that small graphs with cycles can be processed. DDSync's default minimum of 30 edges would exclude this five-signal-event exercise, which has only ten edges per station/phase. These are explicit teaching settings, not universal scientific choices. Assess graph redundancy and uncertainty convergence for your application before interpreting those uncertainties quantitatively.

DDSync writes `theta/`, `thetastd/`, `sync_metrics.txt` and `dt_sync.cc`. A theta value is relative to that station/phase component's reference event. Reference changes are gauge choices; comparisons between components require care.

## Continue to GraphSplit

Use [GraphSplit.jl](https://github.com/eliasrh/GraphSplit.jl). The DDCorr output `graphsplit_inputs.toml` is deliberately an **input fragment**. Merge its `[io]` and `[catalog]` settings into a complete GraphSplit configuration containing your velocity model or travel-time tables, coordinate conventions, constraints and solver choices. Keep it in the same output folder, or adjust paths according to GraphSplit's configuration rules.

Do not treat the synthetic teaching coordinates as a physically consistent velocity-model experiment: the synthetic generator was designed to test timing. The real download example also uses approximate predicted picks unless you supply measured picks. A meaningful relocation assessment needs defensible initial locations, station geometry, a velocity model and independent evaluation.

For an **interface exercise** with the small synthetic dataset, also set GraphSplit's `[observations] minimum_theta_degree = 3`. Its default of 6 exceeds this five-event clique's degree of 4 and would remove all its constraints. Other relocation settings still need a complete model-specific configuration. This lower teaching threshold is not a recommendation to weaken quality rules in a large scientific run.

The handoff is designed for the Julia implementations. Other programs accepting files called `dt.cc` may use different sign, origin-correction or weighting conventions. Check those conventions explicitly before reusing files.

## Audit tables

| File | Question it answers |
|---|---|
| `inventory.csv` | Which headers and channels were found? |
| `input_issues.csv` | Which event metadata failed validation? |
| `phase_readiness.csv` | Which picks/windows are available before reading waveform values? |
| `preprocessing_issues.csv` | Which traces failed filtering, padding or SNR checks? |
| `group_summary.csv` | How many pairs passed or failed each decision? |
| `correlations.csv` | What was measured for every accepted observation? |
| `rejected_pairs.csv` (optional) | Why did each measured candidate fail? |
| `near_identity.csv` | Which accepted arrivals are almost identical? |
| `example_selection.csv` | Why was an example plotted or a requested pair omitted? |
| `event_connectivity.csv` | Which events are isolated or weakly connected? |
| `matrices/index.csv` | Which station/phase matrix files exist? |
| `effective_config.toml` | What settings actually ran? |
| `software_provenance.toml` | Which Julia version and source hashes were used? |

The report's triangle residual is `dt_ij + dt_jk − dt_ik`. Small closure error shows pairwise consistency; coherent noise or a common systematic error can also close well. Absolute correlation |r| ≥0.99 deserves inspection for duplicate windows, repeated events or shared arrivals, but is not by itself a deletion rule.

## Reading group_summary.csv

Each row refers to one station, one phase and one status. `files` counts candidate input component files. `prepared_events` counts events with at least one usable prepared component. `count` counts event pairs in the named status, not waveform files or earthquakes. In the unchanged synthetic example, XX.S01/P has six files, five prepared events and ten accepted pairs.

`accepted` means the observation passed the pair checks. `low_cc` means its best coefficient was too low. `boundary` means the best sample was at a search edge. `ambiguous_peak` means another local maximum was too close in score. Other status names are described by the effective settings and the optional `rejected_pairs.csv` ledger. Trace preparation losses are listed separately in `preprocessing_issues.csv`.

## Report generation

With `[plots] enabled=true`, a completed correlation run on any dataset produces `report.html` and the requested diagnostic graphics. Inspection does not produce a correlation report. `--no-plots` suppresses the report. A failed run is marked failed and must not be used as a completed relocation handoff.
