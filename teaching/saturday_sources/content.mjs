export const slides = [
  {
    "kind": "cover",
    "title": "Relocating earthquakes with timing graphs",
    "notes": "Holuhraun after the 2014 eruption began. NASA Earth Observatory, Jesse Allen, Landsat 8 imagery, 6 September 2014.",
    "sources": [
      "https://science.nasa.gov/earth/earth-observatory/roiling-flows-on-holuhraun-lava-field-84316/"
    ],
    "section": "Saturday workshop"
  },
  {
    "kind": "agenda",
    "title": "Saturday’s workshop",
    "notes": "Use the actual Start Here guide during the lab. Keep 16:00–18:00 open for participants’ sequences or further exploration of Iceland.",
    "section": "Saturday workshop",
    "parts": [
      {
        "name": "Morning",
        "slots": [
          {
            "time": "10:00–10:50",
            "topic": "Timing graphs and DDSync",
            "range": "4–15"
          },
          {
            "time": "10:50–11:05",
            "topic": "Coffee",
            "range": ""
          },
          {
            "time": "11:05–12:00",
            "topic": "From timing graphs to locations",
            "range": "16–25"
          },
          {
            "time": "12:00–12:45",
            "topic": "Guided lab · run DDSync",
            "range": "26"
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
            "topic": "Continue the lab · run GraphSplit",
            "range": "26"
          },
          {
            "time": "14:05–14:55",
            "topic": "Reading the Iceland results",
            "range": "27–38"
          },
          {
            "time": "14:55–15:10",
            "topic": "Coffee",
            "range": ""
          },
          {
            "time": "15:10–16:00",
            "topic": "Inside the two inversions",
            "range": "39–58"
          },
          {
            "time": "16:00–18:00",
            "topic": "Open clinic · your own catalogues",
            "range": "59–68"
          }
        ]
      }
    ]
  },
  {
    "kind": "table",
    "title": "What to bring from Friday",
    "lead": "Saturday begins with the files in the inputs folder. Anyone can follow the complete day with the supplied measurements from 100 Icelandic earthquakes.",
    "rows": [
      [
        "File",
        "What it contributes"
      ],
      [
        "dt.cc",
        "Pairs of event IDs, the recording station, P or S, a time difference and its weight."
      ],
      [
        "catalog.txt and stations.txt",
        "Starting origins and hypocentres, plus station coordinates and elevations."
      ],
      [
        "event_id_map.csv",
        "The original event folder behind each integer ID."
      ]
    ],
    "body": [],
    "notes": "For the first run use the supplied inputs. Later, participants with a completed DDCorr run can substitute their four matching files. The slides return to the original waveforms for the overlapping RODG cuts.",
    "section": "Saturday workshop"
  },
  {
    "title": "What can arrival-time differences tell us about the dike?",
    "lead": "These 100 Icelandic earthquakes occurred in less than two hours on 23 August 2014. Many produced similar P and S waves at the same stations.",
    "kind": "figure",
    "notes": "Both maps use approximate local kilometres east and north of 64.77° N, 16.91° W. Triangles are stations, dots are earthquakes. Marker predictions used for cutting the correlation windows and the relocation velocity model are separate choices.",
    "body": [
      "The map on the left shows the network. The enlargement on the right shows 48 published starting locations within the centre of the swarm. The numbered earthquakes will let us follow individual measurements all the way to a location."
    ],
    "image": "sat_network.png",
    "citation": [
      {
        "text": "Starting locations from Ágústsdóttir et al. (2019), Data Set S1. JGR: Solid Earth 124, 8331–8357.",
        "url": "https://doi.org/10.1029/2018JB016010"
      }
    ],
    "sources": [
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "10:00   /   Timing graphs and DDSync"
  },
  {
    "title": "One row in dt.cc belongs to two earthquakes and one phase",
    "lead": "Friday’s DYSA P measurement compares earthquake 93 with earthquake 97. A positive difference means the P travel time for event 93 is longer relative to its catalogue origin.",
    "kind": "table",
    "notes": "DDCorr subtracts the fitted lag from the difference of the travel times of its two markers. These numbers are rounded as written in dt.cc. A group-specific arrival here means arrival minus the respective catalogue origin. A correction to that origin later enters the location equation.",
    "body": [
      "The alignment lag was +0.0586 s relative to the P markers. The catalogue-relative difference already includes that correction when it reaches DDSync."
    ],
    "rows": [
      [
        "Part of the record",
        "Meaning"
      ],
      [
        "# 93 97 0.0",
        "Event IDs 93 and 97, in this order."
      ],
      [
        "Z7.DYSA  +0.2972  0.490046  P",
        "Station, differential time in seconds, weight and phase."
      ]
    ],
    "section": "10:00   /   Timing graphs and DDSync",
    "sources": []
  },
  {
    "title": "The stations define separate timing graphs",
    "lead": "Each earthquake is a node in a graph. A line between two nodes is an edge. Here an edge means DDCorr measured a differential time for those events at the named station and phase.",
    "kind": "figure",
    "notes": "This is an induced subgraph of seven chosen events, with every accepted original edge between them shown. Circle locations are a drawing convention. They have no geographic meaning. Edge colours or directions are unnecessary here because this picture shows connectivity only.",
    "body": [
      "Both panels show the same seven events. A node’s degree is the number of edges touching it. The degree can change with station and phase."
    ],
    "image": "sat_two_groups.png",
    "citation": [
      {
        "text": "Heimisson & Yu (2026). DDSync: Graph-based denoising of differential travel-time observations. Seismological Research Letters.",
        "url": "https://doi.org/10.1785/0220260086"
      }
    ],
    "sources": [
      "https://doi.org/10.1785/0220260086"
    ],
    "section": "10:00   /   Timing graphs and DDSync"
  },
  {
    "title": "The sign follows the order of the event IDs",
    "lead": "Let uᵢ be the arrival time of a phase measured from event i’s catalogue origin, at a particular station. DDCorr measures the difference between two such times.",
    "kind": "equation",
    "notes": "The epoch of each event has been removed. The two earthquake origin times can be minutes or years apart. The approximation reflects picking, waveform and timing errors. All differences on this slide describe DYSA P.",
    "body": [
      "A positive dᵢⱼ means the arrival occurs later after the catalogue origin of i.",
      "Reversing the event order changes the sign. At DYSA, d₁₃ = +93.9 ms and d₃₁ = −93.9 ms."
    ],
    "equation": "dᵢⱼ ≈ uᵢ − uⱼ",
    "section": "10:00   /   Timing graphs and DDSync",
    "sources": []
  },
  {
    "title": "Two routes through the timing graph should agree",
    "lead": "At DYSA, the measured differences for 1 minus 3 and 3 minus 5 sum to +32.3 ms. The direct measurement for 1 minus 5 is +30.5 ms.",
    "kind": "figure",
    "notes": "An arrow from i to j labels the value i minus j. The closure is +93.9 − 61.6 − 30.5 = +1.8 ms. One triangle alone cannot say which of its three measurements accounts for the discrepancy.",
    "body": [
      "The discrepancy is +1.8 ms. Traversing the three edges while respecting their signs brings us back to the same event, so the expected sum around the loop is zero."
    ],
    "image": "sat_triangle.png",
    "section": "10:00   /   Timing graphs and DDSync",
    "sources": []
  },
  {
    "title": "More than one path makes a timing error observable",
    "lead": "A path follows edges from one event to another. A chain with only one path between any two events can fit every measured difference exactly. An extra edge closing a loop gives an independent comparison.",
    "kind": "equation",
    "notes": "Start with a spanning tree: N−1 connections suffice to reach every event exactly once from a chosen root. Each additional edge creates one independent cycle. Loops may have four or more sides. A bridge can still have little independent support in a graph containing other loops.",
    "body": [
      "For one connected graph with N events and M measured pairs, M − N + 1 is the number of independent loops.",
      "In the DYSA P graph, 56 events and 800 accepted pairs give 745 independent loops. Many triangles reuse the same observations."
    ],
    "equation": "Number of independent loops = M − N + 1",
    "section": "10:00   /   Timing graphs and DDSync",
    "sources": []
  },
  {
    "title": "One relative time per earthquake reconciles the pair measurements",
    "lead": "DDSync assigns a number θ, pronounced theta, to each event in one connected station–phase graph. Subtracting two fitted numbers predicts their differential time.",
    "kind": "equation",
    "notes": "The weighted least-squares expression is the first fit and the form of each reweighted fit. In the class data column three is already the squared correlation coefficient. The configuration uses it directly. The algorithm does not need to list all paths explicitly.",
    "body": [
      "Each row contributes its measurement dᵢⱼ and weight wᵢⱼ. A larger weight gives that row more influence on the fit.",
      "The initial fit uses the supplied weights. DDSync then checks misfits and reduces the influence of inconsistent rows."
    ],
    "equation": "Choose θ to minimize   Σ wᵢⱼ [ (θᵢ − θⱼ) − dᵢⱼ ]²",
    "citation": [
      {
        "text": "Heimisson & Yu (2026). DDSync: Graph-based denoising of differential travel-time observations. Seismological Research Letters.",
        "url": "https://doi.org/10.1785/0220260086"
      }
    ],
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/README.md",
      "https://doi.org/10.1785/0220260086"
    ],
    "section": "10:00   /   Timing graphs and DDSync"
  },
  {
    "title": "The choice of timing zero is called a gauge",
    "lead": "Adding the same number to every θ leaves all differences unchanged. A connected timing graph therefore needs one event to define zero.",
    "kind": "figure",
    "notes": "DDSync chooses the highest surviving degree in each connected component and breaks ties by smallest event ID. Choosing a gauge does not specify an absolute pick. It also does not fix the geographic location of the reference earthquake.",
    "body": [
      "The circles use event 25 as zero at DYSA P. The diamonds use event 1. Both sets of values give exactly the same timing difference between any two of these events."
    ],
    "image": "sat_gauge.png",
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/README.md"
    ],
    "section": "10:00   /   Timing graphs and DDSync"
  },
  {
    "title": "Separate timing components have separate zeros",
    "lead": "A connected component is a group with a path between any two of its events. At KVER S, two such groups survive with no path between them.",
    "kind": "table",
    "notes": "A connected component is a set of vertices reachable by following edges. The KVER groups are disconnected after DDSync screening. Some of these events can be connected at other stations, where different relative times and reference IDs apply.",
    "body": [
      "Subtract two θ values when station, phase and reference ID agree. A difference across the two KVER S references would depend on an arbitrary offset."
    ],
    "rows": [
      [
        "Station and phase",
        "Reference ID",
        "Events with fitted times"
      ],
      [
        "KVER S",
        "46",
        "52"
      ],
      [
        "KVER S",
        "71",
        "16"
      ],
      [
        "DYSA P",
        "25",
        "56"
      ]
    ],
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/README.md"
    ],
    "section": "10:00   /   Timing graphs and DDSync"
  },
  {
    "title": "The fitted DYSA times close the loop",
    "lead": "The same three Iceland measurements have small adjustments when DDSync fits them together with the other DYSA P measurements.",
    "kind": "figure",
    "notes": "θ₁ = +14.559942, θ₃ = −77.913583 and θ₅ = −16.029866 ms relative to event 25. The resulting differences are +92.473525, −61.883717 and +30.589808 ms. The close fit measures internal consistency. The true DYSA arrivals are not independently known.",
    "body": [
      "The fitted 1–3 and 3–5 differences add to the fitted 1–5 difference. Because the two occurrences of θ₃ cancel, this holds for every loop built from the fitted times."
    ],
    "image": "sat_fit_residuals.png",
    "section": "10:00   /   Timing graphs and DDSync",
    "sources": []
  },
  {
    "title": "A connected graph can estimate a difference that was never measured directly",
    "lead": "DYSA P has observations for 1–5 and 1–11, but none for 5–11. The common reference still permits an estimate for 5 minus 11.",
    "kind": "figure",
    "notes": "θ₅ = −16.029866 ms and θ₁₁ = +270.2632 ms, giving approximately −286.29 ms. This is an inferred observable. There is no evidence here of a measured direct 5–11 waveform match at DYSA P; the waveforms for that pair need not be similar.",
    "body": [
      "The fitted value uses all surviving paths between these earthquakes. It carries timing information shared with those paths. Treating every possible pair as independent would overstate the available information."
    ],
    "image": "sat_indirect.png",
    "section": "10:00   /   Timing graphs and DDSync",
    "sources": []
  },
  {
    "title": "Timing consistency and signal identification",
    "lead": "A wrong cycle chosen for one pair often disagrees with the other paths to that event. A systematic time shift on every observation involving one event can instead be absorbed into that event’s θ.",
    "kind": "story",
    "notes": "Friday’s events 44 and 45 at RODG share identical samples in the overlapping part of the east trace. Coherence or small closure alone cannot establish two independent sources. DDSync needs a velocity model only when a subsequent application relates theta to earthquake positions; the timing fit itself uses no model.",
    "body": [
      "A large loop misfit motivates a look at the original waveforms and their alignment. It does not identify the wrong edge by itself.",
      "Coherent noise or overlapping event cuts can produce a self-consistent family. Station coverage, phase behaviour and the original UTC records give additional evidence."
    ],
    "sources": [
      "https://doi.org/10.1785/0220260086"
    ],
    "section": "10:00   /   Timing graphs and DDSync"
  },
  {
    "title": "GraphSplit uses the timing graph twice",
    "lead": "First, GraphSplit fits times from each event to the reference for that station and phase. These differences improve the initial hypocentres and origin times.",
    "kind": "table",
    "notes": "Relocation requires station positions and a travel-time model. Each timing component can have a different reference. Both endpoints in an observation can move in the inversion. Timing graphs are built from measured pairs; the local relocation graph is built from geographic proximity.",
    "body": [
      "The improved locations determine which earthquakes are close enough to pair for a second, local double-difference inversion."
    ],
    "rows": [
      [
        "Stage",
        "Pairs in the location equations"
      ],
      [
        "Prelocation",
        "Each supported event with its own station–phase reference."
      ],
      [
        "Local double difference",
        "Nearby events sharing a timing reference at the same station and phase."
      ]
    ],
    "citation": [
      {
        "text": "Heimisson (2026). GraphSplit: Sparse double-difference earthquake relocation from synchronized differential-time graphs. ESS Open Archive, v1.",
        "url": "https://doi.org/10.22541/essoar.15009811/v1"
      }
    ],
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md",
      "https://doi.org/10.22541/essoar.15009811/v1"
    ],
    "section": "11:05   /   From timing graphs to locations"
  },
  {
    "title": "A reference event gives the timing graph a star representation",
    "lead": "A star connects a centre to each of the other events. At DYSA P the reference event is 25. Each spoke gives a fitted time relative to that event.",
    "kind": "figure",
    "notes": "Left shows all original edges among a seven-event subset. Right shows the six differences from its non-reference nodes to event 25. Their fitted values draw on the full 56-event DYSA P component. The graph layout is schematic. A given star edge can be inferred through other measured links.",
    "body": [
      "The middle of the star is a timing reference. Its geographical position can move in GraphSplit. Other station–phase groups supply their own stars to the same location problem."
    ],
    "image": "sat_star.png",
    "section": "11:05   /   From timing graphs to locations",
    "sources": []
  },
  {
    "title": "What travel time does a trial location predict?",
    "lead": "A trial hypocentre fixes the source position in three dimensions. A station position and velocity model determine the P or S travel time T from that source.",
    "kind": "figure",
    "notes": "The map shows three stations out of the eleven in the lab, with straight direction lines drawn in map view rather than modelled ray paths. The speed plot shows depth samples from vm.txt down to 25 km; the tabulation is for radial distance, source depth and station depth/elevation. Source and receiver elevations use the configured vertical convention.",
    "body": [
      "The station map shows why the effect of moving an event depends on direction. The profile gives the P and S speeds used in the Saturday run.",
      "GraphSplit uses a radial travel-time table for this layered model. Changing a trial source changes the travel time read from that table."
    ],
    "image": "sat_model.png",
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md"
    ],
    "section": "11:05   /   From timing graphs to locations"
  },
  {
    "title": "The unknowns include the origin-time correction",
    "lead": "The catalogue origin is the reference clock used by Friday’s differential times. Let τᵢ be the correction to that origin and Tᵢ the predicted travel time from event i to this station.",
    "kind": "equation",
    "notes": "Dates and times are already present in the catalogue. τ is an increment in seconds, not the original epoch. In the prelocation j is the reference event of this timing component. In local DD j is a selected neighbour of i in the same component.",
    "body": [
      "A positive τ shifts the origin later. The predicted arrival relative to the old catalogue origin is τᵢ + Tᵢ.",
      "The observed side is one fitted θ difference for two events at this station and phase."
    ],
    "equation": "θᵢ − θⱼ ≈ (τᵢ − τⱼ) + (Tᵢ − Tⱼ)",
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md"
    ],
    "section": "11:05   /   From timing graphs to locations"
  },
  {
    "title": "Why neighbouring earthquakes are especially informative",
    "lead": "A velocity error along a common part of the ray path delays both arrivals. Subtracting their predicted times removes the part of that error shared by the pair.",
    "kind": "figure",
    "notes": "The diagram is a geometric illustration, not a ray trace through the workshop model. The two rays can still differ close to their sources. Double differences reduce sensitivity to shared velocity error and preserve sensitivity to source separation. Large separations are one reason to follow reference-star prelocation with local DD.",
    "body": [
      "Close sources recorded at the same distant station are more likely to share a long part of their propagation paths. Different source depths, take-off angles or phase branches can reduce that cancellation."
    ],
    "image": "sat_shared_paths.png",
    "citation": [
      {
        "text": "Waldhauser & Ellsworth (2000). A double-difference earthquake location algorithm. BSSA 90, 1353–1368.",
        "url": "https://doi.org/10.1785/0120000006"
      }
    ],
    "sources": [
      "https://doi.org/10.1785/0120000006"
    ],
    "section": "11:05   /   From timing graphs to locations"
  },
  {
    "title": "Nearby sources must also share timing support",
    "lead": "A short distance gives two earthquakes similar paths. To build a data row for them, GraphSplit also needs timing estimates at a common station and phase with the same reference ID.",
    "kind": "table",
    "notes": "The second column is geometry_degree from catalog_dd_graphmeta.csv. The third is dd_pair_degree. These differ from degree in a DDSync theta uncertainty file, which counts measured links at just one station and phase. An unsupported event can remain present in the full catalogue.",
    "body": [
      "At event 1 the graph proposes 20 neighbours. Twelve have enough common timing observations to constrain relocation. At event 2 the graph proposes 15 neighbours and none has sufficient support."
    ],
    "rows": [
      [
        "Iceland event",
        "Candidate neighbours",
        "Neighbours supplying DD observations"
      ],
      [
        "1",
        "20",
        "12"
      ],
      [
        "2",
        "15",
        "0"
      ],
      [
        "5",
        "20",
        "18"
      ]
    ],
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md"
    ],
    "section": "11:05   /   From timing graphs to locations"
  },
  {
    "title": "Station directions separate a position change from a clock change",
    "lead": "A later origin delays a predicted arrival at every station by the same amount. A small displacement toward one station and away from another changes their travel times with opposite signs.",
    "kind": "equation",
    "notes": "For a source moving toward a stationary receiver the path shortens, so the travel time decreases. The numerical scale here illustrates a first derivative, not a fitted Iceland displacement. Depth can trade off with origin time when station directions and take-off angles sample a narrow range.",
    "body": [
      "In a simple local approximation, a 100 m shift along a P ray with a 6 km/s speed changes travel time by about 17 ms. A station roughly perpendicular to that shift is much less sensitive."
    ],
    "equation": "Travel-time change ≈ along-ray displacement away from the station / wave speed",
    "section": "11:05   /   From timing graphs to locations",
    "sources": []
  },
  {
    "title": "The local DD problem solves for small location changes",
    "lead": "At the current locations, subtract the predicted difference from the observed θ difference. The result is a residual in seconds. A linear approximation relates this residual to changes in the two events.",
    "kind": "equation",
    "notes": "GraphSplit computes local travel-time derivatives at the current trial locations, solves many coupled rows, updates the hypocentres and origin times, then recomputes the travel times. The travel-time gradient for each endpoint generally differs. The signs follow the i-minus-j orientation.",
    "body": [
      "δx is a small three-dimensional displacement. ∇T is the change of travel time per metre near the source. Their dot product gives seconds.",
      "Each row involves only the two event locations and their two origin-time corrections."
    ],
    "equation": "residual ≈ ∇Tᵢ · δxᵢ − ∇Tⱼ · δxⱼ + δτᵢ − δτⱼ",
    "citation": [
      {
        "text": "Waldhauser & Ellsworth (2000). A double-difference earthquake location algorithm. BSSA 90, 1353–1368.",
        "url": "https://doi.org/10.1785/0120000006"
      }
    ],
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md",
      "https://doi.org/10.1785/0120000006"
    ],
    "section": "11:05   /   From timing graphs to locations"
  },
  {
    "title": "Where hypoDD, GrowClust and GraphSplit differ",
    "lead": "All three use differential arrival times to improve relative locations. The principal difference is how observations and event pairs enter the location updates.",
    "kind": "table",
    "notes": "hypoDD can combine pick-based and correlation-based differential times with configurable weights. GrowClust uses a robust grid search over relative offsets of candidate clusters and accepts merges according to support and fit criteria. GraphSplit’s extra upstream timing fit allows a local row even without a direct measurement for that pair; all three methods depend on timing data, a travel-time model and sufficient geometry.",
    "rows": [
      [
        "Method",
        "How locations are updated"
      ],
      [
        "hypoDD",
        "Linearizes predicted travel-time differences around trial hypocentres and solves jointly for corrections to the event locations and origin times."
      ],
      [
        "GrowClust",
        "Ranks event pairs by waveform similarity and searches for relative shifts as nearby events or clusters merge."
      ],
      [
        "GraphSplit",
        "Fits star differences from DDSync, constructs a new local event graph, and jointly fits the supported differences on its edges."
      ]
    ],
    "citation": [
      {
        "text": "Waldhauser & Ellsworth (2000). A double-difference earthquake location algorithm. BSSA 90, 1353–1368.",
        "url": "https://doi.org/10.1785/0120000006"
      },
      {
        "text": "Trugman & Shearer (2017). GrowClust: A hierarchical clustering algorithm for relative earthquake relocation. SRL 88, 379–391.",
        "url": "https://doi.org/10.1785/0220160188"
      }
    ],
    "sources": [
      "https://doi.org/10.22541/essoar.15009811/v1",
      "https://doi.org/10.1785/0120000006",
      "https://doi.org/10.1785/0220160188"
    ],
    "section": "11:05   /   From timing graphs to locations"
  },
  {
    "title": "Cahuilla shows what changes between prelocation and local relocation",
    "lead": "The Cahuilla swarm in southern California provides a field comparison with the same 19,298 selected earthquakes in all three maps. Colour gives focal depth.",
    "kind": "figure",
    "notes": "The original figure selects the main-swarm area using the final location of each event and then follows the same IDs in all three views. Each panel has its own geographic axis limits; compare the ordinates, not the apparent length of an axis box.",
    "body": [
      "The diffuse starting locations become an elongated band in prelocation. After two local DD passes, individual strands are easier to follow. The paper maps the same events at each stage."
    ],
    "image": "sat_cahuilla_maps.png",
    "citation": [
      {
        "text": "Heimisson (2026), GraphSplit preprint, Figure 4a–c. Original figure, cropped to the three maps.",
        "url": "https://doi.org/10.22541/essoar.15009811/v1"
      }
    ],
    "sources": [
      "https://doi.org/10.22541/essoar.15009811/v1"
    ],
    "section": "11:05   /   From timing graphs to locations"
  },
  {
    "kind": "handoff",
    "title": "Open Start Here for the Saturday lab",
    "lead": "Open the extracted Saturday folder and double-click START_HERE.html. You can use the ready field measurements immediately.",
    "body": [
      "Run DDSync. In the same terminal, run GraphSplit. The guide shows the two commands and where each result appears.",
      "Open Catalogues.html to view the Iceland example. The guide shows how to load your starting catalogue and both relocated catalogues.",
      "At 14:05, return to slide 27 with the catalogue viewer open."
    ],
    "link": {
      "text": "Saturday lab guide on GitHub",
      "url": "https://github.com/eliasrh/DDCorr.jl/blob/main/teaching/saturday/START_HERE.md"
    },
    "notes": "Leave this slide up throughout the lab and lunch. Participants can use the completed reference at once if Julia is unavailable. Point out the one folder that contains workshop.jl before introducing the terminal.",
    "section": "12:00   /   Guided Saturday lab"
  },
  {
    "kind": "figure",
    "title": "Open the Iceland catalogues",
    "image": "catalogue_viewer.png",
    "lead": "The viewer opens with the completed reference run. Each symbol marks one earthquake at one stage. Initially, all three layers show the same 57 DD-supported event IDs.",
    "body": [
      "The left panel looks down on the epicentres. The right panel projects the same earthquakes onto an east–west vertical plane. The triangles mark preliminary locations."
    ],
    "notes": "Return from the guide with the browser visible. The viewer loads three native text catalogues. Use Open files from a different run to switch from the built-in reference to a newly calculated solution.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "table",
    "title": "What each file adds to the solution",
    "lead": "Open the folder runs/baseline created by the two commands. The supplied reference folder contains completed outputs in the same layout.",
    "rows": [
      [
        "Product",
        "What the student sees"
      ],
      [
        "sync_metrics.txt",
        "Counts and timing scatter for each station and phase."
      ],
      [
        "theta/ and thetastd/",
        "One relative time per supported event, together with its reference ID and timing uncertainty."
      ],
      [
        "graphsplit_output/",
        "Preliminary and DD catalogues, observation counts by event and the solver history."
      ]
    ],
    "body": [],
    "notes": "Input files and a private copy of the configuration also live in the working run folder. The reference folder stores the scientific output files needed to follow the examples.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "code",
    "title": "The original DYSA P measurement",
    "lead": "The pair header in dt.cc names the two catalogue IDs. One station/phase row follows. Its time is in seconds.",
    "command": "# 93 97 0.0\nZ7.DYSA   0.2972   0.490046   P",
    "codeLabel": "dt.cc · events 93 and 97",
    "body": [
      "The weight is the squared correlation coefficient from Friday. This DDSync configuration reads that weight directly."
    ],
    "notes": "The full header marks an event pair; the following rows in the same block may refer to other stations and phases.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "figure",
    "title": "Which station and phase groups retain their measurements?",
    "image": "field_sync_groups.png",
    "lead": "The coloured part of each bar counts the edges left after DDSync’s pruning. At DYSA, P keeps all 800 measured edges. At FLUR, P keeps 30 of its 51.",
    "body": [
      "MOFO P has 12 candidate edges and supplies no fitted group. Across all 22 input groups, 6,736 of 7,037 measured edges remain."
    ],
    "notes": "The axis counts timed event pairs at one station and phase. The program may also downweight a retained edge. The plot reproduces the n_edges and n_kept fields in sync_metrics.txt.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "table",
    "title": "Two fitted times reproduce the DYSA P difference",
    "lead": "The third column of theta_Z7.DYSA_P.txt identifies the common reference event. All three rows below refer to event 25.",
    "rows": [
      [
        "Event",
        "Time relative to event 25 (s)",
        "Reference"
      ],
      [
        "25",
        "0.000000",
        "25"
      ],
      [
        "93",
        "+0.322104",
        "25"
      ],
      [
        "97",
        "+0.024723",
        "25"
      ]
    ],
    "body": [
      "Subtracting the fitted times gives +0.297381 s. The original dt.cc value was +0.2972 s. The other DYSA P measurements have shifted this estimate by about 0.18 ms."
    ],
    "notes": "The full fitted difference is 0.297381478 s. With the input rounded to four decimals, the fitted-minus-recorded difference for this row is +0.1815 ms.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "table",
    "title": "The uncertainty file keeps the timing reference",
    "lead": "For the same DYSA P group, std_theta_Z7.DYSA_P.txt gives a timing standard deviation and a degree for each event. Degree counts neighbours in the retained timing graph.",
    "rows": [
      [
        "Event",
        "Reference",
        "Timing SD",
        "Degree"
      ],
      [
        "93",
        "25",
        "0.147 ms",
        "36"
      ],
      [
        "97",
        "25",
        "0.146 ms",
        "33"
      ],
      [
        "25",
        "25",
        "0 by definition",
        "43"
      ],
      [
        "2",
        "—",
        "unavailable",
        "0"
      ]
    ],
    "body": [
      "Both time estimates share event 25 as their zero. Uncertainty in the difference between two fitted times depends on their covariance."
    ],
    "notes": "Uncertainty values are rounded to three decimals in milliseconds. The reference has zero formal timing variance under the pinned gauge; its earthquake location still has uncertainty. A NaN is a missing estimate.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "table",
    "title": "How many earthquakes reach each stage?",
    "lead": "The input has 100 events. The two filtered catalogues list only earthquakes that contributed observations to the corresponding solve.",
    "rows": [
      [
        "Stage",
        "Supported events",
        "Equations used"
      ],
      [
        "Preliminary location",
        "65",
        "745 reference-to-event observations"
      ],
      [
        "Final double difference",
        "57",
        "4,815 station/phase observations on 409 pairs"
      ]
    ],
    "body": [
      "Eight earthquakes contribute to prelocation only. Thirty-five have no observations in either location solve. Their original catalogue IDs remain available."
    ],
    "notes": "Counts come from the filtered catalogues, flags in catalog_dd_graphmeta.csv and run_summary.toml. A missing row in a filtered file describes measurement support. A real event can be missing.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "figure",
    "title": "Candidate neighbours and measured neighbours",
    "image": "field_degrees.png",
    "lead": "The horizontal axis counts neighbours nominated by position. The vertical axis counts neighbours with enough shared timing observations to enter DD. Larger dots represent more earthquakes with the same two counts.",
    "body": [
      "Earthquake 2 has 15 geometric neighbours and zero DD neighbours. Event 5 has 20 geometric neighbours and 18 DD neighbours."
    ],
    "notes": "Use the two corresponding rows in catalog_dd_graphmeta.csv. The geometry degree can remain large when there are too few usable data at common stations.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "figure",
    "title": "Compare the same 57 epicentres",
    "image": "field_stages_map.png",
    "lead": "Each panel shows precisely the same event IDs with the same axes in kilometres. Local east increases to the right and local north upwards.",
    "body": [
      "Several scattered input epicentres move into tighter groups. The measurement-supported groups occupy only part of the original catalogue."
    ],
    "notes": "The plots omit input events without final DD support in all three panels. Use the population menu in Catalogues.html to display every available event. Local coordinates are referenced to the mean position of the input catalogue.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "figure",
    "title": "The depth distribution also changes",
    "image": "field_stages_depth.png",
    "lead": "The same 57 events are projected onto the east–west section. Depth increases downwards. Every panel includes the full north–south width of the sequence.",
    "body": [
      "These input depths span 5.80–7.14 km. The final depths span 5.58–7.81 km. Relative relocation can broaden the depth range even where some groups become sharper."
    ],
    "notes": "This section uses equal kilometre scales on both axes. Depth also trades off against velocity and origin time. A broad depth range is a property of this solution; it is not an independent measure of resolution.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "figure",
    "title": "How far did individual earthquakes move?",
    "image": "field_movements.png",
    "lead": "The horizontal distances and signed depth changes are calculated between the input and DD coordinates of the same 57 IDs. A positive depth change means that the earthquake moved deeper.",
    "body": [
      "The median horizontal displacement is 0.275 km. The median absolute depth change is 0.408 km. The dashed line on the right shows the median signed depth change."
    ],
    "notes": "Absolute depth change counts both directions as a distance. The final median signed depth change is −0.266 km. Carefully distinguish a solution displacement from an error estimate.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "kind": "table",
    "title": "Use the filtered catalogue for a scientific comparison",
    "lead": "Open catalog_dd_graphmeta.csv alongside the plots if a location seems to have vanished or stayed at its input position.",
    "rows": [
      [
        "File",
        "Rows in Iceland",
        "Interpretation"
      ],
      [
        "catalog_dd.txt",
        "100",
        "Includes earlier coordinates for events with no DD observations."
      ],
      [
        "catalog_dd_filt.txt",
        "57",
        "Only events with observations in the final solve."
      ],
      [
        "catalog_dd_graphmeta.csv",
        "100",
        "Gives both activity flags, graph degrees and station/phase counts."
      ],
      [
        "event_id_map.csv",
        "100",
        "Connects the integer ID to the original DDCorr event folder."
      ]
    ],
    "body": [],
    "notes": "When reporting on a population, name the file and which stage supplied the selection. Always match IDs before comparing positions.",
    "section": "14:05   /   Reading the Iceland results"
  },
  {
    "title": "How a list of pairs becomes a system of timing equations",
    "lead": "Each row names a pair. Place +1 under the first event and −1 under the second. Multiplying that row by the column of θ values gives the fitted difference for the pair.",
    "kind": "figure",
    "notes": "The first row times the vector of potentials is θ₁−θ₃. Adding the first two rows gives the third. This simple linear dependence is why the fitted times around any closed loop sum to zero. Reversing a row and its observed time together leaves the problem unchanged.",
    "body": [
      "These three rows are the incidence matrix of the DYSA triangle. The full DYSA P matrix follows the same rule for 800 measurements."
    ],
    "image": "sat_incidence.png",
    "section": "15:10   /   Inside the two inversions",
    "sources": []
  },
  {
    "title": "The graph Laplacian counts how the observations are connected",
    "lead": "Write B for the incidence matrix, W for the diagonal matrix of observation weights and d for the column of measured differences. Weighted least squares gives this system.",
    "kind": "equation",
    "notes": "For an update, every edge transfers information between its two events; a well-connected group has more independent routes tying it together. The implementation pins one event and adds a small numerical ridge to the reduced system. W contains the effective weights for the particular solve.",
    "body": [
      "The diagonal of L contains the sum of weights attached to each event. Off the diagonal, linked events contribute their negative edge weight.",
      "A common shift of all θ gives Bθ the same value. Fixing one θ per component removes that ambiguity."
    ],
    "equation": [
      "L θ = Bᵀ W d",
      "L = Bᵀ W B"
    ],
    "sources": [
      "https://doi.org/10.1785/0220260086",
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/src/DDSync.jl"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "Which inconsistencies are removed or downweighted?",
    "lead": "DDSync first fits the positively weighted observations within each component. A very large mismatch between an observed and a fitted time can remove that edge. The surviving graph is checked again for adequate support.",
    "kind": "figure",
    "notes": "The Julia implementation estimates a robust scale from the median absolute deviation for initial pruning, with a small numerical floor. The default pruning threshold is 20 scale units. A new pinned fit is made on each retained component, followed by up to ten iteratively reweighted least-squares iterations using 1.345 as the Huber transition. A multiplier is relative to the observation’s original weight.",
    "body": [
      "Among retained links, Huber reweighting reduces the influence of less extreme discrepancies. For a residual three times the fitted scale, the multiplier is about 0.45 under the classroom settings."
    ],
    "image": "sat_huber.png",
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/README.md"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "kind": "code",
    "title": "How DDSync calculates the weight of each surviving edge",
    "lead": "For every measured pair, the code subtracts its observed time from the difference of the fitted times. A large mismatch compared with the component scatter earns a smaller Huber multiplier.",
    "command": "r = theta_c[a] .- theta_c[b] .- dt_k\nscale = max(residualScale(r, w_eff), ROBUST_MIN_SCALE)\nwrob_c = huberWeight(r ./ scale, C_HUBER)\nw_eff = wb_k .* wrob_c",
    "codeLabel": "DDSyncJulia/src/DDSync.jl · lines 1126–1129",
    "body": [
      "Here a and b are the two event indices. wb_k is the original edge weight. DDSync multiplies that weight by wrob_c and fits the timing potentials again."
    ],
    "notes": "The Julia dots apply the operation separately to each edge. This is the refit after pruning. The next solve uses the reweighted edge vector and the same reference for the connected component.",
    "citation": [
      {
        "text": "DDSyncJulia/src/DDSync.jl · lines 1126–1129",
        "url": "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/src/DDSync.jl#L1126-L1132"
      }
    ],
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/src/DDSync.jl#L1126-L1132"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "A rejected station–phase graph can still contain real earthquakes",
    "lead": "At MOFO, Friday supplied 12 P observations. The classroom DDSync configuration requires at least 30 positive-weight edges and at least one cycle in a surviving timing component.",
    "kind": "table",
    "notes": "A component can fail before pruning or after pruning changes its connectivity. The count of omitted rows combines these eligibility decisions with residual-based edge rejection. It is not the number of false arrivals. Times for a tree can be fit exactly without any independent consistency check.",
    "body": [
      "No MOFO P component could meet that count. At the same station, 195 of 207 S measurements survived. Other stations can also contribute rows for these earthquakes."
    ],
    "rows": [
      [
        "Station–phase",
        "Input observations",
        "Kept observations"
      ],
      [
        "MOFO P",
        "12",
        "0"
      ],
      [
        "MOFO S",
        "207",
        "195"
      ],
      [
        "DYSA P",
        "800",
        "800"
      ]
    ],
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/README.md"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "Timing uncertainty depends on the paths to the reference",
    "lead": "At DYSA P, event 1 has 40 surviving links and a fitted timing uncertainty of 0.14 ms. Event 4 has four links and an uncertainty of 0.55 ms.",
    "kind": "figure",
    "notes": "The quantities are formal standard deviations of relative timing potentials for the fixed weights and fitted residual scale. The reference is pinned to zero by definition. For DYSA P, sigma_hat is about 0.468 ms and the uncertainty computation uses 0.5 ms, its configured minimum assumed edge scatter. That minimum is not a lower bound on an individual event’s timing uncertainty.",
    "body": [
      "The plot shows one point per supported non-reference event. Events with the same number of links can have different uncertainties because their link weights and routes to the reference differ."
    ],
    "image": "sat_uncertainty.png",
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/README.md"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "An inferred pair reuses uncertainty from both timing estimates",
    "lead": "Two events in the same timing graph often depend on some of the same observations. Their timing errors can therefore vary together.",
    "kind": "equation",
    "notes": "DDSync’s exact conditional estimate uses the appropriate diagonal of the grounded inverse weighted Laplacian times the square of the estimated residual scale. Pair covariances are not in the standard per-event files. GraphSplit takes hypot(stdᵢ,stdⱼ) and floors the resulting sigma at the solver’s minimum before constructing weights. A student should avoid inferring confidence solely from the number of recovered pair rows.",
    "body": [
      "The exact variance of a difference contains the covariance between the two fitted times.",
      "GraphSplit combines the two exported standard deviations in quadrature for a practical row weight. Shared errors and the dependence between many derived rows matter when interpreting formal uncertainties."
    ],
    "equation": "Var(θᵢ − θⱼ) = Var(θᵢ) + Var(θⱼ) − 2 Cov(θᵢ, θⱼ)",
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/docs/uncertainty.md",
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/src/Observations.jl"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "Which neighbours actually constrain event 1?",
    "lead": "Both maps place earthquakes at their prelocations, with event 1 at the star. The graph nominates 20 nearby partners. Twelve supply the six or more common station–phase observations required in this run.",
    "kind": "figure",
    "notes": "Each connecting line is an actual edge produced by the classroom GraphSplit configuration. The displayed origin is event 1 in each panel. Gray background points are prelocations, including closer events that do not qualify. The number of timing measurements in the original DT file does not specify the number of pairs in this local graph.",
    "body": [
      "Candidate pairs use a distance metric that includes depth. The panels show their east and north coordinates, so two sources at different depths may plot very close together."
    ],
    "image": "sat_neighbors.png",
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/src/EventGraph.jl",
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/src/Observations.jl"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "kind": "table",
    "title": "What changes if either earthquake can nominate a neighbour?",
    "lead": "A second run used the same locations, timings and settings. Only graph.mutual changed. At k = 20, a one-sided nomination increases the number of candidate neighbours.",
    "rows": [
      [
        "Iceland result",
        "Mutual nomination",
        "Either nomination"
      ],
      [
        "Geometric edges",
        "724",
        "1,256"
      ],
      [
        "Pairs with DD observations",
        "409",
        "574"
      ],
      [
        "DD observations",
        "4,815",
        "6,362"
      ],
      [
        "DD-supported events",
        "57",
        "59"
      ]
    ],
    "body": [
      "IDs 3 and 96 gain DD support. The preliminary catalogues are identical because the rule changes the second stage."
    ],
    "notes": "Independent reruns from the same input; this is not a second relocation iteration starting from the first result. See the clinic for running an individual comparison.",
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "kind": "figure",
    "title": "How sensitive are the common locations to that rule?",
    "image": "field_sensitivity.png",
    "lead": "Each point is one of the 57 earthquakes supported in both DD solutions. They are ranked by the three-dimensional separation of those two locations.",
    "body": [
      "The median difference is 189 m. The largest is 926 m. The robust timing RMS changes from 2.236 to 2.375 ms as the observation set grows."
    ],
    "notes": "Horizontal median separation is 100 m; median absolute depth change is 98 m. Separate fit populations cannot establish which set of coordinates is physically more accurate.",
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "A location update uses two small blocks per row",
    "lead": "For one pair and one station, an equation contains four derivatives for event i and four for event j. All the other event columns for that row are zero.",
    "kind": "equation",
    "notes": "The second block uses the travel-time gradient at event j with a minus sign, not the numeric gradient at i copied and negated. The default preconditioned conjugate gradient solver works on the damped normal equations; its block-Jacobi preconditioner treats four unknowns per event together. The sparse row structure limits storage but cannot supply missing station directions.",
    "body": [
      "The inner solver applies these rows to trial updates and returns the effect of all rows on each event. GraphSplit can do this without storing a full earthquake-by-earthquake matrix.",
      "The outer iteration recalculates travel times, derivatives and robust weights at the updated hypocentres."
    ],
    "equation": "Event i: [∂Tᵢ/∂x, ∂Tᵢ/∂y, ∂Tᵢ/∂z, 1]     Event j: opposite signs",
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/src/Solver.jl"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "kind": "code",
    "title": "How GraphSplit weights a relocation residual",
    "lead": "At the current trial locations, obs.dt is the observed θ difference and prediction is the modelled time difference for the same pair, station and phase.",
    "command": "residual = obs.dt .- prediction\nsigma = max.(obs.sigma, minimum_sigma)\nrobust = [huber_weight(residual[row] / sigma[row], huber_k) for row in eachindex(residual)]\nweight = robust ./ (sigma .^ 2)",
    "codeLabel": "src/Solver.jl · lines 374–377",
    "body": [
      "Divide the Huber multiplier by the squared timing uncertainty. This gives a less certain observation a smaller weight even when its normalized residual is small."
    ],
    "notes": "Unlike the earlier DDSync weighting, these residuals include a travel-time prediction. Each new outer iteration recomputes predictions, local derivatives and weights. The stage-specific minimum sigma prevents excessively high weights.",
    "citation": [
      {
        "text": "src/Solver.jl · lines 374–377",
        "url": "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/src/Solver.jl#L373-L378"
      }
    ],
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/src/Solver.jl#L373-L378"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "Timing zeros and location constraints act on different unknowns",
    "lead": "Adding the same correction to every origin time in a connected relocation problem leaves every differential prediction unchanged. A location solve must choose a reference for that shift.",
    "kind": "table",
    "notes": "Station-dependent travel times can constrain a spatial translation in principle, so it is not the same exact null direction as a common time shift. Disconnected location networks can have separate time freedoms requiring suitable handling. Known reference positions or absolute arrivals provide external information. A weak mean constraint or numerical damping cannot substitute for such observations.",
    "body": [
      "A common spatial move is often only weakly resolved, especially with distant or one-sided stations. The classroom gauge uses weak constraints on the mean spatial and time updates."
    ],
    "rows": [
      [
        "Choice",
        "Consequence"
      ],
      [
        "Pin θ at a reference event",
        "Defines time zero for one DDSync component."
      ],
      [
        "Constrain mean origin-time update",
        "Sets the common clock adjustment in the location solution."
      ],
      [
        "Constrain mean spatial update",
        "Limits movement of the catalogue as a whole relative to its starting frame."
      ]
    ],
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "kind": "figure",
    "title": "Reading the iteration history",
    "image": "field_iterations.png",
    "lead": "Each dot gives the robust RMS timing misfit at the start of an outer iteration. The left panel fits 745 preliminary observations. The right fits 4,815 DD observations.",
    "body": [
      "The last recorded RMS is 3.53 ms at preliminary iteration 38 and 2.24 ms at DD iteration nine. Evaluate the trend within each panel. The observation sets and weights differ between panels."
    ],
    "notes": "The table solver_history.csv also gives the size of the last update in metres and seconds. Model fit, stopping criteria, event support and the geological pattern all matter in interpreting the output. The RMS is a weighted aggregate. Weight changes between iterations can also alter its value. Smaller scatter in the fitted observations does not establish a more accurate absolute position. Independent arrival data, known source locations or sensitivity to the velocity model offer complementary checks.",
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "A matched cross section separates sharpening from loss of events",
    "lead": "The Cahuilla section follows the same 2,185 earthquake IDs through the input catalogue, prelocation and second local DD pass. The depth axis points downward in kilometres.",
    "kind": "figure",
    "notes": "C1 is a slice with a 0.22 km half-width and no vertical exaggeration. The displayed depth range is 5.0–8.6 km. Eighteen input positions and one in each later stage fall outside that range. Horizontal extents differ between panels; the physical tick labels provide the scale.",
    "body": [
      "A broad band of starting depths becomes a curved strand between roughly 5.5 and 8 km. In the Iceland report, using the same IDs in every panel makes that comparison possible for the dike sequence."
    ],
    "image": "sat_cahuilla_section.png",
    "citation": [
      {
        "text": "Heimisson (2026), GraphSplit preprint, Figure 4d–f. Original figure, cropped to section C1.",
        "url": "https://doi.org/10.22541/essoar.15009811/v1"
      }
    ],
    "sources": [
      "https://doi.org/10.22541/essoar.15009811/v1"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "Changing the velocity model changes relative locations",
    "lead": "Travel time and its gradient depend on wave speed. A slower shallow layer changes both the predicted arrival and the direction and length of the model update needed to fit it.",
    "kind": "story",
    "notes": "In the lab the starting hypocentres are a published model-derived catalogue, not known-source ground truth. The field differential times and a small residual do not determine the absolute accuracy of the assumed velocities. Differencing work benefits from a physically motivated starting model and awareness of station geometry.",
    "body": [
      "Nearby paths can share much of a model error. Unshared source-side structure, long star edges and poorly sampled directions still affect the result.",
      "When comparing candidate models, keep the IDs and observation rules fixed. A persistent change in depth or dip is model sensitivity."
    ],
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md",
      "https://doi.org/10.22541/essoar.15009811/v1"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "What a relocation uncertainty calculation can tell us",
    "lead": "One way to assess stability is to resample station–phase groups and repeat the local solve. An event that moves substantially when a station loses influence has a location that is sensitive to that coverage.",
    "kind": "table",
    "notes": "GraphSplit’s bootstrap keeps the nominal event graph and starts each replicate from the all-data solution. The number of supported replicates is itself informative. A full pipeline bootstrap would also resample the original measurements and rerun DDSync. Linearized covariance can appear small under strong regularization.",
    "body": [
      "The Saturday baseline uses the full station set. Uncertainty runs are optional. The resulting spread is conditional on the travel-time model, graph and upstream timing estimates."
    ],
    "rows": [
      [
        "Method",
        "What is varied"
      ],
      [
        "Station–phase bootstrap",
        "The multiplicity of station–phase groups in each repeated relocation."
      ],
      [
        "Regularized linearized uncertainty",
        "Small perturbations around the final fit with fixed derivatives, weights and constraints."
      ]
    ],
    "sources": [
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "Events 44 and 45 return to nearly the same location",
    "lead": "Events 44 and 45 start 244 m apart in the Iceland catalogue. They are 1.7 m apart after prelocation and 3.0 m apart after DD.",
    "kind": "figure",
    "notes": "The final catalogue assigns 20 DD partners and 258 observation incidences to each event. The review should examine original recording times and independent station waveforms before merging, deleting or interpreting nearby events. Genuine repeaters can also be located very close together.",
    "body": [
      "Each event has 20 DD partners and contributes to 258 station/phase observations. To interpret that close spacing, we can return to the original station recordings."
    ],
    "image": "sat_overlap.png",
    "section": "15:10   /   Inside the two inversions",
    "sources": []
  },
  {
    "kind": "figure",
    "title": "An apparent doublet in the relocated catalogue",
    "image": "lab_duplicate_utc.png",
    "lead": "At RODG, the S cuts for catalogue events 44 and 45 contain 9,495 identical overlapping east-component samples. The upper and lower traces here use the same UTC time axis.",
    "body": [
      "One cut begins six samples after the other. Inspect waveform timing at other stations and the two catalogue origins before treating these IDs as separate earthquakes."
    ],
    "notes": "These events are flags for review. Their separation is about 1.7 m after prelocation. Examine absolute origins, waveform provenance and other stations before interpreting two nearly coincident locations as separate earthquakes.",
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "title": "An earthquake can be well timed at one station and still lack a DD location",
    "lead": "For events 93 and 97 the fitted DYSA P difference is +0.29738 s. Friday’s direct measurement was +0.2972 s. This station contributes a very consistent relative time.",
    "kind": "story",
    "notes": "Both DYSA P timing values use reference 25. They are approximately +0.322104 and +0.024723 s. The local graph filters are applied after formation of the prelocation. Exclusion from the filtered result is about support under these settings. It is not evidence that the earthquake did not occur.",
    "body": [
      "Neither event enters the filtered local DD catalogue. Event 97 has prelocation support. Event 93 lacks even that level of support.",
      "The timing residual describes one observation. Locating an event requires enough independent information across stations, phases and local partners."
    ],
    "sources": [
      "https://github.com/eliasrh/DDSync/blob/3c38abb490d69c91f6fd90d7f6f445c2ffb98840/DDSyncJulia/README.md",
      "https://github.com/eliasrh/GraphSplit.jl/blob/541f518d89bc0a2d650c7a3d0aa16485e2a6a101/docs/MANUAL.md"
    ],
    "section": "15:10   /   Inside the two inversions"
  },
  {
    "kind": "break",
    "title": "Open clinic for your own catalogues",
    "lead": "16:00–18:00  ·  Bring your DDCorr results and a regional velocity model. We can work together on the first synchronization, the supported locations, or a change you want to understand.",
    "section": "16:00   /   Open catalogue clinic",
    "body": [
      "The Iceland input files and reference solution are available throughout the clinic."
    ],
    "notes": "Keep this slide on screen while participants choose their questions. The remaining pages are individual references for the facilitator. No task or submission is required. Participants without their own observations can use the Iceland files or examine the one-way nomination example."
  },
  {
    "kind": "table",
    "title": "Choose the four files from one DDCorr run",
    "lead": "Open the completed correlation directory. Its measurement file and three companion tables share a station naming convention and an event ID scheme.",
    "section": "16:00   /   Open catalogue clinic",
    "rows": [
      [
        "File",
        "What the downstream programs need"
      ],
      [
        "dt.cc",
        "Numbered event pairs, station names, differential times, weights and P/S phase."
      ],
      [
        "catalog.txt",
        "UTC origin, latitude, longitude, depth in km, magnitude field and the integer event ID."
      ],
      [
        "stations.txt",
        "The same station names as the observations, coordinates and elevation."
      ],
      [
        "event_id_map.csv",
        "The original event name for each numbered earthquake."
      ]
    ],
    "notes": "You can show the Iceland files in inputs. In this kit the three GraphSplit inputs come from the same DDCorr experiment and the original event names are retained in the fourth file. Select the entire result directory using --from. Unrelated catalogues with overlapping numbers cannot be combined by ID."
  },
  {
    "kind": "code",
    "title": "Keep your Friday run in a separate folder",
    "lead": "From the Saturday folder, replace the quoted text below with the path to your completed DDCorr result. Use the same run name for both stages.",
    "section": "16:00   /   Open catalogue clinic",
    "codeLabel": "Commands for a different Iceland correlation run",
    "command": "julia --threads=2 workshop.jl sync --from \"PATH TO RESULT\" --run friday\njulia --threads=2 workshop.jl relocate --run friday",
    "body": [
      "The output is in runs/friday. For a study in another region, add --config with your prepared configuration folder to the first command."
    ],
    "notes": "The first command copies the four measurements and metadata files and three settings/model files to the new experiment. The relocate stage then uses those copies. Spaces in file paths are supported when the path is quoted. The reference and earlier run folders are available for comparison."
  },
  {
    "kind": "figure",
    "title": "Choose a velocity model for your region",
    "lead": "The Iceland model in vm.txt specifies P- and S-wave speed at 19 depths. Each row gives depth below sea level in km, then Vp and Vs in km/s.",
    "section": "16:00   /   Open catalogue clinic",
    "image": "clinic_velocity_model.png",
    "body": [
      "Prepare a copy of config for another region. Replace vm.txt and set the lookup depth range and distance margin in DD.toml for the station and earthquake distribution."
    ],
    "notes": "The model shown comes from the local Bárðarbunga relocation work. Shallow velocities matter because all rays end at the stations. A model must represent the region and cover the source and receiver depths. A good fit to relative times alone cannot validate the chosen model. Absolute model agreement with the S1 catalogue has not been established. The same lookup is reused within a run. Do not bring an old lookup table into a new model experiment."
  },
  {
    "kind": "table",
    "title": "When an event has no fitted station time",
    "lead": "Open theta for the station and phase, then read the matching uncertainty and metrics files. Each row and its reference belong to that particular station and phase.",
    "section": "16:00   /   Open catalogue clinic",
    "rows": [
      [
        "Where to look",
        "How to read the result"
      ],
      [
        "theta/theta_Z7.DYSA_P.txt",
        "Event 1 has +0.014560 s relative to event 25. Event 2 has NaN in this group."
      ],
      [
        "thetastd/std_theta_Z7.DYSA_P.txt",
        "Event 1 has 40 retained partners and a fitted timing standard deviation of about 0.135 ms."
      ],
      [
        "sync_metrics.txt",
        "The Z7.DYSA_P group retained 800 of 800 input comparisons. Counts for other stations and phases differ."
      ]
    ],
    "body": [
      "A missing time at one station can coexist with support at another."
    ],
    "notes": "The theta file columns are event ID, fitted relative time in seconds and reference ID. The first four uncertainty columns are event ID, standard deviation in seconds, reference ID and degree. Group totals need not cover all 100 events. The programme prints station-phase files even for some entirely rejected groups; finite times and their references establish actual support."
  },
  {
    "kind": "table",
    "title": "When an event has no DD location",
    "lead": "Use catalog_dd_graphmeta.csv in graphsplit_output to find the event by its integer ID. A geometric neighbour can contribute a DD constraint only when it shares enough usable timing observations.",
    "section": "16:00   /   Open catalogue clinic",
    "rows": [
      [
        "Iceland baseline",
        "Event 1",
        "Event 3"
      ],
      [
        "Geometric neighbours",
        "20",
        "3"
      ],
      [
        "Prelocation equations",
        "8",
        "15"
      ],
      [
        "Pairs carrying DD equations",
        "12",
        "0"
      ],
      [
        "DD equations",
        "74",
        "0"
      ]
    ],
    "body": [
      "Event 3 appears in the preliminary filtered catalogue. It has no supported row in the final filtered catalogue."
    ],
    "notes": "geometry_degree is the candidate degree, dd_pair_degree the count of accepted DD neighbours. prelocation_used and relocation_used are the final use flags. Event 3 is a particularly clear demonstration of a preliminary solution with no final DD support. Use *_filt.txt when discussing solved locations. The full catalogue can retain coordinates carried through for unsupported events."
  },
  {
    "kind": "code",
    "title": "Try the other neighbour rule on the same observations",
    "lead": "Copy the config folder to config-one-way. In its existing [graph] section in DD.toml, change mutual to false and keep neighbors at 20.",
    "section": "16:00   /   Open catalogue clinic",
    "command": "julia --threads=2 workshop.jl sync --run one-way --config config-one-way\njulia --threads=2 workshop.jl relocate --run one-way",
    "codeLabel": "An independent comparison with the Iceland baseline",
    "body": [
      "The second run starts from the same input catalogue. A pair can enter the candidate graph if either earthquake selects the other."
    ],
    "notes": "This experiment holds the velocity model, picks, observation requirements and geometry parameters fixed, except for mutual. The handout logs and input copies are preserved by the named-run design. The native code rebuilds the same prelocation and its fitted catalogue is identical in this example. The candidate nomination is not itself a timing observation."
  },
  {
    "kind": "table",
    "title": "How many new pairs actually constrain locations?",
    "lead": "With either-direction nominations the Iceland run gains 532 candidate pairs. Only 165 additional pairs contribute to the DD solve.",
    "section": "16:00   /   Open catalogue clinic",
    "rows": [
      [
        "Iceland100, k = 20",
        "Mutual nominations",
        "Either nomination"
      ],
      [
        "Geometric candidate pairs",
        "724",
        "1,256"
      ],
      [
        "Pairs with DD observations",
        "409",
        "574"
      ],
      [
        "DD observations",
        "4,815",
        "6,362"
      ],
      [
        "Events with DD locations",
        "57",
        "59"
      ]
    ],
    "body": [
      "The two additional event IDs are 3 and 96. On the 57 shared events the median three-dimensional difference between solutions is 189 m."
    ],
    "notes": "This is a completed independent rerun that changes graph.mutual only. The preliminary locations are byte-identical. The DD residual distributions change because the equations differ. The 90th percentile of the 3-D differences was 255 m and the maximum 926 m, based on differences of GraphSplit’s local east, north and positive-down depth output in metres. These are sensitivity statistics, not errors against ground truth."
  },
  {
    "kind": "table",
    "title": "Open the results for the experiment you chose",
    "lead": "Open Catalogues.html and expand “Open files from a different run”. Use all three files from the same experiment, then click “Display selected files”.",
    "section": "16:00   /   Open catalogue clinic",
    "rows": [
      [
        "File chooser",
        "Example for runs/one-way"
      ],
      [
        "Input catalogue",
        "catalog.txt"
      ],
      [
        "Preliminary catalogue",
        "graphsplit_output/catalog_preloc_filt.txt"
      ],
      [
        "DD catalogue",
        "graphsplit_output/catalog_dd_filt.txt"
      ]
    ],
    "body": [
      "Choose “Present in every loaded catalogue” to compare matched IDs across the three stages. The event menu and the map use the same numbers as the catalogue files."
    ],
    "notes": "The default viewer opens with bundled reference data until the user imports a file. “Local files” confirms the switch. For an exact baseline-versus-one-way comparison, the same event IDs must be matched across two independent experiments; the table on the preceding slide uses these 57 IDs. The default three plotted layers are input, preliminary and DD from a single run."
  },
  {
    "kind": "story",
    "title": "Keep the evidence behind a location",
    "lead": "Save the complete run folder. The input, model and settings explain how each location was obtained.",
    "section": "16:00   /   Open catalogue clinic",
    "body": [
      "Use sync_metrics.txt and the station-phase theta files to trace a timing measurement. Use catalog_dd_graphmeta.csv to check whether the event contributed observations at either stage.",
      "Keep the filtered catalogues, solver_history.csv and run_summary.toml with the map. The event ID map leads back to the original recordings."
    ],
    "notes": "For reporting, state the number of original and supported events, region and timing data, differences in coverage across stages, chosen velocity model and what was actually compared. A residual on synchronized times measures model–data fit. External calibration, other station geometries or controlled perturbations answer different scientific questions."
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
        "authors": "Ágústsdóttir, T., Winder, T., Woods, J., White, R. S., Greenfield, T., & Brandsdóttir, B. (2019)",
        "detail": "Intense seismicity during the 2014–2015 Bárðarbunga-Holuhraun rifting event, Iceland, reveals the nature of dike-induced earthquakes and caldera collapse mechanisms. Journal of Geophysical Research: Solid Earth 124, 8331–8357.",
        "doi": "https://doi.org/10.1029/2018JB016010",
        "url": "https://doi.org/10.1029/2018JB016010"
      },
      {
        "authors": "University of Cambridge (2010–2015)",
        "detail": "Northern Volcanic Zone, Iceland. Seismic network Z7. EarthScope seismic archive.",
        "doi": "https://doi.org/10.7914/SN/Z7_2010",
        "url": "https://doi.org/10.7914/SN/Z7_2010"
      }
    ],
    "notes": "Published references and DOI links.",
    "sources": [
      "https://doi.org/10.1016/j.epsl.2018.03.020",
      "https://doi.org/10.1029/2018JB016010"
    ],
    "section": "References"
  }
];
