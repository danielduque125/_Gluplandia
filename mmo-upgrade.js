(()=>{
 'use strict';
 const $=s=>document.querySelector(s),races=window.GLUPLANDIA_RACES;
 if(!races||!$('#razas'))return;
 const tabs=[...document.querySelectorAll('[data-race]')],motion=matchMedia('(prefers-reduced-motion: reduce)');
 const animate=e=>{if(e&&!motion.matches)e.animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'ease-out'});};
 function choose(button,announce=true){
  const race=races.find(r=>r.id===button.dataset.race);if(!race)return;
  $('#razas').style.setProperty('--race-color',race.color);
  tabs.forEach(b=>{const active=b===button;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
  $('#race-panel').setAttribute('aria-labelledby',button.id);
  $('#race-portrait').src=race.image;$('#race-portrait').alt=`Linaje ${race.name.toLowerCase()} representado como personaje de Minecraft`;
  for(const field of ['name','role','title','description','caption'])$('#race-'+field).textContent=race[field];
  $('#race-backdrop').textContent=race.name;
  $('#race-stats').innerHTML=race.stats.filter(s=>!s.penalty).map(s=>`<div><dt>${s.label}</dt><dd>${s.display}</dd></div>`).join('');
  const penalties=race.stats.filter(s=>s.penalty);
  $('#race-penalties').innerHTML=`<small>${penalties.length?'EL COMPROMISO DE TU LINAJE':'UN ORIGEN VERSÁTIL'}</small>`+(penalties.length?penalties.map(s=>`<p><strong>${s.display}</strong> ${s.label}${s.id==='RANGED_INACCURACY'?' · unidad de imprecisión':''}</p>`).join(''):'<p>Sin penalizaciones innatas.</p>');
  if(announce){$('#race-status').textContent=`Linaje ${race.name} seleccionado.`;animate($('#race-portrait'));animate($('#race-panel'));}
 }
 tabs.forEach((b,i)=>{b.addEventListener('click',()=>choose(b));b.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();tabs[next].focus();choose(tabs[next]);});});
 choose(tabs[0],false);
 const dialog=$('#race-comparison'),open=$('#open-race-comparison');
 $('#race-comparison-body').innerHTML=races.map(r=>`<tr><th scope="row">${r.name}</th><td>${r.stats.filter(s=>!s.penalty).map(s=>`<p><strong>${s.display}</strong> ${s.label}</p>`).join('')}</td><td>${r.stats.filter(s=>s.penalty).map(s=>`<p><strong>${s.display}</strong> ${s.label}${s.id==='RANGED_INACCURACY'?' · unidad':''}</p>`).join('')||'Sin penalizaciones innatas.'}</td></tr>`).join('');
 open.addEventListener('click',()=>dialog.showModal());$('#close-race-comparison').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>open.focus());
 document.querySelectorAll('[data-field-note]').forEach(b=>b.addEventListener('click',()=>{const note=document.getElementById(b.dataset.fieldNote),expanded=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(expanded));note.hidden=!expanded;b.querySelector('span').textContent=expanded?'−':'+';}));
 document.querySelectorAll('[data-class-choice]').forEach(b=>b.addEventListener('click',()=>{animate($('#class-portrait'));animate($('#class-panel'));}));
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){[...races.map(r=>r.image),...['warrior','mage','paladin','ranger'].map(k=>`assets/class-${k}-hd.png?v=final-r6`)].forEach(src=>{const im=new Image();im.src=src;});observer.disconnect();}},{rootMargin:'450px'});observer.observe($('#razas'));}
})();
