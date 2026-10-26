/* CHEM 120 Interactive: small SVG plotting kit for the interactive figures.
   const G = PLOT.graph(host, {x:[-1,5], y:[-2,6]});  G.fn(x=>x*x);  G.point(2,4,{drag:"curve", f:x=>x*x, onMove})
   Colours come from CSS variables, so every figure follows light and dark mode. */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const PI=Math.PI;
function sv(tag, attrs={}, parent){ const e=document.createElementNS(NS,tag); for(const k in attrs){ if(attrs[k]!=null) e.setAttribute(k,attrs[k]); } if(parent) parent.append(e); return e; }
function niceStep(range, target=8){ const raw=range/target; const p=Math.pow(10,Math.floor(Math.log10(raw))); const m=raw/p; return (m<1.5?1:m<3?2:m<7?5:10)*p; }
function fmtTick(v,step){ const dp=Math.min(4,(String(+step.toPrecision(6)).split(".")[1]||"").length); return (+v.toFixed(dp)).toString().replace("-","\u2212"); }
function piLabel(v){ const k=Math.round(v/(PI/2)); if(k===0) return "0"; const n=k%2===0?k/2:k; const d=k%2===0?1:2; const s=(n<0?"−":"")+(Math.abs(n)===1?"":Math.abs(n))+"π"+(d===2?"/2":""); return s; }

