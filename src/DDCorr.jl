module DDCorr
using Dates, Printf, Statistics, LinearAlgebra, TOML, SHA, Serialization, Random
using DSP, FFTW
include("sac.jl")
include("signal.jl")
include("configuration.jl")
include("interface.jl")
include("pipeline.jl")
include("matrices.jl")
export run, inspect, load_config
end
