"""Render instructor figures from DDCorr exports. Raw samples are kept in the data package.
Usage: python method_figures.py METHODS_CSV_DIRECTORY FIELD_TRACE_EXPORT_DIRECTORY ASSET_DIRECTORY
Run the following from DDCorr.jl, with Iceland100 next to the checkout. SCRIPT_DIR
is the directory containing these figure sources. Python needs NumPy and matplotlib.

julia --project=. SCRIPT_DIR/method_examples.jl ../Iceland100 work/curves
julia --project=. teaching/source/export_trace.jl ../Iceland100/sac/S1_009900/Z7.KVER..HHZ.sac work/kver
python SCRIPT_DIR/method_figures.py work/curves work/kver work/figures
"""
from pathlib import Path
import sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator

src,field,out=map(Path,sys.argv[1:4])
out.mkdir(parents=True,exist_ok=True)
INK="#183446"; TEAL="#047D77"; BRICK="#C04F36"; GOLD="#B27713"; GREY="#61717B"; PALE="#EAF2F0"
plt.rcParams.update({
    "font.family":"DejaVu Sans","font.size":16,"axes.labelsize":16,
    "axes.titlesize":17,"axes.titleweight":"bold","axes.titlelocation":"left",
    "axes.spines.top":False,"axes.spines.right":False,"axes.edgecolor":"#A6B2B3",
    "axes.labelcolor":INK,"axes.titlecolor":INK,"xtick.color":GREY,"ytick.color":GREY,
    "xtick.labelsize":14,"ytick.labelsize":14,"text.color":INK,"axes.labelpad":8,
    "figure.facecolor":"white","axes.facecolor":"white","legend.frameon":False,
})
def read(p):
    return np.genfromtxt(p,delimiter=",",names=True)
def plot(n=1,w=None):
    size=(12.5,4.7) if n==2 else (11.9,4.5)
    f,a=plt.subplots(1,n,figsize=size,gridspec_kw={"width_ratios":w} if w else None)
    return f,a
def finish(f,name):
    f.tight_layout(pad=1.05,w_pad=1.7)
    f.savefig(out/("method_"+name+".png"),dpi=145,facecolor="white",bbox_inches="tight",pad_inches=.16)
    plt.close(f)
def chart(ax):
    ax.grid(axis="y",color="#D7E2E1",lw=.6,zorder=0)
    ax.yaxis.set_major_locator(MaxNLocator(5))
def legend(ax):
    ax.legend(loc="upper center",bbox_to_anchor=(.5,-.25),ncol=3,fontsize=13)
v=read(field/"trace_stages.csv")
t=v["time_from_P_s"]; f_native=1/(t[1]-t[0]);nround=np.round(.02*len(t))
f,(a,b)=plot(2)
sel=(t>-1.0)&(t<2.1)
for ax,key,col,ttl in ((a,"raw",INK,"Recorded on HHZ"),(b,"filtered",TEAL,"After the 2–14 Hz bandpass")):
    ax.plot(t[sel],v[key][sel]/1e3,c=col,lw=1.6)
    ax.axvline(0,color=BRICK,ls=(0,(3,3)),lw=1.5)
    ax.set(xlabel="Seconds from P marker",ylabel="Amplitude (10³ counts)",title=ttl)
    chart(ax)
