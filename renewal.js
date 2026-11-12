(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const tabs = [...document.querySelectorAll('[data-life]')];
  const life = {
    craft:{label:'APRENDE HACIENDO',title:'El equipo también se trabaja.',description:'Mejorar un oficio da sentido a los recursos que recoges. Dedica una partida a preparar el equipo con el que saldrás en la siguiente.',link:'#niveles',linkText:'Explorar la progresión'},
    home:{label:'UN LUGAR EN EL MUNDO',title:'Haz que una coordenada sea tu hogar.',description:'Construye cerca de un paisaje que quieras volver a ver. Un refugio con provisiones transforma una expedición arriesgada en una historia que puedes continuar.',link:'#reglas',linkText:'Conocer la comunidad'},
    party:{label:'AVENTURAS EN COMPAÑÍA',title:'El próximo paso puede ser juntos.',description:'Java y Bedrock comparten Gluplandia. Prepara una salida con tus amigos y elige qué puede aportar cada uno antes de entrar en una mazmorra.',link:'#unirse',linkText:'Elegir cómo entrar'}
  };
  function chooseLife(button) {
    const data = life[button.dataset.life];
    if (!data) return;
    tabs.forEach(tab=>{const active=tab===button;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
    $('#life-label').textContent=data.label;$('#life-title').textContent=data.title;$('#life-description').textContent=data.description;
    $('#life-link').href=data.link;$('#life-link').replaceChildren(document.createTextNode(data.linkText+' '));
    const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';$('#life-link').append(arrow);
    $('#life-panel').setAttribute('aria-labelledby',button.id);
  }
  tabs.forEach((button,index)=>{
    button.addEventListener('click',()=>chooseLife(button));
    button.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();chooseLife(tabs[next]);tabs[next].focus();}
    });
  });
  const fields={
    approach:{index:'01',label:'LA ENTRADA',title:'No toda puerta es una invitación.',description:'Rodea las ruinas antes de cruzarlas. Busca otra entrada y observa qué criaturas se mueven cerca. El terreno puede darte una ventaja antes del primer golpe.',pack:'Antorchas y bloques para señalar el camino.'},
    depths:{index:'02',label:'LAS PROFUNDIDADES',title:'El silencio también cuenta algo.',description:'Las cuevas conectan rutas que no ves desde la superficie. Comprueba la altura de la caída y reconoce las salidas antes de dejarte llevar por un brillo entre las rocas.',pack:'Comida y herramientas con durabilidad suficiente.'},
    return:{index:'03',label:'EL REGRESO',title:'El tesoro necesita llegar a casa.',description:'Deja espacio para lo que encuentres y conserva una ruta de salida. Volver a tiempo te permite mejorar el equipo y preparar una expedición más ambiciosa.',pack:'Coordenadas del refugio y una reserva de provisiones.'}
  };
  document.querySelectorAll('[data-field]').forEach(button=>button.addEventListener('click',()=>{
    const data=fields[button.dataset.field];if(!data)return;
    document.querySelectorAll('[data-field]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));
    for(const key of ['index','label','title','description','pack'])$('#field-'+key).textContent=data[key];
  }));
  const port=Number(window.GLUPLANDIA_DOWNLOADS?.bedrockPort);
  if(Number.isInteger(port)&&port>0&&port<=65535)document.querySelectorAll('[data-bedrock-port]').forEach(node=>{node.textContent=String(port);});
  // Keep failed artwork visible as an accessible fallback instead of an empty panel.
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error',()=>{img.classList.add('gl-image-failed');img.dataset.imageState='failed';});
    img.addEventListener('load',()=>{img.classList.remove('gl-image-failed');img.dataset.imageState='loaded';});
  });
})();
