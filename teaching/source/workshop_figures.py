"""Rebuild additional teaching plots with NumPy, Matplotlib and SciPy.

Usage: python workshop_figures.py PATH_TO_ICELAND100
The first plot reads DDCorr's Julia export from figure_data/field_trace.
The waveforms, coefficients and sampling times retain the underlying run's units.
"""
from pathlib import Path
import sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.signal import butter, sosfilt, sosfiltfilt, freqz_sos
import csv

here = Path(__file__).resolve().parent
assets = here.parent / "assets"
data = here / "figure_data"
root = Path(sys.argv[1])
bg, ink, teal, rust = "#FCFCF9", "#152A39", "#007C83", "#BC602A"
plt.rcParams.update({"font.size":15, "axes.titlesize":16, "axes.spines.top":False,"axes.spines.right":False, "axes.facecolor":bg, "figure.facecolor":bg, "text.color":ink,"axes.labelcolor":ink, "legend.frameon":False,"font.family":"DejaVu Sans"})
def save(fig, name):
    fig.tight_layout()
    fig.savefig(assets / (name+".png"), dpi=145, bbox_inches="tight",pad_inches=.12, facecolor=bg)
    plt.close(fig)
def read(name):
    return np.genfromtxt(name, delimiter=",", names=True)
def rows(file):
    with open(file,newline="") as f: return list(csv.DictReader(f))

c = read(data / "real_figdata" / "weak_curve.csv")
x,y = c["lag_s"]*1000,c["cc"]
i=np.argmax(y); coeff=np.polyfit(x[i-1:i+2],y[i-1:i+2],2); peak=-coeff[1]/(2*coeff[0])
fig,axes=plt.subplots(1,2,figsize=(12,3.7),gridspec_kw={"width_ratios":[1.35,1]})
a,b=axes
a.plot(x,y,color=teal);a.axvspan(x[i-1],x[i+1],color=rust,alpha=.18);a.set(xlabel="Residual lag (ms)",ylabel="Correlation coefficient",title="All tested lags · Z7.STAM S")
xx=np.linspace(-23,23,180)
b.plot(xx,np.polyval(coeff,xx),c=teal,label="Parabola");b.scatter(x[i-1:i+2],y[i-1:i+2],c=ink,zorder=3,label="20 ms samples")
b.axvline(peak,c=rust,ls="--",label=f"Vertex {peak:.1f} ms");b.set(xlabel="Residual lag (ms)",title="Three samples around the peak");b.legend(fontsize=11,loc="lower center")
save(fig,"field_peak")

w=read(data/"real_figdata"/"weak_waveforms.csv")
fig,ax=plt.subplots(figsize=(12,3.5));ax.plot(w["time_s"],w["A_fixed"],label="Event 28",color=teal);ax.plot(w["time_s"],w["B_unshifted"],label="Event 45",color=rust,alpha=.85);ax.axvline(0,color=ink,lw=1,ls=":");ax.set(xlabel="Seconds from each S marker",ylabel="Normalised amplitude");ax.legend(loc="upper right",ncol=2);save(fig,"field_pair")

fs=100; t=np.arange(-3,3,1/fs); x=np.sin(2*np.pi*3*t)
sos=butter(4,[2,14],btype="bandpass",fs=fs,output="sos")
f,g=freqz_sos(sos,worN=2000,fs=fs)
fig,(a,b)=plt.subplots(1,2,figsize=(12,3.8),gridspec_kw={"width_ratios":[1,1.35]})
a.plot(f,abs(g),color=rust,label="One pass");a.plot(f,abs(g)**2,color=teal,label="Two passes");a.axvline(2,color=ink,ls=":",lw=1);a.axvline(14,color=ink,ls=":",lw=1);a.set(xlim=(0,22),ylim=(-.03,1.06),xlabel="Frequency (Hz)",ylabel="Amplitude gain");a.legend(fontsize=11)
sel=(t>=.0)&(t<=.81)
b.plot(t[sel],x[sel],color=ink,lw=3,alpha=.6,label="Input");b.plot(t[sel],sosfilt(sos,x)[sel],color=rust,label="One pass");b.plot(t[sel],sosfiltfilt(sos,x)[sel],color=teal,ls="--",label="Two passes");b.set(xlabel="Time (s) · 3 Hz test signal",ylabel="Amplitude");b.legend(fontsize=11,ncol=3,loc="lower center",bbox_to_anchor=(.5,1.00))
save(fig,"phase_demo")

