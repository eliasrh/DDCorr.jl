# Instructor solution guide — distribute after the exercise

This worked example is separate from the student exercise and is excluded from `DDCorr_student_package.zip`. Students should first justify their own service, catalogue, station and phase choices. Equivalent defensible selections are acceptable; do not grade solely on matching an accepted count.

## 1. Select the catalogue and explain its IDs

For the demonstrated dense swarm, use [Ágústsdóttir et al. 2019, DOI 10.1029/2018JB016010](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018JB016010), Supporting Information Data Set S1. The named source file is `jgrb53519-sup-0002-2018jb016010-data_set_si-s01.txt`; save a copy as `work/S1.txt`. The validation source SHA256 is `0430c9deab535e4f44af96424bc564ca6af2ac8ce9118de787515b748ea49103`. This is a checksum of the instructor-supplied copy, not a remotely verified publisher checksum.

After the local Python environment in `docs/DATA_DISCOVERY.md` is installed, use its executable wherever `python` appears below. Commands are single-line for portability.

```sh
python scripts/prepare_tables.py s1 --input work/S1.txt --start 2014-08-23T12:00:00Z --end 2014-08-23T15:00:00Z --limit 100 --output work/tables
```

Expected: 100 events, zero observed picks. The first event is `S1_009900`, a generated source-line label, not a publisher event identifier. Explain chronological first-100 selection, UTC interpretation, depth in km and source checksum. `events.csv` is now a transparent derived table, not unexplained supplied data.

An acceptable alternative uses a regional FDSN event endpoint or a downloaded QuakeML. The student should establish that it has the target small-event population. USGS's global catalogue is a useful service example but not an equivalent dense-swarm catalogue; its documentation says arrival inclusion is not implemented.

## 2. Identify the station service and request metadata

Use `https://service.earthscope.org`, with FDSN station and dataselect services. Codes here are temporary network `Z7`, blank location `--`, and three-component `HH?`, with 2014 epochs. Choose the nearest eligible stations to the declared point, independently of correlations:

```sh
python scripts/prepare_tables.py stations --network Z7 --channels "HH?" --start 2014-08-23T11:59:00Z --end 2014-08-23T15:01:00Z --near-lat 64.85 --near-lon -16.85 --limit 12 --output work/tables
```

The cached metadata selection used in validation was DYSA, FLUR, HRIM, KATT, KVER, MOFO, NOHR, RODG, SOSU, STAM, STJA and TOHR (36 channels). Inspect `stations.csv`: metadata covering an interval is not proof of recorded waveform coverage. An archived local StationXML can be used with `--input FILE` to reproduce its selection without a network request.

A good answer identifies **network.station.location.channel** and checks orientation, sample rate and operating dates. Network codes can be reused; dates belong in the selection. A different network with HH1/HH2 requires deliberate component selection and orientation checks.

## 3. Identify phase provenance honestly

S1 supplies no observed picks. An analyst bulletin, explicit picker output or QuakeML pick/arrival association would support an observed-pick route. A header-only `picks.csv` cannot be used as though arrivals existed.

The worked demonstration explicitly uses homogeneous predicted centres (`vp=6`, `vs=3.5` km/s). It is not the Cambridge model or an observed Cambridge pick set. Students should explain that a misplaced window may correlate coda, tremor or another event. Strong correlation does not fix phase identity by itself.

## 4. Convert bounded event snippets to SAC

```sh
python scripts/download_sac.py --events work/tables/events.csv --stations-file work/tables/stations.csv --network Z7 --channels "HH?" --location=-- --pick-mode predicted --max-combinations 1200 --total-mib 256 --output work/iceland100
```

For the instructor's already downloaded archive, add `--waveform-dir LOCAL_MSEED_DIRECTORY --stationxml LOCAL_STATIONXML`. Both options together make the operation offline. The validated cached-archive run used 52,588,544 input bytes, downloaded zero new waveform bytes, and wrote 3,300 SAC files. STJA had no waveform coverage in those cached inputs, giving 100 skipped event/station selections. A fresh remote request can have different coverage: compare the manifest, do not manufacture the expected count.

Inspect **`work/iceland100/manifest.json`**. It contains definitions, requests or local hashes, per-file provenance and skipped selections. Repeat an identical remote request: it should verify matching cache files and show zero new waveform bytes. It will not automatically reuse overlapping intervals with different request URLs. `--total-mib` bounds selected archive bytes, not resulting uncompressed SAC disk space.

## 5. Inspect a file and explain its time reference

