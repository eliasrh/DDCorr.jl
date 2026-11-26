"Remove mean and least-squares linear trend, without constructing a design matrix."
function detrend(x)
    y=Float64.(x); n=length(y); y .-= mean(y)
    t=range(-1,1;length=n)
    slope=dot(t,y)/sum(abs2,t)
    y .-= slope .* t
    return y
end

function taper!(x,fraction)
    n=min(length(x)÷2,round(Int,fraction*length(x)))
    for k in 1:n
        w=0.5*(1-cospi(k/(n+1)))
        x[k]*=w; x[end-k+1]*=w
    end
    return x
end

"Corners are in Hz. SOS prevents numerical problems at the low S corner."
function bandfilter(fs,pc)
    lo,hi=pc["band_hz"]
    0<lo<hi<0.45fs || error("Band $(lo)–$(hi) Hz needs native fs > $(hi/0.45) Hz; never silently clipped")
    return convert(SecondOrderSections,digitalfilter(Bandpass(lo,hi),Butterworth(pc["filter_order"]);fs=fs))
end

function filtered_trace(h,pc,prep)
    raw=read_samples(h)
    x=taper!(detrend(raw),prep["trace_taper_fraction"])
    native_fs=1/h.floats[1]
    y=filtfilt(bandfilter(native_fs,pc),x)
    target=pc["sample_rate_hz"]
    target<=native_fs*(1+1e-6) || error("Requested sampling exceeds native rate")
    # DSP.resample is a delay-compensated polyphase FIR resampler with anti-aliasing.
    ratio=rationalize(target/native_fs;tol=1e-7)
    z=ratio==1 ? y : resample(y,ratio)
    return raw,y,z,h.floats[1]/Float64(ratio)
end

function interpolate_grid(y,b,dt,times)
    out=Vector{Float64}(undef,length(times))
    return interpolate_grid!(out,y,b,dt,times)
end

function interpolate_grid!(out,y,b,dt,times)
    for (i,t) in enumerate(times)
        q=(t-b)/dt+1; j=floor(Int,q); a=q-j
        1<=j<length(y) || error("Requested window outside SAC samples")
        out[i]=muladd(a,y[j+1]-y[j],y[j])
    end
    return out
end

struct CachedTrace
    event::Event
    header::SACHeader
    pick::Float64
    reduced_pick::Float64
    ext::Vector{Float64}
    template_fft::Vector{ComplexF64}
    extended_fft::Vector{ComplexF64}
    sliding_norm::Vector{Float64}
    template_norm::Float64
    snr::Float64
    ncore::Int
    nlag::Int
    nfft::Int
end

function cache_vector(ext,ncore,nlag)
    length(ext)==ncore+2nlag || error("Bad extended window length")
    core=ext[nlag+1:nlag+ncore]; core .-= mean(core)
    tn=norm(core); tn>eps(Float64)*maximum(abs,ext) || error("Flat waveform")
    sums=vcat(0.0,cumsum(ext)); squares=vcat(0.0,cumsum(abs2.(ext)))
    norms=[sqrt(max(0.0,squares[k+ncore]-squares[k]-(sums[k+ncore]-sums[k])^2/ncore)) for k in 1:2nlag+1]
    minimum(norms)>eps(Float64)*maximum(abs,ext) || error("Flat search window")
    nf=nextpow(2,ncore+length(ext)-1)
    tf=rfft(vcat(reverse(core),zeros(nf-ncore)))
    ef=rfft(vcat(ext,zeros(nf-length(ext))))
    return tf,ef,norms,tn,nf
end

"Only the filtered parent samples needed to shift the phase window in either direction."
struct FilteredWindow
    samples::Vector{Float64}
    begin_s::Float64
    step_s::Float64
    core_start_s::Float64
    grid_step_s::Float64
end

prepare(e,h,pc,prep) = first(prepare_trace(e,h,pc,prep,false))

function prepare_trace(e,h,pc,prep,keep_parent)
    p=pick(h,pc["pick_header"])
    isfinite(p) || error("Missing $(pc["pick_header"]) pick")
    origin=h.floats[8]
    isfinite(origin) || error("Missing O")
    abs(h.reference+origin-e.origin)<=prep["origin_tolerance_s"] || error("Origin inconsistent with event")
    p>origin || error("Pick is not after origin")
    fs=pc["sample_rate_hz"]; a,b=pc["window_s"]; lag=pc["max_lag_s"]
    n=round(Int,(b-a)*fs)+1; L=round(Int,lag*fs)
    start=p+a-L/fs; stop=p+a+(n-1+L)/fs
    margin=pc["filter_padding_s"]
    sacbegin=h.floats[6]; sacend=sacbegin+(h.ints[10]-1)*h.floats[1]
    # All phases use a pre-P noise window to avoid labelling the P coda as S noise.
    pp=pick(h,prep["noise_pick_header"])
    isfinite(pp) || error("Missing pre-P noise anchor")
    na,nb=pp .+ prep["noise_window_s"]
    min(start,na)-margin>=sacbegin && max(stop,nb)+margin<=sacend || error("Insufficient real data around filter/window edges")
    raw,y,z,dt=filtered_trace(h,pc,prep)
    ext=interpolate_grid(z,sacbegin,dt,start .+ (0:n+2L-1)./fs)
    noise=interpolate_grid(z,sacbegin,dt,range(na,nb;step=1/fs))
    noise .-= mean(noise)
    nr=sqrt(mean(abs2,noise))
    nr>0 || error("Zero noise RMS")
    core=ext[L+1:L+n]; signal_rms=std(core;corrected=false)
    snr=signal_rms/nr
    snr>=pc["min_snr"] || error("Below minimum band-limited RMS SNR")
    tf,ef,norms,tn,nf=cache_vector(ext,n,L)
    # Avoid subtracting large Unix epochs for the important pick-origin difference.
    reduced=(h.reference-e.origin)+p
    trace=CachedTrace(e,h,p,reduced,ext,tf,ef,norms,tn,snr,n,L,nf)
    keep_parent || return trace,nothing
    # Keep interpolation neighbours at both ends of the allowed lag range.
    first_parent=max(1,floor(Int,(start-sacbegin)/dt))
    last_parent=min(length(z),ceil(Int,(stop-sacbegin)/dt)+2)
    parent=FilteredWindow(z[first_parent:last_parent],sacbegin+(first_parent-1)*dt,dt,p+a,1/fs)
    return trace,parent
