using CairoMakie
include("closure.jl")
include("matrix_plots.jl")

const REPORT_COLORS = Dict("P"=>"#167d9a","S"=>"#c26034")
function savefigure(out,name,fig)
    save(joinpath(out,name*".png"),fig;px_per_unit=1.5)
end

function graph_degrees(events,rows)
    neighbors=Dict(e.id=>Set{Int}() for e in events)
    for r in rows;push!(neighbors[r.i],r.j);push!(neighbors[r.j],r.i);end
    visited=Set{Int}();sizes=Int[]
    for e in events
        e.id in visited && continue
        todo=[e.id];push!(visited,e.id);n=0
        while !isempty(todo)
            i=pop!(todo);n+=1
            for j in neighbors[i]
                if !(j in visited);push!(visited,j);push!(todo,j);end
            end
        end
        push!(sizes,n)
    end
    return [length(neighbors[e.id]) for e in events],sort(sizes;rev=true)
end

function summary_figure(out,events,groups,rows,cfg)
    fig=Figure(size=(1400,1050),fontsize=16)
    Label(fig[0,:],"DDCorr waveform correlations · $(length(events)) events",fontsize=27,font=:bold)
    a=Axis(fig[1,1],title="All measured peaks, including rejected pairs",xlabel="Signed correlation coefficient",ylabel="Candidate pairs")
    for ph in ("P","S")
        h=reduce(+,[g.hist for g in groups if g.phase==ph];init=zeros(Int,40))
        stairs!(a,collect(-0.975:0.05:0.975),h;label=ph,color=REPORT_COLORS[ph])
        vlines!(a,[cfg["phase"][ph]["min_cc"]];color=REPORT_COLORS[ph],linestyle=:dash)
    end
    axislegend(a;position=:lt)
    b=Axis(fig[1,2],title="Accepted correlation coefficients",xlabel="Signed r",ylabel="Observations")
    for ph in ("P","S")
        vals=[r.cc for r in rows if r.phase==ph]
        isempty(vals)||hist!(b,vals;bins=collect(-1:0.025:1),color=(REPORT_COLORS[ph],0.55),label=ph)
    end
    c=Axis(fig[2,1],title="Accepted residual lags after pick alignment",xlabel="Lag (s); positive: shift j left to align",ylabel="Observations")
    for ph in ("P","S")
        vals=[r.lag for r in rows if r.phase==ph];maxlag=cfg["phase"][ph]["max_lag_s"]
        isempty(vals)||hist!(c,vals;bins=range(-maxlag,maxlag;length=61),color=(REPORT_COLORS[ph],0.55),label=ph)
    end
    isempty(rows)||axislegend(c)
    deg,sizes=graph_degrees(events,rows)
    d=Axis(fig[2,2],title="Event graph degree ($(count(==(0),deg)) isolated)",xlabel="Distinct connected events",ylabel="Events")
    hist!(d,deg;bins=30,color="#42526a")
    keys=sort(unique(g.station for g in groups));pos=Dict(k=>i for (i,k) in enumerate(keys))
    e=Axis(fig[3,1],title="Accepted observations by station",xticks=(1:length(keys),keys),xticklabelrotation=pi/4,ylabel="Observations")
    for (j,ph) in enumerate(("P","S"))
        counts=[count(r->r.station==k&&r.phase==ph,rows) for k in keys]
        barplot!(e,[pos[k]+(j==1 ? -0.18 : 0.18) for k in keys],counts;width=0.34,color=REPORT_COLORS[ph],label=ph)
    end
    axislegend(e)
    states=sort(unique(k for g in groups for k in Base.keys(g.counts)))
    f=Axis(fig[3,2],title="Pair decisions after trace quality checks",xticks=(1:length(states),replace.(states,"_"=>" ")),xticklabelrotation=pi/4,ylabel="Pairs")
    counts=[sum(get(g.counts,s,0) for g in groups) for s in states]
    barplot!(f,1:length(states),counts;color=[s=="accepted" ? "#167d9a" : "#9aabb6" for s in states])
    savefigure(out,"summary",fig)
    return deg,sizes
end

