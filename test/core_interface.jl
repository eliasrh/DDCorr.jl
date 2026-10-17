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
