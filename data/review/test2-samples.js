/* Two sample Test 2 papers written for this site in the CHEM 120 test format (five options, one mark each, some select-all).
   Coverage assumed: everything after Test 1 (Module 2 from p. 12, Modules 3 and 4). No real test or assignment question is reproduced.
   Numeric answers use data-sheet constants. Each option has a short reason. */
(function(){
const S=(set,lab)=>(n,lec,page,q,opts,extra={})=>({id:`${set}.${n}`,set,setLabel:lab,src:lab,lec,page,kind:"mc",q,opts,keep:true,...extra});
const A=S("T2A","Sample Test 2, version A"), B=S("T2B","Sample Test 2, version B");
const ALL="Select all that apply. You may select more than one, one, or none of the options.";
C120.addReview([
  A(1,"M2C4","Module 2, p. 14","What is the de Broglie wavelength of an electron moving at $2.50\\times10^{6}$ m s$^{-1}$? Choose the closest answer.",[
    ["$2.91\\times10^{-10}$ m",true,"$\\lambda=\\frac{h}{mv}=\\frac{6.626\\times10^{-34}}{(9.109\\times10^{-31})(2.50\\times10^{6})}=2.91\\times10^{-10}$ m."],
    ["$2.91\\times10^{-4}$ m",false,"Off by $10^6$: the speed was left out of the denominator."],
    ["$3.44\\times10^{9}$ m",false,"This is $\\frac{mv}{h}$, the reciprocal."],
    ["$1.16\\times10^{-9}$ m",false,"This uses $2\\pi$ where it doesn't belong."],
    ["$7.27\\times10^{-11}$ m",false,"Not $h/(mv)$ for these numbers."]]),
  A(2,"M2C5","Module 2, pp. 18-19","Which set of quantum numbers $(n,\\ l,\\ m_l)$ is NOT allowed?",[
    ["$(3,\\ 2,\\ -2)$",false,"$l \\le n-1$ and $|m_l|\\le l$: allowed."],
    ["$(2,\\ 1,\\ 0)$",false,"Allowed: a 2p orbital."],
    ["$(4,\\ 0,\\ 0)$",false,"Allowed: 4s."],
    ["$(2,\\ 2,\\ 1)$",true,"$l$ can only go up to $n-1 = 1$."],
    ["$(5,\\ 3,\\ -3)$",false,"Allowed: a 5f orbital."]]),
  A(3,"M2C6","Module 2, p. 22","How many radial and angular nodes does a $5f$ orbital have?",[
    ["1 radial, 3 angular",true,"$l = 3$; radial $= n-l-1 = 5-3-1 = 1$."],
    ["2 radial, 3 angular",false,"Radial nodes are $n-l-1$, not $n-l$."],
    ["4 radial, 0 angular",false,"That would be 5s."],
    ["1 radial, 2 angular",false,"f means $l = 3$, so 3 angular nodes."],
    ["0 radial, 4 angular",false,"Total nodes are $n-1 = 4$, split 3 angular and 1 radial."]]),
  A(4,"M2C7","Module 2, pp. 25-27","Which statements about the hydrogen $3s$ orbital are true? "+ALL,[
    ["The plot of $R(r)$ is not zero at $r = 0$.",true,"For s orbitals $R$ is largest at the nucleus."],
    ["The radial distribution function $r^2R^2$ has 3 maxima.",true,"Maxima $= n-l = 3$."],
    ["It has 2 radial nodes.",true,"$n-l-1 = 2$."],
    ["Its most probable radius is at the first (innermost) maximum of $r^2R^2$.",false,"For 3s the tallest peak is the outermost one."],
    ["It has one angular node.",false,"$l = 0$: no angular nodes."]],{multi:true}),
  A(5,"M2C8","Module 2, pp. 19-20 and 32","What is the maximum number of electrons in an atom that can have $n = 4$ and $m_l = -1$?",[
    ["2",false,"That counts only one orbital."],
    ["6",true,"$l = 1, 2, 3$ each has one orbital with $m_l=-1$: 3 orbitals × 2 electrons."],
    ["8",false,"Four orbitals don't have $m_l = -1$ here: $l = 0$ only has $m_l = 0$."],
    ["14",false,"That is the capacity of one f subshell."],
    ["32",false,"That is all of $n = 4$ ($2n^2$)."]]),
  A(6,"M3C2","Module 3, pp. 3-6","What is the ground-state electron configuration of cobalt (Z = 27)?",[
    ["$[\\mathrm{Ar}]\\,4s^2\\,3d^7$",true,"Fill 4s before 3d: 2 + 7 = 9 electrons past [Ar]."],
    ["$[\\mathrm{Ar}]\\,3d^9$",false,"4s fills first in the neutral atom."],
    ["$[\\mathrm{Ar}]\\,4s^1\\,3d^8$",false,"Only Cr and Cu (in this row) move an electron out of 4s."],
    ["$[\\mathrm{Kr}]\\,4s^2\\,3d^7$",false,"The core before period 4 is [Ar]."],
    ["$[\\mathrm{Ar}]\\,4s^2\\,4d^7$",false,"After 4s comes 3d, not 4d."]]),
  A(7,"M3C4","Module 3, p. 8","What is the ground-state electron configuration of $\\ce{Fe^3+}$?",[
    ["$[\\mathrm{Ar}]\\,3d^5$",true,"Fe is [Ar]4s²3d⁶; remove both 4s electrons first, then one 3d."],
    ["$[\\mathrm{Ar}]\\,4s^2\\,3d^3$",false,"Cations lose the highest-$n$ electrons (4s) first."],
    ["$[\\mathrm{Ar}]\\,4s^1\\,3d^4$",false,"Both 4s electrons go before any 3d."],
    ["$[\\mathrm{Ar}]\\,3d^6$",false,"That is $\\ce{Fe^2+}$."],
    ["$[\\mathrm{Ar}]\\,4s^2\\,3d^9$",false,"Adding electrons makes an anion."]]),
  A(8,"M3C4","Module 3, p. 9","Which atoms are paramagnetic in their ground state? "+ALL,[
    ["Na",true,"One unpaired 3s electron."],
    ["Mg",false,"3s² is paired."],
    ["Zn",false,"4s²3d¹⁰: all paired."],
    ["O",true,"2p⁴: by Hund's rule two electrons are unpaired."],
    ["Ne",false,"Every subshell is full."]],{multi:true}),
  A(9,"M3C5","Module 3, pp. 11-12","Which of these atoms has the largest first ionization energy?",[
    ["Na",false,"Group 1: the lowest in period 3."],
    ["Mg",false,"Lower than P and S."],
    ["Al",false,"Its 3p electron is easy to remove."],
    ["P",true,"P beats S: removing an electron from S breaks up a paired 3p orbital, which is easier (the same reason N beats O)."],
    ["S",false,"S is just below P, like O is just below N."]]),
  A(10,"M3C6","Module 3, p. 14","Using the electron affinity table in the notes, which atom releases the most energy when it gains an electron?",[
    ["C",false,"−122 kJ/mol."],["N",false,"+7 kJ/mol: energy is needed."],["O",false,"−141 kJ/mol."],["F",false,"−328 kJ/mol, slightly less than Cl."],["Cl",true,"−349 kJ/mol, the most negative in the table."]]),
  A(11,"M4C1","Module 4, p. 4","In a Lewis structure of $\\ce{SO4^2-}$ with four S–O single bonds and an octet on every oxygen, what is the formal charge on S?",[
    ["$+2$",true,"$6 - 0 - \\tfrac12(8) = +2$."],["$0$",false,"That needs two S=O double bonds."],["$-2$",false,"The −2 belongs to the whole ion, spread over the O atoms."],["$+1$",false,"S owns 4 electrons, not 5."],["$+4$",false,"Count half of the bonding electrons, not none."]]),
  A(12,"M4C3","Module 4, pp. 10-12","Which species is represented by two or more equivalent resonance structures?",[
    ["$\\ce{CH4}$",false,"Only single bonds: no resonance."],["$\\ce{H2O}$",false,"No double bond to move."],["$\\ce{NO2-}$",true,"The double bond can sit on either O: two equivalent forms."],["$\\ce{NH4+}$",false,"Only single bonds."],["$\\ce{CCl4}$",false,"Only single bonds."]]),
  A(13,"M4C5","Module 4, p. 18","What is the molecular geometry of $\\ce{BrF5}$?",[
    ["octahedral",false,"That is the electron geometry (6 groups)."],["square planar",false,"That needs 2 lone pairs."],["trigonal bipyramidal",false,"That is 5 groups with no lone pairs."],["see-saw",false,"That is 4 bonds + 1 lone pair on 5 groups."],["square pyramidal",true,"5 bonds + 1 lone pair = 6 groups: square pyramidal."]]),
  A(14,"M4C6","Module 4, pp. 19-20","Which molecules are polar? "+ALL,[
    ["$\\ce{NH3}$",true,"Trigonal pyramidal: the N–H dipoles don't cancel."],["$\\ce{CO2}$",false,"Linear: the two C=O dipoles cancel."],["$\\ce{BF3}$",false,"Trigonal planar: the three dipoles cancel."],["$\\ce{H2O}$",true,"Bent: the O–H dipoles add."],["$\\ce{CCl4}$",false,"Tetrahedral and symmetric: dipoles cancel."]],{multi:true}),
  A(15,"M4C4","Module 4, p. 15","Which ionic compound has the largest lattice energy (in magnitude)?",[
    ["LiF",false,"Charges are only +1 and −1."],["NaCl",false,"+1 and −1, and larger ions than LiF."],["KBr",false,"+1 and −1 with large ions."],["MgO",true,"$q_1q_2 = (+2)(-2)$ and small ions: by far the largest $|PE|$."],["CsI",false,"+1 and −1 with the largest ions."]]),

  B(1,"M2C4","Module 2, p. 15","An electron is confined to a region $1.0\\times10^{-10}$ m wide. What is the minimum uncertainty in its speed? Choose the closest answer.",[
    ["$5.8\\times10^{5}$ m s$^{-1}$",true,"$\\Delta p \\ge \\frac{h}{4\\pi\\Delta x} = 5.27\\times10^{-25}$ kg m s⁻¹, then $\\Delta v = \\Delta p/m_e$."],
    ["$7.3\\times10^{6}$ m s$^{-1}$",false,"This is $h/(m\\Delta x)$, missing the $4\\pi$."],
    ["$1.2\\times10^{6}$ m s$^{-1}$",false,"This uses $2\\pi$ instead of $4\\pi$."],
    ["$5.3\\times10^{-25}$ m s$^{-1}$",false,"That is $\\Delta p$, not $\\Delta v$."],
    ["$5.8\\times10^{-5}$ m s$^{-1}$",false,"The power of ten has the wrong sign."]]),
  B(2,"M2C5","Module 2, p. 19","How many orbitals are there in the $n = 4$ shell?",[["4",false,"That is the number of subshells."],["8",false,"Not $2n$."],["9",false,"That is $n = 3$."],["16",true,"$n^2 = 16$: one 4s, three 4p, five 4d, seven 4f."],["32",false,"That is the number of electrons ($2n^2$)."]]),
  B(3,"M2C6","Module 2, p. 22","Which orbital has 2 radial nodes and 1 angular node?",[["3p",false,"3p has 1 radial node."],["4p",true,"$l = 1$ and $n = 2+1+1 = 4$."],["3d",false,"3d has 2 angular, 0 radial."],["4d",false,"4d has 2 angular, 1 radial."],["5p",false,"5p has 3 radial nodes."]]),
  B(4,"M2C7","Module 2, p. 27","The radial distribution function of the hydrogen $2p$ orbital peaks at $r = 4a_0$. What is the most probable distance from the nucleus? ($a_0 = 52.9$ pm)",[["52.9 pm",false,"That is the 1s value."],["106 pm",false,"That is $2a_0$."],["212 pm",true,"$4 \\times 52.9 = 212$ pm."],["2.12 pm",false,"Off by 100."],["159 pm",false,"That is $3a_0$."]]),
  B(5,"M2C8","Module 2, p. 32","Which statement about electron spin is correct?",[["Every electron has spin quantum number $s = \\tfrac12$, and $m_s$ is $+\\tfrac12$ or $-\\tfrac12$.",true,"$s$ is fixed; $m_s$ has two values."],["Paired electrons have $s = 0$.",false,"$s$ is $\\tfrac12$ for every electron."],["$m_s$ can be $-1$, $0$ or $+1$.",false,"Those are $m_l$ values for a p subshell."],["Spin was predicted by the Bohr model.",false,"It came from experiments like Stern-Gerlach."],["Two electrons in one orbital must have the same $m_s$.",false,"Pauli: they must differ."]]),
  B(6,"M3C3","Module 3, pp. 6-7","Which ground-state configurations are correct? "+ALL,[["Cr: $[\\mathrm{Ar}]\\,4s^1\\,3d^5$",true,"One of the two exceptions to know."],["Cu: $[\\mathrm{Ar}]\\,4s^2\\,3d^9$",false,"Cu is $[\\mathrm{Ar}]\\,4s^1\\,3d^{10}$."],["Ca: $[\\mathrm{Ar}]\\,4s^2$",true,"Group 2, period 4."],["Ga: $[\\mathrm{Ar}]\\,4s^2\\,3d^{10}\\,4p^1$",true,"3d fills before 4p."],["Mn: $[\\mathrm{Ar}]\\,4s^1\\,3d^6$",false,"Mn is $[\\mathrm{Ar}]\\,4s^2\\,3d^5$."]],{multi:true}),
  B(7,"M3C3","Module 3, p. 6","Which element has the ground-state configuration $[\\mathrm{Kr}]\\,5s^2\\,4d^{10}\\,5p^3$?",[["As",false,"As is period 4: $[\\mathrm{Ar}]4s^23d^{10}4p^3$."],["Sb",true,"Period 5, group 15."],["Bi",false,"Bi is period 6."],["Sn",false,"Sn ends in $5p^2$."],["Te",false,"Te ends in $5p^4$."]]),
  B(8,"M3C4","Module 3, p. 8","Which ion is isoelectronic with argon?",[["$\\ce{Na+}$",false,"Same as Ne."],["$\\ce{K+}$",true,"19 − 1 = 18 electrons, like Ar."],["$\\ce{Mg^2+}$",false,"Same as Ne."],["$\\ce{Br-}$",false,"Same as Kr."],["$\\ce{Zn^2+}$",false,"28 electrons."]]),
  B(9,"M3C5","Module 3, p. 10","Which list puts the atoms in order of increasing atomic radius?",[["F < O < S < Na",true,"Radius grows down a group (O to S) and to the left across a period (S to Na)."],["Na < S < O < F",false,"This is the reverse."],["O < F < S < Na",false,"F is smaller than O (further right in period 2)."],["F < S < O < Na",false,"S is below O, so it is larger."],["S < F < O < Na",false,"S is in period 3, larger than the period 2 atoms."]]),
  B(10,"M3C6","Module 3, p. 15","Using the electronegativity values in the notes, which bond is the most polar?",[["C–H",false,"ΔEN = 0.4."],["N–H",false,"ΔEN = 0.9."],["O–H",false,"ΔEN = 1.4."],["H–Cl",false,"ΔEN = 0.9."],["H–F",true,"ΔEN = 4.0 − 2.1 = 1.9, the largest."]]),
  B(11,"M4C2","Module 4, p. 5","How many lone pairs are on the central atom of $\\ce{XeF4}$?",[["0",false,"Xe brings 8 valence electrons; only 4 are used in bonds."],["1",false,"Count again: 8 − 4 = 4 electrons."],["2",true,"8 valence electrons − 4 in bonds = 4 = 2 lone pairs."],["3",false,"That would be $\\ce{XeF2}$."],["4",false,"Too many."]]),
  B(12,"M4C2","Module 4, p. 5","In which molecule does the central atom have more than eight electrons around it?",[["$\\ce{BF3}$",false,"B has only 6: an incomplete octet."],["$\\ce{NH3}$",false,"Exactly 8."],["$\\ce{BrF3}$",true,"3 bonds + 2 lone pairs = 10 electrons on Br."],["$\\ce{CO2}$",false,"Exactly 8 on C."],["$\\ce{H2O}$",false,"Exactly 8 on O."]]),
  B(13,"M4C3","Module 4, pp. 10-12","What is the N–O bond order in the nitrate ion, $\\ce{NO3-}$?",[["1",false,"That ignores the double bond."],["$1\\tfrac13$",true,"4 bonds shared over 3 equivalent N–O links."],["$1\\tfrac12$",false,"That is nitrite, $\\ce{NO2-}$."],["2",false,"Only one form has that bond doubled."],["$2\\tfrac23$",false,"Too high."]]),
  B(14,"M4C5","Module 4, p. 18","What is the electron (VSEPR) geometry around the sulfur atom in $\\ce{SO2}$?",[["linear",false,"That would be 2 groups."],["trigonal planar",true,"2 bonded atoms + 1 lone pair = 3 groups."],["tetrahedral",false,"That would be 4 groups."],["bent",false,"Bent is the molecular geometry, not the electron geometry."],["trigonal pyramidal",false,"That is a molecular geometry for 4 groups."]]),
  B(15,"M4C7","Module 4, p. 21","Butanone has the condensed formula $\\ce{CH3CH2COCH3}$. What is its molecular formula?",[["$\\ce{C4H8O}$",true,"4 C, 3 + 2 + 3 = 8 H, 1 O."],["$\\ce{C4H10O}$",false,"That has no C=O (an alcohol or ether)."],["$\\ce{C3H6O}$",false,"That is propanone."],["$\\ce{C4H6O}$",false,"Two hydrogens short."],["$\\ce{C5H10O}$",false,"One carbon too many."]])
]);
})();
