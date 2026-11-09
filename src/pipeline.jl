struct Observation
    i::Int
    j::Int
    station::String
    phase::String
    dt::Float64
    lag::Float64
    cc::Float64
    second_cc::Float64
    gap::Float64
    snr::Float64
    ncomponents::Int
    distance::Float64
    components::String
end

function compatible(a,b,tol)
    for k in (58,59)
        x,y=a.header.floats[k],b.header.floats[k]
        if isfinite(x) && isfinite(y)
            diff=k==58 ? abs(mod(x-y+180,360)-180) : abs(x-y)
            diff<=tol || return false
        elseif isfinite(x)!=isfinite(y)
            return false
        end
    end
    return true
end

function group_fingerprint(entries,pc,cfg)
    # Change the algorithm version whenever numerical behavior changes.
    io=IOBuffer();print(io,"DDCorr-v0.2.0\n")
    for file in ("sac.jl","signal.jl","pipeline.jl")
        write(io,read(joinpath(@__DIR__,file)))
    end
    print(io,cfg["output"]["write_rejected_pairs"]); TOML.print(io,Dict("plots"=>cfg["plots"]))
    TOML.print(io,Dict("phase"=>pc,"preprocess"=>cfg["preprocess"],"quality"=>cfg["quality"]))
    for (e,h) in entries
        s=stat(h.path); digest=open(sha256,h.path); print(io,e.id,' ',e.origin,' ',e.latitude,' ',e.longitude,' ',channelkey(h),' ',h.path,' ',s.size,' ',bytes2hex(digest),'\n')
    end
    bytes2hex(sha256(take!(io)))
end

