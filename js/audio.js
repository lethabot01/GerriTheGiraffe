/* Gerri's Space Dream — sound.
 * Music and sound effects are synthesized with Web Audio (no audio files).
 * Character voices use the browser's speech engine when available.
 */
(function () {
  let ctx = null, master = null, musicBus = null, sfxBus = null;
  const state = { music: true, voices: true, volume: 0.8 };

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = state.volume; master.connect(ctx.destination);
      musicBus = ctx.createGain(); musicBus.gain.value = 0.55; musicBus.connect(master);
      sfxBus = ctx.createGain(); sfxBus.gain.value = 0.7; sfxBus.connect(master);
      if (!state.music) { musicBus.gain.value = 0; sfxBus.gain.value = 0; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  const midi = n => 440 * Math.pow(2, (n - 69) / 12);

  function tone(bus, t, f, dur, type = 'triangle', vol = 0.2, attack = 0.01) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }

  let noiseBuf = null;
  function noise(bus, t, dur, vol, fFrom, fTo, q = 1) {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true;
    f.type = 'bandpass'; f.Q.value = q; f.frequency.setValueAtTime(fFrom, t); f.frequency.exponentialRampToValueAtTime(fTo, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + dur + 0.05);
  }

  /* ---------- Sound effects ---------- */
  const SFX = {
    pop: t => { const o = tone(sfxBus, t, 500, 0.15, 'sine', 0.3); o.frequency.exponentialRampToValueAtTime(1200, t + 0.08); },
    bonk: t => { const o = tone(sfxBus, t, 420, 0.35, 'sine', 0.45); o.frequency.exponentialRampToValueAtTime(140, t + 0.3); noise(sfxBus, t, 0.08, 0.3, 2000, 800); },
    boing: t => { const o = tone(sfxBus, t, 180, 0.6, 'sine', 0.35); o.frequency.exponentialRampToValueAtTime(520, t + 0.25); o.frequency.exponentialRampToValueAtTime(260, t + 0.55); },
    flump: t => { noise(sfxBus, t, 0.5, 0.7, 300, 60, 0.7); const o = tone(sfxBus, t, 110, 0.4, 'sine', 0.5); o.frequency.exponentialRampToValueAtTime(40, t + 0.35); },
    whoosh: t => noise(sfxBus, t, 1.4, 0.35, 300, 3000, 2),
    rumble: t => { noise(sfxBus, t, 2.5, 0.5, 120, 60, 0.5); },
    chime: t => [0, 4, 7, 12].forEach((n, i) => tone(sfxBus, t + i * 0.09, midi(79 + n), 0.9, 'sine', 0.12)),
    sparkle: t => [0, 7, 12, 16, 19, 24].forEach((n, i) => tone(sfxBus, t + i * 0.06, midi(84 + n), 0.5, 'sine', 0.07)),
    tick: t => tone(sfxBus, t, 1800, 0.05, 'square', 0.06),
    oops: t => { const o = tone(sfxBus, t, 600, 0.5, 'triangle', 0.25); o.frequency.exponentialRampToValueAtTime(200, t + 0.45); },
    cheer: t => { for (let i = 0; i < 6; i++) noise(sfxBus, t + i * 0.12, 0.6, 0.18, 900 + i * 200, 1500 + i * 100, 3); SFX.sparkle(t + 0.1); },
    whistle: t => { const o = tone(sfxBus, t, 2200, 0.5, 'sine', 0.15); o.frequency.setValueAtTime(2400, t + 0.15); },
    ding: t => tone(sfxBus, t, midi(88), 1.2, 'sine', 0.18),
    thud: t => { const o = tone(sfxBus, t, 90, 0.5, 'sine', 0.7); o.frequency.exponentialRampToValueAtTime(30, t + 0.45); noise(sfxBus, t, 0.3, 0.4, 200, 80); },
    blastoff: t => { noise(sfxBus, t, 3.5, 0.6, 80, 2400, 0.8); const o = tone(sfxBus, t, 60, 3, 'sawtooth', 0.12); o.frequency.exponentialRampToValueAtTime(400, t + 3); },
  };

  function sfx(name) {
    if (!ensure() || !SFX[name]) return;
    SFX[name](ctx.currentTime + 0.01);
  }

  /* ---------- Songs ----------
   * A song is a list of lyric lines. Each line gets two bars at the song's tempo.
   * The melody is built from the syllables of each line over a I–V–vi–IV progression,
   * so every song has its own tune but always sounds friendly.
   */
  const PROG = [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]];
  const SCALE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];

  function syllables(word) {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return 0;
    const m = w.replace(/e$/, '').match(/[aeiouy]+/g);
    return Math.max(1, m ? m.length : 1);
  }

  function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }

  // Returns timing for each word so the karaoke can follow the music.
  function planLine(text, lineIdx, key, beat) {
    const words = text.split(/\s+/).filter(Boolean);
    const syl = words.map(w => Math.max(1, syllables(w)));
    const total = syl.reduce((a, b) => a + b, 0);
    // Sing across the first 7 beats of the two bars and leave a breath at the end.
    const step = Math.min(beat, Math.max(beat / 3, (7 * beat) / Math.max(total, 1)));
    const h = hash(text + lineIdx);
    const notes = [], wordTimes = [];
    let t = 0, idx = 0, prev = 4;
    const contourUp = (lineIdx % 2 === 0);
    words.forEach((w, wi) => {
      wordTimes.push(t);
      const vowels = (w.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g) || ['a']);
      for (let s = 0; s < syl[wi]; s++) {
        const vowel = ({ y: 'i' })[vowels[Math.min(s, vowels.length - 1)][0]] || vowels[Math.min(s, vowels.length - 1)][0];
        const bar = Math.floor(t / (beat * 4));
        const chord = PROG[(lineIdx * 2 + bar) % 4];
        const pos = idx / Math.max(1, total - 1);
        let target = contourUp ? 2 + Math.round(Math.sin(pos * Math.PI) * 4) : 6 - Math.round(pos * 4);
        target += ((h >> (idx % 16)) & 1) ? 1 : 0;
        // snap to a chord tone on strong beats
        const strong = Math.abs((t / beat) - Math.round(t / beat)) < 0.01;
        let n = SCALE[Math.max(0, Math.min(SCALE.length - 1, target))];
        if (strong) { let best = chord[0], bd = 99; chord.forEach(c => { [c, c + 12, c - 12].forEach(cc => { const d = Math.abs(cc - n); if (d < bd) { bd = d; best = cc; } }); }); n = best; }
        if (Math.abs(n - prev) > 7) n = prev + Math.sign(n - prev) * 4;
        prev = n;
        notes.push({ t, n: key + 12 + n, d: step * 0.95, v: vowel });
        t += step; idx++;
      }
    });
    return { notes, wordTimes, words, dur: beat * 8 };
  }

  // Schedules the song. Returns { lines:[{start, dur, words, wordTimes}], total, startAt } (seconds, audio clock).
  function planSong(lines, opts = {}) {
    const bpm = opts.bpm || 104, beat = 60 / bpm, key = opts.key ?? 60;
    const intro = beat * 4;
    const plan = { lines: [], intro, beat, key };
    let t = intro;
    lines.forEach((ln, i) => {
      if (ln.gap) { plan.lines.push({ start: t, dur: beat * 4, words: [], wordTimes: [], label: ln.label, gap: true }); t += beat * 4; return; }
      const p = planLine(ln.text, i, key, beat);
      plan.lines.push({ start: t, dur: p.dur, words: p.words, wordTimes: p.wordTimes, notes: p.notes, label: ln.label });
      t += p.dur;
    });
    plan.total = t + beat * 2;
    return plan;
  }

  // A simple singing voice: a buzzy source shaped by vowel formants, with gentle vibrato.
  // Each note sings the vowel of its syllable, so the tune follows the words.
  const FORMANTS = { a: [850, 1220, 2810], e: [500, 1900, 2600], i: [350, 2400, 3100], o: [520, 920, 2700], u: [380, 950, 2600] };
  function voiceNote(bus, t, f, d, v) {
    const src = ctx.createOscillator(); src.type = 'sawtooth'; src.frequency.setValueAtTime(f, t);
    const lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = 5.4;
    depth.gain.setValueAtTime(0, t); depth.gain.linearRampToValueAtTime(f * 0.012, t + Math.min(d, 0.35));
    lfo.connect(depth); depth.connect(src.frequency);
    const out = ctx.createGain();
    const end = t + Math.max(0.14, d);
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.5, t + 0.035);
    out.gain.setValueAtTime(0.42, end - 0.06);
    out.gain.exponentialRampToValueAtTime(0.0001, end + 0.08);
    (FORMANTS[v] || FORMANTS.a).forEach((fr, i) => {
      const bp = ctx.createBiquadFilter(), g = ctx.createGain();
      bp.type = 'bandpass'; bp.frequency.value = fr * 1.12; bp.Q.value = [6, 9, 11][i];
      g.gain.value = [1, 0.55, 0.25][i];
      src.connect(bp); bp.connect(g); g.connect(out);
    });
    out.connect(bus);
    src.start(t); lfo.start(t); src.stop(end + 0.1); lfo.stop(end + 0.1);
    return [src, lfo];
  }

  let songNodes = [];
  function playSong(plan) {
    stopSong();
    if (!ensure() || !state.music) return null;
    const t0 = ctx.currentTime + 0.15, { beat, key } = plan;
    const bars = Math.ceil(plan.total / (beat * 4));
    const keep = o => { songNodes.push(o); return o; };
    for (let b = 0; b < bars; b++) {
      const chord = PROG[b % 4], bt = t0 + b * beat * 4;
      // soft pad
      chord.forEach(c => keep(tone(musicBus, bt, midi(key - 12 + c), beat * 4, 'sine', 0.05, 0.2)));
      // bass
      keep(tone(musicBus, bt, midi(key - 24 + chord[0]), beat * 1.8, 'triangle', 0.16));
      keep(tone(musicBus, bt + beat * 2, midi(key - 24 + chord[0] + (b % 2 ? 7 : 0)), beat * 1.8, 'triangle', 0.14));
      // marimba-ish comping on the off-beats
      for (let k = 0; k < 4; k++) keep(tone(musicBus, bt + beat * k + beat / 2, midi(key + chord[(k + 1) % 3]), beat * 0.4, 'sine', 0.05));
      // kick + shaker
      for (let k = 0; k < 4; k++) {
        const kt = bt + beat * k;
        if (k % 2 === 0) { const o = keep(tone(musicBus, kt, 120, 0.25, 'sine', 0.35)); o.frequency.exponentialRampToValueAtTime(45, kt + 0.2); }
        else noise(musicBus, kt, 0.12, 0.12, 4000, 6000, 1);
        noise(musicBus, kt + beat / 2, 0.05, 0.05, 7000, 8000, 1);
      }
    }
    // melody: a sung voice on every syllable, with a soft bell doubling it
    plan.lines.forEach(ln => (ln.notes || []).forEach(nt => {
      const at = t0 + ln.start + nt.t;
      voiceNote(musicBus, at, midi(nt.n), nt.d, nt.v).forEach(keep);
      keep(tone(musicBus, at, midi(nt.n + 12), Math.max(0.12, nt.d * 0.6), 'sine', 0.025, 0.02));
    }));
    return t0;
  }

  function stopSong() {
    songNodes.forEach(o => { try { o.stop(); } catch (e) { /* already stopped */ } });
    songNodes = [];
  }

  /* ---------- Voices ---------- */
  const VOICES = {
    gerri: { pitch: 1.25, rate: 0.92 },
    thola: { pitch: 1.6, rate: 1.08 },
    kiki: { pitch: 1.9, rate: 1.45 },
    bongani: { pitch: 0.75, rate: 0.85 },
    zuri: { pitch: 1.4, rate: 1.0 },
    all: { pitch: 1.35, rate: 0.95 },
    narrator: { pitch: 1.05, rate: 0.95 },
  };
  let voiceList = [];
  const voiceListeners = [];
  // Voices that sound natural (neural / online voices in Edge, Chrome, Safari).
  const NATURAL = /natural|neural|online|enhanced|premium|google/i;
  const isNatural = v => NATURAL.test(v.name);
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    voiceList = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang))
      .sort((a, b) => (isNatural(b) - isNatural(a)) || a.name.localeCompare(b.name));
    voiceListeners.forEach(f => f(voiceList));
  }
  if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

  // state.voiceChoice maps a character to a chosen voice name ('' = choose automatically).
  state.voiceChoice = {};
  // Automatic choice: a different voice for each character where the browser has enough,
  // preferring natural South African voices, then other natural voices.
  const MALE = /\b(male|daniel|fred|alex|guy|david|ryan|william|thomas|andrew|brian|christopher|eric|roger|steffan|luke|liam|connor|mitchell|prabhat|wayne|ken|james|tony|davis|jason|mark|george|oliver|rishi|aaron|arthur)\b/i;
  const ORDER = ['gerri', 'thola', 'zuri', 'kiki', 'all', 'narrator'];
  function ranked(male) {
    const pool = voiceList.filter(v => MALE.test(v.name) === male);
    const score = v => (isNatural(v) ? 2 : 0) + (/en-ZA/i.test(v.lang) ? 1 : 0);
    return pool.slice().sort((a, b) => score(b) - score(a));
  }
  function pickVoice(who) {
    if (!voiceList.length) return null;
    const chosen = state.voiceChoice[who];
    if (chosen) { const v = voiceList.find(x => x.name === chosen); if (v) return v; }
    if (who === 'bongani') return ranked(true)[0] || ranked(false)[0] || voiceList[0];
    const fem = ranked(false), nat = fem.filter(isNatural);
    const pool = nat.length ? nat : fem.length ? fem : voiceList;
    return pool[Math.max(0, ORDER.indexOf(who)) % pool.length];
  }

  // Estimated speaking time in seconds (used for captions-only mode and as a safety net).
  function estimate(text) {
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1.4, words * 0.4 + 0.5);
  }

  // Speaks a line with the character's voice. Returns a promise, or null when voices are off/unavailable.
  function speak(text, who, onStart) {
    if (!state.voices || !('speechSynthesis' in window) || !voiceList.length) return null;
    // Spelled "Thola" on screen, but said "Tola".
    const spoken = text.replace(/[*_]/g, '').replace(/-/g, ' ').replace(/\bThola\b/g, 'Tola');
    return new Promise(resolve => {
      const u = new SpeechSynthesisUtterance(spoken);
      const v = VOICES[who] || VOICES.narrator;
      const voice = pickVoice(who); if (voice) u.voice = voice;
      // Natural voices sound strange when pushed far from their own pitch, so keep them closer to normal.
      const soft = voice && isNatural(voice);
      u.pitch = soft ? 1 + (v.pitch - 1) * 0.35 : v.pitch;
      u.rate = soft ? 1 + (v.rate - 1) * 0.6 : v.rate;
      u.volume = state.volume;
      u.onstart = () => onStart && onStart();
      u.onend = resolve; u.onerror = resolve;
      speechSynthesis.speak(u);
    });
  }

  /* ---------- Recorded tracks (the theme song) ---------- */
  let track = null;
  function playTrack(url) {
    stopTrack();
    track = new Audio(url);
    track.volume = state.music ? state.volume : 0;
    const p = track.play();
    if (p && p.catch) p.catch(() => { /* blocked or failed: karaoke falls back to the engine clock */ });
    return track;
  }
  function stopTrack() {
    if (!track) return;
    track.pause(); track.removeAttribute('src'); track.load(); track = null;
  }

  /* ---------- Recorded voice clips ----------
   * assets/voices/manifest.js lists the recorded lines (window.VOICE_CLIPS = { id: 'ep01/id.mp3' }).
   * A line with a clip plays the recording; every other line uses the speech voice. */
  let clip = null;
  function clipFor(id) { return id && window.VOICE_CLIPS && window.VOICE_CLIPS[id] ? 'assets/voices/' + window.VOICE_CLIPS[id] : null; }
  function playClip(id) {
    const url = clipFor(id);
    if (!url || !state.voices) return null;
    stopClip();
    const a = new Audio(url);
    clip = a;
    a.volume = state.volume;
    return new Promise(resolve => {
      const done = ok => { if (clip === a) clip = null; resolve(ok); };
      a.onended = () => done(true);
      a.onerror = () => done(false);
      a.play().catch(() => done(false));
    });
  }
  function stopClip() { if (clip) { clip.onended = clip.onerror = null; clip.pause(); clip = null; } }

  function stopSpeech() { if ('speechSynthesis' in window) speechSynthesis.cancel(); stopClip(); }

  window.Sound = {
    state, ensure, sfx, planSong, playSong, stopSong, speak, stopSpeech, estimate, syllables, playTrack, stopTrack,
    pauseSpeech() { if ('speechSynthesis' in window) speechSynthesis.pause(); if (clip) clip.pause(); },
    resumeSpeech() { if ('speechSynthesis' in window) speechSynthesis.resume(); if (clip) clip.play().catch(() => {}); },
    playClip, clipFor, pickVoice, isNatural,
    voices: () => voiceList,
    onVoices(f) { voiceListeners.push(f); if (voiceList.length) f(voiceList); },
    now: () => (ctx ? ctx.currentTime : performance.now() / 1000),
    ctxTime: () => (ctx ? ctx.currentTime : null),
    hasAudio: () => !!ctx && state.music,
    setVolume(v) { state.volume = v; if (master) master.gain.value = v; if (track) track.volume = state.music ? v : 0; },
    // Music and sound effects only; character voices keep their own volume.
    setMusic(on) {
      state.music = on;
      if (musicBus) musicBus.gain.value = on ? 0.55 : 0;
      if (sfxBus) sfxBus.gain.value = on ? 0.7 : 0;
      if (track) track.volume = on ? state.volume : 0;
    },
    suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); if (track && !track.paused) track.pause(); },
    resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); if (track && track.paused && !track.ended) track.play().catch(() => {}); },
  };
})();
