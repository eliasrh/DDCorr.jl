"""Draw shared-ray, Hayward relocation, correlation and graph-closure figures.

Usage: python lecture_figures.py --repo PATH_TO_DDCORR --hayward EXAMPLE1_DIRECTORY --output ASSET_DIR
The Hayward tables are from fwaldhauser/HypoDD, examples/example1/hypoDD.loc and hypoDD.reloc.
Run teaching/source/export_kver.jl on the Iceland100 SAC archive for the field waveform arrays.
"""
from pathlib import Path
import argparse
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse, FancyArrowPatch
parser=argparse.ArgumentParser(description=__doc__)
for arg in ("repo","hayward","output"):parser.add_argument("--"+arg,type=Path,required=True)
args=parser.parse_args()
out=args.output
out.mkdir(parents=True,exist_ok=True)
teal="#006F73"; orange="#AD4F2A"; ink="#173539"; grey="#587075"; pale="#E8EEE9"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":14,"axes.labelcolor":ink,"text.color":ink,"axes.edgecolor":grey,"xtick.color":grey,"ytick.color":grey,"axes.spines.top":False,"axes.spines.right":False,"axes.titlesize":17,"axes.titleweight":"bold","legend.frameon":False,"axes.axisbelow":True})
def save(fig,stem):
    fig.savefig(out/(stem+".png"),dpi=170,bbox_inches="tight",pad_inches=.16,facecolor="white")
    plt.close(fig)
# Straight reference rays through a broad anomaly. The extent of the model error
# is deliberately much wider than the separation of the two paths.
fig,ax=plt.subplots(figsize=(9,4.5),layout="constrained")
rock=Ellipse((7.3,1.8),4.25,2.0,angle=-18,facecolor="#EDD5A4",edgecolor="#B7955F",lw=1.0);ax.add_patch(rock)
ax.plot([-.4,12.45],[0,0],color=ink,lw=1.7)
for (x,z),color,style,label,yt in [((0.8,4.3),teal,"-","Earthquake 1",4.70),((1.03,3.55),orange,"--","Earthquake 2",3.10)]:
    ax.plot([x,12],[z,0],style,color=color,lw=3.0);ax.scatter([x],[z],s=98,color=color,edgecolor="white",linewidth=1.4,zorder=4)
    ax.text(.0,yt,label,color=color,fontsize=14,weight="bold",va="center")
ax.scatter([12],[0],marker="v",s=125,facecolor=ink,zorder=4);ax.text(11.8,-.29,"Station",ha="right",weight="bold")
ax.annotate("Slow region",xy=(7.5,1.7),xytext=(8.6,3.35),ha="center",arrowprops={"arrowstyle":"-","color":grey},color=ink)
ax.set(xlabel="Horizontal distance (km)",ylabel="Depth (km)",xlim=(-.4,12.6),ylim=(5.1,-.65));ax.set_xticks([0,3,6,9,12]);ax.set_yticks([0,1,2,3,4,5]);ax.set_aspect("equal",adjustable="box")
save(fig,"relative_shared_rays")
# Same event IDs and same section coordinates at both stages.
before=np.loadtxt(args.hayward/"hypoDD.loc");after=np.loadtxt(args.hayward/"hypoDD.reloc")
both=sorted(set(before[:,0].astype(int)) & set(after[:,0].astype(int)))
assert len(both)==16
def align(a): return np.stack([a[a[:,0]==k][0] for k in both])
b,a=align(before),align(after)
lat0,lon0=b[:,1:3].mean(axis=0)
az=np.deg2rad(325)
def section(x):
    east=(x[:,2]-lon0)*111.2*np.cos(np.deg2rad(lat0));north=(x[:,1]-lat0)*111.2
    return east*np.sin(az)+north*np.cos(az),x[:,3]
fig,axs=plt.subplots(1,2,figsize=(11.2,4.55),sharex=True,sharey=True,layout="constrained")
for ax,data,title,col in zip(axs,[b,a],["Catalogue locations","Double-difference locations"],[grey,teal]):
    xy,z=section(data);ax.scatter(xy,z,color=col,edgecolors="white",linewidths=.45,s=47)
    ax.set(xlim=(-1.3,1.3),ylim=(10.20,7.70),xlabel="Distance along strike (km)");ax.set_xticks([-1,-.5,0,.5,1]);ax.set_yticks([8,8.5,9,9.5,10]);ax.set_title(title,loc="left")
    ax.set_aspect("equal",adjustable="box");ax.grid(color=pale,lw=.8);ax.text(.03,.04,f"Depth range  {np.ptp(z):.2f} km",transform=ax.transAxes,weight="bold",color=col,fontsize=12)