function process_group(station,phase,entries,cfg)
    pc=cfg["phase"][phase]; quality=cfg["quality"]
    n_events=length(unique(e.id for (e,h) in entries)); pairs=n_events*(n_events-1)÷2
    budget=cfg["runtime"]["max_pairs_per_group"]
    budget>0 && pairs>budget && error("$station $phase needs $pairs event pairs, above runtime.max_pairs_per_group=$budget. Use a smaller event set or raise the documented allowance deliberately.")
    # Conservatively budget raw/filter/resampler temporaries plus cached windows.
    fs=pc["sample_rate_hz"]; ncore=round(Int,diff(pc["window_s"])[1]*fs)+1; nlag=round(Int,pc["max_lag_s"]*fs)
    nfft=nextpow(2,2ncore+2nlag-1)
    estimate=maximum((Int(h.ints[10]) for (e,h) in entries);init=0)*8*10 + length(entries)*(8*(ncore+4nlag+1)+32*(nfft÷2+1))
    estimate>cfg["runtime"]["max_group_memory_mib"]*2^20 && error("$station $phase estimated work memory $(round(estimate/2^20;digits=1)) MiB exceeds runtime.max_group_memory_mib. Reduce events/windows or explicitly raise the planning allowance.")
    prepared=Dict{Int,Dict{String,CachedTrace}}(); issues=Tuple{String,String}[]
    for (e,h) in entries
        try
            c=prepare(e,h,pc,cfg["preprocess"])
            traces=get!(prepared,e.id,Dict{String,CachedTrace}())
            key=channelkey(h)
            haskey(traces,key) && error("Duplicate event/channel SAC file")
            traces[key]=c
        catch err
            # Data problems are audited; programming/API errors must stop the run.
            err isa ErrorException || rethrow()
            push!(issues,(h.path,sprint(showerror,err)))
        end
    end
    ids=sort(collect(keys(prepared))); n=length(ids)
    rows_by_i=[Observation[] for _ in 1:n]
    count_by_i=[Dict{String,Int}() for _ in 1:n]
    hist_by_i=[zeros(Int,40) for _ in 1:n]
    rejects_by_i=[Tuple[] for _ in 1:n]
    if n>=2
        sample=first(values(prepared[ids[1]]))
        # Allocate plans serially; worker tasks own their buffers even if tasks migrate.
        nw=min(Threads.nthreads(),n-1)
        work=[CorrelationWorkspace(sample.nfft,sample.nlag) for _ in 1:nw]
        @sync for worker in 1:nw
            Threads.@spawn begin
                w=work[worker]; totalcurve=similar(w.curve)
                for ia in worker:nw:n-1
                    A=prepared[ids[ia]]
                    for ib in ia+1:n
                        B=prepared[ids[ib]]
                        common=sort(intersect(collect(keys(A)),collect(keys(B))))
                        filter!(k->compatible(A[k],B[k],cfg["preprocess"]["orientation_tolerance_deg"]),common)
                        state=""; obs=nothing; measured=nothing
                        if length(common)<pc["min_components"]
                            state="insufficient_components"
                        else
                            a,b=A[common[1]],B[common[1]]
                            distance=haversine(a.event,b.event)
                            if quality["max_pair_distance_km"]>0 && distance>quality["max_pair_distance_km"]
                                state="pair_distance"
                            else
                                fill!(totalcurve,0)
                                snr=Inf
                                for key in common
                                    totalcurve .+= correlation!(w,A[key],B[key])
                                    snr=min(snr,A[key].snr,B[key].snr)
                                end
                                totalcurve ./= length(common)
                                m=measure(totalcurve,pc,quality); measured=m; state=m.status
                                bin=clamp(floor(Int,(m.cc+1)*20)+1,1,40)
                                hist_by_i[ia][bin]+=1
                                if state=="accepted"
                                    # Individual component picks can differ slightly: each component
                                    # must have the same reduced pick difference before curve stacking.
                                    bases=[A[k].reduced_pick-B[k].reduced_pick for k in common]
                                    if maximum(bases)-minimum(bases)>quality["component_pick_tolerance_s"]
                                        state="component_pick_mismatch"
                                    else
                                        obs=Observation(ids[ia],ids[ib],station,phase,mean(bases)-m.lag,m.lag,m.cc,
                                            m.second_cc,m.gap,snr,length(common),distance,join(common,';'))
                                        push!(rows_by_i[ia],obs)
                                    end
                                end
                            end
                        end
                        count_by_i[ia][state]=get(count_by_i[ia],state,0)+1
                        if cfg["output"]["write_rejected_pairs"] && state!="accepted"
                            push!(rejects_by_i[ia],(ids[ia],ids[ib],station,phase,state,
                                  measured===nothing ? NaN : measured.cc,measured===nothing ? NaN : measured.lag))
                        end
                    end
                end
            end
        end
    end
    rows=reduce(vcat,rows_by_i;init=Observation[])
    counts=Dict{String,Int}()
    for d in count_by_i,(k,v) in d;counts[k]=get(counts,k,0)+v;end
    hist=reduce(+,hist_by_i;init=zeros(Int,40))
    # Only accepted observations qualify for pictures. Explicit requested pairs
    # use the same computed observations and curves as scientific outputs.
    examples=NamedTuple[]
    if cfg["plots"]["enabled"] && (cfg["plots"]["examples"] || cfg["plots"]["filters"]) && !isempty(rows) && (isempty(cfg["plots"]["example_stations"]) || station in cfg["plots"]["example_stations"]) && phase in cfg["plots"]["example_phases"]
        requested=Set(Tuple(sort(Int.(pair))) for pair in cfg["plots"]["event_pairs"])
        selected=if isempty(requested)
            ranked=sort(rows;by=x->(abs(x.cc),x.i,x.j))
            ranked[unique([1,cld(length(ranked),2),length(ranked)])]
        else
            filter(r->(r.i,r.j) in requested,rows)
        end
        # Store a bounded set per group; globally capped again by the report.
        isempty(requested) && (selected=selected[1:min(length(selected),max(1,cfg["plots"]["max_examples"]))])
        for row in selected
            keys=split(row.components,';');A=prepared[row.i];B=prepared[row.j]
            w=CorrelationWorkspace(A[keys[1]].nfft,A[keys[1]].nlag);curve=zeros(length(w.curve))
            for k in keys;curve .+= correlation!(w,A[k],B[k]);end
            curve ./= length(keys)
            push!(examples,(row=row,a=A[keys[1]],b=B[keys[1]],curve=curve))
        end
    end
    return (station=station,phase=phase,rows=rows,counts=counts,hist=hist,issues=issues,
            examples=examples,prepared_events=n,files=length(entries),rejected=reduce(vcat,rejects_by_i;init=Tuple[]))