end

function sample_shifted!(shifted,moving::FilteredWindow,lag)
    times=range(moving.core_start_s+lag;step=moving.grid_step_s,length=length(shifted))
    return interpolate_grid!(shifted,moving.samples,moving.begin_s,moving.step_s,times)
end

"Pearson r for one fixed core and one window shifted on its filtered parent trace."
function shifted_correlation!(buffer,fixed,moving::FilteredWindow,lag)
    shifted=sample_shifted!(@view(buffer[1:fixed.ncore]),moving,lag)
    core=@view fixed.ext[fixed.nlag+1:fixed.nlag+fixed.ncore]
    return cor(core,shifted)
end

function fitted_correlation!(buffer,A,B,common,parents,lag)
    total=0.0
    for channel in common
        a,b=A[channel],B[channel]
        forward=shifted_correlation!(buffer,a,parents[b.header.path],lag)
        reverse=shifted_correlation!(buffer,b,parents[a.header.path],-lag)
        total+=(forward+reverse)/2
    end
    return clamp(total/length(common),-1.0,1.0)
end

"FFT work buffers and inverse plan are private to one worker."
struct CorrelationWorkspace
    product::Vector{ComplexF64}
    ab::Vector{Float64}
    ba::Vector{Float64}
    curve::Vector{Float64}
    plan::Any
end
function CorrelationWorkspace(nfft,nlag)
    product=zeros(ComplexF64,nfft÷2+1)
    CorrelationWorkspace(product,zeros(nfft),zeros(nfft),zeros(2nlag+1),plan_irfft(product,nfft;flags=FFTW.ESTIMATE))
end

"C(l)=mean[corr(A_core,B(l)),corr(B_core,A(-l))]. Positive l means B arrives later."
function correlation!(w,a,b)
    n=a.ncore; m=2a.nlag+1
    @. w.product=a.template_fft*b.extended_fft
    mul!(w.ab,w.plan,w.product)
    @. w.product=b.template_fft*a.extended_fft
    mul!(w.ba,w.plan,w.product)
    @inbounds for k in 1:m
        r=m-k+1
        w.curve[k]=clamp(0.5*(w.ab[n+k-1]/(a.template_norm*b.sliding_norm[k])+
                              w.ba[n+r-1]/(b.template_norm*a.sliding_norm[r])),-1.0,1.0)
    end
    return w.curve
end

"Peak selection, sub-sample fit, and independent sidelobe ambiguity test."
function measure(curve,pc,quality)
    absolute=quality["polarity"]=="absolute"
    score(x)=absolute ? abs(x) : x
    idx=1; best=-Inf
    for j in eachindex(curve)
        s=score(curve[j]); if s>best;idx=j;best=s;end
    end
    fs=pc["sample_rate_hz"]; L=(length(curve)-1)÷2
    guard=quality["boundary_guard_samples"]
    boundary=idx<=guard || idx>length(curve)-guard
    delta=0.0
    if quality["subsample"] && 1<idx<length(curve)
        a,b,c=score(curve[idx-1]),score(curve[idx]),score(curve[idx+1])
        denom=a-2b+c
        # The selected sample is a local maximum: b >= a and b >= c.
        # Therefore the fitted vertex is already within half a sample.
        # This is the fractional correction, not a limit on the whole lag.
        denom < -eps(Float64) && (delta=0.5*(a-c)/denom)
    end
    # Compare local maxima, rather than shoulders of the same broad low-frequency peak.
    radius=round(Int,pc["sidelobe_exclusion_s"]*fs)
    second=-1.0
    for j in 2:length(curve)-1
        abs(j-idx)>radius || continue
        s=score(curve[j])
        s>=score(curve[j-1]) && s>=score(curve[j+1]) && (second=max(second,s))
    end
    gap=best-max(0.0,second)
    status=boundary ? "boundary" : best<pc["min_cc"] ? "low_cc" :
           gap<pc["min_peak_gap"] ? "ambiguous_peak" : "accepted"
    return (lag=(idx-L-1+delta)/fs, sampled_lag=(idx-L-1)/fs, cc=curve[idx], second_cc=second, gap=gap,status=status)
end

"dt.cc is travel_time(i)-travel_time(j), excluding the catalog origin separation."
differential_time(a,b,lag)=a.reduced_pick-b.reduced_pick-lag

function haversine(a,b)
    p,q=deg2rad(a.latitude),deg2rad(b.latitude)
    z=sin((p-q)/2)^2+cos(p)*cos(q)*sin(deg2rad(a.longitude-b.longitude)/2)^2
    return 6371*2asin(sqrt(clamp(z,0,1)))
end
