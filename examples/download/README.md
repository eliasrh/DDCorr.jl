# Small archive examples

Run all commands from the repository root. Real waveforms are downloaded into
ignored `work/` folders; they are not bundled with the repository.

`iceland_events.csv` contains four rows from Ágústsdóttir et al. (2019), Data Set S1,
DOI [10.1029/2018JB016010](https://doi.org/10.1029/2018JB016010).
The `S1_009900` identifiers refer to one-based data-row numbers in the supplied
published catalogue, not original author-assigned event IDs. The selection is the
first three events after 12:00 UTC on 23 August 2014 and the event at 12:02:57.030.
Times are UTC; event depth is kilometres below sea level. No published phase picks
are included in that file. Catalogue magnitudes are preserved without inventing
values for events that have none.

The full source file, supplied by the user from the paper supplement, has SHA256
`0430c9deab535e4f44af96424bc564ca6af2ac8ce9118de787515b748ea49103`.
The distributed four-row extract is sufficient for the exercises; the full user
catalogue is not uploaded. Cite the paper and the waveform network when using
these data in scientific work.

## Optional Python environment

The downloader uses ObsPy. The Julia correlator and the offline generator do not.
Python 3.12 was used for the tested example.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-download.txt
```

## A. Start with one station

```sh
.venv/bin/python scripts/download_sac.py \
  --events examples/download/iceland_events.csv \
  --network Z7 --stations DYJN --channels 'HH?' --location=-- \
  --pick-mode predicted --output work/iceland_one_station
```

This is a small format exercise: four events, one station, three components. One
station cannot constrain a useful three-dimensional earthquake relocation.

## B. Add two stations

```sh
.venv/bin/python scripts/download_sac.py \
  --events examples/download/iceland_events.csv \
  --network Z7 --stations DYJN,DYJS,HRIM --channels 'HH?' --location=-- \
  --pick-mode predicted --output work/iceland
julia --project=. bin/ddcorr.jl examples/download/iceland.toml --inspect
julia --project=. --threads=auto bin/ddcorr.jl examples/download/iceland.toml
```

The first station's exact requests are reused from the verified cache. This example
was checked against the live archive: 36 SAC traces, no skipped channels, and
850,237 archive bytes in total. A repeat completed with network access deliberately
disabled and zero downloaded bytes. Availability may change at the archive.

With the initial DDCorr defaults this four-event example produced **zero accepted
observations**. Nineteen of 36 component preparations failed the SNR requirement;
the surviving ten pair/phase candidates failed the correlation threshold. This
is an intentional diagnostic lesson, not a successful differential-time dataset.
The predicted windows roughly coincide with the expected early wavefield, but
the P signals are weak, the noise is substantial, and a preceding event
contaminates the pre-P noise interval for `S1_009904`. An empty `dt.cc` does not
mean the SAC conversion failed; valid events still remain in `catalog.txt`. Inspect rejection reasons and
the individual waveforms before adjusting anything.

**The P and S headers in both examples are predictions, not observed picks.**
They use straight rays and constant speeds of 6.0 and 3.5 km/s. The purpose is to
put approximate phase windows into SAC and expose their limitations. The original
paper did not use this simple model. Inspect the windows: picking error outside
the lag search or a wrong phase can invalidate a measurement. Adding stations
does not repair incorrectly labelled phases.

## C. Select spatially close events independently of waveform similarity

The separate `iceland_close_pairs.csv` selects the three closest pairs in the
published 12:00–13:00 UTC catalogue, requiring an origin-time separation greater
than 30 seconds. This gives six events. The approximate 3D separations are 38, 57
and 61 metres; the rule and original row identifiers are recorded in
`close_pairs_selection.json`. Selection uses catalogue coordinates and time only,
not a correlation coefficient. Nearby origins make similar propagation paths
more plausible but do not guarantee equal source mechanisms or clean records.

```sh
.venv/bin/python scripts/download_sac.py \
  --events examples/download/iceland_close_pairs.csv \
  --network Z7 --stations DYJN,DYJS,HRIM --channels 'HH?' --location=-- \
  --pick-mode predicted --output work/iceland_close_pairs
julia --project=. --threads=4 bin/ddcorr.jl examples/download/iceland_close_pairs.toml
```

This uses the same processing thresholds and the same explicitly predicted phase
windows as the first example. It does not tune the acceptance criteria to force a
result. The predictions remain an approximation and need inspection.

The checked run produced **12 accepted station/phase observations: 8 P and 4 S**,
with signed correlation coefficients from 0.711 to 0.932. It downloaded 54 SAC
traces with no skipped selections; a repeat required zero network requests. These
are observed software outputs, not an independent accuracy validation. Exact
counts and download provenance are in `close_pairs_validation.json`.

## D. Supply your own catalogue and measured picks

Create an event CSV with the same column names as `iceland_events.csv`. Copy the
header-only `picks_template.csv` and fill actual picks, one event/station/phase per
row. Empty `location` means the blank location code; all arrivals use UTC:

```text
event_id,network,station,location,phase,arrival_utc,provenance
```

The provenance can identify an analyst or a named automatic picker and version.
The template intentionally contains no made-up observed pick times.

```sh
.venv/bin/python scripts/download_sac.py \
  --events my_events.csv --picks my_picks.csv --pick-mode observed \
  --network Z7 --stations DYJN,DYJS,HRIM --channels 'HH?' --location=-- \
  --output work/my_events
```

For another network, replace the network, explicit station list, channel selection,
location and catalogue. Use `--service https://YOUR_FDSN_PROVIDER` when the data
are hosted elsewhere. This helper does not discover or download every station in
a network automatically. Use explicit lists for small, predictable exercises.

See [the data and SAC guide](../../docs/DATA_AND_SAC.md) for headers, gaps, caching,
window lengths, sign conventions and troubleshooting.
