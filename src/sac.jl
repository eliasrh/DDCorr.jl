"SAC numeric undefined values become NaN; do not mistake these for picks."
sacnum(x) = x in (-12345, -1234.5) ? NaN : Float64(x)

struct SACHeader
    path::String
    floats::Vector{Float64}
    ints::Vector{Int32}
    network::String
    station::String
    location::String
    channel::String
    event_name::String
    reference::Float64
    swap::Bool
end

"Read binary SAC v6/v7, either endian. Only evenly sampled time series are accepted."
function read_header(path::AbstractString)
    open(path) do io
        filesize(path) >= 632 || error("SAC header truncated: $path")
        f = read!(io, Vector{Float32}(undef,70))
        iv = read!(io, Vector{Int32}(undef,40))
        chars = read(io,192)
        swap = !(iv[7] in (6,7))
        if swap
            iv = bswap.(iv)
            f = reinterpret(Float32, bswap.(reinterpret(UInt32,f)))
        end
        iv[7] in (6,7) || error("Unsupported SAC version: $path")
        iv[16] == 1 && iv[36] == 1 || error("Requires ITIME and LEVEN=1: $path")
        iv[10] > 0 || error("Empty SAC trace: $path")
        needed = 632 + 4*Int(iv[10]) + (iv[7] == 7 ? 176 : 0)
        filesize(path) >= needed || error("SAC data/footer truncated: $path")
        fv = sacnum.(f)
        if iv[7] == 7
            seek(io,632+4*Int(iv[10]))
            foot = read!(io,Vector{Float64}(undef,22))
            swap && (foot = reinterpret(Float64,bswap.(reinterpret(UInt64,foot))))
            indices = [1,6,7,8,9,collect(11:20)...,21,37,36,33,32]
            for (k,j) in enumerate(indices)
                fv[j] = sacnum(foot[k])
            end
        end
        isfinite(fv[1]) && fv[1]>0 && isfinite(fv[6]) || error("Invalid DELTA/B: $path")
        1900 <= iv[1] <= 2200 && 1 <= iv[2] <= 366 || error("Invalid reference date: $path")
        0 <= iv[3] < 24 && 0 <= iv[4] < 60 && 0 <= iv[5] < 60 && 0 <= iv[6] < 1000 ||
            error("Invalid/leap-second reference time; explicit conversion needed: $path")
        ref = datetime2unix(DateTime(iv[1]) + Day(iv[2]-1) + Hour(iv[3]) +
                            Minute(iv[4]) + Second(iv[5]) + Millisecond(iv[6]))
        str(k,n=8) = String(strip(replace(String(chars[k:k+n-1]), '\0'=>"")))
        clean(s) = s == "-12345" ? "" : s
        h = SACHeader(String(path),fv,iv,clean(str(169)),clean(str(1)),clean(str(25)),
                      clean(str(161)),clean(str(9,16)),ref,swap)
        isempty(h.station) && error("Missing station code: $path")
        isempty(h.channel) && error("Missing channel code: $path")
        return h
    end
end

function read_samples(h::SACHeader)
    x = open(h.path) do io
        seek(io,632)
        read!(io,Vector{Float32}(undef,h.ints[10]))
    end
    h.swap && (x = reinterpret(Float32,bswap.(reinterpret(UInt32,x))))
    all(isfinite,x) || error("Nonfinite samples: $(h.path)")
    return Float64.(x)
end

const PICK_FIELDS = Dict("a"=>9, "o"=>8, ("t$i"=>11+i for i in 0:9)...)
pick(h,field) = h.floats[PICK_FIELDS[lowercase(field)]]
stationkey(h) = join((h.network,h.station), ".")
channelkey(h) = join((h.network,h.station,h.location,h.channel), ".")

function phase_component(h, phase; tolerance_deg=10.0)
    inc = h.floats[59]
    if isfinite(inc)
        return phase == "P" ? min(abs(inc),abs(inc-180)) <= tolerance_deg : abs(inc-90) <= tolerance_deg
    end
    c = last(h.channel)
    return phase == "P" ? c == 'Z' : c in ('N','E','1','2')
end

struct Event
    id::Int
    name::String
    origin::Float64
    latitude::Float64
    longitude::Float64
    depth::Float64
    headers::Vector{SACHeader}
end

"CSV escaping is also used for paths and error messages containing commas."
csvcell(x) = x isa AbstractString ? "\"" * replace(x,"\""=>"\"\"") * "\"" : string(x)
csvrow(io,x...) = println(io,join(csvcell.(x),','))

