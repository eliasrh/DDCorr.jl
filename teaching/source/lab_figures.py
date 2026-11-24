"""Generate the three practical figures from Iceland100 and the synthetic Julia export.
Usage: python lab_figures.py ICELAND100 SYNTHETIC_CSV ASSET_DIR
The figure data are read locally. The raw waveforms stay in the supplied data archive.
"""
import sys
from pathlib import Path
import csv
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from obspy import read

island, synthetic, f = map(Path, sys.argv[1:4])
f.mkdir(parents=True, exist_ok=True)
navy='#132D38'; blue='#147A81'; orange='#C65D30'; muted='#495D68'
style={'font.family':'DejaVu Sans','axes.spines.top':False,'axes.spines.right':False,'axes.labelcolor':navy,'text.color':navy,'axes.edgecolor':'#9FAEB3','xtick.color':muted,'ytick.color':muted,'axes.titlesize':15,'axes.titleweight':'bold','axes.labelsize':14,'font.size':13,'legend.fontsize':12,'legend.frameon':False,'figure.facecolor':'#FFFFFF','axes.facecolor':'#FFFFFF'}
plt.rcParams.update(style)
def save(fig,name):
    fig.savefig(f/name,dpi=165,bbox_inches='tight',pad_inches=.09)
    plt.close(fig)

# Reproduce actual core windows and the linear interpolation used by DDCorr's report.
w=np.genfromtxt(synthetic,delimiter=',',names=True)
fig,ax=plt.subplots(2,1,figsize=(8.2,4.8),sharex=True,sharey=True,layout='constrained')
for a,y,title in [(ax[0],w['event2'],'Windows centred on the supplied P markers'),(ax[1],w['event2_shifted'],'After shifting event 2 left by 0.2247 s')]:
    a.axvline(0,color='#A3AAAE',ls=':',lw=1)
    a.plot(w['time'],w['event1'],color=blue,lw=1.9,label='Event 1')
    a.plot(w['time'],y,color=orange,lw=1.5,alpha=.83,label='Event 2')
    a.set_title(title,loc='left',pad=6)
    a.set_xlim(-.45,1.15);a.set_ylabel('Scaled amplitude')
ax[0].legend(ncol=2,loc='upper right');ax[1].set_xlabel('Seconds from each P marker')
save(fig,'lab_synthetic_alignment.png')

def trace(event,channel):
    return read(str(island/'sac'/event/(channel+'.sac')))[0]
# Show the two markers with numerical times beside observed counts.
tr=trace('S1_009900','Z7.HRIM..HHZ')
sc=tr.stats.sac;t=tr.times()+sc.b-sc.o
sel=(t>=-1.3)&(t<=9)
fig,a=plt.subplots(figsize=(8.0,4.3),layout='constrained')
a.plot(t[sel],tr.data[sel],c=navy,lw=.9)
for field, color, height in [('a',blue,.94),('t0',orange,.83)]:
    tt=float(sc[field]-sc.o); label='P' if field=='a' else 'S'
    a.axvline(tt,color=color,ls='--',lw=1.6)
    a.text(tt+.09, height,f'{label}  {tt:.3f} s',transform=a.get_xaxis_transform(),color=color,fontweight='bold',va='top',bbox={'facecolor':'white','edgecolor':'none','alpha':.9,'pad':1.2})
a.set(xlim=(-1.3,9),xlabel='Seconds since catalogue origin',ylabel='Recorded counts')
a.set_title('Z7.HRIM  ·  vertical component  ·  event 1',loc='left',color=navy)
save(fig,'lab_hrim_markers.png')

# Independent UTC overlap check on the two raw SAC cuts; no interpolation/filter.
x=trace('S1_009943','Z7.RODG..HHE');y=trace('S1_009944','Z7.RODG..HHE')
k=round((y.stats.starttime-x.stats.starttime)*x.stats.sampling_rate)
n=len(x)-k
assert k==6 and n==9495 and np.array_equal(x.data[k:],y.data[:n])
timebase=x.stats.starttime.__class__('2014-08-23T12:29:02Z')
t1=x.times() + (x.stats.starttime-timebase); t2=y.times() + (y.stats.starttime-timebase)
fig,axes=plt.subplots(2,1,figsize=(8,4.5),sharex=True,sharey=True,layout='constrained')
for a,tr,t,title,col in zip(axes,[x,y],[t1,t2],['Cut for catalogue event 44','Cut for catalogue event 45'],[blue,orange]):
    mask=(t>=-.7)&(t<=2.6)
    tt=float(tr.stats.sac.t0-tr.stats.sac.b)+(tr.stats.starttime-timebase)
    a.plot(t[mask],tr.data[mask],lw=1.2,color=col);a.axvline(tt,color=navy,ls=':',lw=1.2)
    a.text(tt+.04,.91,'S marker',transform=a.get_xaxis_transform(),va='top',fontsize=10.5)
    a.set_title(title,loc='left',pad=4,fontsize=14);a.set_ylabel('Counts')
axes[1].set_xlabel('Seconds after 12:29:02 UTC  ·  23 August 2014')
save(fig,'lab_duplicate_utc.png')