```sh
julia --project=. bin/sac_info.jl work/iceland100/sac/S1_009900/Z7.DYSA..HHZ.sac --plot work/one_real_sac.png
julia --project=. bin/ddcorr.jl DDCorr.toml --sac-dir work/iceland100/sac --inspect
```

Students should distinguish NZ reference time, B trace start, O origin, and A/T0 phase centres. All offsets must share the reference. `A-O` is the catalogue P travel time; `A-B` is seconds from the first sample. Check DELTA, NPTS, station coordinates, EVDP km and STEL m, and genuine pre-P/post-S coverage. A valid header does not prove correct units or accurate phase identification.

The inspection directory starts with `inspect_`. It contains no calculated dt.cc. A successful synthetic inspection's “No waveforms correlated” message is expected.

## 6. Run and find the report

```sh
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml --sac-dir work/iceland100/sac
```

Open `report.html` in the exact `correlate_...` directory printed by this command. Default validation produced 2,412 P plus 4,625 S observations = 7,037, across 1,914 distinct event pairs. Count comparisons are only meaningful for the same input files/configuration. They are not a quality score.

For the deterministic synthetic case, expected output remains 80 accepted observations; the noise control is isolated. Timing after four-decimal export has maximum absolute error 0.6 ms against known truth. This does not imply 0.6 ms real-data accuracy.

## 7. Select figures and interpret them

For the synthetic exercise, set the existing `[plots]` section to `event_pairs=[[1,2],[2,3]]`, `example_stations=["XX.S01"]`, `example_phases=["P","S"]`. Both pairs pass on both phases: four figures. For all four stations, `example_stations=[]` gives 16 figures, even with `max_examples=1`. That setting controls automatic examples only. Folder-name selection is available through `original_event_pairs`, with the numeric list empty.

The authoritative integer column is **event_id**, and the original label column is **original_event_id**. Plot titles show both. Check `example_selection.csv` for unavailable requests. A missing example is not silently replaced by another pair. Check preprocessing, coverage and per-pair rejection evidence.

In the real example, event 44 (`S1_009943`, 12:28:55.940 UTC) and 45 (`S1_009944`, 12:28:56.000 UTC) have near-identical RODG S windows. Their origins are separated by only 0.06 s. This may be the same physical arrival in overlapping snippets. It is a QC warning, not evidence for two distinct events. There are 22 near-identity station/phase observations in the validated run. The correlator flags but does not automatically delete them.

For a noisy example, STAM S events 28 and 45 have a stored coefficient near 0.70 and visibly imperfect alignment. A is fixed; positive lag means B later relative to its pick and is displayed as B(t+lag), shifted left. A second competing peak, low SNR, periodicity, or model-centred wrong phase should be discussed even when an observation passes numerical criteria.

## 8. Read matrices and compare a justified experiment

`[matrices] enabled=true` writes sparse edges and `index.csv`; `plots=true` adds PNG heatmaps; `dense=true` also writes square CSVs. Grey/NA means absent measurement and uncomputed self-pairs. Correlation is symmetric; dt and lag change sign when indices are reversed. Never fill missing values with zero without a separately justified method.

An appropriate experiment changes one processing setting, states an expected consequence, and examines actual curves and rejection/support evidence. Examples: a wider core can include interfering arrivals; a narrower band may increase periodic ambiguity; requiring two S components can drop pairs where only one horizontal has sufficient SNR. The course default first excludes individual low-SNR components and then permits one common useful horizontal. A larger accepted count is not automatically an improvement.

## 9. Identify the handoff and its limits

Use matching `dt.cc`, `catalog.txt`, `stations.txt` and `event_id_map.csv`, plus settings/provenance. Differential times have sign travel_time(i)−travel_time(j); positive-lag correction enters with a minus sign. The default weight is r² and generated DDSync `base_mode="cc"` applies it once. Event-specific catalogue origin errors remain and can be addressed through multi-station/phase relocation; subtraction of the catalogue origins did not remove those errors.

GraphSplit requires a complete model/solver configuration in addition to the generated input fragment. Coherent noise can correlate and close graph cycles. Missing neighbours, isolation, or location outside the dike are not by themselves grounds to delete an event. Evaluate geometry, independent observations and waveform/phase evidence.

## Assessment criteria

Prioritize provenance, correct units/times, reproducible choices, explicit missing-data handling, accurate lag/ID interpretation, and evidence-based assessment. Accept well-explained failures. Do not reward merely lowering all thresholds or presenting an apparently clean cluster.
