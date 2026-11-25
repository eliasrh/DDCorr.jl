# Run from the extracted Saturday workshop folder with Julia 1.12.3.
using SHA, TOML

const KIT = @__DIR__
const INPUTS = ["dt.cc", "catalog.txt", "stations.txt", "event_id_map.csv"]
const SETTINGS = ["sync.toml", "DD.toml", "vm.txt"]
const USAGE = """
From the Saturday folder, enter these commands, one at a time.
  julia --threads=2 workshop.jl sync
  julia --threads=2 workshop.jl relocate

For your Friday result, replace the quoted path with its actual folder.
  julia --threads=2 workshop.jl sync --from "PATH TO FRIDAY RESULT" --run friday
  julia --threads=2 workshop.jl relocate --run friday

For a new experiment, copy config to another folder, edit its settings, then
add --config "PATH TO CONFIG FOLDER" to the sync command and use a new run name.
"""

function fingerprint(f)
    open(f) do io
        bytes2hex(sha256(io))
    end
end

function options(args)
    opts = Dict("--run" => "baseline", "--from" => joinpath(KIT, "inputs"),
                "--config" => joinpath(KIT, "config"))
    stage = first(args)
    stage in ("sync", "relocate") || error("Choose sync or relocate.\n" * USAGE)
    rest = args[2:end]
    iseven(length(rest)) || error("Each option needs its value.\n" * USAGE)
    for i in 1:2:length(rest)
        key, value = rest[i:i+1]
        haskey(opts, key) || error("Unknown option: $key\n" * USAGE)
        stage == "relocate" && key != "--run" && error("The relocate stage uses the inputs and settings already stored by sync. Supply only --run NAME.")
        opts[key] = value
    end
    name = opts["--run"]
    occursin(r"^[A-Za-z0-9][A-Za-z0-9_.-]*$", name) || error("Give --run a folder name such as friday or another-band.")
    return stage, joinpath(KIT, "runs", name), abspath(opts["--from"]), abspath(opts["--config"])
end

function synchronize(folder, source, config)
    inputs = vcat([joinpath(source, n) for n in INPUTS], [joinpath(config, n) for n in SETTINGS])
    for f in inputs
        isfile(f) && filesize(f) > 0 || error("Missing or empty file: $f. Choose the DDCorr result folder containing all four input files and the folder containing the three settings files.")
    end
    # DDCorr assigns sequential event IDs. Preserve its original ID map when importing an experiment.
    ids = [parse(Int, last(split(s))) for s in readlines(joinpath(source,"catalog.txt")) if !isempty(strip(s)) && !startswith(strip(s), "#")]
    sort(ids) == collect(1:length(ids)) || error("Choose a DDCorr catalogue with sequential IDs 1…N and its matching dt.cc, stations and event ID map.")
    hashes = Dict(basename(f) => fingerprint(f) for f in inputs)
    if ispath(folder)
        marker = joinpath(folder, "sync_complete.toml")
        if isfile(marker) && TOML.parsefile(marker)["files"] == hashes &&
           all(isfile(joinpath(folder,n)) && fingerprint(joinpath(folder,n))==h for (n,h) in hashes) &&
           isfile(joinpath(folder,"sync_metrics.txt")) && isdir(joinpath(folder,"theta")) && isdir(joinpath(folder,"thetastd"))
            println("This synchronization is already complete in ", folder)
            return
        end
        error("Run folder already exists: $folder. Use a new name with --run to keep both experiments. An interrupted run can remain here for inspection.")
    end
    mkpath(dirname(folder))
    mkdir(folder)
    for f in inputs
        cp(f, joinpath(folder, basename(f)))
    end
    println("Inputs: ",source,"\nSettings: ",config,"\nWriting DDSync results to ",folder)
    cd(folder) do
        empty!(ARGS); push!(ARGS,"sync.toml")
        Base.include(Main, joinpath(KIT,"software","DDSync","DDSyncJulia","run_ddsync.jl"))
        open("sync_complete.toml","w") do io
            TOML.print(io, Dict("files"=>hashes))
        end
    end
    println("DDSync finished. Open sync_metrics.txt in ", folder)
end

function relocate(folder)
    isfile(joinpath(folder,"sync_complete.toml")) || error("Run sync with the same --run name first. Your completed classroom example is also available in reference.")
    cd(folder) do
        settings = TOML.parsefile("DD.toml")
        out = get(get(settings,"io",Dict()),"output_dir","graphsplit_output")
        isabspath(out) && error("Choose an output_dir within this run in DD.toml.")
        out_abs = abspath(out)
        !startswith(relpath(out_abs,folder),"..") && out_abs != folder || error("Choose a dedicated output folder inside the run.")
        done = joinpath(out,"run_summary.toml")
        completed = "relocation_complete.toml"
        dd_inputs = ["catalog.txt", "stations.txt", "DD.toml", settings["travel_time"]["velocity_model_file"]]
        for key in ("theta_dir","thetastd_dir")
            append!(dd_inputs, filter(isfile, readdir(settings["io"][key]; join=true)))
        end
        hashes = Dict(f => fingerprint(f) for f in dd_inputs)
        if isfile(done) && isfile(completed) && TOML.parsefile(completed)["files"] == hashes
            println("The completed relocation is already here: ",out_abs)
            return
        end
        ispath(out) && error("A previous output exists at $out_abs. To compare revised settings or repeat an interrupted run, use a new --run name starting with sync.")
        script = joinpath(KIT,"software","GraphSplit.jl","run_graphsplit.jl")
        empty!(ARGS); push!(ARGS,"DD.toml")
        Base.include(Main, script)
        Base.invokelatest(() -> Main.main(["DD.toml"]))
        isfile(done) || error("GraphSplit returned before writing the run summary. See $out_abs.")
        open(completed,"w") do io
            TOML.print(io, Dict("files"=>hashes))
        end
        println("GraphSplit finished. The two supported-event catalogues are in ",out_abs)
    end
end

if isempty(ARGS) || first(ARGS) in ("-h","--help")
    println(USAGE)
else
    try
        stage, folder, source, config = options(copy(ARGS))
        stage == "sync" ? synchronize(folder, source, config) : relocate(folder)
    catch err
        print(stderr, "\nWorkshop: "); showerror(stderr, err); println(stderr)
        exit(1)
    end
end
