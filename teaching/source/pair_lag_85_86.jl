# Reproduce the FLUR figure and the seven-station/phase timing check in slides 40–41.
# julia --project=. teaching/source/pair_lag_85_86.jl ../Iceland100 output.png
using DDCorr, DelimitedFiles, Statistics, Printf, CairoMakie

function phase_window(root, folder, id, channel, phase_settings, preprocessing)
    h = DDCorr.read_header(joinpath(root, "sac", folder, channel * ".sac"))
    event = DDCorr.Event(id, folder, h.reference + h.floats[8],
                         h.floats[36], h.floats[37], h.floats[39], [h])
    trace = DDCorr.prepare(event, h, phase_settings, preprocessing)
    _, _, filtered, step = DDCorr.filtered_trace(h, phase_settings, preprocessing)
    rate = phase_settings["sample_rate_hz"]
    offsets = phase_settings["window_s"][1] .+ (0:trace.ncore-1) ./ rate
    # Shift on the filtered parent trace. Shifting an already cut window would
    # interpolate twice and discard real samples at its edges.
    window(shift) = DDCorr.interpolate_grid(filtered, h.floats[6], step, (trace.pick + shift) .+ offsets)
    return (; trace, h, window)
end

function channel_check(root, channel, pc, prep)
    a = phase_window(root, "S1_009984", 85, channel, pc, prep)
    b = phase_window(root, "S1_009985", 86, channel, pc, prep)
    workspace = DDCorr.CorrelationWorkspace(a.trace.nfft, a.trace.nlag)
    sampled = copy(DDCorr.correlation!(workspace, a.trace, b.trace))
    ref_a, ref_b = a.window(0.0), b.window(0.0)
    at(shift) = (cor(ref_a, b.window(shift)) + cor(ref_b, a.window(-shift))) / 2
    # Keep the header reference-time subtraction separate from the phase markers.
    same_utc = (a.h.reference - b.h.reference) + (a.trace.pick - b.trace.pick)
    return (; a, b, sampled, at, same_utc)
end

function make_figure(channel, best_lag, fitted_lag, fs, output)
    fig = Figure(size=(1340,455), fontsize=20, backgroundcolor=:white)
    green, brown, ink = "#006D66", "#A6492D", "#243D3C"
    wave = Axis(fig[1,1], title="FLUR north component · original recordings",
                xlabel="Seconds within 13:32 UTC on 23 August 2014",
                yticks=([-1,1], ["Event 86","Event 85"]), xgridvisible=false, ygridvisible=false)
    minute = 60 * floor(channel.a.h.reference/60)
    mark = channel.a.h.reference-minute + channel.a.trace.pick
    left, right = mark-0.55, mark+1.65
    parts = map((channel.a,channel.b)) do item
        raw = DDCorr.read_samples(item.h)
        clock = (item.h.reference-minute+item.h.floats[6]) .+ (0:length(raw)-1) .* item.h.floats[1]
        keep = left .<= clock .<= right
        (; time=clock[keep], raw=raw[keep], mark=item.h.reference-minute+item.trace.pick)
    end
    scale = maximum(maximum(abs,p.raw) for p in parts)
    for (part,level,color) in zip(parts,(1.0,-1.0),(green,brown))
        lines!(wave,part.time,level .+ 0.86 .* part.raw ./ scale;color,linewidth=1.8)
        lines!(wave,[part.mark,part.mark],level .+ [-0.93,0.93];color,linewidth=2,linestyle=:dash)
    end
    xlims!(wave,left,right); ylims!(wave,-2.1,2.1)
    Label(fig[2,1], "Dashed lines mark the two predicted S times.", fontsize=18)

    ax = Axis(fig[1,2], title="FLUR S · correlation near the peak", xlabel="Lag relative to the S markers (ms)",
              ylabel="Signed correlation r", yticks=0.7:0.1:1, xticks=-245:5:-215)
    lags = range(-0.245,-0.215;length=301)
    lines!(ax,1000 .* lags,channel.at.(lags);color=green,linewidth=3)
    trial = [lag for lag in (-channel.a.trace.nlag:channel.a.trace.nlag) ./ fs if first(lags)<=lag<=last(lags)]
    scatter!(ax,1000 .* trial,channel.at.(trial);color=ink,markersize=15)
    scatter!(ax,[(1000 * fitted_lag)],[channel.at(fitted_lag)];color=brown,marker=:diamond,markersize=18)
    text!(ax,(1000 * best_lag)-0.1,channel.at(best_lag)-0.018;text=@sprintf("%.4f saved",channel.at(best_lag)),align=(:center,:top),fontsize=18,color=ink)
    text!(ax,(1000 * fitted_lag)+1.0,channel.at(fitted_lag)+0.010;text=@sprintf("%.4f at fitted lag",channel.at(fitted_lag)),align=(:left,:bottom),fontsize=18,color=brown)
    xlims!(ax,-245,-215); ylims!(ax,0.66,1.06)
    Label(fig[2,2], "Dots are DDCorr’s 20 ms trials. The curve remeasures r at finer lags.", fontsize=17)
    colgap!(fig.layout,24)
    save(output,fig;px_per_unit=1.3)
end

function main(root, output)
    config = DDCorr.load_config(joinpath(root,"DDCorr.toml"))
    data, header = readdlm(joinpath(root,"reference","correlations.csv"), ',', String, '\n'; header=true)
    col = Dict(name=>i for (i,name) in enumerate(vec(header)))
    rows = filter(row->row[col["event_i"]]=="85" && row[col["event_j"]]=="86", collect(eachrow(data)))
    @assert length(rows)==7
    println("station phase sampled_lag_ms fitted_lag_ms shared_UTC_lag_ms sampled_r saved_r weight fitted_r shared_UTC_r")
    for row in rows
        station, phase = row[col["station"]], row[col["phase"]]
        pc = config["phase"][phase]
        channels = [channel_check(root,c,pc,config["preprocess"]) for c in split(row[col["components"]],';')]
        curve = mean(c.sampled for c in channels)
        measure = DDCorr.measure(curve,pc,config["quality"])
        best_lag = (argmax(curve)-channels[1].a.trace.nlag-1)/pc["sample_rate_hz"]
        at(lag) = mean(c.at(lag) for c in channels)
        same_utc = mean(c.same_utc for c in channels)
        @assert maximum(abs(c.same_utc-same_utc) for c in channels)<1e-7
        @assert isapprox(at(best_lag),measure.cc;atol=1e-11)
        saved_r=config["output"]["coefficient_lag"]=="fitted" ? at(measure.lag) : measure.cc
        @assert isapprox(saved_r,parse(Float64,row[col["cc_signed"]]);atol=1e-11)
        @assert isapprox(saved_r^2,parse(Float64,row[col["weight"]]);atol=1e-11)
        @assert abs(measure.lag-parse(Float64,row[col["lag_B_later_s"]]))<=0.0000501
        @assert at(same_utc)>0.99999999
        @printf("%s %s %.3f %.3f %.3f %.7f %.7f %.6f %.7f %.10f\n",station,phase,
                (1000 * best_lag),(1000 * measure.lag),(1000 * same_utc),measure.cc,saved_r,saved_r^2,at(measure.lag),at(same_utc))
        if station=="Z7.FLUR" && phase=="S"
            make_figure(only(channels),best_lag,measure.lag,pc["sample_rate_hz"],output)
        end
    end
end

main(abspath(ARGS[1]),abspath(ARGS[2]))
