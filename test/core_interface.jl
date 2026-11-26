@testset "Public config merging, strict names and advanced settings" begin
    mktempdir() do d
        path=joinpath(d,"run.toml")
        write(path,"[input]\nsac_dir = \"data\"\np_pick_header=\"t1\"\n[P]\nmin_cc=0.8\n")
        config=DDCorr.load_config(path)
        @test config["input"]["sac_root"]==joinpath(d,"data")
        @test config["phase"]["P"]["pick_header"]=="t1"
        @test config["preprocess"]["noise_pick_header"]=="t1"
        @test config["phase"]["P"]["min_cc"]==0.8
        @test config["phase"]["S"]["min_cc"]==0.7
        @test config["quality"]["polarity"]=="positive"
        write(path,"[P]\nmin_c=0.8\n");@test_throws ErrorException DDCorr.load_config(path)
        write(path,"[P]\nmin_cc=\"0.8\"\n");@test_throws ErrorException DDCorr.load_config(path)
        write(path,"[P]\nband_hz=[0.4,2.0]\n");@test_throws ErrorException DDCorr.load_config(path)
        write(joinpath(d,"advanced.toml"),"[phase.P]\nfilter_padding_s=20.0\n")
        write(path,"[P]\nband_hz=[0.4,2.0]\n[advanced]\nfile=\"advanced.toml\"\n")
        @test DDCorr.load_config(path)["phase"]["P"]["filter_padding_s"]==20.0
        write(path,"[advanced]\nfile=\"advanced.toml\"\n[P]\nfilter_order=6\nfilter_padding_s=10.0\n[phase.S]\nfilter_order=2\n[runtime]\nmax_events=12\n[output]\nnear_identity_cc=0.98\n")
        overridden=DDCorr.load_config(path)
        @test overridden["phase"]["P"]["filter_order"]==6
        @test overridden["phase"]["P"]["filter_padding_s"]==10.0
        @test overridden["phase"]["S"]["filter_order"]==2
        @test overridden["runtime"]["max_events"]==12
        @test overridden["output"]["near_identity_cc"]==0.98
        write(path,"[phase.P]\nfilter_order=5\n[P]\nfilter_order=6\n")
        @test_throws ErrorException DDCorr.load_config(path)
        write(path,"[P]\nfilter_order=6.5\n")
        @test_throws ErrorException DDCorr.load_config(path)
        write(path,"[P]\nfilter_order=6\n")
        @test DDCorr.load_config(path)["phase"]["S"]["filter_order"]==4
    end
end

@testset "Inventory: sequential IDs, original labels and missing-header evidence" begin
    mktempdir() do d
        sac=joinpath(d,"sac");out=joinpath(d,"inspect");mkpath(out)
        for name in ("event_99","event_2","event_100")
            mkpath(joinpath(sac,name));write_synthetic_sac(joinpath(sac,name,"XX.ABC.HHZ.sac"))
        end
        config=deepcopy(cfg);config["input"]["sac_root"]=sac
        events=DDCorr.inventory(config,out)
        @test [e.id for e in events]==[1,2,3]
        @test [e.name for e in events]==["event_100","event_2","event_99"]
        @test occursin("insufficient real samples",read(joinpath(out,"phase_readiness.csv"),String))
        @test occursin("event_100",read(joinpath(out,"event_id_map.csv"),String))
        # Adding malformed SAC never silently shifts IDs under the strict default.
        write(joinpath(sac,"event_2","bad.sac"),"bad")
        @test_throws ErrorException DDCorr.inventory(config,out)
        @test occursin("truncated",read(joinpath(out,"input_issues.csv"),String))
        config["input"]["strict_headers"]=false
        events=DDCorr.inventory(config,out)
        @test [e.id for e in events]==[1,2]
        @test [e.name for e in events]==["event_100","event_99"]
    end
end

