"""Draw two KVER P records before and after sampling relative to each marker.

The first two arguments are export_trace.jl outputs for events 1 and 2.
"""
import argparse
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("event1",type=Path)
    parser.add_argument("event2",type=Path)
    parser.add_argument("output",type=Path)
    args=parser.parse_args()
    fig,axes=plt.subplots(1,2,figsize=(12.7,4.1),layout="constrained",sharey=True)
    common=np.arange(28,37)/50
    for folder,base,color in [(args.event1,1.02,"#006E68"),(args.event2,-1.02,"#A64829")]:
        native=np.genfromtxt(folder/"trace_stages.csv",delimiter=",",names=True)
        reduced=np.genfromtxt(folder/"resampled.csv",delimiter=",",names=True)
        t=native["time_from_P_s"]
        span=(t>=.55)&(t<=.73)
        y=native["filtered"][span]
        scale=max(abs(y))
        # DDCorr.interpolate_grid uses linear interpolation at these offsets.
        aligned=np.interp(common,reduced["time_from_P_s"],reduced["amplitude"])
        for ax,tx,amp in [(axes[0],t[span],y),(axes[1],common,aligned)]:
            ax.plot(tx*1000,base+.84*amp/scale,"o-",color=color,lw=1.15,ms=4.6)
    for ax,title in zip(axes,("Filtered instrument samples · 10 ms apart","Samples used for correlation · 20 ms apart")):
        ax.set_title(title,loc="left",fontsize=16)
        ax.set(xlim=(547,733),ylim=(-2.05,2.05),xticks=common[::2]*1000,
               yticks=[-1.02,1.02],yticklabels=["Event 2","Event 1"],
               xlabel="Milliseconds after each event’s own P marker")
        for time in common:
            ax.axvline(1000*time,color="#B8C7C1",lw=.8,zorder=0)
        ax.spines[["top","right","left"]].set_visible(False)
        ax.tick_params(labelsize=12)
    fig.supxlabel("KVER vertical component · dots show sample times · waveforms are offset for display",fontsize=13)
    fig.savefig(args.output,dpi=145,facecolor="white")
    plt.close(fig)


if __name__=="__main__":
    main()
