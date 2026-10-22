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
        config=deepcopy(cfg);config["plots"]["enabled"]=false
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
