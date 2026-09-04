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
      ? 'Pulsa reproducir para escuchar.'
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
  if (event.target instanceof Element && event.target.closest('.music-player')) return;
  if (wantsPlayback && audio.paused && !audio.error) playMusic();
}
// Keep retrying trusted interactions until playback succeeds. A manual pause wins.
document.addEventListener('click', unlockMusic);
document.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') unlockMusic(event);
});
renderTrack();
playMusic();

let timer;function notify(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>t.classList.remove('show'),4000)}document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('play.gluplandia.com');notify('Dirección copiada. Nos vemos en Gluplandia.')}catch{notify('Copia esta dirección para jugar. play.gluplandia.com')}}));const menu=document.getElementById('menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const e=document.querySelector('.embers');for(let n=0;n<24;n++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.top=60+Math.random()*40+'%';p.style.animationDelay=Math.random()*-12+'s';p.style.animationDuration=8+Math.random()*8+'s';e.appendChild(p)}}

let soundContext;document.querySelectorAll('.copy').forEach(button=>button.addEventListener('click',()=>{if(audio.paused||audio.volume===0)return;try{soundContext??=new (window.AudioContext||window.webkitAudioContext)();const now=soundContext.currentTime;[523.25,783.99].forEach((frequency,index)=>{const tone=soundContext.createOscillator(),gain=soundContext.createGain();tone.type='sine';tone.frequency.value=frequency;gain.gain.setValueAtTime(0,now+index*.08);gain.gain.linearRampToValueAtTime(audio.volume*.09,now+index*.08+.015);gain.gain.exponentialRampToValueAtTime(.001,now+index*.08+.3);tone.connect(gain);gain.connect(soundContext.destination);tone.start(now+index*.08);tone.stop(now+index*.08+.32)})}catch{}}));
