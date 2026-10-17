using Test, Random, LinearAlgebra, Statistics, DSP, FFTW, Dates, TOML
using DDCorr
const M=DDCorr
const cfg=M.load_config(joinpath(@__DIR__,"..","DDCorr.toml"))
Random.seed!(1209)

function synthetic_cache(ext,n,L;id=1,reduced=10.0)
    h=M.SACHeader("synthetic",zeros(70),zeros(Int32,40),"XX","ABC","","HHZ","e",0.0,false)
    e=M.Event(id,"event$id",0.0,0.0,0.0,0.0,[h])
    tf,ef,norms,tn,nf=M.cache_vector(ext,n,L)
    M.CachedTrace(e,h,0.0,reduced,ext,tf,ef,norms,tn,10.0,n,L,nf)
end

@testset "FFT detector against independent direct Pearson sums" begin
    n=121;L=25;m=n+2L
    a=synthetic_cache(randn(m),n,L)
    b=synthetic_cache(randn(m),n,L;id=2)
    curve=copy(M.correlation!(M.CorrelationWorkspace(a.nfft,L),a,b))
    direct=[(cor(a.ext[L+1:L+n],b.ext[k:k+n-1])+
             cor(b.ext[L+1:L+n],a.ext[2L+2-k:2L+1-k+n]))/2 for k in 1:2L+1]
    @test curve≈direct atol=1e-12
    reversecurve=M.correlation!(M.CorrelationWorkspace(a.nfft,L),b,a)
    @test reversecurve≈reverse(curve) atol=1e-12
end

@testset "Known integer/fractional lag and DDSync sign" begin
    pc=deepcopy(cfg["phase"]["P"]);fs=pc["sample_rate_hz"]
    n=176;L=50;t=(-L:n+L-1)./fs .- 0.5
    pulse(t)=exp(-((t-1)/0.4)^2)*(sin(2pi*4t)+0.4sin(2pi*7.3t))
    for delay in (0.2,-0.2,0.073)
        a=synthetic_cache(pulse.(t),n,L;reduced=10.0)
        b=synthetic_cache(pulse.(t .- delay),n,L;id=2,reduced=11.0)
        curve=M.correlation!(M.CorrelationWorkspace(a.nfft,L),a,b)
        r=M.measure(curve,pc,cfg["quality"])
        @test abs(r.lag-delay)<0.002
        # Acceptance uses the conservative discrete-sample peak, not an inflated
        # fitted coefficient. Fractional offsets can fall below unity at 50 Hz.
        @test r.cc>(isinteger(delay*fs) ? 0.999 : 0.97)
        @test abs(M.differential_time(a,b,r.lag)-(-1-delay))<0.002
    end
end

@testset "Polarity, boundary and ambiguous peak rejection" begin
    q=deepcopy(cfg["quality"]);pc=cfg["phase"]["P"]
    c=zeros(101); c[45]=-0.98;c[60]=0.8
    r=M.measure(c,pc,q);@test r.cc==0.8
    q["polarity"]="absolute";r=M.measure(c,pc,q);@test r.cc == -0.98
    c=zeros(101);c[1]=0.95;@test M.measure(c,pc,q).status=="boundary"
    c=zeros(101);c[40]=0.95;c[70]=0.94
    @test M.measure(c,pc,q).status=="ambiguous_peak"
end

@testset "Native filter tone gain and zero phase" begin
    fs=100.0; t=(0:19999)./fs; keep=3001:17000
    for ph in ("P","S")
        pc=cfg["phase"][ph];lo,hi=pc["band_hz"]
        f=M.bandfilter(fs,pc)
        for hz in (lo/4,lo,sqrt(lo*hi),hi,2hi)
            x=sin.(2pi*hz.*t);y=filtfilt(f,x)
            gain=dot(y[keep],x[keep])/dot(x[keep],x[keep])
            expected=abs(freqresp(f,2pi*hz/fs))^2
            @test gain≈expected atol=0.005
            @test abs(dot(y[keep],cos.(2pi*hz.*t[keep]))/length(keep))<0.003
        end
        @test_throws ErrorException M.bandfilter(2hi,pc)
    end
end

