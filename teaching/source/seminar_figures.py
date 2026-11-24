"""Rebuild original charts for the DDCorr seminar from the 100-event workshop package.
Usage: python seminar_figures.py --workshop DIRECTORY --s1 S1.txt --out ASSETS
"""
import argparse
from pathlib import Path
from datetime import date
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from matplotlib.colors import Normalize

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--workshop',type=Path,required=True)
p.add_argument('--s1',type=Path,required=True)
p.add_argument('--growclust',type=Path,required=True)
p.add_argument('--out',type=Path,required=True)
a=p.parse_args()
a.out.mkdir(parents=True,exist_ok=True)
repo=a.workshop/'DDCorr.jl'; ref=a.workshop/'Iceland100'/'reference'
data=repo/'teaching'/'source'/'figure_data'
teal='#007F82'; dark='#173447'; rust='#BC542C'; gray='#768993'; light='#DAE3E6'
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':14,'axes.labelsize':15,'axes.titlesize':17,'axes.titleweight':'bold','axes.titlelocation':'left','axes.spines.top':False,'axes.spines.right':False,'axes.edgecolor':gray,'xtick.color':dark,'ytick.color':dark,'axes.labelcolor':dark,'text.color':dark,'axes.linewidth':0.9,'legend.frameon':False,'savefig.facecolor':'white'})
def finish(fig,name):
    fig.savefig(a.out/(name+'.png'),dpi=175,bbox_inches='tight',pad_inches=.15)
    plt.close(fig)
def fig_single(w=8.4,h=4.8):
    return plt.subplots(figsize=(w,h),layout='constrained')
def read_csv(path):
    return np.genfromtxt(path,names=True,delimiter=',')
# Both panels are local equirectangular maps, with identical length scaling on x and y.
cat=np.loadtxt(ref/'catalog.txt')
station=np.loadtxt(ref/'stations.txt',dtype=str)
lats=station[:,1].astype(float); lons=station[:,2].astype(float)
ref_lat=64.8; ref_lon=-17.0
def project(lon,lat):
    return (np.asarray(lon)-ref_lon)*(111.195*np.cos(np.deg2rad(ref_lat))),(np.asarray(lat)-ref_lat)*111.195
cx,cy=project(cat[:,7],cat[:,6]);sx,sy=project(lons,lats)
s1=[]
for line in a.s1.read_text().splitlines():
    cols=line.split()
    d=date.fromisoformat(cols[1])
    if date(2014,8,16)<=d<=date(2014,8,31):
        s1.append((float(cols[4]),float(cols[3]),(d-date(2014,8,16)).days))
large=np.array(s1); x,y=project(large[:,0],large[:,1])
fig,ax=fig_single(8.4,5)
pl=ax.scatter(x,y,c=large[:,2],s=4,alpha=.55,cmap='viridis',rasterized=True)
ax.scatter(cx,cy,facecolor='none',edgecolor=rust,s=13,linewidth=.7,label='100 class events',zorder=4)
ax.legend(loc='upper left',fontsize=12,markerscale=1.6)
ax.set(aspect='equal',xlabel='East (km)',ylabel='North (km)',xlim=(-34,17),ylim=(-30,28))
ax.grid(True,color=light,lw=.5,zorder=0)
cb=fig.colorbar(pl,ax=ax,pad=.025,shrink=.83,ticks=[0,5,10,15]);cb.set_ticklabels(['16','21','26','31']);cb.set_label('August 2014 (UTC day)')
finish(fig,'seminar_s1_rift')
fig,ax=fig_single(8.4,5.3)
ax.scatter(cx,cy,s=23,c=rust,alpha=.68,label='100 earthquakes',edgecolors='none')
ax.scatter(sx,sy,s=87,marker='^',c=teal,edgecolors='white',linewidth=.7,label='11 Z7 stations')
idxs={s:i for i,s in enumerate(station[:,0])}
for n,xy in {'Z7.KVER':(4,-10),'Z7.DYSA':(4,-10),'Z7.STAM':(3,4),'Z7.FLUR':(2,5)}.items():
    i=idxs[n];ax.annotate(n[3:],(sx[i],sy[i]),xytext=xy,textcoords='offset points',fontsize=12)
