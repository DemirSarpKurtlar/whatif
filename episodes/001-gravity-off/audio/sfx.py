import numpy as np, scipy.signal as ss, scipy.io.wavfile as wf
SR=48000; END=60.7; N=int(SR*END)
rng=np.random.default_rng(7)
mus=np.zeros(N); sfx=np.zeros(N)
def T(t): return int(t*SR)
def env(n, a=0.01, r=0.3):
    e=np.ones(n); na=max(1,int(a*SR)); nr=max(1,min(n,int(r*SR)))
    e[:na]=np.linspace(0,1,na); e[-nr:]*=np.linspace(1,0,nr)**2; return e
def lp(x,f,o=2): b,a=ss.butter(o,f/(SR/2),'low'); return ss.lfilter(b,a,x)
def hp(x,f,o=2): b,a=ss.butter(o,f/(SR/2),'high'); return ss.lfilter(b,a,x)
def bp(x,f1,f2,o=2): b,a=ss.butter(o,[f1/(SR/2),f2/(SR/2)],'band'); return ss.lfilter(b,a,x)
def add(buf,t,x,g=1.0):
    i=T(t); j=min(N,i+len(x)); buf[i:j]+=x[:j-i]*g
def brown(n): x=np.cumsum(rng.standard_normal(n)); x=hp(x,20); return x/np.max(np.abs(x))
def white(n): return rng.standard_normal(n)
def db(d): return 10**(d/20)
t=np.arange(N)/SR
# --- wind bed (park) and space drone
w=lp(brown(N),500)*db(-30)*(1+0.3*np.sin(2*np.pi*0.13*t))
park=np.zeros(N); park[:]=1.0
for a,b in [(12.6,22.45),(38.95,48.4),(53.35,56.45),(56.45,END)]:
    i,j=T(a),T(b); park[i:j]=0.15
park=lp(park,3)
sfx+=w*park
drone=(np.sin(2*np.pi*55*t)+0.6*np.sin(2*np.pi*82.4*t)+0.3*np.sin(2*np.pi*110.3*t))*db(-30)
dmask=np.zeros(N); dmask[T(9.3):T(56.45)]=1; dmask=lp(dmask,1.5)
mus+=drone*dmask*(0.8+0.2*np.sin(2*np.pi*0.25*t))
# --- ambient pad
def note(f): return 440*2**((f-69)/12)
chords=[[57,60,64,69],[53,57,60,65],[48,55,60,64],[55,59,62,67]]
for k in range(8):
    st=k*8.0
    if st>=END: break
    ln=min(9.5, END-st); n=T(ln); tt=np.arange(n)/SR
    x=np.zeros(n)
    for m in chords[k%4]:
        f=note(m)
        x+=np.sin(2*np.pi*f*tt)+0.25*np.sin(2*np.pi*2*f*tt+0.3)+0.12*np.sin(2*np.pi*3*f*tt)
    x=lp(x,1800)*env(n,2.0,2.5)
    add(mus,st,x,db(-34))
# shimmer arpeggio before 9.3 (calm) and after 53.35
for st,en in [(0.0,8.4),(53.35,60.2)]:
    tt0=st; i=0
    while tt0<en:
        f=note([69,72,76,81,76,72][i%6]+12); n=T(0.9); tt=np.arange(n)/SR
        x=np.sin(2*np.pi*f*tt)*np.exp(-tt*4)
        add(mus,tt0,x,db(-36)); tt0+=0.5; i+=1
# --- 9.3 gravity off: riser 8.3->9.3, power-down sweep + sub boom
n=T(1.0); tt=np.arange(n)/SR
r=hp(white(n),2000)*(tt/1.0)**2; add(sfx,8.3,r,db(-24))
n=T(1.4); tt=np.arange(n)/SR
f=420*np.exp(-tt*2.6)+35; ph=2*np.pi*np.cumsum(f)/SR
add(sfx,9.3,np.sin(ph)*np.exp(-tt*1.5),db(-12))
n=T(2.0); tt=np.arange(n)/SR
add(sfx,9.3,np.sin(2*np.pi*42*tt)*np.exp(-tt*2.0),db(-8))
add(sfx,9.3,lp(white(T(0.6)),1500)*env(T(0.6),0.002,0.55),db(-18))
# --- whoosh helper
def whoosh(t0,d,g,f0=300,f1=3000):
    n=T(d); tt=np.arange(n)/SR; x=white(n); out=np.zeros(n); seg=T(0.02)
    for s in range(0,n,seg):
        fc=f0+(f1-f0)*np.sin(np.pi*min(1,s/n))**2
        out[s:s+seg]=bp(x[max(0,s-seg*4):s+seg],max(60,fc*0.6),min(20000,fc*1.4))[-len(out[s:s+seg]):]
    add(sfx,t0,out*np.sin(np.pi*tt/d)**2,g)