function write_synthetic_sac(path;swapped=false,version=6)
    f=fill(Float32(-12345),70);i=fill(Int32(-12345),40);chars=fill(UInt8(' '),192)
    f[1]=0.01;f[6]=-2;f[7]=1.99;f[8]=0.2;f[9]=0.7;f[11]=1.4
    f[32:34]=[-20,-43,900];f[36]= -19;f[37]= -44;f[39]=0
    i[1:7]=[2019,1,12,30,10,250,version];i[10]=400;i[16]=1;i[36]=1
    chars[1:3]=codeunits("ABC");chars[161:163]=codeunits("HHZ");chars[169:170]=codeunits("XX")
    data=Float32.(1:400)
    foot=Float64.(f[[1,6,7,8,9,collect(11:20)...,21,37,36,33,32,6,1]])
    foot[5]=0.700000000123
    open(path,"w") do io
        write(io,swapped ? bswap.(reinterpret(UInt32,f)) : reinterpret(UInt32,f))
        write(io,swapped ? bswap.(i) : i);write(io,chars)
        write(io,swapped ? bswap.(reinterpret(UInt32,data)) : reinterpret(UInt32,data))
        version==7 && write(io,swapped ? bswap.(reinterpret(UInt64,foot)) : reinterpret(UInt64,foot))
    end
end

@testset "SAC byte order, v7 footer, offsets and malformed inputs" begin
    mktempdir() do d
        for swapped in (false,true),version in (6,7)
            p=joinpath(d,"test.sac");write_synthetic_sac(p;swapped,version)
            h=M.read_header(p)
            @test h.station=="ABC" && h.channel=="HHZ" && h.network=="XX"
            @test h.floats[6]==-2
            @test M.read_samples(h)==Float64.(1:400)
            @test h.reference≈datetime2unix(DateTime(2019,1,1,12,30,10,250))
            version==7 && @test h.floats[9]==0.700000000123
        end
        p=joinpath(d,"bad.sac");write(p,"short")
        @test_throws ErrorException M.read_header(p)
        @test isnan(M.sacnum(-12345))
    end
end

@testset "Anti-alias resampling and sampling origin" begin
    fs=100;t=(0:19999)./fs;x=sin.(2pi*3 .*t)+sin.(2pi*37 .*t)
    y=resample(x,1//5);tt=(0:length(y)-1)./20;k=501:3500
    @test abs(2dot(y[k],sin.(2pi*3 .*tt[k]))/length(k)-1)<0.003
    @test abs(2dot(y[k],cos.(2pi*3 .*tt[k]))/length(k))<0.003
end

@testset "End-to-end SAC preprocessing, different epochs, reduced dt sign" begin
    mktempdir() do d
        traces=M.CachedTrace[]
        for id in 1:2
            path=joinpath(d,"event$id.sac")
            write_synthetic_sac(path)
            f,iv,ch=open(path) do io
                (read!(io,Vector{Float32}(undef,70)),read!(io,Vector{Int32}(undef,40)),read(io,192))
            end
            # Nonzero B and origins, reference dates a day apart, off-grid picks.
            f[6]=-5;f[8]=20+(id-1);f[9]=60.013;iv[2]=id;iv[10]=14000
            f[7]=f[6]+(iv[10]-1)*f[1]
            t=f[6].+(0:iv[10]-1).*Float64(f[1]);delay=id==1 ? 0.0 : 0.073
            q=t.-Float64(f[9]).-delay
            x=Float32.(exp.(-((q.-1)./0.4).^2).*(sin.(2pi*4 .*q).+0.4sin.(2pi*7.3 .*q)) .+ 0.001randn(length(t)))
            open(path,"w") do io;write(io,f);write(io,iv);write(io,ch);write(io,x);end
            h=M.read_header(path)
            event=M.Event(id,"event$id",h.reference+h.floats[8],-19.0,-44.0,0.0,[h])
            push!(traces,M.prepare(event,h,cfg["phase"]["P"],cfg["preprocess"]))
        end
        a,b=traces;curve=M.correlation!(M.CorrelationWorkspace(a.nfft,a.nlag),a,b)
        result=M.measure(curve,cfg["phase"]["P"],cfg["quality"])
        @test abs(result.lag-0.073)<0.002
        @test abs(M.differential_time(a,b,result.lag)-(1-0.073))<0.002
        @test result.status=="accepted"
    end
end
