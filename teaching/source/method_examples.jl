# Reproduce the measured curves used in the Friday figures.
# julia --project=/path/to/DDCorr.jl method_examples.jl /path/to/Iceland100 OUTPUT_DIR
using DDCorr

const DATASET = abspath(ARGS[1])
const OUTPUT_DIR = abspath(ARGS[2])
const CONFIG = DDCorr.load_config(joinpath(DATASET, "DDCorr.toml"))
const EVENT_NAMES = sort(filter(n -> startswith(n, "S1_"), readdir(joinpath(DATASET, "sac"))))
mkpath(OUTPUT_DIR)

function prepared_trace(id, station, channel, phase_config)
    name = EVENT_NAMES[id]
    waveform = joinpath(DATASET, "sac", name, "$station..$channel.sac")
    h = DDCorr.read_header(waveform)
    event = DDCorr.Event(id, name, h.reference + h.floats[8], h.floats[36], h.floats[37], h.floats[39], [h])
    return DDCorr.prepare(event, h, phase_config, CONFIG["preprocess"])
end

function save_columns(file, header, columns...)
    open(joinpath(OUTPUT_DIR, file), "w") do io
        DDCorr.csvrow(io, header...)
        for row in zip(columns...)
            DDCorr.csvrow(io, row...)
        end
    end
end

function compare_pair(ids, station, channel, phase_config)
    i, j = [prepared_trace(id, station, channel, phase_config) for id in ids]
    work = DDCorr.CorrelationWorkspace(i.nfft, i.nlag)
    coeff = copy(DDCorr.correlation!(work, i, j))
    # Recover both normalized curves from the products calculated by correlation!.
    # Reverse the second curve so both arrays use positive = event j later.
    n = i.ncore
    fixed_i = [work.ab[n+k-1] / (i.template_norm * j.sliding_norm[k]) for k in eachindex(coeff)]
    fixed_j = reverse([work.ba[n+k-1] / (j.template_norm * i.sliding_norm[k]) for k in eachindex(coeff)])
    @assert isapprox(coeff, (fixed_i .+ fixed_j) ./ 2; atol=1e-12)
    lags = collect(-i.nlag:i.nlag) ./ phase_config["sample_rate_hz"]
    return (; i, j, coeff, fixed_i, fixed_j, lags)
end

function measured(label, curve, phase_config)
    result = DDCorr.measure(curve, phase_config, CONFIG["quality"])
    println(label, " ", result)
    return result
end

function export_examples()
    p = CONFIG["phase"]["P"]
    s = CONFIG["phase"]["S"]

    kver = compare_pair((1, 2), "Z7.KVER", "HHZ", p)
    println("KVER P SNR ", kver.i.snr, " and ", kver.j.snr)
    times = p["window_s"][1] .+ collect(-kver.i.nlag:kver.i.ncore+kver.i.nlag-1) ./ p["sample_rate_hz"]
    save_columns("kver_full_windows.csv", ["seconds_from_marker", "event_1", "event_2"], times, kver.i.ext, kver.j.ext)

    order = compare_pair((86, 97), "Z7.DYSA", "HHZ", p)
    save_columns("order.csv", ["lag_s", "i_fixed", "j_fixed", "symmetric"], order.lags, order.fixed_i, order.fixed_j, order.coeff)
    measured("DYSA finite-window order", order.coeff, p)

    east = compare_pair((28, 45), "Z7.STAM", "HHE", s)
    north = compare_pair((28, 45), "Z7.STAM", "HHN", s)
    average = (east.coeff .+ north.coeff) ./ 2
    save_columns("stam_s.csv", ["lag_s", "HHE", "HHN", "mean"], east.lags, east.coeff, north.coeff, average)
    measured("STAM S east", east.coeff, s)
    measured("STAM S north", north.coeff, s)
    stack = measured("STAM S mean", average, s)
    println("STAM S dt = ", DDCorr.differential_time(east.i, east.j, stack.lag))

    for (file, max_lag_s) in [("boundary.csv", 0.50), ("boundary_wider.csv", 0.70)]
        config = deepcopy(p)
        config["max_lag_s"] = max_lag_s
        pair = compare_pair((29, 41), "Z7.DYSA", "HHZ", config)
        save_columns(file, ["lag_s", "r"], pair.lags, pair.coeff)
        measured("DYSA ±$max_lag_s s", pair.coeff, config)
    end

    narrower_p = deepcopy(p)
    narrower_p["band_hz"] = [4.0, 8.0]
    baseline = compare_pair((13, 27), "Z7.KVER", "HHZ", p)
    narrow = compare_pair((13, 27), "Z7.KVER", "HHZ", narrower_p)
    save_columns("competition.csv", ["lag_s", "baseline_cc", "narrow_cc"], baseline.lags, baseline.coeff, narrow.coeff)
    measured("KVER 2–14 Hz", baseline.coeff, p)
    measured("KVER 4–8 Hz", narrow.coeff, narrower_p)
end

export_examples()
