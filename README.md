# DDCorr.jl

**From event SAC waveforms to differential travel times for DDSync and GraphSplit.**

DDCorr is a teaching interface to the numerical methods in MiningCorrelations.jl. It retains the native-rate forward–reverse filter, anti-alias resampling, symmetric normalized FFT correlation, common-lag horizontal-component combination, and fractional-sample peak refinement. The small public configuration exposes the decisions students should experiment with. Advanced settings remain visible and documented in [`src/defaults.toml`](src/defaults.toml).

The package correlates **already identified events with phase picks**. It does not detect earthquakes in a continuous archive. It can discover station and event metadata from complete SAC headers, but it cannot recover absent coordinates or measured arrival picks from filenames.

## Start here: an offline exercise

Install Julia 1.12 and Python 3.10 or newer. Python needs no additional packages for this exercise. A GitHub account with access to this private repository is needed to clone it.

```sh
git clone https://github.com/eliasrh/DDCorr.jl.git
cd DDCorr.jl
julia --project=. -e 'using Pkg; Pkg.instantiate()'
python3 scripts/make_synthetic.py --output examples/synthetic
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml --inspect
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml
```

The first Julia setup downloads dependencies and can take several minutes. Subsequent runs reuse them. Four threads are a modest starting point; choose fewer on a small laptop. The correlator processes one station/phase group at a time and uses one FFT thread per worker.

Each command prints its output directory. Inspection writes metadata tables without correlating waveforms. The full run creates a **new timestamped folder** inside `results/`. Open that folder's `report.html` in a browser. It contains waveform comparisons before and after alignment, correlation curves, coefficient and lag distributions, filter checks, graph connectivity and triangle closure diagnostics. PNG and PDF copies are alongside it.

The offline exercise has six event folders, four stations and three components: 72 SAC files. Folder `905` is a **noise-only control**. These signals and their locations are synthetic. The known differential times in `examples/synthetic/truth_pairs.csv` let you assess timing accuracy rather than judging only whether a plot looks convincing. See [the exercises](docs/EXERCISES.md).

## Bring your own SAC directory

```text
my_sac/
  original_event_001/
    XX.STA1..HHZ.sac
    XX.STA1..HHN.sac
    XX.STA1..HHE.sac
  original_event_002/
    ...
```

```sh
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml --sac-dir /path/to/my_sac --inspect
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml --sac-dir /path/to/my_sac
```

The immediate folder name supplies the original event ID. The waveform filename is not parsed for metadata. Do not mix different events in one folder or leave multiple segments for the same channel unmerged.

| Information | SAC fields and convention |
|---|---|
| Sampling | Evenly sampled binary SAC v6/v7; valid `DELTA`, `B`, `NPTS`, `NZ*` reference time |
| Event | `O` origin offset from the same reference; `EVLA`, `EVLO`, **`EVDP` in km** |
| Station | `KNETWK`, `KSTNM`, `STLA`, `STLO`, **`STEL` in metres** |
| Channel | `KCMPNM`, `KHOLE`; preferably `CMPAZ`, `CMPINC` |
| P pick | `A` by default; relative to the SAC reference, not the trace start |
| S pick | `T0` by default; relative to that same reference |

Change `p_pick_header` and `s_pick_header` if your files use different pick slots. P normally uses the vertical component; S uses two compatible horizontal components. Both phases need a pre-P noise window, so horizontal files should also carry the P pick. Missing picks and insufficient waveform padding appear in `phase_readiness.csv`. Header conflicts stop a run by default, with details in `input_issues.csv`. See the full [SAC and acquisition guide](docs/DATA_AND_SAC.md).

**SAC headers cannot reveal whether a value was entered in the wrong unit.** Confirm your producer's depth convention before starting. In particular, do not copy an event depth in metres into `EVDP` without converting it to km.

## The two configuration layers

Edit [`DDCorr.toml`](DDCorr.toml) for P/S bandpass, window length, sampling rate, maximum lag, minimum correlation, minimum SNR, figures and matrix exports. The default 2–14 Hz bands are a starting point for the Iceland exercise, not a universal optimum.

`src/defaults.toml` contains filtering, taper, noise-window, peak-ambiguity, component and resource settings. For an experiment, create an override file containing only the settings you want to change and add this to your public TOML:

```toml
[advanced]
file = "my_advanced.toml"
```

For example, `my_advanced.toml` could contain:

```toml
[output]
write_rejected_pairs = true
```

All TOML paths resolve relative to the file that owns the public configuration. A `--sac-dir` override resolves relative to your current working directory. Each run saves `effective_config.toml` and software hashes. Changed waveforms or processing settings invalidate the affected cached group; never load a cache obtained from an untrusted source.