"Check the actual forward/reverse bandpass response and a real SAC spectrum."
function filter_audit(out,cfg,examples)
    fig=Figure(size=(1400,950),fontsize=16)
    Label(fig[0,:],"Filter audit · actual response and waveform spectra",fontsize=26,font=:bold)
    open(joinpath(out,"filter_tone_audit.csv"),"w") do io
        csvrow(io,"phase","native_sample_rate_hz","frequency_hz","expected_final_gain","measured_gain")
        for (column,ph) in enumerate(("P","S"))
            pc=cfg["phase"][ph];available=filter(x->x.row.phase==ph,examples)
            fs=isempty(available) ? max(100.0,pc["sample_rate_hz"]) : 1/available[end].a.header.floats[1]
            f=bandfilter(fs,pc);lo,hi=pc["band_hz"];fmax=min(fs/2,2hi)
            hz=range(0,fmax;length=1500)
            a=Axis(fig[1,column],title="$ph: $(pc["band_hz"]) Hz at native $(round(fs;digits=2)) Hz",xlabel="Frequency (Hz)",ylabel="Amplitude gain",limits=(0,fmax,0,1.1))
            lines!(a,hz,[abs(freqresp(f,2pi*x/fs))^2 for x in hz];color=REPORT_COLORS[ph],label="Butterworth, forward + reverse")
            n=ceil(Int,max(200fs,40fs/lo));t=(0:n-1)./fs;keep=round(Int,n*0.2):round(Int,n*0.8)
            tones=[lo/2,lo,sqrt(lo*hi),hi,min(1.5hi,0.45fs)];gains=Float64[]
            for x in tones
                signal=sin.(2pi*x.*t);filtered=filtfilt(f,signal)
                gain=dot(filtered[keep],signal[keep])/dot(signal[keep],signal[keep]);push!(gains,gain)
                csvrow(io,ph,fs,x,abs(freqresp(f,2pi*x/fs))^2,gain)
            end
            scatter!(a,tones,gains;color=REPORT_COLORS[ph],markersize=8,label="Measured sinusoid gain")
            axislegend(a;position=:rt,labelsize=11)
            b=Axis(fig[2,column],title="$ph: raw and filtered SAC, same amplitude reference",xlabel="Frequency (Hz)",ylabel="Power spectral density (relative dB)",limits=(0,fmax,-100,10))
            if !isempty(available)
                h=available[end].a.header;raw,y,z,dt=filtered_trace(h,pc,cfg["preprocess"])
                p=pick(h,pc["pick_header"]);t0=h.floats[6]
                j1=max(1,round(Int,(p-3-t0)*fs)+1);j2=min(length(raw),round(Int,(p+8-t0)*fs)+1)
                nseg=min(j2-j1+1,round(Int,4fs))
                pr=welch_pgram(detrend(raw[j1:j2]),nseg,nseg÷2;fs=fs,window=hanning)
                pf=welch_pgram(y[j1:j2],nseg,nseg÷2;fs=fs,window=hanning)
                normp=max(maximum(power(pr)),eps())
                for (pgram,color,label) in [(pr,"#929ba4","Raw SAC"),(pf,REPORT_COLORS[ph],"Filtered at native rate")]
                    lines!(b,freq(pgram),10log10.(max.(power(pgram)./normp,1e-12));color=color,label=label)
                end
                b.title="$(available[end].row.station) $ph · $(available[end].a.event.name)"
                axislegend(b;labelsize=12)
            end
        end
    end
    Label(fig[3,:],"Forward–reverse filtering has amplitude gain |H|²: each corner is 0.5 (−6 dB).\nSpectra share the raw amplitude reference. The polyphase resampler additionally prevents aliasing before lowering the sampling rate.",fontsize=14)
    savefigure(out,"filter_audit",fig)
end

function example_figure(out,index,ex,cfg)
    r=ex.row;a=ex.a;b=ex.b;pc=cfg["phase"][r.phase];fs=pc["sample_rate_hz"]
    n=a.ncore;L=a.nlag;t=pc["window_s"][1] .+ (0:n-1)./fs
    ac=a.ext[L+1:L+n];bc=b.ext[L+1:L+n]
    shifted=interpolate_grid(b.ext,pc["window_s"][1]-L/fs,1/fs,t .+ r.lag)
    scale(x)=x./max(std(x;corrected=false),eps())
    fig=Figure(size=(1250,860),fontsize=16)
    Label(fig[0,:],"$(r.station) $(r.phase) · event_id $(r.i) / $(r.j) · folders $(a.event.name) / $(b.event.name)",fontsize=23,font=:bold)
    ax=Axis(fig[1,1],title="Filtered windows at original picks",xlabel="Seconds relative to phase pick",ylabel="Normalized amplitude")
    lines!(ax,t,scale(ac);label="Event i",color="#167d9a");lines!(ax,t,scale(bc);label="Event j",color="#c26034");axislegend(ax;position=:rt)
    bx=Axis(fig[2,1],title="After correction: lag=$(round(r.lag;digits=4)) s; dt(i−j)=$(round(r.dt;digits=4)) s",xlabel="Seconds relative to phase pick",ylabel="Normalized amplitude")
    lines!(bx,t,scale(ac);color="#167d9a");lines!(bx,t,scale(shifted);color="#c26034")
    cx=Axis(fig[3,1],title="$(r.ncomponents)-component symmetric correlation; r=$(round(r.cc;digits=3)), peak gap=$(round(r.gap;digits=3))",xlabel="Lag after pick alignment (s); positive: shift j left to align",ylabel="Signed correlation",limits=(nothing,nothing,-1,1))
    lines!(cx,(-L:L)./fs,ex.curve;color="#42526a");vlines!(cx,[r.lag];color="#c26034",linestyle=:dash)
    hlines!(cx,[pc["min_cc"]];color="#167d9a",linestyle=:dash)
    Label(fig[4,:],"$(pc["band_hz"]) Hz · RMS SNR ≥ $(round(r.snr;digits=2)) · $(round(r.distance;digits=2)) km seed separation\nWaveforms show first common component ($(a.header.channel)); correlation uses all $(r.ncomponents) listed components.",fontsize=13)
    name=@sprintf("example_%02d_%s_%s",index,r.station,r.phase)
    savefigure(out,name,fig);return name
