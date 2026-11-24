"""Plot the P measurements retained from the real Iceland baseline at two thresholds.
Usage: python threshold_figure.py ICELAND100_REFERENCE_DIRECTORY OUTPUT_PNG
"""
from pathlib import Path
import csv,sys
from collections import Counter,defaultdict
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator
root,out=map(Path,sys.argv[1:3])
with (root/'correlations.csv').open() as f:rows=[r for r in csv.DictReader(f) if r['phase']=='P']
colors=['#42817C','#B65634']
groups=[]; ids=[]
for cutoff in [0.70,0.90]:
 kept=[r for r in rows if float(r['cc_signed'])>=cutoff]
 groups.append(Counter(r['station'].split('.')[-1] for r in kept))
 ids.append(len({int(r[k]) for r in kept for k in ['event_i','event_j']}))
names=sorted(groups[0],key=groups[0].get)
fig,ax=plt.subplots(figsize=(10.4,5.0),layout='constrained')
y=list(range(len(names)))
for yy,name in enumerate(names):
 ax.plot([groups[1][name],groups[0][name]],[yy]*2,color='#BFCDC6',lw=2.0,zorder=1)
for ix,g in enumerate(groups):ax.scatter([g[k] for k in names],y,s=58,facecolor=colors[ix],edgecolor='white',linewidth=.65,zorder=3,label=['P threshold 0.70','P threshold 0.90'][ix])
ax.set_yticks(y,names);ax.set(ylabel='Z7 station',xlabel='Accepted P observations');ax.set_xlim(-15,max(groups[0].values())*1.06);ax.spines[['top','right']].set_visible(False);ax.grid(axis='x',color='#E3E7E1',lw=.6);ax.legend(loc='lower right',frameon=False,fontsize=12);ax.tick_params(labelsize=12);ax.set_xlabel('Accepted P observations',fontsize=14);ax.set_ylabel('Z7 station',fontsize=14);fig.savefig(out,dpi=155,bbox_inches='tight');plt.close(fig)
print([(sum(g.values()),n) for g,n in zip(groups,ids)])