@testset "Content fingerprints change after same-sized sample edits" begin
    mktempdir() do d
        path=joinpath(d,"event.sac");write_synthetic_sac(path)
        h=DDCorr.read_header(path);e=DDCorr.Event(1,"a",h.reference+h.floats[8],-19.,-44.,0.,[h])
        a=DDCorr.group_fingerprint([(e,h)],cfg["phase"]["P"],cfg)
        open(path,"r+") do io;seek(io,632);write(io,Float32(3));end
        b=DDCorr.group_fingerprint([(e,h)],cfg["phase"]["P"],cfg)
        @test a!=b
    end
end

@testset "Explicit examples use mapped IDs and preserve all requested pairs" begin
    config=DDCorr.load_config(joinpath(@__DIR__,"..","DDCorr.toml"))
    events=[(id=1,name="alpha"),(id=2,name="17"),(id=3,name="event-z")]
    config["plots"]["event_pairs"]=[[2,1],[1,2],[2,3]]
    DDCorr.resolve_requested_pairs!(config,events)
    @test config["plots"]["event_pairs"]==[[1,2],[2,3]]
    config["plots"]["event_pairs"]=[]
    config["plots"]["original_event_pairs"]=[["event-z","alpha"]]
    DDCorr.resolve_requested_pairs!(config,events)
    @test config["plots"]["event_pairs"]==[[1,3]]
    config["plots"]["original_event_pairs"]=[["missing","alpha"]]
    @test_throws ErrorException DDCorr.resolve_requested_pairs!(config,events)
    config["plots"]["original_event_pairs"]=[];config["plots"]["event_pairs"]=[[1,99]]
    @test_throws ErrorException DDCorr.resolve_requested_pairs!(config,events)
    @test config["phase"]["S"]["min_components"]==1
    @test config["output"]["dt_decimals"]==4
end

@testset "An absent S on one horizontal does not dilute the useful component" begin
    mktempdir() do d
        config=deepcopy(cfg);config["plots"]["enabled"]=true
        config["output"]["coefficient_lag"]="sampled"
        entries=Tuple{M.Event,M.SACHeader}[]
        for id in 1:2, component in ("HHN","HHE")
            path=joinpath(d,"$(id)_$component.sac");write_synthetic_sac(path)
            f,iv,ch=open(path) do io
                (read!(io,Vector{Float32}(undef,70)),read!(io,Vector{Int32}(undef,40)),read(io,192))
            end
            f[6]=-5;f[8]=20;f[9]=40;f[11]=60;iv[2]=id;iv[10]=14000
            f[58]=component=="HHN" ? 0 : 90;f[59]=90
            f[7]=f[6]+(iv[10]-1)*f[1];ch[161:163]=codeunits(component)
            t=f[6].+(0:iv[10]-1).*Float64(f[1]);q=t.-60 .- (id==1 ? 0 : 0.073)
            x=component=="HHN" ? exp.(-((q.-1)./0.4).^2).*(sin.(2pi*4 .*q).+0.4sin.(2pi*7.3 .*q)).+0.001randn(length(t)) : randn(length(t))
            open(path,"w") do io;write(io,f);write(io,iv);write(io,ch);write(io,Float32.(x));end
            h=M.read_header(path);e=M.Event(id,"event$id",h.reference+h.floats[8],0.,0.,0.,[h]);push!(entries,(e,h))
        end
        one=M.process_group("XX.ABC","S",entries,config)
        @test length(one.rows)==1
        @test one.rows[1].ncomponents==1
        @test endswith(one.rows[1].components,"HHN")
        @test abs(one.rows[1].lag-.073)<.002
        fitted=deepcopy(config); fitted["output"]["coefficient_lag"]="fitted"
        rerun=M.process_group("XX.ABC","S",entries,fitted)
        obs=only(rerun.rows); check=only(rerun.checks)
        @test check.sampled_cc==one.rows[1].cc
        @test obs.cc==check.fitted_cc && obs.cc>check.sampled_cc
        component=only(only(rerun.examples).components)
        @test component.channel=="HHN" && component.best_lag==check.sampled_lag
        @test component.at_output≈check.fitted_cc && component.at_grid≈check.sampled_cc
        @test (obs.lag,obs.dt,obs.gap)==(one.rows[1].lag,one.rows[1].dt,one.rows[1].gap)
        @test M.group_fingerprint(entries,config["phase"]["S"],config)!=M.group_fingerprint(entries,fitted["phase"]["S"],fitted)
        fitted["quality"]["subsample"]=false
        grid_only=only(M.process_group("XX.ABC","S",entries,fitted).checks)
        @test grid_only.sampled_lag==grid_only.fitted_lag && grid_only.sampled_cc==grid_only.fitted_cc
        config["phase"]["S"]["min_components"]=2
        two=M.process_group("XX.ABC","S",entries,config)
        @test isempty(two.rows)
    end
