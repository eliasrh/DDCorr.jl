"""Draw the scientific illustrations for the Saturday lecture from real workshop products.

python theory_figures.py INPUT_DIR SYNC_DIR GRAPHSPLIT_OUTPUT ASSETS
INPUT_DIR supplies dt.cc, catalog.txt, stations.txt, vm.txt. SYNC_DIR contains
theta and thetastd. The optional Cahuilla figure is credited separately.
"""
import argparse
import math
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import patches
from matplotlib.collections import LineCollection
from matplotlib.colors import ListedColormap, TwoSlopeNorm
from matplotlib.lines import Line2D

p=argparse.ArgumentParser(description=__doc__)
for k in ["inputs","sync","dd","out"]:p.add_argument(k,type=Path)
a=p.parse_args(); a.out.mkdir(parents=True,exist_ok=True)
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':13,'axes.spines.right':False,'axes.spines.top':False,'axes.titleweight':'bold','axes.titlelocation':'left','axes.titlesize':15,'axes.labelsize':14,'xtick.labelsize':12,'ytick.labelsize':12,'text.color':'#1e3938','axes.labelcolor':'#1e3938','xtick.color':'#394c4b','ytick.color':'#394c4b','axes.edgecolor':'#81918c','legend.frameon':False})
ink='#183d3c';blue='#186c69';light='#99c5b5';red='#ac512e';gray='#9ca9a3';yellow='#e3ab5d'
def panel(w=9,h=4.3,k=1):
 return plt.subplots(1,k,figsize=(w,h),layout='constrained')
def save(f,n):
 f.savefig(a.out/('sat_'+n+'.png'),dpi=155,bbox_inches='tight',pad_inches=.13,facecolor='white')
 plt.close(f)
groups={};pair=None
for l in (a.inputs/'dt.cc').read_text().splitlines():
 s=l.split()
 if not s:continue
 if s[0]=='#':pair=tuple(map(int,s[1:3]));continue
 g=(s[0],s[3]);groups.setdefault(g,{})[pair]=(float(s[1]),float(s[2]))
dy=groups[('Z7.DYSA','P')]
cat=np.loadtxt(a.inputs/'catalog.txt');ev={int(row[-1]):row for row in cat}
yp={int(i):th for i,th,ref in np.loadtxt(a.sync/'theta/theta_Z7.DYSA_P.txt') if np.isfinite(th)}
ls=a.inputs.joinpath('stations.txt').read_text().splitlines()
stas={v[0].split('.')[-1]:[float(z) for z in v[1:]] for v in (l.split() for l in ls if l.strip())}
def km(lat,lon):
 return (np.asarray(lon)+16.91)*111.2*np.cos(np.deg2rad(64.77)),(np.asarray(lat)-64.77)*111.2
xy={i:km(row[6],row[7]) for i,row in ev.items()}
f,ax=panel(10.6,4.8,2)
ax[0].scatter(*km(cat[:,6],cat[:,7]),s=12,c=red,alpha=.6)
for name,st in stas.items():
 x,y=km(st[0],st[1]);ax[0].scatter(x,y,marker='^',s=75,c=blue)
 if name in ['DYSA','KVER','FLUR']:ax[0].annotate(name,(x,y),xytext=(4,7),textcoords='offset points',fontsize=11)
ax[0].set(title='Eleven Z7 stations',xlabel='East (km)',ylabel='North (km)',aspect='equal')
for x in [ax[1]]:
 x.scatter(*km(cat[:,6],cat[:,7]),s=20,c=gray,alpha=.63)
 for i in [1,3,5]:x.scatter(*xy[i],c=red,s=52);x.annotate(str(i),xy[i],xytext=(5,1),textcoords='offset points',weight='bold')
 x.set(title='Enlarged view of the swarm',xlabel='East (km)',ylabel='North (km)',aspect='equal',xlim=(-1.0,1.2),ylim=(-.5,2.3))