ax.set(aspect='equal',xlabel='East (km)',ylabel='North (km)',xlim=(-17,24),ylim=(-24,25));ax.grid(True,color=light,lw=.6)
ax.legend(loc='upper left',bbox_to_anchor=(1,.96),fontsize=13)
finish(fig,'seminar_network')
# Straight rays in a 2-D homogeneous medium at constant velocity.
fig,ax=fig_single(8.1,4.4)
angles=np.linspace(0,360,361);r=20000;v=6000.;east=r*np.cos(np.deg2rad(angles));north=r*np.sin(np.deg2rad(angles))
d=(np.hypot(east-50,north)-np.hypot(east+50,north))/v*1000
ax.axhline(0,c=gray,lw=1);ax.plot(angles,d,color=teal,lw=3)
for az in [0,90,180,270,360]:ax.scatter(az,d[az],color=rust,zorder=4,s=55)
ax.set(xlim=(-5,365),ylim=(-21,21),xticks=[0,90,180,270,360],xticklabels=['E','N','W','S','E'],yticks=[-16.7,0,16.7],xlabel='Direction to the station',ylabel='P travel time, i minus j (ms)')
ax.grid(axis='x',color=light,lw=.6)
finish(fig,'seminar_azimuth')
# Relative lag proportional to elapsed coda time for a uniform fractional time stretch.
fig,ax=fig_single(7.8,4.2)
xx=np.linspace(0,22);ax.plot(xx,xx*.002*1000,color=teal,lw=3);ax.scatter([5,10,20],[10,20,40],s=62,c=rust,zorder=3)
for x0 in [5,10,20]: ax.annotate(f'{2*x0} ms',(x0,2*x0),xytext=(-4,10),textcoords='offset points',ha='right',fontsize=13)
ax.set(xlabel='Time into the seismogram (s)',ylabel='Delay of the later waveform (ms)',xlim=(0,22),ylim=(0,47),xticks=[0,5,10,15,20],yticks=[0,10,20,30,40]);ax.grid(color=light,lw=.6)
finish(fig,'seminar_poupinet')
# Numbers reported by Waldhauser & Ellsworth (2000), p. 1363. Different inversion subsets.
fig,ax=fig_single(8.6,4)
labels=['Catalogue differences¹','Waveform P differences²','Waveform S differences²'];before=[125,96,147];after=[41,8.5,8.5];yy=[2,1,0]
for y0,b,c in zip(yy,before,after):
    ax.plot([c,b],[y0,y0],color=light,lw=5,zorder=0)
    for val,color in [(b,gray),(c,teal)]:
        ax.scatter(val,y0,color=color,s=90,zorder=2)
        ax.annotate(f'{val:g}',(val,y0),xytext=(0,12),textcoords='offset points',ha='center',color=color,fontsize=13,fontweight='bold')
ax.scatter([],[],color=gray,label='Before relocation');ax.scatter([],[],color=teal,label='After relocation')
ax.set(yticks=yy,yticklabels=labels,ylim=(-.5,2.55),xlim=(0,160),xlabel='Root-mean-square timing residual (ms)')
ax.legend(loc='upper center',bbox_to_anchor=(.52,1.26),ncol=2,fontsize=12)
ax.tick_params(axis='y',length=0);ax.spines['left'].set_visible(False)
fig.text(.01,-.04,'¹ Catalogue-only inversion.   ² Combined inversion, residuals for the waveform data.',fontsize=11,color=gray)
finish(fig,'seminar_hypodd')
# Genuine field waveform, aligned vs unaligned, three zoomed positive peaks.
w=read_csv(data/'kver'/'waveforms.csv');t=w['time_s'];u=w['event_1'];v=w['event_2'];delta=.0202
fig,axes=plt.subplots(2,1,sharex=True,figsize=(8.5,4.5),layout='constrained')
for ax,title,y in [(axes[0],'Original marker alignment',v),(axes[1],'Event 2 moved 20.2 ms earlier',np.interp(t+delta,t,v,left=np.nan,right=np.nan))]:
    ax.plot(t,u,c=teal,lw=2,label='Event 1');ax.plot(t,y,c=rust,lw=1.7,ls='--',label='Event 2');ax.set_title(title,fontsize=14)
    ax.axvline(0,c=gray,lw=1,linestyle=':');ax.set(xlim=(.34,1.05),yticks=[-4,0,4])
