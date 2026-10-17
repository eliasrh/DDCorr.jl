# From archive waveforms to DDCorr

DDCorr compares short pieces of the **same seismic phase, at the same station,
from different events**. It does not detect earthquakes or associate a continuous
waveform with an event. A usable input therefore needs waveforms, event origins
and locations, and phase-window centres. The window centres are usually picks.

## 1. Run the offline exercise first

From the repository root:

```sh
python3 scripts/make_synthetic.py --output examples/synthetic
julia --project=. bin/ddcorr.jl DDCorr.toml --sac-dir examples/synthetic/sac --inspect
julia --project=. --threads=auto bin/ddcorr.jl DDCorr.toml --sac-dir examples/synthetic/sac
```

This generator needs only Python's standard library. It writes 72 synthetic SAC
files: six event folders, four stations, and three components. It deliberately
uses nonsequential folder labels and imperfect picks. Folder `905` contains only
noise, so a well-behaved run should not turn it into a supported earthquake.
The other five contain similar, independently noisy wave packets with known
relative timing. All coordinates and origins in this exercise are synthetic.

`truth_picks.csv` records true and supplied pick times separately.
`truth_pairs.csv` records `true_travel_time_i - true_travel_time_j`, in seconds.
The latter is the expected sign of `dt.cc`: subtract each event's origin before
taking the difference. Two events one minute apart can have a differential travel
time of only a few hundredths of a second. The supplied pick bias should be
corrected by waveform alignment if the search window includes the true lag.

## 2. Get real data in a small, explicit selection

