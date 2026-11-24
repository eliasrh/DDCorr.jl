"""Redraw two figures using DDCorr's own field-example arrays.

    python measurement_figures.py PATH_TO_METHOD_EXAMPLES PATH_TO_ASSETS

method_examples.jl generates kver_full_windows.csv and stam_s.csv.
"""
import argparse
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

cli = argparse.ArgumentParser(description=__doc__)
cli.add_argument("method_examples", type=Path)
cli.add_argument("assets", type=Path)
args = cli.parse_args()
args.assets.mkdir(parents=True, exist_ok=True)
teal, copper, ink, grey = "#087C73", "#AB4629", "#1C3734", "#557168"
plt.rcParams.update({
    "font.family":"DejaVu Sans", "font.size":15, "axes.titlesize":17,
    "axes.titleweight":"bold", "axes.titlelocation":"left", "axes.titlepad":12,
    "axes.labelcolor":ink, "axes.titlecolor":ink, "text.color":ink,
    "axes.spines.top":False, "axes.spines.right":False, "axes.edgecolor":"#AABCB3",
    "legend.frameon":False, "axes.labelsize":15, "xtick.labelsize":13,
    "ytick.labelsize":13, "xtick.color":grey, "ytick.color":grey,
    "figure.facecolor":"white", "axes.facecolor":"white"
})

def read(name):
    return np.genfromtxt(args.method_examples / name, names=True, delimiter=",")

def save(fig, name):
    fig.savefig(args.assets / name, dpi=165, bbox_inches="tight", pad_inches=.17)
    plt.close(fig)

def panel(a):
    a.axhline(0, color="#CCD7D0", lw=.8, zorder=0)
    a.set_xlabel("Lag (ms)")
    a.set_ylabel("Correlation coefficient")
    a.set_ylim(-.76,.96)
    a.set_xlim(-505,505)
    a.set_yticks([-.5,0,.5])
    a.set_xticks([-500,-250,0,250,500])

v = read("kver_full_windows.csv")
x, y = v["event_1"], v["event_2"]
pad = 25
n = len(x) - 2 * pad
assert n == 126 and len(x) == len(y) == 176
def correlate(x, y):
    a = x[pad:-pad] - np.mean(x[pad:-pad])
    windows = np.lib.stride_tricks.sliding_window_view(y, n)
    b = windows - windows.mean(axis=1, keepdims=True)
    denom = np.linalg.norm(a) * np.linalg.norm(b, axis=1)
    direct = (b @ a) / denom
    nf = 2 ** int(np.ceil(np.log2(n + len(y) - 1)))
    spectrum = np.fft.rfft(a[::-1], nf) * np.fft.rfft(y, nf)
    fft = np.fft.irfft(spectrum, nf)[n-1:len(y)] / denom
    return direct, fft

d0,f0=correlate(x,y)
d1,f1=correlate(y,x)
r=(d0+d1[::-1])/2
r_fft=(f0+f1[::-1])/2
assert np.max(abs(r-r_fft))<1e-12
lag=20*np.arange(-pad,pad+1)
fig,a=plt.subplots(figsize=(10.5,3.7),layout="constrained")
a.plot(lag,r_fft,color=teal,linewidth=2.4,label="FFT calculation")
a.scatter(lag,r,edgecolor=ink,facecolor="white",linewidth=1.15,s=30,zorder=4,label="Direct calculation at each lag")
panel(a);a.set_ylim(-.75,1.05);a.set_title("KVER P  ·  events 1 and 2")
a.legend(loc="upper left",ncol=1,fontsize=13)
save(fig,"method_direct_fft.png")

v=read("stam_s.csv")
lag=1000*v["lag_s"];mean=v["mean"];k=np.argmax(mean)
assert np.allclose(mean,(v["HHE"]+v["HHN"])/2,atol=1e-12)
x=lag[k-1:k+2];y=mean[k-1:k+2]
fit=np.polyfit(x,y,2)
vertex=-fit[1]/(2*fit[0])
assert abs(vertex+3.85968)<.001
fig,(a,b)=plt.subplots(1,2,figsize=(12.3,4.7),layout="constrained",gridspec_kw={"width_ratios":[1.3,1]})
a.plot(lag,v["HHE"],color=teal,lw=1.5,label="E–E")
a.plot(lag,v["HHN"],color=copper,lw=1.5,label="N–N")
a.plot(lag,mean,color=ink,lw=2.7,label="Mean")
a.axvspan(-20,20,color="#DCEBE0",zorder=0)
panel(a);a.set_title("S waves at STAM  ·  events 28 and 45")
a.legend(loc="lower center",bbox_to_anchor=(.5,-.37),ncol=3,fontsize=13)
xp=np.linspace(-20.7,20.7,160)
b.plot(xp,np.polyval(fit,xp),color=teal,lw=2.5)
b.scatter(x,y,color=ink,s=53,zorder=4)
b.axvline(vertex,color=copper,ls="--",lw=1.6)
b.annotate("Fitted lag\n−3.9 ms",xy=(vertex,np.polyval(fit,vertex)),xytext=(-21,.76),ha='left',va='center',fontsize=13,color=copper,arrowprops=dict(arrowstyle="->",color=copper))
b.set(xlabel="Lag (ms)",ylabel="Mean correlation coefficient",xlim=(-25,25),ylim=(.20,.85),xticks=[-20,0,20],title="Detail of the mean peak")
b.scatter([0],[mean[k]],color=ink,s=56,zorder=4)
b.annotate("r = 0.700",xy=(0,mean[k]),xytext=(5,.75),fontsize=13,ha='left',color=ink,arrowprops=dict(arrowstyle="-",color=ink))
save(fig,"method_stam_s_peak.png")
