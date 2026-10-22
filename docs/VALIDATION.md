# Validation record

## Revision verified 22 October 2026

The revised archive workflow was also checked live: one Z7.DYSA event request returned three SAC components from EarthScope (4,885 StationXML bytes and 73,728 miniSEED bytes). Repeating the same request reused both cached objects, with zero newly downloaded bytes. A separate bounded USGS event-service request returned one catalogue event and no observed picks; the helper preserved that distinction.

The student ZIP was extracted into a fresh directory and its checksums verified. The documented generator, inspection and default correlation commands succeeded there: 72 SAC files, six valid events, 80 accepted observations, 12 automatically selected example PNGs and eight matrix PNGs. No instructor solutions or bulk waveform data are included in the ZIP.

Version 0.2.0 passes 109 Julia assertions and 23 Python tests. New coverage includes original-name/manual-pair resolution, retention of a good S horizontal when the other fails SNR, and metadata-table source/pick provenance. The full synthetic run retains 80 observations; four-decimal export gives a maximum absolute error of 0.6 ms. An explicit two-pair selection across four stations and two phases produced all 16 figures even with max_examples=1; eight matrix PNGs and dense CSVs were verified. No PDF files or PDF report links were produced. SAC inspection printed consistent absolute/relative times and generated a PNG.

The cached-archive demonstration selected 100 S1 catalogue events and 12 metadata-eligible stations, producing 3,300 SAC files from 11 stations (STJA unavailable). Default processing accepted 2,412 P and 4,625 S observations. Twenty-two observations were flagged as near-identical; the strongest shown pair has catalogue origins only 0.06 s apart and is presented as a QC warning. Inputs use explicitly labelled homogeneous predictions, not measured picks. Details: examples/download/iceland100/validated_run.json.

The material below records the **17 October baseline**. Its eight-decimal exports/PDF figures and small real-data example describe that earlier version, not current defaults. The mining numerical comparison and downstream interface checks remain historical evidence; the separate mining preset retains two-component S requirements.


Validation performed on 17 October 2026 with Julia 1.12.3 on macOS/Apple Silicon.
These checks establish the implementation and file conventions for the tested
cases; they do not establish universally suitable bands or detection quality.

## Student workflow

A fresh clone of the private GitHub repository was used to run the README's
dependency setup, synthetic generator, SAC inspection and complete correlation
command with four threads. Normal Julia compilation was used; no special loading
flags were needed. Installed dependencies were reused, and a fresh compiled cache
was built. The complete warm-cache run took 25.8 seconds on this machine, including
all figures. This is a local timing observation, not a portable performance claim.
The fresh clone produced the expected 80 observations and passed the independent
truth checker. Generated data, caches and results left the checkout clean.

## Numerical and interface tests

The Julia suite contains **95 passing assertions** covering:

- FFT correlation against independent direct Pearson sums, including reciprocity.
- Positive/negative integer and fractional lags and the downstream differential-time sign.
- Polarity selection, boundary rejection and competing-peak rejection.
- Measured filter gains, zero phase away from the edges and anti-alias resampling.
- SAC v6/v7, both byte orders, double-precision v7 footer timing, nonzero B/O and different UTC reference epochs.
- Configuration merging and unknown-key/type errors; sequential IDs and retained original labels; missing-header evidence; cache invalidation after same-size waveform edits.
- Sparse/dense matrix symmetry, signed-time antisymmetry, missing entries and size limits.

Run the suite from the repository root:

```sh
julia --project=. test/runtests.jl
```

## Comparison with the current MiningCorrelations.jl

The source was compared with the user's local MiningCorrelations.jl and the
previous SeismicPipeline snapshot. The source hashes and comparison results are
recorded in `SOURCE_PROVENANCE.json`.

The numerical comparison used 12 real mining events, stations BL.DIAM and
BL.BSCB, both P and S, and the settings in the user's 8 October 2026 optimized
configuration. Across **72 input traces and four station/phase groups**, prepared
waveform windows, signal-to-noise ratios, reduced picks, rejection decisions,
histograms and every field of the **22 accepted observations** were bit-identical.
No input waveforms or upstream source files were modified. The corresponding
portable settings are in `examples/mining_optimized.toml` and its paired advanced
configuration. This is a comparison on a representative subset, not a rerun of
the complete mining archive.

## Synthetic end-to-end example

The supplied deterministic generator creates six original event labels and four
three-component stations. Five events contain related signals with known travel
times and deliberately biased picks; the sixth is a noise-only control.

Using the public default configuration:

- The output catalogue retains all six valid events as IDs 1–6.
- All 80 expected signal observations are accepted: 40 P and 40 S.
- Original label `905` maps to ID 6 and has no accepted edges.
- The median absolute differential-time error is **0.177 ms** and the maximum is
  **0.567 ms** against the generator's known values.
- Twelve example waveform/lag plots plus summary, filter and triangle-closure
  figures were generated in both PNG and PDF. A rendered correlation example was
  visually inspected, and its reported pair/lag/IDs checked against the CSV.

These errors describe this controlled high-signal synthetic case. Sub-sample
interpolation does not establish such uncertainty for real observations.

## Downstream compatibility

The generated `dt.cc`, ten-column `catalog.txt` and `stations.txt` were passed to
current DDSync and GraphSplit readers. Small teaching graphs need the generated
explicit DDSync `robust.MIN_EDGES=3`; its normal larger default would discard the
ten-edge synthetic station/phase groups. This is an edge-count choice for the
exercise, not evidence that any three observations are scientifically reliable.

DDCorr exports squared coefficients by default. The generated DDSync configuration
uses `weights.base_mode="cc"` so that the exported weights are applied once.
GraphSplit still requires the user's velocity model and relocation settings.

The integration check used DDSync commit
`e40076ffb587dbf18ddc3dd0bbeaf6ce97400e7c` and GraphSplit.jl commit
`541f518d89bc0a2d650c7a3d0aa16485e2a6a101`. The actual DDSync solver retained all
80 synthetic edges and produced eight theta groups. GraphSplit's actual readers
and Stage-1 constraint assembly produced 32 star observations after explicitly
setting `observations.minimum_theta_degree=3` for the five-event signal clique.
The sixth, isolated event remained in the catalogue. Across 80 comparable edges,
the largest synchronized-minus-input differential time was 0.186 ms, with the
same sign convention. No relocation-accuracy claim is made from this interface
check; the synthetic timing geometry is not a velocity-model benchmark.

## Acquisition and real-waveform checks

The optional Python suite has **19 passing tests**, including byte-limit handling,
exact-request reuse, cache corruption, no-data responses, gaps and overlaps,
metadata epochs, SAC time references and the independent synthetic-truth checker.
It was run with Python 3.12 and ObsPy 1.5.1.

Live EarthScope requests produced 36 SAC traces for the four-event example and
54 for the six-event close-pair example. Replaying each acquisition with network
access disabled reused all inputs successfully. Sources, counts and selection
criteria are recorded under `examples/download/`.

The four-event default run accepted zero correlations. The second set was
selected independently from catalogue locations as the closest three pairs in
the 12:00–13:00 UTC interval, with origin separations over 30 seconds. With the
same processing thresholds it accepted **12 observations: eight P and four S**,
with signed coefficients 0.711–0.932. These runs exercise real waveform handling
and quality decisions. Their homogeneous-model predictions remain labelled as
predictions; neither example supplies independent measured phase truth.