end

function write_inputs(events,results,out,cfg)
    open(joinpath(out,"catalog.txt"),"w") do io
        # Numeric columns: Y M D h m seconds latitude longitude depth_km ID.
        for e in events
            dt=unix2datetime(floor(e.origin)); secs=second(dt)+mod(e.origin,1)
            @printf(io,"%04d %02d %02d %02d %02d %.6f %.7f %.7f %.4f %d\n",
                year(dt),month(dt),day(dt),hour(dt),minute(dt),secs,e.latitude,e.longitude,e.depth,e.id)
        end
    end
    stations=Dict{String,Vector{Vector{Float64}}}()
    for e in events,h in e.headers
        coords=h.floats[[32,33,34]]
        all(isfinite,coords) || continue
        push!(get!(stations,stationkey(h),Vector{Float64}[]),coords)
    end
    open(joinpath(out,"stations.txt"),"w") do io
        for key in sort(collect(keys(stations)))
            coords=reduce(hcat,stations[key])
            maximum(coords[1,:])-minimum(coords[1,:])<=cfg["input"]["station_coordinate_tolerance_deg"] &&
            maximum(coords[2,:])-minimum(coords[2,:])<=cfg["input"]["station_coordinate_tolerance_deg"] &&
            maximum(coords[3,:])-minimum(coords[3,:])<=cfg["input"]["station_elevation_tolerance_m"] || error("Station $key moved; split station epochs before export")
            @printf(io,"%s %.7f %.7f %.3f\n",key,median(coords[1,:]),median(coords[2,:]),median(coords[3,:]))
        end
    end
    rows=reduce(vcat,[r.rows for r in results];init=Observation[])
    sort!(rows;by=r->(r.i,r.j,r.station,r.phase))
    all(r->haskey(stations,r.station),rows) || error("Accepted observation has no station coordinates")
    open(joinpath(out,"dt.cc"),"w") do io
      open(joinpath(out,"correlations.csv"),"w") do audit
        csvrow(audit,"event_i","event_j","station","phase","dt_s","lag_B_later_s","cc_signed","weight","second_peak","peak_gap","minimum_snr","ncomponents","distance_km","components")
        previous=(0,0)
        for r in rows
            pair=(r.i,r.j)
            if pair!=previous;println(io,"# $(r.i) $(r.j) 0.0");previous=pair;end
            weight=cfg["output"]["weight"]=="cc_squared" ? r.cc^2 : abs(r.cc)
            @printf(io,"%-12s % .*f %.6f %s\n",r.station,cfg["output"]["dt_decimals"],r.dt,weight,r.phase)
            csvrow(audit,r.i,r.j,r.station,r.phase,round(r.dt;digits=cfg["output"]["dt_decimals"]),round(r.lag;digits=cfg["output"]["dt_decimals"]),r.cc,weight,r.second_cc,r.gap,r.snr,r.ncomponents,r.distance,r.components)
        end
      end
    end
    open(joinpath(out,"group_summary.csv"),"w") do io
        csvrow(io,"station","phase","files","prepared_events","status","count")
        for r in results,(k,v) in sort(collect(r.counts));csvrow(io,r.station,r.phase,r.files,r.prepared_events,k,v);end
    end
    open(joinpath(out,"preprocessing_issues.csv"),"w") do io
        csvrow(io,"station","phase","path","reason")
        for r in results,(p,s) in r.issues;csvrow(io,r.station,r.phase,p,s);end
    end
    if cfg["output"]["write_rejected_pairs"]
        open(joinpath(out,"rejected_pairs.csv"),"w") do io
            csvrow(io,"event_i","event_j","station","phase","reason","cc","lag_s")
            for r in results,t in r.rejected;csvrow(io,t...);end
        end
    end
    return rows