Follow [the one-station, three-station, and supplied-pick examples](../examples/download/README.md).
They use the current EarthScope service directly. Historical examples may call it
IRIS. The current dataselect documentation states that SAC output is not yet
supported on the replacement service; this helper requests **miniSEED**, obtains
**StationXML**, and converts locally. See the [EarthScope dataselect service](https://service.earthscope.org/fdsnws/dataselect/1/).

The archive serves recorded sample values and clock times. StationXML supplies
station coordinates, channel names, sample rates, orientations and metadata epochs.
An event CSV supplies origins and hypocentres. A supplied-pick CSV or an explicitly
requested prediction supplies P/S window centres. None of these pieces should be
inferred from the others without recording the assumption.

The downloader writes:

```text
work/iceland/
  manifest.json                 # requests, hashes, sources, picks and skipped traces
  sac/
    S1_009900/
      Z7.DYJN..HHZ.sac
      Z7.DYJN..HHN.sac
      Z7.DYJN..HHE.sac
    S1_009901/
      ...
work/download_cache/            # verified miniSEED/StationXML and request receipts
```

Double dots represent a blank location code. Original event labels are folder
names. DDCorr creates a new contiguous `1,...,N` output ID sequence and a mapping
CSV; keep that mapping when comparing against an external catalogue.

## 3. Understand the minimum SAC contract

One immediate directory per event; one binary SAC time series per component.
Both byte orders and SAC versions 6/7 are supported by the Julia reader.
The archive helper writes little-endian version 6. ASCII SAC is not an input.

| Header | Meaning | What this helper supplies |
|---|---|---|
| `NZYEAR,NZJDAY,NZHOUR,NZMIN,NZSEC,NZMSEC` | UTC reference shared by relative times | Event origin rounded down to milliseconds |
| `B`, `DELTA`, `NPTS` | First sample relative to reference, sample interval in seconds, sample count | Derived from actual retained samples; `B` can be negative |
| `O` | Origin time relative to reference | Sub-millisecond origin remainder, if any |
| `A`, `T0` | P and S arrival/window centres relative to reference | Supplied UTC picks or explicit predictions |
| `KA`, `KT0`, `KUSER0` | Human-readable provenance labels | `P_obs/S_obs/SUPPLIED` or `P_pred/S_pred/PREDICT` |
| `EVLA,EVLO,EVDP` | Event latitude, longitude, depth | Catalogue values; **depth in km** |
| `STLA,STLO,STEL,STDP` | Station coordinates, elevation, sensor depth | Channel metadata; elevation/depth in **metres** |
| `KNETWK,KSTNM,KHOLE,KCMPNM` | Network, station, location, component | Archive identifiers |
| `CMPAZ,CMPINC` | Azimuth clockwise from north; inclination from upward vertical | `CMPAZ=azimuth`; `CMPINC=dip+90°` |
| `IFTYPE,LEVEN` | Evenly sampled time series | `ITIME`, true |

SAC uses `-12345` to mark an undefined header. That is **not** a pick at a negative
time. `O=0` is appropriate only when the reference time really is the origin.
Changing the reference requires changing every relative-time header consistently.
`STEL=1000` means 1000 metres, while `EVDP=7` means 7 kilometres.
See [ObsPy's SAC time-reference documentation](https://docs.obspy.org/packages/autogen/obspy.io.sac.sactrace.html)
and [the SAC header definitions](https://docs.obspy.org/packages/autogen/obspy.io.sac.header.html).

DDCorr defaults to `A` for P and `T0` for S. If your SAC files use different fields,
change `[input] p_pick_header` and `s_pick_header` in the public TOML; do not move picks by guessing.
Every compared event must use a consistent phase convention. Phase labels, origin
metadata and coordinate consistency should be inspected before correlation.

## 4. Predictions are useful window centres, not measured arrivals

In the explicit `--pick-mode predicted` exercise the helper uses

\[
t_P=\frac{\sqrt{r^2+(z+h-d)^2}}{v_P},\qquad
t_S=\frac{\sqrt{r^2+(z+h-d)^2}}{v_S}.
\]

Here `r` is horizontal source–station distance, `z` is event depth below sea level,
`h` is station elevation, and `d` is the sensor depth below its local surface.
All four lengths use kilometres in this expression. `vP=6.0` and `vS=3.5 km/s` are
**teaching assumptions**, exposed as `--vp/--vs`, not the Ágústsdóttir velocity
model. The predicted UTC arrival equals origin plus predicted travel time.

Nearby events may have useful relative alignment even when absolute predictions
are imperfect, but the actual phase must fall in the selected window and the
relative timing correction must fit inside `max_lag_s`. A high coefficient is not
proof that the selected feature is P or S. Coherent coda or tremor can correlate.
For scientific work, use inspected picks or a justified travel-time model and
validate representative windows and difficult cases independently.

The helper requires P for its default pre-P noise window. Missing S is left
undefined; it is not invented. DDCorr can then record why a phase is unavailable.
The `observed` mode means the supplied file contains your picked arrivals; it does
not certify that they were picked manually. Name the analyst or automatic picker
in the `provenance` column.

## 5. Keep enough real waveform around the phase windows

Default downloads span 25 seconds before through 70 seconds after each event
origin. The converter requires at least 15 seconds before P and 10 seconds after
the latest supplied phase. These margins support the default pre-P noise estimate,
filter padding, lag search and P/S windows. Increase `--before` or `--after` for
distant stations or longer windows. Changing processing windows may require more
data than these defaults.

No gap is replaced by zeros or fabricated interpolation. A contiguous miniSEED
trace can be assembled from adjacent records. Contradictory overlapping records,
masked gaps, nonfinite data, incomplete coverage, a sample-rate change or an
ambiguous metadata epoch are recorded as skipped traces. Metadata availability
does not guarantee waveform availability. Inspect `manifest.json` if fewer
stations/components arrive than expected. The [FDSN station metadata documentation](https://service.earthscope.org/fdsnws/station/docs/1/help/)
describes the channel fields and epoch selection.

The converter leaves the data in archive digital counts. It applies **no filter,
resampling, instrument response removal, or rotation**. DDCorr performs its own
documented preprocessing once. Equal response across event records at a channel
is useful for relative correlation; varying responses or gain changes need
scientific assessment. These snippets are not ready for calibrated amplitude work.

## 6. Resume and reuse safely

Repeat exactly the same command after a temporary connection failure. Completed
requests are reused after SHA256 verification; written SAC files must also match
their manifest. A changed request needs a different `--output` directory, but can
use the same cache. The blank location argument is **`--location=--`**, with the
equals sign. That avoids an argument parser interpreting the value as a new option.

The default 20 MiB limit counts all selected archive inputs, including reused
ones. The helper also limits each response to 4 MiB, each snippet to 600 seconds,
and a command to 200 event/station combinations. It requests one station/event
at a time. These are teaching and resource safeguards, not limits in DDCorr itself.

The cache matches exact requests, not arbitrary overlapping intervals. A different
channel wildcard or cut length may cause a new request. Cached no-data responses
are retained; use a new cache directory if you want to check whether an archive
has since been backfilled. Do not run simultaneous writers against one cache.
HTTP 204 is recorded as no data; authentication and unexpected HTTP errors stop
with the URL and status. Restricted data authentication is not implemented in this
small helper.

## 7. Review before passing measurements downstream

Check the inventory, missing-pick reasons, example alignments and lag-edge flags.
Use the ID map to trace every output back to its original folder. Correlation
matrices and high coefficients describe waveform similarity; they are not an
independent declaration that every catalogue entry is real. Retain the manifest,
configuration and unmodified original snippets with scientific outputs.
