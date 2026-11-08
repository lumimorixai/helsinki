// Szenen-Bibliothek für Einhorn-Blockwelt: Motive als SVG (Bilderbuch-Optik, Blockwelt), Node-Script
// node motive.js  → schreibt art/out/*.svg und *.png (rsvg-convert)
const fs=require('fs'), path=require('path'), cp=require('child_process');
const dk=(hex,f=0.7)=>{ const n=parseInt(hex.slice(1),16); const c=k=>Math.round(((n>>k)&255)*f); return '#'+((1<<24)|(c(16)<<16)|(c(8)<<8)|c(0)).toString(16).slice(1); };
const lt=(hex,f=0.25)=>{ const n=parseInt(hex.slice(1),16); const c=k=>Math.round(((n>>k)&255)+(255-((n>>k)&255))*f); return '#'+((1<<24)|(c(16)<<16)|(c(8)<<8)|c(0)).toString(16).slice(1); };
const R=['#ff5e7e','#ff9a3c','#ffe24d','#6fe38a','#5ac8ff','#7f7bff','#d77bff'];
let uid=0; const id=()=>'g'+(uid++);
// ---------- Grundelemente ----------
function sky(w,h,mood){ const m={day:['#8fd3ff','#cfe9ff','#ffe3f0'],evening:['#7ea6ff','#ffb3a0','#ffe0b0'],night:['#141a4a','#2b2f7a','#5a4a9a'],dawn:['#9ad0ff','#ffd6e8','#fff1c8'],blue:['#5f86d6','#9fc3ff','#dce9ff']}[mood||'day']; const g=id();
  return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m[0]}"/><stop offset="0.6" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[2]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${g})"/>`; }
function sun(x,y,r,night){ const g=id(); return `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${night?'#fff6c8':'#fff9d0'}" stop-opacity="0.95"/><stop offset="0.35" stop-color="${night?'#fff6c8':'#fff3a0'}" stop-opacity="${night?0.5:0.6}"/><stop offset="1" stop-color="#fff3a0" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r*2.6}" fill="url(#${g})"/><circle cx="${x}" cy="${y}" r="${r}" fill="${night?'#fff6c8':'#fff6b0'}"/>`+(night?`<circle cx="${x+r*0.35}" cy="${y-r*0.1}" r="${r*0.82}" fill="#2b2f7a" opacity="0.9"/>`:''); }
function stars(w,h,n,seed){ let s=seed||7; const rnd=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; let o=''; for(let i=0;i<n;i++){ const x=rnd()*w, y=rnd()*h*0.6, r=1.5+rnd()*3; o+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.5+rnd()*0.5).toFixed(2)}"/>`; } return o; }
function sparkle(x,y,s,c){ c=c||'#fff'; return `<path d="M${x} ${y-s}q${s*0.18} ${s*0.82} ${s} ${s}q-${s*0.82} ${s*0.18} -${s} ${s}q-${s*0.18} -${s*0.82} -${s} -${s}q${s*0.82} -${s*0.18} ${s} -${s}z" fill="${c}"/>`; }
function cloud(x,y,s,op){ return `<g fill="#fff" opacity="${op||0.92}" transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="20" width="120" height="30" rx="6"/><rect x="20" y="0" width="40" height="30" rx="6"/><rect x="60" y="8" width="45" height="26" rx="6"/><rect x="-14" y="30" width="30" height="20" rx="6"/></g>`; }
// Block: leicht gemalt (Fläche + hellere Oberkante + dunklere Seite)
function block(x,y,s,c,top){ const t=top||lt(c,0.3), side=dk(c,0.78); return `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${c}"/><rect x="${x}" y="${y}" width="${s}" height="${s*0.22}" fill="${t}" opacity="0.85"/><rect x="${x+s*0.8}" y="${y}" width="${s*0.2}" height="${s}" fill="${side}" opacity="0.55"/>`; }
function ground(w,y,h,c,s){ s=s||60; let o=`<rect x="0" y="${y}" width="${w}" height="${h}" fill="${dk(c,0.9)}"/>`; for(let x=0;x<w;x+=s) o+=block(x,y,s,c); return o; }
function hill(x,y,wd,ht,c){ return `<path d="M${x} ${y}q${wd/2} -${ht*2} ${wd} 0z" fill="${c}"/>`; }
function tree(x,y,s,crown,trunk){ crown=crown||'#ff9ec4'; trunk=trunk||'#8a5a3a'; return `<g transform="translate(${x} ${y}) scale(${s})">${block(-10,-20,20,trunk)}${block(-30,-70,60,crown)}${block(-20,-95,40,crown)}${block(-45,-55,25,crown)}${block(20,-60,25,crown)}</g>`; }
function house(x,y,s,roof,wall){ wall=wall||'#c9955a'; return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="-60" width="90" height="60" fill="${wall}"/><rect x="0" y="-60" width="90" height="10" fill="${lt(wall,0.25)}"/><rect x="34" y="-34" width="22" height="34" fill="${dk(wall,0.6)}"/><rect x="10" y="-48" width="16" height="16" fill="#cfefff"/><rect x="64" y="-48" width="16" height="16" fill="#cfefff"/><path d="M-10 -60h110l-55 -45z" fill="${roof}"/><path d="M-10 -60h110l-8 -7h-94z" fill="${lt(roof,0.3)}"/></g>`; }
function fountain(x,y,s,lit){ const c=lit?'#ff6fa8':'#9a93a8'; return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="60" ry="18" fill="#a8b4c0"/><ellipse cx="0" cy="-6" rx="46" ry="12" fill="#8fd3ff"/><rect x="-10" y="-50" width="20" height="44" fill="#b8bfc8"/><path d="M0 -92l22 20v18l-22 20-22-20v-18z" fill="${c}"/><path d="M0 -92l22 20h-44z" fill="${lt(c,0.4)}"/>${lit?`<circle cx="0" cy="-72" r="40" fill="#ff9ec4" opacity="0.25"/>${sparkle(26,-100,8)}${sparkle(-28,-86,6)}`:''}</g>`; }
// ---------- Heldin (Seitenansicht, nach rechts), Stufe 1–4, Pose stand|run|fly|sit ----------
function hero(x,y,s,stage,pose,mood){ stage=stage||1; pose=pose||'stand'; const fur='#fffaf5', snout='#ffd1e8'; const maneCols=stage>=2?R:['#f3e9f7','#f3e9f7','#f3e9f7']; const horn=stage>=3?'#ffd54a':(stage===1?'#f1ead9':'#ffe9a0'); const hoof=stage>=4?R:null; const baby=stage===1;
  const legs=(pose==='run'||pose==='fly')?[[-26,-6,10],[-8,8,-6],[14,-8,8],[30,6,-10]]:[[-26,0,0],[-10,0,0],[12,0,0],[28,0,0]];
  let o=`<g transform="translate(${x} ${y}) scale(${s})">`;
  if(pose==='fly'){ o+=`<g opacity="0.9"><path d="M-10 -70q-60-70-110-40q30 10 50 40q30 10 60 10z" fill="${stage>=4?'url(#rainbowW)':'#fff'}" stroke="${stage>=4?'none':'#e9d8f0'}" stroke-width="3"/></g>`; }
  // Schweif
  o+=`<g transform="translate(-52 -40) rotate(${pose==='fly'?-20:10})">`+maneCols.map((c,i)=>`<path d="M0 ${i*7-10}q-30 ${8+i*6} -46 ${30+i*8}q10 -8 ${26} ${-16-i*6}z" fill="${c}"/>`).join('')+`</g>`;
  if(stage>=4&&pose!=='fly') o+=`<path d="M-20 -72q-30 -50 -80 -40q20 10 30 30q20 12 50 10z" fill="url(#rainbowW)" opacity="0.9"/>`;
  // Körper
  o+=`<rect x="-50" y="-70" width="100" height="56" rx="18" fill="${fur}"/><rect x="-50" y="-70" width="100" height="14" rx="8" fill="#fffdfa"/>`;
  // Beine
  legs.forEach(([lx,dx,dy],i)=>{ o+=`<g transform="translate(${lx} -20) rotate(${dx*0.8})"><rect x="-7" y="0" width="14" height="30" rx="5" fill="${fur}"/><rect x="-8" y="24" width="16" height="8" rx="3" fill="${hoof?hoof[i%7]:'#e8d6ea'}"/></g>`; });
  if(pose==='fly'){ o+=`<path d="M10 -70q60-60 110-30q-30 8-52 38q-30 8-58 0z" fill="${stage>=4?'url(#rainbowW)':'#fff'}" stroke="${stage>=4?'none':'#e9d8f0'}" stroke-width="3"/>`; }
  // Hals + Kopf
  const hs=baby?1.25:1; o+=`<g transform="translate(40 -78) scale(${hs})"><rect x="-14" y="-10" width="30" height="40" rx="10" fill="${fur}"/>`;
  // Mähne
  o+=maneCols.map((c,i)=>`<path d="M${-6-i*3} ${-30+i*2}q-26 ${10+i*4} -30 ${34+i*6}q14 -10 ${22+i*2} ${-30-i*4}z" fill="${c}"/>`).join('');
  o+=`<rect x="-16" y="-44" width="52" height="44" rx="14" fill="${fur}"/><rect x="18" y="-26" width="30" height="24" rx="9" fill="${snout}"/>`;
  o+=`<path d="M-8 -44l-6 -20 16 14z" fill="${fur}"/><path d="M-2 -46l-2-14 10 10z" fill="${snout}" opacity="0.7"/>`;
  o+=`<path d="M12 -44l6 -${baby?18:34} 8 ${baby?18:34}z" fill="${horn}"/>`+(stage>=3?`<circle cx="18" cy="-70" r="18" fill="#fff3a0" opacity="0.35"/>`:'');
  // Auge
  const ey=-24; if(mood==='sleepy') o+=`<path d="M4 ${ey}q8 6 16 0" stroke="#2b1a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`; else o+=`<ellipse cx="12" cy="${ey}" rx="7" ry="${mood==='wow'?10:8}" fill="#fff"/><circle cx="13" cy="${ey+1}" r="${mood==='wow'?6:4.5}" fill="#2b1a3a"/><circle cx="15" cy="${ey-2}" r="1.8" fill="#fff"/>`;
  o+=`<circle cx="28" cy="-18" r="4" fill="#ffb3d6" opacity="0.8"/>`+(mood==='wow'?`<circle cx="36" cy="-10" r="4" fill="#c75f8a"/>`:`<path d="M30 -10q5 4 10 0" stroke="#c75f8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
  o+=`</g></g>`; return o; }
const rainbowDefs=`<defs><linearGradient id="rainbowW" x1="0" x2="1">${R.map((c,i)=>`<stop offset="${i/6}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;
// ---------- Dorfälteste (Seitenansicht mit Hut) ----------
const ELD={Sternchen:{fur:'#f7efe0',mane:'#c9c4d4',hat:'zyl',hatC:'#5a3d7a',badge:'star'},Lotta:{fur:'#ffb8d1',mane:'#fff6fb',hat:'zyl',hatC:'#ff6fa3',badge:'lolli',apron:1},Finn:{fur:'#7d8fa6',mane:'#f2f2f2',hat:'cap',beard:1},Marie:{fur:'#d9a76a',mane:'#7a4a22',hat:'stroh',hatC:'#e8c477',badge:'flower'},Nordi:{fur:'#fbfbff',mane:'#e6ecf5',hat:'zyl',hatC:'#3c5d8a',badge:'ice',scarf:'#ff6fa3',sleepy:1},Luna:{fur:'#2f3b7a',mane:'#d7dcff',hat:'zyl',hatC:'#1c2250',badge:'moon',stars:1}};
function elder(x,y,s,name,flip){ const d=ELD[name]; const fur=d.fur, mane=d.mane; let o=`<g transform="translate(${x} ${y}) scale(${flip?-s:s} ${s})">`;
  o+=`<path d="M-40 -40q-30 20 -40 50q12 -10 26 -30z" fill="${mane}"/>`;
  o+=`<rect x="-46" y="-66" width="92" height="52" rx="16" fill="${fur}"/>`;
  [[-24],[-8],[12],[28]].forEach(([lx])=>{ o+=`<rect x="${lx-7}" y="-20" width="14" height="28" rx="5" fill="${fur}"/><rect x="${lx-8}" y="2" width="16" height="7" rx="3" fill="${dk(fur,0.8)}"/>`; });
  if(d.apron) o+=`<rect x="-30" y="-50" width="50" height="34" rx="6" fill="#fff" opacity="0.9"/>`;
  o+=`<g transform="translate(38 -74)"><rect x="-14" y="-10" width="30" height="40" rx="10" fill="${fur}"/><path d="M-6 -30q-26 10 -30 36q14 -10 24 -30z" fill="${mane}"/><rect x="-16" y="-44" width="52" height="44" rx="14" fill="${fur}"/><rect x="18" y="-26" width="30" height="24" rx="9" fill="${name==='Luna'?'#6a74c0':'#ffd1e8'}"/>`;
  if(d.stars) o+=`<circle cx="-4" cy="-30" r="1.8" fill="#fff3a0"/><circle cx="8" cy="-12" r="1.5" fill="#fff3a0"/>`;
  o+=`<path d="M-8 -44l-6 -16 16 12z" fill="${fur}"/><path d="M12 -44l6 -26 8 26z" fill="#ffd54a"/>`;
  if(d.sleepy) o+=`<path d="M4 -24q8 5 16 0" stroke="#2b1a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`; else o+=`<ellipse cx="12" cy="-24" rx="7" ry="8" fill="#fff"/><circle cx="13" cy="-23" r="4.5" fill="#2b1a3a"/><circle cx="15" cy="-26" r="1.8" fill="#fff"/>`;
  o+=`<path d="M30 -10q5 4 10 0" stroke="#c75f8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  if(d.beard) o+=`<path d="M14 -8q10 30 30 0q-4 22 -16 24q-12-2-14-24z" fill="#f4f4f4"/>`;
  if(d.scarf) o+=`<rect x="-16" y="-6" width="40" height="12" rx="6" fill="${d.scarf}"/>`;
  // Hut
  const hc=d.hatC||'#1f3a5f';
  if(d.hat==='zyl') o+=`<rect x="-24" y="-54" width="60" height="10" rx="4" fill="${hc}"/><rect x="-14" y="-90" width="40" height="38" rx="6" fill="${hc}"/><rect x="-14" y="-66" width="40" height="7" fill="${d.badge==='star'?'#ffd54a':d.badge==='ice'?'#bfe9ff':d.badge==='moon'?'#fff3a0':'#fff'}"/>`;
  if(d.hat==='cap') o+=`<rect x="-24" y="-54" width="64" height="10" rx="4" fill="#111c33"/><path d="M-14 -54q0-30 20-30q20 0 20 30z" fill="#f4f6fa"/><rect x="-6" y="-68" width="24" height="5" fill="#1f3a5f"/><circle cx="6" cy="-76" r="4" fill="#ffd54a"/>`;
  if(d.hat==='stroh') o+=`<ellipse cx="4" cy="-52" rx="38" ry="8" fill="${hc}"/><path d="M-16 -52q0-26 20-26q20 0 20 26z" fill="${hc}"/><rect x="-14" y="-62" width="36" height="6" fill="#6ea84f"/><g transform="translate(24 -72)"><circle r="7" fill="#ffd54a"/><circle r="3" fill="#7a4a22"/></g>`;
  if(d.badge==='star') o+=`<path d="M6 -96l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#ffd54a"/>`;
  if(d.badge==='lolli') o+=`<path d="M20 -86l6 -18" stroke="#fff" stroke-width="3"/><circle cx="26" cy="-106" r="8" fill="#fff"/><circle cx="26" cy="-106" r="5" fill="none" stroke="#ff6fa3" stroke-width="3"/>`;
  if(d.badge==='ice') o+=`<g stroke="#bfe9ff" stroke-width="2.5" stroke-linecap="round" transform="translate(6 -78)"><path d="M0-8v16M-7-4l14 8M-7 4l14-8"/></g>`;
  if(d.badge==='moon') o+=`<path d="M10 -90a8 8 0 1 0 2 14a6 6 0 1 1-2-14z" fill="#fff3a0"/>`;
  o+=`</g></g>`; return o; }
// ---------- Tiere, Fee ----------
function cat(x,y,s,flip){ return `<g transform="translate(${x} ${y}) scale(${flip?-s:s} ${s})"><path d="M-30 -10q-20 -6 -26 -30q8 10 14 20z" fill="#e9d9c2"/><rect x="-30" y="-34" width="56" height="30" rx="14" fill="#f4e7d3"/><rect x="-24" y="-10" width="10" height="14" rx="4" fill="#f4e7d3"/><rect x="8" y="-10" width="10" height="14" rx="4" fill="#f4e7d3"/><g transform="translate(26 -40)"><rect x="-18" y="-16" width="38" height="32" rx="12" fill="#f4e7d3"/><path d="M-14 -14l-2 -16 14 10z" fill="#f4e7d3"/><path d="M8 -14l10 -14 2 16z" fill="#f4e7d3"/><circle cx="-4" cy="-2" r="4.5" fill="#2b1a3a"/><circle cx="12" cy="-2" r="4.5" fill="#2b1a3a"/><circle cx="-2.5" cy="-3.5" r="1.5" fill="#fff"/><circle cx="13.5" cy="-3.5" r="1.5" fill="#fff"/><circle cx="4" cy="6" r="2.5" fill="#ff9ec4"/></g></g>`; }
function bunny(x,y,s){ return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-18" y="-24" width="36" height="24" rx="12" fill="#fff"/><rect x="-12" y="-52" width="8" height="30" rx="4" fill="#fff"/><rect x="2" y="-52" width="8" height="30" rx="4" fill="#fff"/><rect x="-10" y="-48" width="4" height="22" rx="2" fill="#ffd1e8"/><rect x="4" y="-48" width="4" height="22" rx="2" fill="#ffd1e8"/><circle cx="-5" cy="-14" r="2.5" fill="#2b1a3a"/><circle cx="7" cy="-14" r="2.5" fill="#2b1a3a"/><circle cx="1" cy="-8" r="2" fill="#ff9ec4"/></g>`; }
function dragon(x,y,s){ return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10 -30q-30 -30 -50 -8q20 0 34 16z" fill="#b8ffd0"/><rect x="-24" y="-36" width="50" height="32" rx="14" fill="#9fe6b0"/><rect x="-14" y="-6" width="10" height="10" rx="4" fill="#9fe6b0"/><rect x="6" y="-6" width="10" height="10" rx="4" fill="#9fe6b0"/><g transform="translate(26 -44)"><rect x="-16" y="-16" width="36" height="30" rx="12" fill="#9fe6b0"/><path d="M-10 -16l-4 -12 12 8z" fill="#6fd08a"/><path d="M6 -16l6 -12 4 12z" fill="#6fd08a"/><circle cx="2" cy="-2" r="5" fill="#2b1a3a"/><circle cx="4" cy="-4" r="1.8" fill="#fff"/><circle cx="12" cy="6" r="2" fill="#ff9ec4"/></g>${sparkle(-40,-50,6,'#fff')}${sparkle(40,-70,5,'#fff')}</g>`; }
function fairy(x,y,s){ return `<g transform="translate(${x} ${y}) scale(${s})"><g opacity="0.85"><ellipse cx="-22" cy="-30" rx="26" ry="12" fill="#e8fbff" transform="rotate(-30 -22 -30)"/><ellipse cx="22" cy="-30" rx="26" ry="12" fill="#e8fbff" transform="rotate(30 22 -30)"/><ellipse cx="-18" cy="-6" rx="18" ry="9" fill="#e8fbff" transform="rotate(20 -18 -6)"/><ellipse cx="18" cy="-6" rx="18" ry="9" fill="#e8fbff" transform="rotate(-20 18 -6)"/></g><path d="M-14 -22q-20 -34 14 -40q30 2 28 34q-10 -8 -22 -4q-12 8 -20 10z" fill="#8fe3ff"/><rect x="-14" y="-10" width="28" height="30" rx="10" fill="#bfe9ff"/><circle cx="0" cy="-26" r="18" fill="#ffe7d1"/><circle cx="-6" cy="-28" r="3" fill="#2b1a3a"/><circle cx="7" cy="-28" r="3" fill="#2b1a3a"/><path d="M-5 -20q5 4 10 0" stroke="#c75f8a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-10 -36q10 -14 24 -4" fill="#8fe3ff"/>${sparkle(30,-50,6)}${sparkle(-34,10,5)}</g>`; }
// ---------- Wahrzeichen ----------
function lolli(x,y,s,gaps){ let o=`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-120" width="16" height="120" fill="#e8c9a0"/>`; const cols=['#ff5e7e','#fff','#b58cff','#fff','#ff5e7e']; for(let r=4;r>=0;r--){ o+=`<circle cx="0" cy="-170" r="${(r+1)*12}" fill="${cols[r]}"/>`; } if(gaps) o+=`<circle cx="42" cy="-170" r="10" fill="#cfe9ff" opacity="0.9"/><circle cx="-42" cy="-170" r="10" fill="#cfe9ff" opacity="0.9"/><circle cx="0" cy="-212" r="10" fill="#cfe9ff" opacity="0.9"/>`; return o+'</g>'; }
function lighthouse(x,y,s,lit){ return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0l10 -160h40l10 160z" fill="#f4f6fa"/><path d="M-26 -30h52v-30h-52zM-20 -100h40v-25h-40z" fill="#ff5e7e"/><rect x="-22" y="-190" width="44" height="30" fill="${lit?'#fff3a0':'#9aa6b8'}"/><path d="M-26 -190h52l-26 -22z" fill="#2f3b7a"/>${lit?`<circle cx="0" cy="-176" r="60" fill="#fff3a0" opacity="0.35"/><path d="M-22 -186l-120 -40v80z" fill="#fff3a0" opacity="0.35"/>`:''}</g>`; }
function windmill(x,y,s,broken){ let o=`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0l14 -150h52l14 150z" fill="#e8c477"/><rect x="-10" y="-50" width="20" height="50" fill="#7a4a22"/><path d="M-44 -150h88l-44 -30z" fill="#a0522d"/>`; const a=broken?[0,90]:[0,90,180,270]; for(const ang of a) o+=`<g transform="translate(0 -140) rotate(${ang+20})"><rect x="-6" y="-110" width="12" height="100" fill="#8a5a3a"/><rect x="6" y="-104" width="22" height="80" fill="#fff" opacity="0.9"/></g>`; if(broken) o+=`<g transform="translate(0 -140) rotate(200)"><rect x="-6" y="-50" width="12" height="40" fill="#8a5a3a"/></g>`; o+=`<circle cx="0" cy="-140" r="10" fill="#5a3d2a"/></g>`; return o; }
function igloo(x,y,s,lamp){ return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0a70 70 0 0 1 140 0z" fill="#f4fbff"/><path d="M-70 0a70 70 0 0 1 140 0z" fill="none" stroke="#cfe6f5" stroke-width="3" stroke-dasharray="26 8"/><path d="M-22 0a22 22 0 0 1 44 0z" fill="#2b2f7a"/>${lamp?`<rect x="84" y="-50" width="14" height="50" fill="#5a3d2a"/><rect x="76" y="-70" width="30" height="24" rx="4" fill="#ffd54a"/><circle cx="91" cy="-58" r="50" fill="#fff3a0" opacity="0.3"/>`:''}</g>`; }
function belltower(x,y,s,lit){ return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-30" y="-200" width="60" height="200" fill="#d9d0ff"/><rect x="-30" y="-200" width="60" height="14" fill="#efeaff"/><rect x="-22" y="-170" width="44" height="50" fill="#2b2f7a"/><path d="M-40 -200h80l-40 -40z" fill="#8a7aa8"/><path d="M-14 -160q0-18 14-18q14 0 14 18v16h-28z" fill="${lit?'#ffd54a':'#b8a860'}"/>${lit?`<circle cx="0" cy="-150" r="50" fill="#fff3a0" opacity="0.35"/>`:''}</g>`; }
function castle(x,y,s){ return `<g transform="translate(${x} ${y}) scale(${s})" opacity="0.85"><rect x="-60" y="-70" width="120" height="70" fill="#e9e3f5"/><rect x="-80" y="-110" width="30" height="110" fill="#e9e3f5"/><rect x="50" y="-110" width="30" height="110" fill="#e9e3f5"/><path d="M-80 -110h30l-15 -30zM50 -110h30l-15 -30z" fill="#b58cff"/><rect x="-10" y="-40" width="20" height="40" fill="#8a7aa8"/></g>`; }
function rainbow(x,y,r,wd){ return R.map((c,i)=>`<path d="M${x-r+i*wd} ${y}a${r-i*wd} ${r-i*wd} 0 0 1 ${2*(r-i*wd)} 0" fill="none" stroke="${c}" stroke-width="${wd}" opacity="0.85"/>`).join(''); }
function leitstern(x,y,s){ return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-80 30q40 -10 80 -30" stroke="#fff3a0" stroke-width="6" stroke-linecap="round" opacity="0.6"/><path d="M-50 20q30 -10 50 -20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.8"/>${sparkle(0,0,16,'#ffd54a')}${sparkle(0,0,9,'#fff')}</g>`; }
// ---------- Szenen ----------
function frame(w,h,inner,title){ return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${rainbowDefs}${inner}${title?`<text x="${w/2}" y="${title.y||160}" text-anchor="middle" font-family="Nunito, Avenir Next, Arial Rounded MT Bold, Helvetica, sans-serif" font-weight="900" font-size="${title.size||96}" fill="#fff" stroke="#8a5fb0" stroke-width="${(title.size||96)/12}" paint-order="stroke" stroke-linejoin="round">${title.t}</text>${title.sub?`<text x="${w/2}" y="${(title.y||160)+(title.size||96)*0.9}" text-anchor="middle" font-family="Nunito, Avenir Next, Helvetica, sans-serif" font-weight="800" font-size="${(title.size||96)*0.5}" fill="#fff" stroke="#8a5fb0" stroke-width="${(title.size||96)/20}" paint-order="stroke">${title.sub}</text>`:''}`:''}</svg>`; }
const W=1290,H=2796; // App-Store Hochformat
const scenes={};
// 2 Titelbild
scenes['02_titelbild']=()=>{ const g=H*0.7; let o=sky(W,H,'day')+sun(1000,420,110)+cloud(80,520,1.8)+cloud(900,700,1.4,0.8)+cloud(300,900,1.1,0.7);
  o+=hill(-200,g,1000,160,'#9fdc8a')+hill(500,g,1100,220,'#8fd27a')+castle(1050,g-130,1.2)+ground(W,g,H-g,'#7fc960');
  o+=tree(160,g,2.2,'#ff9ec4')+tree(1150,g,2.6,'#d77bff')+tree(1000,g+60,1.8,'#ff9ec4')+house(300,g+40,2.2,'#a0522d')+fountain(700,g+60,1.6,false);
  o+=leitstern(760,g-560,2.4)+hero(520,g+160,3.2,1,'stand','wow');
  o+=sparkle(300,1500,20)+sparkle(1120,1300,16)+sparkle(200,1900,12);
  return frame(W,H,o,{t:'Einhorn-Blockwelt',sub:'Bring das Licht zurück!',y:260,size:110}); };
// 3 Die sechs Dörfer (Panorama von oben)
scenes['03_sechs_doerfer']=()=>{ let o=sky(W,H,'day')+sun(1100,300,90); const g=700; o+=ground(W,g,H-g,'#7fc960',86);
  // Sandwege
  o+=`<path d="M300 2400Q640 2000 640 1700T980 1300T640 1000T300 1700" stroke="#f3dca0" stroke-width="40" fill="none" stroke-linecap="round" opacity="0.9"/>`;
  const vill=(x,y,roof,tr,extra)=>house(x-120,y,1.5,roof)+house(x+20,y+30,1.5,roof)+tree(x-200,y+20,1.4,tr)+tree(x+180,y+10,1.5,tr)+fountain(x-40,y+60,1.0,true)+(extra||'');
  o+=vill(640,1000,'#a0522d','#7fe08a',castle(840,760,0.9));
  o+=vill(300,1420,'#ff9ec4','#ff9ec4',lolli(80,1480,0.8));
  o+=vill(980,1480,'#4a90e2','#5ac8ff',`<ellipse cx="1130" cy="1560" rx="150" ry="60" fill="#8fd3ff"/>`+lighthouse(1180,1500,0.7,true));
  o+=vill(640,1900,'#f2c230','#ffe24d',windmill(880,1960,0.8));
  o+=`<path d="M60 2500q220-420 440 0z" fill="#f4fbff"/>`+vill(300,2400,'#dff3ff','#f4fbff',igloo(120,2470,0.6,true));
  o+=cloud(880,1000,2.4)+cloud(1060,1120,1.6)+belltower(1000,1130,0.6,true)+house(900,1140,1.1,'#c9b8ff');
  o+=hero(640,1400,1.6,3,'fly')+leitstern(760,1300,1.4);
  return frame(W,H,o,{t:'Sechs Dörfer',sub:'Jedes wartet auf dich',y:240,size:110}); };
// 4 Bauen und Fliegen
scenes['04_bauen_fliegen']=()=>{ const g=2000; let o=sky(W,H,'day')+sun(240,400,100)+cloud(800,500,1.8)+cloud(150,900,1.2,0.75)+ground(W,g,H-g,'#7fc960');
  o+=tree(120,g,2.4,'#ff9ec4')+tree(1180,g,2.2,'#d77bff');
  // halb gebautes Haus
  const s=90; for(let i=0;i<7;i++) o+=block(400+i*s,g-s,s,'#ff9ec4'); for(let i=0;i<7;i++) if(i!==3) o+=block(400+i*s,g-2*s,s,'#ff9ec4'); for(let i of [0,1,5,6]) o+=block(400+i*s,g-3*s,s,'#ff9ec4'); o+=block(400,g-4*s,s,'#ff9ec4')+block(400+6*s,g-4*s,s,'#ff9ec4');
  o+=`<g opacity="0.5">${block(400+2*s,g-4*s,s,'#fff')}${block(400+3*s,g-4*s,s,'#fff')}</g>`;
  o+=`<g transform="rotate(-12 760 1360)">${block(715,1315,s,'#ff9ec4')}</g>`+sparkle(700,1290,14)+sparkle(860,1420,10);
  o+=hero(560,1500,3.0,3,'fly','happy');
  return frame(W,H,o,{t:'Bauen &amp; Fliegen',sub:'Deine Welt, deine Regeln',y:240,size:110}); };
// 5 Tiere und Freunde
scenes['05_tiere']=()=>{ const g=2050; let o=sky(W,H,'evening')+sun(1050,500,90)+cloud(100,560,1.6)+ground(W,g,H-g,'#7fc960');
  o+=tree(1100,g,2.6,'#ff9ec4')+tree(180,g,2.2,'#ff9ec4')+`<g fill="#ff5e7e">${[200,320,900,1000,1180].map(x=>`<circle cx="${x}" cy="${g+40}" r="12"/>`).join('')}</g>`;
  o+=hero(520,g+40,2.8,2,'stand','happy')+cat(900,g+40,2.6,true)+bunny(260,g+50,2.4)+dragon(1120,g-300,2.2);
  o+=sparkle(760,1500,16)+sparkle(1000,1700,10);
  return frame(W,H,o,{t:'Tiere &amp; Freunde',sub:'Steh still – dann kommen sie',y:240,size:110}); };
// 6 Windprüfung
scenes['06_windpruefung']=()=>{ const g=2300; let o=sky(W,H,'blue')+sun(200,420,90)+cloud(850,600,2)+cloud(60,1100,1.4,0.8)+`<rect x="0" y="${g-200}" width="${W}" height="200" fill="#5ac8ff"/>`+ground(W,g,H-g,'#f3dca0');
  o+=lighthouse(1000,g-200,2.2,true);
  const ring=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="${r*0.18}"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="${r*0.05}" opacity="0.7"/>`;
  o+=ring(300,1500,90,R[4])+ring(560,1250,120,R[2])+ring(900,1050,100,R[0]);
  o+=`<path d="M300 1500Q560 1250 900 1050" stroke="#fff" stroke-width="8" stroke-dasharray="20 26" fill="none" opacity="0.8"/>`;
  o+=hero(560,1330,2.6,3,'fly','wow')+fairy(1020,1300,2.2);
  return frame(W,H,o,{t:'Windprüfungen',sub:'Schneller als der Wind',y:240,size:110}); };
// 13 Finale (Hochformat)
scenes['13_finale']=()=>{ const g=2100; let o=sky(W,H,'dawn')+sun(640,700,120)+rainbow(640,1500,900,40)+cloud(100,520,1.6)+cloud(1000,640,1.4)+ground(W,g,H-g,'#7fc960');
  o+=castle(640,g-700,2.2)+fountain(640,g+40,1.8,true);
  o+=elder(200,g+20,1.4,'Sternchen')+elder(400,g-20,1.3,'Lotta')+elder(900,g-20,1.3,'Finn',true)+elder(1100,g+20,1.4,'Marie',true)+elder(260,g+230,1.5,'Nordi')+elder(1030,g+230,1.5,'Luna',true);
  o+=hero(640,g+240,3.2,4,'stand','happy');
  o+=sparkle(300,1300,18)+sparkle(1000,1250,22)+sparkle(640,1050,14);
  return frame(W,H,o,{t:'Das Licht ist zurück!',sub:'Du bist die Einhorn-Königin',y:240,size:104}); };
// Kapitelkarten quer 2000×1200
const KW=2000,KH=1200;
function kap(inner,mood){ return frame(KW,KH,inner); }
scenes['07_kap1_sternendorf']=()=>{ const g=900; let o=sky(KW,KH,'day')+sun(1700,220,90)+cloud(200,160,1.6)+ground(KW,g,KH-g,'#7fc960')+hill(900,g,1400,160,'#9fdc8a')+castle(1650,g-150,1.4);
  o+=house(1150,g+20,2,'#a0522d')+tree(1500,g,2.4,'#7fe08a')+tree(1900,g+10,2,'#ff9ec4')+fountain(1000,g+60,1.6,false);
  o+=elder(1260,g+120,2.2,'Sternchen',true)+hero(840,g+150,2.0,1,'stand','wow');
  return kap(o); };
scenes['08_kap2_zuckerdorf']=()=>{ const g=900; let o=sky(KW,KH,'day')+sun(300,220,90)+cloud(1400,160,1.6)+ground(KW,g,KH-g,'#8fd27a');
  o+=tree(300,g,2.6,'#ff9ec4')+tree(1800,g,2.6,'#d77bff')+tree(1550,g+20,1.9,'#ff9ec4')+house(600,g+20,2,'#ff9ec4')+lolli(1300,g+60,1.6,true);
  o+=elder(1000,g+120,2.2,'Lotta',true)+hero(640,g+150,2.0,2,'stand')+cat(1720,g+90,1.8,true);
  return kap(o); };
scenes['09_kap3_kristallhafen']=()=>{ const g=900; let o=sky(KW,KH,'evening')+sun(1500,260,100)+cloud(200,140,1.4)+`<rect x="0" y="${g-120}" width="${KW}" height="${KH-g+120}" fill="#5ac8ff"/><rect x="0" y="${g-120}" width="${KW}" height="30" fill="#8fd3ff"/>`;
  o+=`<rect x="0" y="${g-130}" width="700" height="60" fill="#e8c9a0"/>`+ground(700,g-70,KH-g+70,'#f3dca0')+`<rect x="600" y="${g-100}" width="900" height="40" fill="#c9955a"/>`+house(150,g-90,2,'#4a90e2');
  o+=lighthouse(1450,g-100,2.2,false)+`<g fill="#b58cff">${[760,900,1100].map(x=>`<path d="M${x} ${g-100}l-20-60 20-30 20 30z"/>`).join('')}</g>`;
  const ring=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="${r*0.18}"/>`; o+=ring(1200,420,70,R[0])+ring(1500,330,80,R[2])+ring(1780,450,70,R[4]);
  o+=elder(900,g+20,2.2,'Finn',true)+hero(500,g+80,2.0,2,'fly');
  return kap(o); };
scenes['10_kap4_bluetenhof']=()=>{ const g=900; let o=sky(KW,KH,'day')+sun(1000,180,110)+cloud(300,140,1.6)+ground(KW,g,KH-g,'#9fdc8a')+`<g>${[0,200,400,600].map((x,i)=>`<rect x="${x}" y="${g-40}" width="100" height="40" fill="${i%2?'#e8c477':'#b8e08a'}"/>`).join('')}</g>`;
  o+=`<g fill="#ffe24d">${[100,250,1700,1850].map(x=>`<circle cx="${x}" cy="${g+30}" r="16"/><rect x="${x-4}" y="${g+30}" width="8" height="60" fill="#6ea84f"/>`).join('')}</g>`;
  o+=windmill(1450,g+40,2.2,true)+`<g>${block(1150,g-40,70,'#8a5a3a')}${block(1220,g-40,70,'#8a5a3a')}${block(1185,g-110,70,'#8a5a3a')}</g>`;
  o+=elder(980,g+120,2.2,'Marie',true)+hero(600,g+150,2.0,2,'stand');
  return kap(o); };
scenes['11_kap5_schneekuppe']=()=>{ const g=900; let o=sky(KW,KH,'night')+stars(KW,KH,60,3)+sun(1700,220,70,true)+`<path d="M-100 ${g}q600-700 1200-200q400-300 1000 100z" fill="#dff3ff"/>`+ground(KW,g,KH-g,'#f4fbff');
  o+=igloo(600,g+40,1.6,false)+igloo(1500,g+60,1.4,false)+`<g>${block(1200,g-70,70,'#5a3d2a')}${block(1200,g-140,70,'#ffd54a')}</g>`+sparkle(1235,g-170,12,'#fff3a0');
  o+=elder(1000,g+150,2.2,'Nordi',true)+hero(700,g+190,2.0,3,'stand','happy');
  return kap(o); };
scenes['12_kap6_wolkenstadt']=()=>{ const g=900; let o=sky(KW,KH,'night')+stars(KW,KH,90,11)+sun(300,220,80,true)+cloud(-50,g-40,6,0.95)+cloud(1200,g-20,5,0.95)+`<rect x="0" y="${g+100}" width="${KW}" height="${KH}" fill="#fff" opacity="0.95"/>`;
  o+=belltower(1450,g+40,2.2,false)+house(900,g+20,1.8,'#c9b8ff')+`<g>${sparkle(1250,400,22,'#fff3a0')}${sparkle(1650,520,18,'#fff3a0')}${sparkle(1500,300,16,'#fff3a0')}</g>`;
  o+=elder(1050,g+140,2.2,'Luna',true)+hero(500,520,2.0,3,'fly','wow');
  return kap(o); };
scenes['13b_finale_quer']=()=>{ const g=900; let o=sky(KW,KH,'dawn')+sun(1000,260,110)+rainbow(1000,860,760,34)+ground(KW,g,KH-g,'#7fc960')+castle(1000,g-250,1.8)+fountain(1000,g+40,1.6,true);
  o+=elder(300,g+80,1.7,'Sternchen')+elder(520,g+60,1.6,'Lotta')+elder(1480,g+60,1.6,'Finn',true)+elder(1700,g+80,1.7,'Marie',true)+elder(700,g+150,1.7,'Nordi')+elder(1300,g+150,1.7,'Luna',true);
  o+=hero(1000,g+200,2.4,4,'stand','happy');
  return kap(o); };
scenes['14_gute_nacht']=()=>{ let o=sky(KW,KH,'night')+stars(KW,KH,50,5);
  o+=`<rect x="200" y="100" width="1600" height="1000" fill="#c9955a"/><rect x="200" y="100" width="1600" height="30" fill="#e8c9a0"/><rect x="1300" y="220" width="300" height="300" rx="20" fill="#2b2f7a"/><rect x="1300" y="220" width="300" height="300" rx="20" fill="none" stroke="#e8c9a0" stroke-width="18"/>${sun(1450,330,60,true)}`;
  o+=`<rect x="200" y="900" width="1600" height="200" fill="#a0785a"/><rect x="400" y="700" width="800" height="220" rx="30" fill="#ff9ec4"/><rect x="400" y="560" width="800" height="160" rx="30" fill="#fff"/><rect x="430" y="600" width="260" height="90" rx="30" fill="#fff6fb"/>`;
  o+=`<rect x="520" y="650" width="760" height="190" rx="60" fill="#b58cff"/>`+hero(560,760,2.2,2,'stand','sleepy')+`<rect x="700" y="690" width="560" height="150" rx="50" fill="#b58cff" opacity="0.9"/>`+dragon(1120,840,1.5);
  o+=`<g fill="#fff" opacity="0.7"><text x="1500" y="700" font-family="Helvetica" font-size="80" font-weight="700">z</text><text x="1560" y="640" font-family="Helvetica" font-size="100" font-weight="700">z</text></g>`;
  return kap(o); };
// ---------- Ausgabe ----------
const out=path.join(__dirname,'out'); fs.mkdirSync(out,{recursive:true});
const only=process.argv[2];
for(const [name,fn] of Object.entries(scenes)){ if(only&&!name.includes(only)) continue; const svg=fn(); const f=path.join(out,name+'.svg'); fs.writeFileSync(f,svg); const big=name.startsWith('0')||name==='13_finale'; try{ cp.execSync(`rsvg-convert -w ${big&&!name.includes('kap')?1290:2000} "${f}" -o "${f.replace('.svg','.png')}"`); }catch(e){ console.error('png',name,e.message.slice(0,100)); } console.log('ok',name,Math.round(svg.length/1024)+' KB'); }
module.exports={scenes};
