"Merge known TOML keys recursively, rejecting misspellings and table/value conflicts."
function merge_checked!(dest, overrides, prefix="")
    overrides isa AbstractDict || error("Expected a TOML table for $(rstrip(prefix, '.'))")
    for (key,value) in overrides
        haskey(dest,key) || error("Unknown configuration key $(prefix)$(key)")
        if dest[key] isa AbstractDict
            value isa AbstractDict || error("$(prefix)$(key) must be a TOML table")
            merge_checked!(dest[key],value,"$(prefix)$(key).")
        else
            value isa AbstractDict && error("$(prefix)$(key) must be a value, not a table")
            expected=dest[key]
            compatible_type = expected isa Bool ? value isa Bool :
                expected isa Integer ? (value isa Integer && !(value isa Bool)) :
                expected isa Real ? (value isa Real && !(value isa Bool)) :
                expected isa AbstractString ? value isa AbstractString :
                expected isa AbstractVector ? value isa AbstractVector : typeof(value)==typeof(expected)
            compatible_type || error("$(prefix)$(key) has the wrong TOML value type")
            dest[key]=value
        end
    end
    dest
end

"Load the small public configuration plus documented advanced defaults."
function load_config(path)
    path=abspath(path); isfile(path) || error("Configuration not found: $path")
    cfg=TOML.parsefile(joinpath(@__DIR__,"advanced.toml"))
    user=TOML.parsefile(path)
    advanced=pop!(user,"advanced",Dict{String,Any}())
    Set(keys(advanced)) ⊆ Set(["file"]) || error("Only advanced.file is supported")
    if haskey(advanced,"file")
        # Older run files can still supply an extra layer of overrides.
        overrides=TOML.parsefile(normpath(joinpath(dirname(path),advanced["file"])))
        if haskey(overrides,"downstream")
            @warn "Ignoring the retired downstream settings. Configure DDSync and GraphSplit in their respective packages."
            delete!(overrides,"downstream")
        end
        # Previously this duplicate S setting was always superseded by S.min_components.
        s_phase=get(get(overrides,"phase",Dict()),"S",Dict())
        pop!(s_phase,"min_components",nothing)
        merge_checked!(cfg,overrides)
    end
    # Assemble one schema before applying the run file. The interface defaults
    # retain their historical precedence over a legacy advanced.file.
    common=pop!(cfg,"interface")
    for group in ("input","output")
        merge!(cfg[group],common[group])
    end
    for group in ("plots","matrices")
        cfg[group]=common[group]
    end
    short_phase=Dict(ph=>pop!(user,ph,Dict{String,Any}()) for ph in ("P","S"))
    for ph in ("P","S")
        merge!(cfg["phase"][ph],common[ph])
    end
    merge_checked!(cfg,user)
    for ph in ("P","S")
        short=short_phase[ph]
        short isa AbstractDict || error("$ph must be a TOML table")
        nested=get(get(user,"phase",Dict()),ph,Dict())
        duplicates=intersect(keys(short),keys(nested))
        isempty(duplicates) || error("Set $(join(sort!(collect(duplicates)), ", ")) once under [$ph] or [phase.$ph]")
        merge_checked!(cfg["phase"][ph],short,"$ph.")
    end
    cfg["input"]["sac_root"]=normpath(joinpath(dirname(path),pop!(cfg["input"],"sac_dir")))
    cfg["output"]["root"]=normpath(joinpath(dirname(path),pop!(cfg["output"],"directory")))
    cfg["runtime"]["cache_dir"]=normpath(joinpath(dirname(path),cfg["runtime"]["cache_dir"]))
    for ph in ("P","S")
        cfg["phase"][ph]["pick_header"]=lowercase(pop!(cfg["input"],lowercase(ph)*"_pick_header"))
    end
    cfg["preprocess"]["noise_pick_header"]=="auto" &&
        (cfg["preprocess"]["noise_pick_header"]=cfg["phase"]["P"]["pick_header"])
    cfg["preprocess"]["origin_tolerance_s"]=cfg["input"]["origin_tolerance_s"]
    cfg["configuration_source"]=path
    validate_config(cfg)
    cfg
end

