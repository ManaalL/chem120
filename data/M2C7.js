/* Chapter 2.7 (Wed Oct 7): Radial plots and the radial distribution function. Course notes Module 2, pp. 25-31 (section 2.8, parts iii to v).
   R(r) against r, R(r)² against r, the radial distribution function (the notes' 4πr²R², written r²R² on pp. 30-31), number of maxima = n − l,
   the most probable radius, reading plots (Examples 2-7 to 2-9) and the thin-shell argument on p. 31. Distances are in units of a0 = 52.9 pm. */
(function(){
const M=C120;
const A0=52.9;
const L_LET=["s","p","d","f"];
const lab=(n,l)=>`${n}${L_LET[l]}`;
/* hydrogen radial factor (r in units of a0), sign chosen so R > 0 near the nucleus, as in the plots on p. 25 */
const fact=k=>{ let f=1; for(let i=2;i<=k;i++) f*=i; return f; };
function lag(k,a,x){ if(k===0) return 1; let L0=1, L1=1+a-x; for(let i=1;i<k;i++){ const L2=((2*i+1+a-x)*L1-(i+a)*L0)/(i+1); L0=L1; L1=L2; } return L1; }
function Rf(n,l,r){ const rho=2*r/n; const N=Math.sqrt(((2/n)**3*fact(n-l-1))/(2*n*fact(n+l))); return N*Math.exp(-rho/2)*Math.pow(rho,l)*lag(n-l-1,2*l+1,rho); }
const rdf=(n,l,r)=>r*r*Rf(n,l,r)**2;
const rMax=n=>2.2*n*n+6;
function nodes(n,l){ const out=[], rm=rMax(n), N=3000; let a=1e-6, fa=Rf(n,l,a); for(let i=1;i<=N;i++){ const b=i*rm/N, fb=Rf(n,l,b); if(fa*fb<0){ let x0=a,x1=b; for(let k=0;k<50;k++){ const m=(x0+x1)/2; if(Rf(n,l,x0)*Rf(n,l,m)<=0) x1=m; else x0=m; } out.push((x0+x1)/2); } a=b; fa=fb; } return out; }
function rmp(n,l){ let best=0, br=0; const rm=rMax(n), N=6000; for(let i=1;i<=N;i++){ const r=i*rm/N, v=rdf(n,l,r); if(v>best){ best=v; br=r; } } return br; }
function maxima(f,rm){ const out=[]; const N=3000; let p=f(0), c=f(rm/N); if(f(0)>f(rm/N)) out.push(0); for(let i=1;i<N;i++){ const x=(i+1)*rm/N, nx=f(x); if(c>p&&c>=nx) out.push(i*rm/N); p=c; c=nx; } return out; }
/* y-range for an R(r) plot: s orbitals start so high that the outer lobes vanish, so the plot is clipped (as textbooks do) */
function rRange(n,l){ const rm=rMax(n); let mx=0, mn=0, after=0; const nd=nodes(n,l); for(let i=0;i<=400;i++){ const r=i*rm/400, v=Rf(n,l,r); mx=Math.max(mx,v); mn=Math.min(mn,v); if(nd.length&&r>nd[0]) after=Math.max(after,Math.abs(v)); } const top=(l===0&&n>1)?Math.min(mx,3*after):mx; return {top, bot:Math.min(mn,0), clipped:top<mx}; }
/* a small unlabelled plot as an SVG string (used inside problem prompts, like the sketches in the notes and on Möbius) */
function plotSVG(kind,n,l,lbl){
  const W=340,H=150,pl=16,pr=10,pt=10,pb=16, rm=rMax(n);
  const f=kind==="R"?r=>Rf(n,l,r):kind==="R2"?r=>Rf(n,l,r)**2:r=>rdf(n,l,r);
  let top, bot=0;
  if(kind==="R"){ const g=rRange(n,l); top=g.top; bot=g.bot; } else { top=0; for(let i=0;i<=400;i++) top=Math.max(top,f(i*rm/400)); if(kind==="R2"&&l===0&&n>1){ let after=0; const nd=nodes(n,l); for(let i=0;i<=400;i++){ const r=i*rm/400; if(r>nd[0]) after=Math.max(after,f(r)); } top=Math.min(top,4*after); } }
  const span=(top-bot)*1.12||1; const y0=bot-(bot<0?span*0.04:0), y1=y0+span;
  const X=r=>pl+r/rm*(W-pl-pr), Y=v=>H-pb-(v-y0)/(y1-y0)*(H-pt-pb);
  let d="", pen=false; for(let i=0;i<=300;i++){ const r=i*rm/300, v=f(r); if(v>top*1.08){ pen=false; continue; } d+=(pen?"L":"M")+X(r).toFixed(1)+" "+Y(v).toFixed(1)+" "; pen=true; }
  const ylab=kind==="R"?"R(r)":kind==="R2"?"R(r)²":"RDF";
  return `<svg viewBox="0 0 ${W} ${H}" class="fig" style="max-width:380px" role="img" aria-label="${lbl||"Radial plot"}"><line class="ax" x1="${pl}" x2="${W-pr}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}"/><line class="ax" x1="${pl}" x2="${pl}" y1="${pt}" y2="${H-pb}"/><path class="cv c" d="${d}"/><text x="${W-pr}" y="${(Y(0)-4).toFixed(1)}" text-anchor="end" style="font-size:11px;fill:var(--ink2)">r</text><text x="${pl+4}" y="${pt+9}" style="font-size:11px;fill:var(--ink2)">${ylab}</text></svg>`;
}
const READABLE=(n,l)=>n-l<=4;

M.chapter({
  id:"M2C7", module:"m2", n:7, num:"2.7", date:"2026-10-07", added:"2026-10-26", quiz:"PC3",
  title:"Radial plots and the radial distribution function", pages:"25-31", sections:["2.8"],
  summary:"Three plots show how an orbital changes with distance from the nucleus: $R(r)$ crosses the axis at its $n-l-1$ radial nodes, $R(r)^2$ has $n-l$ maxima, and the radial distribution function $4\\pi r^2R^2$ gives the probability of finding the electron at distance $r$ in any direction. Its tallest peak is the most probable radius, $a_0 = 52.9$ pm for 1s.",
  flags:[
    {ref:"p. 25", text:"The six $R(r)$ plots have no unit on the $r$ axis. Their numbers only match the table of wavefunctions on p. 21 if $r$ is in ångströms (and $R$ in Å$^{-3/2}$), but the table's footnote says $r$ is in units of $a_0$ (0.529 Å). For example, the printed 2s node sits near $r = 1$, which is $2a_0 = 1.06$ Å. The plots on this site use $r/a_0$."},
    {ref:"p. 27", text:"Two of the most probable radius captions are off. The 3s caption says $r_{mp} \\approx 750$ pm, but the plotted peak (and the exact value) is about 692 pm. The 3p caption says $r_{mp} \\approx 700$ pm; the outer 3p peak is at $12a_0 \\approx 635$ pm. (The 2s caption, about 300 pm, rounds 277 pm.) The rule on the same page still holds: 3s (692 pm) > 3p (635 pm) > 3d (476 pm)."},
    {ref:"p. 31", text:"In the expansion of the shell volume, the middle term is printed as $4r(\\Delta r)^2$. It should be $4\\pi r(\\Delta r)^2$. The final result, $dV_{\\text{shell}} \\approx 4\\pi r^2\\Delta r$, is not affected."}
  ],
  formulas:[
    {id:"M2C7.f.crossings", name:"Crossings of R(r)", tex:"R(r)\\text{ crosses the } r \\text{ axis } n-l-1 \\text{ times}", kind:"rule", note:"Each crossing is a radial node. The start and end of the plot are not nodes.", ref:"p. 25"},
    {id:"M2C7.f.r-at-zero", name:"R(r) at the nucleus", tex:"l = 0:\\ R \\text{ largest at } r = 0 \\qquad l > 0:\\ R(0) = 0", kind:"rule", ref:"p. 25"},
    {id:"M2C7.f.maxima", name:"Number of maxima", tex:"\\#\\,\\text{maxima in } R^2 \\text{ (and in the RDF)} = n - l", kind:"rule", note:"Stated for $R^2$ on p. 26. The RDF has the same number: multiplying by $r^2$ adds no zeros between peaks. For s orbitals the $R^2$ maximum at $r = 0$ counts.", ref:"p. 26",
      blank:{tex:"\\#\\,\\text{maxima} = \\boxed{\\,?\\,}", accept:["n-l","n - l","n−l","n-ℓ"]}},
    {id:"M2C7.f.rdf", name:"Radial distribution function", tex:"\\text{RDF} = 4\\pi r^2 R(r)^2", note:"$4\\pi r^2$ is the area of a sphere of radius $r$. The notes write $r^2R^2$ on pp. 30-31; the two differ only by the constant $4\\pi$, so they have the same shape and the same peaks.", ref:"p. 27",
      blank:{tex:"\\text{RDF} = \\boxed{\\,?\\,}\\,R(r)^2", accept:["4πr^2","4pir^2","4 pi r^2","4πr²","r^2","r²","4*pi*r^2"]}},
    {id:"M2C7.f.rmp", name:"Most probable radius", tex:"r_{mp} = r \\text{ at the tallest RDF peak}", kind:"rule", note:"$r_{mp}$ grows with $n$; for a fixed $n$ it shrinks as $l$ grows.", ref:"p. 27"},
    {id:"M2C7.f.a0-rmp", name:"Most probable radius of 1s", tex:"r_{mp}(1s) = a_0 = 52.9\\ \\mathrm{pm}", kind:"constant", note:"The Bohr radius.", ref:"p. 27",
      blank:{tex:"r_{mp}(1s) = \\boxed{\\,?\\,}\\ \\mathrm{pm}", accept:["52.9","a0","a_0"]}},
    {id:"M2C7.f.shell", name:"Volume of a thin spherical shell", tex:"dV_{\\text{shell}} \\approx 4\\pi r^2\\,\\Delta r", note:"So the probability of being between $r$ and $r + \\Delta r$ is about $|\\Psi|^2\\,4\\pi r^2\\Delta r$, which is proportional to $r^2R^2$. From the Digging Deeper box on p. 31. Not tested on Test 2.", ref:"p. 31", notOn:["T2"]}
  ],
  glossary:[
    {id:"M2C7.t.radial-plot", term:"Radial factor plot", def:"A plot of $R(r)$ against $r$: how the radial part of $\\Psi$ changes with distance, including its sign.", ref:"p. 25"},
    {id:"M2C7.t.radial-density", term:"Radial electron density", def:"A plot of $R(r)^2$ against $r$: how the probability (or cloud density) changes as you move out from the nucleus in one direction.", ref:"p. 26"},
    {id:"M2C7.t.rdf", term:"Radial distribution function, RDF", def:"$4\\pi r^2R^2$: the probability of finding the electron at a distance $r$ from the nucleus, in any direction (in a thin shell at radius $r$).", ref:"p. 27"},
    {id:"M2C7.t.rmp", term:"Most probable radius, $r_{mp}$", def:"The distance where the RDF has its tallest peak: the most likely distance between the electron and the nucleus.", ref:"p. 27"},
    {id:"M2C7.t.penetration", term:"Penetration", def:"An s electron has a high probability density at the nucleus, so it \"penetrates\" to the nucleus. p, d and f electrons have zero density there.", ref:"p. 26"}
  ],
  figures:{
    rdf3d:{title:"The orbital and its radial plots, linked", cap:"Hydrogen orbitals computed from the wavefunctions (p. 21), with the radial plot underneath (pp. 25-27). Switch between $R$, $R^2$ and $r^2R^2$, and drag the point along $r$: the same distance lights up as a sphere in the 3D view. Distances are in $a_0$ = 52.9 pm.", ref:"pp. 21-27",
      model:{type:"orbital", params:{orbital:"3s", mode:"cloud", picker:"list", choices:["1s","2s","3s","4s","2pz","3pz","4pz","3dz2","4dz2"], nodes:true, radial:"rdf"}},
      predict:{q:"How many peaks does the radial distribution function of a 3s orbital have?", opts:[["1",false,"That is 1s, 2p or 3d: $n - l = 1$."],["2",false,"That is 2s or 3p."],["3",true,"$n - l = 3 - 0 = 3$, separated by the 2 radial nodes."],["4",false,"That would be 4s."]], keep:true, check:"Pick 3s, keep the plot on r²R² and count the peaks. Drag the point to each peak and watch which shell of the cloud lights up."}},
    rplots:{title:"R, R² and r²R² for any orbital", cap:"Choose $n$ and $l$ and one of the three plots (pp. 25-27). Dashed lines are radial nodes, where $R$ crosses zero. For s orbitals the $R$ and $R^2$ plots start so high that the top is cut off, as in most textbooks, so the outer lobes can be seen. $r$ is in units of $a_0$ (see the flag about p. 25).", ref:"pp. 25-27",
      build(host,{PLOT,M}){
        let n=3,l=1,kind="R";
        const ctl=PLOT.controls(host);
        const sn=PLOT.slider(ctl,{label:"n",min:1,max:6,value:n,oninput:v=>{ n=v; if(l>n-1){ l=n-1; sl.set(l); } draw(); }});
        const sl=PLOT.slider(ctl,{label:"l",min:0,max:3,value:l,fmt:v=>`${v} (${L_LET[v]})`,oninput:v=>{ l=Math.min(v,n-1); if(v!==l) sl.set(l); draw(); }});
        PLOT.seg(ctl,{label:"Plot",items:[["R","R(r)"],["R2","R(r)²"],["rdf","r²R²"]],value:kind,onchange:v=>{ kind=v; draw(); }});
        const box=document.createElement("div"); host.append(box); const out=PLOT.readout(host);
        function draw(){
          box.innerHTML=""; const rm=rMax(n);
          const f=kind==="R"?r=>Rf(n,l,r):kind==="R2"?r=>Rf(n,l,r)**2:r=>rdf(n,l,r);
          let top=0, bot=0, clipped=false;
          if(kind==="R"){ const g=rRange(n,l); top=g.top; bot=g.bot; clipped=g.clipped; }
          else { for(let i=0;i<=500;i++) top=Math.max(top,f(i*rm/500)); if(kind==="R2"&&l===0&&n>1){ let after=0; const nd=nodes(n,l); for(let i=0;i<=500;i++){ const r=i*rm/500; if(r>nd[0]) after=Math.max(after,f(r)); } if(4*after<top){ top=4*after; clipped=true; } } }
          const pad=(top-bot)*0.12;
          const G=PLOT.graph(box,{x:[0,rm],y:[bot<0?bot-pad:0,top+pad],w:560,h:260,xlabel:"r / a₀",ylabel:kind==="R"?"R(r)":kind==="R2"?"R(r)²":"r²R²",label:"Radial plot",grid:true,ystep:PLOT.niceStep(top-bot,4)});
          G.fn(r=>{ const v=f(r); return v>top*1.1?NaN:v; },{cls:"cv c",width:2.4});
          const nd=nodes(n,l); nd.forEach(r=>{ G.vline(r); G.label(r,top+pad*0.6,"node",{cls:"lblc",dx:3}); });
          if(kind!=="R"){ maxima(f,rm).forEach(r=>{ if(f(r)<=top*1.05) G.dot(r,f(r),{filled:true,r:4}); }); }
          if(clipped) G.label(0,top+pad*0.6,"↑ off the scale at r = 0",{cls:"lblc",dx:6});
          const rp=rmp(n,l);
          if(kind==="rdf"){ G.line(rp,0,rp,f(rp),{cls:"tan dash"}); G.label(rp,f(rp),"r_mp",{cls:"lblc",dx:5,dy:-4}); }
          out.innerHTML=M.rich(`<b>$${lab(n,l)}$</b>: $R(0)$ ${l?"$= 0$":"is the largest value"}; $R$ crosses the axis $n-l-1 = ${nd.length}$ time${nd.length===1?"":"s"}${nd.length?` (at ${nd.map(r=>r.toFixed(2)).join(", ")} $a_0$)`:""}; $R^2$ and $r^2R^2$ have $n-l = ${n-l}$ maxima; $r_{mp} \\approx ${rp.toFixed(2)}\\,a_0 = ${Math.round(rp*A0)}$ pm.`);
        }
        draw();
      }},
    shell:{title:"Why the RDF multiplies by r²", cap:"For 1s, three curves scaled to the same height: $R^2$ (density at one point) falls from the nucleus, the shell area $4\\pi r^2$ rises, and their product, the RDF, peaks in between, at $r = a_0$ (pp. 27 and 31). Drag the point to move the shell.", ref:"pp. 27-31",
      build(host,{PLOT,M}){
        const R2=r=>Math.exp(-2*r), A=r=>r*r/36, P=r=>r*r*Math.exp(-2*r)/Math.exp(-2);
        const G=PLOT.graph(host,{x:[0,6],y:[0,1.15],w:560,h:260,xlabel:"r / a₀",ylabel:"scaled",label:"R squared, shell area and their product for 1s",grid:true,xstep:1,ystep:0.25});
        G.fn(R2,{cls:"cv",dash:"6 4"}); G.fn(A,{cls:"cv",color:"var(--ink2)",dash:"2 3"}); G.fn(P,{cls:"cv c",width:2.6});
        G.label(0.15,1.04,"R² (one point)",{cls:"lblc"}); G.label(4.3,0.62,"4πr² (shell area)",{cls:"lblc"}); G.label(1.2,1.06,"RDF = product",{cls:"lblc"});
        const out=PLOT.readout(host);
        const show=r=>{ out.innerHTML=M.rich(`$r = ${r.toFixed(2)}\\,a_0 = ${Math.round(r*A0)}$ pm: $R^2$ is ${Math.round(R2(r)*100)}% of its value at the nucleus, but the shell is ${r<0.05?"tiny":`${(r*r).toFixed(2)} times bigger than at $r = a_0$`}. RDF = ${Math.round(P(r)*100)}% of its peak, which is at $a_0$ = 52.9 pm.`); };
        G.handle(1,P(1),{f:P,bounds:[0.02,5.9],step:0.05,label:"Shell radius",onMove:x=>show(x)}); show(1);
      }}
  },
  gens:[
    {id:"M2C7.g.count-maxima", title:"Maxima in the radial plots", skill:"$n - l$ maxima; s orbitals peak at the nucleus", ref:"pp. 25-27",
      gen(R,d){
        const n=R.int(2,6), l=R.int(0,Math.min(3,n-1));
        if(d===1) return {prompt:`How many maxima does the radial distribution function of a hydrogen $${lab(n,l)}$ orbital have?`, answer:{type:"int",value:n-l},
          hint:"Number of maxima $= n - l$ (p. 26). The peaks are separated by the radial nodes.", steps:[`$n = ${n}$, $l = ${l}$.`,`Maxima $= n - l = ${n-l}$, with $n - l - 1 = ${n-l-1}$ zero${n-l-1===1?"":"s"} (radial node${n-l-1===1?"":"s"}) between them.`], answerTeX:`${n-l}`};
        if(d===2) return {prompt:`Consider the plot of $R(r)^2$ against $r$ for a hydrogen $${lab(n,l)}$ orbital. How many maxima does it have, and what is its value at the nucleus?`,
          parts:[{label:"Maxima",answer:{type:"int",value:n-l}},{label:"At the nucleus ($r = 0$)",answer:{type:"mc",options:["It is the largest value on the plot","It is zero"],correct:l===0?0:1,keep:true}}],
          hint:"Maxima $= n - l$. Only s orbitals ($l = 0$) have density at the nucleus.",
          steps:[`Maxima $= n - l = ${n}-${l} = ${n-l}$${l===0?" (one of them is at $r = 0$)":""}.`,l===0?"An s orbital has its greatest density at the nucleus: it penetrates all the way in (p. 26).":`A${l===3?"n":""} ${L_LET[l]} orbital has zero density at the nucleus (p. 26).`], answerTeX:`${n-l} maxima; ${l===0?"largest at the nucleus":"zero at the nucleus"}`};
        const k=R.int(Math.max(1,n-3),n);
        return {prompt:`A hydrogen orbital with $n = ${n}$ gives a radial distribution function with ${k} maxim${k===1?"um":"a"}. Name the subshell.`, answer:{type:"orbital",answer:lab(n,n-k)},
          hint:"$n - l$ = number of maxima.", steps:[`$n - l = ${k}$, so $l = ${n}-${k} = ${n-k}$ (${L_LET[n-k]}).`,`It is $${lab(n,n-k)}$.`], answerTeX:`$${lab(n,n-k)}$`};
      }},
    {id:"M2C7.g.read-rdf", title:"Identify an orbital from its RDF", skill:"Count the RDF peaks", ref:"p. 27",
      gen(R,d){
        let n,l; do{ n=R.int(d===1?2:3,d===1?3:d===2?5:6); l=R.int(0,Math.min(3,n-1)); }while(!READABLE(n,l));
        return {prompt:`Below is a sketch of the radial distribution function for one hydrogen orbital with $n = ${n}$. Name the orbital.<br>${plotSVG("rdf",n,l,"Radial distribution function")}`,
          answer:{type:"orbital",answer:lab(n,l)},
          hint:"Count the peaks. Number of peaks $= n - l$.",
          steps:[`There ${n-l===1?"is 1 peak":`are ${n-l} peaks`}, so $n - l = ${n-l}$.`,`$l = ${n} - ${n-l} = ${l}$ (${L_LET[l]}).`,`The orbital is $${lab(n,l)}$.${n<=3?` (There is no ${n}f: $l$ can be at most $n - 1 = ${n-1}$.)`:""}`],
          answerTeX:`$${lab(n,l)}$`};
      }},
    {id:"M2C7.g.read-r", title:"Identify an orbital from its R(r) plot", skill:"Start at zero or not? Count the crossings", ref:"pp. 25-28",
      gen(R,d){
        if(d===1){ const n=R.int(1,5);
          return {prompt:`A plot of $R(r)$ against $r$ for a hydrogen orbital is sketched below. It does not start at zero. Which orbital is it?<br>${plotSVG("R",n,0,"Radial factor plot")}`,
            answer:{type:"orbital",answer:lab(n,0)}, hint:"$R(0) \\ne 0$ only for s orbitals. Then crossings $= n - l - 1$.",
            steps:["$R(r)$ is not zero at $r = 0$, so $l = 0$: an s orbital (p. 25).",`It crosses the axis ${n-1} time${n-1===1?"":"s"}: $n - 0 - 1 = ${n-1}$, so $n = ${n}$.`,`The orbital is $${lab(n,0)}$.`], answerTeX:`$${lab(n,0)}$`}; }
        if(d===2){ let n,l; do{ n=R.int(3,6); l=R.int(1,Math.min(3,n-1)); }while(n-l-1<1);
          return {prompt:`The plot below is $R(r)$ against $r$ for an orbital in the $n = ${n}$ shell of hydrogen. Which orbital is it?<br>${plotSVG("R",n,l,"Radial factor plot")}`,
            answer:{type:"orbital",answer:lab(n,l)}, hint:"Is $R(0)$ zero? Then count how many times the curve crosses the axis (the ends don't count).",
            steps:["$R(0) = 0$, so it is not an s orbital.",`It crosses the axis ${n-l-1} time${n-l-1===1?"":"s"}: $n - l - 1 = ${n-l-1}$.`,`With $n = ${n}$: $l = ${n} - 1 - ${n-l-1} = ${l}$ (${L_LET[l]}). The orbital is $${lab(n,l)}$.`], answerTeX:`$${lab(n,l)}$`}; }
        const k=R.int(1,3); const right=[`${k+2}p`,`${k+3}d`,`${k+4}f`]; const wrongs=R.shuffle([`${k+1}s`,`${k+1}p`,`${k+2}d`,`${k+2}s`]).slice(0,2);
        const opts=R.shuffle([...right,...wrongs]);
        return {prompt:`The plot below is $R(r)$ against $r$ for a hydrogen orbital. Which orbitals could it be? Select all that apply.<br>${plotSVG("R",k+2,1,"Radial factor plot")}`,
          answer:{type:"multi",options:opts.map(o=>`$${o}$`),correct:right.map(o=>opts.indexOf(o))},
          hint:"$R(0) = 0$ rules out s. Crossings give $n - l - 1$, but not $n$ and $l$ separately.",
          steps:["$R(0) = 0$, so $l > 0$: no s orbitals.",`${k} crossing${k>1?"s":""}: $n - l - 1 = ${k}$, so $n = l + ${k+1}$.`,`$l = 1$: $${k+2}p$; $l = 2$: $${k+3}d$; $l = 3$: $${k+4}f$. An $R$ plot alone can't tell these apart (like Example 2-7 b).`,...wrongs.map(o=>`$${o}$: ${o.endsWith("s")?"an s orbital starts at a maximum, not at zero":`$n - l - 1 = ${+o[0]-"spdf".indexOf(o[1])-1}$, not ${k}`}.`)],
          answerTeX:right.map(o=>`$${o}$`).join(", ")};
      }},
    {id:"M2C7.g.rmp-order", title:"Which orbital is bigger?", skill:"$r_{mp}$ grows with $n$, shrinks with $l$", ref:"p. 27",
      gen(R,d){
        const sameN=d===1?true:d===2?false:R.pick([true,false]); const k=d===3?3:2; let list;
        if(sameN){ const n=R.int(Math.max(2,k),5); list=R.shuffle(Array.from({length:Math.min(n,4)},(_,l)=>[n,l])).slice(0,k); }
        else { const l=R.int(0,2); list=R.shuffle([1,2,3,4,5].filter(n=>n>l).map(n=>[n,l])).slice(0,k); }
        const big=R.pick([true,false]);
        const key=([n,l])=>rmp(n,l); const best=list.reduce((a,b)=>big?(key(b)>key(a)?b:a):(key(b)<key(a)?b:a));
        return {prompt:`Which of these hydrogen orbitals has the ${big?"largest":"smallest"} most probable radius?`, answer:{type:"mc",options:list.map(o=>`$${lab(...o)}$`),correct:list.indexOf(best)},
          hint:"$r_{mp}$ increases as $n$ increases. For a fixed $n$, $r_{mp}$ decreases as $l$ increases (p. 27).",
          steps:[sameN?`All have $n = ${list[0][0]}$, so compare $l$: the ${big?"smallest":"largest"} $l$ gives the ${big?"largest":"smallest"} $r_{mp}$.`:`All have $l = ${list[0][1]}$, so compare $n$: the ${big?"largest":"smallest"} $n$ gives the ${big?"largest":"smallest"} $r_{mp}$.`,`For reference (computed from the wavefunctions, not printed in the notes): ${list.map(o=>`$${lab(...o)}$ ${Math.round(rmp(...o)*A0)} pm`).join(", ")}.`],
          answerTeX:`$${lab(...best)}$`};
      }},
    {id:"M2C7.g.plot-features", title:"Describe the radial plots of an orbital", skill:"Sketching R, R² and the RDF (Example 2-8)", ref:"pp. 25-29",
      gen(R,d){
        const n=R.int(3,d===1?4:6), l=R.int(0,Math.min(3,n-1)); const K=n-l-1, Mx=n-l;
        const st=[];
        if(R()<0.5) st.push(l===0?["$R(r)$ has its largest value at $r = 0$.",true,"s orbitals peak at the nucleus."]:["$R(r)$ is zero at $r = 0$.",true,`$l = ${l} > 0$.`]);
        else st.push(l===0?["$R(r)$ is zero at $r = 0$.",false,"s orbitals are largest at the nucleus."]:["$R(r)$ has its largest value at $r = 0$.",false,`Only s orbitals do; here $l = ${l}$.`]);
        const dk=R.pick(K>0?[0,1,-1]:[0,1]); st.push([`$R(r)$ crosses the $r$ axis ${K+dk} time${K+dk===1?"":"s"}.`,dk===0,`Crossings $= n - l - 1 = ${K}$.`]);
        const dm=R.pick(Mx>1?[0,1,-1]:[0,1]); st.push([`The plot of $R^2$ against $r$ has ${Mx+dm} maxim${Mx+dm===1?"um":"a"}.`,dm===0,`Maxima $= n - l = ${Mx}$.`]);
        st.push(["The radial distribution function is zero at $r = 0$.",true,"Every RDF starts at zero: the shell at $r = 0$ has no area."]);
        st.push(Mx>1?(R()<0.5?["The tallest peak of the radial distribution function is the one farthest from the nucleus.",true,"RDF peaks get larger as $r$ increases (p. 27)."]:["The tallest peak of the radial distribution function is the one nearest the nucleus.",false,"RDF peaks get larger as $r$ increases (p. 27)."]):["The radial distribution function has exactly one maximum.",true,"$n - l = 1$."]);
        if(st.every(s=>s[1])){ st[1]=[`$R(r)$ crosses the $r$ axis ${K+1} time${K+1===1?"":"s"}.`,false,`Crossings $= n - l - 1 = ${K}$.`]; }
        const order=R.shuffle([0,1,2,3,4]);
        return {prompt:`Which statements about the radial plots of a hydrogen $${lab(n,l)}$ orbital are true? Select all that apply.`,
          answer:{type:"multi",options:order.map(i=>st[i][0]),correct:order.map((i,j)=>st[i][1]?j:-1).filter(j=>j>=0)},
          hint:"$R(0) \\ne 0$ only for s. Crossings $= n - l - 1$. Maxima in $R^2$ and the RDF $= n - l$. RDF starts at 0 and its peaks grow outward.",
          steps:[`$n = ${n}$, $l = ${l}$.`,...order.map(i=>`${st[i][1]?"True":"False"}: ${st[i][0]} ${st[i][2]}`)],
          answerTeX:order.filter(i=>st[i][1]).map(i=>st[i][0]).join(" ")};
      }}
  ],
  exam:[
    {id:"M2C7.q1", ref:"p. 27", q:"A hydrogen orbital with $n = 4$ has a radial distribution function with two peaks. Which orbital is it?", opts:[
      ["4d",true,"$n - l = 2$, so $l = 2$."],["4s",false,"4s has $4 - 0 = 4$ maxima."],["4p",false,"4p has 3 maxima."],["4f",false,"4f has 1 maximum."],["3d",false,"It is in the $n = 4$ shell."]]},
    {id:"M2C7.q2", ref:"pp. 25-27", q:"Which statement about a hydrogen 2s orbital is correct?", opts:[
      ["$R(r)^2$ is largest at the nucleus, but the radial distribution function is zero there.",true,"The density at the point $r = 0$ is high, but a shell of radius 0 has no volume."],["$R(r)$ is zero at the nucleus.",false,"That is true for p, d and f, not s."],["The radial distribution function has one maximum.",false,"$n - l = 2$ maxima."],["$R(r)$ crosses the axis twice.",false,"$n - l - 1 = 1$ crossing."],["The most probable radius is 52.9 pm.",false,"That is 1s; 2s is about 277 pm."]]},
    {id:"M2C7.q3", ref:"p. 27", q:"Which hydrogen orbital has the largest most probable radius?", opts:[
      ["3s",true,"Largest $n$ here, and the smallest $l$ for that $n$."],["3p",false,"Same $n$ as 3s, but larger $l$ means smaller $r_{mp}$."],["3d",false,"The smallest of the $n = 3$ orbitals."],["2s",false,"$n = 2$ is smaller than $n = 3$."],["2p",false,"$n = 2$."]]},
    {id:"M2C7.q4", ref:"pp. 25-28", multi:true, q:"A plot of $R(r)$ against $r$ starts at zero and crosses the $r$ axis twice. Which orbitals could it be? Select all that apply.", opts:[
      ["4p",true,"$4 - 1 - 1 = 2$ crossings, and $R(0) = 0$."],["5d",true,"$5 - 2 - 1 = 2$."],["6f",true,"$6 - 3 - 1 = 2$."],["3s",false,"$R(0) \\ne 0$ for s orbitals."],["3p",false,"Only 1 crossing."]]},
    {id:"M2C7.q5", ref:"p. 27", q:"For an electron in the 1s orbital of a hydrogen atom, what is the most probable distance from the nucleus?", opts:[
      ["52.9 pm",true,"The Bohr radius, $a_0$."],["0 pm",false,"$R^2$ is largest at the nucleus, but the RDF is zero there."],["105.8 pm",false,"That is $2a_0$, the 2s node."],["277 pm",false,"That is roughly 2s."],["It can't be stated, because of the uncertainty principle",false,"An exact position can't be known, but a most probable distance can."]]},
    {id:"M2C7.q6", ref:"p. 26", q:"How many maxima does a plot of $R(r)^2$ against $r$ have for a 4p orbital?", opts:[
      ["3",true,"$n - l = 4 - 1 = 3$."],["2",false,"That is the number of radial nodes."],["4",false,"That would be 4s."],["1",false,"That would be 4f."],["0",false,"Every plot has at least one maximum."]]},
    {id:"M2C7.q7", ref:"pp. 27-31", q:"What does the radial distribution function tell you?", opts:[
      ["The probability of finding the electron at a distance $r$ from the nucleus, in any direction",true,"It adds up $|\\Psi|^2$ over a thin shell of area $4\\pi r^2$."],["The probability density at a single point a distance $r$ away",false,"That is $R^2$ (or $|\\Psi|^2$)."],["The sign of the wavefunction at distance $r$",false,"That is $R(r)$."],["The energy of the electron at distance $r$",false,"The energy is fixed by $n$."],["The exact radius of the electron's orbit",false,"There is no exact orbit."]]},
    {id:"M2C7.q8", ref:"pp. 26-27", multi:true, q:"A plot of $R(r)^2$ against $r$ for a hydrogen orbital is zero at $r = 0$ and has two maxima. Which statements are true? Select all that apply.", opts:[
      ["It could be a 4d orbital.",true,"$n - l = 4 - 2 = 2$ maxima, and $R^2 = 0$ at the nucleus because $l > 0$."],["It could be a 5f orbital.",true,"$5 - 3 = 2$ maxima, zero at the nucleus."],["It could be a 2s orbital.",false,"2s has 2 maxima, but one of them is at $r = 0$: s orbitals have their greatest density at the nucleus."],["The tallest peak on this plot marks the most probable radius.",false,"In $R^2$ the peaks get smaller outward. $r_{mp}$ comes from the tallest peak of the RDF, $4\\pi r^2R^2$, which is the outer one."],["The orbital has exactly one radial node.",true,"Radial nodes $= n - l - 1 = 2 - 1 = 1$: the zero between the two maxima."]]}
  ],
  steps:[
    {type:"read", title:"Three ways to plot the radial part of an orbital", ref:"pp. 22-27", body:"<p>An orbital is $\\Psi = R(r)Y(\\theta,\\phi)$. The last chapter dealt with shapes and nodes. This one is about how the orbital changes as you move away from the nucleus. The notes use three plots:</p><ol><li>$R(r)$ against $r$: the radial factor itself, with its sign (p. 25).</li><li>$R(r)^2$ against $r$: the probability density along one direction (p. 26).</li><li>The <b>radial distribution function</b>, $4\\pi r^2R^2$: the probability at a distance $r$ in any direction (p. 27).</li></ol><p>Think of rain over a city. $R^2$ is like the rainfall at one spot: heaviest downtown. The RDF is the total rain in a whole ring of the city at distance $r$: tiny downtown (the ring is small) and larger in the suburbs, where the rings are huge.</p>"},
    {type:"read", title:"R(r): crossings are radial nodes", ref:"p. 25", body:"<p>The radial factor plots share three features (p. 25):</p><ul><li>$R(r)$ dies away exponentially as $r$ increases.</li><li>$R(r)$ <b>crosses</b> the $r$ axis $n - l - 1$ times: those are the radial nodes. The start and end of the curve are not nodes.</li><li>For s orbitals $R$ is largest at $r = 0$. For p, d and f orbitals $R(0) = 0$.</li></ul><p>So one look tells you two things: whether it is an s orbital (does it start at zero?), and $n - l - 1$ (how many crossings?).</p>"},
    {type:"explore", title:"Compare the three plots", fig:"rplots", ref:"pp. 25-27", body:"<p>Start with $R(r)$ for 3p: it starts at 0, rises, crosses once and dies away. Change $l$ to 0 (3s): now it starts high and crosses twice.</p><p>Switch to $R^2$ and count maxima: always $n - l$. Then switch to $r^2R^2$: the peaks now grow as $r$ increases.</p>"},
    {type:"mcq", title:"Which orbitals reach the nucleus?", q:"For which orbitals is $R(r)$ not zero at the nucleus?", opts:[["Only s orbitals",true,"For $l = 0$, $R$ has its largest value at $r = 0$ (p. 25)."],["Only p orbitals",false,"For p, d and f, $R(0) = 0$."],["Only orbitals with $n = 1$",false,"2s, 3s and every other s orbital are also not zero at the nucleus. The rule depends on $l$, not $n$."]], after:"This is why s electrons are said to penetrate to the nucleus (p. 26). It matters a lot in Module 3."},
    {type:"read", title:"R(r)²: the density along one direction", ref:"p. 26", body:"<p>$R(r)^2$ shows how the probability of finding the electron (or the density of the electron cloud) changes as you move out from the nucleus in one direction. Squaring removes the sign, so the curve touches zero at each node and never goes below it.</p><div class=\"box def\"><b class=\"t\">Counting (p. 26)</b>radial nodes $= n - l - 1$ &nbsp;&nbsp; maxima $= n - l$</div><p>The maxima get smaller as $r$ increases. For s orbitals the density is greatest at the nucleus; for p, d and f it is zero there. The maxima are the dense rings in the scatter plots, and the zeros are the empty rings between them.</p>"},
    {type:"example", title:"Describe the plots of a 4p orbital", ref:"p. 29 (like Example 2-8)", ex:{q:"Describe the plots of $R$, $R^2$ and $r^2R^2$ against $r$ for a hydrogen 4p orbital.", steps:[
      {t:"$n = 4$, $l = 1$: radial nodes $= 4 - 1 - 1 = 2$; maxima $= 4 - 1 = 3$.",why:"The two counting rules from pp. 25-26."},
      {t:"$R$: starts at 0 (since $l > 0$), rises, crosses the axis twice, then dies away.",why:"Each crossing flips the sign of $R$."},
      {t:"$R^2$: starts at 0, three humps that get smaller, touching zero at the two nodes.",why:"Squaring makes everything positive."},
      {t:"$r^2R^2$: starts at 0, three humps that get <i>larger</i> outward; the outermost is the most probable radius.",why:"Multiplying by $r^2$ boosts the far-out humps (p. 27)."}], ans:"$R$: 2 crossings, $R(0) = 0$. $R^2$: 3 shrinking maxima. RDF: 3 growing maxima."}},
    {type:"try", title:"Count the maxima", gen:"M2C7.g.count-maxima"},
    {type:"read", title:"The RDF: probability at a distance, in any direction", ref:"pp. 27-31", body:"<p>Multiply the radial density by the area of a sphere of radius $r$, $4\\pi r^2$, and you get the <b>radial distribution function</b>. It gives the probability of finding the electron in a thin shell at distance $r$, whatever the direction. (pp. 30-31 write it as $r^2R^2$; it differs only by the constant $4\\pi$, so the shape and peaks are the same.)</p><div class=\"box def\"><b class=\"t\">Features of RDF plots (p. 27)</b>Every RDF starts at zero. The maxima get larger as $r$ increases. The tallest peak is the <b>most probable radius</b> $r_{mp}$. $r_{mp}$ grows with $n$; for the same $n$ it shrinks as $l$ grows.</div><p>For 1s, $r_{mp} = 52.9$ pm, exactly Bohr's radius $a_0$. Bohr's orbit radius survives as the most likely distance, not a fixed path.</p><p>Why multiply by area? A thin shell of radius $r$ and thickness $\\Delta r$ has volume $4\\pi r^2\\Delta r$ (p. 31). Near the nucleus the density is high but the shells are tiny; far out the shells are huge but the density is low. (The full thin-shell working on p. 31 is a Digging Deeper box and is not tested on Test 2. The idea that the RDF is density times sphere area is on p. 27 and is tested.)</p>"},
    {type:"explore", title:"Density falls, area grows, the product peaks", fig:"shell", ref:"pp. 27-31", body:"<p>Drag the point from the nucleus outward. At $r = 0$ the density is highest but the shell has no volume, so the RDF is zero. Far out, the shell is huge but empty. The product peaks at exactly $a_0$.</p>"},
    {type:"explore", title:"Link the RDF to the 3D orbital", fig:"rdf3d", ref:"pp. 21-27", body:"<p>Pick 2s, 3s, 4s in turn. Count the RDF peaks (2, 3, 4) and drag the point onto each one: it sits on a dense shell of the cloud. Then try 3pz and 3dz2: same $n$, fewer peaks, and the main peak moves inward.</p>"},
    {type:"try", title:"Read an RDF", gen:"M2C7.g.read-rdf"},
    {type:"try", title:"Read an R(r) plot", gen:"M2C7.g.read-r"},
    {type:"firstline", title:"Find the first mistake", q:"The RDF of an orbital in the $n = 5$ shell has 2 maxima. A student identifies it:", lines:["The RDF has 2 maxima.","Each maximum is a radial node, so there are 2 radial nodes.","$n - l - 1 = 2$, so $l = 2$.","It is a 5d orbital."], wrong:1, why:"Nodes are the zeros <i>between</i> the maxima: 2 maxima means 1 radial node. Then $n - l - 1 = 1$ gives $l = 3$: a 5f orbital. (Or directly: maxima $= n - l = 2$.)"},
    {type:"try", title:"Which is bigger?", gen:"M2C7.g.rmp-order"},
    {type:"try", title:"Describe the plots", gen:"M2C7.g.plot-features"},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