end

function downstream_configs(out,cfg)
    write(joinpath(out,"ddsync.toml"),"""
    # dt.cc contains $(cfg["output"]["weight"]=="cc_squared" ? "r^2" : "abs(r)"), so base_mode=cc applies it exactly once.
    # Run the DDSync runner from this directory (DDSync paths are working-dir relative).
    [io]
    infile_dt = "dt.cc"
    catalog_file = "catalog.txt"
    tmpdir = "ddsync_tmp"
    thetadir = "theta"
    thetastd_dir = "thetastd"
    metrics_file = "sync_metrics.txt"
    out_dt_sync = "dt_sync.cc"
    [weights]
    base_mode = "cc"
    # Small teaching graphs need this explicit edge-count setting.
    # For large archives choose a minimum appropriate to each station/phase.
    [robust]
    MIN_EDGES = $(cfg["downstream"]["ddsync_min_edges"])
    [std]
    export = true
    mode = "hutch"
    probes = 512
    batch = 64
    min_sigma = $(cfg["downstream"]["ddsync_min_sigma_s"])
    apply_min_sigma = true
    [output]
    write_dt_sync = true
    station_field_width = 16
    """)
    write(joinpath(out,"graphsplit_inputs.toml"),"""
    # Input fragment to merge into YOUR GraphSplit relocation configuration.
    # A velocity model/travel-time table and relocation settings are still required.
    # These files become available after DDSync runs in this directory.
    [io]
    catalog_file = "catalog.txt"
    stations_file = "stations.txt"
    theta_dir = "theta"
    thetastd_dir = "thetastd"
    output_dir = "graphsplit_output"
    [catalog]
    latitude_column = 7
    longitude_column = 8
    depth_column = 9
    event_id_column = -1
    origin_time_columns = [1,2,3,4,5,6]
    """)
end