save(f,'network')
# Measurements and graph structure. Both graphs use the identical event positions on a circle.
ids=[1,3,5,6,7,11,25];n=len(ids)
coords={i:np.array([math.cos(2*math.pi*k/n+math.pi/2),math.sin(2*math.pi*k/n+math.pi/2)]) for k,i in enumerate(ids)}
def net(ax,points,edges,show_ids=True,ref=None):
 for i,j in edges:ax.plot(*zip(points[i],points[j]),color=gray,lw=1.35,zorder=1,alpha=.85)
 for i,(x,y) in points.items():
  ax.scatter(x,y,s=610 if show_ids else 30,edgecolor='white',lw=1.6,c=red if i==ref else blue,zorder=2)
  if show_ids:ax.text(x,y,str(i),ha='center',va='center',color='white',weight='bold',fontsize=12,zorder=3)
 ax.set(xlim=(-1.28,1.28),ylim=(-1.22,1.22),aspect='equal');ax.axis('off')
f,axs=panel(10,4.55,2)
for ax,g in zip(axs,[('Z7.DYSA','P'),('Z7.KATT','S')]):
 links=[(i,j) for (i,j) in groups[g] if i in ids and j in ids];net(ax,coords,links);ax.set_title(f'{g[0]} {g[1]}   ·   {len(links)} measured pairs',loc='center')
save(f,'two_groups')
f,ax=panel(8.6,4.7);ax.axis('off');ax.set(xlim=(-1.55,1.55),ylim=(-.75,1.4),aspect='equal')
vv={1:(-1.02,-.24),3:(0,.98),5:(1.02,-.24)}
for i,j,dx,dy_ in [(1,3,-.13,.16),(3,5,.13,.16),(1,5,0,-.17)]:
 x,y=vv[i];xx,yy=vv[j];ax.annotate('',xy=(xx,yy),xytext=(x,y),arrowprops=dict(arrowstyle='-|>',shrinkA=21,shrinkB=21,color=blue if (i,j)!=(1,5) else red,lw=2.8,mutation_scale=16));txt=f'{dy[(i,j)][0]*1000:+.1f} ms';ax.text((x+xx)/2+dx,(y+yy)/2+dy_,txt,ha='center',size=15,weight='bold',color=ink,bbox=dict(facecolor='white',edgecolor='none',pad=1))
for i,(x,y) in vv.items():ax.scatter(x,y,s=1220,c=blue,zorder=4);ax.text(x,y,str(i),color='white',weight='bold',ha='center',va='center',zorder=5,size=18)
save(f,'triangle')
f,ax=panel(9.2,3.75)
q=[1,3,5,25];y=np.array([yp[i]*1000 for i in q]);y2=y-y[0];x=np.arange(len(q))
ax.axhline(0,color='#a8b4ae',lw=.9);ax.scatter(x-.07,y,marker='o',s=90,color=blue,label='Zero at event 25');ax.scatter(x+.07,y2,marker='D',s=70,color=red,label='Zero at event 1')
for j in range(len(x)):ax.plot([x[j]-.07,x[j]+.07],[y[j],y2[j]],color=gray,zorder=0)
ax.set_xticks(x,[f'Event {i}' for i in q]);ax.set(ylabel='Timing potential (ms)',ylim=(-107,32));ax.legend(loc='lower right',ncol=2,fontsize=11)
save(f,'gauge')
f,ax=panel(9.7,4.0); xx=np.array([dy[z][0]*1000 for z in [(1,3),(3,5),(1,5)]]);xt=np.array([(yp[i]-yp[j])*1000 for i,j in [(1,3),(3,5),(1,5)]])
for y,(i,j) in enumerate([(1,3),(3,5),(1,5)]):ax.plot([0,(xt[y]-xx[y])],[y,y],lw=5,color=light,solid_capstyle='round');ax.scatter(xt[y]-xx[y],y,s=92,c=blue);ax.annotate(f'{xt[y]-xx[y]:+.2f} ms',(xt[y]-xx[y],y),xytext=(0,10),textcoords='offset points',ha='center',weight='bold',size=12)
ax.axvline(0,color=gray,lw=1.4);ax.set_yticks(range(3),['1 minus 3','3 minus 5','1 minus 5']);ax.set(xlim=(-1.8,.55),ylim=(-.5,2.6),xlabel='Fitted difference minus measured difference (ms)',ylabel='DYSA P pair')
save(f,'fit_residuals')
f,axs=panel(10,4.3,2)
for ax,kind in zip(axs,['measured','star']):
 if kind=='star':
  co={k:(v if k!=25 else [0,0]) for k,v in coords.items()};net(ax,co,[(25,i) for i in ids if i!=25],ref=25);label='Six differences to reference event 25'
 else:net(ax,coords,[(i,j) for i,j in dy if i in ids and j in ids],ref=25);label='Measured pairs among seven events'
 ax.set_title(label,loc='center')