function graph(host, o={}){
  const W=o.w||560, H=o.h||340, pad=o.pad||{l:34,r:14,t:14,b:26};
  let [x0,x1]=o.x||[-5,5], [y0,y1]=o.y||[-5,5];
  const svg=sv("svg",{viewBox:`0 0 ${W} ${H}`,class:"fig",role:"img","aria-label":o.label||"Interactive graph"});
  if(o.c) svg.style.setProperty("--c",o.c);
  host.append(svg);
  /* keep labels readable on phones: when the figure is drawn much smaller than its viewBox, scale the text up */
  const fit=()=>{ const w=svg.getBoundingClientRect().width||host.clientWidth||W; const s=w/W; svg.style.setProperty("--ts", s<0.85?Math.min(1.7,0.85/s).toFixed(2):"1"); };
  fit(); if(window.ResizeObserver) new ResizeObserver(fit).observe(svg);
  const X=x=>pad.l+(x-x0)/(x1-x0)*(W-pad.l-pad.r);
  const Y=y=>H-pad.b-(y-y0)/(y1-y0)*(H-pad.t-pad.b);
  const iX=px=>x0+(px-pad.l)/(W-pad.l-pad.r)*(x1-x0);
  const iY=py=>y0+(H-pad.b-py)/(H-pad.t-pad.b)*(y1-y0);
  const gGrid=sv("g",{},svg), gAx=sv("g",{},svg), gBack=sv("g",{},svg), gMain=sv("g",{},svg), gFront=sv("g",{},svg), gTop=sv("g",{},svg);
  function axes(){
    gGrid.innerHTML=""; gAx.innerHTML="";
    const xs=o.piX? PI/2 : (o.xstep||niceStep(x1-x0, W>420?10:6)), ys=o.ystep||niceStep(y1-y0, 7);
    if(o.grid!==false){
      for(let v=Math.ceil(x0/xs)*xs; v<=x1+1e-9; v+=xs) sv("line",{x1:X(v),x2:X(v),y1:pad.t,y2:H-pad.b,class:"gr"},gGrid);
      for(let v=Math.ceil(y0/ys)*ys; v<=y1+1e-9; v+=ys) sv("line",{x1:pad.l,x2:W-pad.r,y1:Y(v),y2:Y(v),class:"gr"},gGrid);
    }
    const ax=Math.min(Math.max(0,y0),y1), ay=Math.min(Math.max(0,x0),x1);
    sv("line",{x1:pad.l,x2:W-pad.r,y1:Y(ax),y2:Y(ax),class:"ax"},gAx);
    sv("line",{x1:X(ay),x2:X(ay),y1:pad.t,y2:H-pad.b,class:"ax"},gAx);
    for(let v=Math.ceil(x0/xs)*xs; v<=x1+1e-9; v+=xs){ if(Math.abs(v)<1e-9 && o.noZero!==false) continue; const t=sv("text",{x:X(v),y:Math.min(H-4,Y(ax)+14),"text-anchor":"middle"},gAx); t.textContent=o.piX?piLabel(v):fmtTick(v,xs); sv("line",{x1:X(v),x2:X(v),y1:Y(ax)-3,y2:Y(ax)+3,class:"ax"},gAx); }
    for(let v=Math.ceil(y0/ys)*ys; v<=y1+1e-9; v+=ys){ if(Math.abs(v)<1e-9) continue; const t=sv("text",{x:Math.max(pad.l-4,X(ay)-6),y:Y(v)+4,"text-anchor":"end"},gAx); t.textContent=fmtTick(v,ys); sv("line",{x1:X(ay)-3,x2:X(ay)+3,y1:Y(v),y2:Y(v),class:"ax"},gAx); }
    if(o.xlabel){ const t=sv("text",{x:W-pad.r,y:Y(ax)-6,"text-anchor":"end"},gAx); t.textContent=o.xlabel; }
    if(o.ylabel){ const t=sv("text",{x:X(ay)+6,y:pad.t+10},gAx); t.textContent=o.ylabel; }
  }
  axes();
  function pathFor(f, a=x0, b=x1, n=o.samples||300){
    let d="", pen=false;
    const ylo=y0-(y1-y0)*2, yhi=y1+(y1-y0)*2;
    for(let i=0;i<=n;i++){
      const x=a+(b-a)*i/n; let y; try{ y=f(x); }catch(e){ y=NaN; }
      if(!isFinite(y)||y<ylo||y>yhi){ pen=false; continue; }
      // break across vertical asymptotes
      if(pen && i>0){ const xp=a+(b-a)*(i-1)/n; let yp; try{ yp=f(xp);}catch(e){} if(isFinite(yp) && Math.abs(y-yp)>(y1-y0)*1.5){ pen=false; } }
      d+=(pen?"L":"M")+X(x).toFixed(2)+" "+Y(y).toFixed(2)+" "; pen=true;
    }
    return d;
  }
  const api={svg,W,H,X,Y,iX,iY,pad,get x0(){return x0},get x1(){return x1},get y0(){return y0},get y1(){return y1},
    layer:{back:gBack,main:gMain,front:gFront,top:gTop},
    setView(nx,ny){ if(nx){[x0,x1]=nx;} if(ny){[y0,y1]=ny;} axes(); },
    fn(f, opt={}){ const p=sv("path",{d:pathFor(f,opt.from,opt.to),class:opt.cls||"cv"},opt.layer||gMain); if(opt.color) p.style.stroke=opt.color; if(opt.width) p.style.strokeWidth=opt.width; if(opt.dash) p.style.strokeDasharray=opt.dash;
      p.update=(g,a,b)=>p.setAttribute("d",pathFor(g||f,a!=null?a:opt.from,b!=null?b:opt.to)); return p; },
    param(fx,fy,t0,t1,opt={}){ let d=""; const n=opt.n||300; for(let i=0;i<=n;i++){ const t=t0+(t1-t0)*i/n; d+=(i?"L":"M")+X(fx(t)).toFixed(2)+" "+Y(fy(t)).toFixed(2)+" "; } const p=sv("path",{d,class:opt.cls||"cv"},opt.layer||gMain); return p; },
    line(xa,ya,xb,yb,opt={}){ const l=sv("line",{x1:X(xa),y1:Y(ya),x2:X(xb),y2:Y(yb),class:opt.cls||"ln"},opt.layer||gMain); if(opt.color) l.style.stroke=opt.color; if(opt.dash) l.style.strokeDasharray=opt.dash;
      l.set=(a,b,c,d)=>{ l.setAttribute("x1",X(a)); l.setAttribute("y1",Y(b)); l.setAttribute("x2",X(c)); l.setAttribute("y2",Y(d)); }; return l; },
    /* infinite line through (x,y) with slope m, clipped to the view */
    tangent(x,y,m,opt={}){ const l=api.line(x0,y+m*(x0-x),x1,y+m*(x1-x),{cls:opt.cls||"tan",layer:opt.layer||gFront}); l.at=(a,b,s)=>l.set(x0,b+s*(x0-a),x1,b+s*(x1-a)); return l; },
    vline(x,opt={}){ return api.line(x,y0,x,y1,{cls:opt.cls||"lt dash",layer:opt.layer||gBack}); },
    hline(y,opt={}){ return api.line(x0,y,x1,y,{cls:opt.cls||"lt dash",layer:opt.layer||gBack}); },
    area(f,a,b,opt={}){ // signed shading: above axis uses .shade, below uses .shade.neg
      const g=sv("g",{},opt.layer||gBack);
      g.update=(ff,aa,bb)=>{ g.innerHTML=""; if(aa>bb) [aa,bb]=[bb,aa]; const n=200; let pos="", neg="";
        for(const sgn of [1,-1]){ let d=`M${X(aa)} ${Y(0)} `; for(let i=0;i<=n;i++){ const x=aa+(bb-aa)*i/n; let y=ff(x); if(!isFinite(y)) y=0; const yy=sgn>0?Math.max(0,y):Math.min(0,y); d+=`L${X(x).toFixed(2)} ${Y(yy).toFixed(2)} `; } d+=`L${X(bb)} ${Y(0)} Z`; if(sgn>0) pos=d; else neg=d; }
        sv("path",{d:pos,class:"shade"},g); if(!opt.noNeg) sv("path",{d:neg,class:"shade neg"},g); };
      g.update(f,a,b); return g; },
    between(f,g2,a,b,opt={}){ const p=sv("path",{class:opt.cls||"shade"},opt.layer||gBack); p.update=(ff,gg,aa,bb)=>{ let d=""; const n=200; for(let i=0;i<=n;i++){ const x=aa+(bb-aa)*i/n; d+=(i?"L":"M")+X(x)+" "+Y(ff(x))+" "; } for(let i=n;i>=0;i--){ const x=aa+(bb-aa)*i/n; d+="L"+X(x)+" "+Y(gg(x))+" "; } p.setAttribute("d",d+"Z"); }; p.update(f,g2,a,b); return p; },
    rects(list,opt={}){ // [{x,w,h}] Riemann rectangles
      const g=sv("g",{},opt.layer||gBack);
      g.update=L=>{ g.innerHTML=""; L.forEach(r=>{ const top=Math.max(0,r.h), bot=Math.min(0,r.h); sv("rect",{x:X(r.x),y:Y(top),width:Math.max(0,X(r.x+r.w)-X(r.x)),height:Math.max(0,Y(bot)-Y(top)),class:r.h>=0?"shade":"shade neg",style:"stroke:var(--c,var(--accent));stroke-width:1;stroke-opacity:.7"},g); }); };
      g.update(list); return g; },
    dot(x,y,opt={}){ const c=sv("circle",{cx:X(x),cy:Y(y),r:opt.r||5,class:opt.filled?"dotf":"dot"},opt.layer||gTop); c.set=(a,b)=>{ c.setAttribute("cx",X(a)); c.setAttribute("cy",Y(b)); }; return c; },
    open(x,y,opt={}){ const c=sv("circle",{cx:X(x),cy:Y(y),r:opt.r||4.5,style:"fill:var(--paper);stroke:var(--fig-stroke);stroke-width:1.6"},opt.layer||gTop); c.set=(a,b)=>{ c.setAttribute("cx",X(a)); c.setAttribute("cy",Y(b)); }; return c; },
    closed(x,y,opt={}){ const c=sv("circle",{cx:X(x),cy:Y(y),r:opt.r||4.5,style:"fill:var(--fig-stroke)"},opt.layer||gTop); c.set=(a,b)=>{ c.setAttribute("cx",X(a)); c.setAttribute("cy",Y(b)); }; return c; },
    label(x,y,txt,opt={}){ const t=sv("text",{x:X(x)+(opt.dx||0),y:Y(y)+(opt.dy||0),"text-anchor":opt.anchor||"start",class:opt.cls||"lbl"},opt.layer||gTop); t.textContent=txt; t.set=(a,b,s)=>{ t.setAttribute("x",X(a)+(opt.dx||0)); t.setAttribute("y",Y(b)+(opt.dy||0)); if(s!=null) t.textContent=s; }; return t; },
    /* draggable point. opt.f: constrain to a curve; opt.axis:"x" constrain to the x-axis; opt.bounds:[a,b] */
    handle(x,y,opt={}){
      const g=sv("g",{class:"drag",tabindex:"0",role:"slider","aria-label":opt.label||"Drag point"},gTop);
      const halo=sv("circle",{r:14,style:"fill:var(--c,var(--accent));fill-opacity:.12"},g);
      const c=sv("circle",{r:opt.r||6.5,class:"dot",style:"stroke-width:2.4"},g);
      let cx=x, cy=y;
      const [ba,bb]=opt.bounds||[x0,x1];
      const place=()=>{ g.setAttribute("transform",`translate(${X(cx)},${Y(cy)})`); g.setAttribute("aria-valuenow",cx.toFixed(2)); };
      const setX=nx=>{ cx=Math.max(ba,Math.min(bb,nx)); if(opt.snap) cx=Math.round(cx/opt.snap)*opt.snap; if(opt.f) cy=opt.f(cx); else if(opt.axis==="x") cy=0; place(); opt.onMove&&opt.onMove(cx,cy); };
      const toSvg=e=>{ const pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const m=svg.getScreenCTM(); return m?pt.matrixTransform(m.inverse()):{x:0,y:0}; };
      let dragging=false;
      g.addEventListener("pointerdown",e=>{ dragging=true; g.setPointerCapture(e.pointerId); e.preventDefault(); });
      g.addEventListener("pointermove",e=>{ if(!dragging) return; const p=toSvg(e); if(opt.f||opt.axis==="x") setX(iX(p.x)); else { cx=Math.max(ba,Math.min(bb,iX(p.x))); cy=Math.max(y0,Math.min(y1,iY(p.y))); place(); opt.onMove&&opt.onMove(cx,cy); } });
      g.addEventListener("pointerup",()=>{ dragging=false; opt.onEnd&&opt.onEnd(cx,cy); });
      g.addEventListener("keydown",e=>{ const st=opt.step||(x1-x0)/100; if(e.key==="ArrowRight"||e.key==="ArrowUp"){ e.preventDefault(); setX(cx+st); } if(e.key==="ArrowLeft"||e.key==="ArrowDown"){ e.preventDefault(); setX(cx-st); } });
      // click on the plot moves the handle along x
      if(opt.clickToMove!==false && (opt.f||opt.axis==="x")) svg.addEventListener("pointerdown",e=>{ if(e.target.closest(".drag")) return; const p=toSvg(e); setX(iX(p.x)); });
      g.move=(nx)=>setX(nx); g.pos=()=>[cx,cy];
      if(opt.f) cy=opt.f(cx); place();
      return g;
    },
    clear(layer){ (layer||gMain).innerHTML=""; }
  };
  return api;
}

