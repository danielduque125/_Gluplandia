(() => {
  'use strict';
  const config = window.GLUPLANDIA_DOWNLOADS || {};
  const repository = 'danielduque125/GluplandiaLauncher';
  const $ = selector => document.querySelector(selector);
  const tabs = [...document.querySelectorAll('[data-guide]')];
  let current = 'gluplandia';

  function safeInstallerUrl(value) {
    try {
      const url = new URL(value);
      if (url.protocol === 'https:' && url.hostname === 'github.com' &&
          url.pathname.startsWith(`/${repository}/releases/download/`) &&
          /\/Gluplandia-Setup-[\w.-]+\.exe$/i.test(url.pathname) && !url.username && !url.password) return url.href;
    } catch {}
    return null;
  }
  function displayRelease(release) {
    const url = safeInstallerUrl(release.url);
    if (!url) throw new Error('No se encontró un instalador compatible en esta publicación.');
    const size = Number(release.size);
    const sizeLabel = Number.isFinite(size) && size > 0
      ? `${(size / 1048576).toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MiB`
      : 'Consulta el tamaño en GitHub';
    $('#launcher-download').href = url;
    $('#release-version').textContent = release.version;
    $('#release-size').textContent = sizeLabel;
    $('#launcher-meta').textContent = `Windows x64 · ${sizeLabel} · Versión ${release.version}`;
    const digest = /^[a-f0-9]{64}$/i.test(release.sha256 || '') ? release.sha256.toLowerCase() : null;
    $('#launcher-sha').textContent = digest || 'Consulta la huella publicada en el repositorio.';
    $('#copy-checksum').disabled = !digest;
    $('#checksum-status').textContent = '';
  }
  if (config.launcherUrl) {
    try { displayRelease({ url: config.launcherUrl, version: config.launcherVersion, size: config.launcherSizeBytes, sha256: config.launcherSha256 }); }
    catch { $('#release-status').textContent = 'Consulta las versiones publicadas para elegir tu instalador.'; }
  }

  function updateProgress() {
    const checks = [...document.querySelectorAll(`#guide-${current} input[type=checkbox]`)];
    const done = checks.filter(c => c.checked).length;
    $('#step-count').textContent = checks.length ? `${done} de ${checks.length} pasos` : 'Información de Bedrock';
    const progress = $('#setup-progress');
    progress.max = checks.length || 1;
    progress.value = done;
    progress.hidden = !checks.length;
  }
  function select(tab, focus = false) {
    current = tab.dataset.guide;
    tabs.forEach(t => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      $(`#guide-${t.dataset.guide}`).hidden = !active;
    });
    updateProgress();
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
    });
  });
  document.querySelectorAll('.gl-install-step input').forEach(check => check.addEventListener('change', updateProgress));
  updateProgress();

  const menu = $('#menu'), nav = $('#download-nav');
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menú');
  }));

  $('#copy-server').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('play.gluplandia.com');
      $('#copy-feedback').textContent = 'Dirección copiada. Guárdala para la apertura.';
    } catch { $('#copy-feedback').textContent = 'Puedes copiar la dirección manualmente. play.gluplandia.com'; }
  });
  $('#copy-checksum').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#launcher-sha').textContent);
      $('#checksum-status').textContent = 'Huella copiada.';
    } catch { $('#checksum-status').textContent = 'Selecciona la huella para copiarla manualmente.'; }
  });

  // Checking is user initiated. The verified pinned release remains usable offline.
  $('#check-version').addEventListener('click', async () => {
    const button = $('#check-version'), status = $('#release-status');
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    status.textContent = 'Consultando la última publicación de Gluplandia…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`https://api.github.com/repos/${repository}/releases/latest`, {
        signal: controller.signal, headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error('La consulta no está disponible en este momento.');
      const release = await response.json();
      const asset = release.assets?.find(a => /^Gluplandia-Setup-[\w.-]+\.exe$/i.test(a.name));
      if (!asset || release.draft || release.prerelease) throw new Error('Consulta las versiones publicadas para más información.');
      displayRelease({
        url: asset.browser_download_url,
        version: String(release.tag_name).replace(/^v/, ''),
        size: asset.size,
        sha256: String(asset.digest || '').replace(/^sha256:/, '')
      });
      status.textContent = `Descarga actualizada a la versión ${String(release.tag_name).replace(/^v/, '')}.`;
    } catch {
      status.textContent = 'La versión enlazada sigue disponible. Puedes consultar las publicaciones en GitHub.';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  });
})();
