using DDCorr, Statistics
input, config, output = ARGS
cfg = DDCorr.load_config(config)
pc = cfg["phase"]["P"]
a,b = map(enumerate(["1201","17"])) do (id, name)
    h = DDCorr.read_header(joinpath(input,name,"XX.S01..HHZ.sac"))
    e = DDCorr.Event(id,name,h.reference+h.floats[8],h.floats[36],h.floats[37],h.floats[39],[h])
    DDCorr.prepare(e,h,pc,cfg["preprocess"])
end
w=DDCorr.CorrelationWorkspace(a.nfft,a.nlag)
cv=DDCorr.correlation!(w,a,b)
m=DDCorr.measure(cv,pc,cfg["quality"])
t=pc["window_s"][1] .+ (0:a.ncore-1)./pc["sample_rate_hz"]
core = a.nlag+1:a.nlag+a.ncore
x,y = a.ext[core], b.ext[core]
shifted=DDCorr.interpolate_grid(b.ext,pc["window_s"][1]-a.nlag/pc["sample_rate_hz"],1/pc["sample_rate_hz"],t.+m.lag)
open(output,"w") do io
 println(io,"time,event1,event2,event2_shifted")
 for (ti,xi,yi,zi) in zip(t,x./std(x;corrected=false),y./std(y;corrected=false),shifted./std(shifted;corrected=false))
  println(io,join((ti,xi,yi,zi),","))
 end
end
@show m.lag m.cc