end

@testset "Explicit figure budget is checked before group processing" begin
    c=deepcopy(cfg);c["plots"]["event_pairs"]=[[1,2]]
    groups=Dict(("XX.A","P")=>[((id=1,),nothing),((id=2,),nothing)],("XX.B","S")=>[((id=1,),nothing),((id=2,),nothing)])
    @test M.check_example_budget(groups,c)==2
    c["diagnostics"]["max_requested_examples"]=1
    @test_throws ErrorException M.check_example_budget(groups,c)
    c["plots"]["example_stations"]=["XX.A"]
    @test M.check_example_budget(groups,c)==1
end

@testset "Station coordinate preflight, explicit split and source depth units" begin
    mktempdir() do d
        sac=joinpath(d,"sac");out=joinpath(d,"inspect");mkpath(out)
        config=deepcopy(cfg);config["input"]["sac_root"]=sac
        config["input"]["station_epoch_policy"]="error"
        paths=String[]
        for (id,lat) in enumerate((-20.0,-20.01))
            dir=joinpath(sac,"event$id");mkpath(dir)
            path=joinpath(dir,"XX.ABC.HHZ.sac");push!(paths,path);write_synthetic_sac(path)
            open(path,"r+") do io
                seek(io,4*31);write(io,Float32(lat))
                seek(io,4*38);write(io,Float32(10000))
            end
        end
        original=read.(paths)
        @test_throws ErrorException M.inventory(config,out)
        @test occursin("XX.ABC",read(joinpath(out,"station_epochs.csv"),String))
        @test !isfile(joinpath(out,"dt.cc"))
        config["input"]["station_epoch_policy"]="split"
        config["input"]["depth_unit"]="m"
        events=M.inventory(config,out)
        @test all(e->e.depth==10.0,events)
        @test Set(M.stationkey(h) for e in events for h in e.headers)==Set(["XX.ABC001","XX.ABC002"])
        @test read.(paths)==original
        M.write_inputs(events,NamedTuple[],out,config)
        @test countlines(joinpath(out,"stations.txt"))==2
        @test isfile(joinpath(out,"dt.cc"))
        again=M.inventory(config,out)
        @test [M.stationkey(e.headers[1]) for e in events]==[M.stationkey(e.headers[1]) for e in again]
        # A split must also change cache identity, even with identical source bytes.
        e=events[1];h=e.headers[1]
        orig=M.SACHeader(h.path,h.floats,h.ints,h.network,"ABC",h.location,h.channel,h.event_name,h.reference,h.swap)
        @test M.group_fingerprint([(e,h)],config["phase"]["P"],config)!=M.group_fingerprint([(e,orig)],config["phase"]["P"],config)
        # Conflicting coordinates among one event's components need correction.
        other=joinpath(dirname(paths[1]),"XX.ABC.HHN.sac")
        cp(paths[2],other)
        open(other,"r+") do io;seek(io,600);write(io,"HHN");end
        @test_throws ErrorException M.inventory(config,out)
        rm(other)
        # The regular CLI inspection records failures without attempting correlation.
        settings=joinpath(d,"test.toml")
        write(joinpath(d,"advanced.toml"),"[input]\nstation_epoch_policy=\"error\"\n")
        write(settings,"[input]\nsac_dir=\"sac\"\n[output]\ndirectory=\"runs\"\n[advanced]\nfile=\"advanced.toml\"\n")
        @test_throws ErrorException M.inspect(settings)
        run=only(readdir(joinpath(d,"runs");join=true))
        @test M.TOML.parsefile(joinpath(run,"run_info.toml"))["status"]=="failed"
        @test occursin("Station coordinates differ",read(joinpath(run,"failure.txt"),String))
        @test !isfile(joinpath(run,"catalog.txt"))
        @test !isdir(joinpath(d,".ddcorr_cache"))
        write(settings,"[advanced]\nfile=\"advanced.toml\"\n")
        write(joinpath(d,"advanced.toml"),"[input]\ndepth_unit=\"feet\"\n")
        @test_throws ErrorException M.load_config(settings)
        write(joinpath(d,"advanced.toml"),"[input]\nstation_epoch_policy=\"ignore\"\n")
        @test_throws ErrorException M.load_config(settings)
    end
