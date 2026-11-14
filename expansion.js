/* Gluplandia's presentation interactions. Game progress is never simulated as live data. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const syncMotionPreference = () => {root.dataset.motion = motionPreference.matches ? 'off' : 'on';};
  syncMotionPreference();
  motionPreference.addEventListener('change', syncMotionPreference);

  const header = $('header');
  const scrollLine = $('#reading-progress');
  let scrollQueued = false;
  function updateScroll() {
    const y = window.scrollY;
    header?.classList.toggle('has-scrolled', y > 25);
    if (scrollLine) {
      const total = document.documentElement.scrollHeight - innerHeight;
      scrollLine.style.transform = `scaleX(${total > 0 ? y / total : 0})`;
    }
    scrollQueued = false;
  }
  addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  updateScroll();

  // Content stays visible if scripting or IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px 45px 0px' });
    $$('.gl-reveal').forEach(node => { node.classList.add('will-reveal'); observer.observe(node); });
  }

  function wireTabKeys(buttons, select) {
    buttons.forEach((button, index) => button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); select(buttons[next]); buttons[next].focus(); }
    }));
  }

  const classes = {
    warrior: {
      index: 0, color: '#ff9c53', name: 'Guerrero', title: 'El valor abre camino.',
      role: 'Combate cercano', weapon: 'Espada y escudo',
      description: 'Cuando el camino se estrecha, das el primer paso. Un estilo pensado para afrontar el combate de cerca y crear espacio para tus compañeros.',
      skills: ['Golpe de escudo', 'Segundo aliento'],
      skillText: ['Una apertura para ganar espacio en primera línea.', 'Un respiro para mantenerte en pie cuando la expedición se complica.'],
      affinities: [5, 2, 3], accent: 'FORJA TU CAMINO'
    },
    mage: {
      index: 1, color: '#c39aff', name: 'Mago', title: 'La magia cambia las reglas.',
      role: 'Magia a distancia', weapon: 'Bastón y hechizos',
      description: 'La distancia es tu aliada. El concepto del mago combina hechizos ofensivos con recursos para controlar el espacio antes de que el enemigo llegue hasta ti.',
      skills: ['Proyectil arcano', 'Paso de escarcha'],
      skillText: ['Una descarga de energía para responder desde la distancia.', 'Un efecto de control para encontrar una nueva posición.'],
      affinities: [2, 5, 3], accent: 'DESPIERTA LO ARCANO'
    },
    paladin: {
      index: 2, color: '#f5d485', name: 'Paladín', title: 'Una luz para tu grupo.',
      role: 'Protección y apoyo', weapon: 'Martillo y escudo',
      description: 'Permaneces cerca de quienes te acompañan. Esta clase está pensada para proteger al grupo y sostener la expedición cuando el combate exige resistir.',
      skills: ['Luz protectora', 'Juramento del alba'],
      skillText: ['Un destello de protección para continuar junto a tu grupo.', 'Una habilidad de apoyo ligada a la resistencia de tus aliados.'],
      affinities: [4, 3, 5], accent: 'MANTÉN VIVA LA LUZ'
    },
    ranger: {
      index: 3, color: '#83d9b7', name: 'Explorador', title: 'Siempre hay otro sendero.',
      role: 'Arquería y movilidad', weapon: 'Arco y precisión',
      description: 'Lees el terreno antes de avanzar. Un concepto orientado a elegir la posición desde la que combatir y aprovechar el espacio que ofrece cada encuentro.',
      skills: ['Disparo certero', 'Rastro salvaje'],
      skillText: ['Una oportunidad para premiar la puntería y la distancia.', 'Una forma de conectar la exploración con tu estilo de combate.'],
      affinities: [3, 3, 4], accent: 'SIGUE TU INSTINTO'
    }
  };
  const classButtons = $$('[data-class-choice]');
  const classStage = $('#class-explorer');
  let selectedClass = 'warrior';
  function chooseClass(button) {
    const key = button.dataset.classChoice, data = classes[key];
    if (!data || !classStage) return;
    selectedClass = key;
    classStage.style.setProperty('--class-color', data.color);
    classStage.dataset.class = key;
    classStage.style.setProperty('--class-position', `${data.index * 100 / 3}%`);
    $('#class-portrait').src = `assets/class-${key}.png?v=png-r2`;
    $('#class-portrait').alt = `Arte conceptual de la clase ${data.name}`;
    $('#class-name').textContent = data.name;
    $('#class-title').textContent = data.title;
    $('#class-description').textContent = data.description;
    $('#class-role').textContent = data.role;
    $('#class-weapon').textContent = data.weapon;
    $('#class-accent').textContent = data.accent;
    $('#class-number').textContent = `0${data.index + 1}`;
    $('#class-panel').setAttribute('aria-labelledby', button.id);
    classButtons.forEach(b => {
      const active = b === button;
      b.setAttribute('aria-selected', String(active));
      b.tabIndex = active ? 0 : -1;
    });
    $$('[data-class-ability]').forEach((b, i) => { $('strong', b).textContent = data.skills[i]; b.setAttribute('aria-label', `Mostrar efecto ilustrativo de ${data.skills[i]}`); });
    $$('[data-affinity]').forEach((bar, i) => {
      bar.setAttribute('aria-label', `${['Resistencia', 'Magia', 'Apoyo'][i]}, afinidad ilustrativa ${data.affinities[i]} de 5`);
      [...bar.children].forEach((pip, j) => pip.classList.toggle('filled', j < data.affinities[i]));
    });
    $('#class-skill-note').textContent = 'Toca una habilidad para ver su efecto ilustrativo.';
  }
  classButtons.forEach(b => b.addEventListener('click', () => chooseClass(b)));
  wireTabKeys(classButtons, chooseClass);
  let castTimer;
  $$('[data-class-ability]').forEach((b, i) => b.addEventListener('click', () => {
    const data = classes[selectedClass];
    $('#class-skill-note').textContent = data.skillText[i];
    classStage.classList.remove('is-casting');
    requestAnimationFrame(() => classStage.classList.add('is-casting'));
    clearTimeout(castTimer);
    castTimer = setTimeout(() => classStage.classList.remove('is-casting'), 1100);
  }));
  if (classButtons[0]) chooseClass(classButtons[0]);

  const habitats = {
    forest: { name: 'Bosques', position: '0% 0%', color: '#b9cf89', landscape: 'Un lobo y un duende entre las ruinas de un bosque',
      creatures: [
        { name: 'Lobo del bosque', role: 'Fauna territorial', icon: '◇', description: 'Su presencia forma parte de un bosque vivo. Observa el comportamiento de la manada antes de acercarte y evita convertir una expedición tranquila en un combate innecesario.', tip: 'Mantén la distancia y observa antes de atacar.', label: 'ENTRE LOS ÁRBOLES' },
        { name: 'Duende', role: 'Enemigo de expedición', icon: '⚔', description: 'Las ruinas también tienen habitantes. Los duendes añaden encuentros de combate en los que conviene mirar alrededor antes de perseguir a un enemigo entre los árboles.', tip: 'Reconoce el terreno antes de entrar en combate.', label: 'LAS RUINAS TIENEN DUEÑO' }
      ]
    },
    taiga: { name: 'Taigas', position: '100% 0%', color: '#b0d9ef', landscape: 'Un alce y un águila en una taiga nevada',
      creatures: [
        { name: 'Alce', role: 'Fauna de taiga', icon: '◇', description: 'Entre los abetos hay vida más allá de los enemigos. Los alces forman parte de la fauna de las regiones frías y dan otra escala a los encuentros durante tus viajes.', tip: 'Un encuentro también puede disfrutarse sin combatir.', label: 'EL BOSQUE RESPIRA' },
        { name: 'Águila', role: 'Ave de las tierras frías', icon: '↗', description: 'Mira hacia las copas. Las águilas amplían la vida del paisaje con encuentros aéreos que pertenecen a su entorno y pueden responder si las atacas.', tip: 'Levanta la vista y respeta la fauna.', label: 'POR ENCIMA DEL SENDERO' }
      ]
    },
    swamp: { name: 'Humedales', position: '0% 100%', color: '#84d6bb', landscape: 'Un cocodrilo y habitantes rana con instrumentos en un humedal',
      creatures: [
        { name: 'Cocodrilo', role: 'Depredador anfibio', icon: '⚔', description: 'La orilla no siempre es un refugio. El cocodrilo se mueve entre el agua y la tierra, así que elegir dónde luchar forma parte del desafío.', tip: 'Estudia la orilla y conserva una salida.', label: 'ALGO SE MUEVE EN EL AGUA' },
        { name: 'Ribbit músico', role: 'Habitante del humedal', icon: '♪', description: 'Hay encuentros que invitan a bajar la espada. Estos pequeños habitantes llevan música a los humedales y dan personalidad a los lugares que descubres.', tip: 'Detente un momento. La aventura también se escucha.', label: 'UNA MELODÍA ENTRE LA NIEBLA' }
      ]
    },
    ocean: { name: 'Océanos', position: '100% 100%', color: '#99dbe9', landscape: 'Una medusa luminosa, un caballito de mar y un pez espada en un arrecife',
      creatures: [
        { name: 'Medusa', role: 'Fauna de contacto peligroso', icon: '✧', description: 'Un océano lleno de vida también exige atención. Algunas medusas pueden envenenar a quien se acerque demasiado, aunque no parezcan perseguir a nadie.', tip: 'La curiosidad se disfruta mejor con algo de distancia.', label: 'BELLEZA BAJO LA SUPERFICIE' },
        { name: 'Pez espada', role: 'Depredador marino', icon: '⚔', description: 'Los nuevos habitantes del océano hacen que una travesía tenga sus propios encuentros. Antes de bajar, prepara una forma de respirar y un camino de regreso.', tip: 'Comprueba el aire y localiza la superficie.', label: 'EL OCÉANO TAMBIÉN TIENE GUARDIANES' }
      ]
    }
  };
  const habitatButtons = $$('[data-habitat]');
  let habitatKey = 'forest';
  function showCreature(index) {
    const habitat = habitats[habitatKey], creature = habitat.creatures[index];
    if (!creature) return;
    $('#creature-name').textContent = creature.name;
    $('#creature-role').textContent = creature.role;
    $('#creature-description').textContent = creature.description;
    $('#creature-tip').textContent = creature.tip;
    $('#creature-label').textContent = creature.label;
    $$('[data-creature]').forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
  }
  function chooseHabitat(button) {
    const key = button.dataset.habitat, data = habitats[key];
    if (!data) return;
    habitatKey = key;
    const scene = $('#habitat-scene');
    scene.style.setProperty('--habitat-position', data.position);
    $('#habitat-portrait').src = `assets/habitat-${key}.png?v=png-r2`;
    $('#habitat-portrait').alt = data.landscape;
    $('#habitat-title').textContent = data.name;
    $('#bestiary-explorer').style.setProperty('--habitat-color', data.color);
    $('#habitat-panel').setAttribute('aria-labelledby', button.id);
    habitatButtons.forEach(b => { const active = b === button; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; });
    $$('[data-creature]').forEach((b, i) => {
      $('strong', b).textContent = data.creatures[i].name;
      $('[aria-hidden]', b).textContent = data.creatures[i].icon;
    });
    showCreature(0);
  }
  habitatButtons.forEach(b => b.addEventListener('click', () => chooseHabitat(b)));
  wireTabKeys(habitatButtons, chooseHabitat);
  $$('[data-creature]').forEach((b, i) => b.addEventListener('click', () => showCreature(i)));
  if (habitatButtons[0]) chooseHabitat(habitatButtons[0]);

  const chapters = [
    { title: 'Encuentra dónde volver.', body: 'Un refugio convierte una coordenada en tu lugar en el mundo. Conoce tu entorno y prepara lo necesario antes de alejarte.', tip: 'Empieza por un refugio y una ruta de regreso.' },
    { title: 'Aprende en cada expedición.', body: 'Las actividades del mundo alimentan una progresión propia. Prueba un oficio, mejora tu equipo y descubre el estilo con el que quieres avanzar.', tip: 'Elige una habilidad y dale tiempo para crecer.' },
    { title: 'Prepárate para lo desconocido.', body: 'Los encuentros cambian cuando dejas atrás lo conocido. Una mazmorra invita a pensar en el equipo del grupo y en cómo responder a cada enemigo.', tip: 'Una buena preparación vale tanto como una buena espada.' },
    { title: 'Deja algo que merezca encontrarse.', body: 'Tu historia también puede ser una construcción o una expedición compartida. El mundo se vuelve más interesante con lo que cada jugador decide aportar.', tip: 'Construye una historia a la que quieras regresar.' }
  ];
  const chapterButtons = $$('[data-chapter]');
  function selectChapter(button) {
    const index = Number(button.dataset.chapter), chapter = chapters[index];
    if (!chapter) return;
    chapterButtons.forEach(b => { const on = b === button; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    $('#chapter-panel').setAttribute('aria-labelledby', button.id);
    $('#chapter-title').textContent = chapter.title;
    $('#chapter-description').textContent = chapter.body;
    $('#chapter-tip').textContent = chapter.tip;
    $('#chapter-number').textContent = `0${index + 1}`;
  }
  chapterButtons.forEach(b => b.addEventListener('click', () => selectChapter(b)));
  wireTabKeys(chapterButtons, selectChapter);

  const gallery = $('#gallery-dialog');
  let returnFocus;
  function openImage(source, alt, trigger) {
    if (!gallery) return;
    returnFocus = trigger;
    $('#dialog-image').src = source;
    $('#dialog-image').alt = alt;
    $('#dialog-caption').textContent = alt;
    gallery.showModal();
    root.classList.add('gl-modal-open');
  }
  $$('[data-enlarge]').forEach(b => b.addEventListener('click', () => {
    const source = b.dataset.enlarge === 'gallery' ? $('#sample-image') : $(b.dataset.enlarge);
    if (source) openImage(source.currentSrc || source.src, source.alt, b);
  }));
  if (gallery) {
    $('#close-gallery').addEventListener('click', () => gallery.close());
    gallery.addEventListener('click', e => { if (e.target === gallery) gallery.close(); });
    gallery.addEventListener('close', () => { root.classList.remove('gl-modal-open'); returnFocus?.focus(); });
  }

  // Ensure hidden menu contents are dismissed consistently on either page.
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('header nav.open')) {
      $('header nav').classList.remove('open');
      const menu = $('#menu');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menú');
      menu.focus();
    }
  });
})();
