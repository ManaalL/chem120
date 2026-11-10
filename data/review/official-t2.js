/* The two official Test 2 sample tests posted on LEARN (Fall 2026, Version 1 with 18 questions and Version 2 with 19).
   Only the question number, a short topic label in our own words, the chapter it tests and an answer letter are stored here.
   The questions themselves are NOT on this site: Manaal works them on paper from the PDFs, then enters her letters to get them marked.
   Answer letters are this site's own solutions; the official solutions PDF on LEARN wins if they disagree.
   ans: one letter, or several letters for select-all. check:true marks a question whose figure makes the answer worth confirming. */
(function(){
const Q=(n,lec,topic,ans,why,extra={})=>({n,lec,topic,ans,why,multi:ans.length>1||!!extra.multi,...extra});
C120.addOfficial({id:"V1", title:"Official sample, Version 1", sub:"18 questions", drills:["D.nodeplane","D.nodecount","D.plot","D.nodecount","D.plot","D.plot","D.transition","D.lastqn","D.trendsall","D.unpaired","D.ionconfig","D.radius","D.ionsize","D.fc","D.mystery","D.fc","D.m4true","D.resonance"], qs:[
  Q(1,"M2C6","Angular node of a p orbital: which plane","B","A p orbital's angular node is the plane perpendicular to its axis: for $p_y$ that is the $xz$ plane."),
  Q(2,"M2C6","Pick the orbital from its angular and radial node counts","D","Two angular nodes means $l = 2$; one radial node means $n-l-1 = 1$, so $n = 4$: a 4d orbital."),
  Q(3,"M2C6","Name an s orbital from a picture of its nodes","A","One spherical node inside the sphere: $n - 0 - 1 = 1$, so 2s.",{check:true}),
  Q(4,"M2C6","Find the incorrect statement (nodes, Pauli, unpaired electrons, RDF)","D","A d orbital has $l = 2$ angular nodes, not three. The other statements are true."),
  Q(5,"M2C7","Read an R(r) plot to name the orbital after an emission","B","$R$ is not zero at $r = 0$, so it is an s orbital; it changes sign twice, so 2 radial nodes: 3s. It is lower in energy than 5d, so energy is released.",{check:true}),
  Q(6,"M2C7","Read an RDF plot to name the orbital","A","Two peaks with the outer one tallest: $n - l = 2$ maxima, an s-type pattern. Of the options, 2s.",{check:true}),
  Q(7,"M2C3","Energy absorbed for a hydrogen transition from the ground state","B","$\\Delta E = R_H(1 - 1/3^2) = 1.94\\times10^{-18}$ J. The 3p label doesn't matter: in hydrogen energy depends only on $n$."),
  Q(8,"M3C2","Which atom's last electron has the given n, l, m_l, m_s","A","$n = 3, l = 1$ is 3p. Only S, of the options, has its highest-energy electron in 3p."),
  Q(9,"M3C5","Periodic trends, select all (radius, IE, EA, magnetism)","BCD","Radius grows down a group (P > N) and to the left (K > Ti); IE grows to the right (Ti > K). I has an odd electron count; Xe is all paired. Br is smaller than As and its EA is more negative, and Cl has a higher IE than S."),
  Q(10,"M3C4","Most unpaired electrons (watch the Cr exception)","C","Cr is $[\\mathrm{Ar}]\\,4s^1\\,3d^5$: six unpaired. Fe has 4, Co 3, Al and Cl 1."),
  Q(11,"M3C4","Configuration of a transition-metal 2+ ion","C","Ni is $[\\mathrm{Ar}]\\,4s^2\\,3d^8$; the ion loses the 4s electrons first: $[\\mathrm{Ar}]\\,3d^8$."),
  Q(12,"M3C5","How atomic radius changes across a period","E","Radius decreases steadily from left to right across a period."),
  Q(13,"M3C5","Order a neutral atom and its ions by size","E","Adding an electron makes it bigger, removing one makes it smaller: anion > atom > cation."),
  Q(14,"M4C1","Bonding and lone pairs on the central atom of an oxoacid","C","In the best structure N has one double bond and two single bonds: four bonding pairs, no lone pair, FC +1."),
  Q(15,"M4C2","Identify the central atom from its bonds, lone pairs and charge","B","Four bonds + two lone pairs = 12 electrons, so E must be past period 2. FC on E is $V - 4 - 4$, and with the ion's −1 on E, $V = 7$: Br."),
  Q(16,"M4C1","Bond type and formal charges in a diatomic ion","C","A triple bond with one lone pair on each atom gives C a −1 formal charge and N zero."),
  Q(17,"M4C3","Statements about bond types and resonance","E","A covalent bond is a shared pair; ionic bonding is electron transfer; only equivalent structures contribute equally. None of the statements is true."),
  Q(18,"M4C3","Which species have two equivalent resonance structures, select all","BC","Ozone and nitrite each have two structures that only swap which O has the double bond. Thiocyanate's structures are non-equivalent; the other two have no resonance.")
]});
C120.addOfficial({id:"V2", title:"Official sample, Version 2", sub:"19 questions", drills:["D.debroglie","D.qnumbers","D.plot","D.nodecount","D.nodecount","D.transition","D.m2true","D.qnumbers","D.config","D.ionconfig","D.radius","D.unpaired","D.multie","D.ie","D.ea","D.lonepairs","D.fc","D.lonepairs","D.lonepairs"], qs:[
  Q(1,"M2C4","de Broglie wavelength of a molecule: solve for speed","B","Mass of one molecule = molar mass in kg ÷ $N_A$; then $v = h/(m\\lambda)$. It comes out around $10^{-2}$ m s$^{-1}$."),
  Q(2,"M2C5","Name the orbital from n, l and m_l","C","$n = 3$ with $l = 2$ is 3d; $m_l$ only picks which 3d."),
  Q(3,"M2C7","Read an R² plot: which statements fit, select all","C","Three maxima and $R^2$ starting near zero: 2 radial nodes with $l \\ge 1$, which fits 5d (or 4p). It does not fit 3p, and $R^2$ alone doesn't give the most probable radius.",{check:true,multi:true}),
  Q(4,"M2C6","Angular and radial nodes of a 5d orbital","D","Angular = $l$ = 2; radial = $n-l-1$ = 2."),
  Q(5,"M2C6","Name a d orbital from a 3D picture","D","Two lobes on z with a ring is a $d_{z^2}$ shape; the extra inner lobes of opposite phase mean a radial node, so 4$d_{z^2}$.",{check:true}),
  Q(6,"M2C3","Which hydrogen transition gives the longest wavelength","C","Longest wavelength means smallest energy gap: $n = 3 \\to 4$ has the smallest $\\left|\\frac{1}{n_1^2}-\\frac{1}{n_2^2}\\right|$."),
  Q(7,"M2C4","Statements about de Broglie, ψ², orbital size and Heisenberg","B","$|\\psi|^2\\,dV$ is the probability of finding the electron in the small volume $dV$. Orbitals shrink as $Z$ grows, so hydrogen's 3d is bigger than helium's."),
  Q(8,"M2C5","Pick the allowed set of four quantum numbers","B","$l < n$, $|m_l| \\le l$ and $m_l$ a whole number, $m_s = \\pm\\tfrac12$. Only $(2, 1, -1, -\\tfrac12)$ passes."),
  Q(9,"M3C3","Configuration of an exception atom","C","Cr is one of the two exceptions: $[\\mathrm{Ar}]\\,4s^1\\,3d^5$."),
  Q(10,"M3C4","Configuration of a transition-metal 2+ ion","D","Lose the 4s electrons first: $[\\mathrm{Ar}]\\,3d^8$."),
  Q(11,"M3C5","Largest atomic radius","D","Down and to the left is biggest: Rb, period 5 group 1."),
  Q(12,"M3C4","Which atom is diamagnetic","B","Be is $1s^2\\,2s^2$: all paired."),
  Q(13,"M3C1","Orbital energies in multielectron atoms","D","s is below p in the same shell, electron-electron repulsion splits the subshells, and $-R_H/n^2$ only works for one-electron species. All three are true."),
  Q(14,"M3C5","Highest ionization energy from configurations","D","A halogen has the highest IE in its period, and IE falls down a group: the period 3 halogen (Cl) wins."),
  Q(15,"M3C6","Smallest electron affinity (magnitude)","D","The noble gas: its EA is listed as > 0 in the table, it doesn't hold an extra electron."),
  Q(16,"M4C2","Lone pairs on the central atom of an AX4 molecule","B","Se brings 6, uses 4 in bonds: one lone pair (10 electrons, fine in period 4)."),
  Q(17,"M4C3","Two structures with different connections: formal charges and resonance","D","The second structure has a different skeleton, so they are not resonance structures. Count FC atom by atom: the O between Cl and F has 2 bonds and 2 lone pairs, FC 0."),
  Q(18,"M4C2","Best Lewis structure of an expanded-octet molecule: statements","D","S makes one double bond to O, single bonds to each F, and keeps a lone pair, with every FC zero."),
  Q(19,"M4C2","Best Lewis structure of a boron trihalide: statements, select all","BC","B makes three single bonds, has FC 0 and only 6 electrons: an incomplete octet.",{multi:true})
]});
})();