"Index only immediate event directories; emit sequential IDs without changing input files."
function inventory(cfg,out)
    root=cfg["input"]["sac_root"]
    isdir(root) || error("SAC directory not found: $root. Supply --sac-dir PATH or input.sac_dir.")
    dirs=sort(filter(d->isdir(d) && any(f->endswith(lowercase(f),".sac"),readdir(d)),readdir(root;join=true)))
    isempty(dirs) && error("No event folders found in $root. Use sac_dir/<original_event_id>/*.sac; a flat continuous archive needs event cuts and picks first.")
    limit=cfg["runtime"]["max_events"]
    if 0<limit<length(dirs)
        dirs=dirs[unique(round.(Int,range(1,length(dirs);length=limit)))]
    end
    events=Event[]; issues=Tuple{String,String}[]
    for d in dirs
        hs=SACHeader[]; failed=false; seen=Set{String}()
        for path in sort(readdir(d;join=true))
            endswith(lowercase(path),".sac") || continue
            try
                h=read_header(path)
                all(isfinite,h.floats[[8,36,37,39]]) || error("Missing event metadata: require O (origin offset), EVLA, EVLO and EVDP (km). SAC download alone does not supply picks/origin.")
                all(isfinite,h.floats[[32,33,34]]) || error("Missing station metadata: require STLA, STLO, STEL (metres).")
                -90<=h.floats[32]<=90 && -180<=h.floats[33]<=180 || error("Invalid station coordinates")
                -90<=h.floats[36]<=90 && -180<=h.floats[37]<=180 || error("Invalid event coordinates")
                all(x->occursin(r"^[A-Za-z0-9_-]*$",x),(h.network,h.station,h.location,h.channel)) || error("Network/station/location/channel codes must contain no whitespace or dots")
                channelkey(h) in seen && error("Duplicate event/channel file $(channelkey(h)); merge segments before making event SAC cuts")
                push!(seen,channelkey(h));push!(hs,h)
            catch err
                err isa ErrorException || rethrow()
                push!(issues,(path,sprint(showerror,err)));failed=true
            end
        end
        # An event with any invalid trace is excluded in permissive mode rather
        # than quietly correlating an arbitrary subset of conflicting metadata.
        if failed || isempty(hs)
            push!(issues,(d,"Event excluded: invalid or missing trace metadata"));continue
        end
        origins=[h.reference+h.floats[8] for h in hs]
        lat=[h.floats[36] for h in hs];lon=[h.floats[37] for h in hs];dep=[h.floats[39] for h in hs]
        if maximum(origins)-minimum(origins)>cfg["input"]["origin_tolerance_s"] ||
           maximum(lat)-minimum(lat)>cfg["input"]["coordinate_tolerance_deg"] ||
           maximum(lon)-minimum(lon)>cfg["input"]["coordinate_tolerance_deg"] ||
           maximum(dep)-minimum(dep)>cfg["input"]["depth_tolerance_km"]
            push!(issues,(d,"Conflicting O/NZ reference, EVLA/EVLO or EVDP across channels; event excluded"));continue
        end
        push!(events,Event(length(events)+1,basename(d),median(origins),median(lat),median(lon),median(dep),hs))
    end
    open(joinpath(out,"input_issues.csv"),"w") do io
        csvrow(io,"path","reason")
        for issue in issues;csvrow(io,issue...);end
    end
    !isempty(issues) && cfg["input"]["strict_headers"] && error("SAC metadata problems found. Read $(joinpath(out,"input_issues.csv")). Fix the listed headers before processing; advanced input.strict_headers=false explicitly excludes affected events.")
    isempty(events) && error("No valid events; see $(joinpath(out,"input_issues.csv"))")
    open(joinpath(out,"event_id_map.csv"),"w") do io
        csvrow(io,"event_id","original_event_id","event_directory")
        for e in events;csvrow(io,e.id,e.name,e.name);end
    end
    open(joinpath(out,"inventory.csv"),"w") do io
        csvrow(io,"event_id","original_event_id","path","network","station","location","channel","sample_rate_hz","npts","P_pick_s","S_pick_s","origin_s","azimuth","inclination")
        for e in events,h in e.headers
            csvrow(io,e.id,e.name,relpath(h.path,root),h.network,h.station,h.location,h.channel,
                1/h.floats[1],h.ints[10],pick(h,cfg["phase"]["P"]["pick_header"]),pick(h,cfg["phase"]["S"]["pick_header"]),
                h.floats[8],h.floats[58],h.floats[59])
        end
    end
    # Preflight is metadata-only: sample values and SNR are checked during run.
    open(joinpath(out,"phase_readiness.csv"),"w") do io
        csvrow(io,"event_id","original_event_id","path","phase","status")
        for e in events,h in e.headers,ph in ("P","S")
            phase_component(h,ph;tolerance_deg=cfg["input"]["component_inclination_tolerance_deg"]) || continue
            pc=cfg["phase"][ph];p=pick(h,pc["pick_header"]);pp=pick(h,cfg["preprocess"]["noise_pick_header"])
            status = !isfinite(p) ? "missing $(pc["pick_header"]) pick: supply a measured or explicitly labelled predicted arrival" :
                !isfinite(pp) ? "missing pre-P noise anchor $(cfg["preprocess"]["noise_pick_header"])" :
                p<=h.floats[8] ? "pick is not after origin" :
                pc["sample_rate_hz"]>1/h.floats[1]*(1+1e-6) ? "target sample rate exceeds native rate" :
                pc["band_hz"][2]>=0.45/h.floats[1] ? "band exceeds native sampling limit" : "ready"
            if status=="ready"
                lo=min(p+pc["window_s"][1]-pc["max_lag_s"],pp+cfg["preprocess"]["noise_window_s"][1])-pc["filter_padding_s"]
                hi=max(p+pc["window_s"][2]+pc["max_lag_s"],pp+cfg["preprocess"]["noise_window_s"][2])+pc["filter_padding_s"]
                if lo<h.floats[6] || hi>h.floats[6]+(h.ints[10]-1)*h.floats[1]
                    status="insufficient real samples around filter/noise/search windows: download a longer cut"
                end
            end
            csvrow(io,e.id,e.name,relpath(h.path,root),ph,status)
        end
    end
    events
end
