"""Scientific PNGs for the course. No vector assets are produced.
Usage: python teaching/source/make_figures.py WORK_DIR
WORK_DIR holds exact Julia exports trace/ and real_figdata/ plus real_results/.
"""
from pathlib import Path
import sys, csv, json, shutil
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy.signal import resample_poly
root=Path(__file__).resolve().parents[2]; w=Path(sys.argv[1]); assets=root/'teaching/assets';assets.mkdir(exist_ok=True)
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':17,'axes.spines.top':False,'axes.spines.right':False,'axes.labelsize':18,'axes.titlesize':20,'legend.fontsize':15,'figure.facecolor':'#FCFCF9','axes.facecolor':'#FCFCF9','savefig.facecolor':'#FCFCF9'})
teal='#007C83';orange='#BC602A';purple='#7655A3'
def save(name,fig): fig.savefig(assets/(name+'.png'),dpi=180,bbox_inches='tight');plt.close(fig)
def load(path):return np.genfromtxt(path,delimiter=',',names=True)
x=np.linspace(-1.2,3,1401)
pulse=lambda t:np.exp(-((t-.45)/.28)**2)*(np.sin(2*np.pi*5*t)+.4*np.sin(2*np.pi*8.3*t))
a=pulse(x);b=pulse(x-.18)
fig,axs=plt.subplots(2,1,figsize=(12,5.8),sharex=True)
for ax,yy,title in zip(axs,[b,pulse(x)],['At the two pick times: B arrives 0.18 s later','Keep A fixed; display B(t + 0.18 s): B moves left']):
 ax.plot(x,a,c=teal,label='Event A (fixed)',lw=2);ax.plot(x,yy,c=orange,label='Event B',lw=1.8);ax.axvline(0,c='grey',ls='--');ax.set_title(title);ax.set_ylabel('Amplitude');ax.legend(loc='upper right');ax.set_xlim(-.5,1.4)
axs[-1].set_xlabel('Seconds relative to each event’s own P pick');fig.tight_layout();save('lag_introduction',fig)
# Window geometry: narrower core versus a longer same-component search trace.
fig,axs=plt.subplots(2,1,figsize=(12,6),sharex=True)
for ax,fixed,moving,title,sgn in zip(axs,[a,b],[b,a],['Term 1: A core stays fixed; extract a shifted window from B','Term 2: B core stays fixed; extract a window from A at the opposite lag'],[1,-1]):
 ax.plot(x,moving-.8,c=orange,lw=1.5,label='Extended search trace');ax.plot(x,np.where((x>=-.5)&(x<=1.1),fixed+1,np.nan),c=teal,lw=1.7,label='Fixed core only')
 ax.axvspan(-.5,1.1,alpha=.1,color=teal);ax.plot([-.5,1.1],[2.35,2.35],c=teal,lw=5)
 ax.plot([-.5+sgn*.18,1.1+sgn*.18],[-2,-2],c=orange,lw=5)
 ax.annotate('trial shift '+('+' if sgn==1 else '−')+'0.18 s',xy=(.18*sgn,-2),xytext=(1.3,-1.6),arrowprops={'arrowstyle':'->','color':orange},color=orange)
 ax.set_ylim(-2.5,2.8);ax.set_title(title);ax.set_yticks([]);ax.legend(loc='upper right');ax.set_xlim(-1.1,2.7)
axs[-1].set_xlabel('Seconds relative to each event’s own pick');fig.tight_layout();save('core_extended',fig)
# Timeline: actual defaults for P with genuine waveform padding.
fig,ax=plt.subplots(figsize=(12,4.8))
for y,left,right,label,color in [(3,-13,8,'Real waveform required for this P example', '#7C8A92'),(2,-8,-2,'Pre-P noise: −8 to −2 s',purple),(1,-1,2.5,'Extended search: −1 to +2.5 s',orange),(0,-.5,2,'Core: −0.5 to +2 s',teal)]:
 ax.plot([left,right],[y,y],lw=15,c=color,solid_capstyle='butt');ax.text(9,y,label,va='center',fontsize=16,color=color)
