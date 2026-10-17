# DDCorr.jl lecture notes

The PowerPoint contains editable text, equations, tables and charts. Code excerpts are images of the exact source listed below.

# 1. DDCorr.jl

Waveform correlation for graph based earthquake relocation

A worked minicourse for MSc students

This course starts with running the software. It then explains each processing decision, the relevant mathematics, and the corresponding Julia implementation. Students should know what a seismic waveform and a P or S arrival are. Prior experience with digital filtering or correlation is not assumed. Commands assume a terminal opened in the cloned repository. Every time variable in this deck has units of seconds unless stated otherwise.

---

# 2. The measurement we need

a is an arrival time at one station. o is the event origin time. Their difference is a travel time.

Similar waveforms let us refine the difference between two arrivals. DDSync then checks consistency across many event pairs.

DDCorr starts with event SAC files and approximate phase picks. Detection and phase association happen earlier.

Equation: Δtᵢⱼ = (aᵢ − oᵢ) − (aⱼ − oⱼ)

The subscripts i and j refer to events. A station and a phase are fixed while comparing them. Removing the origin-time separation is crucial. Subtracting absolute arrivals for events minutes apart would leave an enormous, irrelevant offset. This is the reduced-time convention expected by the downstream configuration exported here. DDCorr does not locate earthquakes on its own.

---

# 3. The first session

1. Clone the repository and install the Julia packages.

2. Generate a small synthetic SAC directory with known delays.

3. Inspect the SAC headers, run correlation, and open the report.

4. Repeat with archive waveforms once the input contract is clear.

The synthetic exercise isolates installation and sign conventions from archive availability. Real downloads add service behavior, waveform gaps, station metadata, and imperfect picks. Keeping these stages separate makes a failure easier to diagnose. The synthetic data are artificial and are not a test of earthquake detection accuracy.

---

# 4. Repository and Julia environment

The repository is private. The instructor must grant your GitHub account access before you clone it.

Run the commands from the DDCorr.jl directory. The project and manifest specify the Julia package environment.

```sh
git clone https://github.com/eliasrh/DDCorr.jl.git
cd DDCorr.jl
julia --project=. -e 'using Pkg; Pkg.instantiate()'
```

Install Julia before starting. GitHub may ask for authentication. Do not paste passwords or tokens into the command itself. The pinned Manifest.toml supports reproducibility on the tested Julia environment. Follow README.md for the tested Julia version and platform limitations. Source repository: https://github.com/eliasrh/DDCorr.jl

---

# 5. A small SAC dataset with known answers

The Python generator uses the standard library. It creates event folders, SAC files, and truth tables.

The inspection step reads headers and writes an inventory. It gives you a chance to resolve missing or inconsistent metadata before correlation.

```sh
python3 scripts/make_synthetic.py --output examples/synthetic

julia --project=. bin/ddcorr.jl DDCorr.toml \
  --sac-dir examples/synthetic/sac --inspect
```

The generator supplies controlled waveform delays, origins, coordinates, picks, and orientations. Treat these files as an exercise. Inspection should succeed before a full run. Preserve the truth tables because they provide an independent target for checking the sign and size of differential times. This command uses the supplied defaults unless DDCorr.toml has been edited.

---

# 6. The main settings in DDCorr.toml

The S section has its own settings. Frequencies are Hz. Windows and lags are seconds. min_cc is a correlation coefficient, not its square.

```sh
[input]
sac_dir = "examples/synthetic/sac"
p_pick_header = "a"
s_pick_header = "t0"

[P]
band_hz = [2.0, 14.0]
max_lag_s = 0.5
min_cc = 0.70
```

This is a partial example, not a replacement for the complete supplied configuration. The main file exposes the choices students are likely to vary. More detailed controls live in src/defaults.toml. Relative configuration paths resolve from the configuration file, except an explicit CLI SAC directory path follows its documented CLI resolution. Check the supplied configuration comments for the current default lag and threshold.

---

# 7. The first correlation run

The terminal prints the new result directory. Open its report.html in a browser.

Check the input and preprocessing issues, accepted P and S counts, and example waveform alignments.

Each run saves the effective settings. Keep that file with the results.

```sh
julia --project=. --threads=4 bin/ddcorr.jl DDCorr.toml \
  --sac-dir examples/synthetic/sac
```

The first run may spend time compiling Julia packages. --threads=4 uses four Julia workers. Use a smaller number on a limited or shared machine. Repeating a run creates a new result directory and can reuse compatible completed station-phase caches. Do not assume an empty dt.cc means success: inspect the reasons that traces or pairs were excluded.

---

# 8. What a successful run leaves behind

The exact result directory comes from the terminal. Keep the whole directory together.

The directory also contains the effective configuration, inventories, issue logs, downstream configuration fragments, and optional matrix exports. File names in the teaching package match this release. Output IDs must be used consistently in every downstream file. A pair can be missing at one station and present at another.

---

# 9. A fresh SAC directory

One immediate subdirectory represents one event. The folder label identifies the original event.

SAC headers identify the station and component. File names help people, but the code reads the headers.

