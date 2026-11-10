/* Module icons drawn as element tiles (number, symbol, name), and small textbook-style tool icons. Colours follow --c. */
window.C120=window.C120||{};
(function(){
const tile=(z,sym,nm)=>`<span class="tile" aria-hidden="true"><span class="z">${z}</span><span class="sym">${sym}</span><span class="nm">${nm}</span></span>`;
C120.ICON={
 m1:tile(1,"Rx","reactions"),
 m2:tile(2,"H&psi;","quantum"),
 m3:tile(3,"Pt","periodic"),
 m4:tile(4,"Bd","bonding"),
 m5:tile(5,"?","coming"),
 m6:tile(6,"?","coming"),
 mid:`<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><rect x="8" y="5" width="28" height="34" rx="4" fill="var(--paper)" stroke="var(--mid)" stroke-width="2.5"/><path d="M14 15 l3 3 6 -7 M14 25 l3 3 6 -7" stroke="var(--mid)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M26 16 h5 M26 26 h5 M14 33 h17" stroke="var(--mid)" stroke-width="2" opacity=".6"/></svg>`,
 formulas:`<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><rect x="6" y="8" width="24" height="30" rx="3" fill="var(--paper)" stroke="var(--c)" stroke-width="2"/><rect x="12" y="4" width="26" height="30" rx="3" fill="var(--paper)" stroke="var(--c)" stroke-width="2"/><text x="25" y="23" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-style="italic" font-size="11" fill="var(--c)">E=h&#957;</text></svg>`,
 gym:`<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="16" fill="none" stroke="var(--rule)" stroke-width="5"/><path d="M22 6 A16 16 0 1 1 7.5 28.5" fill="none" stroke="var(--c)" stroke-width="5" stroke-linecap="round"/><circle cx="7.5" cy="28.5" r="3.2" fill="var(--paper)" stroke="var(--c)" stroke-width="2"/></svg>`,
 quiz:`<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="24" r="15" fill="var(--paper)" stroke="var(--c)" stroke-width="2"/><path d="M22 24 V14 M22 24 L29 28" stroke="var(--c)" stroke-width="2" stroke-linecap="round"/><path d="M18 5 h8" stroke="var(--c)" stroke-width="2.5" stroke-linecap="round"/></svg>`,
 table:`<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">${[[4,8],[4,14],[10,14],[4,20],[10,20],[4,26],[10,26],[16,20],[22,20],[28,20],[34,8],[34,14],[28,14],[22,14],[34,20],[34,26],[28,26],[22,26],[16,26]].map(([x,y])=>`<rect x="${x}" y="${y}" width="5.4" height="5.4" rx="1" fill="var(--c)" fill-opacity=".35" stroke="var(--c)" stroke-width=".8"/>`).join("")}</svg>`
};
})();