finish(f,"raw_filtered")
f,(a,b)=plot(2)
elapsed=t-t[0]; sel=elapsed<=2.3
a.plot(elapsed[sel],v["detrended"][sel]/1e3,c=GREY,lw=1.2,label="Before taper")
a.plot(elapsed[sel],v["tapered"][sel]/1e3,c=TEAL,lw=1.6,label="After taper")
a.set(xlabel="Seconds from start of cut",ylabel="Amplitude (10³ counts)",title="Recorded left edge"); chart(a);legend(a)
idx=np.arange(len(t));w=np.ones(len(t));n=int(nround);w[:n]=.5*(1-np.cos(np.pi*(idx[:n]+1)/(n+1)));w[-n:]=w[:n][::-1]
b.plot(elapsed[sel],w[sel],lw=3,c=TEAL);b.fill_between(elapsed[sel],0,w[sel],color=PALE);b.set(xlabel="Seconds from start of cut",ylabel="Fraction of amplitude retained",title="Weight applied at each sample",ylim=(-.04,1.06));chart(b)
finish(f,"taper")
f,a=plot()
sel=(t>=-13)&(t<=8)
a.axvspan(-8,-2,color="#E7D9BC",alpha=.8,label="Noise · −8 to −2 s");a.axvspan(-.5,2,color="#B7DED4",alpha=.9,label="P window · −0.5 to +2 s")
a.plot(t[sel],v["filtered"][sel]/1e3,c=INK,lw=1.2)
a.axvline(0,c=BRICK,ls="--",lw=1.4);a.set(xlabel="Seconds from P marker at Z7.KVER",ylabel="Amplitude (10³ counts)",xlim=(-13,8));chart(a);legend(a)
finish(f,"signal_noise")
f,(a,b)=plot(2)
a.set(xlabel="Seconds from P marker",ylabel="Amplitude (10³ counts)",title="100 Hz filtered trace"); b.set(xlabel="Seconds from P marker",ylabel="Amplitude (10³ counts)",title="50 Hz analysis grid")
z=read(field/"resampled.csv");tt=z["time_from_P_s"];ttsel=(tt>=.54)&(tt<=.81)
for ax in [a,b]:
    use=(t>=.54)&(t<=.81)
    ax.plot(t[use],v["filtered"][use]/1e3,c=GREY,lw=1.4,alpha=.75)
    ax.set_xlim(.53,.82);ax.set_ylim(-44,42);chart(ax)
a.scatter(t[use],v["filtered"][use]/1e3,c=INK,s=30,zorder=4)
b.plot(tt[ttsel],z["amplitude"][ttsel]/1e3,c=TEAL,lw=1.0)
b.scatter(tt[ttsel],z["amplitude"][ttsel]/1e3,c=TEAL,s=48,zorder=4)
finish(f,"resampling")
f,(a,b)=plot(2)
c=read(src/"order.csv");x=c["lag_s"]*1000
for ax in (a,b):
    ax.plot(x,c["i_fixed"],c=TEAL,lw=1.8,label="86 fixed")
    ax.plot(x,c["j_fixed"],c=BRICK,lw=1.8,label="97 fixed, sign reversed")
    ax.plot(x,c["symmetric"],c=INK,lw=2.2,ls=(0,(4,2)),label="Mean")
    ax.axvline(460,c="#697979",lw=1,ls=":")
    ax.set(xlabel="Lag (ms)",ylabel="Correlation coefficient")
    chart(ax)
a.set(title="Both orders on one lag axis")
b.set(title="Zoom near the winning sample",xlim=(385,505),ylim=(-.05,.90)); legend(a)
finish(f,"window_order")
f,(a,b)=plot(2)
c=read(src/"stam_s.csv");x=c["lag_s"]*1000
a.plot(x,c["HHE"],c=TEAL,lw=2,label="East");a.plot(x,c["HHN"],c=BRICK,lw=2,label="North")
a.set(title="One curve per horizontal",xlabel="Lag (ms)",ylabel="Correlation coefficient");legend(a);chart(a)
b.plot(x,c["mean"],c=INK,lw=2.5);b.scatter([0],[c["mean"][np.argmax(c["mean"])]],c=TEAL,s=50,zorder=4);b.set(title="Mean at each lag",xlabel="Lag (ms)",ylabel="Correlation coefficient");chart(b); b.annotate("0.7000",(0,.700006),xytext=(65,.64),color=TEAL,fontsize=14,arrowprops={"arrowstyle":"-","color":TEAL})
a.set_ylim(-.74,.85);b.set_ylim(-.74,.85)
finish(f,"horizontal_stack")
f,a=plot()
k=np.argmax(c["mean"]); score=c["mean"][k-1:k+2];xx=x[k-1:k+2];p=np.polyfit(xx,score,2); pk=-p[1]/(2*p[0]);fit=np.linspace(xx.min()-1,xx.max()+1,180)
a.plot(fit,np.polyval(p,fit),c=TEAL,lw=2.7,label="Fitted parabola")
a.scatter(xx,score,s=80,c=INK,zorder=5,label="Measured samples")
for x0,y0,sgn in zip(xx,score,(-1,1,1)):
    a.annotate(f"{y0:.3f}",(x0,y0),xytext=(6*sgn,9),ha="right" if sgn<0 else "left",textcoords="offset points",fontsize=15)