save(f,'star')
f,ax=panel(9.45,4.15)
dd=np.loadtxt(a.sync/'thetastd/std_theta_Z7.DYSA_P.txt');dd=dd[np.isfinite(dd[:,1])&(dd[:,0]!=dd[:,2])]
ax.scatter(dd[:,3],dd[:,1]*1000,s=54,facecolor=light,edgecolor=blue,lw=.8)
for i in (1,4):
 row=dd[dd[:,0]==i][0];ax.scatter(row[3],row[1]*1000,s=85,c=red);ax.annotate(f'Event {i}',(row[3],row[1]*1000),xytext=(6,6),textcoords='offset points',size=12)
ax.set(xlabel='Retained links incident on event · DYSA P',ylabel='Formal timing uncertainty (ms)')
save(f,'uncertainty')
vm=np.loadtxt(a.inputs/'vm.txt')
f,axs=panel(10.5,4.4,2)
ax=axs[0];xmin,xmax=64.77,-16.91
for nm in ('KVER','DYSA','FLUR'):
 st=stas[nm];x,y=km(st[0],st[1]);ax.plot([0,x],[0,y],color=gray,ls='--',lw=1.7);ax.scatter(x,y,s=75,marker='^',c=blue);ax.annotate(nm,(x,y),xytext=(-10,8),textcoords='offset points',size=11)
ax.scatter(0,0,s=88,c=red);ax.annotate('Swarm',(0,0),xytext=(-4,-14),textcoords='offset points');ax.set(xlabel='East (km)',ylabel='North (km)',title='Three station directions',aspect='equal',xlim=(-9,18),ylim=(-3,23))
ax=axs[1];sel=vm[:,0]<=25;ax.plot(vm[sel,1],vm[sel,0],color=red,lw=2.5,label='P');ax.plot(vm[sel,2],vm[sel,0],color=blue,lw=2.5,label='S');ax.legend();ax.set(xlabel='Wave speed (km/s)',ylabel='Depth below sea level (km)',title='Workshop velocity model');ax.invert_yaxis()
save(f,'model')
f,ax=panel(9,3.8);rx=np.linspace(-5,5,900);c=1.345;ax.plot(rx,np.minimum(1,c/np.maximum(abs(rx),1e-12)),lw=3,c=blue);ax.axhline(1,color=gray,lw=.7)
for xx in (-c,c):ax.axvline(xx,color=gray,ls=':',lw=1.25)
ax.scatter([3],[c/3],c=red,s=72);ax.annotate('3 scale units   ·   multiplier 0.45',(3,c/3),xytext=(-5,-25),textcoords='offset points',ha='center',size=12)
ax.set(xlabel='Timing misfit divided by its robust scale',ylabel='Huber weight multiplier',ylim=(-.03,1.12),xlim=(-5,5))
save(f,'huber')
f,ax=panel(8.8,3.7);xx=np.array([[1,-1,0],[0,1,-1],[1,0,-1]])
ax.imshow(xx,cmap=ListedColormap([red,'#eef2ee',blue]),vmin=-1,vmax=1,aspect='auto');ax.set_xticks([0,1,2],['Event 1','Event 3','Event 5']);ax.set_yticks([0,1,2],['1 minus 3','3 minus 5','1 minus 5']);ax.tick_params(length=0);ax.xaxis.tick_top()
for i in range(3):
 for j in range(3):ax.text(j,i,{1:'+1',0:'0',-1:'−1'}[xx[i,j]],color='white' if xx[i,j] else gray,ha='center',va='center',size=22,weight='bold')