end

escapehtml(x)=replace(string(x),'&'=>"&amp;",'<'=>"&lt;",'>'=>"&gt;",'"'=>"&quot;")
function make_report(out,events,groups,rows,cfg)
    set_theme!(Theme(fontsize=16,backgroundcolor=:white))
    plot=cfg["plots"];deg,sizes=graph_degrees(events,rows)
    plot["summary"] && summary_figure(out,events,groups,rows,cfg)
    plot["closure"] && closure_diagnostics(out,groups;maximum_samples=cfg["diagnostics"]["max_closure_triangles"])
    candidates=reduce(vcat,[g.examples for g in groups];init=NamedTuple[])
    examples=candidates;maxex=plot["max_examples"]
    explicit=!isempty(plot["event_pairs"])
    explicit && length(examples)>cfg["diagnostics"]["max_requested_examples"] && error("Explicit selection needs $(length(examples)) figures; narrow example_stations/example_phases or raise diagnostics.max_requested_examples")
    if !explicit && length(examples)>maxex
        examples=examples[spaced_indices(length(examples),maxex)]
    end
    matrix_names = cfg["matrices"]["enabled"] && cfg["matrices"]["plots"] ? matrix_figures(out,events,rows,cfg) : String[]
    plot["filters"] && filter_audit(out,cfg,candidates)
    names=plot["examples"] ? [example_figure(out,i,e,cfg) for (i,e) in enumerate(examples)] : String[]
    open(joinpath(out,"example_selection.csv"),"w") do io
        csvrow(io,"event_i","event_j","original_event_i","original_event_j","station","phase","cc_signed","selection","figure")
        for (ex,name) in zip(examples,names)
            r=ex.row
            csvrow(io,r.i,r.j,ex.a.event.name,ex.b.event.name,r.station,r.phase,r.cc,isempty(plot["event_pairs"]) ? "deterministic weak/middle/strong per group, then evenly spaced group order" : "explicit requested event pair",name*".png")
        end
        for pair in plot["event_pairs"]
            i,j=sort(Int.(pair))
            if !any(r->r.i==i && r.j==j,rows)
                csvrow(io,i,j,events[i].name,events[j].name,"","",NaN,"requested pair has no accepted observations; not plotted","")
            elseif !any(ex->ex.row.i==i && ex.row.j==j,examples) || !plot["examples"]
                csvrow(io,i,j,events[i].name,events[j].name,"","",NaN,"accepted pair has no figure in selected stations/phases, or examples=false","")
            end
        end
    end
    open(joinpath(out,"event_connectivity.csv"),"w") do io
        csvrow(io,"event_id","original_event_id","degree")
        for (e,d) in zip(events,deg);csvrow(io,e.id,e.name,d);end
    end
    open(joinpath(out,"report.html"),"w") do io
        print(io,"""<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DDCorr diagnostics</title>
        <style>body{font:17px/1.6 system-ui;color:#203045;background:#f2f5f8;max-width:1250px;margin:32px auto;padding:20px}h1{font-size:36px}h2{margin-top:40px}img{width:100%;background:white;border-radius:10px}a{color:#087592}.cards{display:flex;gap:16px;flex-wrap:wrap}.card{background:white;border-radius:12px;padding:20px;flex:1}.n{font-size:32px;font-weight:700}code{background:#e2e8ee;padding:3px}details{background:white;padding:16px;margin:12px 0;border-radius:8px}</style>
        <h1>DDCorr waveform correlations</h1><p>SAC headers → phase windows → signed correlations → DDSync and GraphSplit inputs.</p>
        <div class="cards"><div class="card"><div class="n">$(length(events))</div>events</div><div class="card"><div class="n">$(count(r->r.phase=="P",rows))</div>P observations</div><div class="card"><div class="n">$(count(r->r.phase=="S",rows))</div>S observations</div><div class="card"><div class="n">$(count(==(0),deg))</div>isolated events</div></div>
        <p>Polarity: <b>$(escapehtml(cfg["quality"]["polarity"]))</b>. Largest graph components: $(join(sizes[1:min(8,end)],", ")). Connectedness does not guarantee relocation geometry or verify that a detection is an earthquake.</p>
        <p>IDs are sequential across valid input events, including isolated events. <a href="event_id_map.csv">Original ID map</a>. <a href="near_identity.csv">Near-identical arrival flags</a> are review evidence; no events were automatically deleted.</p>""")
        print(io,"""<p><strong>What does the lag mean?</strong> Each waveform is first centred on its own phase pick. A positive lag of +0.10 s means the matching feature in event j is 0.10 s later within that pick-centred window; shift j left by 0.10 s to align it with i. It does not mean the earthquakes occurred 0.10 s apart. The exported differential travel time is <code>dt(i−j) = (pick_i−origin_i) − (pick_j−origin_j) − lag</code>. Template-derived picks can change correlation windows and noise estimates, so accepted-pair counts need not increase even when more traces have picks.</p>""")
        exclusions=joinpath(out,"station_exclusions.csv")
        nexcluded=isfile(exclusions) ? max(0,countlines(exclusions)-1) : 0
        if nexcluded>0
            print(io,"""<p role="alert"><strong>Warning: $nexcluded station(s) excluded because recorded coordinates conflict.</strong> All events and both phases at those stations were omitted; processing continued with the other stations. <a href="station_exclusions.csv">Excluded stations and reasons</a> · <a href="station_epochs.csv">Coordinates and source files</a>.</p>""")
        end
        if !isempty(matrix_names)
            print(io,"""<h2>Station/phase matrices (PNG)</h2><p><a href="matrices/index.csv">Matrix file index</a>. Grey cells are missing observations, not zero correlations. Dense CSVs need <code>[matrices] dense=true</code>.</p>""")
            for name in matrix_names
                print(io,"""<details><summary>$(escapehtml(name))</summary><img src="$(escapehtml(name))" alt="Accepted station phase correlation and timing matrices"></details>""")
            end
        end
        if plot["summary"]
            print(io,"""<h2>Quality and connectivity</h2><img src="summary.png" alt="Correlation, lag, station and connectivity distributions"><p>Pair decisions follow trace preprocessing. <a href="preprocessing_issues.csv">Trace exclusions</a>, <a href="phase_readiness.csv">pick/window readiness</a>, and <a href="input_issues.csv">header issues</a> explain losses.</p>""")
        end
        if plot["closure"]
            print(io,"""<h2>Cycle consistency</h2><img src="triangle_closure.png" alt="Triangle closure"><p><a href="triangle_closure_summary.csv">Closure table</a>. Broad tails reveal mutually inconsistent relative times. Coherent noise and event-specific biases can still close triangles, so closure is not independent accuracy.</p>""")
        end
        if plot["filters"]
            print(io,"""<h2>Filter audit</h2><img src="filter_audit.png" alt="Filter response and spectra"><p><a href="filter_tone_audit.csv">Measured tone gains</a>. Filters cannot restore frequencies already absent from an input SAC file.</p>""")
        end
        if plot["examples"]
            print(io,"""<h2>Accepted pair examples</h2><p>Automatic selection takes weak, middle and strong accepted coefficients in each station/phase, then evenly samples the ordered list if it exceeds max_examples. Explicit event_pairs uses output IDs and the same accepted observations. <a href="example_selection.csv">Exact selection ledger</a>. Examples do not validate every edge.</p>""")
            for name in names
                print(io,"<details><summary>$(escapehtml(name))</summary><img loading=\"lazy\" src=\"$name.png\" alt=\"Aligned waveforms and correlation\"></details>")
            end
        end
        print(io,"""<h2>Files and conventions</h2><ul><li><a href="dt.cc">dt.cc</a>: travel time i minus j; weight mode $(escapehtml(cfg["output"]["weight"])).</li><li><a href="correlations.csv">Correlation audit</a>: signed r, lag, peak gap, SNR and components.</li><li><a href="catalog.txt">Catalogue</a> · <a href="stations.txt">Stations</a> · <a href="event_id_map.csv">ID map</a>.</li><li><a href="effective_config.toml">Effective settings</a> · <a href="run_summary.toml">Run summary</a> · <a href="group_summary.csv">Group decisions</a>.</li></ul><p>Parabolic lag interpolation improves grid resolution; it is not an uncertainty estimate. Correlation weights are not inverse timing variances. Review sparse support, competing peaks, near-identical traces and inconsistent cycles before interpreting relocated structures.</p></html>""")
    end
end
