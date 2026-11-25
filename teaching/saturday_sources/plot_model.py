"""Plot the Saturday kit velocity profile. Usage: python plot_model.py config/vm.txt output.png"""
from pathlib import Path
import sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
from matplotlib import pyplot as plt
from matplotlib.ticker import MultipleLocator
vm,out=map(Path,sys.argv[1:3]);z,p,s=np.loadtxt(vm,unpack=True)
fig,ax=plt.subplots(figsize=(5.8,4.25),layout='constrained')
for arr,name,c in ((p,'P','#087566'),(s,'S','#b25c34')):
 ax.plot(arr,z,color=c,lw=2.0,marker='o',ms=4,markeredgewidth=0,label=name)
ax.axhline(0,color='#42514a',ls=':',lw=1)
ax.set(xlim=(0,8),ylim=(43,-4),ylabel='Depth below sea level (km)',xlabel='Wave speed (km/s)')
ax.spines[['top','right']].set_visible(False);ax.xaxis.set_major_locator(MultipleLocator(1));ax.grid(axis='y',lw=.55,alpha=.3)
ax.legend(frameon=False,loc='lower left',ncol=2,fontsize=13);ax.tick_params(labelsize=12);ax.xaxis.label.set_size(14);ax.yaxis.label.set_size(14)
fig.savefig(out,dpi=165,bbox_inches='tight',pad_inches=.12)
