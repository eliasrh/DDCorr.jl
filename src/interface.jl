"Resolve user-facing folder names once, before the station/phase work starts."
function resolve_requested_pairs!(cfg,events)
    plots=cfg["plots"]
    names=Dict(e.name=>e.id for e in events)
    if !isempty(plots["original_event_pairs"])
        plots["event_pairs"]=[begin
            all(x->haskey(names,x),p) || error("Unknown folder in original_event_pairs: $p. Read event_id_map.csv.")
            sort([names[p[1]],names[p[2]]])
        end for p in plots["original_event_pairs"]]
    end
    for pair in plots["event_pairs"]
        all(i->1<=i<=length(events),pair) || error("Unknown event_id in requested pair $pair; read event_id_map.csv")
    end
    plots["event_pairs"]=unique([sort(Int.(p)) for p in plots["event_pairs"]])
    nothing
end

"Describe the actual files in this inspection or correlation directory."
function write_run_guide(out,cfg,mode,status)
    exclusions=joinpath(out,"station_exclusions.csv")
    nexcluded=isfile(exclusions) ? max(0,countlines(exclusions)-1) : 0
    open(joinpath(out,"run_info.toml"),"w") do io
        TOML.print(io,Dict("mode"=>mode,"status"=>status,
            "excluded_stations"=>nexcluded,
            "configuration"=>cfg["configuration_source"],"sac_directory"=>cfg["input"]["sac_root"],
            "directory_time_zone"=>"UTC","entry_point"=>status=="failed" ? "failure.txt" : mode=="inspect" ? "phase_readiness.csv" : cfg["plots"]["enabled"] ? "report.html" : "run_summary.toml");sorted=true)
    end
    descriptions=Dict(
      "input_issues.csv"=>"Header problems. An empty table means none were found.",
      "station_epochs.csv"=>"Recorded station coordinates and any explicitly requested station-code splits, by source file. Group numbers identify locations, not chronological epochs.",
      "station_exclusions.csv"=>"Stations omitted from all events and both phases because coordinates conflict; reasons, counts and coordinate ranges.",
      "failure.txt"=>"Why this run stopped. Partial exports from failed runs must not be used for relocation.",
      "phase_readiness.csv"=>"Pick and window availability; ready does not yet test SNR.",
      "inventory.csv"=>"Decoded SAC metadata, one row per file.",
      "event_id_map.csv"=>"event_id is the new integer; original_event_id is the folder label.",
      "catalog.txt"=>"Origin and location, optional penultimate SAC magnitude, and final sequential event ID. See event_id_map.csv for magnitude availability.",
      "stations.txt"=>"Station coordinates; elevation in metres.",
      "dt.cc"=>"Accepted differential travel times for DDSync; no self-pairs.",
      "correlations.csv"=>"Accepted pairs with signed coefficient, lag, SNR and components.",
      "group_summary.csv"=>"Accepted/rejected pair counts for each station and phase.",
      "preprocessing_issues.csv"=>"Traces excluded before pair correlation, including low SNR.",
      "rejected_pairs.csv"=>"Optional per-pair rejection reasons.",
      "near_identity.csv"=>"High-similarity flags to review; no automatic deletion.",
      "example_selection.csv"=>"Exactly which pairs, stations and phases the report displays.",
      "event_connectivity.csv"=>"Number of distinct linked events, including zero.",
      "report.html"=>"OPEN THIS in a web browser to view the diagnostic PNG figures.",
      "report_data.jls"=>"Internal Julia report data; not an input for students to edit.",
      "effective_config.toml"=>"The settings used for this run, including defaults and overrides.",
      "software_provenance.toml"=>"Julia version and source hashes.",
      "run_summary.toml"=>"Event/observation counts and timing conventions.",
      "run_info.toml"=>"Run type, completion status and input/configuration paths.",
      "matrices"=>"Open index.csv for sparse/dense filenames and matrix_plots.csv for PNG status.")
    open(joinpath(out,"README.txt"),"w") do io
        println(io,"DDCorr $(uppercase(mode))\nStatus: $status\nFolder time is UTC.\n")
        nexcluded>0 && println(io,"WARNING: $nexcluded station(s) excluded for conflicting coordinates. See station_exclusions.csv and station_epochs.csv. Other stations are processed normally.\n")
        println(io,status=="failed" ? "This run failed. Read failure.txt. Do not use partial relocation exports.\n" : mode=="inspect" ? "This is a header-only inspection. It intentionally has no dt.cc or correlation figures.\nRun the same command without --inspect to calculate correlations in a new correlate_... folder.\n" : "This is a correlation run. Open report.html in a browser when figures are enabled.\nKeep this directory's catalog, ID map and dt.cc together: they describe the same event IDs.\n")
        for f in sort(readdir(out))
            f=="README.txt" && continue
            meaning=get(descriptions,f,endswith(f,".png") ? "Raster diagnostic figure, also linked from report.html." : "Diagnostic data associated with this run.")
            println(io,f,"\n  ",meaning)
        end
    end
end

"Bound explicit example storage before reading/filtering groups."
function check_example_budget(groups,cfg)
    p=cfg["plots"]
    p["enabled"] && (p["examples"] || p["filters"]) && !isempty(p["event_pairs"]) || return 0
    potential=0
    for ((station,phase),entries) in groups
        (isempty(p["example_stations"]) || station in p["example_stations"]) && phase in p["example_phases"] || continue
        ids=Set(e.id for (e,h) in entries)
        potential+=count(pair->all(i->i in ids,pair),p["event_pairs"])
    end
    potential<=cfg["diagnostics"]["max_requested_examples"] || error("Explicit selection could store $potential station/phase examples before quality checks. Narrow example_stations/example_phases or raise diagnostics.max_requested_examples deliberately.")
    potential
end