# Which wave is left after throwing away samples?
fig,(a,b)=plt.subplots(1,2,figsize=(12,3.6),sharey=True)
t=np.linspace(0,.18,600); xx=np.arange(0,.181,1/50); slow=12; fast=50-slow
for ax,title in [(a,"Before resampling"),(b,"Retaining one sample every 20 ms")]:
    ax.plot(t,np.cos(2*np.pi*fast*t),c=rust,alpha=.65,lw=1.6,label="38 Hz")
    ax.plot(t,np.cos(2*np.pi*slow*t),c=teal,lw=2,label="12 Hz")
    ax.set(xlabel="Seconds",title=title);ax.set_xlim(0,.18)
b.scatter(xx,np.cos(2*np.pi*fast*xx),color=ink,zorder=3,s=35,label="50 Hz samples");a.set_ylabel("Amplitude");a.legend(fontsize=11,ncol=2);b.legend(fontsize=10,ncol=3,loc="lower center")
save(fig,"alias_demo")

vals=rows(data/"real_results"/"correlate_validated"/"correlations.csv")
fig,ax=plt.subplots(figsize=(9.9,3.5));ts=np.arange(.7,.991,.01)
for ph,col in [("P",teal),("S",rust)]:
    rr=np.array([float(v["cc_signed"]) for v in vals if v["phase"]==ph]);ax.plot(ts,[(rr>=k).sum() for k in ts],c=col,label=ph,lw=2.7)
ax.axvline(.9,ls="--",color=ink,lw=1);ax.set(xlabel="Minimum correlation coefficient",ylabel="Retained observations");ax.legend();save(fig,"threshold")

field=data/"field_trace"/"trace_stages.csv"
if field.exists():
    v=read(field);t=v["time_from_P_s"];sel=(t>=-1.1)&(t<=2.6)
    fig,axes=plt.subplots(2,1,figsize=(11,4.8),sharex=True)
    for a,k,title,col in zip(axes,["raw","filtered"],["Recorded motion","After DDCorr’s 2–14 Hz bandpass"],[ink,teal]):
        a.plot(t[sel],v[k][sel],color=col,lw=1.3);a.axvline(0,color=rust,ls="--",lw=1);a.set_title(title,loc="left",fontsize=14);a.set_ylabel("Counts")
    axes[-1].set_xlabel("Time from P marker at Z7.KVER (s)");save(fig,"field_processing")

# Two P windows and their symmetric FFT correlation from export_kver.jl.
kv = data / "kver"
if kv.exists():
    w,c = read(kv/"waveforms.csv"),read(kv/"curve.csv")
    fig,(a,b)=plt.subplots(1,2,figsize=(12.2,3.9),gridspec_kw={"width_ratios":[1.35,1]})
    a.plot(w["time_s"],w["event_1"],color=teal,label="Event 1")
    a.plot(w["time_s"],w["event_2"],color=rust,lw=1.2,alpha=.85,label="Event 2")
    a.set(xlabel="Seconds from each P marker",ylabel="Normalised amplitude",title="Before alignment · Z7.KVER P")
    a.legend(ncol=2,fontsize=12)
    b.plot(c["lag_s"]*1000,c["cc"],c=teal,lw=2);i=np.argmax(c["cc"])
    b.scatter([c["lag_s"][i]*1000],[c["cc"][i]],c=rust,s=40,zorder=3)
    b.annotate("Peak near +20 ms",(c["lag_s"][i]*1000,c["cc"][i]),xytext=(90,.62),fontsize=11,arrowprops={"arrowstyle":"->","color":rust})
    b.set(xlabel="Residual lag (ms)",ylabel="Correlation coefficient",title="Which shift aligns the P wave?",ylim=(-1,1))
    save(fig,"kver_worked")
