# Export selected computed windows/curves, without approximating DDCorr numerics.
using DDCorr, Serialization, Statistics
run,out=ARGS;mkpath(out);d=deserialize(joinpath(run,"report_data.jls"))
all=reduce(vcat,[g.examples for g in d.groups];init=NamedTuple[])
choices=[("weak",first(sort(all;by=e->e.row.cc))),("strong",last(sort(all;by=e->e.row.cc)))]
for (name,e) in choices
    r=e.row;a=e.a;b=e.b;pc=d.cfg["phase"][r.phase];fs=pc["sample_rate_hz"]
    t=pc["window_s"][1].+(0:a.ncore-1)./fs;L=a.nlag;n=a.ncore
    x=a.ext[L+1:L+n];y=b.ext[L+1:L+n]
    shifted=DDCorr.interpolate_grid(b.ext,pc["window_s"][1]-L/fs,1/fs,t.+r.lag)
    norm(v)=v./std(v;corrected=false)
    open(joinpath(out,name*"_waveforms.csv"),"w") do io
        DDCorr.csvrow(io,"time_s","A_fixed","B_unshifted","B_shifted")
        for row in eachrow(hcat(t,norm(x),norm(y),norm(shifted)));DDCorr.csvrow(io,row...);end
    end
    open(joinpath(out,name*"_curve.csv"),"w") do io
        DDCorr.csvrow(io,"lag_s","cc")
        for row in eachrow(hcat((-L:L)./fs,e.curve));DDCorr.csvrow(io,row...);end
    end
    write(joinpath(out,name*"_description.txt"),"$(r.station) $(r.phase); event_id $(r.i) / $(r.j); r=$(round(r.cc;digits=3)); lag=$(round(r.lag;digits=4)) s\nWaveforms: $(a.header.channel), first common component; curve averages $(r.ncomponents) SNR-qualified component(s).")
end