The optional [`examples/mining_optimized.toml`](examples/mining_optimized.toml) and its advanced companion preserve the existing mining settings as a separate preset. Supply your own SAC directory; no original mining waveforms are bundled.

## Choose diagnostics and matrix exports

Keep `[plots] enabled = true` for the class. Individual switches control the summary, examples, filter audit and closure. With `event_pairs = []`, the report takes weak, middle and strong **accepted** examples in each station/phase group, then applies the global `max_examples` cap deterministically. The selection ledger is `example_selection.csv`; this is an illustration sample, not an unbiased validation sample.

To inspect particular output IDs, set `event_pairs = [[1, 2], [2, 3]]`. Pairs with no accepted observation are recorded as unplotted. Raise `max_examples` if your requested pairs span many groups. Original IDs are in `event_id_map.csv`.

Sparse station/phase correlation exports are enabled by default. `matrices/index.csv` identifies the files. For a small class example, set `[matrices] dense = true` to add labelled dense CSVs. Missing edges and the uncomputed diagonal are `NA`, not zero. Explicit event/cell limits prevent accidental huge dense exports. The matrices contain accepted observations only; lag-maximized similarities are not guaranteed to form a positive-semidefinite matrix.

## Get real waveforms from EarthScope / IRIS

The [acquisition guide](docs/DATA_AND_SAC.md) contains small, tested Bárðarbunga examples, a measured-pick workflow, a single-station variation and the file-format requirements. The six-event example selects close event pairs from catalogue locations before looking at correlations; it yielded 12 accepted observations with the default settings. The four-event example yielded none and is retained as a rejection-diagnosis exercise. The optional downloader uses ObsPy; the Julia correlator does not depend on Python.

The archive provides waveform samples and station metadata. Event origins come from the supplied catalogue. Phase picks must come from a separate pick table, or from an **explicitly selected and labelled prediction mode**. The teaching prediction uses a simple homogeneous velocity approximation; it is not the Cambridge velocity model and is not a substitute for scientific phase picking.

The downloader checks byte limits, preserves request and pick provenance, and verifies exact-request cache contents before reuse. An identical repeat requires no new waveform download. A changed request does not reuse overlapping fragments automatically.

## Continue to graph methods

Every completed correlation run writes:

- `dt.cc`: differential **travel** times, with `travel_time_i − travel_time_j` sign.
- `catalog.txt`, `stations.txt`: matching event and station inputs.
- `event_id_map.csv`: original folder IDs mapped to sequential IDs **1…N**.
- `ddsync.toml`: a runnable DDSync configuration for this output directory.
- `graphsplit_inputs.toml`: an input fragment to combine with your GraphSplit model and relocation settings.

The default observation weight is `r²`. The generated DDSync configuration uses `base_mode = "cc"` to apply that weight once. Choosing `cc2` there would square it again. All valid input events remain in the catalogue, including isolated events. Changing a correlation threshold therefore does not change IDs. Adding/removing input folders can change them: always carry the matching ID map and catalogue together.

Follow [outputs and downstream handoff](docs/OUTPUTS_AND_HANDOFF.md). Correlation quality and triangle closure are useful evidence; they do not establish that a detection is a real earthquake. `near_identity.csv` flags absolute coefficients |r| ≥0.99 for review without deleting events automatically.

## Read the code alongside the course

| File | Responsibility |
|---|---|
| `bin/ddcorr.jl` | Command-line entry point |
| `src/configuration.jl`, `src/defaults.toml` | Configuration merge and validation |
| `src/sac.jl` | SAC decoding, metadata inventory, IDs and preflight |
| `src/signal.jl` | Detrending, filters, resampling, windows, correlation and lag |
| `src/pipeline.jl` | Pair processing, quality decisions, caching and export |
| `src/report.jl`, `src/closure.jl` | Figures and consistency checks |
| `src/matrices.jl` | Sparse/dense station/phase exports |
| `scripts/` | Optional SAC preparation and teaching data |
| `teaching/` | Editable PowerPoint, source and instructor material |

Run the numerical and interface tests with:

```sh
julia --project=. test/runtests.jl
.venv/bin/python -m unittest discover -s scripts -p 'test_*.py'
```

The second command uses the optional ObsPy environment created in the acquisition guide. The Julia tests do not require it.

The tests check the FFT result against direct Pearson sums, lag and differential-time signs, filter response, resampling, SAC byte order and v7 precision, stable IDs, rejection rules and matrix conventions. `SOURCE_PROVENANCE.json` records the MiningCorrelations source hashes used for this derivative. This private teaching/scientific snapshot does not add a new distribution licence to the original code.
