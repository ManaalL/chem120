/* Two sample Test 2 papers written for this site, built to the real Test 2 format from the course's Test 2 info page:
   17 multiple choice, 1 mark each, 45 minutes. 6 questions from Module 2 (pp. 9-35), 6 from Module 3, 5 from Module 4 (pp. 1-14).
   Select-all questions are graded correct minus incorrect. No real test, assignment or participation question is reproduced:
   each question practises a skill the official samples test, with new species, numbers and wording.
   Numeric answers use data-sheet constants. Each option has a short reason. */
(function(){
const S=(set,lab)=>(n,lec,page,q,opts,extra={})=>({id:`${set}.${n}`,set,setLabel:lab,src:lab,lec,page,kind:"mc",q,opts,keep:true,...extra});
const A=S("T2A","Site sample test 1"), B=S("T2B","Site sample test 2");
const ALL="Select all that apply. You may select more than one, one, or none of the options.";
C120.addReview([
  /* ---------------- Site sample test 1 ---------------- */
  A(1,"M2C3","Module 2, pp. 9-10","The electron in a hydrogen atom drops from $n = 4$ to $n = 2$. What is the wavelength of the photon emitted? Choose the closest answer.",[
    ["486 nm",true,"$\\Delta E = R_H\\left(\\frac{1}{2^2}-\\frac{1}{4^2}\\right) = 4.086\\times10^{-19}$ J, so $\\lambda = \\frac{hc}{\\Delta E} = 4.86\\times10^{-7}$ m."],
    ["656 nm",false,"That is the $n = 3 \\to 2$ line."],
    ["434 nm",false,"That is the $n = 5 \\to 2$ line."],
    ["122 nm",false,"That is $n = 2 \\to 1$, in the ultraviolet."],
    ["1875 nm",false,"That is $n = 4 \\to 3$, in the infrared."]]),
  A(2,"M2C4","Module 2, pp. 12-14","An $\\ce{O2}$ molecule (molar mass 32.00 g mol$^{-1}$) moves at 480 m s$^{-1}$. What is its de Broglie wavelength? Choose the closest answer.",[
    ["$2.60\\times10^{-11}$ m",true,"Mass of one molecule: $\\frac{32.00\\times10^{-3}\\ \\text{kg mol}^{-1}}{6.022\\times10^{23}\\ \\text{mol}^{-1}} = 5.314\\times10^{-26}$ kg. Then $\\lambda = \\frac{h}{mv} = \\frac{6.626\\times10^{-34}}{(5.314\\times10^{-26})(480)}$."],
    ["$2.60\\times10^{-14}$ m",false,"The mass was left in grams. Use kilograms, since 1 J = 1 kg m$^2$ s$^{-2}$."],
    ["$4.31\\times10^{-35}$ m",false,"This uses the mass of a whole mole. Divide by Avogadro's number first."],
    ["$3.85\\times10^{10}$ m",false,"This is $\\frac{mv}{h}$, upside down."],
    ["$1.25\\times10^{-8}$ m",false,"Not $h/(mv)$ for these numbers."]]),
  A(3,"M2C6","Module 2, pp. 22-24","Which planes are the angular nodes of a $3d_{xz}$ orbital?",[
    ["the $xy$ plane and the $yz$ plane",true,"$d_{xz}$ goes as $xz$, which is zero when $z = 0$ (the $xy$ plane) or $x = 0$ (the $yz$ plane)."],
    ["the $xz$ plane and the $yz$ plane",false,"Those are the nodes of $d_{xy}$. The lobes of $d_{xz}$ lie in the $xz$ plane."],
    ["the $xy$ plane only",false,"A d orbital has $l = 2$ angular nodes."],
    ["two cones around the $z$ axis",false,"That is $d_{z^2}$."],
    ["the $x$ axis and the $z$ axis",false,"The lobes point between these axes, and nodes are planes, not lines."]]),
  A(4,"M2C6","Module 2, pp. 22-24","Which hydrogen orbital has three radial nodes and one angular node?",[
    ["5p",true,"One angular node means $l = 1$. Radial nodes $= n-l-1 = 3$ gives $n = 5$."],
    ["4p",false,"4p has $4-1-1 = 2$ radial nodes."],
    ["5d",false,"5d has 2 angular nodes and 2 radial nodes."],
    ["4d",false,"4d has 2 angular nodes and 1 radial node."],
    ["6s",false,"6s has no angular node and 5 radial nodes."]]),
  A(5,"M2C7","Module 2, pp. 25-27","A hydrogen orbital's radial factor $R(r)$ is zero at $r = 0$, then changes sign twice before it dies away. Which orbitals could it be? "+ALL,[
    ["3p",false,"3p has only $3-1-1 = 1$ radial node, so $R$ changes sign once."],
    ["4p",true,"$R(0) = 0$ means $l \\ge 1$. Two sign changes means 2 radial nodes: $4-1-1 = 2$."],
    ["5d",true,"$5-2-1 = 2$ radial nodes, and $R(0) = 0$ for $l = 2$."],
    ["4s",false,"For an s orbital $R$ is largest at $r = 0$, not zero."],
    ["4d",false,"4d has $4-2-1 = 1$ radial node."]],{multi:true}),
  A(6,"M2C8","Module 2, pp. 32-35","Which set of quantum numbers $(n,\\ l,\\ m_l,\\ m_s)$ could describe an electron in a 4f orbital?",[
    ["$(4,\\ 3,\\ -2,\\ +\\tfrac12)$",true,"f means $l = 3$, and $m_l = -2$ is within $-3$ to $+3$."],
    ["$(4,\\ 4,\\ 0,\\ +\\tfrac12)$",false,"$l$ can only go up to $n-1 = 3$."],
    ["$(4,\\ 3,\\ -4,\\ -\\tfrac12)$",false,"$|m_l|$ can't be bigger than $l = 3$."],
    ["$(4,\\ 2,\\ 1,\\ +\\tfrac12)$",false,"$l = 2$ is a 4d orbital."],
    ["$(4,\\ 3,\\ 1,\\ 0)$",false,"$m_s$ is $+\\tfrac12$ or $-\\tfrac12$, never 0."]]),
  A(7,"M3C1","Module 3, pp. 1-2","Which statements about orbital energies are true? "+ALL,[
    ["In a multielectron atom, the 2s subshell is lower in energy than the 2p subshell.",true,"Within a shell, s < p < d < f in a multielectron atom."],
    ["The 1s orbital of Ne is smaller and lower in energy than the 1s orbital of H.",true,"Energy and size of a given orbital both drop as $Z$ increases: more attraction to the nucleus."],
    ["In a multielectron atom, every orbital with the same $n$ has the same energy.",false,"That is only true for hydrogen (one electron)."],
    ["The subshells of a shell split in energy because of electron-electron repulsion.",true,"This is the notes' reason for s < p < d in a multielectron atom."],
    ["The energy of the 3p electron in Al is $-R_H/3^2$.",false,"$E_n = -R_H/n^2$ is only for hydrogen-like (one-electron) species."]],{multi:true}),
  A(8,"M3C3","Module 3, pp. 6-7","What is the ground-state electron configuration of copper (Z = 29)?",[
    ["$[\\mathrm{Ar}]\\,4s^2\\,3d^9$",false,"This is what the $n+l$ rule predicts. Cu is one of the two exceptions you need to know."],
    ["$[\\mathrm{Ar}]\\,4s^1\\,3d^{10}$",true,"Cu (like Cr) is an exception: one 4s electron moves to 3d."],
    ["$[\\mathrm{Ar}]\\,3d^{11}$",false,"A d subshell holds at most 10 electrons."],
    ["$[\\mathrm{Kr}]\\,4s^1\\,3d^{10}$",false,"The core before period 4 is [Ar]."],
    ["$[\\mathrm{Ar}]\\,4s^2\\,4d^9$",false,"After 4s comes 3d, not 4d."]]),
  A(9,"M3C4","Module 3, p. 8","What is the ground-state electron configuration of $\\ce{Co^3+}$?",[
    ["$[\\mathrm{Ar}]\\,3d^6$",true,"Co is $[\\mathrm{Ar}]\\,4s^2\\,3d^7$. Remove the two 4s electrons (highest $n$) first, then one 3d."],
    ["$[\\mathrm{Ar}]\\,4s^2\\,3d^4$",false,"Cations lose 4s electrons before 3d."],
    ["$[\\mathrm{Ar}]\\,4s^1\\,3d^5$",false,"Both 4s electrons go before any 3d."],
    ["$[\\mathrm{Ar}]\\,3d^7$",false,"That is $\\ce{Co^2+}$."],
    ["$[\\mathrm{Ar}]\\,4s^2\\,3d^7$",false,"That is neutral Co."]]),
  A(10,"M3C4","Module 3, pp. 8-9","Which ion is diamagnetic in its ground state?",[
    ["$\\ce{Zn^2+}$",true,"$[\\mathrm{Ar}]\\,3d^{10}$: every electron is paired."],
    ["$\\ce{Cu^2+}$",false,"$3d^9$ leaves one unpaired electron."],
    ["$\\ce{Fe^3+}$",false,"$3d^5$: five unpaired electrons."],
    ["$\\ce{Cr^3+}$",false,"$3d^3$: three unpaired electrons."],
    ["$\\ce{Ti^3+}$",false,"$3d^1$: one unpaired electron."]]),
  A(11,"M3C5","Module 3, pp. 11-12","Which list puts C, N, O and F in order of increasing first ionization energy?",[
    ["C < N < O < F",false,"This ignores the drop from group 15 to group 16."],
    ["C < O < N < F",true,"IE rises across the period, except that it drops from N (group 15) to O (group 16): O's fourth 2p electron is paired."],
    ["O < C < N < F",false,"O's IE is still above C's; the dip only puts O below N."],
    ["F < O < N < C",false,"This is reversed: IE increases left to right."],
    ["N < C < O < F",false,"N is higher than both C and O."]]),
  A(12,"M3C5","Module 3, p. 10","Which list puts these ions in order of decreasing radius: $\\ce{Mg^2+}$, $\\ce{Na+}$, $\\ce{F-}$, $\\ce{O^2-}$? (Each has 10 electrons. The notes don't tabulate ion sizes; reason from the radius argument on p. 10.)",[
    ["$\\ce{O^2-} > \\ce{F-} > \\ce{Na+} > \\ce{Mg^2+}$",true,"Same 10 electrons in each. More protons pull them in harder: O has 8, F 9, Na 11, Mg 12."],
    ["$\\ce{Mg^2+} > \\ce{Na+} > \\ce{F-} > \\ce{O^2-}$",false,"This is the reverse."],
    ["$\\ce{F-} > \\ce{O^2-} > \\ce{Na+} > \\ce{Mg^2+}$",false,"O has fewer protons than F, so $\\ce{O^2-}$ is larger."],
    ["$\\ce{Na+} > \\ce{Mg^2+} > \\ce{O^2-} > \\ce{F-}$",false,"Cations with the same electron count are smaller than the anions."],
    ["All four are the same size.",false,"Same number of electrons, but different nuclear charges."]]),
  A(13,"M4C1","Module 4, pp. 3-4","Ozone can be drawn as O–O=O, with three lone pairs on the singly bonded end O, one on the middle O and two on the doubly bonded end O. What are the formal charges on the single-bonded O, the middle O and the double-bonded O, in that order?",[
    ["$-1,\\ +1,\\ 0$",true,"FC = valence − lone-pair electrons − bonds. End O: $6-6-1 = -1$. Middle: $6-2-3 = +1$. Double-bonded end: $6-4-2 = 0$. They add to 0, the charge on $\\ce{O3}$."],
    ["$0,\\ 0,\\ 0$",false,"The sum is right, but the middle O has only one lone pair."],
    ["$-1,\\ 0,\\ +1$",false,"The +1 belongs to the middle O, which owns only 5 electrons."],
    ["$+1,\\ -1,\\ 0$",false,"Signs swapped: the end O with three lone pairs owns 7 electrons, one more than it brought."],
    ["$-2,\\ +2,\\ 0$",false,"Count bonds, not bonding electrons, when you subtract."]]),
  A(14,"M4C2","Module 4, pp. 6-9","In the neutral molecule $\\ce{XF3}$, X is bonded to three F atoms and also has two lone pairs. Every atom has a formal charge of zero. Which element could X be?",[
    ["N",false,"N would have 10 electrons around it; second-row atoms never have an expanded octet."],
    ["B",false,"$\\ce{BF3}$ has no lone pairs on B."],
    ["Cl",true,"FC = 0 means $7 - 4 - 3 = 0$: X brings 7 valence electrons, and Cl is in period 3, so 10 electrons around it is allowed."],
    ["P",false,"P brings 5: with two lone pairs its FC would be $5-4-3 = -2$."],
    ["Al",false,"Al brings 3 valence electrons."]]),
  A(15,"M4C2","Module 4, pp. 6-9","In which molecule does the central atom have fewer than eight electrons around it?",[
    ["$\\ce{BeH2}$",true,"Be makes two bonds and has no lone pairs: 4 electrons."],
    ["$\\ce{NH3}$",false,"3 bonds + 1 lone pair = 8."],
    ["$\\ce{CH4}$",false,"4 bonds = 8."],
    ["$\\ce{PCl5}$",false,"5 bonds = 10: an expanded octet, not an incomplete one."],
    ["$\\ce{H2O}$",false,"2 bonds + 2 lone pairs = 8."]]),
  A(16,"M4C3","Module 4, pp. 10-14","Which species are described by two or more equivalent resonance structures? "+ALL,[
    ["$\\ce{CO3^2-}$",true,"Three structures, each with the C=O at a different O. Same formal charges, same energy."],
    ["$\\ce{HCO2-}$ (formate, H on C)",true,"Two structures that swap which O has the double bond."],
    ["$\\ce{OCN-}$",false,"Its structures put the −1 on different elements (O or N), so they are non-equivalent."],
    ["$\\ce{H2O}$",false,"Only one structure."],
    ["$\\ce{NO3-}$",true,"Three equivalent structures, like carbonate."]],{multi:true}),
  A(17,"M4C3","Module 4, pp. 10-14","Which statement about resonance is correct?",[
    ["Resonance structures of a species have the atoms in different places.",false,"Resonance structures keep the same arrangement of atoms. Only the electrons move."],
    ["In the nitrite ion, $\\ce{NO2-}$, the two N–O bonds have the same length.",true,"Its two equivalent structures contribute equally, so both bonds are the same, between single and double."],
    ["Every resonance structure of a species contributes equally.",false,"Only equivalent ones do. Non-equivalent structures are major or minor contributors."],
    ["A structure with a formal charge of +2 on one atom is usually the most important.",false,"The most important structure usually has the smallest formal charges."],
    ["A species with resonance switches back and forth between its structures.",false,"The real species is one blended structure all the time."]]),

  /* ---------------- Site sample test 2 ---------------- */
  B(1,"M2C3","Module 2, pp. 9-10","How much energy is absorbed when the electron in a hydrogen atom is promoted from $n = 2$ to $n = 5$? Choose the closest answer.",[
    ["$4.58\\times10^{-19}$ J",true,"$\\Delta E = R_H\\left(\\frac{1}{2^2}-\\frac{1}{5^2}\\right) = 2.179\\times10^{-18}\\times0.210$."],
    ["$2.09\\times10^{-18}$ J",false,"That starts from $n = 1$, the ground state."],
    ["$5.45\\times10^{-19}$ J",false,"This is $R_H/2^2$, as if the electron left the atom."],
    ["$1.55\\times10^{-19}$ J",false,"That is $n = 3 \\to 5$."],
    ["$8.72\\times10^{-20}$ J",false,"This is $R_H/5^2$ alone."]]),
  B(2,"M2C4","Module 2, p. 15","The speed of an electron is known to within $\\pm1.0\\times10^{5}$ m s$^{-1}$. What is the smallest possible uncertainty in its position? Choose the closest answer.",[
    ["$5.8\\times10^{-10}$ m",true,"$\\Delta x \\ge \\frac{h}{4\\pi m\\,\\Delta v} = \\frac{6.626\\times10^{-34}}{4\\pi(9.109\\times10^{-31})(1.0\\times10^{5})}$."],
    ["$7.3\\times10^{-9}$ m",false,"This leaves out the $4\\pi$."],
    ["$1.2\\times10^{-9}$ m",false,"This uses $2\\pi$ instead of $4\\pi$."],
    ["$2.9\\times10^{-10}$ m",false,"This uses $8\\pi$."],
    ["$5.8\\times10^{-13}$ m",false,"The electron mass was put in grams."]]),
  B(3,"M2C6","Module 2, pp. 22-24","A hydrogen orbital has two angular nodes and two radial nodes. Which orbital is it?",[
    ["4d",false,"4d has $4-2-1 = 1$ radial node."],
    ["5d",true,"Two angular nodes: $l = 2$ (d). Radial nodes $n-l-1 = 2$ gives $n = 5$."],
    ["5f",false,"f has 3 angular nodes."],
    ["4f",false,"4f has 3 angular nodes and no radial node."],
    ["3d",false,"3d has no radial node."]]),
  B(4,"M2C6","Module 2, pp. 22-24","Which orbitals have zero electron density everywhere in the $xy$ plane? "+ALL,[
    ["$2p_z$",true,"Its one angular node is the $xy$ plane."],
    ["$3d_{xz}$",true,"Its nodes are the $xy$ and $yz$ planes."],
    ["$3d_{yz}$",true,"Its nodes are the $xy$ and $xz$ planes."],
    ["$3d_{x^2-y^2}$",false,"Its lobes lie in the $xy$ plane."],
    ["$3d_{z^2}$",false,"Its ring (torus) lies in the $xy$ plane."]],{multi:true}),
  B(5,"M2C7","Module 2, pp. 27-30","Which statement about the radial distribution function (RDF) of the hydrogen 3s orbital is correct?",[
    ["It has three maxima, and the outermost one is the tallest.",true,"Maxima $= n-l = 3$. For s orbitals the outer peak is the biggest, so it gives the most probable radius."],
    ["It has two maxima, one for each radial node.",false,"Maxima are one more than radial nodes: $2 + 1 = 3$."],
    ["Its tallest peak is the innermost one.",false,"The inner peaks are small for 3s."],
    ["It is largest at $r = 0$.",false,"The RDF is zero at $r = 0$ for every orbital, because of the $r^2$."],
    ["It has a single maximum at $9a_0$.",false,"A single maximum at $n^2 a_0$ is the pattern for 2p, 3d, 4f, where $n-l = 1$."]]),
  B(6,"M2C5","Module 2, pp. 16-17","Which statement is correct?",[
    ["$|\\psi|^2$ at a point gives the probability density for the electron there.",true,"$\\psi$ itself has no physical meaning; its square is a probability density."],
    ["The uncertainty principle comes from instruments that are not precise enough.",false,"It is a basic limit, not a measurement problem."],
    ["Only electrons have de Broglie wavelengths.",false,"Any moving particle has one, $\\lambda = h/mv$."],
    ["At the same speed, a heavier particle has a longer de Broglie wavelength.",false,"$\\lambda = h/mv$: more mass, shorter wavelength."],
    ["The value of $\\psi$ at a point is the probability of finding the electron there.",false,"It is $|\\psi|^2$ (times a small volume) that gives probability."]]),
  B(7,"M3C2","Module 3, pp. 3-5","Which set of quantum numbers $(n,\\ l,\\ m_l,\\ m_s)$ could describe the highest-energy electron of a ground-state aluminum atom?",[
    ["$(3,\\ 1,\\ -1,\\ +\\tfrac12)$",true,"Al is $[\\mathrm{Ne}]\\,3s^2\\,3p^1$: the last electron is in 3p, so $n = 3$, $l = 1$."],
    ["$(3,\\ 0,\\ 0,\\ +\\tfrac12)$",false,"That is a 3s electron, which is lower in energy than 3p."],
    ["$(3,\\ 2,\\ 0,\\ +\\tfrac12)$",false,"That is 3d, which is empty in Al."],
    ["$(4,\\ 0,\\ 0,\\ +\\tfrac12)$",false,"4s fills after 3p."],
    ["$(3,\\ 1,\\ 2,\\ -\\tfrac12)$",false,"$|m_l|$ can't be bigger than $l = 1$."]]),
  B(8,"M3C3","Module 3, pp. 6-7","Which element has the ground-state configuration $[\\mathrm{Ar}]\\,4s^1\\,3d^5$?",[
    ["V",false,"V is $[\\mathrm{Ar}]\\,4s^2\\,3d^3$."],
    ["Cr",true,"Cr is an exception: the $n+l$ rule predicts $4s^2\\,3d^4$, but one 4s electron moves to 3d."],
    ["Mn",false,"Mn is $[\\mathrm{Ar}]\\,4s^2\\,3d^5$: same number of 3d electrons, but 4s is full."],
    ["Fe",false,"Fe is $[\\mathrm{Ar}]\\,4s^2\\,3d^6$."],
    ["Cu",false,"Cu is $[\\mathrm{Ar}]\\,4s^1\\,3d^{10}$."]]),
  B(9,"M3C4","Module 3, pp. 8-9","How many unpaired electrons does $\\ce{Fe^2+}$ have in its ground state?",[
    ["0",false,"$3d^6$ can't pair all six with five orbitals by Hund's rule."],
    ["2",false,"Hund's rule: one electron in each of the five 3d orbitals before any pairs."],
    ["4",true,"$\\ce{Fe^2+}$ is $[\\mathrm{Ar}]\\,3d^6$: five singles, then one pair, leaving 4 unpaired."],
    ["5",false,"That is $\\ce{Fe^3+}$ ($3d^5$)."],
    ["6",false,"Only five 3d orbitals, so the sixth electron must pair."]]),
  B(10,"M3C4","Module 3, p. 9","Which atoms are paramagnetic in their ground state? "+ALL,[
    ["Ca",false,"$[\\mathrm{Ar}]\\,4s^2$: paired."],
    ["Ti",true,"$[\\mathrm{Ar}]\\,4s^2\\,3d^2$: two unpaired 3d electrons."],
    ["Zn",false,"$[\\mathrm{Ar}]\\,4s^2\\,3d^{10}$: paired."],
    ["P",true,"$[\\mathrm{Ne}]\\,3s^2\\,3p^3$: three unpaired 3p electrons."],
    ["Kr",false,"Every subshell is full."]],{multi:true}),
  B(11,"M3C5","Module 3, p. 10","Which of these atoms has the smallest atomic radius?",[
    ["Na",false,"Group 1: the largest in period 3."],
    ["Mg",false,"Left side of period 3, still large."],
    ["S",false,"Close, but Cl is one step further right."],
    ["Cl",true,"Radius shrinks left to right across a period: more protons, same shell."],
    ["K",false,"Period 4: a new shell, so larger."]]),
  B(12,"M3C6","Module 3, p. 14","Using the electron affinity table in the notes, which atom does NOT release energy when it gains an electron?",[
    ["C",false,"EA = −122 kJ mol$^{-1}$: energy released."],
    ["N",true,"EA = +7 kJ mol$^{-1}$ in the table: adding an electron costs energy instead of releasing it."],
    ["O",false,"EA = −141 kJ mol$^{-1}$."],
    ["Si",false,"EA = −134 kJ mol$^{-1}$."],
    ["Ca",false,"EA = −2 kJ mol$^{-1}$: small, but energy is still released."]]),
  B(13,"M4C1","Module 4, pp. 3-4","For the cyanate ion drawn as O=C=N$^-$, with two lone pairs on O, none on C and two on N, what are the formal charges on O, C and N, in that order?",[
    ["$0,\\ 0,\\ -1$",true,"O: $6-4-2 = 0$. C: $4-0-4 = 0$. N: $5-4-2 = -1$. They add to −1, the ion's charge."],
    ["$-1,\\ 0,\\ 0$",false,"That is the O–C≡N structure, with three lone pairs on O."],
    ["$0,\\ -1,\\ 0$",false,"C has four bonds and no lone pairs: FC 0."],
    ["$+1,\\ 0,\\ -2$",false,"That is the O≡C–N structure."],
    ["$0,\\ 0,\\ 0$",false,"The formal charges must add up to the charge on the ion, −1."]]),
  B(14,"M4C2","Module 4, pp. 6-9","How many lone pairs are on the central atom of $\\ce{XeF2}$?",[
    ["0",false,"Xe brings 8 valence electrons and uses only 2 in bonds."],
    ["1",false,"8 − 2 = 6 electrons left, not 2."],
    ["2",false,"That is $\\ce{XeF4}$."],
    ["3",true,"8 valence electrons − 2 in the two bonds = 6 electrons = 3 lone pairs, with FC 0 on Xe."],
    ["4",false,"That would need 10 nonbonding electrons."]]),
  B(15,"M4C2","Module 4, pp. 6-9","In the most important Lewis structure of the phosphate ion, $\\ce{PO4^3-}$, the phosphorus atom has:",[
    ["a formal charge of +1 and a complete octet",false,"That is the all-single-bond structure. P is in period 3, so it can expand its octet and lower its formal charge."],
    ["a formal charge of 0 and an expanded octet",true,"One P=O and three P–O$^-$: P has 5 bonds (10 electrons) and FC $5-0-5 = 0$. Smallest formal charges wins."],
    ["a formal charge of −3 and an expanded octet",false,"The −3 is spread over the oxygens, not on P."],
    ["a formal charge of +5 and a complete octet",false,"Formal charges this large are almost never right."],
    ["a formal charge of 0 and a complete octet",false,"With FC 0, P makes 5 bonds, which is 10 electrons."]]),
  B(16,"M4C3","Module 4, pp. 10-14","What is the N–O bond order in the nitrite ion, $\\ce{NO2-}$?",[
    ["1",false,"That ignores the double bond."],
    ["$1\\tfrac13$",false,"That is nitrate, $\\ce{NO3-}$: 4 bonds over 3 links."],
    ["$1\\tfrac12$",true,"Two equivalent structures: 3 bonds shared over 2 N–O links."],
    ["2",false,"Only one of the two forms has that bond doubled."],
    ["$2\\tfrac12$",false,"Too high."]]),
  B(17,"M4C1","Module 4, pp. 3-4","Which statement about formal charge is correct?",[
    ["The formal charges in a structure add up to the overall charge of the molecule or ion.",true,"Electrons can't be created or destroyed, so the sum always matches the total charge."],
    ["An atom's formal charge is its real charge in the molecule.",false,"It is a bookkeeping number for comparing structures."],
    ["An atom owns all of its bonding electrons.",false,"It owns all its lone-pair electrons but only half of its bonding electrons."],
    ["Placing +1 charges on two neighbouring atoms makes a structure more important.",false,"Like charges on adjacent atoms should be avoided."],
    ["In cyanate, a −1 formal charge sits better on N than on O.",false,"It sits better on O, the more electronegative atom."]])
]);
})();