end

@testset "Default station conflict policy skips the entire station and preserves event IDs" begin
    mktempdir() do d
        sac=joinpath(d,"sac");out=joinpath(d,"inspect");mkpath(out)
        config=deepcopy(cfg);config["input"]["sac_root"]=sac
        @test config["input"]["station_epoch_policy"]=="skip"
        originals=Dict{String,Vector{UInt8}}()
        for id in 1:3
            dir=joinpath(sac,"event$id");mkpath(dir)
            bad=joinpath(dir,"XX.ABC.HHZ.sac");write_synthetic_sac(bad)
            if id==2
                open(bad,"r+") do io;seek(io,4*31);write(io,Float32(-20.01));end
            end
            originals[bad]=read(bad)
            if id<3
                good=joinpath(dir,"XX.DEF.HHZ.sac");write_synthetic_sac(good)
                open(good,"r+") do io;seek(io,440);write(io,"DEF");end
                originals[good]=read(good)
            end
        end
        events=@test_logs (:warn,r"Station XX.ABC excluded") M.inventory(config,out)
        @test [e.id for e in events]==[1,2,3]
        @test [length(e.headers) for e in events]==[1,1,0]
        @test all(h->M.stationkey(h)=="XX.DEF",[h for e in events for h in e.headers])
        @test countlines(joinpath(out,"station_exclusions.csv"))==2
        @test occursin("excluded from all events and both phases",read(joinpath(out,"station_exclusions.csv"),String))
        @test occursin("excluded",read(joinpath(out,"station_epochs.csv"),String))
        @test !occursin("XX.ABC",read(joinpath(out,"inventory.csv"),String))
        @test !occursin("XX.ABC",read(joinpath(out,"phase_readiness.csv"),String))
        M.write_inputs(events,NamedTuple[],out,config)
        @test countlines(joinpath(out,"catalog.txt"))==3
        @test !occursin("XX.ABC",read(joinpath(out,"stations.txt"),String))
        @test occursin("XX.DEF",read(joinpath(out,"stations.txt"),String))
        @test all(read(path)==bytes for (path,bytes) in originals)
        # A within-event component conflict also excludes ABC globally under skip.
        extra=joinpath(sac,"event1","XX.ABC.HHN.sac")
        cp(joinpath(sac,"event2","XX.ABC.HHZ.sac"),extra)
        open(extra,"r+") do io;seek(io,600);write(io,"HHN");end
        events=@test_logs (:warn,r"Station XX.ABC excluded") M.inventory(config,out)
        @test [length(e.headers) for e in events]==[1,1,0]
        # Even if every station is excluded, a completed run can export an empty dt file.
        for path in keys(originals)
            occursin("DEF",path) && rm(path)
        end
        settings=joinpath(d,"test.toml")
        write(settings,"[input]\nsac_dir=\"sac\"\n[output]\ndirectory=\"runs\"\n[plots]\nenabled=false\n")
        run=@test_logs (:warn,r"Station XX.ABC excluded") M.run(settings)
        @test M.TOML.parsefile(joinpath(run,"run_info.toml"))["status"]=="complete"
        @test M.TOML.parsefile(joinpath(run,"run_info.toml"))["excluded_stations"]==1
        @test filesize(joinpath(run,"dt.cc"))==0
        @test countlines(joinpath(run,"catalog.txt"))==3
        @test occursin("station(s) excluded",read(joinpath(run,"README.txt"),String))
    end
