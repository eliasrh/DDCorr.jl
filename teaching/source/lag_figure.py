"""Plot competing peaks in the 4–8 Hz P correlation for KVER events 13 and 27.
Usage: python lag_figure.py METHOD_EXAMPLES_DIRECTORY OUTPUT_PNG
"""
import sys
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
src,out=map(Path,sys.argv[1:3])
rs=np.genfromtxt(src/'competition.csv',names=True,delimiter=',')
x=rs['lag_s']*1000;y=rs['narrow_cc']
local=[i for i in range(1,len(x)-1) if y[i]>y[i-1] and y[i]>y[i+1]]
best=sorted(local,key=lambda i:y[i],reverse=True)[:2]
fig,ax=plt.subplots(figsize=(9.8,3.8),layout='constrained');ax.axhline(0,color='#BFCAC4',lw=.7)
ax.plot(x,y,lw=2.6,c='#236D69')
for j,i in enumerate(sorted(best,key=lambda i:x[i])):
 ax.scatter([x[i]],[y[i]],s=64,color=['#A14D2E','#233E33'][j],zorder=3)
 ax.annotate(f'{x[i]:+.0f} ms   r = {y[i]:.3f}',(x[i],y[i]),xytext=(-6 if j==0 else 12,15),ha='right' if j==0 else 'left',textcoords='offset points',fontsize=13,weight='bold',color='#26372E')
ax.set(xlim=(-510,510),ylim=(-1,1.14),xlabel='Lag relative to the P markers (ms)',ylabel='Correlation coefficient')
ax.spines[['top','right']].set_visible(False);ax.tick_params(labelsize=12);ax.xaxis.label.set_size(14);ax.yaxis.label.set_size(14)
fig.savefig(out,dpi=160,bbox_inches='tight');print([(float(x[i]),float(y[i])) for i in best])
