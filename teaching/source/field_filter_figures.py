"""Plot the native KVER field waveform through DDCorr's filtering and FFT preparation.

Run export_trace.jl on event 1, Z7.KVER..HHZ.sac, and method_examples.jl on
Iceland100, then: python field_filter_figures.py FIELD_EXPORT METHOD_EXPORT ASSETS
"""
import argparse
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.signal import butter, sosfilt, resample_poly, welch

cli=argparse.ArgumentParser(description=__doc__)
for name in ("field","method","assets"):cli.add_argument(name,type=Path)
a=cli.parse_args()
a.assets.mkdir(parents=True,exist_ok=True)
def read(p):return np.genfromtxt(p,names=True,delimiter=",")
stage=read(a.field/"trace_stages.csv");resp=read(a.field/"filter_response.csv");wins=read(a.method/"kver_full_windows.csv")
t=stage["time_from_P_s"];fs=1/(t[1]-t[0]);teal="#0B776C";rust="#A5432C";ink="#193A35";g="#62776D"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":14,"axes.titlesize":16,"axes.titleweight":"bold","axes.titlelocation":"left","axes.labelsize":15,"axes.spines.top":False,"axes.spines.right":False,"axes.edgecolor":"#A6B4A9","axes.titlecolor":ink,"axes.labelcolor":ink,"text.color":ink,"legend.frameon":False,"xtick.color":g,"ytick.color":g})
def panel2():return plt.subplots(1,2,figsize=(12.3,4.6),layout="constrained")
def legend(ax,n=1):ax.legend(loc="upper center",bbox_to_anchor=(.5,-.20),ncol=n,fontsize=12)
def save(fig,name):
    fig.savefig(a.assets/name,dpi=155,bbox_inches="tight",pad_inches=.17);plt.close(fig)
def power(x,f,n):
    k,p=welch(x,fs=f,nperseg=n);return k,np.sqrt(p)
p0=stage["tapered"];p1=stage["filtered"]
fig,ax=plt.subplots(figsize=(10.6,4.45),layout="constrained")
m=(t>-.5)&(t<3)
for y,c,label in [(p0,ink,"Before bandpass"),(p1,teal,"After 2–14 Hz bandpass")]:
    f,amp=power(y[m],fs,128);ax.semilogy(f,amp,color=c,lw=2.5,label=label)
ax.axvspan(2,14,color="#EBF1E7",zorder=-2);ax.axvline(2,color=g,ls=":",lw=1);ax.axvline(14,color=g,ls=":",lw=1)
ax.set(xlabel="Frequency (Hz)",ylabel="Amplitude density (counts/√Hz)",title="KVER vertical component  ·  event 1",xlim=(0,36),ylim=(.65,1.2e4))
legend(ax,2);save(fig,"method_kver_spectrum.png")

fig,(aa,b)=panel2()
aa.plot(resp["Hz"],resp["one_pass_gain"],color=rust,lw=1.8,label="One pass")
aa.plot(resp["Hz"],resp["two_pass_gain"],color=teal,lw=2.7,label="Forward and reverse")
for h in [2,14]:aa.axvline(h,color=g,ls=":",lw=1)
aa.set(xlim=(0,22),ylim=(0,1.05),xlabel="Frequency (Hz)",ylabel="Amplitude gain",title="Response of the 2–14 Hz filter")
legend(aa)
single=sosfilt(butter(4,[2,14],btype="bandpass",fs=fs,output="sos"),p0);m=(t>.45)&(t<.97)
b.plot(t[m],single[m]/1e3,color=rust,lw=1.8,label="One pass")
b.plot(t[m],p1[m]/1e3,color=teal,lw=2.5,label="Forward and reverse")
b.set(xlabel="Seconds after the P marker",ylabel="Amplitude (10³ counts)",title="Same KVER P wave  ·  event 1",xlim=(.45,.97))
legend(b);save(fig,"method_kver_filter_direction.png")

fig,(aa,b)=panel2()
m=(t>=0)&(t<6)
f,amp=power(p0[m],fs,128)
aa.plot(f,amp,color=ink,lw=2);aa.axvspan(25,50,color="#F5DFCC");aa.axvline(25,color=rust,ls="--");aa.text(26,3.3e3,"Above the new\nNyquist frequency",fontsize=12,color=rust)
aa.set(xlabel="Frequency (Hz)",ylabel="Amplitude density (counts/√Hz)",title="KVER at its recorded rate of 100 Hz",xlim=(0,48),yscale="log",ylim=(30,1.1e4))
half=resample_poly(p0,1,2); mt=(t[::2]>=0)&(t[::2]<6)
for y,c,name in [(p0[::2],rust,"Keep every other sample"),(half,teal,"Low-pass, then keep samples")]:
    f,amp=power(y[mt],fs/2,64);b.plot(f,amp,color=c,lw=2.2,label=name)
b.set(xlabel="Frequency (Hz)",ylabel="Amplitude density (counts/√Hz)",title="Two ways to obtain a 50 Hz record",xlim=(14,25));legend(b)
save(fig,"method_kver_alias.png")

fig,axes=plt.subplots(2,1,figsize=(10.6,4.4),sharex=True,layout="constrained")
x=wins["event_1"][25:-25];x=(x-x.mean())[::-1];y=wins["event_2"];nf=512
for ax,v,lab in zip(axes,[x,y],["Event 1  ·  reversed P window","Event 2  ·  extended search window"]):
    n=len(v);ax.axvspan(n,nf-1,color="#EBF1E7");ax.plot(range(n),v/1000,color=ink,lw=1.2)
    ax.plot([n,nf-1],[0,0],color=teal,lw=2);ax.axvline(n-.5,color=g,ls=":",lw=1.4)
    ax.text(n+15,.77,f"{nf-n} added zeros",transform=ax.get_xaxis_transform(),color=teal,fontsize=13)
    ax.set_ylabel("10³ counts");ax.set_title(lab,pad=4);ax.set_xlim(0,511);ax.set_yticks([0,40])
axes[-1].set_xlabel("FFT array index");axes[-1].set_xticks([0,125,175,300,400,511])
save(fig,"method_kver_zero_padding.png")
