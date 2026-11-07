import numpy as np, math
g=9.81
# person: reversed for T=1 s
T=1.0; h1=0.5*g*T*T; v1=g*T; h2=v1*v1/(2*g); peak=h1+h2
tfall=math.sqrt(2*peak/g); vimp=math.sqrt(2*g*peak)
print(f"rise in 1s {h1:.3f} m, speed {v1:.2f} m/s = {v1*3.6:.1f} km/h; coast {h2:.3f}; peak {peak:.2f} m; storeys@3m {peak/3:.2f}")
print(f"time to peak {T+v1/g:.2f}s, fall {tfall:.2f}s, total air {T+v1/g+tfall:.2f}s, impact {vimp:.2f} m/s = {vimp*3.6:.1f} km/h")
# indoors: head 1.7 m, ceiling 2.6 m
d=0.9; t=math.sqrt(2*d/g); print(f"indoors: head hits ceiling after {t:.2f}s at {g*t:.2f} m/s = {g*t*3.6:.1f} km/h")
# plane: lift + reversed g -> 2g up net
print("plane extra climb in 1s:", 0.5*2*g, "m, vertical speed", 2*g, "m/s =", 2*g*196.85, "ft/min")
# Ocean layer: same kinematics as loose objects (simplified, no cavitation/pressure details)
# Atmosphere: 1D Lagrangian isothermal-ish (adiabatic gamma=1.4) column, ground wall, gravity flipped for 1 s
gam=1.4; R=287.; Tk=288.; H=R*Tk/g
N=4000; ztop=40000.
z=np.linspace(0,ztop,N+1)          # cell faces
p_face=101325*np.exp(-z/H)
m=(p_face[:-1]-p_face[1:])/g      # mass per area per cell
u=np.zeros(N+1); x=z.copy()
s=None
dx=np.diff(x); rho=m/dx; p=0.5*(p_face[:-1]+p_face[1:])
K=p/rho**gam
c0=math.sqrt(gam*101325/1.225); dt=0.2*(ztop/N)/c0
t=0; gs=+g # upward
hist=[]
while t<1.0-1e-9:
    dx=np.diff(x); rho=m/dx; p=K*rho**gam
    # artificial viscosity
    du=np.diff(u); q=np.where(du<0, 2.0*rho*du*du,0.0); P=p+q
    a=np.zeros(N+1)
    mf=np.zeros(N+1); mf[1:-1]=0.5*(m[:-1]+m[1:]); mf[-1]=0.5*m[-1]
    a[1:-1]=-(P[1:]-P[:-1])/mf[1:-1]+gs
    a[-1]=-(0-P[-1])/mf[-1]+gs
    a[0]=0
    u+=a*dt; u[0]=0; x+=u*dt; t+=dt
    hist.append((t,p[0]))
dx=np.diff(x); rho=m/dx; p=K*rho**gam
print(f"ground pressure after 1s: {p[0]:.0f} Pa ({(1-p[0]/101325)*100:.1f}% drop, {101325-p[0]:.0f} Pa)")
i=np.searchsorted(z,1000); print("air at ~1 km moved up", x[i]-z[i], "m, speed", u[i])
i=np.searchsorted(z,10); print("air at ~10 m moved up", x[i]-z[i], "m")
eq_alt=-H*math.log(p[0]/101325); print(f"equivalent altitude change {eq_alt:.0f} m")
