# Student exercises

Start with the README's offline example. Keep your first output directory as a baseline. For each experiment, change one setting, record the reason and compare the new timestamped output to the baseline.

## 1. Follow one observation from samples to an edge

Open `event_id_map.csv`, then choose one row of `correlations.csv`. Find its original event folders and station/phase. Put its two output IDs into `[plots] event_pairs`, rerun, and open `report.html`.

Describe what changes between the unaligned and aligned waveform panels. Use the sign convention to explain whether a positive lag moves the displayed event j waveform to the left or right: the plot samples j at `t + lag`, so a positive lag moves its feature left onto i. Calculate `dt` from the supplied picks, event origins and lag. Verify against the exported row rather than assuming the lag and dt are equal.

## 2. Test timing against known truth

`truth_picks.csv` contains true synthetic arrival times and deliberately biased input picks. `truth_pairs.csv` supplies true differential travel times keyed by original IDs, station and phase. Join through `event_id_map.csv` and compare with `correlations.csv`.

The independent checker performs this join without importing the correlator. Replace
`results/YOUR_RUN` with the completed timestamped directory printed by your run:

```sh
python3 scripts/check_synthetic.py \
  --truth-dir examples/synthetic --run-dir results/YOUR_RUN \
  --max-error-s 0.01 --require-noise-isolated
```

It reports median, maximum and RMS timing error in seconds, both overall and by
phase. The 0.01 s limit is an explicit exercise acceptance criterion, not an
estimated measurement uncertainty. A sign mistake fails this test. The optional
noise check requires the noise control to remain in the output catalogue while
having zero accepted observations; deleting it does not count as success. The
checker exits unsuccessfully if a requested criterion fails, or if no observations
were accepted. Omit `--max-error-s` when exploring settings and just comparing the
reported errors. Use `--output work/timing_check.json` to save the result.

The nominal output sampling interval is 0.02 s. Does the three-point peak fit recover smaller shifts? Report the actual errors for accepted P and S observations. A fractional number of samples is not automatically an accurate estimate or an uncertainty bound.

Folder `905` contains noise alone. Check its output ID and graph degree. It must remain in the catalogue even if no correlations are accepted. An event with no edges is unsupported by this correlation dataset; this exercise's truth label tells us why, whereas real observations need additional evidence.

## 3. Explore bandpass and ambiguity

Change only P's band from `[2.0, 14.0]` to `[4.0, 7.0]`. Compare waveform shape, the correlation curve, peak gap, accepted-edge count and true timing errors. A narrower band can remove noise but also produce broader or repeated peaks. A higher peak coefficient does not necessarily improve timing.

Return to the baseline. Try a shorter P window, then a longer one. Explain the tradeoff between more shared signal and contamination by later arrivals. Keep actual padding around both the search and filter windows.

## 4. Make the search too small

Set P's `max_lag_s` to `0.04`. Inspect boundary rejections in `group_summary.csv`. The deliberately biased picks require corrections up to approximately 0.225 s between the most separated signal events. A peak at the search edge is not a reliable constrained estimate; it can mean the correct lag lies outside the searched interval.

Restore the baseline before trying a larger lag search. A larger search also creates more opportunities for unrelated peaks to win. Explain why simply increasing it indefinitely is not a solution.

## 5. Change acceptance without changing identity

Raise P and S `min_cc` to `0.95`, then lower them to `0.60`. Compare accepted edges, connected components and timing errors. Confirm `event_id_map.csv` remains identical: acceptance changes edges, not the inventory of valid input events.

Read `near_identity.csv`. The signal waveforms in this synthetic exercise deliberately share their shape across distinct event origins. They can be highly correlated without being duplicate event records. State what additional timing and waveform-overlap evidence you would need before removing a real event.

## 6. Inspect a matrix and a triangle

Enable dense matrix export for this six-event exercise. Locate one station/P group through `matrices/index.csv`. Confirm the coefficient matrix is symmetric and the dt matrix is antisymmetric. Explain why `NA` differs from a measured coefficient of zero. Find the isolated event's row.

Pick three events with all three edges. Compute `dt_ij + dt_jk − dt_ik`. Repeat after introducing one hypothetical timing error on paper. Explain why DDSync can detect inconsistency in cycles, but cannot establish that a coherent set of signals comes from earthquakes.

## 7. Move to real data

Follow the Bárðarbunga download exercise in `DATA_AND_SAC.md`. Inspect pick provenance before running DDCorr. Compare the assumed travel times with the waveform panels. These simple predictions may miss an arrival or select another one; low acceptance is not proof that the archive contains no useful signal.

Repeat the exact acquisition command. Confirm its cache reuse and unchanged checksums. Then use an observed-pick table of your own, explicitly retaining its source. Compare predictions and observations without silently overwriting the earlier data.

## 8. Hand the same IDs to graph methods

Follow `OUTPUTS_AND_HANDOFF.md` to run DDSync. Compare original and synchronized differential times for a station/phase. Keep reference-event choices visible. Describe what the synchronization changes and which information remains unconstrained.

Before a scientific GraphSplit run, name the velocity model, initial-location source, station-epoch treatment and evaluation data you will use. Distinguish a software interface check from a test of relocation accuracy.