ax.axvline(0,c='black',ls='--');ax.text(.15,3.4,'P pick = 0');ax.annotate('5 s genuine padding',xy=(-10.5,3),xytext=(-12.9,3.7),fontsize=15)
ax.set_xlim(-14,23);ax.set_ylim(-.6,4.1);ax.set_yticks([]);ax.set_xlabel('Seconds relative to P pick');ax.spines['left'].set_visible(False);fig.tight_layout();save('windows',fig)
# Exact trace stages from Julia, one SAC throughout.
d=load(w/'trace/trace_stages.csv')
fig,axs=plt.subplots(3,1,figsize=(12,6.7),sharex=True)
for ax,col,title in zip(axs,['raw','detrended','filtered'],['Raw SAC samples','Mean and linear trend removed','2–14 Hz, forward–reverse bandpass']):
 ax.plot(d['time_from_P_s'],d[col],lw=1,c=teal);ax.set_title(title,loc='left');ax.axvline(0,c=orange,ls='--');ax.set_xlim(-10,8)
axs[-1].set_xlabel('Seconds from A header (P pick)');fig.tight_layout();save('trace_stages',fig)
fig,axs=plt.subplots(1,2,figsize=(12,4.5));edge=d['time_from_P_s']<d['time_from_P_s'][0]+1.8
axs[0].plot(d['time_from_P_s'][edge],d['detrended'][edge],c='#8B959C',label='Before taper');axs[0].plot(d['time_from_P_s'][edge],d['tapered'][edge],c=teal,label='After taper');axs[0].set_xlabel('Seconds from P pick');axs[0].set_ylabel('Amplitude');axs[0].set_title('Zoom: actual left trace edge');axs[0].legend(fontsize=13)
ratio=np.divide(d['tapered'],d['detrended'],out=np.ones(len(d)),where=np.abs(d['detrended'])>1e-12)
axs[1].plot(d['time_from_P_s'][edge],ratio[edge],c=teal,lw=2);axs[1].set_ylim(-.05,1.1);axs[1].set_xlabel('Seconds from P pick');axs[1].set_ylabel('Multiplicative weight');axs[1].set_title('Cosine weight rises to one');fig.tight_layout();save('taper',fig)
r=load(w/'trace/filter_response.csv');fig,ax=plt.subplots(figsize=(12,4.6));ax.plot(r['Hz'],r['one_pass_gain'],label='One pass: |H(f)|',c=orange,lw=2.5);ax.plot(r['Hz'],r['two_pass_gain'],label='Forward + reverse: |H(f)|²',c=teal,lw=2.5)
for f in (2,14):ax.axvline(f,c='grey',ls=':')
ax.axhline(.5,c='grey',ls=':',lw=.8);ax.set_xlim(0,25);ax.set_ylim(0,1.1);ax.set_xlabel('Frequency (Hz)');ax.set_ylabel('Amplitude gain');ax.legend();fig.tight_layout();save('filter_gain',fig)
# Aliasing: at 20 Hz samples, a 12 Hz sine looks like a phase-reversed 8 Hz sine.
t=np.arange(0,2,1/1000);ts=np.arange(0,2,1/20)
fig,axs=plt.subplots(2,1,figsize=(12,5.5))
axs[0].plot(t,np.sin(2*np.pi*12*t),c=orange,label='True 12 Hz');axs[0].plot(t,-np.sin(2*np.pi*8*t),c=teal,label='Indistinguishable 8 Hz at these samples');axs[0].plot(ts,np.sin(2*np.pi*12*ts),'o',c='black',ms=5,label='Samples at 20 Hz');axs[0].set_xlim(0,.5);axs[0].legend(ncol=2,fontsize=13)
t100=np.arange(0,20,1/100);mix=np.sin(2*np.pi*3*t100)+np.sin(2*np.pi*12*t100);safe=resample_poly(mix,1,5);newt=np.arange(len(safe))/20
axs[1].plot(newt,safe,c=teal,label='Low-pass then downsample: retain 3 Hz');axs[1].plot(t100[::5],mix[::5],c=orange,alpha=.6,label='Discard samples only: 12 Hz aliases');axs[1].set_xlim(5,6);axs[1].legend(fontsize=14)
for ax in axs:ax.set_xlabel('Time (s)');ax.set_ylabel('Amplitude')
fig.tight_layout();save('aliasing',fig)
# Proper typeset mathematical expressions, retained in editable source and notes.
equations={
'pearson':r'$r_{AB}[k]=\frac{\sum_{n=0}^{N-1}(A_n-\bar{A})(B_{n+k}-\bar{B}_k)}{\sqrt{\sum_{n=0}^{N-1}(A_n-\bar{A})^2}\,\sqrt{\sum_{n=0}^{N-1}(B_{n+k}-\bar{B}_k)^2}}$',
'symmetric':r'$C(\ell)=\frac{1}{2}\left[r(A_{\rm core},B_\ell)+r(B_{\rm core},A_{-\ell})\right]$',
'dt':r'$\Delta t_{ij}=(p_i-o_i)-(p_j-o_j)-\ell$',
'filter':r'$Y(f)=H(f)X(f),\qquad H_{\rm forward+reverse}(f)=H(f)H^*(f)=|H(f)|^2$',
'phase':r'$\tau_{\phi}(f)=-\frac{\phi(f)}{2\pi f},\qquad H(f)=|H(f)|e^{\mathrm{i}\phi(f)}$',
'parabola':r'$\delta=\frac{a-c}{2(a-2b+c)},\qquad \ell=\frac{k+\delta}{f_s}$',
'closure':r'$\Delta t_{ij}+\Delta t_{jk}+\Delta t_{ki}\simeq 0$',
'snr':r'$\mathrm{SNR}=\frac{\sqrt{N^{-1}\sum_{n=1}^N(s_n-\bar s)^2}}{\sqrt{M^{-1}\sum_{n=1}^M(q_n-\bar q)^2}}$'}
for name,eq in equations.items():
 fig=plt.figure(figsize=(14,2.0));fig.text(.5,.5,eq,ha='center',va='center',fontsize=30,color=teal);save('math_'+name,fig)