/* controls */
function slider(host,o){
  const id="s"+Math.random().toString(36).slice(2,8);
  const wrap=document.createElement("div");
  wrap.innerHTML=`<label for="${id}"><span>${o.label}</span><output>${o.fmt?o.fmt(o.value):o.value}</output></label><input id="${id}" type="range" min="${o.min}" max="${o.max}" step="${o.step||1}" value="${o.value}">`;
  const inp=wrap.querySelector("input"), out=wrap.querySelector("output");
  inp.addEventListener("input",()=>{ const v=+inp.value; out.innerHTML=o.fmt?o.fmt(v):v; o.oninput&&o.oninput(v); });
  host.append(wrap); inp.set=v=>{ inp.value=v; out.innerHTML=o.fmt?o.fmt(+v):v; }; inp.out=out; return inp;
}
function seg(host,o){ // segmented buttons: o.items [[value,label]], o.value, o.onchange
  const d=document.createElement("div"); d.className="seg"; d.setAttribute("role","group"); if(o.label) d.setAttribute("aria-label",o.label);
  o.items.forEach(([v,t])=>{ const b=document.createElement("button"); b.type="button"; b.innerHTML=t; b.setAttribute("aria-pressed",String(v===o.value)); b.onclick=()=>{ [...d.children].forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true"); o.onchange&&o.onchange(v); }; d.append(b); });
  host.append(d); return d;
}
function readout(host){ const d=document.createElement("div"); d.className="readout"; host.append(d); return d; }
function controls(host){ const d=document.createElement("div"); d.className="ctl"; host.append(d); return d; }

window.PLOT={graph,slider,seg,readout,controls,niceStep,PI};
})();
