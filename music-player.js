(()=>{
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
let pending=false;let fade=0;
let playbackAttempt = 0;
const status = document.getElementById('music-status');
const trackButtons = [...document.querySelectorAll('[data-track]')];
const listToggle = document.getElementById('playlist-toggle');
const listPanel = document.getElementById('playlist-panel');
audio.volume = .18;
let targetVolume=.18;
audio.loop = false;
function syncMusic() {
  const playing = !audio.paused && !audio.ended;
  toggle.innerHTML = playing ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h4v16H7zm7 0h4v16h-4z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 3 14 9-14 9z"/></svg>';
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
  if(pending) return; pending=true; audio.volume=0;
  const attempt = ++playbackAttempt;
  wantsPlayback = true;
  status.textContent = 'Cargando música…';
  try {
    await audio.play();
    if (attempt !== playbackAttempt) return;
    status.textContent = 'Reproduciendo.';
    cancelAnimationFrame(fade);const start=performance.now();const tick=now=>{if(audio.paused)return;audio.volume=targetVolume*Math.min(1,(now-start)/1100);if(now-start<1100)fade=requestAnimationFrame(tick);};fade=requestAnimationFrame(tick);
  } catch (error) {
    if (attempt !== playbackAttempt || error.name === 'AbortError') return;
    status.textContent = error.name === 'NotAllowedError'
      ? 'Toca la página para activar la música.'
      : 'No se pudo cargar el audio. Pulsa reproducir para reintentar.';
  } finally { pending=false; }
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
  cancelAnimationFrame(fade);targetVolume=Number(volume.value)/100;audio.volume=targetVolume;
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
  if(!event.isTrusted) return;
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
try{const saved=JSON.parse(sessionStorage.getItem('gluplandia-music'));if(saved){trackIndex=Math.max(0,Math.min(tracks.length-1,Number(saved.index)||0));wantsPlayback=saved.wanted!==false;targetVolume=Number.isFinite(saved.volume)?Math.max(0,Math.min(1,saved.volume)):.18;audio.volume=targetVolume;audio.src=tracks[trackIndex].src;if(saved.time>0)audio.addEventListener('loadedmetadata',()=>{if(saved.time<audio.duration)audio.currentTime=saved.time;},{once:true});}}catch{}
volume.value=String(Math.round(targetVolume*100));document.getElementById('volume-value').value=volume.value+'%';
window.addEventListener('pagehide',()=>{try{sessionStorage.setItem('gluplandia-music',JSON.stringify({index:trackIndex,wanted:wantsPlayback,volume:targetVolume,time:audio.currentTime}));}catch{}});
renderTrack();
status.textContent = wantsPlayback?'La música comienza al interactuar.':'En pausa.';
syncMusic();


const mobilePlayerToggle = document.getElementById('mobile-player-toggle');
mobilePlayerToggle.addEventListener('click', () => {
 const expanded=player.classList.toggle('mobile-expanded');
 mobilePlayerToggle.setAttribute('aria-expanded',String(expanded));
 mobilePlayerToggle.setAttribute('aria-label',expanded?'Reducir controles de música':'Ampliar controles de música');
 mobilePlayerToggle.textContent=expanded?'⌄':'⌃';
});

})();
