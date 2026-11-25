"""Recreate the Saturday field figures: python run_figures.py SATURDAY_FOLDER OUTPUT_DIRECTORY."""
from pathlib import Path
import csv,sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
kit,out=map(Path,sys.argv[1:3]);out.mkdir(parents=True,exist_ok=True)
src=kit/'inputs';ref=kit/'reference';dd=ref/'graphsplit_output'
ink='#263F3B'; colors=['#545F78','#AE5225','#0D7668'];gold='#D9B16F'
plt.rcParams.update({'font.size':13,'font.family':'DejaVu Sans','axes.labelsize':14,'axes.titlesize':15,'axes.titlecolor':ink,'axes.spines.top':False,'axes.spines.right':False,'axes.edgecolor':'#a5b5ad','legend.frameon':False,'xtick.color':ink,'ytick.color':ink,'axes.labelcolor':ink})
def save(fig,name):fig.savefig(out/name,dpi=155,bbox_inches='tight',pad_inches=.13);plt.close(fig)
def cat(path):return {int(r[-1]):r for r in np.loadtxt(path,ndmin=2)}
data=[cat(src/'catalog.txt'),cat(dd/'catalog_preloc_filt.txt'),cat(dd/'catalog_dd_filt.txt')];ids=sorted(data[-1]);la,lo=np.mean([p[6:8] for p in data[0].values()],axis=0);latkm=6371*np.pi/180;lonkm=latkm*np.cos(np.deg2rad(la))
def xyz(c,chosen):return np.array([[(c[i][7]-lo)*lonkm,(c[i][6]-la)*latkm,c[i][8]] for i in chosen])
coords=[xyz(c,ids) for c in data];labels=['Input','Preliminary','Double difference']
xy=np.vstack(coords)
for k,n,label in [(1,'field_stages_map.png','North (km)'),(2,'field_stages_depth.png','Depth (km)')]:
 fig,axs=plt.subplots(1,3,figsize=(12,4.0),layout='constrained',sharex=True,sharey=True)
 for x,colour,name,ax in zip(coords,colors,labels,axs):
  ax.scatter(x[:,0],x[:,k],s=22,color=colour,alpha=.85,edgecolors='white',linewidths=.35)
  ax.grid(alpha=.15);ax.set_title(name);ax.set_xlabel('East (km)');ax.set_aspect('equal',adjustable='box')
 axs[0].set_ylabel(label);axs[0].set_xlim(xy[:,0].min()-.24,xy[:,0].max()+.24)
 ymn,ymx=xy[:,k].min()-.25,xy[:,k].max()+.25
 axs[0].set_ylim((ymx,ymn) if k==2 else (ymn,ymx));save(fig,n)
a,b,c=coords;dh=np.linalg.norm(c[:,:2]-a[:,:2],axis=1);dz=c[:,2]-a[:,2]
fig,axs=plt.subplots(1,2,figsize=(10.9,3.8),layout='constrained')
for ax,val,edge,title in [(axs[0],dh,colors[2],'Horizontal distance moved (km)'),(axs[1],dz,colors[1],'Depth change, positive down (km)')]:
 ax.hist(val,bins=13,color=edge,alpha=.8,edgecolor='white');md=np.median(val);ax.axvline(md,color=ink,ls='--',lw=1.7,label=f'Median {md:+.2f} km');ax.legend(fontsize=11);ax.set_xlabel(title);ax.set_ylabel('Earthquakes')
save(fig,'field_movements.png')
vm=np.loadtxt(kit/'config/vm.txt');fig,ax=plt.subplots(figsize=(6.1,4.4),layout='constrained')
for col,name,colour in [(1,'P velocity',colors[2]),(2,'S velocity',colors[1])]:ax.plot(vm[:,col],vm[:,0],'-o',ms=3,color=colour,label=name)
ax.set(ylabel='Depth below sea level (km)',xlabel='Velocity (km/s)',ylim=(23,-3));ax.legend();ax.grid(alpha=.17);save(fig,'field_velocity.png')
rows=list(csv.DictReader((dd/'solver_history.csv').open()));fig,axs=plt.subplots(1,2,figsize=(11,3.6),layout='constrained')
for st,ax,label,co in [('prelocation',axs[0],'Preliminary location',colors[1]),('relocation',axs[1],'Double difference',colors[2])]:
 vals=[(int(r['outer_iteration']),float(r['robust_rms_s'])*1000) for r in rows if r['stage']==st];x,y=np.array(vals).T;ax.plot(x,y,'o-',ms=3,color=co);ax.set(xlabel='Outer iteration',ylabel='Robust RMS (ms)',title=label);ax.grid(alpha=.16)
save(fig,'field_iterations.png')
groups=[l.split() for l in (ref/'sync_metrics.txt').read_text().splitlines() if l.startswith('Z7.')];groups.sort(key=lambda r:r[0])
fig,axs=plt.subplots(1,2,figsize=(11.8,4.5),layout='constrained',sharex=True)
for phase,ax,co in [('P',axs[0],colors[2]),('S',axs[1],colors[1])]:
 rr=[g for g in groups if g[0].endswith('_'+phase)];y=np.arange(len(rr));ax.barh(y,[int(g[1]) for g in rr],color='#cfcdc3',label='Input');ax.barh(y,[int(g[2]) for g in rr],color=co,label='Retained');ax.set_yticks(y,[g[0].split('.')[1].split('_')[0] for g in rr],fontsize=10);ax.invert_yaxis();ax.set(xlabel='Timed event pairs',title=phase+' groups');ax.legend(fontsize=10,loc='lower right')
save(fig,'field_sync_groups.png')
rows=list(csv.DictReader((dd/'catalog_dd_graphmeta.csv').open()));degree=[int(r['geometry_degree']) for r in rows];support=[int(r['dd_pair_degree']) for r in rows];fig,ax=plt.subplots(figsize=(8.3,4.0),layout='constrained')
from collections import Counter
for (x,y),m in Counter(zip(degree,support)).items():ax.scatter(x,y,s=24+8*m,c=colors[2] if y else '#a89e8d',edgecolor='white',lw=.5)
for i,side in [(2,-1),(5,1)]:
 r=next(v for v in rows if int(v['EventID'])==i);x,y=int(r['geometry_degree']),int(r['dd_pair_degree']);ax.annotate(f'Event {i}',(x,y),xytext=(-38,12) if side<0 else (-55,6),textcoords='offset points',fontsize=11)
ax.set(xlabel='Neighbours in the geometric graph',ylabel='Neighbours with DD observations',ylim=(-1,21),xlim=(-1,22));ax.grid(alpha=.15);save(fig,'field_degrees.png')
stations=np.genfromtxt(src/'stations.txt',dtype=None,encoding='utf8');fig,ax=plt.subplots(figsize=(7,5),layout='constrained')
ev=xyz(data[0],list(data[0]));ax.scatter(ev[:,0],ev[:,1],s=15,color=colors[1],alpha=.75,label='100 catalogue locations')
sx=[(r[2]-lo)*lonkm for r in stations];sy=[(r[1]-la)*latkm for r in stations]
ax.scatter(sx,sy,marker='^',s=52,color=colors[2],label='Z7 station');ax.legend(fontsize=11);ax.set(xlabel='East of sequence centre (km)',ylabel='North of sequence centre (km)',aspect='equal');ax.grid(alpha=.15)
for r,x,y in zip(stations,sx,sy):
 if r[0] in ('Z7.DYSA','Z7.KVER','Z7.STAM'):ax.annotate(r[0][3:],(x,y),xytext=(4,4),textcoords='offset points',fontsize=10)
save(fig,'field_network.png')
