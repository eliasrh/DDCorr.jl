"""Plot the cut length needed for the Z7.DYSA phase markers and the Iceland100 settings.

python clinic_windows.py ICELAND100_DIRECTORY OUTPUT_PNG
"""
from pathlib import Path
import sys
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
from obspy import read
import tomllib
src=Path(sys.argv[1]);out=Path(sys.argv[2])
cfg=tomllib.loads((src/'DDCorr.toml').read_text())
s=read(str(src/'sac/S1_009992/Z7.DYSA..HHZ.sac'),headonly=True)[0].stats.sac
origin=float(s.o);p=float(s.a)-origin;s_time=float(s.t0)-origin
noise=(p-8,p-2);pad=5
fig,ax=plt.subplots(figsize=(10.6,3.9),layout='constrained')
ink='#19383B';blue='#006F73';light='#9EC9C2';sand='#EBCB8C';grey='#5E7072';rust='#B15232'
ax.axvline(p,c=grey,ls=':',lw=1)
ax.axvline(s_time,c=grey,ls=':',lw=1)
ax.text(p,3.7,'P',ha='center',color=ink,weight='bold',size=13)
ax.text(s_time,3.7,'S',ha='center',color=ink,weight='bold',size=13)
for name,mid,y,c in [('P',p,2.1,blue),('S',s_time,1.1,rust)]:
    a,b=cfg[name]['window_s'];lag=cfg[name]['max_lag_s'];low,high=mid+a,mid+b
    ax.barh(y,high-low+2*lag,left=low-lag,color=light,height=.4)
    ax.barh(y,high-low,left=low,color=c,height=.4)
    start=min(noise[0],low-lag)-pad;end=max(noise[1],high+lag)+pad
    ax.plot([start,end],[y-.31,y-.31],color=grey,lw=1.4)
    ax.plot([start,end],[y-.31,y-.31],'|',color=grey,ms=8)
ax.barh(3.1,noise[1]-noise[0],left=noise[0],height=.42,color=sand)
ax.set_yticks([3.1,2.1,1.1],['Pre-P noise','P window','S window'],size=15)
ax.set(xlim=(-11,19),ylim=(.34,4.05),xlabel='Seconds since earthquake origin')
ax.set_xticks([-10,-5,0,5,10,15]);ax.grid(axis='x',color='#E7ECEB',lw=.7);ax.set_axisbelow(True)
for side in ('top','left','right'):ax.spines[side].set_visible(False)
ax.tick_params(axis='y',length=0);ax.xaxis.label.set_size(14);ax.tick_params(axis='x',labelsize=12)
ax.legend(handles=[Patch(color=light,label='Extra lag search'),plt.Line2D([],[],color=grey,lw=1.5,marker='|',label='Required cut including filter margins')],loc='upper center',bbox_to_anchor=(.5,-.26),frameon=False,ncol=2,fontsize=12)
fig.savefig(out,dpi=175,bbox_inches='tight',pad_inches=.15)
