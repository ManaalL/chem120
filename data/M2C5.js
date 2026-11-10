/* Chapter 2.5 (Wed Sep 30): Wavefunctions and quantum numbers. Course notes Module 2, pp. 16-21 (section 2.7).
   The "new" quantum theory, the Schrödinger equation (shown, not used), Ψ and |Ψ|², orbitals, n, l, m_l and their allowed values,
   orbitals per subshell and shell, energy depends only on n for H (Example 2-6), the letters s p d f g h. The p. 21 wavefunction table is used in M2C6. */
(function(){
const M=C120, K=C120.chem.CONST;
const RH=K.RH, HC=K.h*K.c;
const L_LET=["s","p","d","f","g","h"];
const lab=(n,l)=>`${n}${L_LET[l]}`;
const J=(v,sf=3)=>M.qty(v,sf,"J",{sci:true});
const mlList=l=>{ const a=[]; for(let m=-l;m<=l;m++) a.push(m); return a; };
const mlTeX=l=>mlList(l).map(m=>m>0?`+${m}`:m<0?`-${-m}`:"0").join(",\\ ");
const qsTeX=(n,l,ml)=>`(${n},\\ ${l},\\ ${ml})`;
function lamAns(lam){ const nm=lam*1e9; return nm<1000?{value:nm,unit:"nm",word:"nanometres",tex:M.qty(nm,3,"nm")}:{value:lam*1e6,unit:"μm",word:"micrometres",tex:M.qty(lam*1e6,3,"μm")}; }
const NS="http://www.w3.org/2000/svg";
function sv(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.append(e); return e; }
/* why a set (n, l, m_l) is not allowed, or true */
function why(n,l,ml){ if(!Number.isInteger(n)||n<1) return "n must be a positive whole number"; if(l<0||l>n-1) return `l must be between 0 and n − 1 = ${n-1}`; if(Math.abs(ml)>l) return `m_l must be between −l and +l (here ${-l} to +${l})`; return true; }

M.chapter({
  id:"M2C5", module:"m2", n:5, num:"2.5", date:"2026-09-30", added:"2026-10-26", quiz:"PC3",
  title:"Wavefunctions and quantum numbers", pages:"16-21", sections:["2.7"],
  summary:"Schrödinger's equation describes the electron as a wave, $\\Psi$, whose square $|\\Psi|^2$ gives the probability of finding it. Its solutions for hydrogen are orbitals, each labelled by three quantum numbers: $n$ (size), $l$ (shape) and $m_l$ (orientation). In hydrogen the energy depends only on $n$.",
  flags:[
    {ref:"p. 16", text:"The Schrödinger equation is printed with the prefactor $\\frac{h^2}{8\\pi m_e}$. It should be $\\frac{h^2}{8\\pi^2 m_e}$ (the $\\pi$ is squared). The derivatives should also be partial derivatives, $\\partial^2\\Psi/\\partial x^2$, because $\\Psi$ depends on $x$, $y$ and $z$. You never use the equation in this course, but the correct form is shown on this site."}
  ],
  formulas:[
    {id:"M2C5.f.schrodinger", name:"Schrödinger equation for the H atom (look, don't memorise)", tex:"-\\frac{h^2}{8\\pi^2 m_e}\\left(\\frac{\\partial^2\\Psi}{\\partial x^2}+\\frac{\\partial^2\\Psi}{\\partial y^2}+\\frac{\\partial^2\\Psi}{\\partial z^2}\\right)+V\\Psi = E\\Psi", note:"Written correctly here; the notes' version has $8\\pi$ instead of $8\\pi^2$. The unknowns are $E$ and $\\Psi$.", ref:"p. 16"},
    {id:"M2C5.f.potential", name:"Electron-proton potential energy", tex:"V = \\frac{(+e)(-e)}{4\\pi\\varepsilon_0 r}", note:"$e = 1.602\\times10^{-19}$ C, $\\varepsilon_0 = 8.854\\times10^{-12}\\ \\mathrm{C^2\\,J^{-1}\\,m^{-1}}$.", ref:"p. 16"},
    {id:"M2C5.f.spherical", name:"Spherical coordinates", tex:"x = r\\sin\\theta\\cos\\phi,\\quad y = r\\sin\\theta\\sin\\phi,\\quad z = r\\cos\\theta", note:"$r$ = distance from the nucleus, $\\theta$ measured from the $+z$ axis, $\\phi$ from the $+x$ axis in the $xy$ plane.", ref:"p. 16"},
    {id:"M2C5.f.born", name:"Meaning of Ψ: the Born interpretation", tex:"|\\Psi|^2\\,dV = \\text{probability of finding the electron in } dV", note:"$\\Psi$ itself has no physical meaning. $|\\Psi|^2$ can also be read as the density of an electron cloud.", ref:"p. 17",
      blank:{tex:"\\boxed{\\,?\\,}\\,dV = \\text{probability in } dV", accept:["|Ψ|^2","|psi|^2","Ψ^2","psi^2","|Ψ|²","Ψ²","|ψ|^2","ψ^2"]}},
    {id:"M2C5.f.n", name:"Principal quantum number (size)", tex:"n = 1, 2, 3, \\ldots", kind:"rule", ref:"p. 18"},
    {id:"M2C5.f.l", name:"Orbital angular momentum quantum number (shape)", tex:"l = 0, 1, 2, \\ldots, n-1", kind:"rule", ref:"p. 18",
      blank:{tex:"l = 0, 1, \\ldots, \\boxed{\\,?\\,}", accept:["n-1","n - 1","n−1"]}},
    {id:"M2C5.f.ml", name:"Magnetic quantum number (orientation)", tex:"m_l = 0, \\pm1, \\pm2, \\ldots, \\pm l", kind:"rule", ref:"p. 18",
      blank:{tex:"m_l = 0, \\pm1, \\ldots, \\boxed{\\,?\\,}", accept:["±l","+-l","+/-l","±ℓ","+-ℓ","-l to l","l"]}},
    {id:"M2C5.f.letters", name:"Letters for l", tex:"l = 0,1,2,3,4,5 \\;\\to\\; s, p, d, f, g, h", kind:"rule", ref:"p. 20"},
    {id:"M2C5.f.per-subshell", name:"Orbitals in a subshell", tex:"2l + 1", note:"One orbital for each $m_l$ value: s 1, p 3, d 5, f 7. Counted from the rules on p. 18; the diagram on p. 20 shows 1, 3 and 5.", ref:"p. 18",
      blank:{tex:"\\#\\,\\text{orbitals with a given } l = \\boxed{\\,?\\,}", accept:["2l+1","2ℓ+1","2l + 1","2*l+1","1+2l"]}},
    {id:"M2C5.f.per-shell", name:"Orbitals with the same n", tex:"n^2", note:"$1 + 3 + 5 + \\ldots$ up to $l = n-1$. The p. 20 diagram shows 1, 4 and 9 for $n = 1, 2, 3$. The formula itself is not printed in the notes.", ref:"p. 20",
      blank:{tex:"\\#\\,\\text{orbitals with a given } n = \\boxed{\\,?\\,}", accept:["n^2","n2","n²","n*n"]}},
    {id:"M2C5.f.energy", name:"Hydrogen energy depends only on n", tex:"E_n = -\\frac{R_H}{n^2}\\quad\\text{(the same for every } l \\text{ and } m_l)", kind:"rule", note:"Exactly Bohr's formula. True for H (one electron) only; many-electron atoms differ.", ref:"p. 18"}
  ],
  glossary:[
    {id:"M2C5.t.wavefunction", term:"Wavefunction, $\\Psi$", def:"The mathematical function that solves the Schrödinger equation. It has wave-like ups and downs; on its own it has no physical meaning.", ref:"p. 17"},
    {id:"M2C5.t.born", term:"Born interpretation", def:"$|\\Psi|^2\\,dV$ is the probability of finding the electron in a small volume $dV$.", ref:"p. 17"},
    {id:"M2C5.t.orbital", term:"Orbital", def:"A wavefunction $\\Psi$ for one electron, whose square gives the probability of finding the electron at each point.", ref:"p. 18"},
    {id:"M2C5.t.n", term:"Principal quantum number, $n$", def:"Sets the size (and, in hydrogen, the energy) of an orbital. $n = 1, 2, 3, \\ldots$", ref:"p. 18"},
    {id:"M2C5.t.l", term:"Orbital angular momentum quantum number, $l$", def:"Sets the shape of an orbital. $l = 0$ to $n - 1$, written s, p, d, f, ...", ref:"pp. 18-20"},
    {id:"M2C5.t.ml", term:"Magnetic quantum number, $m_l$", def:"Sets the orientation. $m_l = -l$ to $+l$, so there are $2l + 1$ orientations.", ref:"p. 18"},
    {id:"M2C5.t.subshell", term:"Subshell", def:"All orbitals with the same $n$ and $l$, such as the three 2p orbitals. (The notes call these levels or states.)", ref:"p. 20"},
    {id:"M2C5.t.degenerate", term:"Degenerate", def:"Having the same energy. In hydrogen, all orbitals with the same $n$ are degenerate.", ref:"p. 20"}
  ],
  figures:{
    qnlab:{title:"Orbitals from n, l and m_l", cap:"Choose quantum numbers and see the orbital as a cloud of possible electron positions sampled from $|\\Psi|^2$ (p. 17): dense where the electron is likely. Only allowed combinations appear (p. 18). The real orbitals $p_x$, $p_y$, $d_{xy}$ and so on mix $+m_l$ and $-m_l$, so the picker labels them by shape (this mixing is not from the notes).", ref:"pp. 17-21",
      model:{type:"orbital", params:{orbital:"2s", mode:"cloud", picker:"qn", maxN:4, nodes:false, radial:false}},
      predict:{q:"How many different orbitals have $n = 3$?", opts:[["3",false,"That is the number of subshells (3s, 3p, 3d)."],["6",false,"Count every $m_l$ value, not just $l$ and $|m_l|$."],["9",true,"3s (1) + 3p (3) + 3d (5) = 9, which is $n^2$."],["18",false,"That counts each orbital twice. (Spin, in a later chapter, doubles the number of states, not orbitals.)"]], keep:true, check:"Set n = 3, then step through every l and m_l the picker allows and count them."}},
    diagram:{title:"Energy diagram of the H atom (Example 2-6)", cap:"One bar per orbital, in columns by $l$, at the height $E_n = -R_H/n^2$ (p. 18), as in the solution to Example 2-6 (p. 20). Every orbital in a row has the same energy: in hydrogen the energy depends only on $n$. Hover over a bar for its quantum numbers.", ref:"pp. 18-20",
      build(host,{PLOT,M}){
        let N=3; const ctl=PLOT.controls(host);
        const W=680,H=300,top=34,bot=18; const Y=E=>top+(E-(-0.02e-18))/(-RH*1.02-(-0.02e-18))*(H-top-bot);
        const svg=sv("svg",{viewBox:`0 0 ${W} ${H}`,class:"fig",role:"img","aria-label":"Energy diagram of hydrogen orbitals"}); host.append(svg);
        const col=[110,170,290,460], bw=22, gap=6;
        ["s (l = 0)","p (l = 1)","d (l = 2)","f (l = 3)"].forEach((t,l)=>{ const w=(2*l+1)*(bw+gap)-gap; const e=sv("text",{x:col[l]+w/2,y:16,"text-anchor":"middle",class:"lbl",style:"font-size:12px"},svg); e.textContent=t; });
        sv("line",{x1:40,x2:40,y1:H-bot,y2:top-8,class:"ax"},svg); const te=sv("text",{x:46,y:top-12,style:"font-size:11px;fill:var(--ink2)"},svg); te.textContent="Energy";
        const g=sv("g",{},svg); const out=PLOT.readout(host);
        PLOT.slider(ctl,{label:"Show every orbital with n up to",min:1,max:4,step:1,value:N,oninput:v=>{ N=v; draw(); }});
        function draw(){
          g.innerHTML=""; const rows=[];
          for(let n=1;n<=N;n++){ const y=Y(-RH/(n*n)); const t=sv("text",{x:96,y:y+4,"text-anchor":"end",style:"font-size:11px;fill:var(--ink2)"},g); t.textContent=`n = ${n}`;
            for(let l=0;l<n&&l<=3;l++) mlList(l).forEach((ml,i)=>{ const x=col[l]+i*(bw+gap); const r=sv("rect",{x,y:y-2,width:bw,height:4,rx:1,style:"fill:var(--c,var(--accent))"},g); const tt=sv("title",{},r); tt.textContent=`${lab(n,l)}: n = ${n}, l = ${l}, m_l = ${ml}`; });
            rows.push(`$n = ${n}$: ${Array.from({length:n},(_,l)=>`${lab(n,l)} (${2*l+1})`).join(" + ")} = <b>${n*n}</b> orbital${n>1?"s":""}, $E_{${n}} = ${J(-RH/(n*n),4)}$`); }
          out.innerHTML=M.rich(rows.join("<br>"));
        }
        draw();
      }}
  },
  gens:[
    {id:"M2C5.g.count-orbitals", title:"Count orbitals and subshells", skill:"$2l+1$ per subshell, $n^2$ per shell", ref:"pp. 18-20",
      gen(R,d){
        if(d===1){ const n=R.int(2,6), l=R.int(1,Math.min(3,n-1));
          return {prompt:`How many orbitals are there in the $${lab(n,l)}$ subshell?`, answer:{type:"int",value:2*l+1},
            hint:"One orbital for each allowed $m_l$; $m_l$ runs from $-l$ to $+l$.",
            steps:[`${L_LET[l]} means $l = ${l}$.`,`$m_l = ${mlTeX(l)}$: that is $2l + 1 = ${2*l+1}$ values.`,`So ${2*l+1} orbitals. The value of $n$ doesn't change the count.`], answerTeX:`${2*l+1}`}; }
        if(d===2){ const n=R.int(2,6);
          return {prompt:`For $n = ${n}$ in a hydrogen atom, how many subshells (different values of $l$) and how many orbitals are there?`,
            parts:[{label:"Subshells",answer:{type:"int",value:n}},{label:"Orbitals",answer:{type:"int",value:n*n}}],
            hint:"$l$ runs from 0 to $n-1$. Add $2l+1$ orbitals for each $l$.",
            steps:[`$l = 0$ to $${n-1}$: ${n} subshells (${Array.from({length:n},(_,l)=>lab(n,l)).join(", ")}).`,`Orbitals: ${Array.from({length:n},(_,l)=>2*l+1).join(" + ")} = ${n*n} $= n^2$.`], answerTeX:`${n} subshells, ${n*n} orbitals`}; }
        const n=R.int(3,6), ml=R.int(-(n-1),n-1); const ls=[]; for(let l=Math.abs(ml);l<=n-1;l++) ls.push(l);
        return {prompt:`How many orbitals in a hydrogen atom have $n = ${n}$ and $m_l = ${ml}$?`, answer:{type:"int",value:ls.length},
          hint:"$m_l$ can only be as large as $l$, so list the values of $l$ (from 0 to $n-1$) that are at least $|m_l|$.",
          steps:[`For $n = ${n}$, $l = 0$ to $${n-1}$.`,`$m_l = ${ml}$ needs $l \\ge ${Math.abs(ml)}$: $l = ${ls.join(", ")}$.`,`Each of those subshells has exactly one orbital with $m_l = ${ml}$: ${ls.length} orbital${ls.length>1?"s":""} (${ls.map(l=>lab(n,l)).join(", ")}).`], answerTeX:`${ls.length}`};
      }},
    {id:"M2C5.g.allowed-set", title:"Is this set of quantum numbers allowed?", skill:"$1 \\le n$, $0 \\le l \\le n-1$, $|m_l| \\le l$", ref:"p. 18",
      gen(R,d){
        const make=ok=>{ let n,l,ml; if(ok){ n=R.int(1,6); l=R.int(0,n-1); ml=R.int(-l,l); } else { const k=R.pick(["l","ml","n"]); if(k==="l"){ n=R.int(1,5); l=R.int(n,n+2); ml=R.int(-Math.min(l,2),Math.min(l,2)); } else if(k==="ml"){ n=R.int(2,6); l=R.int(0,n-1); ml=(l+R.int(1,2))*R.sign(); } else { n=0; l=0; ml=0; } } return [n,l,ml]; };
        if(d===3){ let sets, guard=0; do{ sets=[]; const keys=new Set(); while(sets.length<5){ const s=make(R()<0.5); const k=s.join(","); if(!keys.has(k)){ keys.add(k); sets.push(s); } } guard++; } while(guard<50 && (sets.every(s=>why(...s)===true)||sets.every(s=>why(...s)!==true)));
          const corr=sets.map((s,i)=>why(...s)===true?i:-1).filter(i=>i>=0);
          return {prompt:"Which of these sets $(n, l, m_l)$ are allowed for an electron in a hydrogen atom? Select all that apply.", answer:{type:"multi",options:sets.map(s=>`$${qsTeX(...s)}$`),correct:corr},
            hint:"Check each in order: $n \\ge 1$; then $l$ from 0 to $n-1$; then $m_l$ from $-l$ to $+l$.",
            steps:sets.map(s=>{ const w=why(...s); return `$${qsTeX(...s)}$: ${w===true?"allowed.":`not allowed, ${w.replace("m_l","$m_l$").replace(/\bl\b/,"$l$").replace(/\bn\b/,"$n$")}.`}`; }), answerTeX:corr.map(i=>`$${qsTeX(...sets[i])}$`).join(", ")}; }
        const ok=R()<0.5; const s=make(ok); const w=why(...s);
        if(d===1) return {prompt:`Is the set $(n, l, m_l) = ${qsTeX(...s)}$ allowed?`, answer:{type:"mc",options:["Yes","No"],correct:ok?0:1,keep:true},
          hint:"$l$ goes from 0 to $n-1$; $m_l$ goes from $-l$ to $+l$.", steps:[w===true?"$n \\ge 1$, $l \\le n-1$ and $|m_l| \\le l$: all fine. Allowed.":`Not allowed: ${w}.`], answerTeX:ok?"Yes":"No"};
        const opts=["Allowed","Not allowed: l is too large for this n","Not allowed: m_l is outside −l to +l","Not allowed: n must be 1 or more"];
        const c=w===true?0:/^l must/.test(w)?1:/^m_l/.test(w)?2:3;
        return {prompt:`Is the set $(n, l, m_l) = ${qsTeX(...s)}$ allowed? If not, why not?`, answer:{type:"mc",options:opts.map(o=>o.replace("m_l","$m_l$").replace(" l is"," $l$ is").replace("this n","this $n$").replace("−l to +l","$-l$ to $+l$").replace("n must","$n$ must")),correct:c,keep:true},
          hint:"Check $n$ first, then $l$ against $n$, then $m_l$ against $l$.", steps:[w===true?"$n \\ge 1$, $0 \\le l \\le n-1$, $-l \\le m_l \\le +l$. Allowed.":`${w}.`], answerTeX:opts[c]};
      }},
    {id:"M2C5.g.write-set", title:"Write a set of quantum numbers", skill:"From an orbital label to $(n, l, m_l)$", ref:"pp. 18-20",
      gen(R,d){
        if(d===1){ const n=R.int(2,6), l=R.int(0,Math.min(3,n-1));
          return {prompt:`Write one allowed set of quantum numbers $(n, l, m_l)$ for an electron in a $${lab(n,l)}$ orbital.`,
            answer:{type:"qset",test:q=>q.n!==n?`The ${n} in ${lab(n,l)} is n.`:q.l!==l?`${L_LET[l]} means l = ${l}.`:true,sample:`(${n}, ${l}, 0)`},
            hint:`The number is $n$. The letter gives $l$ (s 0, p 1, d 2, f 3). Any $m_l$ from $-l$ to $+l$ works.`,
            steps:[`$n = ${n}$, $l = ${l}$ (${L_LET[l]}).`,`$m_l$ can be any of $${mlTeX(l)}$.`,`For example $${qsTeX(n,l,0)}$.`], answerTeX:`$(${n},\\ ${l},\\ m_l)$ with $m_l = ${mlTeX(l)}$`}; }
        if(d===2){ const n=R.int(3,6), l=R.int(1,Math.min(3,n-1)); const big=R.pick([true,false]); const ml=big?l:-l;
          return {prompt:`Write the set $(n, l, m_l)$ for the $${lab(n,l)}$ orbital with the ${big?"largest":"most negative"} possible value of $m_l$.`, answer:{type:"qset",answer:[n,l,ml]},
            hint:"$m_l$ runs from $-l$ to $+l$.", steps:[`$n = ${n}$, $l = ${l}$.`,`$m_l$ from $${-l}$ to $+${l}$, so the ${big?"largest":"most negative"} is $${ml}$.`,`$${qsTeX(n,l,ml)}$`], answerTeX:`$${qsTeX(n,l,ml)}$`}; }
        const l=R.int(1,3);
        return {prompt:`Write an allowed set $(n, l, m_l)$ with $l = ${l}$ and the smallest possible value of $n$.`,
          answer:{type:"qset",test:q=>q.l!==l?`l must be ${l}.`:q.n!==l+1?`l = ${l} needs n ≥ ${l+1}, and the smallest is ${l+1}.`:true,sample:`(${l+1}, ${l}, ${-l})`},
          hint:"$l$ can be at most $n-1$, so $n$ must be at least $l + 1$.", steps:[`$l \\le n-1$ means $n \\ge ${l+1}$; the smallest is $n = ${l+1}$ (the $${lab(l+1,l)}$ subshell).`,`Any $m_l$ from $-${l}$ to $+${l}$, for example $${qsTeX(l+1,l,0)}$.`], answerTeX:`$(${l+1},\\ ${l},\\ m_l)$, $m_l = ${mlTeX(l)}$`};
      }},
    {id:"M2C5.g.label", title:"Orbital labels and quantum numbers", skill:"$n$ and the letter for $l$", ref:"p. 20",
      gen(R,d){
        const n=R.int(2,7), l=R.int(0,Math.min(3,n-1));
        if(d===2) return {prompt:`What are $n$ and $l$ for a $${lab(n,l)}$ orbital?`, parts:[{label:"$n$",answer:{type:"int",value:n}},{label:"$l$",answer:{type:"int",value:l}}],
          hint:"The number is $n$. s, p, d, f stand for $l = 0, 1, 2, 3$.", steps:[`$n = ${n}$.`,`${L_LET[l]} means $l = ${l}$.`], answerTeX:`$n = ${n}$, $l = ${l}$`};
        if(d===1) return {prompt:`An electron is in an orbital with $n = ${n}$ and $l = ${l}$. What is the name of its subshell (written like ${lab(n,l)==="2p"?"3s":"2p"})?`, answer:{type:"orbital",answer:lab(n,l)},
          hint:"Write $n$, then the letter for $l$: 0 s, 1 p, 2 d, 3 f.", steps:[`$l = ${l}$ is ${L_LET[l]}.`,`So the subshell is $${lab(n,l)}$.`], answerTeX:`$${lab(n,l)}$`};
        const ml=R.int(-l,l);
        return {prompt:`An electron has the quantum numbers $(n, l, m_l) = ${qsTeX(n,l,ml)}$. Which subshell is it in, and how many orbitals does that subshell have?`,
          parts:[{label:"Subshell",answer:{type:"orbital",answer:lab(n,l)}},{label:"Orbitals in the subshell",answer:{type:"int",value:2*l+1}}],
          hint:"$m_l$ picks one orbital out of the subshell; the subshell name only needs $n$ and $l$.",
          steps:[`$n = ${n}$, $l = ${l}$ (${L_LET[l]}): the $${lab(n,l)}$ subshell.`,`It has $2l + 1 = ${2*l+1}$ orbitals ($m_l = ${mlTeX(l)}$); this electron is in the one with $m_l = ${ml}$.`], answerTeX:`$${lab(n,l)}$, ${2*l+1} orbitals`};
      }},
    {id:"M2C5.g.degenerate", title:"Energy depends only on n in hydrogen", skill:"Degenerate orbitals; $E_n = -R_H/n^2$", ref:"pp. 18-20",
      gen(R,d){
        const n=d===3?R.pick([4,6,7]):R.int(2,5), l=R.int(0,Math.min(3,n-1));
        if(d===1){ let l2; do{ l2=R.int(0,Math.min(3,n-1)); }while(l2===l && n>1);
          const wrong=[]; const keys=new Set([lab(n,l),lab(n,l2)]);
          while(wrong.length<3){ const n2=R.int(1,6); if(n2===n) continue; const l3=R.int(0,Math.min(3,n2-1)); const k=lab(n2,l3); if(!keys.has(k)){ keys.add(k); wrong.push(k); } }
          const opts=R.shuffle([lab(n,l2),...wrong]);
          return {prompt:`In a hydrogen atom, which orbital has the same energy as a $${lab(n,l)}$ orbital?`, answer:{type:"mc",options:opts.map(o=>`$${o}$`),correct:opts.indexOf(lab(n,l2))},
            hint:"For hydrogen, $E_n = -R_H/n^2$ depends only on $n$ (p. 20).", steps:[`$${lab(n,l)}$ has $n = ${n}$.`,`Only $${lab(n,l2)}$ also has $n = ${n}$, so it has the same energy, $E_${n}$.`,"(In atoms with more than one electron this is no longer true: Module 3.)"], answerTeX:`$${lab(n,l2)}$`}; }
        if(d===2){ const E=-RH/(n*n);
          return {prompt:`What is the energy of the electron in a hydrogen atom when it is in a $${lab(n,l)}$ orbital? Give 4 significant figures.`, answer:{type:"num",value:E,unit:"J",sf:4},
            hint:"Only $n$ matters for hydrogen.", steps:[`$${lab(n,l)}$: $n = ${n}$. The letter doesn't change the energy in hydrogen.`,`$E_{${n}} = -\\dfrac{2.179\\times10^{-18}\\ \\mathrm{J}}{${n}^2} = ${J(E,4)}$`], answerTeX:`$${J(E,4)}$`, verify:{value:-2.179e-18/n/n}}; }
        const D=RH*(1/((n-1)*(n-1))-1/(n*n)), lam=HC/D, A=lamAns(lam);
        return {prompt:`A hydrogen atom has its electron in a $${lab(n,l)}$ orbital. What is the longest wavelength of light it can emit in one jump, in ${A.word}?`, answer:{type:"num",value:A.value,unit:A.unit,sf:3},
          hint:"Energy depends only on $n$, so the subshell letter doesn't matter. Longest wavelength means the smallest drop.",
          steps:[`Only $n = ${n}$ matters in hydrogen. The smallest drop is to $n = ${n-1}$.`,`$|\\Delta E| = R_H\\left(\\dfrac{1}{${n-1}^2}-\\dfrac{1}{${n}^2}\\right) = ${J(D,4)}$`,`$\\lambda = hc/|\\Delta E| = ${M.qty(lam,4,"m",{sci:true})} = ${A.tex}$ (infrared).`], answerTeX:`$${A.tex}$`, verify:{value:K.h*K.c/(2.179e-18*(1/((n-1)*(n-1))-1/(n*n)))*(A.unit==="nm"?1e9:1e6)}};
      }}
  ],
  exam:[
    {id:"M2C5.q1", ref:"p. 18", q:"Which quantum number sets the shape of an orbital?", opts:[
      ["$l$",true,"$l$ = 0, 1, 2 gives s, p, d shapes."],["$n$",false,"$n$ sets the size (and the energy in H)."],["$m_l$",false,"$m_l$ sets the orientation."],["$m_s$",false,"$m_s$ is spin, in a later chapter."],["$R_H$",false,"That is a constant, not a quantum number."]]},
    {id:"M2C5.q2", ref:"p. 18", q:"Which set of quantum numbers $(n, l, m_l)$ is <b>not</b> allowed?", opts:[
      ["$(2, 2, 0)$",true,"$l$ can be at most $n - 1 = 1$."],["$(3, 2, -2)$",false,"Allowed: $l \\le 2$ and $|m_l| \\le l$."],["$(1, 0, 0)$",false,"Allowed: the 1s orbital."],["$(4, 3, 3)$",false,"Allowed: a 4f orbital with the largest $m_l$."],["$(2, 1, -1)$",false,"Allowed: a 2p orbital."]]},
    {id:"M2C5.q3", ref:"p. 20", q:"How many orbitals does a hydrogen atom have with $n = 4$?", opts:[
      ["16",true,"4s (1) + 4p (3) + 4d (5) + 4f (7) = 16 $= n^2$."],["4",false,"That is the number of subshells."],["9",false,"That is $n = 3$."],["32",false,"That is $2n^2$, which counts spin states (later chapter)."],["7",false,"That is the 4f subshell alone."]]},
    {id:"M2C5.q4", ref:"p. 20", q:"In a <b>hydrogen</b> atom, which orbital has the highest energy?", opts:[
      ["4s",true,"It has the largest $n$, and in hydrogen only $n$ matters."],["3d",false,"$n = 3$ is lower than $n = 4$, whatever the letter."],["3p",false,"Same energy as 3d, below 4s."],["2p",false,"$n = 2$."],["1s",false,"The lowest of all."]]},
    {id:"M2C5.q5", ref:"p. 17", q:"What does $|\\Psi|^2$ tell you about an electron?", opts:[
      ["How likely it is to be found near each point in space",true,"Born interpretation: $|\\Psi|^2\\,dV$ is a probability."],["Its exact path around the nucleus",false,"No exact path exists to know (p. 15)."],["Its energy at each point",false,"The energy is set by $n$ alone, $E_n = -R_H/n^2$, not by position."],["Its speed at each point",false,"$|\\Psi|^2$ is about position."],["Nothing: only $\\Psi$ has meaning",false,"It's the other way round: $\\Psi$ alone has no physical meaning."]]},
    {id:"M2C5.q6", ref:"p. 18", q:"Which statement about the quantum numbers $n$, $l$ and $m_l$ in Schrödinger's theory is correct?", opts:[
      ["They come out of the mathematics of solving the Schrödinger equation.",true,"They are not assumed, unlike Planck's and Bohr's conditions (p. 18)."],["They were assumed, as Bohr assumed his orbits.",false,"That was the problem with Bohr's model."],["They describe the radius of the electron's circular orbit.",false,"There is no circular orbit in this theory."],["They can take any real value.",false,"They are whole numbers with strict limits."],["They are only needed for atoms with many electrons.",false,"They label every hydrogen orbital too."]]},
    {id:"M2C5.q7", ref:"p. 18", q:"An electron is in a subshell with $l = 3$. How many values can $m_l$ have?", opts:[
      ["7",true,"$-3$ to $+3$: $2l + 1 = 7$ (an f subshell)."],["3",false,"That counts only the positive values."],["4",false,"That counts $0$ to $3$ only."],["6",false,"Don't forget $m_l = 0$."],["14",false,"That would count spin states."]]}
  ],
  steps:[
    {type:"read", title:"A new theory had to treat the electron as a wave of probability", ref:"p. 16", body:"<p>The last chapter left two facts: the electron behaves like a wave (de Broglie), and its exact path can never be known (Heisenberg). So the equation for the electron in a hydrogen atom had to do two things: include the electron's wave nature, and give answers that are read as probabilities.</p><p>Schrödinger (and others) found such an equation. The goal is to find which energies $E$ allow a solution, and the function $\\Psi$ that goes with each one. The quantization Bohr had to assume now falls out of the mathematics.</p>"},
    {type:"read", title:"The Schrödinger equation is for looking at, not solving", ref:"p. 16", body:"<p>For one electron moving around the nucleus, correctly written:</p>$$-\\frac{h^2}{8\\pi^2 m_e}\\left(\\frac{\\partial^2\\Psi}{\\partial x^2}+\\frac{\\partial^2\\Psi}{\\partial y^2}+\\frac{\\partial^2\\Psi}{\\partial z^2}\\right)+V\\Psi = E\\Psi \\qquad V = \\frac{(+e)(-e)}{4\\pi\\varepsilon_0 r}$$<p>(The notes print $8\\pi$ instead of $8\\pi^2$: see the flag below.) The first term is about how sharply $\\Psi$ curves, which is tied to kinetic energy (not from the notes). $V$ is the attraction between the proton and the electron.</p><p>You do not need to memorise, use or solve this equation. Because the atom is round, positions are often given as $(r, \\theta, \\phi)$ instead of $(x, y, z)$: $r$ is the distance from the nucleus, $\\theta$ the angle down from the $z$ axis, $\\phi$ the angle around from the $x$ axis.</p>"},
    {type:"read", title:"Ψ has no meaning by itself; |Ψ|² is a probability", ref:"p. 17", body:"<p>$\\Psi$ is just a mathematical function. It goes up and down like a wave, so it's called a <b>wavefunction</b>, but it has no physical meaning. Its square does:</p><div class=\"box def\"><b class=\"t\">Born interpretation (p. 17)</b>$|\\Psi|^2\\,dV$ = the probability of finding the electron in a small volume $dV$.</div><p>Schrödinger read it instead as the density of a smeared-out \"electron cloud\". That picture is handy, but no one has ever detected a fraction of an electron.</p><p>Picture a firefly in a dark room, photographed thousands of times. Each photo shows one dot. Stack them all and you get a cloud, thick where the firefly spends most of its time. That stack of dots is what $|\\Psi|^2$ describes.</p>"},
    {type:"mcq", title:"Which quantity has a physical meaning?", q:"A wavefunction has the value $\\Psi = -0.03$ at one point and $+0.03$ at another. Which is true?", opts:[["The electron is equally likely to be found near either point.",true,"$|\\Psi|^2$ is the same at both. The sign of $\\Psi$ alone has no physical meaning."],["The electron can't be at the first point because $\\Psi$ is negative there.",false,"Probability is $|\\Psi|^2$, which is never negative."],["The first point carries a negative charge.",false,"The sign of $\\Psi$ is not a charge."]], after:"The signs (phases) of $\\Psi$ matter later, for drawing orbital lobes and for bonding."},
    {type:"read", title:"Orbitals are labelled by three quantum numbers", ref:"p. 18", body:"<p>Each solution for hydrogen is an <b>orbital</b>: a wavefunction $\\Psi$ whose square gives the probability of finding the electron. Each orbital has its own energy and its own set of three whole numbers:</p><div class=\"box def\"><b class=\"t\">Quantum numbers (p. 18)</b>$n = 1, 2, 3, \\ldots$ &nbsp; principal: the <b>size</b><br>$l = 0, 1, \\ldots, n-1$ &nbsp; orbital angular momentum: the <b>shape</b><br>$m_l = 0, \\pm1, \\ldots, \\pm l$ &nbsp; magnetic: the <b>orientation</b></div><p>Think of a postal address: city, street, house. $n$ narrows it to a shell, $l$ to a subshell inside it, $m_l$ to one orbital.</p><p>Letters stand for $l$ (p. 20): s (0), p (1), d (2), f (3), then g and h. So \"3d\" means $n = 3$, $l = 2$. A subshell has $2l + 1$ orbitals (one per $m_l$), and a shell has $n^2$.</p>"},
    {type:"explore", title:"Build orbitals from the quantum numbers", fig:"qnlab", ref:"pp. 17-21", body:"<p>Start at $n = 1$: only $l = 0$, $m_l = 0$ is allowed. Raise $n$ and new values of $l$ appear. Pick $l = 2$ and step through the five values of $m_l$.</p><p>The cloud is many sampled electron positions: the dots pile up where $|\\Psi|^2$ is large.</p>"},
    {type:"example", title:"List every orbital in the n = 4 shell", ref:"pp. 18-20", ex:{q:"List the subshells with $n = 4$ and the values of $m_l$ in each. How many orbitals are there in all?", steps:[
      {t:"$l = 0, 1, 2, 3$",why:"$l$ runs from 0 to $n - 1 = 3$."},
      {t:"4s: $m_l = 0$ (1 orbital). 4p: $m_l = -1, 0, +1$ (3).",why:"$m_l$ runs from $-l$ to $+l$."},
      {t:"4d: $m_l = -2$ to $+2$ (5). 4f: $m_l = -3$ to $+3$ (7).",why:"Each subshell has $2l + 1$ orbitals."},
      {t:"Total $= 1 + 3 + 5 + 7 = 16$",why:"That is $n^2 = 16$, a quick check."}], ans:"4s, 4p, 4d, 4f: 16 orbitals."}},
    {type:"try", title:"Count the orbitals", gen:"M2C5.g.count-orbitals"},
    {type:"try", title:"Allowed or not?", gen:"M2C5.g.allowed-set"},
    {type:"read", title:"In hydrogen, the energy depends only on n", ref:"pp. 18-20", body:"<p>Solving Schrödinger's equation gives exactly the energies Bohr found (p. 18):</p>$$E_n = -\\frac{R_H}{n^2} \\qquad R_H = 2.179\\times10^{-18}\\ \\mathrm{J}$$<p>Bohr got the right result for the wrong reasons. His diagram had the right spacings but only one level for each $n$. The new diagram (Example 2-6) has one level per orbital: 1 at $n = 1$, 4 at $n = 2$, 9 at $n = 3$. Within each $n$ they all have the same energy: in hydrogen, 3s, 3p and 3d are <b>degenerate</b>.</p><p>This is true only for hydrogen, with its single electron. In other atoms the subshells split apart (Module 3).</p>"},
    {type:"explore", title:"Draw the energy diagram", fig:"diagram", ref:"pp. 18-20", body:"<p>Slide up to $n = 4$. Count the bars in each row: 1, 4, 9, 16. Notice that the rows get closer together as $n$ grows, the same spacing as Bohr's ladder.</p>"},
    {type:"try", title:"Same energy?", gen:"M2C5.g.degenerate"},
    {type:"firstline", title:"Find the first mistake", q:"A student counts the orbitals in the $n = 3$ shell:", lines:["$n = 3$, so $l$ can be 0, 1 or 2.","$l = 0$ gives one orbital (3s); $l = 1$ gives three (3p).","For $l = 2$, $m_l$ can be 0, +1 or +2, so 3d has three orbitals.","Total: $1 + 3 + 3 = 7$ orbitals."], wrong:2, why:"$m_l$ runs from $-l$ to $+l$: $-2, -1, 0, +1, +2$. So 3d has five orbitals and the shell has $1 + 3 + 5 = 9$."},
    {type:"try", title:"Write a set of quantum numbers", gen:"M2C5.g.write-set"},
    {type:"try", title:"Labels and quantum numbers", gen:"M2C5.g.label"},
    {type:"formulas", title:"Rules and formulas"}
  ]
});
})();