save(f,'incidence')
# Identify the original pair whose indirect difference is used as a single connected example.
i,j=5,11
assert (i,j) not in dy and (1,i) in dy and (1,j) in dy
f,ax=panel(9.5,3.0);ax.axis('off');nx={i:0,1:1,j:2}
for event,xx in nx.items():ax.scatter(xx,0,s=1400,color=blue,zorder=3);ax.text(xx,0,str(event),weight='bold',size=19,ha='center',va='center',color='white',zorder=4)
ax.plot([0,1,2],[0,0,0],lw=3,c=gray);ax.text(.5,.18,'Measured pair 1, 5',ha='center',size=15);ax.text(1.5,.18,'Measured pair 1, 11',ha='center',size=15)
ax.annotate('',xy=(2,-.22),xytext=(0,-.22),arrowprops=dict(arrowstyle='<->',color=red,lw=2.1));ax.text(1,-.42,f'Fitted difference for 5 minus 11   {(yp[i]-yp[j])*1000:+.2f} ms',ha='center',size=15,weight='bold',color=red);ax.set(xlim=(-.28,2.28),ylim=(-.6,.49))
save(f,'indirect')
# Geometry diagram showing why a common velocity error can cancel.
from matplotlib.patches import Ellipse
f,ax=panel(9.2,4.0)
ax.add_patch(Ellipse((6.9,2.1),3.2,1.1,angle=6,color='#f2c78b',alpha=.72))
for (x,y),c,lab,dy_label in [((.6,.2),blue,'Event i',-.26),((1.05,.88),red,'Event j',.2)]:
 ax.plot([x,9],[y,2.6],c=c,lw=2.2);ax.scatter(x,y,s=88,c=c,zorder=4);ax.text(x-.12,y+dy_label,lab,ha='center',color=c,weight='bold',size=13)
ax.scatter(9,2.6,s=150,c=ink,marker='^');ax.text(9,2.83,'Station',ha='center',weight='bold');ax.text(6.75,1.26,'Broad slow region',ha='center',size=13)
ax.set(xlim=(-.1,9.8),ylim=(-.4,3.3),aspect='equal');ax.axis('off');save(f,'shared_paths')
# Reproduce this CSV with export_teaching_edges.jl and the Saturday reference run.
edgefile=Path(__file__).with_name('teaching_edges.csv')
edges=np.genfromtxt(edgefile,names=True,delimiter=',',dtype=int)
pre=np.loadtxt(a.dd/'catalog_preloc.txt');prexy={int(v[-1]):np.array(km(v[6],v[7])) for v in pre}
f,axs=panel(10.4,4.8,2)
col=np.asarray([prexy[i] for i in ev]);cx,cy=prexy[1]
for n,ax in enumerate(axs):
 chosen=[e for e in edges if (e['i']==1 or e['j']==1) and (n==0 or e['common_observations']>0)]
 for row in chosen:
  ii,jj=int(row['i']),int(row['j']);x0,y0=prexy[ii];x1,y1=prexy[jj];ax.plot([x0-cx,x1-cx],[y0-cy,y1-cy],color=red if n==1 else gray,lw=1.6,zorder=2)
  other=jj if ii==1 else ii; ax.scatter(*(prexy[other]-prexy[1]),s=45,color=blue,zorder=3)
 ax.scatter(col[:,0]-cx,col[:,1]-cy,s=12,color='#c8ceca',alpha=.65,zorder=1);ax.scatter(0,0,marker='*',s=180,edgecolor='white',lw=.7,c=red,zorder=5)
 ax.set(xlabel='East of event 1 (km)',ylabel='North of event 1 (km)',title=f'{len(chosen)} '+('candidate neighbours' if n==0 else 'neighbours supplying DD times'),xlim=(-.31,.31),ylim=(-.31,.31),aspect='equal')
save(f,'neighbors')
f,ax=panel(9.4,3.65)
for i in [44,45]:
 outs=[np.loadtxt(a.inputs/'catalog.txt'),pre,np.loadtxt(a.dd/'catalog_dd.txt')]
 sep=[]
 for arr in outs:
  v1=arr[arr[:,-1]==44][0];v2=arr[arr[:,-1]==45][0];c1=np.array(km(v1[6],v1[7]));c2=np.array(km(v2[6],v2[7]));sep.append(1000*np.hypot(np.linalg.norm(c1-c2),v1[8]-v2[8]))
 break
ax.barh([2,1,0],sep,color=[gray,light,blue],height=.46);ax.set_yticks([2,1,0],['Starting catalogue','Prelocation','Local DD']);ax.set(xlabel='Separation between events 44 and 45 (metres)',xlim=(0,290))
for j,v in enumerate(sep):ax.text(v+4,2-j,f'{v:.1f} m',va='center',color=ink,weight='bold')
save(f,'overlap')