```sh
my_sac/
  event_A/
    Z7.DYJN..HHZ.sac
    Z7.DYJN..HHN.sac
    Z7.DYJN..HHE.sac
  event_B/
    Z7.DYJN..HHZ.sac
    ...
```

The same station/channel identity must describe the same physical component for both events. KEVNM can be short or duplicated and therefore is not the authoritative event key here. Each event must have enough consistent metadata to create the downstream catalogue. Copy or prepare an event archive rather than passing an arbitrary continuous waveform directory.

---

# 10. SAC identity and geometry

Keep the meaning and units consistent across the whole archive.

SAC numeric undefined values must not masquerade as real metadata. The conventional undefined sentinel is -12345. DDCorr reads SAC v6/v7 evenly sampled time series and handles byte order. EVDP is kilometres in this interface. STEL is metres. CMPINC is inclination from upward vertical: 0° or 180° for vertical and 90° for horizontal. Headers are not inferred reliably from arbitrary file names.

Sources:
https://ds.iris.edu/files/sac-manual/manual/file_format.html

---

# 11. SAC time is a reference plus an offset

NZYEAR, NZJDAY, NZHOUR, NZMIN, NZSEC and NZMSEC define the reference time.

B is the first-sample offset. DELTA is the sample spacing in seconds. O is the origin offset.

The default P pick is A. The default S pick is T0. A different header requires an explicit setting.

Equation: absolute pick time = reference UTC + A
travel-time estimate = A − O

A, T0 and O are all offsets from the same SAC reference time within one file. A frequent failure is writing a pick as seconds after the waveform start without also accounting for B. Different traces may have different reference clocks, but their absolute origin times for one event must agree. Julian day means day of year, not an astronomical Julian date. Calendar and leap-second conversions require care.

Sources:
https://ds.iris.edu/files/sac-manual/manual/file_format.html

---

# 12. An example SAC clock

The waveform starts 20 seconds before the origin. P arrives 5 seconds after the origin.

These values are a constructed header example. They are not extracted from a particular earthquake. The 20 seconds before origin may or may not satisfy every requested noise window and filter padding for another configuration. Check the actual earliest and latest required times. When O is nonzero, the reduced P arrival is A−O rather than A.

---

# 13. The archive does not provide your phase picks

The waveform service supplies samples, normally as miniSEED. The station service supplies channel coordinates and orientations.

A separate event catalogue supplies origins and approximate event locations. Picks must come from an analyst, a picker, or explicit predictions.

The optional download script combines these ingredients and writes SAC. It records where the picks came from.

The current EarthScope FDSN dataselect service does not provide SAC as its normal waveform response. The teaching helper therefore downloads miniSEED plus StationXML and converts them. These archive responses do not by themselves populate reliable event-specific P and S arrival picks. Predicted times may center a tutorial search window, but they are model dependent and may be wrong. Verify arrivals before scientific use.

Sources:
https://service.earthscope.org/fdsnws/dataselect/1/
https://service.earthscope.org/fdsnws/station/1/

---

# 14. The optional download environment

The download helper uses ObsPy to read archive waveforms and StationXML and write SAC files.

This Python environment is separate from the Julia correlation environment. The synthetic exercise does not require ObsPy.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-download.txt
```

Use the exact dependency versions specified in requirements-download.txt for this release. A virtual environment keeps these dependencies separate from other Python projects. On Windows, the Python executable location in a virtual environment differs. The walkthrough here uses macOS/Linux shell syntax. Source for ObsPy FDSN interface: https://docs.obspy.org/packages/obspy.clients.fdsn.html

Sources:
https://docs.obspy.org/packages/obspy.clients.fdsn.html

---

# 15. A small Iceland waveform download

This example uses six events selected as three close catalogue pairs and three stations. The selection uses locations, not correlation results.

Predicted P and S times use the helper’s simple velocity assumptions. They are tutorial window anchors, not published or observed picks.

```sh
.venv/bin/python scripts/download_sac.py \
  --events examples/download/iceland_close_pairs.csv \
  --network Z7 --stations DYJN,DYJS,HRIM \
  --channels 'HH?' --location=-- \
  --pick-mode predicted --output work/iceland_close_pairs
```

The quoted HH? pattern means the three high-rate HH components when available. FDSN uses -- to request an empty location code. The equals sign in --location=-- is important so the argument parser does not confuse the value with another option. The catalogue pairs were selected by short 3D separation, requiring more than 30 seconds between origins, before their correlations were inspected. This sample does not recreate the full published study network. Station availability and waveform continuity can differ from the metadata inventory. Read the output manifest.

Sources:
https://service.earthscope.org/fdsnws/dataselect/1/

---

# 16. Correlating the downloaded events

The checked example produced 54 SAC files and 12 accepted observations: 8 P and 4 S. Coefficients ranged from 0.711 to 0.932.

The separate four-event format example produced no accepted edges with the same settings. Valid SAC files do not guarantee useful phase windows or similar waveforms.

```sh
julia --project=. --threads=4 bin/ddcorr.jl \
  examples/download/iceland_close_pairs.toml --inspect

julia --project=. --threads=4 bin/ddcorr.jl \
  examples/download/iceland_close_pairs.toml