axs[0].set_ylabel("Depth (km)");save(fig,"relative_hayward_pair")
# All three numbers come from one station and phase in the distributed dt.cc.
fig,ax=plt.subplots(figsize=(8.2,4.3),layout="constrained")
A=np.array([.5,.52]);B=np.array([3.12,2.20]);C=np.array([5.77,.52])
def edge(x,y,label,xy,col):
    ax.add_patch(FancyArrowPatch(x,y,arrowstyle="-|>",mutation_scale=16,shrinkA=20,shrinkB=20,lw=2.2,color=col));ax.text(*xy,label,ha="center",va="center",size=16,weight="bold",color=col,bbox={"facecolor":"white","edgecolor":"none","pad":1.5})
edge(A,B,"+93.9 ms",(1.48,1.63),teal);edge(B,C,"−61.6 ms",(4.78,1.63),teal);edge(A,C,"+30.5 ms",(3.13,.34),orange)
for coord,n in [(A,"1"),(B,"3"),(C,"5")]:
    ax.scatter(*coord,s=1500,facecolor="#FAFAF5",edgecolor=ink,lw=1.7,zorder=4);ax.text(*coord,n,va="center",ha="center",size=22,weight="bold",zorder=5)
ax.text(3.14,2.76,"P waves at station Z7.DYSA",ha="center",size=17,weight="bold")
ax.set(xlim=(-.12,6.42),ylim=(-.15,3.00));ax.axis("off");save(fig,"relative_dysa_triangle")
# The field-data curves are the exact exports from the teaching run.
p=args.repo/"teaching/source/figure_data/kver"
wave=np.loadtxt(p/"waveforms.csv",skiprows=1,delimiter=",")
curve=np.loadtxt(p/"curve.csv",skiprows=1,delimiter=",")
fig,ax=plt.subplots(figsize=(8.6,4.2),layout="constrained")
ax.axvline(0,color=grey,ls=":",lw=1.5)
for k,label,col,sty in [(1,"Event 1",teal,"-"),(2,"Event 2",orange,"--")]:
    ax.plot(wave[:,0],wave[:,k],sty,color=col,lw=1.8,label=label)
ax.text(-.035,4.40,"P markers",va="top",ha="right",fontsize=12,color=grey)
ax.set(xlim=(-.5,2.0),ylim=(-5,4.9),xlabel="Time from each event’s P marker (s)",ylabel="Scaled amplitude")
ax.legend(ncol=2,loc="upper right",fontsize=12);save(fig,"relative_kver_waveforms")
fig,ax=plt.subplots(figsize=(9.4,4.4),layout="constrained")
k=int(np.argmax(curve[:,1]));peak=curve[k];ax.axhline(0,color="#BBC8C5",lw=1);ax.plot(curve[:,0]*1000,curve[:,1],color=teal,lw=2);ax.scatter(*(np.array([1000,1])*peak),s=75,color=orange,zorder=4)
ax.annotate("Peak coefficient  0.800",xy=(20,.80),xytext=(122,.72),fontsize=15,weight="bold",color=orange,arrowprops={"arrowstyle":"-","lw":1.3,"color":orange})
ax.set(xlim=(-500,500),ylim=(-1,1),xlabel="Lag (ms)   ·   positive when event 2 is later",ylabel="Correlation coefficient");ax.set_xticks([-500,-250,0,250,500]);ax.set_yticks([-1,-.5,0,.5,1]);ax.grid(axis="y",color=pale)
save(fig,"relative_kver_correlation")
# Make the idea of subsample timing visible using a band-limited illustration.
fig,ax=plt.subplots(figsize=(8.6,4.0),layout="constrained")
t=np.linspace(-.2,5.2,1000);tn=np.arange(0,6);lag=.10
def pulse(t):return np.sin((t-.3)*1.15)*np.exp(-.045*(t-2.5)**2)
for shift,c,name,marker,sty in [(0,teal,"First pulse","o","-"),(lag,orange,"Pulse delayed by 0.1 sample","s","--")]:
    ax.plot(t,pulse(t-shift),sty,color=c,lw=2,label=name);ax.plot(tn,pulse(tn-shift),marker,ms=8,mfc="white",mec=c,mew=1.7)
ax.set(xlim=(-.2,5.2),ylim=(-1.14,1.36),xlabel="Time (sample intervals)",ylabel="Amplitude");ax.set_xticks(tn);ax.set_yticks([-1,0,1]);ax.grid(axis="x",color=pale);ax.legend(fontsize=12,loc="upper center",ncol=2)
save(fig,"relative_subsample")
