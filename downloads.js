(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const config = window.GLUPLANDIA_DOWNLOADS || {};
  const address = config.serverAddress || 'play.gluplandia.com';
  const tabs = [...document.querySelectorAll('[data-guide]')];
  let current = 'gluplandia';
  function updateProgress() {
    const checks = [...document.querySelectorAll(`#guide-${current} input[type=checkbox]`)];
    const done = checks.filter(check => check.checked).length;
    $('#step-count').textContent = `${done} de ${checks.length} pasos`;
    $('#setup-progress').max = checks.length;
    $('#setup-progress').value = done;
  }
  function select(tab, focus = false) {
    if (!tab) return;
    current = tab.dataset.guide;
    tabs.forEach(button => {
      const active = button === tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      $(`#guide-${button.dataset.guide}`).hidden = !active;
    });
    updateProgress();
    if (focus) tab.focus();
  }
  function guideFromHash() {
    const hash = location.hash.slice(1);
    if (hash === 'bedrock') select($('#tab-bedrock'));
    if (hash === 'java') select($('#tab-official'));
    if (['bedrock','java'].includes(hash)) $('#instalacion').scrollIntoView({block:'start',behavior:'instant'});
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
      if (event.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
      if (event.key === 'Home') next=0;
      if (event.key === 'End') next=tabs.length-1;
      if (next!==undefined) {event.preventDefault();select(tabs[next],true);}
    });
  });
  document.querySelectorAll('.gl-install-step input').forEach(check=>check.addEventListener('change',updateProgress));
  addEventListener('hashchange',guideFromHash);
  guideFromHash(); updateProgress();
  const menu=$('#menu'),nav=$('#download-nav');
  function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');}
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.querySelectorAll('[data-copy-host]').forEach(button=>button.addEventListener('click',async()=>{
    const previous=button.textContent;
    try {await navigator.clipboard.writeText(address);$('#copy-status').textContent='Dirección copiada.';button.textContent='Dirección copiada';}
    catch {$('#copy-status').textContent=`Copia la dirección manualmente. ${address}`;}
    setTimeout(()=>{button.textContent=previous;},2200);
  }));
  const port=Number(config.bedrockPort);
  if(Number.isInteger(port)&&port>0&&port<=65535){document.querySelectorAll('[data-bedrock-port]').forEach(node=>{node.textContent=String(port);});$('.gl-port-context').textContent='Utiliza este puerto en el campo correspondiente de Minecraft Bedrock.';}
  const devices={mobile:'En Android o iOS, abre Minecraft y comprueba que tu cuenta permite jugar en multijugador.',windows:'Abre Minecraft para Windows. Esta es la edición Bedrock. Añade Gluplandia desde Jugar y la pestaña Servidores.',console:'Las consolas no tienen el mismo menú para añadir servidores externos. Consulta al equipo la forma de acceso disponible para tu consola.'};
  document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-device]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));$('#device-guidance').textContent=devices[button.dataset.device];}));
  // No destination is assigned until the owner supplies the URL.
  let installer;
  try{if(config.launcherUrl){const url=new URL(config.launcherUrl);if(url.protocol==='https:'&&!url.username&&!url.password)installer=url.href;}}catch{}
  if(installer){const button=$('#launcher-download');button.disabled=false;$('#launcher-availability').textContent='Descarga oficial de Gluplandia Launcher para Windows.';button.addEventListener('click',()=>{location.assign(installer);});}
})();