axes[0].legend(loc='upper right',ncol=2,fontsize=10);axes[-1].set_xlabel('Seconds from the P marker');fig.supylabel('Normalised amplitude',fontsize=14)
finish(fig,'seminar_kver_alignment')
# Explicit zero-mean sample products. No polarities or amplitudes changed between rows.
fig,axes=plt.subplots(2,2,figsize=(8.6,4.9),sharex=True,sharey='col',layout='constrained',gridspec_kw={'width_ratios':[1.6,1]})
a0=np.array([0,.6,.2,-1,.2]); b0=np.array([.2,0,.6,.2,-1]);xx=np.arange(5)
for i,(lab,b0i) in enumerate([('Before shifting',b0),('Aligned',a0)]):
    ax=axes[i,0];ax.axhline(0,color=light);ax.plot(xx,a0,'o-',c=teal,label='Event i',lw=2);ax.plot(xx,b0i,'x--',c=rust,label='Event j',lw=2);ax.set_title(lab,fontsize=14)
    bx=axes[i,1];bx.axhline(0,color=gray,lw=.8);bx.bar(xx,a0*b0i,color=[rust if z<0 else teal for z in a0*b0i]);bx.set_title(f'Product sum = {sum(a0*b0i):.2f}',fontsize=14)
axes[0,0].legend(ncol=2,fontsize=10,loc='lower left');axes[1,0].set_xlabel('Sample index');axes[1,1].set_xlabel('Sample index');axes[0,0].set_ylabel('Amplitude');axes[1,0].set_ylabel('Amplitude');axes[1,1].set_xticks(range(5))
finish(fig,'seminar_sample_products')
# Identical manufactured traces offset by 40 ms. Normalise each fixed-length sample window independently at each shift.
t=np.arange(-.9,.901,.002);k=np.arange(-.22,.221,.002);sel=(t>=-.53)&(t<=.53);offset=.04
wave_a=lambda t: (1-2*(np.pi*8*t)**2)*np.exp(-(np.pi*8*t)**2)+.48*np.exp(-((t-.16)/.04)**2)
wave_b=lambda t: np.sin(2*np.pi*10*t)
fig,axes=plt.subplots(1,2,figsize=(9,4.1),sharex=True,sharey=True,layout='constrained')
for ax,func,ti in zip(axes,[wave_a,wave_b],['A pulse with a distinct shape','A repeating 10 Hz wave']):
    curve=np.array([np.corrcoef(func(t[sel]),func(t[sel]+shift-offset))[0,1] for shift in k])
    ax.axhline(0,c=light,lw=.8);ax.plot(1000*k,curve,c=teal,lw=2.3);ax.axvline(40,ls='--',c=rust,lw=1.4)
    ax.set_title(ti,fontsize=14);ax.set(xlabel='Lag (ms)',xticks=[-200,-100,0,100,200],ylim=(-1.05,1.1));ax.grid(axis='x',color=light,lw=.5)
axes[0].set_ylabel('Correlation');axes[1].annotate('40 ms',(40,.98),xytext=(47,.75),color=rust,fontsize=12)
finish(fig,'seminar_repeated_peaks')

# Author-distributed GrowClust reference output: fields 8-10 relocated lat/lon/depth,
# fields 23-25 starting lat/lon/depth. Field 13 is cluster ID.
g=np.loadtxt(a.growclust)
c=g[g[:,12]==1]
assert len(c)==717 and (c[:,13]==717).all()
fig,ax=plt.subplots(1,2,sharex=True,sharey=True,figsize=(9,4.45),layout='constrained')
for panel,lat,lon,dep,caption in [(ax[0],22,23,24,'Catalogue'),(ax[1],7,8,9,'GrowClust')]:
    east=(c[:,lon]+119.684)*111.195*np.cos(np.deg2rad(39.66))
    panel.scatter(east,c[:,dep],s=8,color=teal,edgecolor='none',alpha=.59)
    panel.set(aspect='equal',xlabel='East (km)',xlim=(-2.1,2.1),ylim=(12,4.5),title=caption,xticks=[-2,0,2])
    panel.grid(color=light,lw=.5)
ax[0].set_ylabel('Depth (km)')
finish(fig,'seminar_growclust')
