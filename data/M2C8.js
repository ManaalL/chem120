/* Chapter 2.8 (Fri Oct 9): Electron spin and the full picture. Course notes Module 2, pp. 32-35 (sections 2.9 and 2.10).
   The beam-splitting experiment, s = 1/2 and m_s = ±1/2, the spins of other particles, the summary of the quantum model of H,
   the checklist, and the table of nodes against energy on p. 34. */
(function(){
const M=C120, K=C120.chem.CONST;
const RH=K.RH;
const L_LET=["s","p","d","f","g"];  /* letters on p. 18 */
const lab=(n,l)=>`${n}${L_LET[l]}`;
const J=(v,sf=3)=>M.qty(v,sf,"J",{sci:true});
const half=ms=>ms>0?"+\\tfrac12":"-\\tfrac12";
const q4TeX=(n,l,ml,ms)=>`(${n},\\ ${l},\\ ${ml},\\ ${typeof ms==="number"&&Math.abs(Math.abs(ms)-0.5)<1e-9?half(ms):ms})`;
const mlTeX=l=>{ const a=[]; for(let m=-l;m<=l;m++) a.push(m>0?`+${m}`:`${m}`); return a.join(",\\ "); };
const NS="http://www.w3.org/2000/svg";
function sv(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.append(e); return e; }
/* why a set (n, l, m_l, m_s) is not allowed, or true. ms is a number. */
function why4(n,l,ml,ms){ if(!Number.isInteger(n)||n<1) return "n"; if(l<0||l>n-1) return "l"; if(Math.abs(ml)>l) return "ml"; if(Math.abs(Math.abs(ms)-0.5)>1e-9) return "ms"; return true; }
const WHY={n:"$n$ must be a positive whole number",l:"$l$ must be from 0 to $n-1$",ml:"$m_l$ must be from $-l$ to $+l$",ms:"$m_s$ can only be $+\\tfrac12$ or $-\\tfrac12$"};
const msTeX=ms=>Math.abs(Math.abs(ms)-0.5)<1e-9?half(ms):ms===1.5?"+\\tfrac32":ms===-1.5?"-\\tfrac32":String(ms>0?`+${ms}`:ms);

M.chapter({
  id:"M2C8", module:"m2", n:8, num:"2.8", date:"2026-10-09", added:"2026-10-26", quiz:"PC3",
  title:"Electron spin and the full picture", pages:"32-35", sections:["2.9","2.10"],
  summary:"A beam of hydrogen atoms splits in two in a magnetic field, so the electron needs a fourth quantum number: it behaves as if it spins, with $s = \\tfrac12$ and $m_s = +\\tfrac12$ or $-\\tfrac12$. The full state of the electron in hydrogen is $(n, l, m_l, m_s)$, and its energy, $E_n = -R_H/n^2$, rises with the number of nodes.",
  flags:[],
  formulas:[
    {id:"M2C8.f.s", name:"Spin quantum number", tex:"s = \\tfrac12", kind:"constant", note:"The same for every electron: electrons are \"spin-½\" particles.", ref:"p. 32"},
    {id:"M2C8.f.ms", name:"Spin magnetic quantum number", tex:"m_s = +\\tfrac12\\ (\\text{spin up})\\quad\\text{or}\\quad m_s = -\\tfrac12\\ (\\text{spin down})", kind:"rule", ref:"p. 32",
      blank:{tex:"m_s = \\boxed{\\,?\\,}\\ \\text{or}\\ -\\tfrac12", accept:["+1/2","1/2","+½","½","0.5","+0.5"]}},
    {id:"M2C8.f.four", name:"The full state of the electron", tex:"(n,\\ l,\\ m_l,\\ m_s)", kind:"rule", note:"Schrödinger's equation gives $n$, $l$, $m_l$; spin was found by experiment and explained later by Dirac's relativistic theory.", ref:"pp. 32-33"},
    {id:"M2C8.f.states", name:"Counting spin states", tex:"2 \\text{ per orbital},\\quad 2(2l+1) \\text{ per subshell},\\quad 2n^2 \\text{ for each } n", note:"Each orbital has two spin states. These counts follow from the rules on pp. 18 and 32; the notes don't print them.", ref:"p. 32",
      blank:{tex:"\\#\\,\\text{sets } (n, l, m_l, m_s) \\text{ with a given } n = \\boxed{\\,?\\,}", accept:["2n^2","2n²","2n2","2*n^2","2 n^2"]}},
    {id:"M2C8.f.nodes-energy", name:"Nodes and energy in hydrogen", tex:"\\text{total nodes} = n - 1,\\qquad E_n = -\\frac{R_H}{n^2}", kind:"rule", note:"More nodes, higher energy (the table on p. 34).", ref:"p. 34"},
    {id:"M2C8.f.ground", name:"Lowest-energy orbital", tex:"1s:\\ \\text{spherical},\\ r_{mp} = a_0 = 52.9\\ \\mathrm{pm}", kind:"rule", ref:"p. 33"},
    {id:"M2C8.f.spins", name:"Spins of some particles", tex:"e^-:\\ \\tfrac12 \\quad \\text{photon}: 1 \\quad {}^{12}\\mathrm{C}:\\ 0 \\quad {}^{13}\\mathrm{C}:\\ \\tfrac12 \\quad {}^{127}\\mathrm{I}:\\ \\tfrac52", kind:"constant", note:"For the C and I nuclei.", ref:"p. 32"}
  ],
  glossary:[
    {id:"M2C8.t.spin", term:"Electron spin", def:"The electron behaves as if it spins about its own axis, which makes it a tiny magnet. It has only two spin states.", ref:"p. 32"},
    {id:"M2C8.t.s", term:"Spin quantum number, $s$", def:"$s = \\tfrac12$ for every electron.", ref:"p. 32"},
    {id:"M2C8.t.ms", term:"Spin magnetic quantum number, $m_s$", def:"$+\\tfrac12$ (\"spin up\") or $-\\tfrac12$ (\"spin down\"). It tells the two spin states apart.", ref:"p. 32"},
    {id:"M2C8.t.beam", term:"Beam-splitting experiment", def:"A beam of H atoms sent between the poles of a magnet splits into two beams, not one smear. Usually called the Stern-Gerlach experiment (a name the notes don't use).", ref:"p. 32"},
    {id:"M2C8.t.spin-half", term:"Spin-½ particle", def:"A particle with spin ½, such as an electron or a $^{13}$C nucleus. A photon has spin 1; a $^{12}$C nucleus has spin 0.", ref:"p. 32"}
  ],
  figures:{
    sg:{title:"Splitting a beam of hydrogen atoms", cap:"The experiment on p. 32 (usually called the Stern-Gerlach experiment; the notes don't name it). Hydrogen atoms fly between the poles of a magnet whose field is stronger near one pole. Each atom acts like a tiny magnet, and only two orientations occur, so the beam splits into two spots: $m_s = +\\tfrac12$ and $m_s = -\\tfrac12$.", ref:"p. 32",
      model:{type:"sterngerlach", params:{}},
      predict:{q:"A beam of hydrogen atoms in their lowest-energy state passes through the magnet. What reaches the screen?", opts:[["Two separate spots",true,"Two spin states, so two beams: one pulled each way."],["One spot, exactly where the beam was aimed",false,"Then the atoms would not be magnets at all; but they are deflected."],["One long smear, from top to bottom",false,"That is what you'd expect if the tiny magnets could point any way. They can't."],["Three spots",false,"There are only two spin states, $m_s = \\pm\\tfrac12$."]], keep:true, check:"Send the beam through and look at the screen. Count the spots."}},
    card:{title:"Everything about one orbital", cap:"Pick $n$ and $l$ and see the whole picture from this module in one place: the allowed $m_l$ (p. 18), the nodes (pp. 22, 34), the energy (p. 18) and the two spin states of each orbital (p. 32). Each box is one orbital; its two halves are the two values of $m_s$. (Filling the boxes with electrons comes in Module 3.)", ref:"pp. 18-34",
      build(host,{PLOT,M}){
        let n=3,l=2; const ctl=PLOT.controls(host);
        PLOT.slider(ctl,{label:"n",min:1,max:5,value:n,oninput:v=>{ n=v; if(l>n-1){ l=n-1; sl.set(l); } draw(); }});
        const sl=PLOT.slider(ctl,{label:"l",min:0,max:3,value:l,fmt:v=>`${v} (${L_LET[v]})`,oninput:v=>{ l=Math.min(v,n-1); if(v!==l) sl.set(l); draw(); }});
        const W=600,H=96; const svg=sv("svg",{viewBox:`0 0 ${W} ${H}`,class:"fig",role:"img","aria-label":"Orbital boxes with spin states"}); host.append(svg);
        const out=PLOT.readout(host);
        function draw(){
          svg.innerHTML=""; const k=2*l+1, bw=64, gap=10, x0=(W-(k*bw+(k-1)*gap))/2;
          for(let i=0;i<k;i++){ const ml=i-l, x=x0+i*(bw+gap);
            sv("rect",{x,y:20,width:bw,height:40,rx:4,style:"fill:var(--fig-soft);stroke:var(--fig-stroke);stroke-width:1.3"},svg);
            sv("line",{x1:x+bw/2,x2:x+bw/2,y1:20,y2:60,style:"stroke:var(--fig-stroke);stroke-width:1;stroke-dasharray:3 2"},svg);
            const a=sv("text",{x:x+bw/4,y:45,"text-anchor":"middle",style:"font-size:12px;fill:var(--ink2)"},svg); a.textContent="+½";
            const b=sv("text",{x:x+3*bw/4,y:45,"text-anchor":"middle",style:"font-size:12px;fill:var(--ink2)"},svg); b.textContent="−½";
            const t=sv("text",{x:x+bw/2,y:78,"text-anchor":"middle",class:"lblc"},svg); t.textContent=`mₗ = ${ml>0?"+":""}${ml}`; }
          const tl=sv("text",{x:W/2,y:13,"text-anchor":"middle",class:"lbl"},svg); tl.textContent=`${lab(n,l)} subshell: ${k} orbital${k>1?"s":""}, ${2*k} spin states`;
          out.innerHTML=M.rich(`<b>$${lab(n,l)}$</b>: $n = ${n}$ (size), $l = ${l}$ (shape), $m_l = ${mlTeX(l)}$ (orientation), $m_s = \\pm\\tfrac12$ (spin).<br>Nodes: $n-l-1 = ${n-l-1}$ radial + $l = ${l}$ angular = $n - 1 = ${n-1}$ in total.<br>Energy: $E_{${n}} = -R_H/${n}^2 = ${J(-RH/(n*n),4)}$, the same for every orbital with $n = ${n}$. All of $n = ${n}$: $${n*n}$ orbitals, $2n^2 = ${2*n*n}$ spin states.`);
        }
        draw();
      }},
    review:{title:"Review: shapes, nodes and radial plots", cap:"All the orbital pictures from this module in one model: boundary surfaces (p. 23), nodes (p. 22) and the linked radial plot (pp. 25-27). Warm solid lobes are +, cool hatched lobes are −.", ref:"pp. 21-27",
      model:{type:"orbital", params:{orbital:"3dz2", mode:"surface", picker:"list", choices:["1s","2s","2pz","3s","3pz","3dz2","3dxy","4s","4pz","4dxz"], nodes:true, radial:"rdf"}},
      predict:{q:"Which has more nodes in total: a 3d orbital or a 4s orbital?", opts:[["4s",true,"Total nodes $= n - 1$: 3 for 4s (all radial), 2 for 3d (both angular)."],["3d",false,"3d has $l = 2$ angular nodes but no radial ones: 2 in total."],["They have the same number",false,"Total nodes depend only on $n$: $n - 1$."]], keep:true, check:"Turn on Nodes. Pick 3dz2 and count the cones; pick 4s and count the spheres."}}
  },
  gens:[
    {id:"M2C8.g.qset4", title:"Write all four quantum numbers", skill:"$(n, l, m_l, m_s)$ for an electron", ref:"pp. 18-32",
      gen(R,d){
        if(d===1){ const n=R.int(2,5), l=R.int(0,Math.min(3,n-1));
          return {prompt:`Write one allowed set of all four quantum numbers $(n, l, m_l, m_s)$ for an electron in a $${lab(n,l)}$ orbital.`,
            answer:{type:"qset",needMs:true,test:q=>q.n!==n?`The ${n} in ${lab(n,l)} is n.`:q.l!==l?`${L_LET[l]} means l = ${l}.`:true,sample:`(${n}, ${l}, 0, +1/2)`},
            hint:"$n$ from the number, $l$ from the letter, any $m_l$ from $-l$ to $+l$, and $m_s = +\\tfrac12$ or $-\\tfrac12$.",
            steps:[`$n = ${n}$, $l = ${l}$.`,`$m_l$: any of $${mlTeX(l)}$.`,"$m_s$: $+\\tfrac12$ or $-\\tfrac12$.",`For example $${q4TeX(n,l,0,0.5)}$.`], answerTeX:`$(${n},\\ ${l},\\ m_l,\\ \\pm\\tfrac12)$ with $m_l = ${mlTeX(l)}$`}; }
        if(d===2){ const n=R.int(3,5), l=R.int(1,Math.min(3,n-1)), ml=R.int(-l,l), up=R.pick([true,false]);
          return {prompt:`Write the set $(n, l, m_l, m_s)$ for a spin-${up?"up":"down"} electron in a $${lab(n,l)}$ orbital with $m_l = ${ml}$.`,
            answer:{type:"qset",answer:[n,l,ml,up?0.5:-0.5],needMs:true}, hint:"Spin up is $m_s = +\\tfrac12$; spin down is $-\\tfrac12$.",
            steps:[`$n = ${n}$, $l = ${l}$, $m_l = ${ml}$.`,`Spin ${up?"up":"down"}: $m_s = ${half(up?1:-1)}$.`,`$${q4TeX(n,l,ml,up?0.5:-0.5)}$`], answerTeX:`$${q4TeX(n,l,ml,up?0.5:-0.5)}$`}; }
        const n=R.int(2,5), up=R.pick([true,false]);
        return {prompt:`Write the set $(n, l, m_l, m_s)$ for a spin-${up?"up":"down"} electron with $n = ${n}$ and the largest possible values of $l$ and $m_l$.`,
          answer:{type:"qset",answer:[n,n-1,n-1,up?0.5:-0.5],needMs:true}, hint:"$l$ is at most $n-1$; $m_l$ is at most $l$.",
          steps:[`Largest $l = n - 1 = ${n-1}$ (a${n-1===3?"n":""} ${L_LET[n-1]} orbital).`,`Largest $m_l = +l = ${n-1}$.`,`Spin ${up?"up":"down"}: $m_s = ${half(up?1:-1)}$.`,`$${q4TeX(n,n-1,n-1,up?0.5:-0.5)}$`], answerTeX:`$${q4TeX(n,n-1,n-1,up?0.5:-0.5)}$`};
      }},
    {id:"M2C8.g.allowed4", title:"Is this set of four quantum numbers allowed?", skill:"Check $n$, $l$, $m_l$ and $m_s$", ref:"pp. 18-32",
      gen(R,d){
        const make=ok=>{ let n=R.int(1,5), l=R.int(0,n-1), ml=R.int(-l,l), ms=R.pick([0.5,-0.5]); if(!ok){ const k=R.pick(["l","ml","ms","ms"]); if(k==="l") l=n+R.int(0,1); else if(k==="ml") ml=(l+1)*R.sign(); else ms=R.pick([0,1,-1,1.5,-1.5]); if(k==="l") ml=R.int(-Math.min(l,1),Math.min(l,1)); } return [n,l,ml,ms]; };
        const show=s=>`(${s[0]},\\ ${s[1]},\\ ${s[2]},\\ ${msTeX(s[3])})`;
        if(d===3){ let sets, guard=0; do{ sets=[]; const keys=new Set(); while(sets.length<5){ const s=make(R()<0.45); const k=s.join(","); if(!keys.has(k)){ keys.add(k); sets.push(s); } } guard++; } while(guard<60 && (sets.every(s=>why4(...s)===true)||sets.every(s=>why4(...s)!==true)));
          const corr=sets.map((s,i)=>why4(...s)===true?i:-1).filter(i=>i>=0);
          return {prompt:"Which of these sets $(n, l, m_l, m_s)$ are allowed for an electron? Select all that apply.", answer:{type:"multi",options:sets.map(s=>`$${show(s)}$`),correct:corr},
            hint:"Check in order: $n \\ge 1$; $0 \\le l \\le n-1$; $-l \\le m_l \\le +l$; $m_s = \\pm\\tfrac12$.",
            steps:sets.map(s=>{ const w=why4(...s); return `$${show(s)}$: ${w===true?"allowed.":`not allowed: ${WHY[w]}.`}`; }), answerTeX:corr.map(i=>`$${show(sets[i])}$`).join(", ")}; }
        const ok=R()<0.45, s=make(ok), w=why4(...s);
        if(d===1) return {prompt:`Is the set $(n, l, m_l, m_s) = ${show(s)}$ allowed for an electron?`, answer:{type:"mc",options:["Yes","No"],correct:w===true?0:1,keep:true},
          hint:"$l$ from 0 to $n-1$, $m_l$ from $-l$ to $+l$, $m_s$ only $\\pm\\tfrac12$.", steps:[w===true?"Every number is in its allowed range. Allowed.":`Not allowed: ${WHY[w]}.`], answerTeX:w===true?"Yes":"No"};
        const opts=["Allowed","Not allowed: $l$ is too large for this $n$","Not allowed: $m_l$ is outside $-l$ to $+l$","Not allowed: $m_s$ must be $+\\tfrac12$ or $-\\tfrac12$"];
        const c=w===true?0:w==="l"?1:w==="ml"?2:3;
        return {prompt:`Is the set $(n, l, m_l, m_s) = ${show(s)}$ allowed? If not, what is wrong?`, answer:{type:"mc",options:opts,correct:c,keep:true},
          hint:"Check each number against the one before it.", steps:[w===true?"All four are in range. Allowed.":`${WHY[w]}.`], answerTeX:opts[c]};
      }},
    {id:"M2C8.g.count-states", title:"Count the sets of quantum numbers", skill:"2 spin states per orbital", ref:"pp. 18-32",
      gen(R,d){
        if(d===1){ const n=R.int(2,5), l=R.int(0,Math.min(3,n-1)), k=2*(2*l+1);
          return {prompt:`How many different sets of quantum numbers $(n, l, m_l, m_s)$ are there for the $${lab(n,l)}$ subshell?`, answer:{type:"int",value:k},
            hint:"Count the orbitals ($2l + 1$), then two values of $m_s$ for each.", steps:[`$l = ${l}$: $2l + 1 = ${2*l+1}$ orbitals ($m_l = ${mlTeX(l)}$).`,`Each has $m_s = \\pm\\tfrac12$: $2 \\times ${2*l+1} = ${k}$ sets.`], answerTeX:`${k}`}; }
        if(d===2){ const n=R.int(2,6);
          return {prompt:`How many different sets of quantum numbers $(n, l, m_l, m_s)$ have $n = ${n}$?`, answer:{type:"int",value:2*n*n},
            hint:"There are $n^2$ orbitals with this $n$, and each has two spin states.", steps:[`Orbitals: ${Array.from({length:n},(_,l)=>2*l+1).join(" + ")} $= ${n*n} = n^2$.`,`Two spin states each: $2n^2 = ${2*n*n}$.`], answerTeX:`${2*n*n}`}; }
        const n=R.int(3,6); const kind=R.pick(["ms","ml"]);
        if(kind==="ms"){ const up=R.pick([true,false]);
          return {prompt:`How many different sets of quantum numbers $(n, l, m_l, m_s)$ have $n = ${n}$ and $m_s = ${half(up?1:-1)}$?`, answer:{type:"int",value:n*n},
            hint:"Fixing $m_s$ leaves exactly one set per orbital.", steps:[`$n = ${n}$ has $n^2 = ${n*n}$ orbitals.`,`With $m_s$ fixed, each orbital gives one set: ${n*n}.`], answerTeX:`${n*n}`}; }
        const ml=R.int(-(n-1),n-1); const ls=n-Math.abs(ml);
        return {prompt:`How many different sets of quantum numbers $(n, l, m_l, m_s)$ have $n = ${n}$ and $m_l = ${ml}$?`, answer:{type:"int",value:2*ls},
          hint:"Which values of $l$ allow this $m_l$? Then two spin states each.", steps:[`$m_l = ${ml}$ needs $l \\ge ${Math.abs(ml)}$; with $l \\le ${n-1}$ that is ${ls} value${ls>1?"s":""} of $l$.`,`One orbital each, two spin states each: $2 \\times ${ls} = ${2*ls}$.`], answerTeX:`${2*ls}`};
      }},
    {id:"M2C8.g.review", title:"The full picture of one orbital", skill:"Quantum numbers, nodes and energy together", ref:"pp. 18-34",
      gen(R,d){
        const n=R.int(2,d===1?4:6), l=R.int(0,Math.min(3,n-1));
        const parts=[{label:"$l$",answer:{type:"int",value:l}},{label:"Total number of nodes",answer:{type:"int",value:n-1}}];
        const steps=[`$${lab(n,l)}$: $n = ${n}$, $l = ${l}$.`,`Nodes: $${n-l-1}$ radial + $${l}$ angular $= n - 1 = ${n-1}$.`];
        if(d>=2){ parts.push({label:"Orbitals in this subshell",answer:{type:"int",value:2*l+1}}); steps.push(`$2l + 1 = ${2*l+1}$ orbital${l?"s":""}.`); }
        if(d===3){ parts.push({label:"Energy of the electron (4 significant figures)",answer:{type:"num",value:-RH/(n*n),unit:"J",sf:4}}); steps.push(`$E_{${n}} = -R_H/${n}^2 = ${J(-RH/(n*n),4)}$ (only $n$ matters in hydrogen).`); }
        return {prompt:`An electron in a hydrogen atom is in a $${lab(n,l)}$ orbital. Give ${d===1?"$l$ and the total number of nodes":d===2?"$l$, the total number of nodes, and the number of orbitals in the subshell":"$l$, the total number of nodes, the number of orbitals in the subshell, and the energy of the electron"}.`,
          parts, hint:"Letter → $l$. Total nodes $= n - 1$. Orbitals $= 2l + 1$. $E_n = -R_H/n^2$.", steps,
          answerTeX:`$l = ${l}$; ${n-1} nodes${d>=2?`; ${2*l+1} orbitals`:""}${d===3?`; $${J(-RH/(n*n),4)}$`:""}`, verify:d===3?{values:[null,null,null,-2.179e-18/(n*n)]}:undefined};
      }},
    {id:"M2C8.g.which-qn", title:"Which quantum number?", skill:"What $n$, $l$, $m_l$, $s$ and $m_s$ each describe", ref:"pp. 18-32",
      gen(R,d){
        const Q=["$n$","$l$","$m_l$","$s$","$m_s$"];
        const pool1=[["the size of the orbital",0],["the shape of the orbital",1],["the orientation of the orbital",2],["which of the two spin states the electron is in",4]];
        const pool2=[["It is $\\tfrac12$ for every electron.",3],["Its two possible values explain why a beam of H atoms splits into two in a magnetic field.",4],["In hydrogen, it alone decides the energy.",0],["It equals the number of angular nodes of the orbital.",1],["It can be any whole number from $-l$ to $+l$.",2],["Its smallest allowed value is 1.",0],["It can only be $+\\tfrac12$ or $-\\tfrac12$.",4],["It does not come out of Schrödinger's equation, and it never changes from one electron to another.",3]];
        const [t,c]=R.pick(d===1?pool1:d===2?pool2.slice(0,5):pool2);
        return {prompt:d===1?`Which quantum number describes ${t}?`:`Which quantum number does this describe? <i>${t}</i>`, answer:{type:"mc",options:Q,correct:c,keep:true},
          hint:"$n$ size, $l$ shape, $m_l$ orientation (p. 18); $s = \\tfrac12$ always and $m_s = \\pm\\tfrac12$ (p. 32).",
          steps:[`${Q[c]}: ${["principal quantum number (size; energy in H)","orbital angular momentum quantum number (shape; number of angular nodes)","magnetic quantum number (orientation; $-l$ to $+l$)","spin quantum number, $\\tfrac12$ for every electron","spin magnetic quantum number, $\\pm\\tfrac12$"][c]}.`], answerTeX:Q[c]};
      }}
  ],
  exam:[
    {id:"M2C8.q1", ref:"p. 32", q:"A beam of hydrogen atoms passes between the poles of a magnet and splits into two beams. What does this show?", opts:[
      ["The electron has two possible spin states, so each atom behaves like a tiny magnet pointing one of two ways.",true,"$m_s = +\\tfrac12$ or $-\\tfrac12$."],["Hydrogen atoms have two electrons.",false,"Hydrogen has one electron."],["The electron is in one of two orbitals, 1s or 2s.",false,"The orbitals don't explain the split; spin does."],["The magnet ionizes half of the atoms.",false,"No ionization happens."],["Schrödinger's three quantum numbers describe the atom completely.",false,"It shows the opposite: a fourth is needed."]]},
    {id:"M2C8.q2", ref:"pp. 18-32", q:"Which set $(n, l, m_l, m_s)$ is allowed for an electron?", opts:[
      ["$(2, 1, 0, +\\tfrac12)$",true,"All four values are in range: a 2p electron."],["$(2, 1, 0, 0)$",false,"$m_s$ must be $\\pm\\tfrac12$."],["$(3, 3, 0, -\\tfrac12)$",false,"$l$ can be at most $n - 1 = 2$."],["$(1, 0, 1, +\\tfrac12)$",false,"$m_l$ can't exceed $l = 0$."],["$(2, 0, 0, +1)$",false,"$m_s$ must be $\\pm\\tfrac12$."]]},
    {id:"M2C8.q3", ref:"pp. 18-32", q:"How many different sets of quantum numbers $(n, l, m_l, m_s)$ have $n = 3$?", opts:[
      ["18",true,"9 orbitals × 2 spin states $= 2n^2$."],["9",false,"That counts orbitals, without spin."],["6",false,"That is the 3p subshell with spin."],["32",false,"That is $n = 4$."],["3",false,"That is the number of subshells."]]},
    {id:"M2C8.q4", ref:"p. 33", q:"Which statement about the quantum model of the hydrogen atom is <b>false</b>?", opts:[
      ["The energy of a state depends on both $n$ and $l$.",true,"False for hydrogen: $E_n = -R_H/n^2$ depends only on $n$."],["The lowest-energy orbital is the spherical 1s orbital.",false,"True (summary point 2)."],["In the 1s orbital, the most probable distance from the nucleus is 52.9 pm.",false,"True: $a_0$."],["Each state is described by a unique set $n$, $l$, $m_l$, $m_s$.",false,"True (summary point 3)."],["The electron occupies an orbital that has a definite size, shape and orientation.",false,"True (summary point 1)."]]},
    {id:"M2C8.q5", ref:"p. 32", q:"According to the notes, what is the spin of a photon?", opts:[
      ["1",true,"Photons are spin-1 particles."],["0",false,"That is the $^{12}$C nucleus."],["½",false,"That is the electron (and the $^{13}$C nucleus)."],["5/2",false,"That is the $^{127}$I nucleus."],["Photons have no spin",false,"They have spin 1."]]},
    {id:"M2C8.q6", ref:"p. 34", q:"The table on p. 34 compares hydrogen orbitals. Which pattern does it show?", opts:[
      ["The energy rises with the total number of nodes, $n - 1$.",true,"1s (0 nodes) < 2s, 2p (1) < 3s, 3p, 3d (2)."],["Orbitals with more radial nodes always have lower energy.",false,"3s has 2 radial nodes and the same energy as 3d, which has none."],["Only angular nodes affect the energy.",false,"2s and 2p have different kinds of node but the same energy."],["Every orbital has the same number of nodes.",false,"The total grows with $n$."],["The energy falls as $n$ increases.",false,"$E_n = -R_H/n^2$ rises toward 0 as $n$ increases."]]},
    {id:"M2C8.q7", ref:"p. 32", q:"Which quantum number does <b>not</b> come out of Schrödinger's equation as given in the notes?", opts:[
      ["$m_s$",true,"Spin was found by experiment and explained later (Dirac, 1928)."],["$n$",false,"It comes out of the equation."],["$l$",false,"It comes out of the equation."],["$m_l$",false,"It comes out of the equation."],["All four come out of it",false,"Schrödinger's picture is incomplete (p. 32)."]]}
  ],
  steps:[
    {type:"read", title:"Three quantum numbers are not the whole story", ref:"p. 32", body:"<p>Schrödinger's equation describes the electron with three quantum numbers, $n$, $l$ and $m_l$. Even so, the notes point out that this picture is incomplete (p. 32). One more quantum number was found by experiment first, and explained later by Dirac's version of quantum mechanics (1928), which includes relativity.</p><p>The experiment is simple: send a beam of hydrogen atoms between the poles of a magnet and see where they land.</p>"},
    {type:"explore", title:"Send hydrogen atoms through a magnet", fig:"sg", ref:"p. 32", body:"<p>Watch where the atoms hit the screen. If each atom's magnet could point in any direction, you'd see a smear. Instead there are exactly two spots.</p>"},
    {type:"read", title:"The electron behaves like a tiny spinning magnet", ref:"p. 32", body:"<p>Two spots means each H atom is a tiny magnet, and it can only line up one of two ways: pulled toward the north pole or pushed away from it. The explanation is that the electron acts as if it <b>spins</b> on its own axis, and a spinning charge makes a magnetic field (that last point is standard physics, not from the notes).</p><div class=\"box def\"><b class=\"t\">Spin (p. 32)</b>$s = \\tfrac12$ for every electron.<br>$m_s = +\\tfrac12$ (\"spin up\") or $m_s = -\\tfrac12$ (\"spin down\").</div><p>It's like a compass needle that can only ever point straight up or straight down, never sideways. Electrons are \"spin-½\" particles; other particles differ: a photon has spin 1, a $^{12}$C nucleus spin 0, a $^{13}$C nucleus spin ½, a $^{127}$I nucleus spin 5/2.</p><p>Watch the difference: $s$ is the same for every electron, while $m_s$ is the one that tells the two states apart.</p>"},
    {type:"mcq", title:"s or m_s?", q:"An electron is described as \"spin down\". Which is correct?", opts:[["$s = \\tfrac12$ and $m_s = -\\tfrac12$",true,"$s$ is always $\\tfrac12$; the sign is in $m_s$."],["$s = -\\tfrac12$",false,"$s$ never changes. It is $m_s$ that is $-\\tfrac12$."],["$m_s = 0$",false,"$m_s$ can only be $\\pm\\tfrac12$."]], after:"Möbius sometimes asks for $s$ and $m_s$ separately. $s$ is always 1/2."},
    {type:"example", title:"List every state in a 2p subshell", ref:"pp. 18-32", ex:{q:"List every set of quantum numbers $(n, l, m_l, m_s)$ for the 2p subshell. How many are there?", steps:[
      {t:"$n = 2$, $l = 1$",why:"2p: the number is $n$, p means $l = 1$."},
      {t:"$m_l = -1, 0, +1$",why:"From $-l$ to $+l$: three orbitals."},
      {t:"Each orbital has $m_s = +\\tfrac12$ or $-\\tfrac12$: $(2, 1, -1, \\pm\\tfrac12)$, $(2, 1, 0, \\pm\\tfrac12)$, $(2, 1, +1, \\pm\\tfrac12)$",why:"Spin doubles the count."},
      {t:"$3 \\times 2 = 6$ sets",why:"In general $2(2l + 1)$ for a subshell."}], ans:"Six sets: $m_l = -1, 0, +1$, each with $m_s = \\pm\\tfrac12$."}},
    {type:"try", title:"Write all four quantum numbers", gen:"M2C8.g.qset4"},
    {type:"try", title:"Allowed or not?", gen:"M2C8.g.allowed4"},
    {type:"read", title:"The quantum model of hydrogen in four lines", ref:"p. 33", body:"<div class=\"box def\"><b class=\"t\">Summary (p. 33)</b><ol style=\"margin:0\"><li>The electron is described by an <b>orbital</b>, which has a definite size, shape and orientation.</li><li>1s is the lowest-energy orbital. It is spherical, and the electron's most probable distance from the nucleus in it is $a_0 = 52.9$ pm.</li><li>Each state of the electron has its own set of four quantum numbers: $n$, $l$, $m_l$ and $m_s$.</li><li>The energy depends only on $n$: $E_n = -R_H/n^2$.</li></ol></div><p>Chemists describe atoms and molecules one electron at a time using orbitals, and most of what we know about orbitals starts with hydrogen. That is why the module spends so long on it.</p>"},
    {type:"explore", title:"One orbital, every number", fig:"card", ref:"pp. 18-34", body:"<p>Pick any $n$ and $l$. Each box is one orbital ($m_l$); each half of a box is one spin state ($m_s$). The readout pulls together the nodes and the energy. Check that $n = 3$ gives 9 orbitals and 18 spin states.</p>"},
    {type:"explore", title:"Review the orbital pictures", fig:"review", ref:"pp. 21-27", body:"<p>Use this as a checklist (pp. 33-34): can you name each orbital from its shape, put the right signs on its lobes, count its radial and angular nodes, and sketch its $R$, $R^2$ and $r^2R^2$ plots? Turn the plot type and the nodes on and off to check yourself.</p>"},
    {type:"read", title:"In hydrogen, more nodes means higher energy", ref:"p. 34", body:"<p>The table on p. 34 lines up the hydrogen orbitals:</p><table class=\"tbl\"><tr><th>Orbital</th><th>Energy</th><th>Radial ($n-l-1$)</th><th>Angular ($l$)</th><th>Total ($n-1$)</th></tr><tr><td>1s</td><td>$E_1$</td><td>0</td><td>0</td><td>0</td></tr><tr><td>2s, 2p</td><td>$E_2$</td><td>1, 0</td><td>0, 1</td><td>1</td></tr><tr><td>3s, 3p, 3d</td><td>$E_3$</td><td>2, 1, 0</td><td>0, 1, 2</td><td>2</td></tr></table><p>The energy goes up with the total number of nodes, just as a guitar string's note rises with the number of still points. In hydrogen it doesn't matter whether the nodes are radial or angular.</p>"},
    {type:"try", title:"Count the sets", gen:"M2C8.g.count-states"},
    {type:"firstline", title:"Find the first mistake", q:"A student writes the quantum numbers for a spin-down electron in a 3d orbital:", lines:["3d means $n = 3$ and $l = 2$.","Choose $m_l = +1$, one of $-2$ to $+2$.","Spin down means $s = -\\tfrac12$.","So the set is $(3, 2, +1, -\\tfrac12)$."], wrong:2, why:"$s$ is always $\\tfrac12$. Spin down is $m_s = -\\tfrac12$. The final set happens to be right, but the reasoning mixes up $s$ and $m_s$."},
    {type:"try", title:"Which quantum number?", gen:"M2C8.g.which-qn"},
    {type:"try", title:"Put it all together", gen:"M2C8.g.review"},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
