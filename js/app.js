/* Gerri's Space Dream — page wiring: episode guide, player controls, cast. */
(function () {
  const $ = s => document.querySelector(s);
  const stageEl = $('#stage');
  const eng = new Engine(stageEl);
  let current = 0;
  let started = false;

  const store = {
    get(k, d) { try { const v = localStorage.getItem('gsd:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('gsd:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };

  /* ---------- episode guide ---------- */
  const grid = $('#epGrid');
  EPISODES.forEach((ep, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button class="ep-card" data-i="${i}">
      <span class="ep-num">${ep.n}</span>
      <span class="ep-body"><span class="ep-title">${ep.title}</span>
      <span class="ep-meta"><span class="goal-chip">${ep.goal}</span><span>${ep.runtime}</span></span>
      <span class="ep-song">♪ ${ep.song.title}</span></span></button>`;
    grid.appendChild(li);
  });
  grid.addEventListener('click', e => {
    const b = e.target.closest('.ep-card'); if (!b) return;
    select(+b.dataset.i, true);
    stageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  function renderDetails(ep) {
    const tags = ep.yt.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
    $('#details').innerHTML = `
      <div class="d-main">
        <p class="d-eyebrow">Episode ${ep.n} of ${EPISODES.length} · ${ep.runtime}</p>
        <h2>${ep.title}</h2>
        <p class="d-goal">Learning goal: <strong>${ep.goal}</strong> · Sing-along: <strong>${ep.song.title}</strong></p>
      </div>
      <details class="d-yt">
        <summary>YouTube title, description and tags</summary>
        <dl>
          <dt>Title</dt><dd id="ytTitle">${ep.yt.title}</dd>
          <dt>Description</dt><dd id="ytDesc">${ep.yt.description}</dd>
          <dt>Tags</dt><dd class="tags">${tags}</dd>
        </dl>
        <button class="btn small" id="copyYt">Copy all</button>
      </details>`;
    $('#copyYt').addEventListener('click', ev => {
      const txt = `${ep.yt.title}\n\n${ep.yt.description}\n\nTags: ${ep.yt.tags}`;
      const btn = ev.currentTarget;
      const ok = () => { btn.textContent = 'Copied'; setTimeout(() => (btn.textContent = 'Copy all'), 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, () => selectText('#ytDesc')); else selectText('#ytDesc');
    });
  }
  function selectText(sel) { const r = document.createRange(); r.selectNodeContents($(sel)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }

  function renderSceneBar(ep) {
    const bar = $('#sceneBar');
    bar.innerHTML = ep.scenes.map((s, i) => `<button class="seg${/^Sing-along/.test(s.name) ? ' song' : ''}" data-i="${i}" title="${s.name}" aria-label="Scene ${i + 1}: ${s.name}"><span></span></button>`).join('');
  }
  $('#sceneBar').addEventListener('click', e => {
    const b = e.target.closest('.seg'); if (!b) return;
    if (!started) start(+b.dataset.i); else eng.seekScene(+b.dataset.i);
  });

  // Draw the first scene as a still "poster" so the stage is never empty.
  function poster(ep) {
    eng.stop();
    eng.playing = false;
    eng.clear();
    const sc = ep.scenes[1] || ep.scenes[0];
    eng.setBg(sc.bg || 'savannah');
    (sc.cast || []).forEach(c => eng.addActor(c.id, { ...c, act: null }));
    (sc.props || []).forEach(p => eng.addProp(p.id, p.type, p));
    if (!eng.ents.has('thola') && sc.cast && sc.cast.length === 1) eng.addActor('thola', { id: 'thola', x: 980, y: 795, s: 1.3, flip: -1 });
    eng.ents.forEach(e => { if (e.kind === 'actor') eng.animateActor(e, 0); eng.place(e); });
    eng.ui.fade.classList.remove('on');
    $('#posterEp').textContent = 'Episode ' + ep.n;
    $('#posterName').textContent = ep.title;
    $('#poster').hidden = false;
    eng.ui.endCard.hidden = true;
    stageEl.classList.remove('paused');
    started = false;
    syncPlay();
  }

  function select(i, autoplay) {
    current = (i + EPISODES.length) % EPISODES.length;
    const ep = EPISODES[current];
    document.querySelectorAll('.ep-card').forEach(c => c.classList.toggle('current', +c.dataset.i === current));
    renderDetails(ep);
    renderSceneBar(ep);
    store.set('ep', current);
    if (location.hash !== '#ep' + ep.n) history.replaceState(null, '', '#ep' + ep.n);
    if (autoplay) start(0); else poster(ep);
  }

  function start(from = 0) {
    Sound.ensure();
    $('#poster').hidden = true;
    started = true;
    eng.play(EPISODES[current], from);
    stageEl.focus({ preventScroll: true });
  }

  eng.on('scene', i => {
    document.querySelectorAll('#sceneBar .seg').forEach((s, k) => { s.classList.toggle('done', k < i); s.classList.toggle('now', k === i); });
  });
  eng.on('state', syncPlay);
  eng.on('ended', ep => {
    const next = EPISODES[ep.n % EPISODES.length];
    $('#endNext').textContent = ep.n === EPISODES.length ? 'Season 1 is complete! Watch it all again from Episode 1.' : `Episode ${next.n}: ${next.title}`;
    $('#playNext').textContent = ep.n === EPISODES.length ? 'Start again from Episode 1' : 'Play next episode';
    eng.ui.endCard.hidden = false;
    eng.ui.fade.classList.remove('on');
    eng.playing = false; started = false; syncPlay();
  });
  $('#playNext').addEventListener('click', () => select(current + 1, true));
  $('#replay').addEventListener('click', () => select(current, true));

  function syncPlay() {
    const playing = started && eng.playing;
    $('#btnPlay').classList.toggle('is-playing', playing);
    $('#btnPlay').setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  /* ---------- controls ---------- */
  const playPause = () => { if (!started) start(0); else eng.toggle(); };
  $('#bigPlay').addEventListener('click', () => start(0));
  $('#btnPlay').addEventListener('click', playPause);
  $('#btnPrev').addEventListener('click', () => started ? eng.seekScene(eng.sceneIdx - 1) : null);
  $('#btnNext').addEventListener('click', () => started ? eng.seekScene(eng.sceneIdx + 1) : start(1));

  function toggleChip(id, key, apply) {
    const el = $(id);
    const set = v => { el.classList.toggle('on', v); el.setAttribute('aria-pressed', v); apply(v); store.set(key, v); };
    set(store.get(key, true));
    el.addEventListener('click', () => set(!el.classList.contains('on')));
  }
  toggleChip('#tVoice', 'voices', v => { Sound.state.voices = v; if (!v) Sound.stopSpeech(); });
  toggleChip('#tMusic', 'music', v => { Sound.state.music = v; Sound.setVolume(v ? 0.8 : 0); });
  toggleChip('#tCaps', 'captions', v => { eng.captions = v; stageEl.classList.toggle('no-caps', !v); });

  $('#btnFull').addEventListener('click', () => {
    const el = $('.player-wrap');
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    } catch (e) { /* fullscreen not allowed here */ }
  });

  stageEl.addEventListener('click', e => { if (e.target.closest('button')) return; if (started) eng.toggle(); });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, summary')) return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); playPause(); }
    if (e.key === 'ArrowRight' && started) eng.seekScene(eng.sceneIdx + 1);
    if (e.key === 'ArrowLeft' && started) eng.seekScene(eng.sceneIdx - 1);
    if (e.key === 'f') $('#btnFull').click();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && started && eng.playing) eng.pause(); });

  /* ---------- cast ---------- */
  $('#zuriPortrait').innerHTML = `<svg viewBox="0 0 600 600"><defs><linearGradient id="zbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C8BD0"/><stop offset=".6" stop-color="#F4B474"/><stop offset="1" stop-color="#FFD97A"/></linearGradient></defs>
    <rect width="600" height="600" fill="url(#zbg)"/><path d="M0,520 Q300,480 600,515 V600 H0Z" fill="#F0BC55"/>
    <g transform="translate(250,560) scale(1.1)">${CHARACTERS.zuri.draw()}</g></svg>`;

  window.GSD = { eng, select, start };

  /* ---------- start ---------- */
  const fromHash = /^#ep(\d+)$/.exec(location.hash);
  select(fromHash ? +fromHash[1] - 1 : store.get('ep', 0), false);
})();
