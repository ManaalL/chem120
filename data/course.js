/* Course structure: modules, chapters, graded work and key dates for CHEM 120, Fall 2026.
   Modules are the course-notes modules. Each chapter is one class (or one topic block) and cites printed course-notes pages.
   Inside each module, chapters are grouped by the timed quiz (Participation Challenge) or test that first covers them.
   To add Module 5: add it to `modules`, add its chapters to `schedule`, list them under the right assessment, then add data/M5C1.js and so on. */
window.C120 = window.C120 || {};
C120.COURSE = {
  code:"CHEM 120", name:"Physical and Chemical Properties of Matter", term:"Fall 2026", school:"University of Waterloo",
  /* the next test. Date from the course calendar. Time and coverage are assumed (Test 1 ran 8:30 to 9:15 for every section and covered everything up to it). */
  test:{id:"T2", date:"2026-11-11", time:"08:30", end:"09:15", label:"Test 2", assumed:"Time and coverage are assumed from Test 1. Change the date and time on this page if yours differ.",
    covers:"everything after Test 1: Module 2 from page 12, Module 3 and Module 4", format:"about 15 multiple choice questions, 1 mark each, five options, some select-all, 45 minutes, scientific calculator and the data sheet",
    chapters:["M2C4","M2C5","M2C6","M2C7","M2C8","M3C1","M3C2","M3C3","M3C4","M3C5","M3C6","M4C1","M4C2","M4C3","M4C4","M4C5","M4C6","M4C7"],
    alsoReview:["M2C1","M2C2","M2C3"]},
  modules:[
    {id:"m1", n:1, title:"Essential Review and Green Chemistry Metrics", short:"Reactions, stoichiometry, green metrics", pages:31,
      chapters:["M1C1","M1C2","M1C3","M1C4","M1C5","M1C6","M1C7"],
      topics:["Balancing and classifying reactions","Solubility, precipitation and net ionic equations","Stoichiometry, limiting reagents and yield","Mixtures, atom economy and the E-factor"]},
    {id:"m2", n:2, title:"Quantum Theory and the H Atom", short:"Light, Bohr, orbitals", pages:35,
      chapters:["M2C1","M2C2","M2C3","M2C4","M2C5","M2C6","M2C7","M2C8"],
      topics:["Light, photons and the photoelectric effect","Line spectra and the Bohr model","Wave-particle duality and uncertainty","Quantum numbers, orbitals, nodes and spin"]},
    {id:"m3", n:3, title:"Multielectron Atoms and the Periodic Table", short:"Configurations and trends", pages:16,
      chapters:["M3C1","M3C2","M3C3","M3C4","M3C5","M3C6"],
      topics:["Orbital energies in multielectron atoms","Electron configurations of atoms and ions","Magnetism and the periodic table","Radius, ionization energy, electron affinity, electronegativity"]},
    {id:"m4", n:4, title:"Chemical Bonding and Structure", short:"Lewis, VSEPR, polarity", pages:22,
      chapters:["M4C1","M4C2","M4C3","M4C4","M4C5","M4C6","M4C7"],
      topics:["Lewis structures and formal charge","Resonance and bond order","Lattice energy and bond strength","VSEPR shapes, polarity and line structures"]},
    {id:"m5", n:5, title:"Module 5", short:"Coming after Test 2", pages:0, chapters:[], topics:["Starts Nov 9. Send the notes and it shows up here."], upcoming:true},
    {id:"m6", n:6, title:"Module 6", short:"Coming in late November", pages:0, chapters:[], topics:["Starts Nov 23."], upcoming:true}
  ],
  /* graded work. kind: pc (Participation Challenge: timed 60 minute single-attempt quiz), test, final. chapters = what it first covers. */
  assessments:[
    {id:"PC1", kind:"pc", n:1, date:"2026-09-23", time:"21:00", covers:"Module 1, pages 1 to 21", chapters:["M1C1","M1C2","M1C3","M1C4","M1C5"]},
    {id:"PC2", kind:"pc", n:2, date:"2026-09-30", time:"21:00", covers:"Module 1, page 21 to the end", chapters:["M1C6","M1C7"]},
    {id:"T1",  kind:"test", n:1, date:"2026-10-05", time:"08:30", covers:"Module 1 and Module 2 up to the Bohr model", chapters:["M2C1","M2C2","M2C3"]},
    {id:"PC3", kind:"pc", n:3, date:"2026-10-21", time:"21:00", covers:"All of Module 2", chapters:["M2C4","M2C5","M2C6","M2C7","M2C8"]},
    {id:"PC4", kind:"pc", n:4, date:"2026-10-28", time:"21:00", covers:"All of Module 3", chapters:["M3C1","M3C2","M3C3","M3C4","M3C5","M3C6"]},
    {id:"PC5", kind:"pc", n:5, date:"2026-11-04", time:"21:00", covers:"Module 4, pages 1 to 14", chapters:["M4C1","M4C2","M4C3"]},
    {id:"T2",  kind:"test", n:2, date:"2026-11-11", time:"08:30", covers:"Module 2 from page 12, Module 3 and Module 4 (assumed)", chapters:["M4C4","M4C5","M4C6","M4C7"], label:"Test 2 only"},
    {id:"PC6", kind:"pc", n:6, date:"2026-11-18", time:"21:00", covers:"Module 5", chapters:[]},
    {id:"PC7", kind:"pc", n:7, date:"2026-11-25", time:"21:00", covers:"Module 5 and 6", chapters:[]},
    {id:"PC8", kind:"pc", n:8, date:"2026-12-02", time:"21:00", covers:"Module 6", chapters:[]},
    {id:"FX",  kind:"final", n:0, date:"2026-12-10", time:"", covers:"The whole course. Exam date to be posted by the Registrar (Dec 10 or 11).", chapters:[]}
  ],
  /* Möbius online assignments: 3 attempts, best counts. */
  assignments:[
    {id:"A2", date:"2026-09-25", covers:"Module 1, pages 1 to 19", chapters:["M1C1","M1C2","M1C3","M1C4","M1C5"]},
    {id:"A3", date:"2026-10-02", covers:"Module 1, pages 19 to 31", chapters:["M1C5","M1C6","M1C7"]},
    {id:"A4", date:"2026-10-09", covers:"Module 2, pages 1 to 14", chapters:["M2C1","M2C2","M2C3","M2C4"]},
    {id:"A5", date:"2026-10-23", covers:"Module 2, pages 15 to 35", chapters:["M2C4","M2C5","M2C6","M2C7","M2C8"]},
    {id:"A6", date:"2026-10-30", covers:"All of Module 3", chapters:["M3C1","M3C2","M3C3","M3C4","M3C5","M3C6"]},
    {id:"A7", date:"2026-11-06", covers:"Module 4, pages 1 to 14", chapters:["M4C1","M4C2","M4C3"]},
    {id:"A8", date:"2026-11-13", covers:"Module 4, pages 14 to 22", chapters:["M4C4","M4C5","M4C6","M4C7"]}
  ],
  /* every chapter: [id, class date, title, printed course-notes pages, sections] */
  schedule:[
    ["M1C1","2026-09-11","Elements, compounds and balanced equations","1-6","1.1, 1.2"],
    ["M1C2","2026-09-14","Solubility and precipitation","7-8","1.2"],
    ["M1C3","2026-09-14","Acids, bases and net ionic equations","9-12","1.2"],
    ["M1C4","2026-09-16","Moles, solutions and combustion analysis","13-17","1.3"],
    ["M1C5","2026-09-18","Limiting reagent and percent yield","18-22","1.3"],
    ["M1C6","2026-09-21","Consecutive and simultaneous reactions, mixtures","23-26","1.3"],
    ["M1C7","2026-09-23","Atom economy and the E-factor","27-31","1.4"],
    ["M2C1","2026-09-25","Light and the electromagnetic spectrum","1-3","2.1, 2.2"],
    ["M2C2","2026-09-28","Blackbody radiation and the photoelectric effect","4-7","2.3"],
    ["M2C3","2026-09-28","Line spectra and the Bohr model","8-12","2.3, 2.4"],
    ["M2C4","2026-09-30","de Broglie and the uncertainty principle","12-15","2.5, 2.6"],
    ["M2C5","2026-09-30","Wavefunctions and quantum numbers","16-21","2.7"],
    ["M2C6","2026-10-07","Orbital shapes, phase and nodes","22-24","2.8"],
    ["M2C7","2026-10-07","Radial plots and the radial distribution function","25-31","2.8"],
    ["M2C8","2026-10-09","Electron spin and the full picture","32-35","2.9, 2.10"],
    ["M3C1","2026-10-19","Orbital energies in multielectron atoms","1-2","3.1"],
    ["M3C2","2026-10-19","Pauli, Aufbau and Hund","3-5","3.2"],
    ["M3C3","2026-10-21","The periodic table and configuration exceptions","6-7","3.3"],
    ["M3C4","2026-10-21","Ions and magnetism","8-9","3.4, 3.5"],
    ["M3C5","2026-10-23","Atomic radius and ionization energy","10-13","3.5"],
    ["M3C6","2026-10-23","Electron affinity and electronegativity","14-16","3.5"],
    ["M4C1","2026-10-26","Octet rule, Lewis structures and formal charge","1-5","4.1, 4.2"],
    ["M4C2","2026-10-28","Ideal fragments, incomplete and expanded octets","6-9","4.2"],
    ["M4C3","2026-10-30","Resonance and bond order","10-14","4.3"],
    ["M4C4","2026-11-02","Lattice energy and bond strength","15-16","4.4, 4.5"],
    ["M4C5","2026-11-02","VSEPR: shapes of molecules","17-18","4.6"],
    ["M4C6","2026-11-04","Polar bonds and molecular dipoles","19-20","4.7"],
    ["M4C7","2026-11-06","Line structures for organic molecules","21-22","4.8"]
  ]
};