a.axvline(pk,c=BRICK,ls="--");a.scatter(pk,np.polyval(p,pk),c=BRICK,zorder=6,s=40)
a.annotate(f"Vertex at {pk:.1f} ms",(pk,np.polyval(p,pk)),xytext=(-18,.745),fontsize=15,color=BRICK,arrowprops={"arrowstyle":"->","color":BRICK})
a.set(xlabel="Lag (ms)",ylabel="Stacked correlation",xlim=(-25,25),ylim=(.18,.80));chart(a);legend(a)
finish(f,"subsample")
f,(a,b)=plot(2)
c=read(src/"boundary.csv");c2=read(src/"boundary_wider.csv")
for ax,d,lim,ttl in ((a,c,500,"Class search · ±500 ms"),(b,c2,700,"Same pair · ±700 ms")):
    x=d["lag_s"]*1000; y=d["r"]; pos=np.argmax(y)
    ax.plot(x,y,c=TEAL,lw=1.8);ax.axvline(-500,c=BRICK,ls=":",lw=1.4);ax.scatter(x[pos],y[pos],c=BRICK,s=55,zorder=5)
    ax.annotate(f"{x[pos]:.0f} ms",(x[pos],y[pos]),xytext=(7,10),textcoords="offset points",fontsize=14,color=BRICK)
    ax.set(xlabel="Lag (ms)",ylabel="Correlation coefficient",title=ttl,xlim=(-lim-26,lim+20),ylim=(-.85,1.01));chart(ax)
finish(f,"boundary")
f,(a,b)=plot(2)
c=read(src/"competition.csv");x=c["lag_s"]*1000
for ax,key,ttl in ((a,"baseline_cc","2–14 Hz"),(b,"narrow_cc","4–8 Hz")):
    y=c[key];ax.plot(x,y,c=TEAL,lw=2.1)
    peaks=sorted([j for j in range(1,len(x)-1) if y[j]>y[j-1] and y[j]>y[j+1]],key=lambda j:-y[j])
    pts=peaks[:2];ax.scatter(x[pts],y[pts],c=[INK,BRICK],s=55,zorder=4)
    for ii,j in enumerate(pts):
        ax.annotate(f"{y[j]:.3f}",(x[j],y[j]),xytext=(-8 if ii==0 else 12,8),ha="right" if ii==0 else "left",textcoords="offset points",color=INK if ii==0 else BRICK,fontsize=14)
    ax.set(title=ttl,xlabel="Lag (ms)",ylabel="Correlation coefficient",xlim=(-480,480),ylim=(-1.0,1.08));chart(ax)
finish(f,"competition")
# Search intervals use the exact two DDCorr-prepared P arrays.
f,(a,b)=plot(2)
kv=read(src/"kver_full_windows.csv")
x=kv["seconds_from_marker"]
for ax,k,ttl in ((a,"event_1","Event 1 · fixed window"),(b,"event_2","Event 2 · candidate windows")):
    ax.plot(x,kv[k]/1000,c=INK,lw=1.2)
    ax.axvline(0,c=GREY,lw=.9,ls=":");ax.set(title=ttl,xlabel="Seconds from each P marker",ylabel="Amplitude (10³ counts)",ylim=(-48,79),xlim=(-1.08,2.58))
    ax.set_yticks([-40,-20,0,20,40]);ax.grid(axis="y",color="#D7E2E1",lw=.65)
a.hlines(54,-.5,2,color=TEAL,lw=5);a.text(.75,58,"−0.50 to +2.00 s",ha="center",fontsize=13,color=TEAL)
for y,t0,label,col in [(49,-.5,"k = 0",TEAL),(71,-.0,"k = +25",BRICK)]:
    b.hlines(y,t0,t0+2.5,color=col,lw=4);b.text(t0+.15,y+3,label,fontsize=12,color=col)
finish(f,"windows")