function validate_config(cfg)
    finite(x)=x isa Real && !(x isa Bool) && isfinite(x)
    cfg["input"]["depth_unit"] in ("km","m") || error("input.depth_unit must be km or m")
    cfg["input"]["station_epoch_policy"] in ("skip","error","split") || error("input.station_epoch_policy must be skip, error or split")
    cfg["quality"]["polarity"] in ("positive","absolute") || error("polarity must be positive or absolute")
    cfg["output"]["weight"] in ("cc","cc_squared") || error("weight must be cc or cc_squared")
    cfg["output"]["coefficient_lag"] in ("sampled","fitted") || error("output.coefficient_lag must be sampled or fitted")
    0<=cfg["output"]["dt_decimals"]<=9 || error("output.dt_decimals must be 0..9")
    cfg["runtime"]["max_events"]>=0 || error("max_events must be >=0")
    0<=cfg["preprocess"]["trace_taper_fraction"]<=0.1 || error("Trace taper must be in [0,0.1]")
    nw=cfg["preprocess"]["noise_window_s"]
    length(nw)==2 && all(finite,nw) && nw[1]<nw[2]<0 || error("Noise window must end before P")
    cfg["quality"]["max_pair_distance_km"]>=0 || error("Negative pair distance")
    cfg["quality"]["boundary_guard_samples"]>=1 || error("Boundary guard must be >=1")
    cfg["input"]["station_coordinate_tolerance_deg"]>=0 || error("Negative station coordinate tolerance")
    cfg["input"]["station_elevation_tolerance_m"]>=0 || error("Negative station elevation tolerance")
    0<=cfg["input"]["component_inclination_tolerance_deg"]<45 || error("Component inclination tolerance must be in [0,45)")
    cfg["quality"]["component_pick_tolerance_s"]>=0 || error("Negative component pick tolerance")
    cfg["input"]["origin_tolerance_s"]>=0 || error("Negative origin tolerance")
    cfg["input"]["coordinate_tolerance_deg"]>=0 || error("Negative coordinate tolerance")
    cfg["input"]["depth_tolerance_km"]>=0 || error("Negative depth tolerance")
    0<=cfg["preprocess"]["orientation_tolerance_deg"]<=180 || error("Invalid orientation tolerance")
    haskey(PICK_FIELDS,lowercase(cfg["preprocess"]["noise_pick_header"])) || error("Unknown noise pick header")
    cfg["runtime"]["max_pairs_per_group"]>=0 || error("Negative pair budget")
    cfg["runtime"]["max_group_memory_mib"]>0 || error("Memory planning allowance must be positive")
    0<cfg["output"]["near_identity_cc"]<=1 || error("near_identity_cc must be in (0,1]")
    cfg["plots"]["max_examples"]>=0 || error("max_examples must be >=0")
    for pair in cfg["plots"]["event_pairs"]
        pair isa AbstractVector && length(pair)==2 && all(x->x isa Integer && x>0,pair) && pair[1]!=pair[2] ||
            error("plots.event_pairs requires distinct positive output IDs, e.g. [[1, 2]]")
    end
    isempty(cfg["plots"]["event_pairs"]) || isempty(cfg["plots"]["original_event_pairs"]) || error("Choose event_pairs OR original_event_pairs, not both")
    for pair in cfg["plots"]["original_event_pairs"]
        pair isa AbstractVector && length(pair)==2 && all(x->x isa String && !isempty(x),pair) && pair[1]!=pair[2] || error("original_event_pairs requires two different folder labels")
    end
    all(x->x isa String,cfg["plots"]["example_stations"]) || error("example_stations must be station strings")
    !isempty(cfg["plots"]["example_phases"]) && all(x->x in ("P","S"),cfg["plots"]["example_phases"]) || error("example_phases must contain P and/or S")
    cfg["diagnostics"]["max_requested_examples"]>0 || error("max_requested_examples must be positive")
    cfg["matrices"]["max_plot_events"]>0 && cfg["matrices"]["max_plot_groups"]>0 || error("Matrix plot limits must be positive")
    cfg["matrices"]["max_dense_events"]>0 || error("max_dense_events must be positive")
    cfg["matrices"]["max_dense_cells"]>0 || error("max_dense_cells must be positive")
    cfg["diagnostics"]["max_closure_triangles"]>0 || error("max_closure_triangles must be positive")
    for ph in ("P","S")
        pc=cfg["phase"][ph]
        all(k->length(pc[k])==2 && all(finite,pc[k]),("window_s","band_hz")) || error("$ph windows/bands require two finite numbers")
        a,b=pc["window_s"];lo,hi=pc["band_hz"];fs=pc["sample_rate_hz"]
        0<lo<hi<0.45fs || error("Invalid $ph band: high corner must be below 0.45 times sample rate")
        a<b && pc["max_lag_s"]>0 || error("Invalid $ph window/lag")
        isapprox((b-a)*fs,round((b-a)*fs);atol=1e-8) || error("$ph window length must be on sample grid")
        isapprox(pc["max_lag_s"]*fs,round(pc["max_lag_s"]*fs);atol=1e-8) || error("$ph lag must be on sample grid")
        pc["max_lag_s"]*fs>=cfg["quality"]["boundary_guard_samples"]+1 || error("$ph lag search too short for boundary guard")
        0<pc["min_cc"]<=1 && 0<=pc["min_peak_gap"]<1 || error("Invalid $ph correlation threshold")
        1<=pc["filter_order"]<=8 || error("filter_order must be 1..8")
        pc["filter_padding_s"]>=3/lo || error("$ph padding must cover at least three low-frequency periods; set filter_padding_s under [$ph] in the run TOML")
        pc["min_components"]>=1 && pc["min_snr"]>=0 || error("Invalid $ph components/SNR")
        pc["sidelobe_exclusion_s"]>=0 || error("Negative sidelobe exclusion")
        haskey(PICK_FIELDS,lowercase(pc["pick_header"])) || error("Unknown $ph SAC pick header")
    end
    cfg
end