"Run the complete correlation workflow; source SAC files are never modified."
function run(path;args=String[])
    start=time();cfg=load_config(path)
    for arg in args
        startswith(arg,"--sac-dir=") && (cfg["input"]["sac_root"]=abspath(split(arg,'=';limit=2)[2]))
        arg=="--no-plots" && (cfg["plots"]["enabled"]=false)
    end
    mode="--inspect" in args ? "inspect" : "correlate"
    stamp=mode*"_"*Dates.format(now(UTC),"yyyy-mm-dd_HHMMSS_sss")
    out=joinpath(cfg["output"]["root"],stamp)
    ispath(out) && error("Output already exists: $out")
    mkpath(out)
    open(joinpath(out,"effective_config.toml"),"w") do io;TOML.print(io,cfg);end
    provenance=Dict("julia_version"=>string(VERSION),"source_sha256"=>Dict(basename(f)=>bytes2hex(open(sha256,f)) for f in readdir(@__DIR__;join=true) if isfile(f)))
    open(joinpath(out,"software_provenance.toml"),"w") do io;TOML.print(io,provenance);end
    println("Configuration: $(abspath(path))\nSAC input: $(cfg["input"]["sac_root"])\n$(uppercasefirst(mode)) directory: $out\nReading SAC metadata...")
    write_run_guide(out,cfg,mode,"started")
    try
    events=inventory(cfg,out)
    println("$(length(events)) valid events. Sequential IDs: event_id_map.csv. Pick/window checks: phase_readiness.csv.")
    resolve_requested_pairs!(cfg,events)
    if "--inspect" in args
        write_run_guide(out,cfg,mode,"complete")
        println("Inspection complete. No waveforms correlated. Read phase_readiness.csv before processing.")
        return out
    end
    groups=Dict{Tuple{String,String},Vector{Tuple{Event,SACHeader}}}()
    for e in events,h in e.headers,phase in ("P","S")
        phase_component(h,phase;tolerance_deg=cfg["input"]["component_inclination_tolerance_deg"]) || continue
        push!(get!(groups,(stationkey(h),phase),Tuple{Event,SACHeader}[]),(e,h))
    end
    check_example_budget(groups,cfg)
    FFTW.set_num_threads(1);BLAS.set_num_threads(1)
    results=NamedTuple[];cache=cfg["runtime"]["cache_dir"];mkpath(cache)
    for ((station,phase),entries) in sort(collect(groups);by=first)
        println("$station $phase: preparing $(length(entries)) SAC traces...");flush(stdout)
        fingerprint=group_fingerprint(entries,cfg["phase"][phase],cfg);cachefile=joinpath(cache,fingerprint*".jls")
        result=if cfg["runtime"]["resume"] && isfile(cachefile)
            println("  Reusing verified-content cached group");deserialize(cachefile)
        else
            r=process_group(station,phase,entries,cfg)
            serialize(cachefile*".tmp",r);mv(cachefile*".tmp",cachefile;force=true);r
        end
        push!(results,result)
        println("  $(length(result.rows)) accepted; $(length(result.issues)) trace exclusions")
    end
    rows=write_inputs(events,results,out,cfg);downstream_configs(out,cfg)
    write_matrices(out,events,rows,cfg)
    open(joinpath(out,"near_identity.csv"),"w") do io
        csvrow(io,"event_i","event_j","station","phase","cc_signed","lag_s","dt_s","interpretation")
        for r in rows
            abs(r.cc)>=cfg["output"]["near_identity_cc"] || continue
            csvrow(io,r.i,r.j,r.station,r.phase,r.cc,round(r.lag;digits=cfg["output"]["dt_decimals"]),round(r.dt;digits=cfg["output"]["dt_decimals"]),"review waveform overlap and independent arrivals; similarity alone does not prove duplicate event")
        end
    end
    serialize(joinpath(out,"report_data.jls"),(events=events,groups=results,rows=rows,cfg=cfg))
    summary=Dict("events"=>length(events),"sac_files"=>sum(length(e.headers) for e in events),
        "accepted_P"=>count(r->r.phase=="P",rows),"accepted_S"=>count(r->r.phase=="S",rows),
        "event_pairs"=>length(unique((r.i,r.j) for r in rows)),"threads"=>Threads.nthreads(),
        "correlation_elapsed_s"=>time()-start,"julia_version"=>string(VERSION),
        "dt_convention"=>"(arrival_i-origin_i)-(arrival_j-origin_j); lag positive when B later relative to its pick",
        "id_convention"=>"1..N for valid selected event directories in lexical order; isolated events retained",
        "polarity"=>cfg["quality"]["polarity"],"weight"=>cfg["output"]["weight"])
    open(joinpath(out,"run_summary.toml"),"w") do io;TOML.print(io,summary);end
    if cfg["plots"]["enabled"]
        println("Rendering diagnostics...")
        isdefined(@__MODULE__,:make_report) || include(joinpath(@__DIR__,"report.jl"))
        Base.invokelatest(()->make_report(out,events,results,rows,cfg))
    end
    isempty(rows) && println("WARNING: No accepted correlations. Inspect phase_readiness.csv, preprocessing_issues.csv and group_summary.csv.")
    write_run_guide(out,cfg,mode,"complete")
    println("Done: $out\n$(length(rows)) observations in $(round(time()-start;digits=1)) s")
    cfg["plots"]["enabled"] && println("Open in your browser: $(joinpath(out,"report.html"))")
    out
    catch err
        open(joinpath(out,"failure.txt"),"w") do io
            println(io,sprint(showerror,err))
            println(io,"\nRun incomplete. Do not use any partial relocation exports in this directory.")
        end
        write_run_guide(out,cfg,mode,"failed")
        rethrow()
    end
end

"Inspect SAC metadata and phase/window readiness without running correlations."
inspect(path;args=String[])=run(path;args=vcat(args,["--inspect"]))
