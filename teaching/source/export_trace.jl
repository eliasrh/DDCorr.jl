# Export exact DDCorr processing stages for the teaching PNGs.
# Usage: julia --project=. teaching/source/export_trace.jl FILE.sac OUTPUT_DIR
using DDCorr, DSP
function writedlm(path, rows, delim)
    open(path,"w") do io
        for row in eachrow(rows); DDCorr.csvrow(io,row...); end
    end
end
file,out=ARGS;mkpath(out)
cfg=DDCorr.load_config(joinpath(@__DIR__,"../../DDCorr.toml"));h=DDCorr.read_header(file)
pc=cfg["phase"]["P"];prep=cfg["preprocess"]
raw,y,z,dt=DDCorr.filtered_trace(h,pc,prep)
x=DDCorr.detrend(raw);tapered=DDCorr.taper!(copy(x),prep["trace_taper_fraction"])
p=DDCorr.pick(h,"a");t=h.floats[6].+(0:length(raw)-1).*h.floats[1].-p
writedlm(joinpath(out,"trace_stages.csv"),vcat(permutedims(["time_from_P_s","raw","detrended","tapered","filtered"]),hcat(t,raw,x,tapered,y)),',')
tz=h.floats[6].+(0:length(z)-1).*dt.-p
writedlm(joinpath(out,"resampled.csv"),vcat(["time_from_P_s" "amplitude"],hcat(tz,z)),',')
f=range(0.1,30;length=1000);hresp=freqresp(DDCorr.bandfilter(1/h.floats[1],pc),2pi.*f.*h.floats[1])
writedlm(joinpath(out,"filter_response.csv"),vcat(["Hz" "one_pass_gain" "two_pass_gain" "phase_rad"],hcat(f,abs.(hresp),abs2.(hresp),angle.(hresp))),',')
write(joinpath(out,"source.txt"),"Source SAC: $(basename(dirname(file)))/$(basename(file))\nActual DDCorr.filtered_trace; 2–14 Hz, order 4, 50 Hz target.\n")
