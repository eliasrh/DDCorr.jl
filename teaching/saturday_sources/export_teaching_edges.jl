# Run with Julia and a checkout of GraphSplit. Inputs are the TOML, completed
# GraphSplit output directory, and output CSV. All original files are read only.
using GraphSplit
using Printf
using DelimitedFiles
cfg = GraphSplit.load_config(abspath(ARGS[1]))
dir = abspath(ARGS[2])
catalog = GraphSplit.read_catalog(cfg["io"]["catalog_file"], cfg)
stations = GraphSplit.read_stations(cfg["io"]["stations_file"])
state = GraphSplit.attach_coordinates!(stations, catalog, cfg)
shift = GraphSplit.read_catalog_shift(joinpath(dir, "catalog_preloc_dxdydzt0.txt"), catalog.event_id)
state.x .+= shift.dx_m
state.y .+= shift.dy_m
state.z .+= shift.dz_m
state.t0 .+= shift.dt0_s
graph = GraphSplit.build_event_graph(state, cfg)
groups = GraphSplit.load_theta_folder(cfg["io"]["theta_dir"], cfg["io"]["thetastd_dir"])
obs = GraphSplit.build_dd_observations(groups, stations, catalog, graph, cfg)
support = Dict{Tuple{Int,Int},Int}()
for (i, j) in zip(obs.i, obs.j)
    k = minmax(i, j)
    support[k] = get(support, k, 0) + 1
end
open(ARGS[3], "w") do io
    println(io, "i,j,common_observations")
    for (i, j) in zip(graph.i, graph.j)
        println(io, catalog.event_id[i], ",", catalog.event_id[j], ",", get(support, minmax(i,j), 0))
    end
end