whoosh(12.4,0.9,db(-20)); whoosh(17.0,0.8,db(-24)); whoosh(22.3,1.0,db(-20),200,1800)
whoosh(31.1,0.8,db(-22)); whoosh(38.8,0.9,db(-20)); whoosh(42.0,0.8,db(-22)); whoosh(53.2,1.1,db(-18),200,2500)
# --- bloops 26.3-30.5
for k,t0 in enumerate([26.4,26.9,27.3,27.9,28.4,28.8,29.4,29.9,30.4]):
    n=T(0.18); tt=np.arange(n)/SR; f=300+500*tt/0.18*(1+0.3*(k%3))
    add(sfx,t0,np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*18),db(-20))
# --- jet: rumble 31.3-38.95 rising, big whoosh 35.8
n=T(38.95-31.3); tt=np.arange(n)/SR
jet=bp(white(n),150,1200)*(0.25+0.75*np.clip((tt-4.5)/2.8,0,1))*env(n,0.6,0.5)
add(sfx,31.3,jet,db(-22)); whoosh(35.6,2.6,db(-16),400,5000)
# --- air hiss 39-42.2
n=T(3.25); tt=np.arange(n)/SR
add(sfx,38.95,hp(white(n),3500)*(tt/3.25)*env(n,0.3,0.4),db(-26))
# --- quake rumble 43.4-48.4 + riser
n=T(5.1); tt=np.arange(n)/SR
q=lp(brown(n),90,3)*(0.3+0.7*tt/5.1)*(1+0.5*np.sin(2*np.pi*7*tt))*env(n,0.4,0.15)
add(sfx,43.4,q,db(-6))
for k in range(9):
    n=T(0.5); tt=np.arange(n)/SR
    add(sfx,43.6+k*0.52,lp(brown(n),180)*np.exp(-tt*6),db(-14))
n=T(2.4); tt=np.arange(n)/SR
add(sfx,46.0,hp(white(n),1500)*(tt/2.4)**2.5,db(-24))
# --- "Ten" tick 48.46
for f,g in [(1760,-20),(2640,-26)]:
    n=T(1.0); tt=np.arange(n)/SR; add(sfx,48.46,np.sin(2*np.pi*f*tt)*np.exp(-tt*5),db(g))
# --- 49.66 snap: boom, down-whoosh; 50.1 thuds
n=T(1.6); tt=np.arange(n)/SR
add(sfx,49.66,np.sin(2*np.pi*(60*np.exp(-tt*1.2)+30)*tt)*np.exp(-tt*2.2),db(-6))
add(sfx,49.66,lp(white(T(0.25)),3000)*env(T(0.25),0.001,0.24),db(-14))
whoosh(49.66,0.5,db(-18),2000,300)
for k,t0 in enumerate([50.12,50.17,50.21,50.26,50.33,50.4]):
    n=T(0.25); tt=np.arange(n)/SR
    add(sfx,t0,lp(white(n),400)*np.exp(-tt*25)+np.sin(2*np.pi*70*tt)*np.exp(-tt*20),db(-12-k))
# --- end chime
for f,g in [(880,-24),(1318.5,-28),(1760,-32)]:
    n=T(2.5); tt=np.arange(n)/SR; add(sfx,56.5,np.sin(2*np.pi*f*tt)*np.exp(-tt*1.6),db(g))
out=np.stack([mus+sfx, mus+sfx],1)
# tiny stereo widen for bed
out[:,1]=np.roll(out[:,1],int(0.012*SR))
peak=np.max(np.abs(out)); print('peak',peak)
if peak>0.95: out*=0.95/peak
wf.write('bed.wav',SR,(out*32767).astype(np.int16))
print('ok')
