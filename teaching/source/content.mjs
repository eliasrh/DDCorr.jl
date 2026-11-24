export const slides = [
  {
    "kind": "cover",
    "title": "Measuring earthquake travel-time differences",
    "notes": "Friday runs from 10:00 until 18:00, with lunch and two breaks. The photograph shows Holuhraun on 6 September 2014, after the August earthquakes used in the practical. Image by Jesse Allen for NASA Earth Observatory, using Landsat 8 data from the U.S. Geological Survey. The false-colour composite highlights ice and hot lava.",
    "sources": [
      "https://science.nasa.gov/earth/earth-observatory/roiling-flows-on-holuhraun-lava-field-84316/"
    ],
    "section": "Friday workshop"
  },
  {
    "kind": "framing",
    "title": "What can two earthquakes tell us about each other?",
    "rows": [
      [
        "A shared path",
        "Two nearby earthquakes can send remarkably similar P or S pulses to the same station."
      ],
      [
        "A measurable shift",
        "Slide one pulse across the other. How far does it move before the shapes line up?"
      ],
      [
        "A location constraint",
        "Repeat the measurement at several stations. Different viewing directions help constrain the separation of the sources."
      ]
    ],
    "notes": "Ask participants to point to each P pulse before discussing any locations. The two schematic records have a common time scale and a deliberate shift. The composition adapts the SlidesGPT opening, with editable labels and a waveform drawing.",
    "sources": [
      "https://science.nasa.gov/earth/earth-observatory/roiling-flows-on-holuhraun-lava-field-84316/"
    ],
    "section": "Friday workshop"
  },
  {
    "kind": "agenda",
    "title": "Friday in the classroom",
    "rows": [
      [
        "10:00–10:50",
        "Shared paths and relative earthquake locations"
      ],
      [
        "10:50–11:05",
        "Coffee"
      ],
      [
        "11:05–12:00",
        "How a waveform shift becomes a differential time"
      ],
      [
        "12:00–12:45",
        "Synthetic events with a known answer"
      ],
      [
        "12:45–13:45",
        "Lunch"
      ],
      [
        "13:45–14:35",
        "Get field recordings and run DDCorr"
      ],
      [
        "14:35–15:15",
        "Read the Iceland report and test a threshold"
      ],
      [
        "15:15–15:30",
        "Coffee"
      ],
      [
        "15:30–16:50",
        "Inside the correlator"
      ],
      [
        "16:50–17:35",
        "Change the filter or bring your own SAC"
      ],
      [
        "17:35–18:00",
        "Defend one measurement and save the results"
      ]
    ],
    "notes": "The two morning science blocks include the seminar questions and the worked signed example. For the last 45-minute practical, learners may investigate the filter experiment or try their event files. Wrap up together at 17:35. Only the cross-correlation block is taught here. The two coffee breaks and lunch are included in the schedule.",
    "section": "Friday workshop"
  },
  {
    "title": "Where did the dike go?",
    "kind": "figure",
    "notes": "Begin at the ice-covered Bárðarbunga caldera in panel A. Follow the earthquakes northeast toward Holuhraun, then examine the close-up in B. Ask the room where the width of the earthquake band is actually resolved. A cloud can combine fault geometry, source distribution and timing errors. Woods et al. colour earthquakes by the balance of high and low frequencies measured at station FLUR. Red indicates lower-frequency events. Green triangles are stations and the dark purple diamonds are ice cauldrons. These are panels A and B cropped from Figure 1, Woods et al. (2018), Earth and Planetary Science Letters, CC BY 4.0. Original authors retain credit. The overlying glacier is pale blue.",
    "image": "woods_fig1ab.png",
    "lead": "In August 2014, magma travelled about 48 km beneath Iceland before erupting at Holuhraun.",
    "body": [
      "The earthquakes trace part of the route. How finely can their locations distinguish neighbouring faults?"
    ],
    "label": "Woods et al. (2018), Fig. 1A–B · CC BY 4.0",
    "sources": [
      "https://doi.org/10.1016/j.epsl.2018.03.020",
      "https://opinvisindi.is/server/api/core/bitstreams/fe2cbdb7-aaf7-4359-b57e-e2eb4f3ac324/content#page=2",
      "https://creativecommons.org/licenses/by/4.0/",
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "Which earthquakes will we measure?",
    "kind": "figure",
    "notes": "This is an original plot of event epicentres from Data Set S1, 16 to 31 August 2014. The map uses equal horizontal and vertical distance scales relative to 64.8° N, 17.0° W. Read colour first to see how activity generally extended northeast. Red outlines mark the first 100 S1 events after noon UTC on 23 August. They span 12:00:29.86 to 13:48:56.81. They were selected chronologically before examining waveform quality. Comparing this plot with the preceding paper figure also illustrates that catalogues and selections differ.",
    "image": "seminar_s1_rift.png",
    "lead": "We will use 100 consecutive events from the published Bárðarbunga catalogue on 23 August 2014.",
    "body": [
      "The red outlines mark their epicentres within the wider August sequence. Each dot is a published location."
    ],
    "label": "Ágústsdóttir et al. (2019), Data Set S1",
    "sources": [
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "One earthquake, eleven listening stations",
    "kind": "figure",
    "notes": "Trace a line from the small event cloud to KVER, then to STAM. The two stations view the source from different directions. Later we will return to exactly these stations and inspect vertical P and horizontal S records. A P wave carries compressional motion and usually arrives first. An S wave carries shear motion and travels more slowly. Arrival times depend on both the location and the origin time. Each station records its own ground motion. The class package contains three-component event cuts from these 11 Z7 stations, 3,300 files in all.",
    "image": "seminar_network.png",
    "lead": "A seismometer measures motion at a known point. Its record contains the origin time plus the travel time through the Earth.",
    "body": [
      "When earthquakes are close together, the same phase can have a recognisable shape at one station across several events."
    ],
    "label": "Z7 station metadata and 100 S1 hypocentres",
    "sources": [
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "Why do nearby earthquakes share travel-time errors?",
    "kind": "figure",
    "notes": "Use the instructor’s ray diagram. Trace P from i and m to the same station k. Identify a portion near the receiver where the separation of the rays is small. A slow layer there adds nearly the same delay to both. Subtraction suppresses that shared error and retains sensitivity to the different segments near the sources. The approximation weakens with increasing separation, different ray branches or rapid lateral variations. Ray paths for different phases need not coincide, so compare P with P and S with S. Diagram from Elías Rafn Heimisson’s FAPESP lecture.",
    "image": "seminar_fapesp_rays.png",
    "lead": "At a common station, nearby sources send waves through much of the same rock.",
    "body": [
      "A slow layer near the receiver can delay both arrivals by nearly the same amount. Subtracting the two times largely cancels that delay."
    ],
    "label": "Instructor’s FAPESP ray diagram · Waldhauser & Ellsworth (2000)",
    "sources": [
      "https://doi.org/10.1785/0120000006"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "What is a double difference?",
    "kind": "table",
    "notes": "Read down the two event columns before reading across. Times here are illustrative travel times after subtracting the two catalogue origins. One persistent model bias of about 0.30 s affects this station. The predicted difference is 0.08 s, leaving 0.04 s of differential misfit. The inversion uses derivatives of predicted travel time with respect to east, north and depth, and can solve relative origin-time corrections as well. Iteration updates the hypocentres, re-predicts the times and reduces the residuals across all the accepted observations.",
    "lead": "First subtract two event times at one station. Then compare the observed difference with the predicted difference.",
    "rows": [
      [
        "P travel time",
        "Event i",
        "Event j",
        "i minus j"
      ],
      [
        "Observed",
        "4.42 s",
        "4.30 s",
        "+0.12 s"
      ],
      [
        "Predicted",
        "4.10 s",
        "4.02 s",
        "+0.08 s"
      ],
      [
        "Observed minus predicted",
        "+0.32 s",
        "+0.28 s",
        "+0.04 s"
      ]
    ],
    "body": [
      "The relocation adjusts event positions and origin times to reduce residuals like this across many stations."
    ],
    "label": "Illustrative times · Waldhauser & Ellsworth (2000)",
    "sources": [
      "https://doi.org/10.1785/0120000006"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "A single station sees one direction of separation",
    "kind": "figure",
    "notes": "Two sources have identical origin times and are separated east–west by 100 m, i east of j. Place a station 20 km away and vary only its bearing. Compute distance divided by the uniform P speed of 6 km/s. To the east, i has the shorter path, so its travel time minus j’s is negative. To the west, the difference reverses. To the north and south the distances are identical. An unknown difference in the origin times would add a common offset. Four nearby stations on the same side can give similar constraints. Opposing azimuths help distinguish the horizontal components, and depth also depends on takeoff angles and the velocity model.",
    "image": "seminar_azimuth.png",
    "lead": "Consider two earthquakes 100 m apart east–west. Which station would see the largest P travel-time difference?",
    "body": [
      "At 6 km/s the difference ranges from about −17 to +17 ms. A station due north sees zero."
    ],
    "label": "Calculated example · stations at 20 km range",
    "sources": [
      "https://doi.org/10.1785/0120000006"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "Poupinet et al. timed the same wave train twice",
    "kind": "figure",
    "notes": "This classic experiment used a magnitude 1.7 and a magnitude 2.0 earthquake on the Calaveras Fault, before and after the 1979 Coyote Lake earthquake. The events produced nearly identical records at common stations. The authors compared short windows throughout the seismograms in the frequency domain. The progressively larger lag at some stations suggested a decrease in average shear-wave speed of about 0.2%. Their reported timing resolution was about an order of magnitude finer than the digitisation interval. The line shown here illustrates a uniform 0.2% time stretch, rather than reproducing field observations. Coda means the scattered, gradually decaying wave train after the direct arrivals.",
    "image": "seminar_poupinet.png",
    "lead": "A pair of similar California earthquakes let Poupinet, Ellsworth and Fréchet track a tiny delay through the coda.",
    "body": [
      "A uniform 0.2% stretch would accumulate 10 ms in 5 s and 40 ms in 20 s. The earthquake records preserved enough waveform detail to resolve delays smaller than one sample."
    ],
    "label": "Poupinet, Ellsworth & Fréchet (1984) · illustrative time stretch",
    "sources": [
      "https://doi.org/10.1029/JB089iB07p05719"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "hypoDD sharpened the northern Hayward Fault catalogue",
    "kind": "figure",
    "notes": "Waldhauser and Ellsworth relocated 346 events near Berkeley and El Cerrito. Their Figure 9 compares the original Northern California Seismic Network locations, DD from catalogue observations, and DD from catalogue plus cross-correlation. Look at the depth sections in the original figure: including waveform timings defined nearly horizontal streaks. Here the horizontal position of each dot represents the timing residual. The catalogue-only experiment reduced its RMS residual from 125 to 41 ms. In the combined inversion, the RMS of the P waveform data fell from about 96 to 8.5 ms and S from about 147 to 8.5 ms. These are fit statistics, not distances or absolute location uncertainties. The 2000 paper presents the method; Waldhauser’s 2001 USGS report documents the hypoDD program.",
    "image": "seminar_hypodd.png",
    "lead": "Waldhauser and Ellsworth relocated 346 earthquakes near Berkeley and El Cerrito using pairs recorded at common stations.",
    "body": [
      "Adding waveform-derived differences brought out thin streaks in depth. In the combined inversion, the P and S waveform residuals fell to about 8.5 ms."
    ],
    "label": "Waldhauser & Ellsworth (2000), pp. 1363–1364",
    "sources": [
      "https://doi.org/10.1785/0120000006",
      "https://www.ldeo.columbia.edu/~felixw/papers/Waldhauser_Ellsworth_BSSA2000.pdf#page=11",
      "https://doi.org/10.3133/ofr01113"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "Which structures emerge after relocation?",
    "kind": "figure",
    "notes": "The U.S. Geological Survey hypoDD report shows the same 1997 Long Valley caldera seismic crisis in map view before and after double-difference relocation. Look first at the dense group left of centre. Then follow the eastward branch. Which features become narrower and which remain diffuse? Approximately 10,000 earthquakes were analysed. The original joint hypocentre determination (JHD) locations are on the left; hypoDD locations are on the right. The two axes have the same scales. Figure 1, Waldhauser (2001), U.S. Geological Survey Open-File Report 01-113, p. 4. This is the USGS author’s own publication figure, cropped from the original page. No third-party figure credit is indicated.",
    "image": "hypodd_long_valley.png",
    "lead": "In the 1997 Long Valley caldera sequence, hypoDD brought fault-scale lineations into focus.",
    "body": [
      "Compare the same California earthquakes on identical map axes. Trace one feature across the two panels and describe what changed."
    ],
    "label": "Waldhauser (2001), Fig. 1 · U.S. Geological Survey",
    "sources": [
      "https://doi.org/10.3133/ofr01113",
      "https://pubs.usgs.gov/of/2001/0113/pdf/hypoDD.pdf#page=4"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "How similar must two waveforms be?",
    "kind": "table",
    "notes": "Schaff and colleagues tested the precision of waveform-derived relative times against catalogue phase differences in a streak of 243 Calaveras Fault earthquakes. Their quantitative tests showed improvement down to about 0.70 in normalised correlation and out to about 2 km of event separation for this dataset. The authors also tested the effect of window duration and empirical weighting. The same coefficient alone cannot specify an uncertainty in milliseconds. The shape of the correlation maximum, bandwidth, signal-to-noise ratio and comparison with other stations matter. In the practical, use the figures and reports to decide what changes when you accept a wider range of values.",
    "lead": "Schaff et al. tested waveform timing against catalogue picks on a streak of 243 California earthquakes.",
    "rows": [
      [
        "Their test",
        "Calaveras Fault result"
      ],
      [
        "Lowest correlation with demonstrated improvement",
        "About 0.70"
      ],
      [
        "Largest tested separation showing improvement",
        "About 2 km"
      ]
    ],
    "body": [
      "Their result is an empirical reference for choosing a threshold. A different network can give a different precision at the same coefficient."
    ],
    "label": "Schaff et al. (2004) · California field test",
    "sources": [
      "https://doi.org/10.1785/0120020238"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "GrowClust builds clusters from the best-linked pairs",
    "kind": "figure",
    "notes": "Trugman and Shearer used differential times, cross-correlation coefficients and reference locations to grow clusters and relocate their members together. Pairs supported by more or stronger correlations can anchor early joins. A trial relative shift of two existing clusters must explain the differential times between their members. Their paper examined the Spanish Springs and Sheldon, Nevada, earthquake sequences. The illustrated section is an original plot of the Spanish Springs example output distributed by the authors. Plot the same 717 members of cluster ID 1 in east versus depth before and after relocation. Identical axes and equal spatial scales preserve the shape of the group. Discuss why a weakly linked pair can still be an earthquake pair even when it cannot be placed in a well-constrained cluster. GrowClust is an alternative downstream method. It helped establish why a correlation measurement should retain its station, phase, pair, sign and quality.",
    "lead": "Trugman and Shearer used repeated waveform shapes to decide which earthquake pairs to fit together first.",
    "image": "seminar_growclust.png",
    "body": [
      "Each trial join must fit the differential times between the two groups. The sections show the same 717 Spanish Springs events before and after relocation."
    ],
    "label": "Trugman & Shearer (2017) · authors’ Spanish Springs example",
    "sources": [
      "https://doi.org/10.1785/0220160188",
      "https://github.com/dttrugman/GrowClust",
      "https://github.com/dttrugman/GrowClust/blob/53226cf7662ab5bab5db87138d1ae63227d4ba63/EXAMPLE/OUT/out.growclust_cat"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "What will our measurements feed?",
    "kind": "table",
    "notes": "Use one comparison throughout the table. Two P recordings at KVER provide a lag. The lag and the two time markers provide a differential travel time; other accepted KVER P pairs form a graph. DDSync fits these pairwise differences as a set of relative event times for this station and phase. GraphSplit combines synchronized times from many stations, initial locations and predicted travel times to solve for locations. The Friday computational work ends with DDCorr, its diagnostics and export. Cite DDSync as the 2026 journal paper by Heimisson and Yu and GraphSplit as Heimisson’s 2026 ESS Open Archive preprint. GitHub sources are separate from the publications.",
    "lead": "The same event IDs follow the measurements from waveforms to a relocated catalogue.",
    "rows": [
      [
        "Stage",
        "Question",
        "Result"
      ],
      [
        "DDCorr",
        "How far apart are matching P or S arrivals?",
        "Differential times with station, phase and weight"
      ],
      [
        "DDSync",
        "Do the measured time differences agree around the graph?",
        "Relative times for each station and phase"
      ],
      [
        "GraphSplit",
        "Which event positions best explain those times?",
        "A relocated catalogue"
      ]
    ],
    "label": "DDCorr · DDSync (Heimisson & Yu, 2026) · GraphSplit (Heimisson, preprint)",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl",
      "https://doi.org/10.1785/0220260086",
      "https://github.com/eliasrh/DDSync",
      "https://doi.org/10.22541/essoar.15009811/v1",
      "https://github.com/eliasrh/GraphSplit.jl"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "A timing graph can check the measurements",
    "kind": "figure",
    "notes": "Nodes are earthquake events. Use a single station and phase throughout the graph. Each directed edge represents dᵢⱼ = time at i minus time at j. In the Iceland Z7.DYSA P data the path from 1 to 5 through 3 gives +93.9 − 61.6 = +32.3 ms. The direct observation gives +30.5 ms, a mismatch of +1.8 ms. Multiple independent paths make inconsistency visible; a single triangle alone does not identify which edge caused the mismatch. DDSync fits one relative time per event so its fitted differences agree around loops. The common zero point of each connected component is arbitrary. Graph image from Elías Rafn Heimisson’s FAPESP slide 9. Read solid arrows as measurements and the dashed arrow as an implied difference.",
    "image": "fapesp_graph.png",
    "lead": "At Z7.DYSA, two paths through the P measurements connect events 1 and 5.",
    "body": [
      "Via event 3, the difference is +93.9 − 61.6 = +32.3 ms. Directly, it is +30.5 ms. DDSync can use the 1.8 ms mismatch along with the other observations."
    ],
    "label": "Iceland100 measured P differences · instructor’s FAPESP graph",
    "sources": [
      "https://doi.org/10.1785/0220260086",
      "https://github.com/eliasrh/DDSync"
    ],
    "section": "10:00   /   Why relative timing matters"
  },
  {
    "title": "What makes two seismograms look alike?",
    "kind": "figure",
    "notes": "These are actual Z7.STAM east-component S records for events 28 and 45 in the Iceland set. For each trace zero is its own S marker. A wave train is the sequence of several successive crests and troughs. Ask participants to identify two crests and a trough that are recognisable on both. Two nearby earthquakes may share propagation and instrument response at a given station, especially with similar source mechanisms. Different radiation patterns, source sizes, paths, noise or strong near-surface scattering can reduce similarity. The correlation signal can remain informative even if the very first deflection is hard to identify.",
    "image": "field_pair.png",
    "lead": "At one station, nearby sources with similar rupture mechanisms can produce the same sequence of crests and troughs.",
    "body": [
      "Find a feature common to these two S waves. How confidently could you mark its beginning on each trace?"
    ],
    "label": "Measured S waveforms · Z7.STAM, events 28 and 45",
    "sources": [
      "https://doi.org/10.1785/0120020238",
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "Measure a delay relative to each phase marker",
    "kind": "figure",
    "notes": "Both horizontal axes have already been reset relative to each event’s own P marker. Consider just the distinctive pulse shown. The corresponding feature in j sits 0.18 s farther to the right on the marker-centred axes. To overlay the recordings, shift the displayed j curve 0.18 s to the left. The sign describes the difference in the recorded pulse positions, not the direction of the plotting gesture. The original UTC separation of the two earthquakes can be minutes or years.",
    "image": "lag_introduction.png",
    "lead": "Set each event’s time axis to zero at its own P marker. Matching peaks can still occur at different times on those axes.",
    "body": [
      "Here the pulse in j is 0.18 s later. DDCorr reports a positive lag. Move j left by 0.18 s to see the match."
    ],
    "label": "Constructed waveform pair",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/src/signal.jl"
    ],
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "How do we score each possible shift?",
    "kind": "figure",
    "notes": "Each row shows two short zero-mean sample sequences. Multiply the two amplitudes at the same horizontal position and sum across the window. Like signs make a positive contribution, opposite signs a negative one. In the first row the products partly cancel. In the second row each crest meets a crest and each trough meets a trough. A comparison at one shift yields one scalar. Repeating the comparison across shifts defines the lag curve. Mean removal and normalisation put different sizes of event on a common scale, as the next slide shows. The illustrative sequences have five entries and repeat one added end sample to make the before/after comparison self-contained.",
    "image": "seminar_sample_products.png",
    "lead": "At each shift, multiply the paired samples and add their products.",
    "body": [
      "Aligned crests and aligned troughs both contribute positively. Opposite signs reduce the sum."
    ],
    "label": "Five-sample illustration · waveform amplitudes and their products",
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "Discrete normalised cross-correlation",
    "kind": "equation",
    "notes": "Let n run from 1 through N samples in the fixed window. Let k be the signed trial shift in samples. At k, subtract the mean of the fixed x window from each x sample; subtract the mean of this particular y window from each y sample. Call the resulting vectors u and v(k). The denominator is the product of their Euclidean lengths, equal to the square root of the sum of squares for each window multiplied together. Normalising removes a positive amplitude scale factor: doubling every y sample doubles the numerator and its norm. The result lies from −1 to +1 for nonconstant inputs. A negative coefficient indicates reversed polarity. This equation describes one ordering. DDCorr’s symmetric finite-window implementation averages the two orderings of the traces.",
    "equation": "r(k) = Σₙ uₙ vₙ(k) / [‖u‖ ‖v(k)‖]",
    "lead": "For a shift k, compare the N samples in event i with the N samples starting k samples later in event j.",
    "body": [
      "u and v(k) are the two windows after subtracting each window’s mean. Each ‖ ‖ is the square root of the sum of the squared samples.",
      "The result is +1 for identical shapes, 0 for zero net agreement and −1 for opposite shapes."
    ],
    "sources": [
      "https://doi.org/10.1785/0120020238",
      "https://github.com/eliasrh/DDCorr.jl/blob/main/src/signal.jl"
    ],
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "The lag curve identifies the best-fitting shift",
    "kind": "figure",
    "notes": "The left panel shows the same phase at the same station in two events aligned to their own predicted P markers. The right panel shows DDCorr’s measured coefficient as a function of signed residual lag. Positive lag means event 2’s waveform is later relative to its own marker. Identify the largest positive maximum. Here r = 0.79985 and the refined lag is +0.0202 s. Its height measures similarity. Its horizontal coordinate estimates timing. DDCorr computes the lag sums for all k with a fast Fourier transform and applies the local normalisation at each shift. The figure uses actual DDCorr waveforms and the symmetric coefficient curve, with a 2–14 Hz P band.",
    "image": "kver_worked.png",
    "lead": "The highest peak at Z7.KVER is near +20 ms. Its height, 0.800, measures how well the two P waveforms match.",
    "body": [
      "Read the lag from the horizontal axis and the coefficient from the vertical axis. They answer different questions."
    ],
    "label": "Measured vertical P records · Z7.KVER, events 1 and 2",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/src/signal.jl",
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "Does the measured lag actually align the waveforms?",
    "kind": "figure",
    "notes": "The same recorded, band-passed KVER waveforms are shown in both rows, zoomed to the same part of the signal. The lower dashed curve is event 2 sampled 20.2 ms later on its original axis, equivalent to moving the plotted trace earlier. Linear interpolation here is only for plotting a fractional shift; the lag is the DDCorr output, not estimated using the plotting interpolator. Locate a peak and a subsequent trough. Check whether the change improves both, rather than overemphasising an isolated large swing. Remaining differences are expected because the sources, paths and noise are not exactly equal.",
    "image": "seminar_kver_alignment.png",
    "lead": "Apply the measured +20.2 ms delay by shifting the displayed event 2 trace earlier.",
    "body": [
      "Inspect several crests and troughs. A plausible lag should improve the alignment across the chosen phase."
    ],
    "label": "Z7.KVER P · the same data before and after the shift",
    "sources": [
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "Why can timing be finer than one sample?",
    "kind": "figure",
    "notes": "This separate real example comes from Z7.STAM S for events 28 and 45. At −20, 0 and +20 ms the signed coefficients are 0.5110, 0.7000 and 0.2735. The left neighbour is higher than the right, so the peak leans toward negative lags. Fitting a parabola locally puts its vertex at about −3.9 ms. Samples on many changing parts of a band-limited waveform respond to a small time shift. The resulting correlation maximum moves continuously, even though the evaluated lags are discrete. The estimate will vary with noise, bandwidth and the chosen window. Decimal places in the output do not supply an uncertainty.",
    "image": "field_peak.png",
    "lead": "At 50 samples/s the tested shifts are 20 ms apart. The neighbouring coefficients indicate where the maximum lies between them.",
    "body": [
      "At Z7.STAM, fitting a parabola through the three points nearest the maximum gives −3.9 ms."
    ],
    "label": "Z7.STAM S · measured three-point peak, events 28 and 45",
    "sources": [
      "https://doi.org/10.1029/JB089iB07p05719",
      "https://doi.org/10.1785/0120020238",
      "https://github.com/eliasrh/DDCorr.jl/blob/main/src/signal.jl"
    ],
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "Which of these high peaks should we trust?",
    "kind": "figure",
    "notes": "Give the room 30 seconds to choose the lag on each graph. Both constructed signal pairs have exactly the same 40 ms delay. One is a distinct pulse with a secondary feature. The other is a 10 Hz sinusoid. Its period is 100 ms, so peaks near −160, −60, +40 and +140 ms all score nearly one. Noise can make the wrong cycle win. This is a cycle skip. With true repeated oscillations, the data in that window cannot select the correct cycle without additional information. An appropriate window, useful bandwidth, plausible lag limit and a competing-peak check each test a different aspect of this problem.",
    "image": "seminar_repeated_peaks.png",
    "lead": "Both examples have a known delay of +40 ms. The 10 Hz wave repeats every 100 ms.",
    "body": [
      "A distinct arrival gives one clear maximum. Repeated cycles can give equally good matches at several lags."
    ],
    "label": "Controlled example · exact imposed shift +40 ms",
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "How does a lag become a differential travel time?",
    "kind": "equation",
    "notes": "For event i, Oᵢ is its catalogue origin time, pᵢ the phase marker time on an absolute axis, and mᵢ = pᵢ − Oᵢ is the marker measured from that origin. Define εᵢ as the displacement of the matched waveform feature from its marker. Similarly define εⱼ. A positive lag means ℓ = εⱼ − εᵢ > 0. Now the two origin-referenced feature times are mᵢ + εᵢ and mⱼ + εⱼ. Subtract them in i-minus-j order to get (mᵢ − mⱼ) − ℓ. SAC often stores p and O as offsets from a common reference instant; their subtraction still yields m. If an origin in the input catalogue is in error, that error remains available for a relocation to estimate. We do not interpret a wave-train lag as an independent absolute onset pick.",
    "equation": "dᵢⱼ = (pᵢ − Oᵢ) − (pⱼ − Oⱼ) − ℓ",
    "lead": "First measure each phase marker p from its own event origin O. Then correct their difference using the waveform lag ℓ.",
    "body": [
      "A positive ℓ means the waveform in j is later relative to its marker. Subtracting j’s time therefore subtracts ℓ."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/src/signal.jl",
      "https://doi.org/10.1785/0120000006"
    ],
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "Compute the KVER P observation",
    "kind": "table",
    "notes": "Ask students to subtract the two marker travel times before looking at the final row. The entries come from the actual Iceland100 KVER vertical SAC files and DDCorr result, rounded here to four decimal places in seconds. The catalogue origins differ by 54.98 s: 12:00:29.860 and 12:01:24.840 UTC. Origin-referencing removed this separation. The corrected travel time for i is approximately 3.5 ms shorter than for j when the supplied origins are used. The numbers demonstrate why writing the +20.2 ms correlation lag itself into dt.cc would give the wrong sign and value.",
    "rows": [
      [
        "Measured or derived quantity",
        "Time"
      ],
      [
        "Event 1 P marker after its origin",
        "2.7461 s"
      ],
      [
        "Event 2 P marker after its origin",
        "2.7294 s"
      ],
      [
        "Residual lag, event 2 later than event 1",
        "+0.0202 s"
      ],
      [
        "(2.7461 − 2.7294) − 0.0202",
        "−0.0035 s"
      ]
    ],
    "lead": "Events 1 and 2 occurred almost 55 seconds apart. Their corrected P travel times differ by just a few milliseconds.",
    "label": "Z7.KVER · actual SAC markers and DDCorr lag",
    "sources": [
      "https://doi.org/10.1029/2018JB016010",
      "https://github.com/eliasrh/DDCorr.jl/blob/main/src/signal.jl"
    ],
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "Read one observation exactly as relocation will",
    "kind": "code",
    "notes": "Read the header first. Its event order fixes the subtraction sign for every observation until the next #. Here the header’s third numeric entry is the standard zero origin-time-correction placeholder in this export. The next line identifies the network-qualified receiver, the travel-time difference in seconds, the weight and the phase. In this run r = 0.7998529 and r² = 0.6397647. This weight is a measure of waveform match under the configured weighting rule. It is not a standard deviation in seconds. If r² is printed the signed r is still recorded separately in correlations.csv. Keep event_id_map.csv to identify the original SAC folders.",
    "command": "# 1 2 0.0\nZ7.KVER  -0.0035  0.639765  P",
    "lead": "The pair header sets the event order. Each following row belongs to one station and phase.",
    "body": [
      "At station Z7.KVER, event 1 minus event 2 is −0.0035 s for P. This run writes r² as the weight."
    ],
    "label": "Iceland100/reference/dt.cc · event pair 1, 2",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl",
      "https://github.com/eliasrh/DDCorr.jl/blob/main/src/signal.jl"
    ],
    "section": "11:05   /   Measuring a waveform shift",
    "codeLabel": "EXCERPT FROM dt.cc"
  },
  {
    "title": "Before opening the code, try reversing the pair",
    "kind": "activity",
    "notes": "Give participants one minute in pairs. Answer: the lag becomes −20.2 ms, the differential time changes to +3.5 ms, and the coefficient remains approximately 0.800. Under a symmetric measurement, swapping i and j reverses the lag curve about zero; its peak height stays the same. The weight is therefore unchanged. Ask them to confirm the units on their answers and explain aloud why moving a late trace left in a figure corresponds to a positive reported lag in the original order. Carry these checks into the first synthetic run, where the construction gives the expected sign independently.",
    "lead": "For the KVER P measurement, swap events 1 and 2. What will change?",
    "rows": [
      [
        "Original order, event 1 then event 2",
        "Predict event 2 then event 1"
      ],
      [
        "Lag = +20.2 ms",
        "?"
      ],
      [
        "Differential travel time = −3.5 ms",
        "?"
      ],
      [
        "Coefficient = 0.800",
        "?"
      ]
    ],
    "body": [
      "Predict each sign before looking at a software output."
    ],
    "label": "One-minute pair exercise",
    "section": "11:05   /   Measuring a waveform shift"
  },
  {
    "title": "Open START HERE on GitHub",
    "kind": "break",
    "lead": "Open the guide on GitHub or in the student package. Keep it beside the slides for the commands and return points.",
    "notes": "Project this slide and explicitly pause. On GitHub open docs/START_HERE.md, or open the same file in the student package. Everyone should find Lab A before continuing. Complete Before class now if necessary. The slides explain the observations and mark a return point after each task.",
    "body": [
      "github.com/eliasrh/DDCorr.jl   →   docs   →   START_HERE.md",
      "Begin with Lab A. Return when the six synthetic event folders exist."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-a"
    ],
    "label": "Lab A · Start here",
    "section": "12:00   /   Lab A   ·   Synthetic earthquakes"
  },
  {
    "title": "Set up two folders and check Julia",
    "kind": "code",
    "lead": "Extract DDCorr.jl and Iceland100 beside one another inside a folder you can write to.",
    "notes": "Both ZIPs come from the instructor. The code alone is also available from GitHub using Code → Download ZIP or git clone; rename the extracted DDCorr.jl-main directory to DDCorr.jl if needed. In Finder or File Explorer open the DDCorr.jl folder, the one containing Project.toml and bin, and open a terminal there. The commands work in Terminal or PowerShell. Allow several minutes for the first installation. Project.toml lists the packages DDCorr uses. The Julia environment and the Python environment are independent.",
    "command": "julia --version\njulia --project=. -e 'using Pkg; Pkg.instantiate(); using DDCorr'",
    "body": [
      "Use Julia 1.12.3 for the classroom run.",
      "When Julia returns to the terminal prompt without an error, continue."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#before-class"
    ],
    "section": "12:00   /   Lab A   ·   Synthetic earthquakes",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "Generate earthquakes with known arrival times",
    "kind": "code",
    "lead": "A built-in generator writes real SAC-format files with controlled arrival times.",
    "notes": "Run the command for the installed Python. This exercise uses only the standard library. The program creates examples/synthetic/sac and writes truth_pairs.csv with the known inter-event travel-time differences. The supplied markers have timing errors on purpose. The traces contain noise and five events also contain signals. Ask everyone to find the event folders and the truth file before showing the result.",
    "command": "python3 scripts/make_synthetic.py",
    "commandWindows": "py -3.12 scripts/make_synthetic.py",
    "body": [
      "Open examples/synthetic/sac. Find six event folders.",
      "Five contain P and S pulses. Event 905 contains only noise."
    ],
    "section": "12:00   /   Lab A   ·   Synthetic earthquakes",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "Inspect first, then measure the synthetic data",
    "kind": "code",
    "lead": "Inspection checks whether the named arrival fields and waveform windows are available.",
    "notes": "Confirm the first command reports six valid events. Open phase_readiness.csv from the printed inspect directory. Ask why a noise trace can pass these checks: its metadata and time span are valid. Run the second command, which also filters and measures the waveforms. Save the printed correlate directory. Each measurement belongs to a pair of different events observed at the same station and phase.",
    "command": "julia --project=. bin/ddcorr.jl DDCorr.toml --inspect\njulia --project=. --threads=2 bin/ddcorr.jl DDCorr.toml",
    "body": [
      "The first command should find 6 events.",
      "The second should keep 80 measurements. Open its report.html."
    ],
    "section": "12:00   /   Lab A   ·   Synthetic earthquakes",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "How late is the second pulse?",
    "kind": "figure",
    "lead": "At station XX.S01, put each vertical trace on its own P-marker clock.",
    "notes": "Output IDs 1 and 2 represent original event folders 1201 and 17. The top panel compares both records at their supplied markers. The second blue/orange pair reuses the same processed samples after moving event 2 left by 0.2247 s. A positive lag means that on marker-relative clocks event j needs a shift to the left to align with event i. It says nothing by itself about which earthquake happened first in calendar time. Ask students to identify the same pair of peaks in both panels.",
    "image": "lab_synthetic_alignment.png",
    "body": [
      "The second pulse sits 0.2247 s later on these axes.",
      "Shifting it left brings the peaks and troughs together."
    ],
    "section": "12:00   /   Lab A   ·   Synthetic earthquakes"
  },
  {
    "title": "Use the known difference to check the sign",
    "kind": "equation",
    "lead": "The marker times, measured from each event’s own origin, are 4.216 s and 3.856 s.",
    "notes": "Ask students to calculate the difference before revealing the answer. The marker estimate is positive because the first marker is later relative to its origin. Event 2 really arrives later relative to its own marker, so subtracting the residual correction reduces the difference. In dt.cc, positive here means the phase took longer to reach this station from event 1. The unrounded r is 0.984762 and its square is about 0.9698.",
    "equation": "Δt₁₂ = (4.216 − 3.856) − 0.2247 = +0.1353 s",
    "body": [
      "The generator set the true difference to +0.1350 s.",
      "The recovered value is 0.0003 s larger."
    ],
    "section": "12:00   /   Lab A   ·   Synthetic earthquakes"
  },
  {
    "title": "Check every measured row against the generator",
    "kind": "activity",
    "lead": "In START HERE, run the Lab A truth check for your operating system.",
    "notes": "Use the commands in Lab A immediately after the successful synthetic run. The guide selects the newest synthetic correlate directory and passes it to scripts/check_synthetic.py with --max-error-s 0.001 --require-noise-isolated. The checker uses original event IDs, station and phase to match estimates to truth. Compare the error with the 0.02 s working sample interval. The result demonstrates accuracy on these generated data only. Continue in the guide at Lab B after discussing the check.",
    "body": [
      "Find passed, maximum_absolute_error_s and noise_control_accepted_observations.",
      "Reference result: 40 P + 40 S, maximum error 0.0006 s, zero links to event 905.",
      "Explain why one correct sign is a weaker test than 80 correct measurements."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-a"
    ],
    "section": "12:00   /   Lab A   ·   Synthetic earthquakes"
  },
  {
    "kind": "break",
    "title": "Keep the synthetic result open",
    "lead": "Before lunch, find the row for events 1 and 2 at XX.S01, P. You should be able to explain the sign of its differential time.",
    "body": [
      "13:45   ·   Return to Start Here, Lab B, to collect the first real waveforms."
    ],
    "notes": "Allow an hour for lunch. Leave the synthetic folder and the deck open. The supplied Iceland100 archive lets everyone rejoin the field practical if network service is interrupted.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-b"
    ],
    "section": "12:45   /   Lunch"
  },
  {
    "title": "Get five real events from the archive",
    "kind": "activity",
    "lead": "Open Lab B. The supplied event and station tables specify what to request.",
    "notes": "These are the first five events in the classroom selection from Data Set S1 of Ágústsdóttir et al. (2019). Their identifiers preserve the original supplement row numbers, e.g. S1_009900. The exercise requests the three nearest eligible stations from the supplied channel table. The archive supplies station metadata and waveform samples. The script cuts a separate record around each event and writes it as SAC. The internet service is needed here; the Iceland100 practical uses the supplied local archive if the service is unavailable.",
    "body": [
      "Earthquake catalogue → event ID, origin time and coordinates.",
      "Station metadata + miniSEED → event folders containing SAC files.",
      "The requested cut runs from 25 s before to 70 s after each origin."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-b",
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "13:45   /   Lab B   ·   Archive recordings"
  },
  {
    "title": "Install the waveform reader into this Python",
    "kind": "code",
    "lead": "Use the same Python executable to install ObsPy, check it and run the downloader.",
    "notes": "The full commands for both systems are in Lab B. Python 3.12 must be installed before creating the environment. On a Mac or Linux use .venv/bin/python after creating .venv. In PowerShell use .\\.venv\\Scripts\\python.exe. No activation or administrator step is needed. The import check must print the version before the download. Installing the Julia packages or making an empty Python environment alone does not install ObsPy.",
    "command": "python3.12 -m venv .venv\n.venv/bin/python -m pip install -r requirements-download.txt\n.venv/bin/python -c \"import obspy; print(obspy.__version__)\"",
    "commandWindows": "py -3.12 -m venv .venv\n.\\.venv\\Scripts\\python.exe -m pip install -r requirements-download.txt\n.\\.venv\\Scripts\\python.exe -c \"import obspy; print(obspy.__version__)\"",
    "section": "13:45   /   Lab B   ·   Archive recordings",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "Download, then repeat the same request",
    "kind": "code",
    "lead": "The downloader writes SAC files below work/iceland_small/sac.",
    "notes": "The supplied table selects stations HRIM, TOHR and FLUR. Our cached rehearsal has 5 event folders and 45 traces. Archive availability can change. Repeat the exact download command and inspect the printed number of new bytes. An unchanged successful request should use cached waveform and metadata files. Then run julia --project=. bin/ddcorr.jl examples/download/small.toml --inspect to check the event count. Return here when you can identify an actual station and event folder. On a service outage, inspect the supplied Iceland100 folder and continue to Lab C.",
    "command": ".venv/bin/python scripts/download_example.py",
    "commandWindows": ".\\.venv\\Scripts\\python.exe scripts/download_example.py",
    "body": [
      "Open an event folder and find the station and channel in a filename.",
      "Repeat the command. How many new bytes did it need?"
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-b"
    ],
    "section": "13:45   /   Lab B   ·   Archive recordings",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "Move to the shared 100-event archive",
    "kind": "table",
    "lead": "Open Lab C. Everyone now works from the same Iceland100 folder.",
    "notes": "These 100 selected catalogue entries span 12:00:29.86 to 13:48:56.81 UTC on 23 August 2014. The sequence comes from a dyke intrusion in Iceland. The supplied cuts allow everyone to examine the same signals, including pairs within fractions of a second. Twelve stations passed the original metadata selection, but STJA had no usable waveform cuts in the teaching archive. Reuse the full example even if the short download succeeded.",
    "rows": [
      [
        "What to locate",
        "In the supplied package"
      ],
      [
        "Origin and event ID",
        "100 catalogue entries on 23 August 2014"
      ],
      [
        "Waveform files",
        "100 events × 11 stations × 3 channels = 3,300"
      ],
      [
        "Settings and independent checkpoint",
        "Iceland100/DDCorr.toml and reference/report.html"
      ]
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-c",
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "13:45   /   Lab C   ·   Run Iceland100"
  },
  {
    "title": "Locate the P and S fields on one real trace",
    "kind": "figure",
    "lead": "Look up S1_009900 / Z7.HRIM / HHZ in Lab C, then run the header viewer.",
    "notes": "The full command is julia --project=. bin/sac_info.jl ../Iceland100/sac/S1_009900/Z7.HRIM..HHZ.sac --plot ../Iceland100/first_trace.png. Read the A, T0, KA, KT0, O, B, channel and sample-rate fields. For this archive O = 0, B = −25 s, A = 2.597578 s and T0 = 4.45299 s. The slide plots the raw, unfiltered vertical counts. P_pred and S_pred were computed during preparation using 6.0 and 3.5 km/s. The source catalogue provides origins; it does not provide these phase arrivals. On your own files identify the dataset’s conventions.",
    "image": "lab_hrim_markers.png",
    "body": [
      "A carries the numeric P time. KA gives its label, P_pred.",
      "T0 carries the numeric S time. KT0 reads S_pred. Both are predictions."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-c"
    ],
    "section": "13:45   /   Lab C   ·   Run Iceland100"
  },
  {
    "title": "Check whether the real records are ready",
    "kind": "code",
    "lead": "Open the printed inspect directory and read phase_readiness.csv.",
    "notes": "Ask a student to state what the metadata check can and cannot establish. It checks selected phase headers, available time ranges and other header prerequisites; no waveform signal quality has yet been measured. Check input_issues.csv or station_exclusions.csv if relevant. Absolute and relative input paths are resolved against the TOML location. The TOML here already points to its sibling sac/ folder.",
    "command": "julia --project=. bin/ddcorr.jl ../Iceland100/DDCorr.toml --inspect",
    "body": [
      "Expect 100 valid event IDs and 3,300 waveform files in inventory.csv.",
      "Use event_id_map.csv to identify the original folder for each integer ID."
    ],
    "section": "13:45   /   Lab C   ·   Run Iceland100",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "Measure the 100 events and open your report",
    "kind": "code",
    "lead": "The correlate directory printed by DDCorr contains your baseline results.",
    "notes": "Use the same terminal in DDCorr.jl. Record the printed folder in your notebook before launching another run. Open its report.html using Finder or File Explorer. Each new run has a timestamped folder. The supplied Iceland100/reference/report.html is the instructor checkpoint if the run is still finishing. Complete Lab C then return here. Lab D asks students to interpret this particular run.",
    "command": "julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/DDCorr.toml",
    "body": [
      "Find 2,412 P and 4,625 S observations.",
      "Find the waveform examples, lag plots and station–phase matrices."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-c"
    ],
    "section": "13:45   /   Lab C   ·   Run Iceland100",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "What do 7,037 observations represent?",
    "kind": "table",
    "lead": "Open Lab D. One event pair can give a separate observation at many stations and phases.",
    "notes": "Ask students to find these numbers in the baseline report and run_summary.toml; use event_connectivity.csv for isolation. Separate horizontal channels can contribute to one combined S observation. Four events (54, 80, 90, 91) had no accepted measurements in this run. Isolated catalogued events can have weak or missing signals, poor station coverage or simply lack comparable neighbours. The report does not determine which explanation applies.",
    "rows": [
      [
        "Quantity",
        "Baseline",
        "Meaning"
      ],
      [
        "Event folders",
        "100",
        "Catalogue entries inspected"
      ],
      [
        "Event pairs with a measurement",
        "1,914",
        "Pairs linked at least once"
      ],
      [
        "Station–phase observations",
        "7,037",
        "2,412 P and 4,625 S"
      ],
      [
        "Events with no accepted pair",
        "4",
        "Still listed in the catalogue"
      ]
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-d"
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements"
  },
  {
    "title": "Where did the other comparisons go?",
    "kind": "table",
    "lead": "At Z7.DYSA, 66 P waveforms survived preparation.",
    "notes": "Open group_summary.csv and locate Z7.DYSA P. Compute 66 × 65 / 2 = 2,145 distinct pairs. The three outcome counts add to this number. In the preprocessing issues file, a failed waveform-level check such as low SNR happens before pair comparisons and can remove many potential measurements. A boundary peak is a warning that the optimum might be outside the permitted search interval; simply raising or widening a threshold is not a diagnosis.",
    "rows": [
      [
        "Of 2,145 possible comparisons",
        "Count",
        "Interpretation"
      ],
      [
        "Accepted",
        "800",
        "Measured within the search interval"
      ],
      [
        "Below the r threshold",
        "1,307",
        "Peak similarity below 0.70"
      ],
      [
        "Peak at a search boundary",
        "38",
        "Optimum could lie beyond the searched lags"
      ]
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements"
  },
  {
    "title": "Read a measurement that will enter dt.cc",
    "kind": "code",
    "lead": "Read the pair header first. It identifies the two integer catalogue IDs.",
    "notes": "Use this row in Iceland100/reference/dt.cc or your new baseline. The 0.0 in the header is the exported origin-time correction field. Since Δt is travel time for event 1 minus that for event 2, the negative sign means event 1 had a 3.5 ms shorter estimated P travel time to KVER. The number in the third column is the squared correlation coefficient. Resolve the integer identifiers in event_id_map.csv. In correlations.csv, find the same row and distinguish lag from dt. In this example the P-window alignment lag and differential travel time are different values.",
    "command": "# 1 2 0.0\nZ7.KVER -0.0035 0.639765 P",
    "body": [
      "−0.0035 s is the estimated P travel-time difference, event 1 minus event 2.",
      "0.639765 is the weight r². Find the signed r and the lag in correlations.csv."
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements",
    "codeLabel": "EXCERPT FROM dt.cc"
  },
  {
    "title": "Choose which correlations to inspect",
    "kind": "code",
    "lead": "Use a copy named Figures.toml beside the Iceland baseline. Edit its existing [plots] entries.",
    "notes": "Follow Lab D for the copy and run commands. Keep original_event_pairs = []. By default DDCorr takes weak, middle and strong accepted observations within station and phase groups and samples that set to the max_examples limit. The default gallery therefore need not contain a specific weak pair. Explicit requests find the requested accepted pairs in the selected groups. Check example_selection.csv in the new correlate directory for file names, station, phase and IDs. Both target observations appear. Display the two supplied lesson images if time is short.",
    "command": "event_pairs = [[44, 45], [28, 45]]\nexample_stations = [\"Z7.RODG\", \"Z7.STAM\"]\nexample_phases = [\"S\"]",
    "body": [
      "Find 44/45 at RODG and 28/45 at STAM.",
      "Open their waveform and correlation-curve figures."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-d"
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements",
    "codeLabel": "TOML SETTINGS"
  },
  {
    "title": "Do these two catalogue entries share a pulse?",
    "kind": "figure",
    "lead": "At Z7.RODG, the S waveforms for events 44 and 45 have r = 0.99982.",
    "notes": "Students have selected this row at RODG in Figures.toml; the baseline automatic gallery also includes it. First inspect the independently scaled, marker-centred alignment and the lag peak. Read the calendar origins in catalog.txt: 60 ms apart. The residual marker-centred lag is just +0.0003 s. Ask for the extra comparison that distinguishes a repeated source from two cuts of the same physical signal. Reveal the next slide after students propose plotting on the same UTC axis.",
    "image": "real_strong.png",
    "body": [
      "Their catalogue origins are 0.060 s apart.",
      "What would you check before counting two separate earthquakes?"
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements"
  },
  {
    "title": "Put both cuts back on the same UTC clock",
    "kind": "figure",
    "lead": "At RODG the east-component cuts start six samples apart at 100 Hz.",
    "notes": "IDs 44 and 45 map to S1_009943 and S1_009944. Their unfiltered overlapping RODG HHE values match sample-for-sample across 9,495 samples. Their two predicted S times differ by about 0.000425 s on an absolute UTC clock. The figure uses raw counts in both panels so neither independent amplitude scaling nor a fitted lag produced that match. The cut records share the same samples and the predicted windows use the same pulse. Look for two distinct onsets on continuous data and independent stations before deciding how to handle the catalogue entries. A high r for two events separated in time would have a different interpretation.",
    "image": "lab_duplicate_utc.png",
    "body": [
      "All 9,495 overlapping raw counts agree, and both S markers fall on the same pulse.",
      "Inspect other stations for distinct onsets before merging event IDs."
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements"
  },
  {
    "title": "Would you trust a pair just over the threshold?",
    "kind": "figure",
    "lead": "At Z7.STAM, events 28 and 45 have an S correlation of 0.700006.",
    "notes": "Ask a partner to point out which section lines up and which does not. Its residual lag is −0.0039 s. Compare both horizontal channels and other peaks that might be competitive. This pair has eight accepted measurements at six stations. The same pair has r = 0.84175 at RODG S, and another measurement reaches 0.92963. Separate stations can have different travel-time differences. Agreement means physically consistent evidence across observations; equal raw lags at all stations are not required.",
    "image": "real_weak.png",
    "body": [
      "Which cycles support the alignment? Where does the coda diverge?",
      "Check the same pair at a second station before making your judgement."
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements"
  },
  {
    "title": "Read the matrix one station and phase at a time",
    "kind": "figure",
    "lead": "In a station–phase matrix, row i and column j identify an event pair.",
    "notes": "Open matrices/matrix_plots.csv for PNG filenames and matrices/index.csv for machine-readable values. A coloured off-diagonal entry means the pair supplied an accepted correlation coefficient at that station and phase. The symmetric position corresponds to the same observation. The diagonal in the exported classroom figures is unmeasured because self-pairs are excluded. Grey can mean missing input, a preparation exclusion or a rejected measurement. Original event IDs are exposed by event_id_map.csv; consider how event ordering changes visual pattern. A family seen at several independent stations is more informative than a single bright patch.",
    "image": "real_matrix.png",
    "body": [
      "Trace an event along one row to see its measured neighbours.",
      "Use the group and preparation tables to investigate a grey cell."
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements"
  },
  {
    "title": "Read lag distributions in seconds",
    "kind": "figure",
    "lead": "Open the summary figure in the baseline report and compare the P and S distributions.",
    "notes": "The lag axis reports residual correction between marker-centred windows. It is distinct from differential travel time and from the separation of the two earthquake origins. Only accepted interior peak measurements enter these distributions; rejected boundary candidates are in group_summary.csv. Ask students to locate a negative and a positive lag in correlations.csv, then explain the physical meaning of each on a marker-centred diagram. Their shape may reflect marker bias, noise, true differences in waveforms or the allowed search interval.",
    "image": "real_lags.png",
    "body": [
      "Which side corresponds to event j arriving later relative to its marker?",
      "Where would you look for peaks rejected at the search boundary?"
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements"
  },
  {
    "title": "Change only the P correlation threshold",
    "kind": "code",
    "lead": "Save the baseline settings as Iceland100/Threshold.toml. Change [P] min_cc from 0.70 to 0.90.",
    "notes": "The copy commands are in Lab D. Check that [S] still has min_cc = 0.70. Keep filters, lag range, sample rate and station selection fixed. Before running, have everyone predict the direction of change in P support, S support and the number of different event pairs linked. Then run the command on the slide. Open the fresh report alongside the baseline. Return with the two numbers of P observations and one cost of the change.",
    "command": "julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/Threshold.toml",
    "body": [
      "Predict the P count, S count and how many event pairs remain connected.",
      "Which earthquakes could lose all P constraints?"
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-d"
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "How much P coverage did the stricter cut cost?",
    "kind": "table",
    "lead": "The stricter cut removed P links from many events as well as from many station–pair measurements.",
    "notes": "Counts are from the supplied 100-event baseline and a P-only 0.90 experiment. Interpret the last row carefully: an event can retain multiple S constraints even if it has no surviving P link. A threshold changes what samples populate the graph, not only the average similarity. Students should use the comparison to select a reasonable threshold for their scientific objective, and record why. Return to the lecture for the data-processing methods after discussing these numbers.",
    "rows": [
      [
        "Count",
        "P ≥ 0.70",
        "P ≥ 0.90"
      ],
      [
        "P observations",
        "2,412",
        "233"
      ],
      [
        "S observations",
        "4,625",
        "4,625"
      ],
      [
        "Pairs linked by either phase",
        "1,914",
        "1,260"
      ],
      [
        "Events with at least one P link",
        "94",
        "49"
      ]
    ],
    "section": "14:35   /   Lab D   ·   Read the measurements"
  },
  {
    "kind": "break",
    "title": "Where did this lag come from?",
    "lead": "Reopen a waveform example. Follow the same samples from a SAC trace through filtering, a lag search and the choice of a peak.",
    "body": [
      "Keep your Iceland100 settings and report open."
    ],
    "notes": "Return after the 15:15–15:30 coffee break. Invite students to predict the first change DDCorr makes to the raw trace. By the end they should be able to identify the contributing windows and defend the selected lag.",
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "Which part of this record produced a lag?",
    "lead": "Z7.KVER, event 1. The dashed line is its P marker.",
    "image": "method_raw_filtered.png",
    "body": [
      "Both panels show the same three seconds. The 2–14 Hz filter changes which oscillations dominate.",
      "DDCorr prepares each complete SAC cut once for this station and phase, then reuses the short arrival window in many comparisons."
    ],
    "notes": "Return to the Iceland100 time series students have just correlated. Ask them to point to an oscillation shared between the two panels, then one that has weakened. The observed signal is in instrument counts. Vertical scale changes between panels. Each record is detrended and tapered before the frequency filter; this example isolates the difference visible around P. The archive uses predicted P and S markers, so zero on this axis is the expected phase time. The measured lag is a correction to the relative marker timing.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L20-L46",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L78-L107"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "Why soften the two ends of a SAC cut?",
    "lead": "A cut can begin in the middle of a wave, with a large first sample.",
    "image": "method_taper.png",
    "body": [
      "Subtract the fitted straight line. Then multiply the samples at each end by a raised cosine, increasing smoothly from near zero to one at the left edge.",
      "The gentler start reduces artificial oscillations when the filter encounters the edge. The class taper covers 2% of the cut at each end."
    ],
    "notes": "Read the right panel as a multiplier, from a nearly muted sample to a sample retaining its recorded amplitude. The middle of the cut has weight one. At the right end the weights decrease in reverse order. The short left panel is drawn from Z7.KVER event 1. A finite trace meets the filter's end treatment; a sudden jump can produce a transient that lasts several cycles. Tapering changes existing sample amplitudes. Later, FFT zero-padding appends extra array entries for a different mathematical reason.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L2-L36",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L23-L27"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "What does a 2–14 Hz filter do to a wave?",
    "image": "phase_demo.png",
    "lead": "Amplitude describes the height of a cycle. Phase describes where its peaks fall in time.",
    "body": [
      "A single pass attenuates some frequencies and shifts different frequencies by different amounts.",
      "Filter from start to end, reverse the result and filter again. After restoring the time order, the shifts cancel in the interior and the two attenuations multiply."
    ],
    "notes": "Open the gain plot first. The horizontal axis is frequency in cycles per second and the vertical axis is output amplitude divided by input amplitude. A gain of 0.5 means the oscillation is half as tall after one pass and about 0.25 as tall after two. Use the waveform panel to distinguish a change of height from a displacement of a crest. The two-pass amplitude response is |H(f)|² for ideal interior samples. Actual finite records have edges; DDCorr checks for five seconds of real data outside its analysis windows before filtering the complete record. A bandpass is useful when repeatable arrivals have appreciable energy in the chosen band relative to noise. The P and S settings are independent.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L20-L36",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L85-L96",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L36-L47"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "code",
    "title": "Find the filter in the Julia code",
    "image": "code-42.png",
    "lead": "In src/signal.jl, taper! changes the samples and filtfilt applies the filter in both time directions.",
    "body": [
      "DDCorr.toml → [P] or [S] → band_hz sets the two frequency corners.",
      "src/advanced.toml contains filter_order and trace_taper_fraction. DDCorr reads it automatically at startup."
    ],
    "notes": "Read the function names with the class. In taper! look for the multiplication of symmetric samples by the same weight. In the filtering call the digital filter is a fourth-order Butterworth design in the default configuration. It is represented as a series of short filters, each of order two or less, so its numerical coefficients remain manageable; applying them one after the other gives the intended filter. Trace damping at the edges, attenuation across the frequency axis and the marker-centred waveform window each have different jobs. Check the effective_config.toml in the result directory for the settings actually used.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L10-L37",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L1-L5",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L23-L46"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "Why low-pass before keeping fewer samples?",
    "image": "alias_demo.png",
    "lead": "At 50 samples per second, a 38 Hz oscillation can produce the same recorded dots as a 12 Hz oscillation.",
    "body": [
      "A 50 Hz grid can distinguish frequencies only up to 25 Hz. Faster motion can appear as a slower signal in the retained samples.",
      "The resampler attenuates frequencies above the new limit before it makes the 50 Hz record. This is the anti-alias filter."
    ],
    "notes": "Ask everyone to cover the lines and look only at the dots. The two illustrated cosines share the same values on the new grid because 38 = 50 − 12. Connecting the retained samples can therefore suggest 12 Hz even when the original motion was 38 Hz. Once sampled this way, the original frequency cannot be read from those dots. A filter must act before reducing the sample rate. DDCorr already bandpasses the signal; its resampler also applies its own low-pass treatment as part of the rate conversion. These stages specify the scientific comparison band and the sampling operation, respectively.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L20-L38"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "Compare the same seconds on the same grid",
    "image": "method_resampling.png",
    "lead": "Each dot is one sample from Z7.KVER, event 1. Both panels show the same part of its P wave.",
    "body": [
      "The native spacing is 10 ms at 100 Hz. The analysis spacing is 20 ms at 50 Hz.",
      "A marker can fall between grid points. DDCorr uses the two adjacent samples to estimate the value at each required marker-relative time."
    ],
    "notes": "Point to the time of one crest. On the right only about half as many dots describe the same crest. The resampler filters and makes samples at the target rate; its delay compensation maintains the record time reference. The subsequent straight-line interpolation uses neighboring samples to put different events on the exact same grid relative to their own picks. This interpolation acts on the waveforms. Later we will interpolate the peak of a correlation curve, a different quantity. The target rate must also be supported by the source recordings.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L20-L46",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L85-L97"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "Measure background before asking two events to match",
    "image": "method_signal_noise.png",
    "lead": "The RMS amplitude is a measure of typical fluctuations about the window mean.",
    "body": [
      "SNR = RMS in the phase window ÷ RMS in the noise window. The noise window is 8 to 2 seconds before P, including for S.",
      "At Z7.KVER the P ratios are 2.99 for event 1 and 1.81 for event 2. Both exceed the class minimum of 1.5."
    ],
    "notes": "Each trace and component passes through this screen before any pairwise comparison. A ratio of 1.81 means the phase window fluctuates with 1.81 times the background amplitude in that frequency band. The signal and noise windows both use mean-removed, filtered samples. For S, using a pre-S noise window could include P coda and make the background look artificially energetic. Point out that this implementation needs a usable pre-P noise anchor even when only an S measurement is sought. Show the SNR for the weaker trace as a separate property from waveform resemblance. Changes to bandpass settings can change which records enter each comparison.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L85-L107",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L23-L27"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "What exactly moves when the lag is 0.50 s?",
    "image": "method_windows.png",
    "lead": "Conceptually, hold one P window fixed and compare equal-length segments from the other event.",
    "body": [
      "The core extends from −0.50 to +2.00 s around P. At 50 Hz, that is 126 samples including both endpoints.",
      "A search of ±0.50 s needs 25 extra samples on either side and yields 51 candidate lags. Positive lag samples event 2 later relative to its marker."
    ],
    "notes": "These are the exact Z7.KVER event 1 and 2 filtered windows. The horizontal bars indicate which part of each record is used. At k = 0 the event 2 segment spans −0.50 to +2.00 s. At k = +25 it spans 0.00 to +2.50 s. Every comparison contains 126 samples; the entire event 2 search interval requires 176 real samples. A lag curve places one similarity score at each candidate shift. The algorithm computes these scores together with a Fourier transform instead of sliding by hand. Here the extra 25 samples are real data on each side of the core; five seconds of filter margin and extra mathematical zeros for the transform serve separate purposes.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L78-L96",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L123-L135"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "equation",
    "title": "Compare shape even when one earthquake is larger",
    "lead": "At each lag, take the Pearson correlation of the two equal-length segments.",
    "equation": "r(k) = Σₙ (aₙ − ā)(bₙ₊ₖ − b̄ₖ) / √[Σₙ(aₙ − ā)² · Σₙ(bₙ₊ₖ − b̄ₖ)²]",
    "body": [
      "a is the fixed window, b is the shifted window, n counts samples, and k is the lag in samples. Each bar denotes its own window mean.",
      "For samples [−1, 0, 1] and [4, 6, 8], subtracting their means leaves [−1, 0, 1] and [−2, 0, 2]. The shapes match, so r = 1."
    ],
    "notes": "Students can verify the dot product 4 and denominator √(2 × 8) = 4. Subtracting each mean removes a constant offset; dividing by the two window norms removes scale differences. Corresponding peaks yield positive sample products and matching troughs do too. Opposite polarity yields negative r. The default searches for positive peaks. The B mean and energy can change with lag because each candidate uses different samples. This coefficient also treats tiny but similarly shaped signals as similar, hence the earlier SNR requirement. The two directional finite-window correlations are averaged in the final definition.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L65-L75",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L123-L145"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "code",
    "title": "How can an FFT calculate 51 scores together?",
    "image": "code-44.png",
    "lead": "For each lag, the numerator is a sum of sample-by-sample products.",
    "body": [
      "Reverse the fixed, mean-removed window. Convolving it with the extended record produces all the required product sums in one sequence.",
      "DDCorr transforms both arrays, multiplies their spectra and transforms the product back. It divides each sum by the norms for that lag."
    ],
    "notes": "An FFT is an algorithm for the discrete Fourier transform. The convolution theorem makes convolution in time equivalent to multiplication of spectra followed by the inverse transform. DDCorr reverses the fixed core before transforming, converting cross-correlation into convolution. The fixed core sums to zero, so subtracting the moving segment’s mean would leave the numerator unchanged. Running sums and sums of squares supply that segment's lag-specific norm. The two multiplications shown compute opposite template choices. A worker reuses the Fourier transforms and its own temporary arrays over many pairs; only the final normalizing and combining loop runs over lag indices.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L65-L75",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L110-L135"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "code",
    "title": "Why fill the end of an FFT array with zeros?",
    "image": "code-43.png",
    "lead": "The discrete Fourier transform treats an array as periodic. A short array lets the end wrap around and contribute at the start.",
    "body": [
      "The 126-sample core and 176-sample search record have 301 linear-convolution samples. DDCorr chooses a 512-sample FFT and appends zeros to each array.",
      "The zeros prevent wraparound. The earlier taper weighted recorded samples at the cut ends. The 20 ms sampling interval stays the same."
    ],
    "notes": "Read nf = nextpow(2, ncore + length(ext) − 1), followed by reverse(core) and zeros. The shortest transform with no overlap of the linear convolution copies has length 126 + 176 − 1 = 301. Choosing 512 accommodates all of it efficiently. The code uses only the 51 entries that correspond to complete, equal-length overlapping windows. If the class asks why additional zeros do not create finer timing, point out that the array holds samples further along the same time grid. The separate sub-sample estimate comes from interpolating the peak later.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L65-L75",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L123-L135"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "Why calculate both event orders?",
    "image": "method_window_order.png",
    "lead": "For complete sequences, exchanging events reverses the lag axis. Fixed pick windows introduce a second choice: whose window stays centred?",
    "body": [
      "At +460 ms for Z7.DYSA P, fixing event 86 gives 0.644. Fixing 97 and reversing its lag axis gives 0.811.",
      "The two segments include different edge samples and use their own means and amplitudes. DDCorr averages both scores to give 0.728 at this lag."
    ],
    "notes": "Use the left panel to show that peaks generally align, then the right panel to show their actual height difference. If x and y are full sequences, their ordinary correlation satisfies Rxy(k) = Ryx(−k). Here, when A is fixed, A is always cut at its pick while B varies. When B is fixed, the A cut varies instead. The crop, mean and norm are all defined on the selected segment, making these two distinct estimates. This difference is present regardless of computing direct sums or the FFT. Averaging the estimates on a common signed-lag axis guarantees that changing the event labels reverses the averaged curve.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L123-L135"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "How do two horizontal components yield one S lag?",
    "image": "method_horizontal_stack.png",
    "lead": "Z7.STAM, events 28 and 45. Compare east with east and north with north.",
    "body": [
      "At each lag, take the mean of the available component coefficients. Then pick the peak of that mean curve.",
      "At zero sample lag, east gives 0.673 and north 0.727. Their mean, 0.700006, passes the 0.70 threshold."
    ],
    "notes": "Show the horizontal alignment of the two x axes. The numbers are component scores at the same winning grid point. The per-component preparation requires sufficient SNR. The combined curve, rather than each individual coefficient, is tested against min_cc. With min_components = 1 a single common usable horizontal may suffice; with two available the program uses both. Setting 2 requires both to pass preparation. Channel names and sensor orientations must match across events, and the reduced marker differences must agree within 0.001 s across contributing channels. Two traces with identical channel endings but different orientations are not interchangeable. The eventual dt is the mean reduced-marker difference minus this single refined lag.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/pipeline.jl#L105-L135",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L29-L34"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "Locate the crest between sampled lags",
    "image": "method_subsample.png",
    "lead": "For the same S pair, the three measured scores at −20, 0 and +20 ms are 0.511, 0.700 and 0.273.",
    "body": [
      "A parabola through those three points has its highest point 3.86 ms before zero. DDCorr exports a lag of −0.0039 s.",
      "The coefficient remains the measured 0.7000. Four printed decimal places describe rounding; estimating the timing error requires additional evidence."
    ],
    "notes": "Call the left, centre and right sampled scores a, b and c. The fitted vertex is δ = (a − c) / [2(a − 2b + c)] samples from the centre. Using these values gives δ = −0.193 sample and δ/50 = −0.00386 s. The centre can itself be many samples away from zero; the parabola refines its position locally. Interpolation is meaningful when the peak is smooth and well identified. Here differential_time is approximately +0.0307 s because the reduced-marker difference is about +0.0268 s and the refined lag is negative. Show students that they can find the exact calculation in src/signal.jl.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L146-L173"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "table",
    "title": "Which checks decide whether a lag enters dt.cc?",
    "lead": "The class configuration tests the best signed peak on each station–phase curve.",
    "rows": [
      [
        "Status",
        "Trigger in the class settings",
        "Where to look"
      ],
      [
        "boundary",
        "Winner is at either end of the search",
        "Lag range and the two markers"
      ],
      [
        "low_cc",
        "Peak is below 0.70",
        "Signal, noise and waveform shape"
      ],
      [
        "ambiguous_peak",
        "Another peak is close in height",
        "Spacing and height of competing peaks"
      ],
      [
        "accepted",
        "Peak passes all three checks",
        "Alignment, other stations, event timing"
      ]
    ],
    "notes": "DDCorr checks these statuses from top to bottom, so a boundary peak gets that label even when its height is small. Define an independent competitor as a local maximum more than 0.04 s from the winner in these settings. DDCorr requires a 0.10 gap for P or 0.08 for S. With no positive competing peak, it uses zero as the comparison score. Data problems can also occur earlier (e.g., inadequate SNR or too little recorded data) and a post-correlation check can reject component timing disagreement. At Z7.DYSA, our baseline P group has 66 prepared events and 2,145 pairs. Of these, 800 passed, 1,307 were low_cc and 38 ended at the boundary. Use the instructor figure on the next slide for an actual rejected pair: automatic examples in the report are drawn from accepted observations.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L138-L170",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/pipeline.jl#L119-L145",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L29-L47"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "figure",
    "title": "Is a peak at the search limit the true maximum?",
    "image": "method_boundary.png",
    "lead": "Z7.DYSA P, events 29 and 41. Both searches find r = 0.764 at the sampled shift −500 ms.",
    "body": [
      "With a ±500 ms search the highest sample sits on the left edge. Its neighbor beyond the edge is unknown, so DDCorr rejects it.",
      "Extending the search to ±700 ms reveals both sides. Interpolation gives −496 ms, and this pair passes."
    ],
    "notes": "Have students make the decision with the right-hand panel covered. Expanding the search is a diagnostic if the markers and real data support it. A peak at the edge could continue to rise or could turn downward. In this recorded example, measurements further to the left reveal that the peak turns down. Wider searches can also introduce competing arrivals or cycles, so this example makes a case for inspecting marker errors and the correlogram before changing max_lag_s for an entire dataset. These two curves were recomputed using the class code and the same pair. The smaller search includes the exact winning value shown in both plots.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L85-L94",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L146-L169"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "table",
    "title": "Plan the work one station and phase at a time",
    "lead": "A group means all usable P recordings at one station, or all usable S recordings there.",
    "rows": [
      [
        "Events sharing a group",
        "Potential event pairs"
      ],
      [
        "50",
        "1,225"
      ],
      [
        "100",
        "4,950"
      ],
      [
        "1,000",
        "499,500"
      ]
    ],
    "body": [
      "With n events the group has n(n − 1)/2 possible pairs. max_pairs_per_group checks that upper bound from SAC headers.",
      "max_group_memory_mib budgets space for waveform preparation, retained windows and worker buffers. Dense matrices and figures also need room."
    ],
    "notes": "Settings for these limits are in src/advanced.toml; the primary options are in DDCorr.toml. The default pair bound is 2,000,000 and the group work budget is 1,024 MiB. Planning uses header-eligible events before the waveform data for the group are read. Once records have been filtered and checked for a usable arrival, the actual number of comparable events may be smaller. In the field example, 66 prepared P records at Z7.DYSA yield 66 × 65 / 2 = 2,145 candidate pairs. Accepted rows are retained, and optional dense outputs require separate space; bytes in the guard are an estimate for the named operations. Sparse matrix exports contain accepted edges. A thousand-event group can be tested on a subset first and the projected pair cost checked before scaling.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/pipeline.jl#L50-L99",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L49-L66",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L110-L117"
    ],
    "section": "15:30   /   Inside the correlator"
  },
  {
    "kind": "break",
    "title": "Change the filter or use your own earthquakes",
    "lead": "With Iceland100, test what happens when you narrow the P band. With your own event cuts, inspect the headers and make a first run.",
    "body": [
      "17:35   ·   Regroup with one measurement and the evidence you used to judge it."
    ],
    "notes": "Invite learners to take one of the two routes. The Iceland option has complete worked answers. The personal archive route starts at the slide “Bring a cut SAC dataset of your own”. Pair up if useful. Finish with an explanation of one actual observation.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-e"
    ],
    "section": "16:50   /   Choose a practical"
  },
  {
    "kind": "activity",
    "title": "Experiment: change the P band and predict the result",
    "lead": "Run from DDCorr.jl. Put the copied settings beside Iceland100/DDCorr.toml so the same SAC paths still work.",
    "body": [
      "Duplicate ../Iceland100/DDCorr.toml as ../Iceland100/BandTest.toml. Under [P], change only band_hz to [4.0, 8.0].",
      "Before running, predict which band will produce more accepted P measurements and which might more often align two different cycles.",
      "Compare both run_summary.toml files. Record accepted P and S and check which setting changed in effective_config.toml."
    ],
    "command": "julia --project=. --threads=2 bin/ddcorr.jl ../Iceland100/BandTest.toml",
    "notes": "Allow 15–20 minutes for a paired exercise. In Finder or Explorer duplicate the TOML (show file extensions). In macOS/Linux use cp ../Iceland100/DDCorr.toml ../Iceland100/BandTest.toml; in PowerShell use Copy-Item ../Iceland100/DDCorr.toml ../Iceland100/BandTest.toml. All three command paths are relative to DDCorr.jl. The Julia command on this slide works in either shell. The output directory receives a new timestamped run. If participants changed earlier class controls, start from the original distributed configuration or restore the baseline first. A narrower band can improve a waveform's signal-to-noise ratio, but fewer frequencies can also make different cycles look alike. Ask participants to distinguish accepted rows from unique pairs of events.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L70-L94"
    ],
    "section": "16:50   /   Iceland100   ·   Bandpass experiment",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "kind": "figure",
    "title": "The highest coefficient can belong to an ambiguous curve",
    "image": "method_competition.png",
    "lead": "Z7.KVER P, events 13 and 27. Look for the best peak and the strongest competing peak.",
    "body": [
      "At 2–14 Hz, the two peaks are 0.706 and 0.470. Their gap is 0.237, enough to accept the P lag.",
      "At 4–8 Hz, peaks about 160 ms apart reach 0.820 and 0.818. The gap shrinks to 0.002, below the required 0.10."
    ],
    "notes": "Show the predicted effect of a narrower passband: the signal has fewer distinguishable cycles. Use the plotted dots to read two actual local maxima on the broad and narrow band curves; only independent peaks count. At 4–8 Hz the highest sample is +40 ms and the nearly identical competitor +200 ms, about one cycle at 6.25 Hz. In the baseline the runner-up is at +220 ms. Raising min_cc would have increased the relative appeal of the less decisive narrow-band case if ambiguity were ignored. This is a rejected 4–8 Hz observation; it does not appear in that run’s accepted-only correlations.csv or automatic examples. Across the whole rerun 1,103 P candidate pairs receive the ambiguous_peak status against zero in the baseline.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L138-L169",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/advanced.toml#L36-L41"
    ],
    "section": "16:50   /   Iceland100   ·   Bandpass experiment"
  },
  {
    "kind": "table",
    "title": "What changed across all 100 events?",
    "lead": "Count observations by station, phase and event pair, so that one pair at two stations counts twice.",
    "rows": [
      [
        "Measurement",
        "2–14 Hz P",
        "4–8 Hz P"
      ],
      [
        "Accepted P",
        "2,412",
        "4,626"
      ],
      [
        "Accepted in both P runs",
        "1,945",
        "1,945"
      ],
      [
        "Accepted P in this run only",
        "467",
        "2,681"
      ],
      [
        "Accepted S (same settings)",
        "4,625",
        "4,625"
      ]
    ],
    "body": [
      "Among shared P observations, the median absolute lag change is 2.3 ms. Measurements gained or lost have no accepted counterpart."
    ],
    "notes": "The full field dataset was rerun with the only scientific change under [P]. S provides a built-in check: all 4,625 S keys and lags are identical between runs. Among the shared P observations, maximum absolute lag change is 19.0 ms. Distinguish the common subset (stability conditional on both filters accepting) from the gains and losses. Both SNR screening and the correlation curve change when the P band changes. To compare runs manually, use event_i, event_j, station, phase as the join key in correlations.csv. Ask the class to choose one newly accepted P observation and inspect aligned waveforms before endorsing the narrower band. The baseline results are in Iceland100/reference.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L85-L107",
      "https://github.com/eliasrh/DDCorr.jl/blob/26e6ae03caae6bdb15d657027229c3d0d194deb7/src/signal.jl#L138-L169"
    ],
    "section": "16:50   /   Iceland100   ·   Bandpass experiment"
  },
  {
    "title": "Bring a cut SAC dataset of your own",
    "kind": "activity",
    "lead": "Open Lab E. Build a small test with at least two events recorded at a shared station.",
    "notes": "Place a new MyData folder beside DDCorr.jl and Iceland100. Inside MyData create sac/, then one subdirectory per event. Place copies, or use an existing event-cut root by changing sac_dir. DDCorr reads waveform inputs and writes outputs to a separate directory. If students do not have their own archive, use the Iceland example to practise a P-only or component selection and compare with the baseline. The directory viewer prints the header for one representative file; inspect individual files in several folders.",
    "command": "julia --project=. bin/sac_info.jl ../MyData/sac",
    "body": [
      "Use MyData/sac/<event ID>/<station channel>.sac.",
      "Locate the origin, station and event coordinates, component codes and phase markers."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md#lab-e"
    ],
    "section": "16:50   /   Lab E   ·   Your SAC files",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "Map your archive’s marker fields",
    "kind": "code",
    "lead": "Copy Iceland100/DDCorr.toml to MyData/DDCorr.toml. Read several SAC headers before editing.",
    "notes": "Use numeric time-field names. The associated label tells you what the field means in this dataset. Ask the provider when the convention is ambiguous, and record whether the source is manual, predicted or automated. For example, an archive might store P in T8 and S in T9. With these confirmed, put t8 and t9 in the configuration; they are examples only. The viewer takes explicit --p-header and --s-header options to draw the same fields. O and arrival times share the SAC reference; use O correctly or differential times will be biased.",
    "command": "[input]\nsac_dir = \"sac\"\np_pick_header = \"a\"\ns_pick_header = \"t0\"",
    "body": [
      "Replace a and t0 with the verified numeric fields in your files.",
      "Check whether the waveforms contain both the arrival and pre-P noise window."
    ],
    "section": "16:50   /   Lab E   ·   Your SAC files",
    "codeLabel": "IN YOUR TERMINAL"
  },
  {
    "title": "Trace a missing result to its cause",
    "kind": "table",
    "lead": "Run Lab E inspection, then correlate. Start your diagnosis where the record disappeared.",
    "notes": "Commands: julia --project=. bin/ddcorr.jl ../MyData/DDCorr.toml --inspect then julia --project=. --threads=2 bin/ddcorr.jl ../MyData/DDCorr.toml. Look first at the printed results directory, then inspection and run diagnostics. A missing phase can leave other phases usable, subject to their component and noise requirements. A conflicting station can be excluded while other stations continue in this edition; look in station_exclusions.csv. A correlation requires two prepared waveforms from different events for the same station and phase.",
    "rows": [
      [
        "What happened?",
        "Where to check"
      ],
      [
        "No event or station recognized",
        "inventory.csv, input_issues.csv, station_exclusions.csv"
      ],
      [
        "Phase or required time window missing",
        "phase_readiness.csv"
      ],
      [
        "Trace failed conditioning or SNR",
        "preprocessing_issues.csv"
      ],
      [
        "Prepared pair failed lag or r test",
        "group_summary.csv"
      ]
    ],
    "section": "16:50   /   Lab E   ·   Your SAC files"
  },
  {
    "title": "Finish with a defensible measurement",
    "kind": "activity",
    "lead": "Pick one pair and explain how its measured waveforms support your interpretation.",
    "notes": "Ask each student for a brief verbal or written result. A useful answer names the dataset, station, phase and two event IDs, reports coefficient, lag with units, and exported difference, then identifies the particular cycles or independent observations supporting the decision. Ask them to identify one reason for doubt and one datum that could resolve it. Optional solution check: case 44/45 raw windows share the same UTC pulse. Case 28/45 at STAM barely passes and has eight accepted observations at six stations. See items 1–5 of teaching/SOLUTIONS.txt for the field and synthetic checks.",
    "body": [
      "Report r, the marker-centred lag and the exported Δt, with units.",
      "Show one waveform feature supporting the measurement and one source of doubt.",
      "Explain how a different threshold would change coverage."
    ],
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/main/teaching/SOLUTIONS.txt"
    ],
    "section": "17:35   /   Discuss and save the measurements"
  },
  {
    "title": "Keep the baseline files together",
    "kind": "table",
    "lead": "Save these four files from one 100-event correlate folder for later work.",
    "notes": "This is the end of the DDCorr practical. Preserve the baseline settings and the printed directory as well. Running a threshold experiment gives another, valid output set that should be labelled separately. The future use of graph consistency and double-difference relocation motivates these data products; students can finish today by explaining a measured differential time and tracing it back to its original SAC files.",
    "rows": [
      [
        "File",
        "What you can recover"
      ],
      [
        "dt.cc",
        "Event pair, station, phase, differential time and weight"
      ],
      [
        "catalog.txt",
        "Origin, starting position and integer event ID"
      ],
      [
        "stations.txt",
        "Coordinates of the stations used by the workflow"
      ],
      [
        "event_id_map.csv",
        "The original SAC folder for each integer ID"
      ]
    ],
    "section": "17:35   /   Discuss and save the measurements"
  },
  {
    "kind": "references",
    "title": "Papers behind the measurements",
    "rows": [
      [
        "Poupinet, Ellsworth & Fréchet (1984)",
        "Timing earthquake doublets on the Calaveras Fault",
        "10.1029/JB089iB07p05719"
      ],
      [
        "Waldhauser & Ellsworth (2000)",
        "The double-difference relocation algorithm",
        "10.1785/0120000006"
      ],
      [
        "Waldhauser (2001)",
        "hypoDD program and user guide",
        "10.3133/ofr01113"
      ],
      [
        "Schaff et al. (2004)",
        "Choosing and evaluating correlation measurements",
        "10.1785/0120020238"
      ],
      [
        "Trugman & Shearer (2017)",
        "GrowClust hierarchical relocation",
        "10.1785/0220160188"
      ]
    ],
    "notes": "Select a DOI to open its publication. Software repositories appear separately below.",
    "sources": [
      "https://doi.org/10.1029/JB089iB07p05719",
      "https://doi.org/10.1785/0120000006",
      "https://doi.org/10.3133/ofr01113",
      "https://doi.org/10.1785/0120020238",
      "https://doi.org/10.1785/0220160188"
    ],
    "section": "Further reading"
  },
  {
    "kind": "references",
    "title": "The Iceland example and its downstream methods",
    "rows": [
      [
        "Woods et al. (2018)",
        "Long-period seismicity at Bárðarbunga",
        "10.1016/j.epsl.2018.03.020"
      ],
      [
        "Ágústsdóttir et al. (2019)",
        "Earthquake catalogue and faulting at Bárðarbunga",
        "10.1029/2018JB016010"
      ],
      [
        "Heimisson & Yu (2026)",
        "DDSync · graph synchronization of differential times",
        "10.1785/0220260086"
      ],
      [
        "Heimisson (2026), preprint",
        "GraphSplit · graph-based relative relocation",
        "10.22541/essoar.15009811/v1"
      ]
    ],
    "notes": "Select a DOI to open its publication. Software repositories appear separately below.",
    "sources": [
      "https://doi.org/10.1016/j.epsl.2018.03.020",
      "https://doi.org/10.1029/2018JB016010",
      "https://doi.org/10.1785/0220260086",
      "https://doi.org/10.22541/essoar.15009811/v1"
    ],
    "section": "Further reading"
  }
];
