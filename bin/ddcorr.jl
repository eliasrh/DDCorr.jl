#!/usr/bin/env julia
using DDCorr

function main(args)
    if isempty(args) || any(x->x in ("--help","-h"),args)
        println("""
DDCorr: event SAC waveforms -> differential times for DDSync / GraphSplit

  julia --project=. --threads=auto bin/ddcorr.jl DDCorr.toml [options]

Options:
  --sac-dir PATH  Override input.sac_dir (relative to your current directory).
  --inspect       Check SAC headers, pick availability and window coverage only.
  --no-plots      Skip graphics; scientific/audit/matrix outputs are unchanged.

SAC layout: PATH/<original_event_id>/*.sac
Required: event origin/location, station coordinates, channel identity, P/S picks.
Missing picks are reported, never inferred from waveform filenames.
All TOML paths are relative to the TOML file. Every run gets a new output folder.
""")
        return
    end
    config=popfirst!(args);forward=String[];k=1
    while k<=length(args)
        arg=args[k]
        if arg=="--sac-dir"
            k<length(args) || error("--sac-dir needs a directory")
            k+=1;push!(forward,"--sac-dir="*args[k])
        elseif startswith(arg,"--sac-dir=") || arg in ("--inspect","--no-plots")
            push!(forward,arg)
        else
            error("Unknown option $arg. Use --help.")
        end
        k+=1
    end
    DDCorr.run(config;args=forward)
end

try
    main(copy(ARGS))
catch err
    err isa InterruptException && rethrow()
    println(stderr,"DDCorr: ",sprint(showerror,err))
    exit(1)
end