end

@testset "SAC magnitudes stay optional, ID remains last" begin
    mktempdir() do d
        sac=joinpath(d,"sac"); out=joinpath(d,"inspect"); mkpath(out)
        config=deepcopy(cfg); config["input"]["sac_root"]=sac
        for (i,mags,types) in [(1,[-0.25,-12345.0],[54,-12345]),(2,[0.,0.],[54,54]),
                               (3,[-12345.0,-12345.0],[-12345,-12345]),
                               (4,[1.,2.],[54,54]),(5,[1.,1.],[54,55])]
            dir=joinpath(sac,"event$i"); mkpath(dir)
            for (k,channel) in enumerate(("HHZ","HHN"))
                path=joinpath(dir,"$channel.sac"); write_synthetic_sac(path)
                open(path,"r+") do io
                    seek(io,4*39); write(io,Float32(mags[k]))
                    seek(io,4*(70+25)); write(io,Int32(types[k]))
                    seek(io,600); write(io,channel)
                end
            end
        end
        events=M.inventory(config,out)
        @test isequal([e.magnitude for e in events],[-0.25,0.,NaN,NaN,NaN])
        @test [e.magnitude_status for e in events[3:5]]==["missing",fill("conflicting SAC magnitudes or types",2)...]
        M.write_inputs(events,NamedTuple[],out,config)
        catalog=split.(readlines(joinpath(out,"catalog.txt")))
        @test all(row->length(row)==11,catalog)
        @test parse.(Int,last.(catalog))==1:5
        @test isequal(parse.(Float64,[r[end-1] for r in catalog]),[-0.25,0.,NaN,NaN,NaN])
        M.write_inputs(events[3:5],NamedTuple[],out,config)
        @test all(row->length(split(row))==10,readlines(joinpath(out,"catalog.txt")))
        @test occursin("conflicting SAC magnitudes or types",read(joinpath(out,"event_id_map.csv"),String))
    end
end

@testset "Large group preflight does not allocate a pair table" begin
    c=deepcopy(cfg); c["runtime"]["max_pairs_per_group"]=0
    c["runtime"]["max_group_memory_mib"]=2048
    # Reuse a header here to isolate startup planning from waveform I/O.
    h=M.SACHeader("/missing/test.sac",zeros(70),fill(Int32(2000),40),"X","A","","HHZ","",0.,false)
    entries=[((id=i,),h) for i in 1:10000]
    plan=M.group_plan("X.A","P",entries,c)
    @test plan.pairs==49_995_000
    @test (@allocated M.group_plan("X.A","P",entries,c)) < 2^20
    c["runtime"]["max_pairs_per_group"]=100
    message=try M.process_group("X.A","P",entries,c); "" catch err; sprint(showerror,err) end
    @test occursin("49995000 possible pairs",message)
    c["runtime"]["max_pairs_per_group"]=0; c["runtime"]["max_group_memory_mib"]=1
    @test_throws ErrorException M.group_plan("X.A","P",entries,c)
end

@testset "Automatic selections allow a single event or example" begin
    @test M.spaced_indices(12,0)==Int[]
    @test M.spaced_indices(12,1)==[1]
    @test M.spaced_indices(12,2)==[1,12]
    @test M.spaced_indices(5,3)==[1,3,5]
end