```

The six-event close-pair selection used catalogue geometry independently of waveform correlations, and origin separations greater than 30 seconds. This is a small teaching example, not an unbiased catalogue validation. Picks still use the explicitly labelled homogeneous model. The 54 downloaded traces had no skipped channels in the checked request. Details and the alternative four-event example are in examples/download/README.md. Do not relax every acceptance rule simply to get a nonempty result.

---

# 17. Observed picks for scientific use

Supply an event table with event ID, UTC origin, latitude, longitude, and depth.

Supply a pick table keyed by the same event ID plus network, station, location, phase, and UTC arrival.

The helper writes those times into the selected SAC pick headers. It records pick provenance in its manifest.

The exact CSV columns and an observed-pick example are in docs/DATA_AND_SAC.md.

Predicted arrival times can center a search but do not turn a false event into an earthquake. A missing S pick should remain missing. Do not label a model prediction as an analyst pick. The download helper handles file conversion, not phase association. For existing local SAC data, use the inspection command and adapt the main pick-header settings rather than guessing.

---

# 18. Download checks and reuse

The helper caches waveform and station responses with checksums. Repeating the same request reuses verified files.

An archive may return no data, incomplete components, or gaps. The manifest records these outcomes.

The helper does not fill missing samples with zeros and call them observations. Correlation needs real data around the signal and noise windows.

Exact-request caching is different from a general time-range archive. A changed request can require a new download. Preserve the cache and manifests if you want reproducibility. A valid station inventory entry does not prove complete waveform coverage during the desired interval. Verify the generated SAC inventory before launching all pairs. The separate earlier SeismicPipeline downloader has different cache semantics. Do not assume those apply here.

---

# 19. The Julia source map

Report and matrix modules turn the observations into inspection products.

Read signal.jl first when learning the scientific processing. The surrounding modules keep file handling and plotting out of the numerical routines. The small public TOML is the normal interface. The detailed defaults remain visible in the repository for audit and advanced experiments. The exact release also exports provenance information with results.

---

# 20. Two configuration layers



The advanced file is hidden from the usual teaching workflow, not secret. Read its comments when changing filter order, taper fraction, peak ambiguity, orientation tolerances, or resource limits. Prefer a separate override file for experiments so the shipped defaults remain traceable. The configuration loader rejects unknown keys to catch misspellings. A missing key in the short configuration takes its documented default.

---

# 21. Processing one station and one phase

The code matches the same physical component between events. It removes the mean and trend, tapers the trace ends, and filters the available trace.

It resamples with anti-alias protection and extracts windows relative to the phase picks.

It tests waveform quality, measures each pair’s correlation curve, and keeps observations that pass the acceptance rules.

This sequence matters. Filtering a tiny cut creates boundary artifacts near the feature you want to align. Resampling without a low-pass filter can fold high-frequency energy into the analysis band. Grouping by station and phase keeps the observation meaning consistent for synchronization. A station-phase graph is a separate graph of relative times.

---

# 22. A waveform is a sequence of samples

n is the sample index. Δs is the sample spacing in seconds. fₛ is the sampling rate in samples per second, or Hz.

At 100 Hz, adjacent samples are 0.01 s apart. A 0.12 s displacement is 12 samples.

The waveform amplitude may be instrument counts. Normalized correlation compares shape rather than absolute amplitude.

Equation: x[n] = x(t₀ + n Δs),     fₛ = 1 / Δs

The symbol Δs here denotes sample spacing, so it is distinct from the differential time Δt. Sampling is not the same as the precision of a phase pick. A correlation fit may estimate a fraction of a sample, but that does not prove that the true physical arrival is known to the same precision.

---

# 23. Removing an offset and a linear drift

Demeaning subtracts the average amplitude. Detrending also removes the best-fitting straight line.

These slowly varying terms can otherwise influence filtering and correlation. The seismic waveform still needs its own quality checks.

The centered coordinate t runs from −1 to 1. Its sum is zero, so slope = dot(t,y)/sum(t²) is the least-squares linear slope after removing the mean. This operation does not remove arbitrary long-period noise or glitches. It is a simple preparation step. The excerpt is copied from this repository release, with line numbers.

Implementation: src/signal.jl:2–8

Exact source excerpt:
2: function detrend(x)
3:     y=Float64.(x); n=length(y); y .-= mean(y)
4:     t=range(-1,1;length=n)
5:     slope=dot(t,y)/sum(abs2,t)
6:     y .-= slope .* t
7:     return y
8: end

---

# 24. A taper softens the trace ends

A sharp start or end creates a jump. A cosine taper reduces that jump before filtering.

This illustration tapers 8% at each end to make the effect visible. The configured fraction can differ.

This is a constructed taper illustration with fraction 0.08. The actual implementation uses a discrete cosine at each end and limits the taper to half the trace. Keep the analysis window well inside the full trace so the end taper does not suppress the arrival of interest. Implementation: src/signal.jl, taper!.

---

# 25. The taper implementation

The multiplier rises smoothly from near zero toward one. The same rule acts on the opposite end.

fraction refers to the fraction at each end of the full trace, not the later correlation window.

The integer number of taper samples depends on the full trace length. The first multiplier is slightly above zero because k begins at one and the denominator is n+1. Short excerpts omit none of this function. A taper changes the data deliberately. Inspect whether your desired phase or noise window lies inside the affected endpoints.

Implementation: src/signal.jl:10–17

Exact source excerpt:
10: function taper!(x,fraction)
11:     n=min(length(x)÷2,round(Int,fraction*length(x)))
12:     for k in 1:n
13:         w=0.5*(1-cospi(k/(n+1)))
14:         x[k]*=w; x[end-k+1]*=w
15:     end
16:     return x
17: end

---

# 26. A bandpass keeps a range of frequencies

A low corner suppresses slow variations. A high corner suppresses rapid variations. A bandpass combines both effects.

For example, 2–14 Hz retains oscillations with periods roughly 0.5–0.071 s.

P and S can need different bands. The same settings must apply consistently to both events in a comparison.

The frequency f has period T=1/f. The corners are transitions, not a wall that perfectly removes everything outside. Lowering the band can improve visibility of longer-period energy but broaden correlation peaks and increase cycle ambiguity. Raising the band can sharpen timing when high-frequency signal survives, or mainly amplify the influence of noise when it does not. No single band is universally optimal.

---

# 27. Butterworth filtering in both directions

DDCorr designs a Butterworth bandpass and applies it forward and backward with filtfilt.

The two directions cancel phase delay. They also square the amplitude response, so filter order and corner interpretation matter.

Butterworth filters have a smooth passband without the ripple introduced by some alternative designs. The bandpass transformation doubles the prototype order, and forward/reverse application doubles the effective order again. Second-order sections help numerical stability. Zero-phase filtering uses future samples and is appropriate for offline processing, not a strictly causal live trigger. Boundary effects still exist, so padding is required.

Implementation: src/signal.jl:23–23, 30–30

Exact source excerpt:
23:     return convert(SecondOrderSections,digitalfilter(Bandpass(lo,hi),Butterworth(pc["filter_order"]);fs=fs))
: …
30:     y=filtfilt(bandfilter(native_fs,pc),x)

Sources:
https://docs.juliadsp.org/stable/filters/

---

# 28. Choosing a useful frequency band



A good band balances signal visibility, timing resolution, and peak uniqueness. For these Iceland examples, 2–14 Hz is an initial teaching choice consistent with the user’s domain guidance. The mining application used different bands, especially for S. Do not copy those settings solely because the original code ran successfully. Hold all other controls fixed in a band comparison.

---

# 29. Aliasing during downsampling

At 20 samples/s, 12 Hz and 8 Hz have identical sampled cosine values. The 12 Hz energy can masquerade as 8 Hz.

The new Nyquist frequency is fₛ/2 = 10 Hz. A low-pass anti-alias filter must suppress energy above it before downsampling.

The example is exact: cos(2π12n/20)=cos(2π8n/20) for integer n. Lines show analytic curves and the markers show sample times. The example illustrates downsampling without adequate anti-aliasing. A bandpass high corner is not a brick-wall stop band, so a dedicated resampling filter still matters. This slide uses synthetic analytic data.

---

# 30. Resampling with anti-alias protection

The target sampling rate sets the number of samples used in correlation. Lower rates reduce work when they still represent the chosen band.

DSP.resample uses a finite impulse response filter and compensates its delay. DDCorr refuses a target above the native rate.

A finite impulse response filter forms each output from a finite neighborhood of input samples. Polyphase implementation avoids doing all unnecessary intermediate work. The rational ratio is target/native. DDCorr also checks that the upper band corner is below 0.45 times both applicable sampling rates. The 0.45 margin is a guardrail rather than a theorem that any signal is fully represented.

Implementation: src/signal.jl:31–36

Exact source excerpt:
31:     target=pc["sample_rate_hz"]
32:     target<=native_fs*(1+1e-6) || error("Requested sampling exceeds native rate")
33:     # DSP.resample is a delay-compensated polyphase FIR resampler with anti-aliasing.
34:     ratio=rationalize(target/native_fs;tol=1e-7)
35:     z=ratio==1 ? y : resample(y,ratio)
36:     return raw,y,z,h.floats[1]/Float64(ratio)

Sources:
https://docs.juliadsp.org/stable/filters/

---

# 31. Signal window and lag search

[a,b] is the window relative to the phase pick. N is its number of samples, including both endpoints.

The search extends L samples on each side. A larger lag range allows a larger pick correction and more opportunities for a false match.

Example: [−0.5, 2.0] s at 50 Hz gives N = 126. A ±0.5 s search gives L = 25.

Equation: N = round((b − a) fₛ) + 1
L = round(max_lag_s × fₛ)

The code requires configured window duration and maximum lag to fall on the target sample grid. Ncore+2L samples form the extended window. The comparison uses fixed-length windows at each lag, rather than allowing the overlap to shrink with lag. The numerical example is pedagogic and may differ from the shipped S window.

---

# 32. Real samples beyond the analysis window

The complete trace must contain the signal search window, the pre-P noise window, and extra filter padding.

The code checks both ends before filtering. A missing margin is a data problem, not a reason to pad the observation with zeros.

The smallest required time is the earlier of the extended signal window and the noise window, minus padding. The largest required time is the later endpoint plus padding. The separate pre-P noise anchor is required even for S, so the P coda is not used as the default S-noise interval. DSP filter routines may use internal endpoint extensions, but these do not replace real observed margins.

Implementation: src/signal.jl:87–89, 93–94

Exact source excerpt:
87:     start=p+a-L/fs; stop=p+a+(n-1+L)/fs
88:     margin=pc["filter_padding_s"]
89:     sacbegin=h.floats[6]; sacend=sacbegin+(h.ints[10]-1)*h.floats[1]
: …
93:     na,nb=pp .+ prep["noise_window_s"]
94:     min(start,na)-margin>=sacbegin && max(stop,nb)+margin<=sacend || error("Insufficient real data around filter/window edges")

---

# 33. Band-limited signal-to-noise ratio

Both measurements use the same filter and target sample rate. RMS means root mean square amplitude.

An SNR of 2 means the signal-window RMS is twice the pre-P noise RMS. It does not mean the event is twice as likely to be real.

Tremor and an earlier event can contaminate the noise window. Inspect it.

Equation: SNR = RMS(signal after mean removal)
               / RMS(pre-P noise after mean removal)

For a zero-mean sequence z of N samples, RMS=sqrt(sum(z[n]²)/N). The code computes signal standard deviation with corrected=false, which is this RMS after centering. Each component must pass its phase minimum SNR. The pair audit reports the minimum across its contributing traces and components. A fixed SNR threshold cannot classify every waveform reliably.

---

# 34. Normalized discrete cross-correlation

For each trial shift k, compare N samples. Ā and B̄ₖ are their means. The sums run over those N samples.

The denominator removes overall amplitude scale. r = 1 means identical centered shapes up to a positive scale. r = −1 means a polarity reversal.

Equation: rAB[k] = Σₙ (A[n] − Ā)(B[n+k] − B̄ₖ)
             / √(Σₙ(A[n] − Ā)² Σₙ(B[n+k] − B̄ₖ)²)

The displayed equation defines one directional, fixed-window normalized correlation. A is the fixed core and B is a shifted N-sample window drawn from a larger trace segment. The full DDCorr curve averages this quantity with the reversed role calculation on a later slide. Flat windows have zero denominator and must be rejected. A large coefficient measures shape agreement, not earthquake probability.

---

# 35. A correlation coefficient by hand

Both means are zero. The norms are √2 and √8, so r = 4 / (√2 × √8) = 1.

B has twice the amplitude but exactly the same shape.

This is a constructed example at one fixed lag. Use it to check the meaning of normalization before introducing the FFT. Replacing B by [2,0,−2] would give r=−1. Adding a constant to B would disappear after centering. A three-sample example is not a recommended seismic correlation window.

---

# 36. Both events contribute a reference window

DDCorr averages two directional comparisons. One keeps A fixed and shifts B. The other keeps B fixed and shifts A in the opposite direction.

This treats the two events symmetrically while preserving one consistent lag sign.

The formula is C_AB[k]=0.5(r_AB[k]+r_BA[−k]). Each term has its own fixed-template and sliding-window norm. Reversing event order reverses lag and differential-time signs. The implementation clamps tiny floating-point excursions to [−1,1]. This does not change which physical signal the code is comparing. The method matches the existing MiningCorrelations implementation.

Implementation: src/signal.jl:130–135

Exact source excerpt:
130:     @inbounds for k in 1:m
131:         r=m-k+1
132:         w.curve[k]=clamp(0.5*(w.ab[n+k-1]/(a.template_norm*b.sliding_norm[k])+
133:                               w.ba[n+r-1]/(b.template_norm*a.sliding_norm[r])),-1.0,1.0)
134:     end
135:     return w.curve

---

# 37. The FFT computes the same sums efficiently

A direct implementation repeats many multiply-and-add operations for every lag. The fast Fourier transform reorganizes that calculation.

The code pads the arrays so the convolution represents a linear shift, then reuses transformed windows and work buffers.

The FFT is a computational method, not a different scientific definition of correlation. Reversing the fixed core converts correlation into a convolution. Padding to at least core_length+extended_length−1 prevents wraparound from circular convolution. Norms still vary with the sliding window and therefore are computed separately. The FFT does not create timing information that was absent in the samples.

Implementation: src/signal.jl:72–74, 126–127

Exact source excerpt:
72:     nf=nextpow(2,ncore+length(ext)-1)
73:     tf=rfft(vcat(reverse(core),zeros(nf-ncore)))
74:     ef=rfft(vcat(ext,zeros(nf-length(ext))))
: …
126:     @. w.product=a.template_fft*b.extended_fft
127:     mul!(w.ab,w.plan,w.product)

---

# 38. The lag sign in a waveform example

The peak for B lies 0.12 s later relative to its own pick. The correlation lag is therefore +0.12 s.

To overlay B on A, plot B at time − 0.12 s. The plotting shift has the opposite sign to the measured lag.

The two pulses are a constructed example. “B later” means relative to each event’s chosen pick alignment, not later in calendar time. This distinction is essential when the event origins differ by minutes. Positive lag is defined by evaluating B[n+k] against A[n]. It becomes a negative correction in the exported differential time.

---

# 39. Lag becomes a differential travel time

Suppose the initial reduced picks are 5.00 s and 5.30 s. B’s waveform is +0.12 s later than its pick alignment predicts.

The exported value is 5.00 − 5.30 − 0.12 = −0.42 s.

The event origins can be minutes apart. That origin separation has already been removed.

Equation: Δtᵢⱼ = (pᵢ − oᵢ) − (pⱼ − oⱼ) − lag

Here p denotes the absolute phase-pick time and o is the absolute event origin. In SAC the difference can be formed with reference-aware offsets without subtracting two very large epochs. The correlation lag is a relative correction, so assigning the correction wholly to B in this explanation is only a convenient interpretation. The pair difference is the measured quantity. Verify the sign with the synthetic truth before passing another format downstream.

---

# 40. Refining a peak between samples

The largest sampled coefficient identifies a discrete peak. A parabola through that point and its two neighbors estimates a small offset δ.

The code limits δ to half a sample. The reported coefficient remains the sampled signed value, not a new fitted amplitude.

For left, middle and right peak scores a,b,c, δ=0.5(a−c)/(a−2b+c). The lag is (integer_offset+δ)/fs. The fit is used only for an interior, concave peak. In absolute-polarity mode, these scores are absolute values while the saved coefficient remains signed. A fitted 0.001 s displacement is an interpolation estimate, not a measured uncertainty of 0.001 s.

Implementation: src/signal.jl:150–154

Exact source excerpt:
150:     if quality["subsample"] && 1<idx<length(curve)
151:         a,b,c=score(curve[idx-1]),score(curve[idx]),score(curve[idx+1])
152:         denom=a-2b+c
153:         denom < -eps(Float64) && (delta=clamp(0.5*(a-c)/denom,-0.5,0.5))
154:     end

---

# 41. Combining horizontal components for S

Each matching horizontal component produces its own normalized correlation curve. DDCorr averages these curves before selecting one lag.

The horizontal components contribute to one common shift. Selecting the largest coefficient from either component would favor a lucky noise match.

Default S behavior requires two compatible horizontal components. The code compares the same network, station, location and channel with orientation consistency. It uses component inclination when available, otherwise channel suffixes. This release does not rotate every pair into radial and transverse coordinates. Sensor axes and response changes can therefore matter. Individual component reduced-pick differences must agree within the configured tolerance. See src/pipeline.jl process_group.

Implementation: src/pipeline.jl:98–101, 102–102

Exact source excerpt:
98:                                 for key in common
99:                                     totalcurve .+= correlation!(w,A[key],B[key])
100:                                     snr=min(snr,A[key].snr,B[key].snr)
101:                                 end
: …
102:                                 totalcurve ./= length(common)

---

# 42. Acceptance uses more than one threshold

A rejected pair has no accepted dt.cc observation for that station and phase.

The boundary rule prevents reporting a clipped optimum as though it were a well-constrained peak. The ambiguity test compares local maxima outside an exclusion neighborhood around the winner. Sparse observations at other stations are kept if they pass. An optional initial-location distance cutoff is available in the advanced controls but may be undesirable when starting locations are poor.

---

# 43. Repeated cycles can give several plausible lags

An oscillatory waveform repeats after one period. A large peak can have a nearly equally large neighbor.

The peak-gap rule measures the winning score minus the strongest independent competitor. Inspect the whole curve.

These analytic curves illustrate ambiguity. They are not output from a particular event pair. The narrow-band example has neighboring positive peaks approximately 0.125 s apart because its frequency is 8 Hz. The actual peak-gap algorithm ignores a short neighborhood of the winner so it does not count the shoulders of one broad peak as independent maxima. Too wide an exclusion can hide a real cycle competitor.

---

# 44. Positive and absolute correlation modes



The quality.polarity advanced setting controls ranking. Threshold and ambiguity tests use the chosen score. The output weight is nonnegative even if the coefficient is negative in absolute mode. Absolute mode can admit a physically meaningful polarity reversal, but it can also increase the number of accidental matches. The downstream dt sign does not change just because the coefficient is negative.

---

# 45. Plots for checking a run

With no requested pairs, the report selects weak, middle, and strong accepted examples deterministically.

Requested pairs use output IDs from event_id_map.csv. Read the report’s labels before interpreting a plot.

```sh
[plots]
enabled = true
summary = true
examples = true
filters = true
closure = true
max_examples = 18
event_pairs = [[1, 2], [2, 3]]
```

Plot selection is an inspection aid, not a random validation sample. The example waveform panel shows unshifted and aligned traces with the full correlation curve. Within each station-phase group, accepted rows are sorted by |r| and event IDs to select weak, middle and strong examples. The global maximum evenly samples their ordered concatenation. Distributions summarize accepted coefficients and lags, and the filter panels expose the actual preprocessing response. Inspect failures separately from accepted examples. Requested absent or rejected pairs have no accepted-example plot. The selection and unavailable pairs are recorded in example_selection.csv.

---

# 46. Correlation matrices preserve missing data

A matrix places event i on one axis and event j on the other. It is useful for seeing groups of similar events.

Export matrices separately by station and phase. A missing or rejected pair is missing evidence, not a zero coefficient.

Sparse exports store only measured edges and avoid allocating an N × N array. Optional dense exports need a size limit.

The diagonal is not a measured event pair. Do not invent perfect self-correlations in the scientific observation list. The release supplies station-phase sparse matrices and an optional bounded dense representation as documented in its configuration. If inspecting a matrix of accepted edges, remember that thresholding has already selected which entries appear. Matrix export does not change dt.cc.

---

# 47. The dt.cc record

The header identifies an event pair. Each following row contains station, differential time in seconds, weight, and phase.

Here the P coefficient is r = 0.90, so the default weight is r² = 0.81.

These are constructed format examples, not measurements from the downloaded events.

```sh
# 1 2 0.0
Z7.DYJN   -0.42000000   0.810000   P
Z7.DYJN   -0.70000000   0.722500   S
```

DDCorr exports reduced travel-time differences. The header’s 0.0 is the format’s correction field, not a physical origin-time separation to add again. The default weight is squared correlation. The audit CSV retains the signed coefficient separately. Precision in the printed decimal representation should not be interpreted as measurement uncertainty. Confirm the consuming program’s convention instead of relying on the extension .cc alone.

---

# 48. Sequential IDs and downstream settings

DDCorr assigns output IDs 1,…,N and writes event_id_map.csv. The mapping preserves each original event folder label.

catalog.txt, dt.cc, matrices and reports use those same output IDs. A new event set can produce a different mapping.

For the default r² export, DDSync base_mode = "cc" uses the supplied weight once. Choosing another squaring mode would weight by r⁴.

The catalogue columns are year, month, day, hour, minute, seconds, latitude, longitude, depth_km, event_ID. Stations are keyed consistently with dt.cc. GraphSplit also needs a velocity model or travel-time table and an appropriate relocation configuration. Exported input fragments do not supply the missing scientific model. Preserve the ID map alongside every run, especially when selecting a pilot or changing the input directory. The generated DDSync configuration explicitly uses MIN_EDGES=3 for this small teaching graph. GraphSplit toy tests also lower minimum_theta_degree to 3. These settings are not universal quality thresholds for large datasets.

---

# 49. A station-phase graph

Each event is a node. Each accepted pair is an edge carrying a differential time and a weight.

DDSync estimates one relative time θ per event so many edges agree. The second equation is a triangle closure check.

A disconnected group has its own unconstrained time reference. It needs separate treatment downstream.

Equation: dᵢⱼ ≈ θᵢ − θⱼ
d₁₂ + d₂₃ + d₃₁ ≈ 0

θ is defined only up to an additive constant within each connected component. A noisy or wrong edge can disagree with many alternative paths. Closure helps reveal inconsistency without choosing a velocity model. It does not prove the physical source is an earthquake, and a graph that has no independent cycles offers less opportunity for this check. Relative relocation later brings in travel-time geometry.

---

# 50. What high correlation does not establish

Two copies of the same arrival can correlate almost perfectly. Check their absolute time windows and event origins before treating them as separate earthquakes.

Coherent tremor or recurring noise can also correlate and satisfy graph consistency checks.

A remote event can be real. Initial location or distance from an expected dike should not decide reality by itself.

near_identity.csv flags accepted observations with |r| at or above the configurable threshold, 0.99 by default. This is a review flag, not an event-deletion rule. Repeating earthquakes can also have very high coefficients. DDCorr keeps measurements and evidence for later quality control. Validate event reality using independent stations, phase behavior, arrival timing, waveform review, and external comparisons where available. Neither low graph residual nor low relocation residual is a universal event classifier.

---

# 51. Runtime and memory

100 events give 4,950 pairs. 1,000 events give 499,500 pairs for each eligible station-phase group.

DDCorr prepares one station-phase group at a time and reuses FFTs. More threads do not remove the quadratic pair count.

Start with a small dataset. Dense matrices and very large diagnostic exports can dominate memory or disk use.

Equation: number of event pairs = N(N − 1) / 2

The formula counts unordered event pairs before missing-channel and quality exclusions. The code’s resource guards and sparse exports make oversized requests explicit, but they do not convert every operation to constant memory. Cache validity includes SHA256 of SAC content, numerical source, processing settings and selected IDs, so a changed waveform invalidates reuse even if its size is unchanged. Keep the effective configuration and input provenance. Choose a modest explicit thread count on laptops and shared computers.

---

# 52. An actual DDCorr alignment

XX.S01 P, original IDs 44 and 8.
Output IDs: 4 and 5.

Lag: +0.0899 s.
Exported dt: +0.0541 s.
Known true dt: +0.0540 s.

Default synthetic exercise.

Actual output from the default synthetic exercise, generated 2026-10-17. Original report example_01_XX.S01_P.png is copied to teaching/assets/synthetic_alignment.png. Crops retain the three diagnostic panels without their large empty margins. Event output IDs 4 and 5 map to original labels 44 and 8. Exact coefficient r=0.9423582213909812. The peak gap is about 0.366. The complete source image is included so its context and labels remain available. It is a synthetic timing experiment, not a natural-earthquake result.

---

# 53. The default synthetic result

These results validate this controlled timing exercise. They do not establish the precision or event-detection accuracy of a real catalogue.

The truth comparison joins correlations.csv through event_id_map.csv to the generator’s truth_pairs.csv. Timing errors are over accepted observations only. All five synthetic signal events connect, while the sixth, noise-only control remains in the catalogue with zero graph degree. The default output sampling interval is 20 ms, so the parabolic fit resolves the small synthetic displacements well. This favorable controlled result does not imply sub-millisecond accuracy in natural data.

---

# 54. Exercise 1: the sample grid

A phase window is [−0.2, 1.8] s. The target rate is 50 Hz. The maximum lag is 0.4 s.

How many core samples does the code use? How many samples does it search on either side? How long is the extended window?

Answer: N = 101 and L = 20. The extended vector has N + 2L = 141 samples, spanning 2.8 s between its endpoints.

Give students time to calculate before showing the last paragraph. The common error is counting 100 samples for a 2 s window even though both endpoints are included. A 141-sample vector at 50 Hz spans (141−1)/50 = 2.8 s. The core spans 2.0 s. These counts matter for indexing and for the required data margins.

---

# 55. Exercise 2: lag and output sign

For one station, reduced picks are 4.80 s for event i and 5.10 s for event j. The measured lag is −0.06 s.

What is the exported differential time? Which waveform is earlier relative to its pick alignment?

Answer: Δtᵢⱼ = 4.80 − 5.10 − (−0.06) = −0.24 s. Event j is 0.06 s earlier relative to its pick.

The negative lag means B or j arrives earlier after aligning each waveform by its initial pick. The exported travel-time difference remains negative because j’s reduced arrival is still later overall. Reversing the event order should reverse the differential-time sign. Ask students to check this against the synthetic data’s truth tables rather than just trusting a hand calculation.

---

# 56. Exercise 3: a controlled filter comparison

Copy the main TOML into two experiment files. Change only the P band, for example 2–8 Hz versus 2–14 Hz.

Run both on the same SAC directory. Compare accepted edges, timing changes, and the shape of weak and ambiguous peaks.

Report which measurements changed and why. A larger number of accepted pairs is not enough to choose a winner.

The proposed bands are teaching examples. They must respect the source and target sample rates. Do not change lag, threshold, and window at the same time or you will not know which change caused the result. Keep both effective configurations and compare only common event/station/phase observations when studying timing changes. Use known synthetic delays for a numerical error check and real data for a waveform plausibility check.

---

# 57. A scientific parameter test

Use one interval to explore settings and a different interval to evaluate them. Include weak events, close events, and noisy periods.

Keep false matches visible. Inspect accepted and rejected examples and explain the acceptance mechanism.

A threshold calibrated on one region or one tremor level may not transfer unchanged. Record the limitations with the results.

This is an evaluation strategy, not a new algorithm in DDCorr. Timing stability on repeated waveforms, consistency around graph cycles, and agreement with independent picks offer complementary evidence. Avoid using the same reference catalogue both to tune all thresholds and to advertise an unbiased success rate. A published catalogue is not necessarily complete or free of location and model differences.

---

# 58. When a run fails

Fix the underlying input or setting. A failed check is evidence about the dataset.

The supplied walkthrough should be followed from the repository root. Use --inspect before correlation on every new SAC archive. Do not increase all limits or relax all quality rules together. If requesting help, include the error message, relevant issue rows, effective configuration, and a minimal reproducible input sample. Avoid sending an entire private archive unnecessarily.

---

# 59. The student route to relocation

Run the synthetic example and verify its signs and delays. Then process the small downloaded example and inspect the waveforms.

Prepare your own SAC archive with documented origins, geometry, and picks. Use inspection before all-pairs processing.

Keep the ID map, effective configuration, and diagnostic evidence with dt.cc. Continue with DDSync and a properly configured GraphSplit run.

The goal of the practical is to produce defensible differential times, not simply to make a command finish. Students should be able to explain the effect of their filter, window, lag limit, coefficient threshold, and quality rules. Graph-based relocation can improve relative structure, but poor measurements and false events still require careful review.

---

# 60. Sources and implementation guide

DDCorr.jl source: signal.jl contains the core numerical steps. sac.jl and pipeline.jl connect them to the data and outputs.

DSP.jl documentation explains the filtering and resampling library calls. The SAC manual defines the file headers.

EarthScope documents the waveform and station services. The repository data guide records the conversion and pick provenance.

LECTURE_NOTES.md contains the explanations, source excerpts, and links from these slides.

Repository: https://github.com/eliasrh/DDCorr.jl
DDCorr file map: README.md and docs/DATA_AND_SAC.md
DSP filtering/resampling: https://docs.juliadsp.org/stable/filters/
SAC binary/header specification: https://ds.iris.edu/files/sac-manual/manual/file_format.html
EarthScope waveform service: https://service.earthscope.org/fdsnws/dataselect/1/
EarthScope station service: https://service.earthscope.org/fdsnws/station/1/
ObsPy FDSN interface: https://docs.obspy.org/packages/obspy.clients.fdsn.html
The line-numbered code excerpts derive from the exact source release listed in the teaching provenance file. Scientific charts in this deck are explicitly marked constructed illustrations.
