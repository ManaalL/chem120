/* Chapter 2.6 (Wed Oct 7): Orbital shapes, phase and nodes. Course notes Module 2, pp. 22-24 (section 2.8, parts i and ii).
   Boundary surfaces, scatter plots, radial and angular nodes, phase. The wavefunction table is on p. 21. */
(function(){
const M=C120;
const L_LET=["s","p","d","f"];
const ANG={0:["s"],1:["p_x","p_y","p_z"],2:["d_{xy}","d_{yz}","d_{xz}","d_{x^2-y^2}","d_{z^2}"]};
const nodeWord=(n,w)=>`${n} ${w}${n===1?"":"s"}`;

M.chapter({
  id:"M2C6", module:"m2", n:6, num:"2.6", date:"2026-10-07", added:"2026-10-26", quiz:"PC3",
  title:"Orbital shapes, phase and nodes", pages:"22-24", sections:["2.8"],
  summary:"Every hydrogen orbital is a 3D wave $\\Psi = R(r)Y(\\theta,\\phi)$. Its shape comes from $l$, its size from $n$, and its nodes follow two rules: $l$ angular nodes and $n-l-1$ radial nodes.",
  flags:[
    {ref:"p. 21", text:"The table writes the 2s radial factor as $(r-2)$, which makes the inner region negative, while the 2s picture on p. 23 shows the inner sphere as +. The overall sign of a wavefunction is arbitrary, so neither is wrong, but they disagree. This site uses $(2-r)$ so it matches the picture."}
  ],
  formulas:[
    {id:"M2C6.f.psi-product", name:"Wavefunction = radial factor × angular factor", tex:"\\Psi(r,\\theta,\\phi)=R(r)\\,Y(\\theta,\\phi)", note:"$R$ depends on $n$ and $l$. $Y$ depends on $l$ and $m_l$.", ref:"p. 22",
      blank:{tex:"\\Psi = R(r)\\,\\boxed{\\,?\\,}", accept:["Y(θ,φ)","Y(theta,phi)","Y","Y(θ, φ)","Y(theta, phi)"]}},
    {id:"M2C6.f.angular-nodes", name:"Angular nodes (planes or cones)", tex:"\\#\\,\\text{angular nodes}=l", kind:"rule", ref:"p. 22",
      blank:{tex:"\\#\\,\\text{angular nodes}=\\boxed{\\,?\\,}", accept:["l","ℓ","L"]}},
    {id:"M2C6.f.radial-nodes", name:"Radial nodes (spheres)", tex:"\\#\\,\\text{radial nodes}=n-l-1", kind:"rule", ref:"p. 22",
      blank:{tex:"\\#\\,\\text{radial nodes}=\\boxed{\\,?\\,}", accept:["n-l-1","n-ℓ-1","n - l - 1","n-1-l"]}},
    {id:"M2C6.f.total-nodes", name:"Total nodes", tex:"l+(n-l-1)=n-1", note:"Adding the two rules on p. 22. The notes don't print this line, but it follows directly.", kind:"rule", ref:"p. 22",
      blank:{tex:"\\#\\,\\text{total nodes}=\\boxed{\\,?\\,}", accept:["n-1","n - 1"]}}
  ],
  glossary:[
    {id:"M2C6.t.node", term:"Node", def:"A place where $\\Psi = 0$, so the probability of finding the electron there is zero.", ref:"p. 22"},
    {id:"M2C6.t.angular-node", term:"Angular node", def:"A flat plane or a cone through the nucleus where the angular factor $Y(\\theta,\\phi)=0$. There are $l$ of them.", ref:"p. 22"},
    {id:"M2C6.t.radial-node", term:"Radial node", def:"A sphere at a fixed distance from the nucleus where the radial factor $R(r)=0$. There are $n-l-1$ of them.", ref:"p. 22"},
    {id:"M2C6.t.boundary", term:"Boundary surface", def:"A surface that encloses most (here 90%) of the probability of finding the electron. The \"balloon\" pictures of orbitals.", ref:"p. 23"},
    {id:"M2C6.t.phase", term:"Phase (sign)", def:"Whether $\\Psi$ is positive or negative in a region. It is not a charge. Neighbouring lobes across a node have opposite signs.", ref:"p. 23"},
    {id:"M2C6.t.scatter", term:"Scatter (probability density) plot", def:"A cloud of dots where dot density is proportional to $|\\Psi|^2$: dense where the electron is likely, empty at nodes.", ref:"p. 24"}
  ],
  figures:{
    lab:{title:"The orbital lab", cap:"Hydrogen orbitals computed from $\\Psi = R(r)Y(\\theta,\\phi)$ (p. 21). The surface holds 90% of the probability. Warm solid lobes are +, cool hatched lobes are −. Turn on Nodes to see the radial spheres and the angular planes or cones.", ref:"pp. 21-23",
      model:{type:"orbital", params:{orbital:"3pz", mode:"surface", picker:"list", nodes:true, radial:false}},
      predict:{q:"Before you look: how many radial nodes does a $3p_z$ orbital have?", opts:[["0",false,"That is $2p$: $n-l-1 = 2-1-1 = 0$."],["1",true,"$n-l-1 = 3-1-1 = 1$: one sphere where the inner and outer parts of each lobe meet."],["2",false,"That would be $3s$ ($3-0-1$)."],["3",false,"A 3p orbital has $n - 1 = 2$ nodes in total, so it can't have 3 radial ones."]], keep:true, check:"Turn on Nodes and look for the sphere that cuts through each lobe."}},
    cloud:{title:"Scatter plots and boundary surfaces", cap:"The same orbital as a probability cloud: each dot is a possible electron position sampled from $|\\Psi|^2$. Filled dots are + phase, ring dots are − phase. The empty gaps are the nodes.", ref:"p. 24",
      model:{type:"orbital", params:{orbital:"2s", mode:"cloud", picker:"list", choices:["1s","2s","3s","2pz","3pz","3dz2"], radial:false}},
      predict:{q:"In a scatter plot of $2s$, what separates the small inner region from the big outer region?", opts:[["A flat empty plane through the nucleus",false,"Flat planes are angular nodes, and $2s$ has $l = 0$ of them."],["An empty spherical shell",true,"One radial node: a sphere at $r = 2a_0$ where $R(r) = 0$."],["Nothing: the dots thin out smoothly",false,"That is $1s$. $2s$ has one radial node."]], check:"Switch to Point cloud, pick 2s, and look for the empty ring. Then try 3s."}},
    qn:{title:"Change n, l and m_l", cap:"Pick the quantum numbers and the orbital updates. Only allowed combinations appear: $l$ goes from 0 to $n-1$ and $m_l$ from $-l$ to $+l$. Real orbitals like $p_x$ combine $+m_l$ and $-m_l$.", ref:"pp. 19-22",
      model:{type:"orbital", params:{orbital:"4dxy", mode:"surface", picker:"qn", maxN:4, nodes:true, radial:false}},
      predict:{q:"A $4d$ orbital: how many nodes in total?", opts:[["2",false,"That is only the angular nodes ($l = 2$)."],["3",true,"$n - 1 = 3$: two angular planes and one radial sphere."],["4",false,"Total nodes are $n - 1 = 3$."]], check:"Set n = 4, l = 2 and turn on Nodes. Count the planes and the spheres."}},
    nodecount:{title:"Node counter", cap:"Slide $n$ and $l$. The bar shows how the $n-1$ nodes split into angular and radial. Same shape (same $l$) gets more radial nodes as $n$ grows.", ref:"p. 22",
      build(host,{PLOT,M}){
        let n=3,l=1; const ctl=PLOT.controls(host); const svgHost=document.createElement("div"); host.append(svgHost);
        const out=document.createElement("div"); out.className="readout"; host.append(out);
        const sn=PLOT.slider(ctl,{label:"n",min:1,max:6,value:n,oninput:v=>{ n=v; if(l>n-1){ l=n-1; sl.set(l); } sl.max=n-1; sl.setAttribute("max",n-1); draw(); }});
        const sl=PLOT.slider(ctl,{label:"l",min:0,max:5,value:l,fmt:v=>`${v} (${L_LET[v]||"g"})`,oninput:v=>{ l=Math.min(v,n-1); if(v!==l) sl.set(l); draw(); }});
        function draw(){
          const ang=l, rad=n-l-1; const W=520,H=90; const u=W/Math.max(5,n-1||1);
          let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="${ang} angular and ${rad} radial nodes">`;
          for(let i=0;i<ang;i++) g+=`<rect x="${i*u}" y="20" width="${u-4}" height="34" rx="5" style="fill:var(--c);fill-opacity:.85"/><text x="${i*u+(u-4)/2}" y="42" text-anchor="middle" style="fill:var(--paper);font-size:12px">plane/cone</text>`;
          for(let i=0;i<rad;i++) g+=`<rect x="${(ang+i)*u}" y="20" width="${u-4}" height="34" rx="17" style="fill:var(--paper);stroke:var(--c);stroke-width:2;stroke-dasharray:5 3"/><text x="${(ang+i)*u+(u-4)/2}" y="42" text-anchor="middle" style="font-size:12px">sphere</text>`;
          if(n===1) g+=`<text x="4" y="42" style="font-size:13px">no nodes</text>`;
          g+=`<text x="0" y="12" style="font-size:11px">angular (l) = ${ang}</text><text x="${W}" y="12" text-anchor="end" style="font-size:11px">radial (n − l − 1) = ${rad}</text></svg>`;
          svgHost.innerHTML=g;
          out.innerHTML=M.rich(`$${n}${L_LET[l]||"g"}$: ${nodeWord(ang,"angular node")} + ${nodeWord(rad,"radial node")} = ${n-1} in total ($n-1$).`);
        }
        draw();
      }}
  },
  gens:[
    {id:"M2C6.g.count-nodes", title:"Count radial and angular nodes", skill:"Apply $l$ and $n-l-1$", ref:"p. 22",
      gen(R,d){
        const n=d===1?R.int(2,3):d===2?R.int(3,5):R.int(4,7); const l=R.int(d===1?0:1,Math.min(3,n-1));
        const lab=`${n}${L_LET[l]}`; const rad=n-l-1;
        return {prompt:`For a hydrogen $${lab}$ orbital, how many angular nodes and how many radial nodes are there?`,
          parts:[{label:"Angular nodes",answer:{type:"int",value:l}},{label:"Radial nodes",answer:{type:"int",value:rad}}],
          hint:`The letter gives $l$ (s = 0, p = 1, d = 2, f = 3). Angular nodes $= l$; radial nodes $= n-l-1$.`,
          steps:[`$${lab}$ means $n = ${n}$ and $l = ${l}$ (${L_LET[l]} = ${l}).`,`Angular nodes $= l = ${l}$.`,`Radial nodes $= n-l-1 = ${n}-${l}-1 = ${rad}$.`,`Check: total $= ${l}+${rad} = ${n-1} = n-1$.`],
          answerTeX:`${l} angular, ${rad} radial`};
      }},
    {id:"M2C6.g.identify", title:"Name the orbital from its nodes", skill:"Work backwards from node counts", ref:"p. 22",
      gen(R,d){
        const l=R.int(0,d===1?1:2); const rad=R.int(d===1?0:1,d===3?3:2); const n=rad+l+1;
        const sub=l===0?"":R.pick(ANG[l]); const label=`${n}${L_LET[l]}${sub?sub.slice(1):""}`;
        const planeTxt={"p_x":"the $yz$ plane","p_y":"the $xz$ plane","p_z":"the $xy$ plane","d_{xy}":"the $xz$ and $yz$ planes","d_{yz}":"the $xy$ and $xz$ planes","d_{xz}":"the $xy$ and $yz$ planes","d_{x^2-y^2}":"two vertical planes at 45° between the $x$ and $y$ axes","d_{z^2}":"two cones around the $z$ axis"};
        const angTxt=l===0?"no angular nodes":l===1?`one angular node (${planeTxt[sub]})`:`two angular nodes (${planeTxt[sub]})`;
        const acc=[label.replace(/[_{}^]/g,"")];
        return {prompt:`A hydrogen orbital has ${angTxt} and ${nodeWord(rad,"radial node")}. Which orbital is it? ${l?"Include the subscript.":""}`,
          answer:{type:"orbital",answer:acc},
          hint:"Angular nodes give $l$. Then $n = (\\text{radial nodes}) + l + 1$.",
          steps:[`Angular nodes $= l$, so $l = ${l}$ (${L_LET[l]}).`,`Radial nodes $= n-l-1 = ${rad}$, so $n = ${rad}+${l}+1 = ${n}$.`,l?`The node${l>1?"s":""} ${l>1?"are":"is"} ${planeTxt[sub]}, which fixes the subscript.`:"An s orbital has no subscript.",`The orbital is $${n}${L_LET[l]}${sub?sub.slice(1):""}$.`],
          answerTeX:`$${n}${L_LET[l]}${sub?sub.slice(1):""}$`};
      }},
    {id:"M2C6.g.allowed", title:"Does this orbital exist?", skill:"Allowed values of $l$", ref:"p. 19",
      gen(R,d){
        const n=R.int(1,d===1?3:5); const l=R.int(0,3); const ok=l<=n-1;
        return {prompt:`Is there a $${n}${L_LET[l]}$ orbital?`,
          answer:{type:"mc",options:["Yes","No"],correct:ok?0:1,keep:true},
          hint:"$l$ can be any whole number from 0 up to $n-1$.",
          steps:[`$${n}${L_LET[l]}$ means $n = ${n}$, $l = ${l}$.`,`Allowed $l$ for $n=${n}$: $0$ to $${n-1}$.`,ok?`$l = ${l}$ is allowed, so yes.`:`$l = ${l}$ is bigger than $n-1 = ${n-1}$, so no such orbital.`],
          answerTeX:ok?"Yes":"No"};
      }},
    {id:"M2C6.g.node-plane", title:"Where are the nodal planes?", skill:"Read the angular factor", ref:"p. 23",
      gen(R,d){
        const opts=d===1?["p_x","p_y","p_z"]:["d_{xy}","d_{yz}","d_{xz}","p_x","p_z"]; const sub=R.pick(opts);
        const planes={"p_x":["yz"],"p_y":["xz"],"p_z":["xy"],"d_{xy}":["xz","yz"],"d_{yz}":["xy","xz"],"d_{xz}":["xy","yz"]}[sub];
        const choices=["xy","xz","yz"];
        return {prompt:`Which plane${planes.length>1?"s are":" is"} a nodal plane for $${sub[0]}_{${sub.slice(2).replace(/[{}]/g,"")}}$? Select all that apply.`,
          answer:{type:"multi",options:choices.map(c=>`the $${c}$ plane`),correct:planes.map(p=>choices.indexOf(p))},
          hint:"$\\Psi = 0$ wherever the angular factor is zero. $Y \\propto x$ for $p_x$, $xy$ for $d_{xy}$, and so on. Find where those letters are zero.",
          steps:[`The angular factor of $${sub}$ is proportional to ${{"p_x":"$x$","p_y":"$y$","p_z":"$z$","d_{xy}":"$xy$","d_{yz}":"$yz$","d_{xz}":"$xz$"}[sub]} (p. 21).`,`It is zero where ${planes.map(p=>`$${"xyz".replace(p[0],"").replace(p[1],"")} = 0$`).join(" or ")}, which is the ${planes.map(p=>`$${p}$ plane`).join(" and the ")}.`],
          answerTeX:planes.map(p=>`$${p}$`).join(" and ")};
      }}
  ],
  exam:[
    {id:"M2C6.q1", ref:"p. 22", q:"Which statement about nodes in hydrogen orbitals is correct?", opts:[["A 3d orbital has one radial node.",false,"$n-l-1 = 3-2-1 = 0$."],["A 2p orbital has one angular node.",true,"$l = 1$, so one nodal plane."],["A 2s orbital has one angular node.",false,"$l = 0$: no angular nodes. Its one node is radial."],["A 4s orbital has 4 radial nodes.",false,"$4-0-1 = 3$."],["Angular nodes are always spheres.",false,"Angular nodes are planes or cones. Radial nodes are spheres."]]},
    {id:"M2C6.q2", ref:"p. 22", q:"An orbital has 2 angular nodes and 2 radial nodes. Which is it?", opts:[["3d",false,"3d has 0 radial nodes."],["4d",false,"4d has $4-2-1 = 1$ radial node."],["5d",true,"$l = 2$ and $n = 2+2+1 = 5$."],["5f",false,"f has 3 angular nodes."],["4p",false,"p has 1 angular node."]]},
    {id:"M2C6.q3", ref:"p. 23", q:"In a picture of $2p_z$, the lobe above the $xy$ plane is labelled + and the lobe below is labelled −. What do the signs mean?", opts:[["The top lobe holds a proton and the bottom lobe an electron.",false,"Both lobes are the same electron."],["$\\Psi$ is positive above the plane and negative below it.",true,"Phase is the sign of the wavefunction, not a charge."],["The electron is more likely to be in the + lobe.",false,"Probability is $|\\Psi|^2$, the same for both lobes."],["The bottom lobe is antibonding.",false,"Not in this course, and not what the sign means here."]]},
    {id:"M2C6.q4", ref:"p. 23", q:"Which orbital has two nodal cones instead of two nodal planes?", opts:[["$3d_{xy}$",false,"Its nodes are the $xz$ and $yz$ planes."],["$3d_{x^2-y^2}$",false,"Its nodes are planes at 45° to the axes."],["$3d_{z^2}$",true,"$Y \\propto 3z^2-r^2$ is zero on two cones about the $z$ axis."],["$3p_z$",false,"One plane and one radial sphere."]]},
    {id:"M2C6.q5", ref:"p. 22", multi:true, q:"Which of these orbitals have exactly one radial node? Select all that apply.", opts:[["2s",true,"$2-0-1 = 1$"],["3p",true,"$3-1-1 = 1$"],["3d",false,"$3-2-1 = 0$"],["4d",true,"$4-2-1 = 1$"],["4s",false,"$4-0-1 = 3$"]]}
  ],
  steps:[
    {type:"read", title:"An orbital is a 3D wave with two parts", ref:"p. 22", body:"<p>Each hydrogen orbital is a function of three coordinates. The notes split it into two pieces: $$\\Psi = R(r)\\,Y(\\theta,\\phi)$$ The <b>radial factor</b> $R(r)$ says how $\\Psi$ changes as you move straight out from the nucleus. It depends on $n$ and $l$. The <b>angular factor</b> $Y$ says how it changes as you turn around the nucleus at a fixed distance. It depends on $l$ and $m_l$.</p><p>Think of a lamp with a shade. How bright the light is depends on how far you stand from the bulb (the radial part) and which way you face the shade (the angular part). You need both to know the brightness at one spot.</p><p>You don't need to memorise the functions on p. 21. You need to read their consequences: shape, size and nodes.</p>"},
    {type:"read", title:"Nodes are where the electron is never found", ref:"p. 22", body:"<p>A <b>node</b> is a place where $\\Psi = 0$, so $|\\Psi|^2 = 0$: zero probability. Since $\\Psi$ is a product, it is zero whenever either factor is zero.</p><div class=\"box def\"><b class=\"t\">Two rules (p. 22)</b>Angular nodes (planes or cones, where $Y = 0$): $\\;l$<br>Radial nodes (spheres, where $R = 0$): $\\;n-l-1$</div><p>Add them and every orbital has $n-1$ nodes in total. A guitar string works the same way: the higher the note, the more still points along the string.</p>"},
    {type:"explore", title:"Turn a 3p orbital and find its nodes", fig:"lab", ref:"pp. 21-23", body:"<p>Drag to rotate. Pick different orbitals and turn <b>Nodes</b> on and off.</p><ul><li>$2p_z$ vs $3p_z$: same shape, but $3p_z$ has an inner pair of lobes. The sphere between them is its radial node.</li><li>$3d_{z^2}$: two lobes and a ring. The two cones are its angular nodes.</li><li>Every time you cross a node, the sign (+ or −) flips.</li></ul>"},
    {type:"example", title:"Count the nodes of 4f and 5d", ref:"p. 22 (like Example 2-8)", ex:{q:"How many radial and angular nodes do a $5d$ and a $4f$ orbital have?", steps:[{t:"$5d$: $n = 5$, $l = 2$.",why:"d means $l = 2$."},{t:"Angular nodes $= l = 2$. Radial nodes $= 5-2-1 = 2$.",why:"Total $= 4 = n - 1$. Check passes."},{t:"$4f$: $n = 4$, $l = 3$.",why:"f means $l = 3$."},{t:"Angular nodes $= 3$. Radial nodes $= 4-3-1 = 0$.",why:"Total $= 3 = n - 1$."}], ans:"$5d$: 2 angular, 2 radial. $4f$: 3 angular, 0 radial."}},
    {type:"try", title:"Count nodes", gen:"M2C6.g.count-nodes"},
    {type:"explore", title:"Same orbital, drawn as a cloud", fig:"cloud", ref:"p. 24", body:"<p>Boundary surfaces hide what is inside. A <b>scatter plot</b> shows the inside: dense where $|\\Psi|^2$ is large, empty at nodes.</p><p>Compare 1s, 2s and 3s. Count the empty rings: 0, 1, 2. That is $n-l-1$ with $l = 0$.</p>"},
    {type:"mcq", title:"Sign is not charge", q:"Two lobes of a $3d_{xz}$ orbital are labelled + and the other two −. Which is true?", opts:[["Electrons in the + lobes are attracted to the − lobes.",false,"There is one electron, and the signs are not charges."],["$|\\Psi|^2$ is the same in a + lobe and in the matching − lobe.",true,"Squaring removes the sign. The probability pattern is symmetric."],["The − lobes are smaller because they hold less probability.",false,"Matching lobes are the same size."]], after:"The sign matters later, when orbitals on two atoms overlap. For now: + and − mark the two sides of a node."},
    {type:"explore", title:"Build any orbital from n, l and m_l", fig:"qn", ref:"pp. 19-22", body:"<p>The quantum numbers are not just labels. Change $n$ and watch the orbital grow and gain radial nodes. Change $l$ and the shape changes. Change $m_l$ and it points a different way.</p>"},
    {type:"try", title:"Name the orbital from its nodes", gen:"M2C6.g.identify"},
    {type:"explore", title:"Where do the nodes go?", fig:"nodecount", ref:"p. 22", body:"<p>Slide $n$ up with $l$ fixed: only radial nodes are added. Slide $l$ up with $n$ fixed: radial nodes turn into angular ones. The total is always $n-1$.</p>"},
    {type:"firstline", title:"Find the first mistake", q:"A student works out the nodes of $4p_y$:", lines:["$4p_y$ has $n = 4$ and $l = 1$.","Angular nodes $= l = 1$: the $xz$ plane.","Radial nodes $= n - l = 3$.","Total nodes $= 1 + 3 = 4$."], wrong:2, why:"Radial nodes are $n - l - 1 = 2$, not $n - l$. Then the total is $3 = n - 1$."},
    {type:"try", title:"Which plane is the node?", gen:"M2C6.g.node-plane"},
    {type:"try", title:"Does it exist?", gen:"M2C6.g.allowed", diff:2},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
