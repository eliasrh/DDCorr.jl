# Reproduce the two waveforms and all lag scores for the worked dt.cc example.
# julia --project=. teaching/source/export_kver.jl ../Iceland100
using DDCorr, Statistics
dataset = abspath(only(ARGS))
cfg = DDCorr.load_config(joinpath(dataset, "DDCorr.toml"))
phase = cfg["phase"]["P"]
traces = map(enumerate(["S1_009900", "S1_009901"])) do (id, name)
    h = DDCorr.read_header(joinpath(dataset, "sac", name, "Z7.KVER..HHZ.sac"))
    event = DDCorr.Event(id, name, h.reference+h.floats[8], h.floats[36], h.floats[37], h.floats[39], [h])
    DDCorr.prepare(event, h, phase, cfg["preprocess"])
end
a,b = traces
workspace = DDCorr.CorrelationWorkspace(a.nfft, a.nlag)
curve = DDCorr.correlation!(workspace, a, b)
output = joinpath(@__DIR__, "figure_data", "kver")
mkpath(output)
open(joinpath(output,"curve.csv"), "w") do io
    DDCorr.csvrow(io,"lag_s","cc")
    for (k,r) in zip(-a.nlag:a.nlag, curve)
        DDCorr.csvrow(io, k/phase["sample_rate_hz"], r)
    end
end
open(joinpath(output,"waveforms.csv"), "w") do io
    DDCorr.csvrow(io,"time_s","event_1","event_2")
    core = a.nlag+1:a.nlag+a.ncore
    x,y = a.ext[core], b.ext[core]
    for (j,(u,v)) in enumerate(zip(x./std(x), y./std(y)))
        DDCorr.csvrow(io, phase["window_s"][1]+(j-1)/phase["sample_rate_hz"], u,v)
    end
end
