const audio = document.getElementById('music');
const toggle = document.getElementById('music-toggle');
const player = document.querySelector('.music-player');
const volume = document.getElementById('volume');
const tracks = [
  {title:'Time to Pretend', artist:'MGMT', src:'assets/time-to-pretend.mp3'},
  {title:'Mice on Venus', artist:'C418', src:'assets/mice-on-venus.mp3'},
  {title:'Wet Hands', artist:'C418', src:'assets/wet-hands.mp3'},
  {title:'Haggstrom', artist:'C418', src:'assets/haggstrom.mp3'}
];
let trackIndex = 0;
let wantsPlayback = true;
let playbackAttempt = 0;
const status = document.getElementById('music-status');
const trackButtons = [...document.querySelectorAll('[data-track]')];
const listToggle = document.getElementById('playlist-toggle');
const listPanel = document.getElementById('playlist-panel');
audio.volume = .3;
audio.loop = false;
function syncMusic() {
  const playing = !audio.paused && !audio.ended;
  toggle.textContent = playing ? 'Ⅱ' : '▶';
  toggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  player.classList.toggle('playing', playing);
}
function renderTrack() {
  document.getElementById('track-title').textContent = tracks[trackIndex].title;
  document.getElementById('track-artist').textContent = tracks[trackIndex].artist;
  document.getElementById('track-count').textContent = `${trackIndex + 1} / ${tracks.length}`;
  trackButtons.forEach((button, index) => {
    button.classList.toggle('active', index === trackIndex);
    if (index === trackIndex) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}
async function playMusic() {
  const attempt = ++playbackAttempt;
  wantsPlayback = true;
  status.textContent = 'Cargando música…';
  try {
    await audio.play();
    if (attempt !== playbackAttempt) return;
    status.textContent = 'Reproduciendo.';
  } catch (error) {
    if (attempt !== playbackAttempt || error.name === 'AbortError') return;
    status.textContent = error.name === 'NotAllowedError'
      ? 'Toca la página para activar la música.'
      : 'No se pudo cargar el audio. Pulsa reproducir para reintentar.';
  }
  syncMusic();
}
function selectTrack(index) {
  trackIndex = (index + tracks.length) % tracks.length;
  ++playbackAttempt;
  audio.src = tracks[trackIndex].src;
  audio.load();
  renderTrack();
  playMusic();
}
toggle.addEventListener('click', () => {
  if (!audio.paused) {
    ++playbackAttempt;
    wantsPlayback = false;
    audio.pause();
    status.textContent = 'En pausa.';
  } else {
    if (audio.error) audio.load();
    playMusic();
  }
});
document.getElementById('music-prev').addEventListener('click', () => selectTrack(trackIndex - 1));
document.getElementById('music-next').addEventListener('click', () => selectTrack(trackIndex + 1));
trackButtons.forEach(button => button.addEventListener('click', () => selectTrack(Number(button.dataset.track))));
audio.addEventListener('ended', () => { if (wantsPlayback) selectTrack(trackIndex + 1); });
audio.addEventListener('play', syncMusic);
audio.addEventListener('pause', syncMusic);
audio.addEventListener('playing', () => { status.textContent = 'Reproduciendo.'; syncMusic(); });
audio.addEventListener('waiting', () => { if (wantsPlayback) status.textContent = 'Cargando música…'; });
audio.addEventListener('error', () => { status.textContent = 'No se pudo cargar el audio. Pulsa reproducir para reintentar.'; syncMusic(); });
volume.addEventListener('input', () => {
  audio.volume = Number(volume.value) / 100;
  document.getElementById('volume-value').value = volume.value + '%';
});
function setPlaylistOpen(open) {
  listPanel.hidden = !open;
  listToggle.setAttribute('aria-expanded', String(open));
  listToggle.setAttribute('aria-label', open ? 'Cerrar lista de reproducción' : 'Abrir lista de reproducción');
}
listToggle.addEventListener('click', () => setPlaylistOpen(listPanel.hidden));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !listPanel.hidden) { setPlaylistOpen(false); listToggle.focus(); }
});
document.addEventListener('click', event => { if (!player.contains(event.target)) setPlaylistOpen(false); });
function unlockMusic(event) {
  if (event.target instanceof Element && event.target.closest('#music-toggle, #music-prev, #music-next, [data-track]')) return;
  if (wantsPlayback && audio.paused && !audio.error) playMusic();
}
// Request playback inside a real user gesture, including touch on mobile.
// Browsers retain final control over whether audible autoplay is allowed.
document.addEventListener('pointerdown', unlockMusic, {passive:true});
document.addEventListener('touchend', unlockMusic, {passive:true});
document.addEventListener('click', unlockMusic);
document.addEventListener('keydown', event => {
  if (!event.repeat && !['Escape', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) unlockMusic(event);
});
renderTrack();
playMusic();

let timer;function notify(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>t.classList.remove('show'),4000)}document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('play.gluplandia.com');notify('Dirección copiada. Nos vemos en Gluplandia.')}catch{notify('Copia esta dirección para jugar. play.gluplandia.com')}}));const menu=document.getElementById('menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const e=document.querySelector('.embers');for(let n=0;n<24;n++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.top=60+Math.random()*40+'%';p.style.animationDelay=Math.random()*-12+'s';p.style.animationDuration=8+Math.random()*8+'s';e.appendChild(p)}}

let soundContext;

const skins = {arcane:{label:'Amatista',text:'Un brillo violeta sobre el filo.'},ember:{label:'Ascua',text:'Un resplandor cálido que recuerda a las brasas.'},frost:{label:'Escarcha',text:'Una luz fría para una expedición desconocida.'}};
document.querySelectorAll('[data-skin]').forEach(button => {
 if (button.tagName !== 'BUTTON') return;
 button.addEventListener('click', () => {
  const key=button.dataset.skin,skin=skins[key];
  document.querySelector('.enchant-art').dataset.skin=key;
  document.getElementById('weapon-preview').alt='Vista ilustrativa de una espada con apariencia '+skin.label;
  document.getElementById('skin-caption').textContent=skin.label+'. '+skin.text;
  document.querySelectorAll('button[data-skin]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 });
});
const destinations = {
  overworld: {image:'assets/overworld.jpg', alt:'Montañas volcánicas del Overworld', label:'EL VIAJE POR LA SUPERFICIE.', title:'Sigue el horizonte.', description:'Busca aldeas entre biomas renovados y descubre las ruinas que interrumpen el paisaje.', tip:'Lleva comida y una cama. Guarda las coordenadas de tu base para encontrar el camino de regreso.'},
  nether: {image:'assets/nether.png', alt:'Fortaleza del Nether sobre un mar de lava', label:'AL OTRO LADO DEL PORTAL.', title:'Adéntrate en el fuego.', description:'Los paisajes infernales y las fortalezas abren nuevas rutas entre la lava. Cada cruce exige atención.', tip:'Prepara resistencia al fuego y bloques para construir un paso seguro. Anota dónde está tu portal.'},
  end: {image:'assets/end.png', alt:'Islas suspendidas en el vacío del End', label:'DONDE TERMINA EL SUELO.', title:'Atrévete a cruzar el vacío.', description:'Explora islas suspendidas y busca las estructuras que se ocultan más allá del siguiente borde.', tip:'Lleva bloques y perlas de ender. Si vuelas con élitros, comprueba su durabilidad antes de despegar.'}
};
function chooseDestination(key) {
  const d = destinations[key];
  if (!d) return;
  const img = document.getElementById('destination-image');
  img.src = d.image; img.alt = d.alt;
  for (const field of ['label','title','description','tip']) document.getElementById('destination-' + field).textContent = d[field];
  document.querySelectorAll('[data-destination]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.destination === key)));
}
document.querySelectorAll('[data-destination]').forEach(b => b.addEventListener('click', () => chooseDestination(b.dataset.destination)));

const creatureLines = {
  creeper:['Solo venía a saludar. Creo.','Sssí, también me gusta tu casa.','Tranquilo. Hoy es una visita de cortesía.'],
  pig:['¿La expedición incluye zanahorias?','Yo llevo el entusiasmo. Tú lleva la comida.','Ese salto cuenta como entrenamiento.'],
  villager:['Hmm. Eso merece unas esmeraldas.','El precio incluye mi opinión.','Buen trato. Sobre todo para mí.']
};
const creatureClicks = {creeper:0,pig:0,villager:0};
const reduceCreatureMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-mob]').forEach(button => {
  const key = button.dataset.mob;
  const card = button.closest('.mob-card');
  let reactionTimer;
  button.addEventListener('click', () => {
    creatureClicks[key] = (creatureClicks[key] + 1) % creatureLines[key].length;
    document.getElementById('speech-' + key).textContent = creatureLines[key][creatureClicks[key]];
    clearTimeout(reactionTimer);
    card.classList.remove('reacting');
    if (!reduceCreatureMotion.matches) {
      void card.offsetWidth;
      card.classList.add('reacting');
      reactionTimer = setTimeout(() => card.classList.remove('reacting'), 750);
    }
  });
  button.addEventListener('pointermove', event => {
    if (reduceCreatureMotion.matches || event.pointerType !== 'mouse') return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--mob-tilt-x', ((event.clientX - rect.left) / rect.width - .5) * 14 + 'deg');
    button.style.setProperty('--mob-tilt-y', ((event.clientY - rect.top) / rect.height - .5) * -10 + 'deg');
  });
  button.addEventListener('pointerleave', () => {
    button.style.setProperty('--mob-tilt-x','0deg');
    button.style.setProperty('--mob-tilt-y','0deg');
  });
});
function toggleRecovery() {
  const steps = document.getElementById('recovery-steps');
  const open = steps.hidden;
  steps.hidden = !open;
  for (const id of ['recovery-toggle','recovery-chest']) document.getElementById(id).setAttribute('aria-expanded',String(open));
  document.querySelector('#recovery-toggle span').textContent = open ? '−' : '+';
}
document.getElementById('recovery-toggle').addEventListener('click',toggleRecovery);
document.getElementById('recovery-chest').addEventListener('click',toggleRecovery);

const serverRules = [...document.querySelectorAll('.server-rule')];
const expandRules = document.getElementById('rules-expand');
function syncRuleControl() {
  const allOpen = serverRules.every(rule => rule.open);
  expandRules.textContent = allOpen ? 'Cerrar todas' : 'Ver todas';
  expandRules.setAttribute('aria-expanded',String(allOpen));
}
expandRules.addEventListener('click', () => {
  const open = !serverRules.every(rule => rule.open);
  serverRules.forEach(rule => { rule.open = open; });
  syncRuleControl();
});
serverRules.forEach(rule => rule.addEventListener('toggle',syncRuleControl));

// Illustrative progression only. No connection to player accounts or server XP.
const skillPreview = {
  "mining": {
    "title": "Nivel de minería.",
    "description": "Extrae minerales y piedra para desarrollar tu experiencia bajo tierra.",
    "level": 1,
    "xp": 0
  },
  "farming": {
    "title": "Nivel de agricultura.",
    "description": "Cosecha cultivos y desarrolla tu experiencia en el campo.",
    "level": 1,
    "xp": 0
  },
  "foraging": {
    "title": "Nivel de tala.",
    "description": "Recoge madera al talar árboles y mejora tu experiencia forestal.",
    "level": 1,
    "xp": 0
  },
  "fishing": {
    "title": "Nivel de pesca.",
    "description": "Pesca para ganar experiencia y seguir mejorando con cada captura.",
    "level": 1,
    "xp": 0
  },
  "excavation": {
    "title": "Nivel de excavación.",
    "description": "Excava tierra, arena y otros materiales con tu pala.",
    "level": 1,
    "xp": 0
  },
  "archery": {
    "title": "Nivel de arquería.",
    "description": "Enfréntate a los mobs con ataques a distancia y practica tu puntería.",
    "level": 1,
    "xp": 0
  },
  "defense": {
    "title": "Nivel de defensa.",
    "description": "Resiste el daño de los encuentros para desarrollar tu defensa.",
    "level": 1,
    "xp": 0
  },
  "fighting": {
    "title": "Nivel de combate.",
    "description": "Enfréntate a los mobs cuerpo a cuerpo y desarrolla tu destreza.",
    "level": 1,
    "xp": 0
  },
  "agility": {
    "title": "Nivel de agilidad.",
    "description": "Muévete por el mundo y desarrolla tu agilidad con actividades como correr y saltar.",
    "level": 1,
    "xp": 0
  },
  "enchanting": {
    "title": "Nivel de encantamiento.",
    "description": "Gana experiencia al encantar equipo y trabajar con objetos en el yunque.",
    "level": 1,
    "xp": 0
  },
  "alchemy": {
    "title": "Nivel de alquimia.",
    "description": "Prepara pociones y desarrolla tus conocimientos de alquimia.",
    "level": 1,
    "xp": 0
  }
};
let selectedSkill = 'mining';
function renderSkillPreview() {
  const skill = skillPreview[selectedSkill];
  document.getElementById('skill-title').textContent = skill.title;
  document.getElementById('skill-description').textContent = skill.description;
  document.getElementById('skill-level').textContent = String(skill.level);
  document.getElementById('skill-xp').textContent = `${skill.xp} / 100 XP`;
  document.getElementById('skill-progress').value = skill.xp;
  document.querySelectorAll('[data-skill]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.skill === selectedSkill)));
}
document.querySelectorAll('[data-skill]').forEach(button => button.addEventListener('click', () => {
  selectedSkill = button.dataset.skill;
  renderSkillPreview();
  document.getElementById('level-feedback').textContent = 'Cada habilidad conserva su propio progreso en esta vista previa.';
}));
document.getElementById('practice-skill').addEventListener('click', () => {
  const skill = skillPreview[selectedSkill];
  skill.xp += 25;
  let leveled = false;
  if (skill.xp >= 100) { skill.xp -= 100; skill.level += 1; leveled = true; }
  renderSkillPreview();
  playExperienceSound(leveled);
  showExperienceBurst(leveled);
  document.getElementById('level-feedback').textContent = leveled ? `¡Nivel ${skill.level} en la vista previa! Sigue practicando.` : '+25 XP de ejemplo. Tu práctica cuenta.';
});
document.getElementById('reset-levels').addEventListener('click', () => {
  Object.values(skillPreview).forEach(skill => {skill.level = 1; skill.xp = 0;});
  selectedSkill = 'mining';
  renderSkillPreview();
  document.getElementById('mob-level-input').value = '5';
  document.getElementById('mob-level-badge').textContent = '5';
  document.getElementById('level-feedback').textContent = 'Vista previa reiniciada.';
});
document.getElementById('mob-level-input').addEventListener('input', event => {
  document.getElementById('mob-level-badge').textContent = event.target.value;
});

// Local Minecraft experience sounds. Music and effects have separate controls.
const orbSound = new Audio('assets/xp-orb.ogg');
const levelSound = new Audio('assets/level-up.ogg');
orbSound.preload = levelSound.preload = 'auto';
let effectsEnabled = true;
const effectsVolume = document.getElementById('sfx-volume');
function playExperienceSound(leveled) {
 if (!effectsEnabled || Number(effectsVolume.value) === 0) return;
 const sound = leveled ? levelSound : orbSound;
 sound.volume = Number(effectsVolume.value) / 100;
 sound.currentTime = 0;
 sound.play().catch(()=>{});
}
document.getElementById('sfx-toggle').addEventListener('click', event => {
 effectsEnabled = !effectsEnabled;
 event.currentTarget.setAttribute('aria-pressed', String(effectsEnabled));
 event.currentTarget.textContent = effectsEnabled ? 'Efectos de la web activados' : 'Efectos de la web silenciados';
 if (!effectsEnabled) {orbSound.pause();levelSound.pause();}
});
let burstTimer;
function showExperienceBurst(leveled) {
 const host=document.querySelector('.xp-effects');
 host.replaceChildren();
 if (reduceCreatureMotion.matches) return;
 for(let i=0;i<(leveled?12:5);i++) {
  const orb=document.createElement('i');
  orb.style.setProperty('--dx', (Math.random()*220-110)+'px');
  orb.style.setProperty('--delay', i*.025+'s');
  host.appendChild(orb);
 }
 const panel=document.querySelector('.player-progress');
 panel.classList.toggle('level-celebration',leveled);
 clearTimeout(burstTimer);
 burstTimer=setTimeout(()=>{host.replaceChildren();panel.classList.remove('level-celebration');},1200);
}
const clueMessages = ['Les pasas la mano por encima. Las marcas siguen tibias.','Por un instante distingues una silueta. Ya no está.','Las huellas llegan hasta el umbral. No ves ninguna de regreso.'];
const cluesSeen=new Set();
function inspectClue(index) {
 cluesSeen.add(index);
 document.querySelectorAll('[data-clue]').forEach(b=>b.setAttribute('aria-pressed',String(cluesSeen.has(Number(b.dataset.clue)))));
 document.getElementById('portal-count').textContent=cluesSeen.size+' / 3 señales investigadas.';
 document.getElementById('portal-message').textContent=cluesSeen.size===3 ? 'Las runas responden. Al otro lado, alguien parece haber notado tu presencia. El resto de la historia te espera en Gluplandia.' : clueMessages[index];
 document.querySelector('.portal-stage').dataset.awake=String(cluesSeen.size===3);
}
document.querySelectorAll('[data-clue]').forEach(b=>b.addEventListener('click',()=>inspectClue(Number(b.dataset.clue))));
document.getElementById('portal-art').addEventListener('click',()=>inspectClue([0,1,2].find(i=>!cluesSeen.has(i))??0));
document.getElementById('portal-reset').addEventListener('click',()=>{
 cluesSeen.clear();
 document.querySelectorAll('[data-clue]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelector('.portal-stage').dataset.awake='false';
 document.getElementById('portal-count').textContent='0 / 3 señales investigadas.';
 document.getElementById('portal-message').textContent='Acércate. La luz acaba de cambiar.';
});

const mobilePlayerToggle = document.getElementById('mobile-player-toggle');
mobilePlayerToggle.addEventListener('click', () => {
 const expanded=player.classList.toggle('mobile-expanded');
 mobilePlayerToggle.setAttribute('aria-expanded',String(expanded));
 mobilePlayerToggle.setAttribute('aria-label',expanded?'Reducir controles de música':'Ampliar controles de música');
 mobilePlayerToggle.textContent=expanded?'⌄':'⌃';
});
document.addEventListener('keydown', event => {
 if(event.key==='Escape' && nav.classList.contains('open')){
  nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');menu.focus();
 }
});

// Shared effects control for gameplay and ordinary buttons.
const globalEffects = document.getElementById('global-sfx-toggle');
function syncEffectsControls(){globalEffects.setAttribute('aria-pressed',String(effectsEnabled));globalEffects.textContent=effectsEnabled?'Efectos de la web activados':'Efectos de la web silenciados';}
globalEffects.addEventListener('click',()=>{document.getElementById('sfx-toggle').click();syncEffectsControls();});
document.getElementById('sfx-toggle').addEventListener('click',syncEffectsControls);
function interfaceTone(low=false){
 if(!effectsEnabled||Number(effectsVolume.value)===0)return;
 try{
  soundContext??=new (window.AudioContext||window.webkitAudioContext)();
  if(soundContext.state==='suspended')soundContext.resume().catch(()=>{});
  const t=soundContext.currentTime,o=soundContext.createOscillator(),g=soundContext.createGain();
  o.type='sine';o.frequency.setValueAtTime(low?145:660,t);o.frequency.exponentialRampToValueAtTime(low?65:440,t+.13);
  g.gain.setValueAtTime(.055*Number(effectsVolume.value)/100,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);
  o.connect(g);g.connect(soundContext.destination);o.start(t);o.stop(t+.18);
 }catch{}
}
document.addEventListener('click',event=>{
 const button=event.target.closest?.('button');
 if(!button||button.closest('.memory-board')||button.matches('#practice-skill,#sfx-toggle,#global-sfx-toggle,#dragon-react'))return;
 interfaceTone();
});
const dragonLines=['Dos ojos violetas se vuelven hacia ti.','El aire vibra bajo sus alas.','El vacío devuelve un rugido. Prepara tu siguiente paso.'];
let dragonIndex=0,dragonTimer;
document.getElementById('dragon-react').addEventListener('click',()=>{
 document.getElementById('dragon-message').textContent=dragonLines[dragonIndex++%dragonLines.length];
 const stage=document.querySelector('.dragon-section');stage.classList.remove('dragon-awake');void stage.offsetWidth;stage.classList.add('dragon-awake');
 clearTimeout(dragonTimer);dragonTimer=setTimeout(()=>stage.classList.remove('dragon-awake'),900);interfaceTone(true);
});
const relics=[{name:'Espada',src:'assets/enchanted-sword.png'},{name:'Cofre',src:'assets/recovery-chest.png'},{name:'Cristal',src:'assets/end-crystal.png'}];
const memoryBoard=document.getElementById('memory-board');
let memoryCards=[],memoryOpen=[],memoryLocked=false,memoryStarted=false,memoryMoves=0,memoryPairs=0,memoryTimer;
function makeMemoryBoard(started){
 clearTimeout(memoryTimer);memoryOpen=[];memoryLocked=false;memoryStarted=started;memoryMoves=0;memoryPairs=0;
 let deck=[0,0,1,1,2,2];for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
 memoryBoard.replaceChildren();
 memoryCards=deck.map((kind,index)=>{
  const b=document.createElement('button');b.type='button';b.className='memory-card';b.disabled=!started;
  b.setAttribute('aria-label','Reliquia oculta '+(index+1));b.setAttribute('aria-pressed','false');
  const img=document.createElement('img');img.src=relics[kind].src;img.alt='';img.width=200;img.height=200;
  const cover=document.createElement('span');cover.textContent='G';cover.className='relic-cover';cover.setAttribute('aria-hidden','true');
  b.append(img,cover);b.addEventListener('click',()=>flipRelic(index));memoryBoard.appendChild(b);return {button:b,kind,matched:false};
 });
 document.getElementById('memory-pairs').textContent='0 / 3';document.getElementById('memory-moves').textContent='0';
}
function flipRelic(index){
 const card=memoryCards[index];if(!memoryStarted||memoryLocked||card.matched||memoryOpen.includes(index))return;
 card.button.classList.add('revealed');card.button.setAttribute('aria-pressed','true');card.button.setAttribute('aria-label',relics[card.kind].name+' en la casilla '+(index+1));memoryOpen.push(index);interfaceTone();
 if(memoryOpen.length<2){document.getElementById('memory-status').textContent=relics[card.kind].name+' descubierta. Elige otra reliquia.';return;}
 memoryMoves++;document.getElementById('memory-moves').textContent=String(memoryMoves);
 const [a,b]=memoryOpen.map(i=>memoryCards[i]);
 if(a.kind===b.kind){
  for(const c of [a,b]){c.matched=true;c.button.classList.add('matched');c.button.setAttribute('aria-label',relics[c.kind].name+'. Pareja encontrada.');}
  memoryPairs++;memoryOpen=[];document.getElementById('memory-pairs').textContent=memoryPairs+' / 3';playExperienceSound(memoryPairs===3);
  document.getElementById('memory-status').textContent=memoryPairs===3?'Has reunido las tres parejas en '+memoryMoves+' intentos. El umbral reconoce tu memoria.':'Pareja encontrada. Quedan '+(3-memoryPairs)+'.';
  if(memoryPairs===3){memoryStarted=false;document.getElementById('memory-start').textContent='Jugar otra vez';}
 }else{
  memoryLocked=true;document.getElementById('memory-status').textContent='Son distintas. Recuerda sus lugares.';
  memoryTimer=setTimeout(()=>{memoryOpen.forEach(i=>{const c=memoryCards[i];c.button.classList.remove('revealed');c.button.setAttribute('aria-pressed','false');c.button.setAttribute('aria-label','Reliquia oculta '+(i+1));});memoryOpen=[];memoryLocked=false;document.getElementById('memory-status').textContent='Prueba otra pareja.';},1200);
 }
}
document.getElementById('memory-start').addEventListener('click',()=>{makeMemoryBoard(true);document.getElementById('memory-start').textContent='Reiniciar reto';document.getElementById('memory-status').textContent='Elige dos reliquias. Encuentra las tres parejas.';memoryCards[0].button.focus();});
makeMemoryBoard(false);
const sampleScenes=[
 {src:'assets/sample-wither-keep.jpg',title:'Wither Keep: El bastión en la cumbre.',text:'Una imponente fortaleza que vigila las llanuras. Sus murallas y salas interiores ocultan desafíos, trampas y botín de alto calibre.',alt:'Fortaleza Wither Keep'},
 {src:'assets/sample-dungeon-plains.jpg',title:'Dungeon Plains: El laberinto bajo tierra.',text:'Pasadizos y criptas subterráneas. Pasillos en penumbra custodiados por enemigos y tesoros sellados.',alt:'Galería subterránea de Dungeon Plains'},
 {src:'assets/sample-cascada-lava.jpg',title:'Cascada de Lava: El santuario de magma.',text:'Cámaras ancestrales talladas en piedra profunda. Una columna vertical de lava ilumina la cúpula resguardando secretos de expediciones pasadas.',alt:'Cámara con cascada de lava'}
];
document.querySelectorAll('[data-sample]').forEach(b=>b.addEventListener('click',()=>{
 const scene=sampleScenes[Number(b.dataset.sample)];const img=document.getElementById('sample-image');img.src=scene.src;img.alt=scene.alt;
 document.getElementById('sample-title').textContent=scene.title;document.getElementById('sample-description').textContent=scene.text;
 document.querySelectorAll('[data-sample]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));
}));