(assets/'equations.json').write_text(json.dumps(equations,indent=2)+'\n')
# Measured real examples, not illustrative pulse substitutes.
for name in ('weak','strong'):
 d=load(w/'real_figdata'/f'{name}_waveforms.csv');c=load(w/'real_figdata'/f'{name}_curve.csv')
 fig,axs=plt.subplots(1,2,figsize=(13,5),gridspec_kw={'width_ratios':[1.35,1]})
 axs[0].plot(d['time_s'],d['A_fixed'],c=teal,label='A fixed');axs[0].plot(d['time_s'],d['B_shifted'],c=orange,label='B shifted',alpha=.85);axs[0].set_xlabel('Seconds from each phase pick');axs[0].set_ylabel('Normalized amplitude');axs[0].legend()
 axs[1].plot(c['lag_s'],c['cc'],c=teal,lw=2);axs[1].axhline(.7,c=orange,ls='--',label='min_cc = 0.70');axs[1].set_xlabel('Lag (s), positive = B later');axs[1].set_ylabel('Symmetric coefficient');axs[1].set_ylim(-1,1);axs[1].legend(fontsize=13)
 fig.suptitle((w/'real_figdata'/f'{name}_description.txt').read_text().splitlines()[0],fontsize=19);fig.tight_layout();save('real_'+name,fig)
# One large readable matrix, not a dense three-panel thumbnail.
run=next((w/'real_results').glob('correlate_*'));rows=list(csv.DictReader((run/'matrices/group_0001_edges.csv').open()));arr=np.full((100,100),np.nan)
for row in rows:i,j=int(row['event_i'])-1,int(row['event_j'])-1;arr[i,j]=arr[j,i]=float(row['cc_signed'])
fig,ax=plt.subplots(figsize=(10,6));cmap=plt.get_cmap('viridis').copy();cmap.set_bad('#D9DEE3');im=ax.imshow(arr,vmin=.7,vmax=1,cmap=cmap,origin='upper',extent=(.5,100.5,100.5,.5));ax.set_xlabel('event_id j');ax.set_ylabel('event_id i');fig.colorbar(im,ax=ax,label='Accepted coefficient r');ax.set_title('Z7.DYSA P · grey = missing, including diagonal');fig.tight_layout();save('real_matrix',fig)
# Actual lag distribution.
rows=list(csv.DictReader((run/'correlations.csv').open()));fig,ax=plt.subplots(figsize=(12,4.5))
for ph,col in [('P',teal),('S',orange)]:ax.hist([float(q['lag_B_later_s']) for q in rows if q['phase']==ph],bins=np.linspace(-.5,.5,41),histtype='step',lw=2,label=ph,color=col)
ax.set_xlabel('Measured lag (s), positive = event j later');ax.set_ylabel('Accepted observations');ax.legend();fig.tight_layout();save('real_lags',fig)
print('PNG figures written:',assets)
