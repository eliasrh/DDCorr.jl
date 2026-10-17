@testset "Sparse/dense matrix conventions and limits" begin
    events = [(id=1,name="event_90"),(id=2,name="event_007"),(id=3,name="isolated")]
    rows = [DDCorr.Observation(1,2,"XX.A","P",0.25,-0.03,-0.8,0.1,0.7,4.0,1,1.0,"HHZ")]
    cfg = Dict("matrices"=>Dict("enabled"=>true,"dense"=>true,"max_dense_events"=>10,"max_dense_cells"=>100),
               "output"=>Dict("weight"=>"cc_squared"))
    mktempdir() do root
        dir=DDCorr.write_matrices(root,events,rows,cfg)
        cc=readlines(joinpath(dir,"group_0001_cc.csv"))
        dt=readlines(joinpath(dir,"group_0001_dt.csv"))
        lag=readlines(joinpath(dir,"group_0001_lag.csv"))
        @test cc[2]=="1,\"NA\",\"-0.8\",\"NA\""
        @test cc[3]=="2,\"-0.8\",\"NA\",\"NA\""
        @test cc[4]=="3,\"NA\",\"NA\",\"NA\""
        @test dt[2]=="1,\"NA\",\"0.25\",\"NA\""
        @test dt[3]=="2,\"-0.25\",\"NA\",\"NA\""
        @test lag[3]=="2,\"0.03\",\"NA\",\"NA\""
        weight=parse(Float64,split(readlines(joinpath(dir,"group_0001_edges.csv"))[2],',')[6])
        @test weight≈0.64
        @test occursin("3,3,\"isolated\"",read(joinpath(dir,"event_order.csv"),String))
        @test_throws ErrorException DDCorr.write_matrices(root,events,rows,cfg)
    end
    mktempdir() do root
        limited=deepcopy(cfg);limited["matrices"]["max_dense_cells"]=26
        @test_throws ErrorException DDCorr.write_matrices(root,events,rows,limited)
        @test !ispath(joinpath(root,"matrices"))
        @test_throws ErrorException DDCorr.write_matrices(root,events,vcat(rows,rows),cfg)
    end
    mktempdir() do root
        sparse=deepcopy(cfg);sparse["matrices"]["dense"]=false
        dir=DDCorr.write_matrices(root,events,rows,sparse)
        @test isfile(joinpath(dir,"group_0001_edges.csv"))
        @test !isfile(joinpath(dir,"group_0001_cc.csv"))
    end
end
