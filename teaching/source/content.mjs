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
    "kind": "figure",
    "section": "Friday workshop",
    "title": "Two earthquakes recorded at one station",
    "image": "field_pair.png",
    "lead": "Station STAM recorded these S waves during the Bárðarbunga rifting sequence. Several crests and troughs appear in the same order on both traces.",
    "body": [
      "When two earthquakes produce similar waveforms, sliding one trace across the other lets us measure a small difference in arrival time. Differences measured at several stations constrain the separation of the earthquakes."
    ],
    "notes": "The two earthquakes are events 28 and 45. Both traces are the east component. Zero on each trace is its predicted S arrival. Later slides use both horizontal components for the numerical S measurement."
  },
  {
    "kind": "agenda",
    "title": "Friday’s workshop",
    "notes": "Friday runs 10:00–18:00. The guided lab begins before lunch and resumes afterward. At 14:05 everyone opens the real Iceland report. The last two hours are open work with individual help and the clinic reference slides.",
    "section": "Friday workshop",
    "parts": [
      {
        "name": "Morning",
        "slots": [
          {
            "time": "10:00–10:50",
            "topic": "Relative earthquake locations",
            "range": "4–13"
          },
          {
            "time": "10:50–11:05",
            "topic": "Coffee",
            "range": ""
          },
          {
            "time": "11:05–12:00",
            "topic": "Waveform cross-correlation",
            "range": "14–23"
          },
          {
            "time": "12:00–12:45",
            "topic": "Guided DDCorr lab",
            "range": "24"
          },
          {
            "time": "12:45–13:45",
            "topic": "Lunch",
            "range": ""
          }
        ]
      },
      {
        "name": "Afternoon",
        "slots": [
          {
            "time": "13:45–14:05",
            "topic": "Continue the lab · Iceland recordings",
            "range": "24"
          },
          {
            "time": "14:05–14:55",
            "topic": "Reading the Iceland report",
            "range": "25–52"
          },
          {
            "time": "14:55–15:10",
            "topic": "Coffee",
            "range": ""
          },
          {
            "time": "15:10–16:00",
            "topic": "How DDCorr measures a lag",
            "range": "53–72"
          },
          {
            "time": "16:00–18:00",
            "topic": "Open clinic for your own SAC files",
            "range": "73–85"
          }
        ]
      }
    ]
  },
  {
    "kind": "figure",
    "section": "10:00   /   Relative earthquake locations",
    "title": "Earthquakes traced the Bárðarbunga dike",
    "lead": "In August 2014, magma propagated about 48 km from beneath Bárðarbunga toward the Holuhraun eruption site.",
    "notes": "In the overview at left, follow the band of earthquakes northeast from the caldera. The detail at right shows earthquakes along the dike. A broad cloud can contain both geological structure and errors in individual earthquake locations. These are panels A and B of Woods et al. Figure 1 cropped from the open-access article, CC BY 4.0.",
    "image": "woods_fig1ab.png",
    "body": [
      "The earthquake locations outline the route. Resolving individual faults requires finer estimates of the distances between earthquakes."
    ],
    "citation": [
      {
        "text": "Woods et al. (2018), Earth and Planetary Science Letters 490, 216–229, Fig. 1A–B. Cropped, CC BY 4.0.",
        "url": "https://doi.org/10.1016/j.epsl.2018.03.020"
      }
    ],
    "sources": [
      "https://doi.org/10.1016/j.epsl.2018.03.020",
      "https://creativecommons.org/licenses/by/4.0/"
    ]
  },
  {
    "kind": "figure",
    "section": "10:00   /   Relative earthquake locations",
    "title": "The 100 earthquakes in the practical",
    "lead": "The red circles identify 100 consecutive events on 23 August. The first occurred at 12:00 UTC and the last at 13:48 UTC.",
    "notes": "The first origin is 12:00:29.86 and the last is 13:48:56.81 UTC. These are the first 100 catalogue rows after noon, selected by time. The coordinates come from Data Set S1 of Ágústsdóttir et al. The map frame uses equal horizontal and vertical distance scales.",
    "image": "seminar_s1_rift.png",
    "body": [
      "The other dots show published earthquakes through the second half of August. Colour indicates date."
    ],
    "citation": [
      {
        "text": "Ágústsdóttir et al. (2019), Journal of Geophysical Research: Solid Earth 124, 8331–8357, Data Set S1.",
        "url": "https://doi.org/10.1029/2018JB016010"
      }
    ],
    "sources": [
      "https://doi.org/10.1029/2018JB016010"
    ]
  },
  {
    "kind": "figure",
    "section": "10:00   /   Relative earthquake locations",
    "title": "Eleven stations recorded this sequence",
    "lead": "Origin time is when an earthquake begins. The P travel time is the interval from that origin until the P wave reaches a station.",
    "notes": "This map uses the 100 event coordinates and the 11 stations with three-component recordings. For each source, the arrival time at a station equals the origin time plus the travel time. P and S waves travel at different speeds. Each station and phase supplies a separate timing measurement.",
    "image": "seminar_network.png",
    "body": [
      "The red dots mark the earthquakes. The green triangles are stations that recorded them. KVER and STAM view the source region from different directions."
    ],
    "sources": [
      "https://doi.org/10.1029/2018JB016010",
      "https://doi.org/10.7914/SN/Z7_2010"
    ]
  },
  {
    "kind": "figure",
    "section": "10:00   /   Relative earthquake locations",
    "title": "The two P waves travel through nearly the same rock",
    "lead": "Both P waves pass through the same slow region on their way to the station.",
    "notes": "The lines are straight reference rays in an illustrative vertical section. The shaded region is much wider than the separation of the rays there. The absolute prediction for each event can be biased by a similar path delay. Source separation, different phases or a rapid change in structure can make the delays differ.",
    "image": "relative_shared_rays.png",
    "body": [
      "If a velocity model misses that region, it predicts both arrivals too early. The common part of the delay cancels when we subtract the travel times."
    ],
    "sources": [
      "https://doi.org/10.1785/0120000006"
    ]
  },
  {
    "kind": "table",
    "section": "10:00   /   Relative earthquake locations",
    "title": "The double-difference residual",
    "lead": "For a pair at one station, subtract the second event’s P travel time from the first. Do the same for the model predictions.",
    "notes": "A travel time here means phase time measured from its event origin. In this numerical illustration both events are delayed relative to their predictions. Much of that delay disappears in the pair difference. The residual is (4.42−4.30)−(4.10−4.02)=0.04 s. Absolute origin errors also contribute and can be estimated in the relocation.",
    "rows": [
      [
        "P travel time",
        "Event 1",
        "Event 2",
        "Event 1 − event 2"
      ],
      [
        "Measured",
        "4.42 s",
        "4.30 s",
        "+0.12 s"
      ],
      [
        "Predicted",
        "4.10 s",
        "4.02 s",
        "+0.08 s"
      ]
    ],
    "body": [
      "Here the measured difference exceeds the prediction by 0.04 s. Relocation adjusts the event positions and origin times to reduce these residuals across stations."
    ],
    "sources": [
      "https://doi.org/10.1785/0120000006"
    ]
  },
  {
    "kind": "figure",
    "section": "10:00   /   Relative earthquake locations",
    "title": "Station direction controls the time difference",
    "lead": "Event i lies 100 m east of event j. For a station to the east, the P wave from i travels a shorter distance.",
    "notes": "This calculation places two sources at the same depth and stations on a horizontal circle of 20 km radius. It uses the difference of the two distances divided by a uniform P-wave speed. A single differential time constrains one projection of the displacement. Different station directions add independent constraints.",
    "image": "seminar_azimuth.png",
    "body": [
      "At 6 km/s, event i minus event j is −16.7 ms to the east and +16.7 ms to the west. A station due north of the midpoint is equally distant from the sources."
    ],
    "sources": [
      "https://doi.org/10.1785/0120000006"
    ]
  },
  {
    "kind": "figure",
    "section": "10:00   /   Relative earthquake locations",
    "title": "Double differences sharpen the Hayward Fault section",
    "lead": "Waldhauser and Ellsworth used differential times to bring out narrow bands of seismicity on the northern Hayward Fault.",
    "notes": "The method paper analysed 346 earthquakes near Berkeley and El Cerrito. These panels use the same 16 event IDs from the author’s separate El Cerrito example, example1, which includes catalogue and waveform P and S differences. The x coordinate is distance along azimuth 325° with one origin and the same axis scale in both panels. Depth is positive down. The printed ranges are the maximum minus the minimum depths in the corresponding files. They describe the spread of the fitted hypocentres.",
    "image": "relative_hayward_pair.png",
    "body": [
      "In the published hypoDD example near El Cerrito, the same 16 earthquakes span 2.01 km in depth before relocation and 0.33 km afterward. Both sections use identical axes."
    ],
    "citation": [
      {
        "text": "Waldhauser & Ellsworth (2000). A double-difference earthquake location algorithm: Method and application to the northern Hayward Fault, California. BSSA 90, 1353–1368.",
        "url": "https://doi.org/10.1785/0120000006"
      },
      {
        "text": "Plotted data: Waldhauser, hypoDD example 1, El Cerrito catalogue and relocated coordinates.",
        "url": "https://github.com/fwaldhauser/HypoDD/tree/fb40407fb768cbdc23a11e27bc841f5d4a98abb7/examples/example1"
      }
    ],
    "sources": [
      "https://doi.org/10.1785/0120000006",
      "https://github.com/fwaldhauser/HypoDD/tree/fb40407fb768cbdc23a11e27bc841f5d4a98abb7/examples/example1",
      "https://doi.org/10.3133/ofr01113"
    ]
  },
  {
    "kind": "figure",
    "section": "10:00   /   Relative earthquake locations",
    "title": "Relocation reveals fault traces at Long Valley",
    "lead": "In the 1997 Long Valley caldera sequence, several narrow alignments appear in the relocated map.",
    "notes": "The original USGS figure compares joint hypocentre determinations at left with double-difference locations at right, for about 10,000 earthquakes in the Long Valley sequence. These are map views. The horizontal and vertical axes are distance in kilometres.",
    "image": "hypodd_long_valley.png",
    "body": [
      "The two panels cover the same area. The elongated band across the centre and its offshoots are easier to follow after relocation."
    ],
    "citation": [
      {
        "text": "Waldhauser (2001). hypoDD: A program to compute double-difference hypocenter locations. USGS Open-File Report 01-113, Fig. 1.",
        "url": "https://doi.org/10.3133/ofr01113"
      }
    ],
    "sources": [
      "https://doi.org/10.3133/ofr01113"
    ]
  },
  {
    "kind": "figure",
    "section": "10:00   /   Relative earthquake locations",
    "title": "GrowClust relocates groups of similar earthquakes",
    "lead": "GrowClust ranks event pairs by waveform similarity. It joins groups when their relative positions fit the measured differential times.",
    "notes": "The plot uses initial and relocated coordinates from the same 717 rows of the authors' Spanish Springs reference output for cluster 1. GrowClust builds a hierarchy by testing whether two candidate clusters can join while fitting their intercluster measurements. The method naturally emphasizes well-correlated pairs.",
    "image": "seminar_growclust.png",
    "body": [
      "The sections show the same 717 Spanish Springs earthquakes from one cluster in the authors’ example."
    ],
    "citation": [
      {
        "text": "Trugman & Shearer (2017). GrowClust: A hierarchical clustering algorithm for relative earthquake relocation, with application to the Spanish Springs and Sheldon, Nevada, earthquake sequences. SRL 88, 379–391.",
        "url": "https://doi.org/10.1785/0220160188"
      }
    ],
    "sources": [
      "https://doi.org/10.1785/0220160188",
      "https://github.com/dttrugman/GrowClust/blob/53226cf7662ab5bab5db87138d1ae63227d4ba63/EXAMPLE/OUT/out.growclust_cat"
    ]
  },
  {
    "kind": "table",
    "section": "10:00   /   Relative earthquake locations",
    "title": "How DDCorr measurements enter a relocation",
    "lead": "A differential time links two earthquake IDs at one station for one phase.",
    "notes": "DDCorr supplies the waveform-derived observations studied today. DDSync estimates one relative time per event within a connected group for a given station and phase. GraphSplit combines the synchronized observations with modelled travel times from multiple stations. The two papers below describe those separate methods. Their software repositories are listed in the references.",
    "rows": [
      [
        "Program",
        "Input",
        "Output"
      ],
      [
        "DDCorr",
        "Event-cut waveforms and phase times",
        "Differential times and weights"
      ],
      [
        "DDSync\nHeimisson & Yu (2026)",
        "Differential times for event pairs at one station and phase",
        "Consistent relative times and uncertainties"
      ],
      [
        "GraphSplit\nHeimisson (2026)",
        "Synchronized times, initial locations and a velocity model",
        "Relocated hypocentres and origin times"
      ]
    ],
    "citation": [
      {
        "text": "Heimisson & Yu (2026). DDSync: Graph-based denoising of differential travel-time observations with applications to pick reconstruction and path-difference tomography. Seismological Research Letters. doi:10.1785/0220260086",
        "url": "https://doi.org/10.1785/0220260086"
      },
      {
        "text": "Heimisson (2026). GraphSplit: Sparse double-difference earthquake relocation from synchronized differential-time graphs. ESS Open Archive, preprint. doi:10.22541/essoar.15009811/v1",
        "url": "https://doi.org/10.22541/essoar.15009811/v1"
      }
    ],
    "sources": [
      "https://doi.org/10.1785/0220260086",
      "https://doi.org/10.22541/essoar.15009811/v1",
      "https://github.com/eliasrh/DDSync",
      "https://github.com/eliasrh/GraphSplit.jl"
    ]
  },
  {
    "kind": "figure",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "Two P waveforms at the same station",
    "lead": "These are two earthquakes recorded on the vertical component at Z7.KVER. Zero on each trace is its predicted P arrival.",
    "notes": "The phase marker is a stored time used to centre the analysis window. These Iceland data use predicted arrivals. On an archive with manual picks, the marker can instead be an observed pick. The two records were bandpass filtered at 2–14 Hz, resampled at 50 Hz, and scaled separately for display. The analysis window extends from −0.5 to +2.0 s relative to the marker. Event 1 is S1_009900 and event 2 is S1_009901.",
    "image": "relative_kver_waveforms.png",
    "body": [
      "The large pulse arrives later relative to its P marker in event 2. Cross-correlation measures the shift using the whole P window."
    ],
    "sources": [
      "https://doi.org/10.1029/2018JB016010",
      "https://doi.org/10.7914/SN/Z7_2010"
    ]
  },
  {
    "kind": "equation",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "The correlation coefficient at a given lag",
    "lead": "For positive k, compare each sample from event 1 with the sample k positions later in event 2. The correlation coefficient measures their similarity after each window’s mean is removed.",
    "notes": "This is the usual normalized, mean-subtracted discrete cross-correlation, the Pearson correlation at lag k. A positive k compares fixed samples in event 1 with later samples in event 2. The numerator adds the products of the paired samples. The denominator scales by the two window energies. For constant windows the coefficient is undefined. DDCorr also computes the reverse ordering and averages the two coefficients at matching physical lags. The later processing section shows the two finite-window calculations.",
    "equation": "r(k) = Σₙ uₙ vₙ(k) / [√(Σₙ uₙ²) · √(Σₙ vₙ(k)²)]",
    "fraction": {
      "lhs": "r(k) =",
      "numerator": "Σₙ uₙ vₙ(k)",
      "denominator": "√(Σₙ uₙ²) · √(Σₙ vₙ(k)²)"
    },
    "body": [
      "uₙ and vₙ(k) are the two mean-subtracted amplitudes at sample n. The sums run over the N samples in the window. Aligned crests and troughs both contribute positive products to the numerator.",
      "The denominator removes the effect of amplitude scale. Identical shapes give r = +1, and identical shapes with opposite polarity give r = −1."
    ],
    "sources": [
      "https://doi.org/10.1785/0120020238"
    ]
  },
  {
    "kind": "figure",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "The peak gives the lag and the coefficient",
    "lead": "At Z7.KVER, the highest coefficient is 0.800 at the +20 ms sample. Fitting the peak between samples gives a lag of +20.2 ms.",
    "notes": "The plotted curve is the symmetric correlation of the two KVER P windows over ±0.5 s. The discrete peak is 0.7998529. DDCorr reports the sampled coefficient and refines the lag by fitting a parabola through the peak and its two neighbours. The full correlation row stores both results.",
    "image": "relative_kver_correlation.png",
    "body": [
      "A positive lag means event 2’s P waveform arrives later than event 1’s on the marker-centred time axes."
    ]
  },
  {
    "kind": "figure",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "Applying the measured lag to the waveforms",
    "lead": "The upper panel uses the two P markers as supplied. In the lower panel, event 2 has been shifted 20.2 ms earlier.",
    "notes": "The two panels show the same portion of the two KVER records. Applying the measured lag shifts the second trace left for visual comparison. The display interpolates the plotted waveform on the common time grid. The estimated lag itself came from the correlation peak.",
    "image": "seminar_kver_alignment.png",
    "body": [
      "The main crest and the trough that follows now line up. Smaller differences in amplitude and shape remain."
    ]
  },
  {
    "kind": "figure",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "Waveforms can resolve a fraction of a sample",
    "lead": "For Iceland events 28 and 45 at STAM, the S correlation is sampled every 20 ms. Its maximum lies at the zero-lag sample. The neighbouring points place the fitted peak 3.9 ms earlier.",
    "notes": "The plotted S measurement uses events 28 and 45 in Iceland. Poupinet et al. used a frequency-domain method on California doublets. Their published precision refers to those measurements. An interpolated peak gives a finer lag estimate than a grid search. Its uncertainty also depends on waveform similarity, bandwidth and noise.",
    "image": "field_peak.png",
    "body": [
      "Poupinet, Ellsworth and Fréchet (1984) compared waveforms from two California earthquakes and reported timing resolution of about one-tenth of the sampling interval."
    ],
    "citation": [
      {
        "text": "Poupinet, Ellsworth & Fréchet (1984). Monitoring velocity variations in the crust using earthquake doublets: An application to the Calaveras Fault, California. JGR 89, 5719–5731.",
        "url": "https://doi.org/10.1029/JB089iB07p05719"
      }
    ],
    "sources": [
      "https://doi.org/10.1029/JB089iB07p05719"
    ]
  },
  {
    "kind": "figure",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "Repeated cycles can produce several plausible lags",
    "lead": "On the 4–8 Hz vertical records from KVER, earthquakes 13 and 27 align almost equally well at +40 and +200 ms. The second alignment pairs one wave cycle with a different cycle.",
    "notes": "The two local maxima are 0.82005 and 0.81762. The example was recalculated from the real event cuts in a narrower band. Later slides show the same pair with the usual 2–14 Hz P filter.",
    "image": "iceland_competing_lags.png",
    "body": [
      "The two coefficients differ by only 0.0024. Keeping just the highest coefficient would conceal the ambiguity in the measured delay."
    ]
  },
  {
    "kind": "story",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "Waveform timing compared with catalogue picks",
    "lead": "Schaff et al. (2004) compared travel-time differences from waveforms and catalogue picks for 243 earthquakes on the Calaveras Fault.",
    "notes": "The authors estimated the relative precision of two data types for a closely spaced California sequence. They reported useful waveform-derived timings at coefficients as low as roughly 0.7 for this case. The full bibliographic reference and DOI are printed on this slide.",
    "body": [
      "In that sequence, waveform timing improved on picks even for some pairs with correlations near 0.70 and separations up to about 2 km.",
      "The value 0.70 came from their comparison against local catalogue data. Other networks and frequency bands require their own evaluation."
    ],
    "citation": [
      {
        "text": "Schaff, D. P., Bokelmann, G. H. R., Ellsworth, W. L., Zanzerkia, E., Waldhauser, F., & Beroza, G. C. (2004). Optimizing correlation techniques for improved earthquake location. Bulletin of the Seismological Society of America 94(2), 705–721. doi:10.1785/0120020238",
        "url": "https://doi.org/10.1785/0120020238"
      }
    ],
    "sources": [
      "https://doi.org/10.1785/0120020238"
    ]
  },
  {
    "kind": "equation",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "From the waveform lag to differential travel time",
    "lead": "Let m₁ and m₂ be the P marker times measured from their own earthquake origins. Their difference is the initial estimate of the travel-time difference.",
    "notes": "If p is the stored phase-marker time and O the origin, m=p−O on the same clock. Let ε denote the time of a corresponding waveform feature relative to its marker. The lag is ε₂−ε₁. The difference of the two origin-referenced arrivals is (m₁+ε₁)−(m₂+ε₂)=m₁−m₂−ℓ. The original time separation of the earthquakes does not enter this travel-time difference.",
    "equation": "d₁₂ = (m₁ − m₂) − ℓ",
    "body": [
      "ℓ is the waveform lag in seconds, positive when event 2 is later on the marker-centred axes. Subtracting ℓ corrects the marker difference.",
      "The resulting d₁₂ is the estimated P travel time of event 1 minus that of event 2 at this station."
    ]
  },
  {
    "kind": "code",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "The KVER P measurement in dt.cc",
    "lead": "At KVER, the P markers fall 2.7461 s and 2.7294 s after the two origins. Subtract the measured +0.0202 s lag from their +0.0167 s difference.",
    "notes": "The printed precision of the accepted row is four decimals for differential time and six for its weight. The input origins differed by 54.98 s in absolute UTC. The P travel times are compared after subtracting those origins. The calculation is (2.7461−2.7294)−0.0202=−0.0035 s. An output pair header may have more station or phase rows below it, sharing the same two IDs.",
    "command": "# 1 2 0.0\nZ7.KVER  -0.0035  0.639765  P",
    "codeLabel": "ICELAND100  /  dt.cc",
    "body": [
      "The P travel time to KVER is 0.0035 s shorter for event 1. The header gives the event IDs in subtraction order.",
      "The station row gives the station, differential time in seconds, weight and phase. This run uses r² as the weight."
    ]
  },
  {
    "kind": "figure",
    "section": "11:05   /   Waveform cross-correlation",
    "title": "Two estimates of the P-time difference for events 1 and 5",
    "lead": "At station Z7.DYSA, each arrow joins two earthquakes and gives their P travel-time difference in milliseconds (tail minus head).",
    "notes": "All three edges are actual Z7.DYSA P measurements in the supplied dt.cc, converted from seconds to milliseconds. Adding d₁₃ to d₃₅ eliminates the event 3 term, so it should equal d₁₅ if the observations are consistent. A discrepancy measures inconsistency in this loop and cannot by itself identify which edge contains the error. The practical now begins with the SAC files and the DDCorr report.",
    "image": "relative_dysa_triangle.png",
    "body": [
      "From 1 to 5 through 3, the measured difference is +93.9 − 61.6 = +32.3 ms. The direct measurement is +30.5 ms.",
      "The two estimates differ by 1.8 ms. DDSync fits times to all the connected pairs at this station and phase."
    ],
    "sources": [
      "https://doi.org/10.1785/0220260086"
    ]
  },
  {
    "section": "12:00   /   Guided DDCorr lab",
    "title": "Open Start Here and follow the DDCorr lab",
    "kind": "handoff",
    "notes": "Keep this slide on screen throughout the guided lab. The synthetic run introduces the command and the event-folder layout. The figures will all be taught with the real Iceland recordings. The Iceland reference report provides a local fallback.",
    "lead": "Open docs/START_HERE.html in the extracted code folder, or follow the GitHub link below. Each DDCorr run takes its settings from a plain-text TOML file.",
    "body": [
      "Generate the small synthetic example and run DDCorr once.",
      "Run the supplied Iceland100 data and open its report.html.",
      "At 14:05, return to slide 25 with the Iceland report open."
    ],
    "link": {
      "text": "Open the Start Here lab on GitHub",
      "url": "https://github.com/eliasrh/DDCorr.jl/blob/main/docs/START_HERE.md"
    }
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "How the run TOML controls DDCorr",
    "kind": "code",
    "notes": "Project.toml lists Julia dependencies. The TOML named after the DDCorr command selects the SAC inputs, outputs and scientific settings. Paths are relative to that run file. The distributed synthetic run reads examples/synthetic/sac and writes under results in the code folder. The Iceland file reads its neighbouring sac directory and writes to Iceland100/results. The order-6 snippet illustrates an optional override. The published Iceland reference used order 4 for both phases. Keep the package defaults in src/advanced.toml and specify changes per run. A [P] filter_order entry overrides the installed default for P. [S] controls S independently. Section names and inheritance in DDSync and GraphSplit are program-specific.",
    "lead": "The filename after bin/ddcorr.jl selects the run settings. A heading such as [P] applies to the lines beneath it. The Iceland run reads ../Iceland100/DDCorr.toml.",
    "codeLabel": "Example changes in a run TOML",
    "command": "[input]\nsac_dir = \"sac\"\n\n[P]\nfilter_order = 6",
    "body": [
      "Add filter_order to the existing [P] section. This changes P from order 4 to 6. S keeps its default. Open effective_config.toml in the results folder to see what DDCorr used.",
      "DDSync and GraphSplit also read plain-text run settings. The Saturday examples use sync.toml and DD.toml."
    ]
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "The Iceland report opens with a count of events and measurements",
    "image": "report_iceland_header.png",
    "lead": "The four boxes summarise 100 earthquake folders. An observation is one accepted measurement for an event pair at one station and phase.",
    "body": [
      "Four events have no accepted partner. They keep their IDs in catalog.txt. The report links to event_id_map.csv for the original folder names."
    ],
    "notes": "This is the actual header of Iceland100/reference/report.html. The 2,412 P plus 4,625 S observations give 7,037 station–phase measurements, distributed across 1,914 distinct event pairs. All the figures that follow use the same field run."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "The Iceland SAC header contains the phase times",
    "kind": "figure",
    "notes": "In Start Here, the header command for this exact file is julia --project=. bin/sac_info.jl ../Iceland100/sac/S1_009992/Z7.DYSA..HHZ.sac. The SAC reference instant coincides with the catalogue origin in this archive (O = 0). The S prediction can be stored in the header of a vertical trace; DDCorr normally measures S on the horizontal components. Source of the catalogue: Ágústsdóttir et al. (2019), Data Set S1. The SAC generator added straight-line predictions at 6.0 and 3.5 km/s. The figure shows the original raw samples.",
    "lead": "This vertical recording belongs to event S1_009992 at station Z7.DYSA.",
    "body": [
      "The numeric SAC fields A and T0 contain the two times marked on the trace. Their labels P_pred and S_pred indicate predicted arrivals. DDCorr centres the P window on A here."
    ],
    "image": "lab_iceland_sac_markers.png",
    "sources": [
      "https://doi.org/10.1029/2018JB016010"
    ]
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "The settings connect the SAC headers to the waveforms",
    "kind": "table",
    "notes": "Use the Iceland settings file that participants ran, not the repository’s top-level synthetic TOML. The 0.5 s lag is a correction around the two independently marked windows. DDCorr applies additional checks, including competing peaks and peaks at the boundary, before writing a measurement.",
    "lead": "These entries in Iceland100/DDCorr.toml determine what DDCorr compares.",
    "rows": [
      [
        "Setting",
        "Iceland example",
        "How DDCorr uses it"
      ],
      [
        "P and S header fields",
        "a and t0",
        "Read the time around which each phase is expected."
      ],
      [
        "P and S bands",
        "2–14 Hz",
        "Filter both recordings in the pair over the same frequencies."
      ],
      [
        "P window",
        "−0.5 to +2.0 s",
        "Compare the vertical records around their P times."
      ],
      [
        "S window",
        "−0.5 to +3.0 s",
        "Compare available horizontal records around their S times."
      ],
      [
        "Lag and coefficient limits",
        "±0.50 s and r ≥ 0.70",
        "Search this lag interval and require the peak to reach the threshold."
      ]
    ]
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "The distribution of all measured peak coefficients",
    "image": "report_candidate_peaks.png",
    "lead": "In “Quality and connectivity”, the upper-left panel counts the highest sampled coefficient from each station–phase comparison that produced a correlation curve.",
    "body": [
      "Blue is P and orange is S. Both acceptance thresholds are 0.70, so the dashed lines coincide. Most measured peaks fall below that value in this run."
    ],
    "notes": "Each step covers a bin of width 0.05 in signed r. The vertical scale is the number of candidate event pairs summed over stations within each phase. A station–phase candidate that lacks shared usable components produces no coefficient and cannot appear. Moving the threshold would alter the retained fraction. This figure alone cannot identify genuine arrivals."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "The coefficients retained in the measurement file",
    "image": "report_accepted_peaks.png",
    "lead": "The upper-right panel of the same figure counts only rows written to correlations.csv. The horizontal axis is the signed coefficient for each accepted peak.",
    "body": [
      "The blue P and orange S bars start at 0.70. A tall bin near the cutoff contains many marginal matches. Opening a waveform example shows which part of the phase aligned."
    ],
    "notes": "P and S histograms overlay, with partially transparent colours. The bin width is 0.025 rather than the 0.05 used in the all-measured plot. Compare ranges and shapes; the different bin widths and vertical scales make bar heights across the two panels unsuitable for a direct rejection count. Group decisions provides the exact count."
  },
  {
    "kind": "figure",
    "title": "A higher P threshold removes links at every station",
    "image": "iceland_p_threshold.png",
    "lead": "Each dot counts the accepted P measurements at one Iceland station. Raising the minimum coefficient from 0.70 to 0.90 reduces the total from 2,412 to 233.",
    "body": [
      "At 0.70, 94 earthquakes have a P link to another event. At 0.90, only 49 do. The higher threshold costs station coverage as well as observations."
    ],
    "notes": "These counts are obtained by applying a stricter P coefficient cutoff to the accepted Iceland rows. Other acceptance settings and the S observations are held fixed. A high threshold alone does not establish the accuracy of a time shift.",
    "section": "14:05   /   Reading the Iceland report"
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "Station coverage in the Iceland report",
    "kind": "figure",
    "notes": "The station labels in the figure are those from Network Z7. Eleven stations supplied records. The run summary contains 1,914 distinct pairs and four isolated events. P and S have separate windows and component requirements. The figure crops the “Accepted observations by station” panel directly from summary.png.",
    "lead": "The report counts 2,412 accepted P observations and 4,625 accepted S observations from 100 earthquake folders.",
    "body": [
      "The bars in “Quality and connectivity” divide those observations by station. A pair recorded at several stations can contribute to several bars."
    ],
    "image": "lab_iceland_report_coverage.png"
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "How many other earthquakes did each one match?",
    "image": "report_degree.png",
    "lead": "Two earthquakes count as partners when DDCorr accepts a match at any station. The horizontal axis counts partners per earthquake. The vertical axis counts earthquakes.",
    "body": [
      "The bars add up to 100 earthquakes. Four have zero partners. The other 96 form one connected group. Event 13, in the far-right bar, matched 81 others."
    ],
    "notes": "Degree is an event property. The vertical axis counts events within each degree bin. The report header lists connected-component sizes 96, 1, 1, 1, 1. A component contains events linked by a path of accepted pairs; some events in a component may have no direct link to each other. event_connectivity.csv identifies each event and its degree. High degree alone says nothing about the number or azimuths of stations measuring those links."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "Why prepared event pairs were rejected",
    "image": "report_outcomes.png",
    "lead": "The lower-right panel totals the outcomes of station–phase comparisons after individual waveforms have passed preparation.",
    "body": [
      "Here 50,361 comparisons fell below the coefficient threshold, 893 peaked at the search boundary, and 124 lacked enough common components. Another 7,037 were accepted."
    ],
    "notes": "Each comparison receives one outcome. Candidate plots and outcome counts need not contain the same number, because some tested pairs never produce a correlation curve. group_summary.csv breaks these counts down by station and phase. The preceding trace exclusions, including weak filtered signals, are in preprocessing_issues.csv."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "Why is there an S measurement at DYSA but no P?",
    "kind": "table",
    "notes": "In this run, Z7.DYSA, events 1/2, S has dt_s = 0.0048 s and lag_B_later_s = −0.0897 s. The P input passed the header/window test, then fell below the minimum filtered RMS signal-to-noise ratio. The loss of a P observation affects that phase at that station. If a group has no accepted pairs after thresholding, group_summary.csv records its aggregate rejection reasons.",
    "lead": "“Ready” means the SAC header gives an arrival time and the trace covers the signal and noise windows. DDCorr then checks whether the filtered signal stands out from the background.",
    "rows": [
      [
        "File",
        "What it tells you",
        "Events 1 and 2 at DYSA"
      ],
      [
        "phase_readiness.csv",
        "Is there a marker and enough recording around it?",
        "Event 2’s vertical trace covers its predicted P and the pre-P noise window."
      ],
      [
        "preprocessing_issues.csv",
        "Why did DDCorr skip a particular trace?",
        "Event 2’s P signal was 1.43 times the background. The cutoff was 1.50."
      ],
      [
        "correlations.csv",
        "Which pairs matched, and by how much?",
        "Both S components matched. Event 1’s S travel time was 4.8 ms longer."
      ]
    ]
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "Aligning the two DYSA P waveforms",
    "kind": "figure",
    "notes": "The two folders are S1_009992 and S1_009996. The shared component is Z7.DYSA..HHZ. Use the expanded example_01_Z7.DYSA_P in the report, or open the PNG of that name directly. The automatic gallery includes accepted examples from different parts of the coefficient distribution.",
    "lead": "The first figure under “Accepted pair examples” shows events 93 and 97 at station Z7.DYSA.",
    "body": [
      "The orange P pulse arrives later than the blue one on the marker-centred axes. Moving it 0.0586 s earlier aligns the strongest positive peak. The later oscillations agree less closely."
    ],
    "image": "lab_iceland_report_alignment.png"
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "Measuring the DYSA P lag from the peak",
    "kind": "figure",
    "notes": "The bottom panel comes from the same Z7.DYSA P figure. The program retains the coefficient measured at the highest sampled value and uses the parabola to refine its lag. The title rounds the coefficient to 0.7. A positive lag means event 97 lies later on its P-marker-centred axis.",
    "lead": "Each point on the curve gives the correlation coefficient for a possible shift between the two traces.",
    "body": [
      "The highest sampled coefficient is 0.70003 at +0.060 s. DDCorr fits a parabola through that sample and its two neighbours. The red line marks the fitted lag, +0.0586 s."
    ],
    "image": "lab_iceland_report_lag.png"
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "Reading the DYSA P measurement in correlations.csv",
    "kind": "table",
    "notes": "The column called lag_B_later_s uses B for the second event, j. The measured correction acts on waveform positions relative to each event’s own marker. The differential travel time also accounts for the two marker-minus-origin times. The CSV stores more decimal places for the coefficient and its weight. One observation qualifies across the whole network for this particular pair.",
    "lead": "The “Correlation audit” link opens correlations.csv. The Z7.DYSA P row for events 93 and 97 contains these values.",
    "rows": [
      [
        "CSV column",
        "Value",
        "Meaning"
      ],
      [
        "cc_signed",
        "0.70003",
        "Highest sampled correlation coefficient."
      ],
      [
        "lag_B_later_s",
        "+0.0586 s",
        "The matching feature in event 97 is later relative to its own P mark."
      ],
      [
        "dt_s",
        "+0.2972 s",
        "Estimated P travel time for event 93 minus that for event 97."
      ],
      [
        "weight",
        "0.490046",
        "r², the dimensionless similarity weight written to dt.cc."
      ]
    ],
    "body": [
      "The P markers occur 3.9916 s and 3.6358 s after the two origins. Their difference is +0.3558 s. Subtracting the fitted lag of +0.0586 s gives the exported +0.2972 s."
    ]
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "How the DYSA measurement is written in dt.cc",
    "kind": "code",
    "notes": "The third header value is the origin-time correction field, 0.0 in this export. The programme writes one station–phase row per accepted measurement. This example happens to have one row under its header. Other pairs can have many.",
    "lead": "The “Files and conventions” section of report.html links directly to dt.cc. These are the two lines for the same pair.",
    "body": [
      "The header names events 93 and 97. The observation gives station, differential travel time in seconds, weight and phase.",
      "event_id_map.csv links 93 to S1_009992 and 97 to S1_009996, the folders containing the original recordings."
    ],
    "command": "# 93 97 0.0\nZ7.DYSA       0.2972 0.490046 P",
    "codeLabel": "dt.cc"
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "Why events 85 and 86 look nearly identical at STAM",
    "image": "report_s_alignment.png",
    "lead": "At STAM, the S waves for events 85 and 86 have r = 0.9967. DDCorr flags this station and phase because r exceeds 0.99.",
    "body": [
      "The plot shows the east component. DDCorr averaged both horizontal correlation curves. Shifting event 86 to the right by 0.3416 s aligns the pulses.",
      "Three of seven observations reach 0.99. The other four have r between 0.904 and 0.960. In dt.cc the STAM weight is r² = 0.9933."
    ],
    "notes": "Event 85 is S1_009984 and event 86 is S1_009985. Under Accepted pair examples, open example_11_Z7.STAM_S. The orange record is aligned to the blue record by shifting it later because the measured lag on the two marker-centred axes is −0.3416 s. The reported coefficient is the sampled peak of the mean HHE/HHN curve. In correlations.csv, accepted signed coefficients are DYSA P 0.9240, FLUR S 0.9041, KATT S 0.9547, KVER S 0.9601, NOHR S 0.9947, RODG S 0.9924 and STAM S 0.9967. The last three meet the 0.99 threshold. The third field on an observation line in dt.cc is the configured weight, here r squared. STAM S therefore has weight 0.993349. Compare coefficients in correlations.csv."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "Do the two event cuts contain the same arrival?",
    "image": "iceland_pair_85_86.png",
    "lead": "Both cuts contain exactly the same 9,455 overlapping raw samples on each of 33 channels. At STAM the predicted S times differ by 0.3421 s on the UTC clock. The dashed lines show where each comparison window was centred.",
    "body": [
      "The origins are 0.4600 s apart. All seven travel-time differences are 0.4591–0.4612 s, placing the matched features within 1.2 ms on the clock. Look for a second P and S onset at several stations before merging the catalogue entries."
    ],
    "notes": "Left: STAM east, S window. Right: DYSA vertical, P window. Each pair of traces is vertically separated for display and has a common amplitude scale within that panel. The two source cuts are about 95 s long at 100 Hz. Their beginnings differ by 46 samples, leaving 9,455 equal raw values on every shared channel (11 stations, 3 components). Overlap is expected for cuts from the same continuous stream, including when two real events are close together. The header markers are predicted P_pred and S_pred, rather than an independent set of manual picks. The STAM predicted S offset of +0.3421 s contrasts with the fitted marker-relative lag of −0.3416 s; the resulting matched feature times differ by about 0.0005 s on UTC. To obtain arrival_j − arrival_i on UTC, subtract dt(i,j) from origin_j − origin_i. All seven accepted rows align shared energy within 1.2 ms. Different pick-centred windows, sample-grid offsets and the discrete lag grid allow r below one even when original samples coincide. Inspect the onsets, particle motion and moveout on multiple components and stations. Repeated detection of one pulse and a second nearby event hidden in the overlapping record remain possibilities. No phase misassociation or duplicate catalogue entry has been established by this check. See pair_85_86.py and the Iceland100 SAC files."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "The station matrix shows which events are linked",
    "kind": "figure",
    "notes": "The image is the signed-coefficient panel of matrices/group_0001_Z7.DYSA_P.png. The two other panels display the signed differential time and lag. To find a measurement in correlations.csv, use the smaller ID first. The sparse matrix file named by matrices/index.csv lists those same accepted pairs for one station and phase.",
    "lead": "Under “Station/phase matrices (PNG)”, open Z7.DYSA P. Each axis gives the integer event ID.",
    "body": [
      "The coloured cells show the pairs with an accepted P observation. Grey areas show gaps in coverage. To look up an exact pair, use correlations.csv with the smaller ID first."
    ],
    "image": "lab_iceland_report_matrix.png"
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "The differential-time matrix changes sign across the diagonal",
    "image": "report_matrix_dt.png",
    "lead": "In the middle matrix at Z7.DYSA P, the colour is the travel time of row event i minus that of column event j, in seconds.",
    "body": [
      "In row 93, column 97 the value is +0.2972 s. The reflected entry is −0.2972 s. Grey cells have no accepted differential time."
    ],
    "notes": "The centre of the colour bar denotes zero; red is positive and blue negative. Each station–phase matrix sets its own symmetric colour scale from its retained values. A stripe can identify an event systematically earlier or later than several partners, but also depends on the catalogue origin and available partners. The sparse matrix file, linked via matrices/index.csv, gives the exact numbers once per pair."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "The residual-lag matrix shows the marker correction",
    "image": "report_matrix_lag.png",
    "lead": "The right-hand matrix at Z7.DYSA P shows the fitted lag in seconds, measured on the two phase-marker-centred time axes.",
    "body": [
      "For row 93 and column 97, +0.0586 s means event 97’s matching pulse is later relative to its own marker. A row of similar signs can point to a systematically early or late marker."
    ],
    "notes": "Use the right-hand colour bar for lag; its scale differs from the differential-time panel. Reversing the event order reverses the sign. A pattern can also arise from waveform changes, systematic phase confusion or the event pairs available here. Inspect representative waveforms and header labels before changing any markers."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "The lag histogram summarises the accepted shifts",
    "kind": "figure",
    "notes": "This is the “Accepted residual lags after pick alignment” panel of summary.png. Counts refer to station–phase observations. Peaks rejected at the lag boundary do not enter this histogram. The group decisions table records those rejections.",
    "lead": "In “Quality and connectivity”, the horizontal axis shows how far the second event’s waveform lies from alignment after the phase marks are set to zero.",
    "body": [
      "Most accepted shifts cluster near zero. The 0.0586 s P shift at DYSA contributes to a blue bin to the right of zero."
    ],
    "image": "lab_iceland_report_lags.png"
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "Cycle consistency of the P and S times",
    "image": "report_closure.png",
    "lead": "For three events at one station and phase, add dt(i,j) and dt(j,k), then subtract dt(i,k). The result is the timing disagreement around that triangle, in seconds.",
    "body": [
      "The left panel pools P triangles and the right pools S triangles. Both distributions concentrate near zero. A broad tail identifies groups of measurements whose times disagree."
    ],
    "notes": "Each entry is a triangle of three accepted edges within one station and phase. The plot pools such triangles across the stations. A single triangle mismatch does not identify which edge is responsible. Errors shared by all edges connected to one event can cancel in the sum; closure measures consistency rather than independent timing accuracy. The plot covers ±0.5 s and its title reports sampled counts outside the view. Set [plots] closure = true to include it."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "table",
    "title": "Reading timing differences smaller than the closure-plot bins",
    "lead": "The linked closure table gives the 90th percentile of the absolute discrepancy separately for each station and phase.",
    "rows": [
      [
        "Station and phase",
        "Triangles",
        "90% had |discrepancy| at or below"
      ],
      [
        "DYSA P",
        "8,424",
        "1.48 ms"
      ],
      [
        "DYSA S",
        "7,146",
        "1.97 ms"
      ],
      [
        "KVER P",
        "2,187",
        "2.35 ms"
      ],
      [
        "TOHR S",
        "3,475",
        "4.09 ms"
      ]
    ],
    "notes": "The plot’s histogram bins are 0.01 s wide. Read triangle_closure_summary.csv when differences of a few milliseconds collapse into the central bins. The table also records median absolute discrepancy and the fraction larger than 0.1 s. A row with few triangles provides little evidence about the full distribution. The maximum sample size is set per station and phase in the advanced settings."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "The frequency response of the Iceland filters",
    "image": "report_filter_gains.png",
    "lead": "In the upper panels of “Filter audit”, frequency is in hertz and amplitude gain is the fraction of a sinusoid’s amplitude that survives filtering.",
    "body": [
      "The P and S bands both span 2–14 Hz here. Gain is close to one inside the band and 0.5 at each corner. The dots show the measured gain of test tones passed through the same filter."
    ],
    "notes": "The lines show the theoretical forward-and-reverse response at the original 100 Hz sampling rate of these traces. Applying the filter twice squares its single-pass amplitude gain. A final gain of 0.5 is approximately −6 dB. The tests in these panels characterize the filter used on the field recordings; the lower panels show the field data themselves. filter_tone_audit.csv gives exact expected and measured tone gains."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "figure",
    "title": "Which recordings appear in the filter spectra?",
    "image": "report_field_spectra.png",
    "lead": "Grey shows the raw spectrum and colour shows the filtered spectrum. These are TOHR events S1_009943 for P and S1_009910 for S. DDCorr uses the first event in the last eligible example for each phase.",
    "body": [
      "To choose a trace, set one accepted event_pairs entry, one example_stations entry and one example_phases entry under [plots]. The filter spectra and waveform gallery share these settings."
    ],
    "notes": "Selection is deterministic. Groups are ordered by station and phase. With automatic selection, the last eligible example in the last eligible group for a phase is used, before max_examples limits the gallery. With explicit pairs the same rule applies to the eligible requested list. DDCorr takes event i and the first shared component for the spectrum. The current interface has no independent arbitrary trace selector for this figure. To see STAM event 85 alone in the S spectrum, specify event_pairs = [[85,86]], example_stations = [\"Z7.STAM\"], example_phases = [\"S\"]. If a phase has no eligible example, its waveform panel is empty. Spectra are power per unit frequency with both curves referred to the raw spectrum’s maximum. Filter_tone_audit.csv contains the separate calibration-tone check."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "Checking a second near-identity flag on the UTC clock",
    "kind": "figure",
    "notes": "The report links to near_identity.csv near the top. Its reference run has 22 flagged station-phase rows across six pairs. For this row select event_i=44, event_j=45, station=Z7.RODG, phase=S. Under “Accepted pair examples”, example_09_Z7.RODG_S expands the DDCorr alignment relative to phase markers. The slide’s UTC comparison is a separate plot made from the source SAC records. The raw cuts start six samples apart at 100 Hz. Both catalogue IDs stay in the export. Independent onsets and observations at other stations are needed to decide whether the catalogue itself contains a duplicate. As for events 85 and 86, a near-identity flag refers to one station/phase measurement. Look at the full set of matches and independent onsets before changing the event catalogue.",
    "lead": "In the Iceland report, “Near-identical arrival flags” opens a table of 22 observations. The Z7.RODG S row for events 44 and 45 has r = 0.99982.",
    "body": [
      "The waveform example is example_09_Z7.RODG_S. The plot here places the two original east-component cuts on one UTC clock. Their 9,495 overlapping samples are identical."
    ],
    "image": "lab_duplicate_utc.png"
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "kind": "table",
    "title": "Selecting report figures in your run TOML",
    "lead": "In the run TOML, [plots] controls the report. [matrices] controls the per-station exports. For the override rules and a P-filter example, see slide 25.",
    "rows": [
      [
        "Setting in the run TOML",
        "What appears in the report"
      ],
      [
        "[plots] summary, closure, filters",
        "Counts and histograms, timing around event triangles, and the filter audit."
      ],
      [
        "[plots] examples, max_examples",
        "Waveform overlays and lag curves. max_examples caps the automatic gallery."
      ],
      [
        "[plots] event_pairs, example_stations, example_phases",
        "Select one accepted pair, station and phase to see that waveform example and its first event in the filter spectrum."
      ],
      [
        "[matrices] enabled, plots",
        "Per-station coefficient, differential-time and lag heatmaps."
      ]
    ],
    "notes": "The parent [plots] enabled switch requests report generation. The Iceland configuration enables each of the sections shown. [matrices] dense controls optional dense CSV exports separately. Empty event_pairs uses automatic selection from the weak, middle and strong accepted examples of each station and phase. Set explicit pairs and limit stations/phases if a specific illustration is needed. example_selection.csv records the actual IDs and filenames."
  },
  {
    "section": "14:05   /   Reading the Iceland report",
    "title": "Files to keep for relocation",
    "kind": "table",
    "notes": "Keep report.html together with its figures and linked files by saving the whole run folder. effective_config.toml records the settings that produced it. The correlation work ends with this measurement set. Allow time for questions about students’ input conventions and output files.",
    "lead": "Use the four files from a single completed correlation run. They share the same sequence of event IDs and station names.",
    "rows": [
      [
        "File",
        "Contents"
      ],
      [
        "dt.cc",
        "Differential travel times and weights, grouped by event pair."
      ],
      [
        "catalog.txt",
        "Origin time, starting hypocentre and sequential ID for each event."
      ],
      [
        "stations.txt",
        "Station identifiers, geographic coordinates and elevation."
      ],
      [
        "event_id_map.csv",
        "Correspondence between the integer IDs and the original event folders."
      ]
    ]
  },
  {
    "kind": "figure",
    "title": "The P waveform used for correlation",
    "image": "method_raw_filtered.png",
    "lead": "The vertical recording at KVER contains a P arrival superimposed on slower motion.",
    "body": [
      "Both panels show the same three seconds of event 1, with amplitude in thousands of instrument counts. The dashed line marks its predicted P arrival. DDCorr filters the whole SAC trace before cutting the short window used for correlation."
    ],
    "notes": "This is Z7.KVER..HHZ for event 1 in the Iceland catalogue. The horizontal coordinate is relative to the predicted P marker in SAC A. Both panels use the same recorded samples and amplitude units. Removing an offset and linear trend precedes the taper and the 2–14 Hz filter. A nearby event is processed in the same way before the two windows are compared. The Iceland configuration uses a vertical channel for P and horizontal channels for S.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L26-L36"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Why taper the ends of a SAC trace?",
    "image": "method_taper.png",
    "lead": "A short SAC file can start halfway through an oscillation. The abrupt start can produce an artificial oscillation when the signal is filtered.",
    "body": [
      "DDCorr removes the mean and the fitted linear trend. It then reduces the amplitude smoothly over the first and last 2% of this cut. The middle of the trace keeps its amplitude."
    ],
    "notes": "The left panel zooms into the original beginning of the KVER cut, far from the P wave. The right panel shows the weight that multiplies each sample. The weight follows a half cosine from near zero at the first sample to one in the interior. The same operation is applied in reverse at the other end. Real data must extend past the analysis and noise windows by the configured filter margin, 5 s in this example. This helps keep filter transients outside the measured window.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L1-L16"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Which frequencies survive the P bandpass?",
    "lead": "This spectrum uses the KVER vertical recording from 0.5 s before to 3 s after the P marker. The shaded band extends from 2 to 14 Hz.",
    "body": [
      "At frequencies where the curves lie together, both versions of the waveform contain similar amplitudes. The green curve falls below the original spectrum outside the band. Those oscillations contribute less to the correlation."
    ],
    "notes": "Both spectra come from the same samples of event 1. The dark line uses the detrended, tapered recording before the bandpass. The green line uses the entire-cut bandpassed waveform sampled over the same interval. Each ordinate is the square root of a Welch power spectral density, in counts per square root of hertz. Windowing a short signal causes spectral leakage, so this measured spectral ratio need not reproduce the mathematical response exactly at each frequency. The next slide shows the filter response itself. filter_audit.png in the completed report provides analogous spectra for the example recordings selected in that run.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L19-L36"
    ],
    "image": "method_kver_spectrum.png",
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Why filter in both time directions?",
    "lead": "One pass can shift a wave crest in time. Filtering the reversed record a second time cancels the filter’s phase shift in the interior of the trace.",
    "body": [
      "The left panel shows how much each frequency is attenuated. The right panel shows how the actual KVER P wave looks after one pass and after both passes. The amplitudes change because each frequency has passed through the filter twice."
    ],
    "notes": "The left panel is the calculated response of the fourth-order Butterworth filter used at KVER. At each pass a sinusoid is scaled by |H(f)|. In the forward–reverse output it is scaled by |H(f)|², with zero net phase shift away from the ends. At 2 and 14 Hz the final amplitude gain is 0.5. The right panel uses the same field samples after the same detrend and taper. The first curve uses one forward pass, and the second is DDCorr’s actual forward–reverse output. The different amplitude response also contributes to their different shapes. The test tones in filter_tone_audit.csv independently verify the two-pass amplitude response.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L19-L30"
    ],
    "image": "method_kver_filter_direction.png",
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Where DDCorr applies the filter",
    "image": "code-42.png",
    "lead": "detrend removes the fitted straight line and taper! softens the two ends. filtfilt applies the forward and reverse filter passes.",
    "body": [
      "Set the P and S frequency bands separately with band_hz in DDCorr.toml. The taper fraction and filter order are in src/advanced.toml. effective_config.toml records the settings used in each result."
    ],
    "notes": "The excerpt is taken from src/signal.jl. In lines 13–14, w is the multiplier for two samples at equal distances from the beginning and end of the trace. The function call on line 28 applies the taper after detrending the raw recording. On line 30, bandfilter constructs the selected digital bandpass and filtfilt applies it in both time directions. The implementation links identify the lines shown on screen.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L11-L30"
    ],
    "citation": [
      {
        "text": "DDCorr.jl · src/signal.jl, lines 11–30",
        "url": "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L11-L30"
      }
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Why filter before reducing the sampling rate?",
    "lead": "At 50 samples per second, the highest resolvable frequency is 25 Hz. The KVER recording contains some energy above that frequency.",
    "body": [
      "The right panel shows two ways to halve the sampling rate of the same field recording. Simply keeping alternating samples folds higher frequencies into the retained spectrum. A low-pass filter suppresses that energy first. This prevents aliasing."
    ],
    "notes": "This illustration isolates the resampling operation on the recorded KVER signal before the 2–14 Hz bandpass. Both panels use the first six seconds after the P marker. The right panel magnifies the upper part of the new 0–25 Hz spectrum. It compares simple decimation with a low-pass polyphase resampler. For example, any 30 Hz component sampled at 50 Hz appears at 20 Hz. In the production sequence DDCorr has already attenuated much of the high-frequency energy with the phase bandpass. DSP.resample then supplies anti-alias filtering for the chosen rate change. These illustrated spectra are derived from earthquake data.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L26-L36"
    ],
    "image": "method_kver_alias.png",
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "How two P waves get matching sample times",
    "lead": "At KVER, each instrument sample is 10 ms from the next. The predicted P time can fall between samples, so event 1 and event 2 have dots at different offsets from their own P markers.",
    "body": [
      "DDCorr filters and resamples each trace, then interpolates its amplitude at the chosen offsets. On the right both traces have a value at 560, 580 and 600 ms after P. Their waveforms can now be compared sample by sample."
    ],
    "notes": "Real KVER HHZ recordings for catalogue events 1 and 2. The left panel shows bandpassed native 100 Hz samples. Each row uses its own P marker as time zero. Vertical guides on both panels are 20 ms apart. The right panel first uses DDCorr.filtered_trace (including the anti-aliasing resampler) and then linearly interpolates onto the same marker-relative 50 Hz grid, as in DDCorr.prepare. The vertical separation of the two rows and their independent display scales make sample timing visible. See pair_sample_grid.py. The following slide uses the full phase-window duration and the room needed for lag search.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L31-L46"
    ],
    "image": "kver_pair_sample_grid.png",
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Which samples enter the P measurement?",
    "image": "method_windows.png",
    "lead": "The start and end of each P window are measured from that event’s own phase marker.",
    "body": [
      "In this run each comparison uses 2.5 s, from 0.5 s before to 2 s after P. Event 2 also supplies 0.5 s on either side so its window can move through the allowed lags. The two bars on the right show two positions of that window."
    ],
    "notes": "Time zero has a different absolute UTC time for each event. The archive supplied predicted P arrivals for this example. On the 50 Hz analysis grid, k = +25 means sampling event 2 half a second later relative to its marker while keeping event 1 fixed. The actual maximum for this pair is close to +20 ms. The 2.5 s interval includes 126 samples at 50 Hz when both ends are retained. DDCorr interpolates a marker-relative time falling between samples using its two neighbours. Both records need enough data for the phase window, lag search and filter margin.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L78-L100"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Signal-to-noise ratio is measured before correlation",
    "image": "method_signal_noise.png",
    "lead": "The shaded windows show where DDCorr measures the P wave and background noise at KVER.",
    "body": [
      "It divides the root-mean-square amplitude around the phase marker by that of the noise 8 to 2 s before P. The ratios for events 1 and 2 are 2.99 and 1.81. Both pass the minimum of 1.5, so this pair can be compared."
    ],
    "notes": "The two RMS values are calculated from the filtered, demeaned samples in each window. The S measurement also uses noise preceding P, to avoid using the P coda as background for S. If a trace lacks that pre-P marker or has too little data around the noise window, it cannot supply this test. A low ratio excludes that trace from the corresponding station and phase group. preprocessing_issues.csv records the reason. minimum_snr in correlations.csv reports the smallest contributing ratio for the accepted observation.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L90-L107"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "How DDCorr computes correlation at every lag",
    "image": "method_direct_fft.png",
    "lead": "For each trial shift, the direct calculation multiplies corresponding centred samples, sums the products and normalizes by the two window amplitudes. Each open circle is one such coefficient.",
    "body": [
      "DDCorr uses a fast Fourier transform (FFT) to compute those sums at all shifts, then normalizes each window and averages both event orders. The line is the actual DDCorr output for KVER P. It passes through all 51 circles."
    ],
    "notes": "For KVER events 1 and 2 the lag grid covers −0.5 to +0.5 s at 20 ms spacing. The direct reference uses Pearson-normalized fixed and sliding windows at each lag, then averages the two directions after reversing the second lag axis. DDCorr.correlation! uses a zero-padded FFT convolution of each reversed fixed core with the partner’s extended signal for the numerators, cached sliding norms for the denominators and a mean over the two directions. The independent direct calculation agrees with all 51 Julia coefficients to better than 1e−12. The FFT is a computational shortcut; the graph compares the same defined statistic. Slide 63 explains padding and slide 64 illustrates the two event orders.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L65-L75"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Zero padding prevents wraparound in the FFT",
    "lead": "The KVER P window has 126 resampled amplitudes. Its comparison record has 176 so the window can shift by 25 samples either way.",
    "body": [
      "The FFT treats its input as periodic. DDCorr appends zeros to keep the end of each array from wrapping into its beginning. An array of 512 can contain all 301 samples of this convolution. Padding leaves the 20 ms analysis-grid spacing unchanged."
    ],
    "notes": "The upper panel shows the mean-removed, reversed event 1 window used for the correlation numerator. The lower panel shows the extended event 2 window in its original order. A linear convolution of arrays of lengths 126 and 176 has 126 + 176 − 1 = 301 values. DDCorr selects the next power of two, here 512, for its FFT length. The shaded array values are numerical padding. Earlier, the SAC taper multiplied measured samples at the two edges to smooth the transition into filtering. The requested seismic time window must contain real measurements throughout.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L64-L75"
    ],
    "image": "method_kver_zero_padding.png",
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Why DDCorr uses both event orders",
    "image": "method_window_order.png",
    "lead": "Fixing event 86 keeps its P window centred on its marker. Fixing event 97 keeps a slightly different part of the P wave in the comparison.",
    "body": [
      "Both curves use the same lag convention on the plot. At +460 ms their coefficients are 0.644 and 0.811. DDCorr uses their mean, 0.728, at that lag."
    ],
    "notes": "This example uses Z7.DYSA P, events 86 and 97. With finite analysis windows, fixing the other waveform can include or exclude edge samples. Each local window also has its own mean and norm. The reverse-order result is reflected onto the original lag axis before averaging. This makes the coefficient unchanged when the event order is reversed and makes the lag change sign when there is a unique peak. This is a feature of the window definition and applies to both direct and FFT calculations.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L123-L135"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "Two horizontal recordings yield one S measurement",
    "image": "method_stam_s_peak.png",
    "lead": "At STAM each event has an east and a north recording. DDCorr correlates east with east and north with north, then averages their coefficients at each lag.",
    "body": [
      "For events 28 and 45, the mean reaches 0.700 at the zero-lag sample. A parabola fitted through that sample and its neighbours places the peak at −3.9 ms. The output reports the sampled coefficient and the interpolated lag."
    ],
    "notes": "These are baseline Z7.STAM S data for events 28 and 45. At zero lag the E and N coefficients are 0.67314 and 0.72687. The reported mean of 0.700006 meets the minimum signed coefficient 0.70. Only after computing this mean does DDCorr choose a peak. The next sample on either side is 20 ms away. With the default quadratic fit, the estimated position of the crest is about 3.86 ms before zero. The station-phase row in correlations.csv lists two contributing components, lag_B_later_s = −0.0039 s, dt_s = +0.0307 s and cc_signed = 0.700006. The report's waveform panel shows the first common component. The correlation curve and row use both.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L139-L169"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "table",
    "title": "When only one horizontal component is available",
    "lead": "DDCorr compares components recorded by both earthquakes. At KATT, events 1 and 5 share one usable east component for S.",
    "body": [
      "correlations.csv gives the channel names and ncomponents for each measurement. Requiring two components would remove the single-component observations, even when their waveforms agree."
    ],
    "notes": "Across the Iceland baseline, 3,973 of the 4,625 S observations have two contributing horizontal components and 652 have one. The station-phase logic intersects the components available for the two events after preparation and the signal-to-noise check. There must be at least min_components common components and consistent marker times. The KATT example has one common HHE component and a signed coefficient of 0.71515. A single usable horizontal at one event and a different sole horizontal at its partner cannot form a common component. The default S min_components = 1 permits one, while 2 requires a usable common pair. This choice affects coverage across both stations and events.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/pipeline.jl#L101-L151"
    ],
    "rows": [
      [
        "S measurement",
        "Common components",
        "Output coefficient"
      ],
      [
        "KATT · events 1 and 5",
        "E with E",
        "0.715"
      ],
      [
        "STAM · events 28 and 45",
        "E with E and N with N",
        "0.700"
      ]
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "table",
    "title": "Fitting the lag between two 20 ms samples",
    "lead": "For STAM events 28 and 45, the highest sampled coefficient occurs at zero lag. Its two neighbours put the fitted peak 3.9 ms earlier.",
    "body": [
      "The search still covers ±0.50 s. Refinement changes the position assigned to the chosen peak. The output coefficient, the squared-coefficient weight and the acceptance checks use the sampled peak."
    ],
    "notes": "The unfitted values follow directly from the same DDCorr curve and unchanged SAC markers. Event 28 minus 45 has a marker-related time difference of approximately +0.026803 s. With zero sampled lag, the exported dt is +0.0268 s. Subtracting a fitted lag of −0.0038597 s gives +0.0307 s. This demonstrates what subsample = true does. It cannot move the solution to another cycle outside the neighbourhood of the maximum or extend the allowed search. Numerical interpolation also does not supply an uncertainty estimate.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L139-L169"
    ],
    "rows": [
      [
        "Same STAM S observation",
        "Sampled maximum",
        "With peak refinement"
      ],
      [
        "Signed coefficient",
        "0.700006",
        "0.700006"
      ],
      [
        "Lag",
        "0.0000 s",
        "−0.0039 s"
      ],
      [
        "Travel-time difference",
        "+0.0268 s",
        "+0.0307 s"
      ]
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "table",
    "title": "Which station and phase measurements enter dt.cc?",
    "lead": "After the waveforms pass the signal-to-noise test, DDCorr evaluates the peak of the correlation curve.",
    "rows": [
      [
        "Outcome in group_summary.csv",
        "What happened in this run"
      ],
      [
        "boundary",
        "The largest coefficient was at the end of the lag search."
      ],
      [
        "low_cc",
        "The largest coefficient was below 0.70."
      ],
      [
        "ambiguous_peak",
        "Another peak was too close in height to the largest one."
      ],
      [
        "accepted",
        "The measurement passed all three checks."
      ]
    ],
    "body": [
      "DDCorr writes one dt.cc row for an accepted station and phase measurement. The same event pair can pass at another station even if this measurement fails."
    ],
    "notes": "These outcomes are tested in the order shown. In the Iceland baseline, P requires a 0.10 difference between distinct peaks and S requires 0.08. The second peak must be a different local maximum outside the 0.04 s exclusion around the first. The default seeks positive correlations. If a comparison has insufficient common components, it can be excluded before a curve exists. The optional rejected_pairs.csv lists the reason for an individual tested pair if write_rejected_pairs is enabled.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L139-L169"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "A peak at the edge of the lag search",
    "image": "method_boundary.png",
    "lead": "The P waves from events 29 and 41 at DYSA produce a peak near −0.50 s.",
    "body": [
      "The ±0.50 s search ends at the highest sample, so DDCorr flags boundary. With the search extended to ±0.70 s, the curve falls on both sides of the peak. The fitted lag is −0.496 s."
    ],
    "notes": "Both panels use the same SAC records. Only the allowed lag range is changed. The highest sampled coefficient is 0.764 in both cases. In the first panel the record gives no information on the untested side of the maximum within the chosen search range. In the wider search the peak also passes the coefficient and competing-peak criteria. Widening the search for a whole catalogue exposes many other peaks too. For this particular pair, the wider curve demonstrates why a boundary rejection occurred.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L146-L169"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "figure",
    "title": "A narrower P band can leave two plausible lags",
    "image": "method_competition.png",
    "lead": "These two curves come from the same KVER P recordings, events 13 and 27. Only the frequency band changes.",
    "body": [
      "At 2–14 Hz one peak stands above its nearest competitor. At 4–8 Hz two peaks about 160 ms apart reach 0.820 and 0.818. The peak separation in height falls below 0.10, so DDCorr flags the narrower-band measurement as ambiguous."
    ],
    "notes": "In the broad band, the best peak is 0.706 and another is 0.470. Their difference, about 0.237, exceeds the configured P threshold. The broad-band lag is +0.0316 s, accepted. In the narrow band the higher peak is larger than before, but its advantage over a second cycle is only 0.0024. The diagnostic is the difference in peak height, not their separation in time. Narrow-band wave trains can repeat at approximately one period, making two shifts plausible. The comparison was completed in advance with the same raw recordings and settings apart from the P band.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/signal.jl#L155-L169"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "table",
    "title": "A narrower P band also creates ambiguous peaks",
    "lead": "Changing only the P band from 2–14 to 4–8 Hz raised the accepted count. More nearly periodic waveforms can also match one cycle early or late.",
    "rows": [
      [
        "P measurements across the Iceland catalogue",
        "2–14 Hz",
        "4–8 Hz"
      ],
      [
        "Accepted measurements",
        "2,412",
        "4,626"
      ],
      [
        "Accepted in both runs",
        "1,945",
        "1,945"
      ],
      [
        "Accepted only in this run",
        "467",
        "2,681"
      ],
      [
        "Rejected for two peaks too close in height",
        "0",
        "1,103"
      ]
    ],
    "body": [
      "For KVER events 13/27, the narrow band left two peaks 160 ms apart. DDCorr rejected that lag. Inspect the competing peaks and the timing at other stations when deciding which band to use."
    ],
    "notes": "Both runs used these 100 events and unchanged S settings. Each accepted 4,625 S observations. The P ambiguity counts are sums of ambiguous_peak in group_summary.csv; DDCorr tests the boundary and coefficient first. Across the 1,945 P observations present in both runs, the largest absolute change in exported dt was 19.1 ms. The 2,681 newly accepted P observations have no accepted 2–14 Hz counterpart for that comparison. More passing rows alone cannot establish more accurate times. The 160 ms separation is a measured separation between alternative peaks for KVER 13/27; that case was rejected rather than becoming a known erroneous accepted lag.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/advanced.toml#L23-L68"
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "kind": "table",
    "title": "Choosing matrix output for a larger catalogue",
    "lead": "At DYSA, DDCorr prepared 66 P records. There were 2,145 possible pairs among those records and 800 accepted measurements.",
    "body": [
      "The sparse export stores one row per accepted measurement. A dense matrix reserves a cell for every combination of event IDs. As the catalogue grows, the sparse file saves both storage space and memory."
    ],
    "notes": "The matrix image and the numerical matrix export are separate outputs. For DYSA P, matrices/index.csv points to group_0001_edges.csv, whose columns include the two IDs, signed coefficient, differential time, lag and weight. The complete Iceland catalogue has 100 IDs, so a dense file for one quantity would require 100 × 100 cells for that station and phase. At 1,000 events it would require 1,000,000 cells. DDCorr groups observations by station and phase. It uses the header inventory to estimate the maximum number of event pairs and the memory required for full-trace filtering, retained windows and FFT workspaces before beginning that group. max_pairs_per_group and max_group_memory_mib under [runtime] in the run TOML control these checks. The memory allowance is an estimate for the group and additional memory is needed for Julia, accepted measurements and plots. The relevant switches for the numerical output are [matrices] enabled, dense, max_dense_events and max_dense_cells. This lets students choose appropriate outputs for their own SAC archives.",
    "sources": [
      "https://github.com/eliasrh/DDCorr.jl/blob/633b6cfdcd9305b0421e88303f18aad29f6c9cb1/src/pipeline.jl#L49-L70"
    ],
    "rows": [
      [
        "DYSA P output",
        "What it contains"
      ],
      [
        "group_0001_edges.csv",
        "800 rows for accepted event pairs"
      ],
      [
        "Optional dense coefficient matrix",
        "100 × 100 cells for the full list of event IDs"
      ]
    ],
    "section": "15:10   /   How DDCorr measures a lag"
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "break",
    "title": "Open clinic for your own SAC files",
    "lead": "16:00–18:00  ·  Bring a sequence you want to correlate. We can look together at the waveforms, their timing information and a first DDCorr run.",
    "notes": "Allow the whole two hours for open work. Keep this slide visible while participants choose their data and questions. The following slides can be projected individually as the corresponding issues arise. Anyone using Iceland100 can choose another station, phase or pair. If participants bring sensitive data, use the supplied field records for examples on the projector.",
    "body": [
      "The reference slides cover SAC headers, phase windows, missing data and selecting figures. The 100 Icelandic earthquakes are available for open exploration."
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "code",
    "title": "One folder holds the traces for one earthquake",
    "lead": "Place MyData beside DDCorr.jl. Copy Iceland100/DDCorr.toml to MyData/DDCorr.toml. The input and output paths in that file are relative to MyData.",
    "notes": "Use the existing event IDs as the folder names. The directory tree shows two real Iceland IDs and one station as a concrete example. DDCorr scans the files directly inside each event folder and reads the event and station metadata from their SAC headers. Network, station, location and channel identify the trace. An existing archive can stay where it is: set sac_dir to its absolute path and set directory to a writable location for results.",
    "command": "MyData/DDCorr.toml\nMyData/sac/S1_009992/Z7.DYSA..HHZ.sac\nMyData/sac/S1_009996/Z7.DYSA..HHZ.sac",
    "codeLabel": "Example file layout",
    "body": [
      "Use event-cut binary SAC files. At least two events need recordings of the same phase on a shared, compatible station component. DDCorr reads the SAC files in place."
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "code",
    "title": "Read the phase times from a SAC header",
    "lead": "Run the header viewer from DDCorr.jl. A file path opens that trace. A directory path opens one example and prints its filename.",
    "notes": "The first command works with your MyData/sac folder. The second opens an actual trace in the supplied field data. The viewer prints a table of A and T0–T9 with each slot’s label. Repeat on several events and station components to establish the archive convention. SAC stores times relative to a reference timestamp defined by its NZ fields. The event origin is that reference plus O. A phase time measured from the earthquake origin is the numeric marker minus O.",
    "command": "julia --project=. bin/sac_info.jl ../MyData/sac\njulia --project=. bin/sac_info.jl ../Iceland100/sac/S1_009992/Z7.DYSA..HHZ.sac",
    "codeLabel": "From the DDCorr.jl directory",
    "body": [
      "For this DYSA trace, A = 3.991571 s has label P_pred. T0 = 6.842693 s has label S_pred. O = 0, so those times are also seconds after origin."
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "code",
    "title": "Map the time fields in MyData/DDCorr.toml",
    "lead": "Choose the numerical slots that contain the P and S times in your archive. One P/S mapping applies to every file in the run.",
    "notes": "A, T0 through T9 are time fields; KA, KT0 through KT9 are descriptive text fields written by the data producer. For example, a manual P time stored in T8 with label Pm requires p_pick_header = \"t8\". A time label alone does not indicate whether a pick was reviewed, calculated or automatically estimated, unless the producer documents that convention. The parser normalizes field names to lowercase. DDCorr stores results and a copy of its effective settings under each new timestamped result folder.",
    "command": "[input]\nsac_dir = \"sac\"\np_pick_header = \"a\"\ns_pick_header = \"t0\"\n\n[output]\ndirectory = \"results\"",
    "codeLabel": "Existing input and output sections",
    "body": [
      "The Iceland files use the positions A and T0. If your P time is in T8, use \"t8\" for p_pick_header. Leave your original SAC headers intact."
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "table",
    "title": "Which components can contribute to a pair?",
    "lead": "DDCorr compares matching components at the same station. The two events can contribute a P observation, an S observation, or both.",
    "notes": "The default P data are vertical traces and default S data horizontal traces, using CMPINC with a default 10° tolerance and a code-suffix fallback if inclination is missing. Like-named channels must have compatible sensor orientation. The default noise_pick_header is auto, which selects the configured P marker on each contributing trace for the pre-P noise measurement. For S, two usable common horizontal channels can contribute a mean correlation curve; S.min_components = 2 demands both. A missing S marker excludes that S trace but does not discard an otherwise valid vertical P measurement. DDCorr does not create new phase picks.",
    "rows": [
      [
        "Observation",
        "What the two events must share"
      ],
      [
        "P",
        "A usable vertical component with a P time on each trace."
      ],
      [
        "S",
        "A usable horizontal component with an S time on each trace. The default noise window also needs its P time."
      ],
      [
        "One horizontal available",
        "With [S] min_components = 1, that common component can supply S by itself."
      ]
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "code",
    "title": "Choose the frequency band and time window for the phase",
    "lead": "Use a band in which the arrivals have visible signal above the background. Set the window in seconds relative to the phase marker.",
    "notes": "These P values come directly from the Iceland baseline. Edit the lines in the existing [P] section and set different values in [S] where appropriate. Keep the upper filter corner below half the chosen analysis sampling rate. Input traces must support the selected analysis rate. If phase markers are less accurate than the chosen search half-width, genuine matches can fall at its edge or outside it. A longer search can also find unrelated cycles. Inspect the actual waveforms and the lag curve in the report while deciding how wide a search is useful for this archive.",
    "command": "[P]\nband_hz = [2.0, 14.0]\nwindow_s = [-0.5, 2.0]\nmax_lag_s = 0.5\nsample_rate_hz = 50.0",
    "codeLabel": "P settings used in Iceland100",
    "body": [
      "Here P includes 0.5 s before the marker and 2.0 s after it. DDCorr tests shifts up to 0.5 s in either direction between the marker-centred waveforms. The S window can include a longer wave train."
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "figure",
    "title": "The cut must contain background and signal",
    "lead": "The Iceland settings measure background 8 to 2 seconds before P. Each phase window also needs samples for the lag search and filtering.",
    "notes": "The figure is calculated from the SAC P and S markers of the actual DYSA file in S1_009992 (3.991571 and 6.842693 seconds after origin) and the Iceland configuration. Coloured bars cover the core windows, pale ends the 0.5-second lag search on each side. The horizontal lines include five seconds of real filter padding on either side of the union of the pre-P noise and phase-search windows. For S the required cut is about −9.01 to +15.34 s relative to origin. The actual record runs from −25 to +70 s. These are dataset settings, not minimum lengths that apply everywhere.",
    "image": "clinic_cut_requirements.png",
    "body": [
      "The thin lines mark the minimum recorded span for each phase in this example. If an event cut is too short, phase_readiness.csv identifies the affected trace."
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "table",
    "title": "When a station or phase is missing",
    "lead": "Follow the record from its header to the comparison. Files in each run directory show where DDCorr excluded it.",
    "notes": "With the workshop defaults, a station whose coordinates conflict across files is excluded for every event and both phases; the rest of the stations can continue. The advanced file contains the latitude/longitude and elevation tolerances. A genuine station move can justify separately identified epochs. A typo should be corrected in a working copy from authoritative metadata. EVDP is a separate event header; confirm its units with the data supplier. The advanced [input] depth_unit switch accepts \"m\" or \"km\", and catalog.txt uses kilometres. Mixed or corrupted per-event required headers can stop the run under strict_headers, separately from the default station-skip policy.",
    "rows": [
      [
        "What happened",
        "Where to look",
        "What to check"
      ],
      [
        "A station disappears across events",
        "station_exclusions.csv and station_epochs.csv",
        "Coordinates and elevation for that network/station code."
      ],
      [
        "One phase is missing",
        "phase_readiness.csv",
        "Phase marker, P noise anchor, component and trace length."
      ],
      [
        "The header passed but the waveform failed",
        "preprocessing_issues.csv",
        "The filtered signal-to-noise ratio for that component."
      ],
      [
        "A tested pair failed the lag checks",
        "group_summary.csv",
        "Counts by reason for that station and phase."
      ]
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "code",
    "title": "Inspect the archive and open its first report",
    "lead": "The inspection checks headers and time windows. A correlation run then reads the samples, measures the lags and writes a separate results folder.",
    "notes": "Both commands run from the DDCorr.jl folder with a copy of the input-specific settings at ../MyData/DDCorr.toml. Inspection writes inventory.csv, event_id_map.csv, phase_readiness.csv and any issues in a timestamped inspect_ directory. Correlation writes to a new correlate_ directory. Open report.html with the operating system’s file browser. An empty gallery can reflect zero accepted observations or a plotting switch. If using the Iceland data without changing settings, continue directly from the supplied reference report.",
    "command": "julia --project=. bin/ddcorr.jl ../MyData/DDCorr.toml --inspect\njulia --project=. --threads=2 bin/ddcorr.jl ../MyData/DDCorr.toml",
    "codeLabel": "From the DDCorr.jl directory",
    "body": [
      "Open report.html in the printed correlate_… folder. effective_config.toml records this run’s input paths, filters, thresholds and figure settings."
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "code",
    "title": "Request figures for a named pair",
    "lead": "In the existing [plots] section, use original event folder names to request a particular waveform alignment and lag curve.",
    "notes": "This exact request selects P at DYSA for two real Iceland event folders. Both are present in the example_selection.csv and correlations.csv of the reference run. The public TOML also accepts integer event_pairs; use only one pair selection convention per run. The original ID map is essential when folder names look like integers or when running different subsets. The automatic gallery samples accepted weak, middle and strong observations across station/phase groups. An explicit request can identify an unavailable pair; the selection table records what was plotted. Run DDCorr using the edited copy and open the newly printed result.",
    "command": "[plots]\nenabled = true\nexamples = true\nevent_pairs = []\noriginal_event_pairs = [[\"S1_009992\", \"S1_009996\"]]\nexample_stations = [\"Z7.DYSA\"]\nexample_phases = [\"P\"]",
    "codeLabel": "Existing figure settings",
    "body": [
      "For the Iceland data, these folders map to IDs 93 and 97. For your archive, substitute a pair, station and phase from correlations.csv. example_selection.csv lists the requested figures."
    ]
  },
  {
    "section": "16:00   /   Open clinic for your own SAC files",
    "kind": "table",
    "title": "Export station-by-station correlation measurements",
    "lead": "A station–phase matrix uses the event IDs on both axes. Choose a list of accepted event pairs or a square table, depending on the analysis.",
    "notes": "With [matrices] enabled = true and dense = false, the program writes accepted edges and an index by station/phase. The sparse group files include both IDs, the coefficient, lag and differential time without allocating a square table. plots = true under [matrices] and enabled = true under [plots] allow matrix PNGs subject to max_plot_events and max_plot_groups. Optional dense tables require enabled = true and dense = true, subject to max_dense_events and max_dense_cells. Each phase group has separate coefficient, lag and differential-time tables. The upper-triangle observation order is the smaller integer ID first. Reflecting a coefficient keeps its sign, whereas reversing the event order changes the sign of lag and dt.",
    "rows": [
      [
        "Wanted output",
        "Setting in [matrices]",
        "Where DDCorr writes it"
      ],
      [
        "Accepted pairs with coefficient, lag and dt",
        "enabled = true",
        "matrices/index.csv points to each sparse edge file."
      ],
      [
        "A station/phase matrix figure",
        "plots = true",
        "matrices/matrix_plots.csv lists the PNGs when plots are enabled."
      ],
      [
        "Square coefficient, lag and dt tables",
        "dense = true",
        "The dense CSV columns are named in matrices/index.csv. NA marks unmeasured cells."
      ]
    ]
  },
  {
    "kind": "table",
    "title": "How the Iceland event folders were made",
    "lead": "The archive stores continuous station recordings. A catalogue supplies the origin of each earthquake so the downloader can request a short recording around it.",
    "rows": [
      [
        "Input",
        "How it becomes a SAC event cut"
      ],
      [
        "Earthquake catalogue",
        "Data Set S1 supplies the origin time, latitude, longitude and depth for each event."
      ],
      [
        "Station and channel metadata",
        "The Z7 inventory identifies the channel and supplies its station coordinates and elevation."
      ],
      [
        "Waveform service",
        "EarthScope returns the requested time interval at each available channel as miniSEED."
      ],
      [
        "Event SAC files",
        "The downloader writes the trace, origin, coordinates and predicted P and S markers into one SAC per component."
      ]
    ],
    "notes": "In this example the theoretical times come from a constant-speed teaching model. The archive waveforms and starting catalogue are independently sourced. The supplied 100-event archive is already cut.",
    "sources": [
      "https://doi.org/10.1029/2018JB016010",
      "https://doi.org/10.7914/SN/Z7_2010"
    ],
    "section": "16:00   /   Open clinic for your own SAC files"
  },
  {
    "kind": "code",
    "title": "Download five real events at three Z7 stations",
    "lead": "For a fresh field example, follow “Optional archive download” in Start Here. Install ObsPy and run the downloader with the same Python environment.",
    "command": ".venv/bin/python -m pip install -r requirements-download.txt\n.venv/bin/python scripts/download_example.py",
    "commandWindows": ".\\.venv\\Scripts\\python.exe -m pip install -r requirements-download.txt\n.\\.venv\\Scripts\\python.exe scripts/download_example.py",
    "body": [
      "The example writes event folders under work/iceland_small/sac. Completed matching archive requests are reused from work/download_cache."
    ],
    "notes": "First create .venv in DDCorr.jl as shown in the optional download section of Start Here. The upper box shows macOS/Linux, the lower box PowerShell. Downloaded SAC files share the event-folder layout of the local field archive. This optional clinic example needs internet access.",
    "section": "16:00   /   Open clinic for your own SAC files"
  },
  {
    "kind": "bibliography",
    "title": "Waveform timing",
    "entries": [
      {
        "authors": "Poupinet, G., Ellsworth, W. L., & Fréchet, J. (1984)",
        "detail": "Monitoring velocity variations in the crust using earthquake doublets: An application to the Calaveras Fault, California. Journal of Geophysical Research 89(B7), 5719–5731.",
        "doi": "https://doi.org/10.1029/JB089iB07p05719",
        "url": "https://doi.org/10.1029/JB089iB07p05719"
      },
      {
        "authors": "Schaff, D. P., Bokelmann, G. H. R., Ellsworth, W. L., Zanzerkia, E., Waldhauser, F., & Beroza, G. C. (2004)",
        "detail": "Optimizing correlation techniques for improved earthquake location. Bulletin of the Seismological Society of America 94(2), 705–721.",
        "doi": "https://doi.org/10.1785/0120020238",
        "url": "https://doi.org/10.1785/0120020238"
      }
    ],
    "notes": "Published references and DOI links.",
    "sources": [
      "https://doi.org/10.1029/JB089iB07p05719",
      "https://doi.org/10.1785/0120020238"
    ],
    "section": "References"
  },
  {
    "kind": "bibliography",
    "title": "Relative earthquake relocation",
    "entries": [
      {
        "authors": "Waldhauser, F., & Ellsworth, W. L. (2000)",
        "detail": "A double-difference earthquake location algorithm: Method and application to the northern Hayward Fault, California. Bulletin of the Seismological Society of America 90(6), 1353–1368.",
        "doi": "https://doi.org/10.1785/0120000006",
        "url": "https://doi.org/10.1785/0120000006"
      },
      {
        "authors": "Waldhauser, F. (2001)",
        "detail": "hypoDD: A program to compute double-difference hypocenter locations. U.S. Geological Survey Open-File Report 01-113.",
        "doi": "https://doi.org/10.3133/ofr01113",
        "url": "https://doi.org/10.3133/ofr01113"
      },
      {
        "authors": "Trugman, D. T., & Shearer, P. M. (2017)",
        "detail": "GrowClust: A hierarchical clustering algorithm for relative earthquake relocation, with application to the Spanish Springs and Sheldon, Nevada, earthquake sequences. Seismological Research Letters 88(2A), 379–391.",
        "doi": "https://doi.org/10.1785/0220160188",
        "url": "https://doi.org/10.1785/0220160188"
      }
    ],
    "notes": "Published references and DOI links.",
    "sources": [
      "https://doi.org/10.1785/0120000006",
      "https://doi.org/10.3133/ofr01113",
      "https://doi.org/10.1785/0220160188"
    ],
    "section": "References"
  },
  {
    "kind": "bibliography",
    "title": "Bárðarbunga and the Iceland recordings",
    "entries": [
      {
        "authors": "Woods, J., Donaldson, C., White, R. S., Caudron, C., Brandsdóttir, B., Hudson, T. S., & Ágústsdóttir, T. (2018)",
        "detail": "Long-period seismicity reveals magma pathways above a laterally propagating dyke during the 2014–15 Bárðarbunga rifting event, Iceland. Earth and Planetary Science Letters 490, 216–229.",
        "doi": "https://doi.org/10.1016/j.epsl.2018.03.020",
        "url": "https://doi.org/10.1016/j.epsl.2018.03.020"
      },
      {
        "authors": "Ágústsdóttir, T., Winder, T., Woods, J., White, R. S., Greenfield, T., & Brandsdóttir, B. (2019)",
        "detail": "Intense seismicity during the 2014–2015 Bárðarbunga-Holuhraun rifting event, Iceland, reveals the nature of dike-induced earthquakes and caldera collapse mechanisms. Journal of Geophysical Research: Solid Earth 124, 8331–8357.",
        "doi": "https://doi.org/10.1029/2018JB016010",
        "url": "https://doi.org/10.1029/2018JB016010"
      }
    ],
    "notes": "Published references and DOI links.",
    "sources": [
      "https://doi.org/10.1016/j.epsl.2018.03.020",
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "References"
  },
  {
    "kind": "bibliography",
    "title": "DDSync and GraphSplit",
    "entries": [
      {
        "authors": "Heimisson, E. R., & Yu, Y. (2026)",
        "detail": "DDSync: Graph-based denoising of differential travel-time observations with applications to pick reconstruction and path-difference tomography. Seismological Research Letters.",
        "doi": "https://doi.org/10.1785/0220260086",
        "url": "https://doi.org/10.1785/0220260086"
      },
      {
        "authors": "Heimisson, E. R. (2026)",
        "detail": "GraphSplit: Sparse double-difference earthquake relocation from synchronized differential-time graphs. ESS Open Archive, preprint, version 1.",
        "doi": "https://doi.org/10.22541/essoar.15009811/v1",
        "url": "https://doi.org/10.22541/essoar.15009811/v1"
      }
    ],
    "notes": "Published references and DOI links.",
    "sources": [
      "https://doi.org/10.1785/0220260086",
      "https://doi.org/10.22541/essoar.15009811/v1"
    ],
    "software": [
      {
        "text": "DDSync software · github.com/eliasrh/DDSync",
        "url": "https://github.com/eliasrh/DDSync"
      },
      {
        "text": "GraphSplit software · github.com/eliasrh/GraphSplit.jl",
        "url": "https://github.com/eliasrh/GraphSplit.jl"
      }
    ],
    "section": "References"
  }
];
