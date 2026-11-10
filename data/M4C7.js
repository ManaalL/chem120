/* Chapter 4.7 (Fri Nov 6): Line structures for organic molecules. Course notes Module 4, pp. 21-22 (section 4.8).
   Reading line-angle structures: carbons at ends and vertices, hidden H on carbon, lone pairs from formal charges, molecular formulas (Examples 4-10 to 4-12).
   The 2D drawings are made here from atom coordinates; the 3D models are the same molecules from assets/js/3d/molecules.mjs. */
(function(){
const M=C120;
const VAL={H:1,C:4,N:5,O:6,S:6,F:7,Cl:7,Br:7};
const SUB="₀₁₂₃₄₅₆₇₈₉";
const sub=n=>n>1?String(n).split("").map(d=>SUB[+d]).join(""):"";
/* molecules: atoms [el, x, y, {h, fc}] (h only for N, O, S; carbon H are worked out), bonds [i, j, order]. Coordinates: x right, y up, bond length 1. */
const S3=0.866;
const LS={
  /* the eight from the notes (pp. 21-22) */
  butenethiol:{name:"(E)-but-2-ene-1-thiol",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",3*S3,.5],["S",4*S3,0,{h:1}]],bonds:[[0,1,1],[1,2,2],[2,3,1],[3,4,1]]},
  butane:{name:"butane",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",3*S3,.5]],bonds:[[0,1,1],[1,2,1],[2,3,1]]},
  isobutanol:{name:"2-methylpropan-1-ol (isobutanol)",atoms:[["C",0,0],["C",S3,.5],["C",S3,1.5],["C",2*S3,0],["O",3*S3,.5,{h:1}]],bonds:[[0,1,1],[1,2,1],[1,3,1],[3,4,1]]},
  methoxyethane:{name:"methoxyethane",atoms:[["C",0,0],["O",S3,.5],["C",2*S3,0],["C",3*S3,.5]],bonds:[[0,1,1],[1,2,1],[2,3,1]]},
  butanone:{name:"butanone",atoms:[["C",0,0],["C",S3,.5],["O",S3,1.5],["C",2*S3,0],["C",3*S3,.5]],bonds:[[0,1,1],[1,2,2],[1,3,1],[3,4,1]]},
  but3enamide:{name:"but-3-enamide",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",3*S3,.5],["O",3*S3,1.5],["N",4*S3,0,{h:2}]],bonds:[[0,1,2],[1,2,1],[2,3,1],[3,4,2],[3,5,1]]},
  methylcyclopentene:{name:"1-methylcyclopentene",atoms:[["C",0,0],["C",.31,.95],["C",1.31,.95],["C",1.62,0],["C",.81,-.59],["C",-.95,-.31]],bonds:[[0,1,2],[1,2,1],[2,3,1],[3,4,1],[4,0,1],[0,5,1]]},
  aniline:{name:"aniline",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",2*S3,-1],["C",S3,-1.5],["C",0,-1],["N",-S3,.5,{h:2}]],bonds:[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[0,6,1]]},
  /* practice set (not in the notes) */
  pentane:{name:"pentane",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",3*S3,.5],["C",4*S3,0]],bonds:[[0,1,1],[1,2,1],[2,3,1],[3,4,1]]},
  methylbutane:{name:"2-methylbutane",atoms:[["C",0,0],["C",S3,.5],["C",S3,1.5],["C",2*S3,0],["C",3*S3,.5]],bonds:[[0,1,1],[1,2,1],[1,3,1],[3,4,1]]},
  propan2ol:{name:"propan-2-ol",atoms:[["C",0,0],["C",S3,.5],["O",S3,1.5,{h:1}],["C",2*S3,0]],bonds:[[0,1,1],[1,2,1],[1,3,1]]},
  butan1ol:{name:"butan-1-ol",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",3*S3,.5],["O",4*S3,0,{h:1}]],bonds:[[0,1,1],[1,2,1],[2,3,1],[3,4,1]]},
  propanal:{name:"propanal",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["O",3*S3,.5]],bonds:[[0,1,1],[1,2,1],[2,3,2]]},
  propanone:{name:"propanone",atoms:[["C",0,0],["C",S3,.5],["O",S3,1.5],["C",2*S3,0]],bonds:[[0,1,1],[1,2,2],[1,3,1]]},
  propanoic:{name:"propanoic acid",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["O",2*S3,-1],["O",3*S3,.5,{h:1}]],bonds:[[0,1,1],[1,2,1],[2,3,2],[2,4,1]]},
  methylacetate:{name:"methyl ethanoate",atoms:[["C",0,0],["C",S3,.5],["O",S3,1.5],["O",2*S3,0],["C",3*S3,.5]],bonds:[[0,1,1],[1,2,2],[1,3,1],[3,4,1]]},
  but1ene:{name:"but-1-ene",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",3*S3,.5]],bonds:[[0,1,2],[1,2,1],[2,3,1]]},
  pent2yne:{name:"pent-2-yne",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,1],["C",3*S3,1.5],["C",4*S3,1]],bonds:[[0,1,1],[1,2,3],[2,3,1],[3,4,1]]},
  cyclohexane:{name:"cyclohexane",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",2*S3,-1],["C",S3,-1.5],["C",0,-1]],bonds:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1]]},
  cyclohexanol:{name:"cyclohexanol",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",2*S3,-1],["C",S3,-1.5],["C",0,-1],["O",S3,1.5,{h:1}]],bonds:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[1,6,1]]},
  toluene:{name:"methylbenzene (toluene)",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",2*S3,-1],["C",S3,-1.5],["C",0,-1],["C",S3,1.5]],bonds:[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[1,6,1]]},
  phenol:{name:"phenol",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",2*S3,-1],["C",S3,-1.5],["C",0,-1],["O",S3,1.5,{h:1}]],bonds:[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[1,6,1]]},
  propanenitrile:{name:"propanenitrile",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["N",3*S3,-.5]],bonds:[[0,1,1],[1,2,1],[2,3,3]]},
  propylamine:{name:"propan-1-amine",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["N",3*S3,.5,{h:2}]],bonds:[[0,1,1],[1,2,1],[2,3,1]]},
  cyclopentanone:{name:"cyclopentanone",atoms:[["C",0,0],["C",.81,.59],["C",1.62,0],["C",1.31,-.95],["C",.31,-.95],["O",.81,1.59]],bonds:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,0,1],[1,5,2]]},
  chloropropane:{name:"2-chloropropane",atoms:[["C",0,0],["C",S3,.5],["Cl",S3,1.5],["C",2*S3,0]],bonds:[[0,1,1],[1,2,1],[1,3,1]]},
  ethylmethylamine:{name:"N-methylethanamine",atoms:[["C",0,0],["N",S3,.5,{h:1}],["C",2*S3,0],["C",3*S3,.5]],bonds:[[0,1,1],[1,2,1],[2,3,1]]},
  butenal:{name:"but-2-enal",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["C",3*S3,.5],["O",4*S3,0]],bonds:[[0,1,1],[1,2,2],[2,3,1],[3,4,2]]},
  /* charged (hard) */
  acetate:{name:"ethanoate ion",atoms:[["C",0,0],["C",S3,.5],["O",S3,1.5],["O",2*S3,0,{fc:-1}]],bonds:[[0,1,1],[1,2,2],[1,3,1]]},
  ethoxide:{name:"ethoxide ion",atoms:[["C",0,0],["C",S3,.5],["O",2*S3,0,{fc:-1}]],bonds:[[0,1,1],[1,2,1]]},
  ethylammonium:{name:"ethylammonium ion",atoms:[["C",0,0],["C",S3,.5],["N",2*S3,0,{h:3,fc:1}]],bonds:[[0,1,1],[1,2,1]]},
  propanoate:{name:"propanoate ion",atoms:[["C",0,0],["C",S3,.5],["C",2*S3,0],["O",2*S3,-1],["O",3*S3,.5,{fc:-1}]],bonds:[[0,1,1],[1,2,1],[2,3,2],[2,4,1]]}
};
/* analysis: hidden H on each C, lone pairs on each heteroatom, formula */
function info(key){
  const S=LS[key]; const A=S.atoms.map(([el,x,y,p={}])=>({el,x,y,h:p.h||0,fc:p.fc||0}));
  const nb=A.map(()=>[]); S.bonds.forEach(([i,j,k])=>{ nb[i].push([j,k]); nb[j].push([i,k]); });
  const ord=A.map((a,i)=>nb[i].reduce((t,[,k])=>t+k,0));
  A.forEach((a,i)=>{ if(a.el==="C"){ a.h=4-ord[i]-Math.abs(a.fc); a.lp=a.fc<0?1:0; } else { a.lp=(VAL[a.el]-a.fc-ord[i]-a.h)/2; if(!Number.isInteger(a.lp)||a.lp<0) throw new Error("bad lone pairs in "+key); } });
  const cnt={}; A.forEach(a=>{ cnt[a.el]=(cnt[a.el]||0)+1; if(a.h) cnt.H=(cnt.H||0)+a.h; });
  const q=A.reduce((t,a)=>t+a.fc,0);
  const order=["C","H",...Object.keys(cnt).filter(k=>k!=="C"&&k!=="H").sort()];
  const f=order.filter(k=>cnt[k]).map(k=>k+(cnt[k]>1?cnt[k]:"")).join("")+(q?(q<0?"^"+(q<-1?-q:"")+"-":"^"+(q>1?q:"")+"+"):"");
  const lp=A.reduce((t,a)=>t+(a.el==="C"?0:a.lp),0);
  return {S,A,nb,ord,cnt,q,f,lp};
}
/* SVG line-angle drawing. opt: {showH, showLP, mark:index, scale} */
function lineSVG(key,opt={}){
  const I=info(key), A=I.A, nb=I.nb; const U=opt.scale||44, pad=26;
  const xs=A.map(a=>a.x), ys=A.map(a=>a.y); const minx=Math.min(...xs), maxx=Math.max(...xs), miny=Math.min(...ys), maxy=Math.max(...ys);
  const W=(maxx-minx)*U+2*pad+36, H=(maxy-miny)*U+2*pad+12;
  const X=x=>pad+18+(x-minx)*U, Y=y=>pad+6+(maxy-y)*U;
  const labelled=i=>A[i].el!=="C"||opt.showH;
  const hRight=i=>{ const n=nb[i]; if(!n.length) return true; const mx=n.reduce((t,[j])=>t+A[j].x,0)/n.length; return mx<=A[i].x+1e-6; };
  const st="stroke:var(--fig-stroke);stroke-width:2.2;stroke-linecap:round";
  let g=`<svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" class="fig" role="img" aria-label="Line structure of ${I.S.name}" style="max-width:${Math.round(W*1.25)}px">`;
  /* bonds */
  I.S.bonds.forEach(([i,j,k])=>{
    let x1=X(A[i].x), y1=Y(A[i].y), x2=X(A[j].x), y2=Y(A[j].y); const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, px=-uy, py=ux;
    const s1=labelled(i)?11:0, s2=labelled(j)?11:0; x1+=ux*s1; y1+=uy*s1; x2-=ux*s2; y2-=uy*s2;
    const line=(o,sh)=>`<line x1="${(x1+px*o+ux*sh).toFixed(1)}" y1="${(y1+py*o+uy*sh).toFixed(1)}" x2="${(x2+px*o-ux*sh).toFixed(1)}" y2="${(y2+py*o-uy*sh).toFixed(1)}" style="${st}"/>`;
    if(k===1) g+=line(0,0);
    else if(k===3) g+=line(0,0)+line(5,3)+line(-5,3);
    else { const term=nb[i].length===1||nb[j].length===1;
      if(term && !(nb[i].length>1&&nb[j].length>1)){ const others=nb[i].length===1?nb[j]:nb[i]; if(others.length===3){ g+=line(3,0)+line(-3,0); } else { /* inner side: toward the other neighbours */ let side=0; const c=nb[i].length===1?j:i; nb[c].forEach(([m])=>{ if(m!==i&&m!==j) side+=(X(A[m].x)-X(A[c].x))*px+(Y(A[m].y)-Y(A[c].y))*py; }); g+=line(0,0)+line(side>=0?6:-6,4); } }
      else { let side=0; [i,j].forEach(c=>nb[c].forEach(([m])=>{ if(m!==i&&m!==j) side+=(X(A[m].x)-X(A[c].x))*px+(Y(A[m].y)-Y(A[c].y))*py; })); g+=line(0,0)+line(side>=0?6:-6,7); } }
  });
  /* labels */
  A.forEach((a,i)=>{ if(!labelled(i)) return; const x=X(a.x), y=Y(a.y);
    const hs=a.h?"H"+sub(a.h):""; const ch=a.fc?(a.fc>0?"⁺":"⁻"):""; const right=hRight(i);
    const txt=a.el==="C"?(opt.showH?"C"+hs:"C"):(right?a.el+hs:hs+a.el)+ch;
    const w=txt.length*7.6+4;
    g+=`<rect x="${(x-(right||a.el==="C"?9:w-9)).toFixed(1)}" y="${y-10}" width="${w.toFixed(1)}" height="20" rx="4" style="fill:var(--paper)"/>`;
    g+=`<text x="${(right||a.el==="C"?x-6:x+6).toFixed(1)}" y="${y+5}" text-anchor="${right||a.el==="C"?"start":"end"}" class="lbl" style="font-size:${a.el==="C"?12:14}px${a.el==="C"?";fill:var(--ink2)":""}">${txt}</text>`;
    if(opt.showLP && a.el!=="C" && a.lp){ const occ=nb[i].map(([j])=>Math.atan2(Y(A[j].y)-y,X(A[j].x)-x)); if(a.h) occ.push(right?0:Math.PI);
      const cand=[-90,90,right?180:0,-45,-135,45,135,right?0:180].map(d=>d*Math.PI/180); const chosen=[];
      for(let n=0;n<a.lp;n++){ let best=null,bd=-1; cand.forEach(c=>{ if(chosen.includes(c)) return; const dmin=Math.min(...occ.concat(chosen).map(o=>{ let d=Math.abs(c-o)%(2*Math.PI); return d>Math.PI?2*Math.PI-d:d; })); if(dmin>bd+1e-6){ bd=dmin; best=c; } }); chosen.push(best); }
      chosen.forEach(c=>{ const r=Math.abs(Math.cos(c))>0.5?(a.h&&((Math.cos(c)>0)===right)?22:15):14; const cx=x+(right||!a.h?0:0)+Math.cos(c)*r+(Math.cos(c)>0.5&&right&&a.h?6*a.h:0), cy=y+Math.sin(c)*r; const qx=-Math.sin(c)*3.6, qy=Math.cos(c)*3.6;
        g+=`<circle cx="${(cx+qx).toFixed(1)}" cy="${(cy+qy).toFixed(1)}" r="2.2" style="fill:var(--c,var(--accent))"/><circle cx="${(cx-qx).toFixed(1)}" cy="${(cy-qy).toFixed(1)}" r="2.2" style="fill:var(--c,var(--accent))"/>`; }); }
  });
  if(opt.mark!=null){ const a=A[opt.mark]; const x=X(a.x), y=Y(a.y); g+=`<circle cx="${x}" cy="${y}" r="6" style="fill:none;stroke:var(--c,var(--accent));stroke-width:2"/><text x="${x+9}" y="${y-8}" class="lblc" style="font-size:14px;font-weight:600">a</text>`; }
  return g+`</svg>`;
}
const PRACTICE={1:["pentane","methylbutane","propan2ol","butan1ol","propanal","propanone","but1ene","cyclohexane","propylamine","chloropropane"],
                2:["propanoic","methylacetate","pent2yne","cyclohexanol","toluene","phenol","propanenitrile","cyclopentanone","ethylmethylamine","butenal"],
                3:["acetate","ethoxide","ethylammonium","propanoate","butenal","propanoic","cyclopentanone","propanenitrile"]};
M.chapter({
  id:"M4C7", module:"m4", n:7, num:"4.7", date:"2026-11-06", added:"2026-10-26", quiz:"PC6",
  title:"Line structures for organic molecules", pages:"21-22", sections:["4.8"],
  summary:"In a line structure every end and every corner is a carbon, hydrogens on carbon are left out, and lone pairs may be left out too. A neutral carbon always has 4 bonds, so the missing H atoms can be counted; formal charges tell you the lone pairs.",
  flags:[],
  formulas:[
    {id:"M4C7.f.carbons", name:"Where the carbons are", tex:"\\text{every line end and every corner (vertex) is a C atom}", kind:"rule", ref:"p. 21",
      note:"Chains are drawn as zig-zags. There is free rotation around single bonds, so a chain can be drawn in more than one way."},
    {id:"M4C7.f.hidden-h", name:"Hidden H atoms on carbon", tex:"\\#\\,\\text{H on a neutral C} = 4 - (\\text{bonds drawn to it})", ref:"p. 21",
      note:"Count a double bond as 2 and a triple bond as 3. H on N, O or S is always written.",
      blank:{tex:"\\#\\,\\text{H on a neutral C} = \\boxed{\\,?\\,} - (\\text{bonds drawn})", accept:["4","four"]}},
    {id:"M4C7.f.lone-pairs", name:"Lone pairs that are not drawn", tex:"\\text{neutral O, S: 2 LP};\\quad \\text{neutral N: 1 LP};\\quad \\text{halogen: 3 LP};\\quad \\ce{O-}\\text{: 3 LP};\\quad \\ce{N+}\\text{: 0 LP}", kind:"rule", ref:"p. 21",
      note:"The notes say to work out lone pairs from the formal charges (p. 21); these are the ideal fragments from pp. 6-7."}
  ],
  glossary:[
    {id:"M4C7.t.line-structure", term:"Line-angle structure", def:"A drawing of a carbon-based molecule where C atoms sit at the ends and corners of lines, H on carbon is left out, and only other atoms are written.", ref:"p. 21"},
    {id:"M4C7.t.zigzag", term:"Zig-zag chain", def:"The way chains of carbon atoms are drawn in line structures, roughly matching the real angles at each carbon.", ref:"p. 21"},
    {id:"M4C7.t.free-rotation", term:"Free rotation", def:"Groups joined by a single bond can turn around that bond, so one molecule can be drawn in several shapes. Double bonds don't rotate.", ref:"p. 21"},
    {id:"M4C7.t.molecular-formula", term:"Molecular formula", def:"The number of each kind of atom in one molecule, for example $\\ce{C4H8S}$.", ref:"p. 21"}
  ],
  figures:{
    line:{title:"Reading a line structure", cap:"The eight molecules from pp. 21-22 as line structures. Show the hidden H atoms and the lone pairs; the formula and the counts update below. Drawn for this site from the structures in the notes.", ref:"pp. 21-22",
      build(host,{PLOT,M}){
        const KEYS=["butenethiol","butane","isobutanol","methoxyethane","butanone","but3enamide","methylcyclopentene","aniline"];
        let k=0, showH=false, showLP=false;
        const svgHost=document.createElement("div"); svgHost.style.display="flex"; svgHost.style.justifyContent="center"; svgHost.style.minHeight="190px"; host.append(svgHost);
        const ctl=PLOT.controls(host);
        const sel=document.createElement("select"); sel.setAttribute("aria-label","Molecule"); KEYS.forEach((key,i)=>{ const o=document.createElement("option"); o.value=i; o.textContent=LS[key].name; sel.append(o); }); sel.onchange=()=>{ k=+sel.value; draw(); };
        const lab=document.createElement("label"); lab.className="row small"; lab.innerHTML="<b>Molecule</b>"; lab.append(sel); ctl.append(lab);
        const row=document.createElement("div"); row.className="row"; ctl.append(row);
        const chip=(t,f)=>{ const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t; b.setAttribute("aria-pressed","false"); b.onclick=()=>{ const v=f(); b.setAttribute("aria-pressed",String(v)); draw(); }; row.append(b); };
        chip("Show hidden H",()=>showH=!showH); chip("Show lone pairs",()=>showLP=!showLP);
        const out=PLOT.readout(host);
        function draw(){ const key=KEYS[k]; svgHost.innerHTML=lineSVG(key,{showH,showLP,scale:52}); const I=info(key);
          const cH=I.A.filter(a=>a.el==="C").reduce((t,a)=>t+a.h,0);
          out.innerHTML=M.rich(`${I.S.name}: $\\ce{${I.f}}$ · ${I.cnt.C} C (ends and corners) · ${cH} H on carbon (hidden) ${I.cnt.H-cH?`+ ${I.cnt.H-cH} H written on N, O or S`:""} · ${I.lp} lone pair${I.lp===1?"":"s"}`); }
        draw();
      }},
    mol3d:{title:"The same molecules in 3D", cap:"The line structures from pp. 21-22 as 3D models, with every H atom shown. Tap two bonds on one atom to measure the angle. Angles come from VSEPR (standard values, not from the notes).", ref:"pp. 21-22",
      model:{type:"molecule", params:{molecule:"butanone", choices:["butenethiol","butane","isobutanol","methoxyethane","butanone","but3enamide","methylcyclopentene","aniline"], polarity:false, fcToggle:false}},
      predict:{q:"In butanone, the carbon bonded to O has a C=O double bond and two C–C bonds. What is the ideal angle between its two C–C bonds?", opts:[["109.5°",false,"That is for 4 groups. A double bond counts as one group, so this carbon has 3."],["120°",true,"3 groups, no lone pairs: trigonal planar (standard VSEPR angle, not from the notes)."],["180°",false,"Linear needs 2 groups, like the C in a C≡N."],["90°",false,"No VSEPR arrangement with 3 groups gives 90°."]], check:"Tap the two C–C bonds on that carbon to measure the angle. Then measure an angle at the CH₃ carbon."}}
  },
  gens:[
    {id:"M4C7.g.formula", title:"Molecular formula from a line structure", skill:"Count C, hidden H and the rest", ref:"pp. 21-22",
      gen(R,d){
        const key=R.pick(PRACTICE[d]); const I=info(key); const cH=I.A.filter(a=>a.el==="C").reduce((t,a)=>t+a.h,0);
        const het=Object.keys(I.cnt).filter(e=>e!=="C"&&e!=="H");
        return {prompt:`What is the molecular formula of this molecule?${I.q?" Include the charge.":""}<div style="margin:8px 0">${lineSVG(key)}</div>`,
          answer:{type:"formula",answer:I.f},
          hint:"Every end and corner is a C. Each neutral C has 4 bonds: the bonds you can't see go to H. Add the H atoms written on N, O or S.",
          steps:[`Carbons (ends and corners): ${I.cnt.C}.`,`Hidden H: ${I.A.map((a,i)=>a.el==="C"?a.h:null).filter(x=>x!==null).join(" + ")} $= ${cH}$ (4 minus the bonds drawn at each C).`,...(I.cnt.H-cH?[`H written on heteroatoms: ${I.cnt.H-cH}. Total H: ${I.cnt.H}.`]:[]),...(het.length?[`Other atoms: ${het.map(e=>`${I.cnt[e]} $\\ce{${e}}$`).join(", ")}.`]:[]),`Formula: $\\ce{${I.f}}$ (${I.S.name}).`],
          answerTeX:`$\\ce{${I.f}}$`};
      }},
    {id:"M4C7.g.hidden-h", title:"How many H on this carbon?", skill:"Neutral C makes 4 bonds", ref:"p. 21",
      gen(R,d){
        const key=R.pick(PRACTICE[d===3?2:d]); const I=info(key);
        const cs=I.A.map((a,i)=>a.el==="C"?i:-1).filter(i=>i>=0); const i=R.pick(cs); const a=I.A[i];
        const bonds=I.nb[i].map(([j,k])=>k===1?"single":k===2?"double":"triple");
        return {prompt:`How many hydrogen atoms are bonded to the carbon marked a?<div style="margin:8px 0">${lineSVG(key,{mark:i})}</div>`,
          answer:{type:"int",value:a.h},
          hint:"Count the bonds drawn at that corner (double = 2, triple = 3). A neutral carbon needs 4 in all; the rest are bonds to H.",
          steps:[`Bonds drawn at a: ${bonds.join(", ")} $= ${I.ord[i]}$.`,`H atoms: $4 - ${I.ord[i]} = ${a.h}$.`],
          answerTeX:`${a.h}`, verify:{value:4-I.ord[i]}};
      }},
    {id:"M4C7.g.lone-pairs", title:"Count the lone pairs", skill:"Lone pairs from formal charges", ref:"pp. 21-22",
      gen(R,d){
        const pool=PRACTICE[d].filter(k=>info(k).lp>0); const key=R.pick(pool); const I=info(key);
        const het=I.A.filter(a=>a.el!=="C");
        return {prompt:`How many lone pairs are there in total in this ${I.q?"ion":"molecule"}? None are drawn.<div style="margin:8px 0">${lineSVG(key)}</div>`,
          answer:{type:"int",value:I.lp},
          hint:"Carbon (neutral) has no lone pairs. Neutral O and S have 2, neutral N has 1, halogens have 3. O with −1 has 3; N with +1 has 0.",
          steps:[...het.map(a=>`$\\ce{${a.el}}$${a.fc?` (formal charge ${a.fc>0?"+":"−"}1)`:""}: ${a.lp} lone pair${a.lp===1?"":"s"}.`),`Total: ${I.lp}.`],
          answerTeX:`${I.lp}`};
      }},
    {id:"M4C7.g.angle-at", title:"Bond angle at an atom", skill:"VSEPR inside a line structure", ref:"pp. 18, 22",
      gen(R,d){
        const key=R.pick(PRACTICE[d]); const I=info(key);
        const cand=I.A.map((a,i)=>(I.nb[i].length+I.A[i].h>=2)?i:-1).filter(i=>i>=0); const i=R.pick(cand); const a=I.A[i];
        const groups=I.nb[i].length+a.h+a.lp; const OPT=["109.5°","120°","180°"]; const ans=groups===4?0:groups===3?1:2;
        const nm=a.el==="C"?"carbon":a.el==="O"?"oxygen":a.el==="N"?"nitrogen":a.el;
        return {prompt:`What is the ideal bond angle around the ${nm} atom marked a? (Standard VSEPR angles; the notes print none.)<div style="margin:8px 0">${lineSVG(key,{mark:i})}</div>`,
          answer:{type:"mc",options:OPT,correct:ans,keep:true},
          hint:"Count groups on that atom: atoms bonded to it (including hidden H) plus lone pairs. A double or triple bond counts once. 4 groups 109.5°, 3 groups 120°, 2 groups 180°.",
          steps:[`Atoms bonded to a: ${I.nb[i].length} drawn${a.h?` + ${a.h} H`:""}; lone pairs: ${a.lp}.`,`Groups: ${groups}, so ${["","","linear","trigonal planar","tetrahedral"][groups]}: ${OPT[ans]}.`],
          answerTeX:OPT[ans]};
      }}
  ],
  exam:[
    {id:"M4C7.q1", ref:"p. 21", q:"In a line structure, what does a corner where two lines meet (with no letter) stand for?", opts:[["A carbon atom",true,"Every end and every corner is a C (p. 21)."],["A hydrogen atom",false,"H on carbon is not drawn at all."],["A lone pair",false,"Lone pairs are dots, if they are drawn."],["Nothing: it is just where the line bends",false,"Each bend marks a C atom."],["An oxygen atom",false,"O is always written."]]},
    {id:"M4C7.q2", ref:"p. 21", q:"A neutral carbon in a line structure has one double bond and one single bond drawn to it. How many H atoms does it carry?", opts:[["0",false,"That would need 4 bonds drawn; here there are 3."],["1",true,"$4 - (2 + 1) = 1$."],["2",false,"The double bond counts as 2."],["3",false,"Only true for an end carbon with one single bond."],["4",false,"Bonds to other atoms use up some of the four."]]},
    {id:"M4C7.q3", ref:"p. 21", q:"What is the molecular formula of (E)-but-2-ene-1-thiol, $\\ce{CH3CH=CHCH2SH}$?", opts:[["$\\ce{C4H8S}$",true,"4 C; H: 3 + 1 + 1 + 2 + 1 = 8; one S."],["$\\ce{C4H10S}$",false,"That is the formula without the C=C."],["$\\ce{C4H6S}$",false,"Count the CH₃ and CH₂ hydrogens again."],["$\\ce{C4H7S}$",false,"Don't forget the H on S."],["$\\ce{C5H8S}$",false,"There are 4 carbons."]]},
    {id:"M4C7.q4", ref:"pp. 21-22", q:"Lone pairs are not drawn in a line structure of an alcohol, R–OH. How many lone pairs are on the O?", opts:[["0",false,"Neutral O has 2 lone pairs."],["1",false,"That is neutral N."],["2",true,"O with 2 bonds and formal charge 0 has 2 lone pairs (p. 6)."],["3",false,"That is $\\ce{O-}$ with one bond."],["4",false,"O has 8 electrons: 2 bonds + 2 lone pairs."]]},
    {id:"M4C7.q5", ref:"p. 21", multi:true, q:"Which statements about line structures are correct? Select all that apply.", opts:[["H atoms on N, O and S are written in.",true,"Only H on carbon is hidden."],["Every neutral carbon has 4 bonds, so missing bonds go to H.",true,"p. 21, rule 3."],["Lone pairs are always drawn.",false,"They may or may not be shown (p. 21)."],["Chains are drawn in a zig-zag.",true,"p. 21, rule 2."],["Single bonds are locked and can't rotate.",false,"There is free rotation around single bonds."]]},
    {id:"M4C7.q6", ref:"p. 22", q:"Aniline is a benzene ring with an $\\ce{NH2}$ group. What is its molecular formula?", opts:[["$\\ce{C6H7N}$",true,"5 ring CH + 2 H on N = 7 H."],["$\\ce{C6H6N}$",false,"The ring C bonded to N has no H, but N has 2."],["$\\ce{C6H5N}$",false,"Add the two H written on N."],["$\\ce{C6H8N}$",false,"Only 5 of the ring carbons carry an H."],["$\\ce{C7H7N}$",false,"There are 6 carbons."]]}
  ],
  steps:[
    {type:"read", title:"Drawing every atom gets slow", ref:"p. 21", body:"<p>A full Lewis structure of even a small organic molecule has a lot of H atoms. Chemists use <b>line-angle structures</b> instead, and you need to read all the information they hide (p. 21).</p><p>A line structure is like a city map that leaves out the houses: you know where they are from the streets. The notes' example is (E)-but-2-ene-1-thiol, part of skunk spray: $\\ce{CH3-CH=CH-CH2-SH}$ in full, but just a zig-zag with a double bond and an SH at the end as a line structure.</p>"},
    {type:"read", title:"Four rules for reading a line structure", ref:"p. 21", body:"<ol><li><b>Carbons are not written.</b> Every end of a line and every corner is a C atom.</li><li><b>Chains are zig-zags.</b> There is free rotation around single bonds, so the same chain can be drawn bent different ways.</li><li><b>H on carbon is not written.</b> A neutral C has 4 bonds; whatever is missing goes to H. Look out for double and triple bonds and formal charges.</li><li><b>Lone pairs may or may not be shown.</b> Work them out from the formal charges: the ideal fragments from p. 6.</li></ol><p>Atoms other than C (O, N, S, halogens) are always written, along with any H on them.</p>"},
    {type:"explore", title:"Reveal the hidden atoms", fig:"line", ref:"pp. 21-22", body:"<p>Start with the skunk-spray thiol, then turn on <b>Show hidden H</b>: each corner gets its CH₃, CH₂ or CH. Turn on <b>Show lone pairs</b>: 2 on S. Step through the other seven molecules from Examples 4-11 and 4-12 and check the formula below each.</p>"},
    {type:"try", title:"H atoms on one carbon", gen:"M4C7.g.hidden-h"},
    {type:"example", title:"Formula and lone pairs of propanoic acid", ref:"pp. 21-22 (like Example 4-11)", ex:{q:"Propanoic acid is a three-carbon zig-zag whose last carbon has a =O and an –OH. Give its molecular formula and its total number of lone pairs.", steps:[{t:"Carbons: 3. The chain has a free end, a corner, and a third carbon where the C=O and C–OH lines meet.",why:"Every end and corner is a C."},{t:"Hidden H: end C has 1 bond, so 3 H; middle C has 2 bonds, so 2 H; the last C has $1 + 2 + 1 = 4$ bonds, so 0 H.",why:"A double bond counts 2."},{t:"Written H: 1 (on O). Total H $= 3 + 2 + 1 = 6$.",why:"H on O is always shown."},{t:"Formula: $\\ce{C3H6O2}$.",why:"3 C, 6 H, 2 O."},{t:"Lone pairs: each O is neutral with 2 bonds' worth (C=O, or C–O and O–H), so 2 each: 4 in total.",why:"Ideal neutral O fragment (p. 6)."}], ans:"$\\ce{C3H6O2}$, 4 lone pairs."}},
    {type:"try", title:"Formula from a line structure", gen:"M4C7.g.formula"},
    {type:"explore", title:"The same molecules in 3D", fig:"mol3d", ref:"pp. 21-22", body:"<p>Every H that the line structure hides is here. Compare the zig-zag on paper with the real chain: the corners are about 109.5° at carbons with four single bonds and 120° at carbons with a double bond (standard VSEPR angles, not from the notes).</p><p>Pick (E)-but-2-ene-1-thiol: the CH₃ and CH₂SH sit on opposite sides of the C=C, as the zig-zag shows.</p>"},
    {type:"read", title:"From a full structure to a line structure", ref:"p. 22", body:"<p>Example 4-12 goes the other way: start from a structure with every atom drawn and make the line drawing.</p><ol><li>Draw the carbon chain as a zig-zag, one corner per C. Use the VSEPR angle at each atom: a C≡C or C≡N part is drawn straight (180°).</li><li>Erase the C labels and every H on carbon.</li><li>Write in O, N, S, halogens and their H atoms.</li><li>Add lone pairs if the question asks: 2 on neutral O and S, 1 on neutral N.</li></ol>"},
    {type:"example", title:"Draw propanal as a line structure", ref:"p. 22 (like Example 4-12)", ex:{q:"Propanal is $\\ce{CH3-CH2-CH=O}$ (the last C also has one H). Describe its line structure, with correct angles and lone pairs.", steps:[{t:"Three carbons: a zig-zag with three points (end, corner, end of the C chain).",why:"Each C is an end or a corner."},{t:"The last carbon has 3 groups (CH₂, H, =O): trigonal planar, so the C=O leaves at about 120° from the chain.",why:"Standard VSEPR angle, not from the notes."},{t:"Draw the C=O as a double line ending in a written O. Leave out all H on C, including the one on the C=O carbon.",why:"That H is hidden: $4 - (1 + 2) = 1$."},{t:"Add 2 lone pairs on O.",why:"Neutral O with a double bond."}], ans:"A two-segment zig-zag ending in a double bond to O, with 2 lone pairs on O; formula $\\ce{C3H6O}$."}},
    {type:"try", title:"Angle at an atom", gen:"M4C7.g.angle-at"},
    {type:"try", title:"Count the lone pairs", gen:"M4C7.g.lone-pairs"},
    {type:"mcq", title:"Charged atoms in line structures", q:"In a line structure of the ethanoate (acetate) ion, one O is written with a $-1$ charge and a single bond to C. How many lone pairs does that O have?", opts:[["1",false,"That is the $\\ce{O+}$ fragment (3 bonds, 1 lone pair)."],["2",false,"That is neutral O with 2 bonds."],["3",true,"$\\ce{O-}$: 1 bond and 3 lone pairs (p. 7)."],["4",false,"O would then have 10 electrons."]], after:"This is why the notes tie lone pairs to formal charges (p. 21): the charge tells you which fragment it is."},
    {type:"firstline", title:"Find the first mistake", q:"A student finds the formula of cyclohexanol (a six-carbon ring with one –OH):", lines:["The ring has 6 corners, so 6 C atoms.","The carbon bearing the OH has 3 bonds drawn, so 1 H.","The other five ring carbons each have 2 bonds drawn, so 2 H each: 10 H.","Total H: $1 + 10 = 11$, so the formula is $\\ce{C6H11O}$."], wrong:3, why:"The H on the O is written in the drawing and must be counted: $1 + 10 + 1 = 12$. The formula is $\\ce{C6H12O}$."},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
