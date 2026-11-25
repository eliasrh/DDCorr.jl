"""Draw the separation of matched events in the two neighbour-selection runs."""
import csv,sys
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
rows=list(csv.DictReader(Path(sys.argv[1]).open()))
d=np.sort([float(r['delta_3d_m']) for r in rows]);fig,ax=plt.subplots(figsize=(9.4,3.9),layout='constrained')
ax.plot(np.arange(1,len(d)+1),d,'o-',ms=4,color='#177865',lw=1.4)
ax.axhline(np.median(d),ls='--',c='#ad5529',label=f'Median {np.median(d):.0f} m')
ax.set_xlabel('Common earthquakes ranked by displacement',fontsize=14);ax.set_ylabel('3-D difference (m)',fontsize=14);ax.tick_params(labelsize=12);ax.grid(axis='y',alpha=.2);ax.legend(frameon=False,fontsize=13);ax.spines[['top','right']].set_visible(False);fig.savefig(sys.argv[2],dpi=155,bbox_inches='tight');plt.close(fig)
