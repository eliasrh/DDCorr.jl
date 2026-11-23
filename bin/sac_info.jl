#!/usr/bin/env julia
# A first look at one binary SAC file, using the same reader as DDCorr.
using DDCorr, Dates, Printf

function main(args)
    if isempty(args) || "--help" in args
        println("Usage: julia --project=. bin/sac_info.jl SAC_FILE_OR_FOLDER [--plot FILE.png] [--p-header a] [--s-header t0]")
        println("Supply one SAC file, an event folder, or a folder of events. A directory displays the first SAC example in filename order.")
        println("Always lists A and T0–T9 with their text labels. P/S options select displayed/plot markers; they do not edit your TOML or SAC file.")
        return
    end
    file=popfirst!(args); options=Dict("--p-header"=>"a","--s-header"=>"t0","--plot"=>"")
    while !isempty(args)
        key=popfirst!(args)
        haskey(options,key) && !isempty(args) || error("Unknown or incomplete option: $key")
        options[key]=popfirst!(args)
    end
    if isdir(file)
        root=abspath(file)
        # Check at most the two levels accepted by the teaching workflow.
        dirs=[root;filter(isdir,readdir(root;join=true))]
        for dir in dirs
            names=readdir(dir)
            example=findfirst(f->endswith(lowercase(f),".sac") && isfile(joinpath(dir,f)),names)
            if example!==nothing
                file=joinpath(dir,names[example])
                break
            end
        end
        isfile(file) || error("No *.sac file in $root or its event folders")
    end
    h=DDCorr.read_header(file)
    utc(x)=isfinite(x) ? string(unix2datetime(x))*"Z" : "undefined"
    println("File: ",abspath(file),"\nChannel: ",DDCorr.channelkey(h),"\nSAC version: ",h.ints[7])
    println("Reference UTC (NZ fields): ",utc(h.reference))
    for (name,index,unit) in [("DELTA",1,"s/sample"),("B",6,"s from reference"),("O",8,"s from reference"),
            ("EVLA",36,"degrees"),("EVLO",37,"degrees"),("EVDP",39,"source units (usually km)"),("MAG",40,"event magnitude"),
            ("STLA",32,"degrees"),("STLO",33,"degrees"),("STEL",34,"m"),("CMPAZ",58,"degrees"),("CMPINC",59,"degrees")]
        @printf("%-8s %14.6f  %s\n",name,h.floats[index],unit)
    end
    println("NPTS     ",h.ints[10]," samples\nOrigin UTC: ",utc(h.reference+h.floats[8]))
    # SAC's 192-byte character block follows 70 Float32 and 40 Int32 values.
    # KA is character slot 6; KT0–KT9 are slots 7–16 (KEVNM takes two slots).
    chars=open(file) do io
        seek(io,440)
        read(io,192)
    end
    function picklabel(slot)
        value=strip(replace(String(chars[8*(slot-1)+1:8*slot]), '\0'=>""))
        return isempty(value) || value=="-12345" ? "(undefined)" : value
    end
    println("\nArrival fields (seconds from the SAC reference time):")
    @printf("%-6s %14s  %-7s %s\n","Field","Time (s)","Label","Label text")
    for (field,slot) in vcat([("a",6)],[("t$i",7+i) for i in 0:9])
        @printf("%-6s %14.6f  %-7s %s\n",uppercase(field),DDCorr.pick(h,field),"K"*uppercase(field),picklabel(slot))
    end
    println("Set [input] p_pick_header / s_pick_header to the FIELD names (e.g. t8 / t9), not label text (e.g. Pm / Sm).")
    println("Labels are supplied by the data author. Confirm their meaning; a finite time alone does not identify its phase.")
    println("\nSelected P/S markers (defaults A/T0 unless overridden below):")
    picks=Dict{String,Float64}()
    for phase in ("P","S")
        field=lowercase(options["--"*lowercase(phase)*"-header"])
        haskey(DDCorr.PICK_FIELDS,field) || error("Unknown SAC pick field: $field")
        p=DDCorr.pick(h,field);picks[phase]=p
        println(phase," uses ",uppercase(field)," = ",p," s from reference; UTC ",utc(h.reference+p),"; pick − origin = ",p-h.floats[8]," s")
    end
    println("Undefined numeric headers display NaN. Header values describe the file; they do not certify a pick's accuracy.")
    if !isempty(options["--plot"])
        path=abspath(options["--plot"]);endswith(lowercase(path),".png") || error("Use a .png output")
        @eval using CairoMakie
        Base.invokelatest() do
            data=DDCorr.read_samples(h);t=h.floats[6].+(0:length(data)-1).*h.floats[1].-h.floats[8]
            fig=Figure(size=(1250,520),fontsize=20)
            ax=Axis(fig[1,1],title="$(DDCorr.channelkey(h)) · raw SAC samples",xlabel="Seconds from catalogue origin",ylabel="Recorded amplitude (archive units)")
            lines!(ax,t,data;color="#216F88",linewidth=1)
            for (ph,p) in sort(collect(picks))
                isfinite(p) && vlines!(ax,[p-h.floats[8]];label="$ph header",color=ph=="P" ? "#BF652F" : "#7156A4",linestyle=:dash)
            end
            axislegend(ax);mkpath(dirname(path));save(path,fig;px_per_unit=1.5);println("PNG: ",path)
        end
    end
end
try main(copy(ARGS)) catch err
    err isa InterruptException && rethrow()
    println(stderr,sprint(showerror,err));exit(1)
end
