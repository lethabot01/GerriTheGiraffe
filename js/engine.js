/* Gerri's Space Dream — animation engine.
 *
 * An episode is a list of scenes. A scene sets a background, a cast and props,
 * then plays "beats" in order. A beat can:
 *   s / t        speaker + line           { s:'gerri', t:'Hi friends!' }
 *   q / a / ab   question with a pause for the viewer, then the answer (said by ab, default s)
 *   cap          an on-screen stage caption (no voice)
 *   w            wait (seconds) after the beat
 *   song         sing-along (karaoke + music)        theme: true  plays the theme song
 *   title        shows the episode title card
 *   add / del / to / act / face / sfx / fx / bg / part   stage operations (see applyOps)
 *   then         operations to run after the line has been said
 *   aops         operations to run right before the answer
 */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const SPEAKERS = { all: 'Everyone', both: 'Gerri & Thola', narrator: '' };
  const ease = { inOut: k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, out: k => 1 - Math.pow(1 - k, 3), back: k => { const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); }, lin: k => k };

  class Engine {
    constructor(root) {
      this.root = root;
      this.svg = root.querySelector('svg.stage');
      this.layers = {};
      ['bg', 'back', 'actors', 'front', 'fx'].forEach(n => {
        const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'layer-' + n);
        this.svg.appendChild(g); this.layers[n] = g;
      });
      this.ui = {
        caption: root.querySelector('.caption'), who: root.querySelector('.caption .who'), line: root.querySelector('.caption .line'),
        turn: root.querySelector('.your-turn'), turnRing: root.querySelector('.your-turn .ring-fg'), turnNum: root.querySelector('.your-turn .num'),
        karaoke: root.querySelector('.karaoke'), kLabel: root.querySelector('.karaoke .klabel'), kLine: root.querySelector('.karaoke .kline'), kNext: root.querySelector('.karaoke .knext'), kTitle: root.querySelector('.karaoke .ktitle'),
        title: root.querySelector('.title-card'), fade: root.querySelector('.fade'), endCard: root.querySelector('.end-card'),
      };
      this.ents = new Map();
      this.tweens = [];
      this.waiters = [];
      this.clock = 0;
      this.playing = false;
      this.token = 0;
      this.songState = null;
      this.captions = true;
      this.listeners = {};
      this.last = performance.now();
      const loop = now => {
        const dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
        if (this.playing) { this.clock += dt; this.tick(dt); }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    on(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); }
    emit(ev, ...a) { (this.listeners[ev] || []).forEach(f => f(...a)); }

    /* ---------- clock ---------- */
    wait(sec) {
      const tok = this.token;
      return new Promise(res => this.waiters.push({ until: this.clock + sec, res, tok }));
    }
    cancelWaits() { this.waiters.forEach(w => w.res()); this.waiters = []; }
    alive(tok) { return tok === this.token; }

    /* ---------- stage ---------- */
    clear() {
      Object.values(this.layers).forEach(l => (l.innerHTML = ''));
      this.ents.clear(); this.tweens = [];
      this.hideCaption(); this.ui.turn.hidden = true; this.ui.karaoke.hidden = true; this.ui.title.hidden = true;
      this.root.classList.remove('shake');
    }

    setBg(spec) { this.layers.bg.innerHTML = BACKGROUNDS(spec); }

    makeEnt(id, kind, inner, o, parent) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'ent ' + kind + ' ' + (o.cls || ''));
      g.dataset.id = id;
      const pose = document.createElementNS(NS, 'g');
      pose.setAttribute('class', 'pose' + (o.anim ? ' anim-' + o.anim : ''));
      pose.innerHTML = inner;
      g.appendChild(pose);
      parent.appendChild(g);
      const e = { id, kind, g, pose, x: o.x ?? 800, y: o.y ?? 780, s: o.s ?? 1, rot: o.rot ?? 0, op: o.op ?? 1, flip: o.flip ?? 1, action: o.act || null, actStart: this.clock, talking: false, phase: Math.random() * 6, nextBlink: this.clock + 1 + Math.random() * 3, blinkUntil: 0, parts: {}, type: o.type };
      g.querySelectorAll('[data-part]').forEach(p => {
        const k = p.dataset.part;
        (e.parts[k] = e.parts[k] || []).push(p);
        if (!p.dataset.base) p.dataset.base = p.getAttribute('transform') || '';
      });
      this.ents.set(id, e);
      this.place(e);
      return e;
    }

    addActor(id, o = {}) {
      const ch = CHARACTERS[id.split('#')[0]];
      if (!ch) return;
      if (this.ents.has(id)) this.remove(id);
      const e = this.makeEnt(id, 'actor', ch.draw(), o, this.layers.actors);
      e.who = id.split('#')[0];
      if (o.pop) this.popIn(e);
      return e;
    }

    addProp(id, type, o = {}) {
      if (!PROPS[type]) { console.warn('Unknown prop', type); return; }
      if (this.ents.has(id)) this.remove(id);
      let parent = this.layers[o.layer || 'back'];
      if (o.on) { // attach to a character part, e.g. "gerri:head"
        const [aid, part] = o.on.split(':');
        const a = this.ents.get(aid);
        if (a && a.parts[part]) parent = a.parts[part][0];
      }
      const e = this.makeEnt(id, 'prop', PROPS[type](o), { ...o, type }, parent);
      if (o.pop) this.popIn(e);
      if (o.fadeIn) { e.op = 0; this.tween(id, { op: o.op ?? 1 }, o.fadeIn); }
      if (o.drop) { const ty = e.y; e.y = -150; this.tween(id, { y: ty }, o.drop === true ? 0.7 : o.drop, 'back'); }
      return e;
    }

    popIn(e) { const s = e.s; e.s = 0.01; this.tween(e.id, { s }, 0.45, 'back'); }

    remove(id, fade) {
      const e = this.ents.get(id);
      if (!e) return;
      if (fade) { this.tween(id, { op: 0 }, fade).then(() => this.remove(id)); return; }
      e.g.remove(); this.ents.delete(id);
      this.tweens = this.tweens.filter(t => t.e !== e);
    }

    tween(id, to, dur = 1, ez = 'inOut') {
      const e = this.ents.get(id);
      if (!e) return Promise.resolve();
      return new Promise(res => {
        const from = {}; Object.keys(to).forEach(k => (from[k] = e[k]));
        this.tweens = this.tweens.filter(t => !(t.e === e && Object.keys(to).some(k => k in t.to)));
        this.tweens.push({ e, from, to, start: this.clock, dur: Math.max(0.01, dur), ez: ease[ez] || ease.inOut, res });
      });
    }

    place(e) {
      e.g.setAttribute('transform', `translate(${e.x.toFixed(1)},${(e.y + (e.dy || 0)).toFixed(1)}) rotate(${((e.rot || 0) + (e.drot || 0)).toFixed(2)}) scale(${(e.s * e.flip).toFixed(3)},${e.s.toFixed(3)})`);
      e.g.setAttribute('opacity', e.op.toFixed(3));
    }

    setPart(e, name, extra) {
      (e.parts[name] || []).forEach(p => p.setAttribute('transform', (p.dataset.base + ' ' + extra).trim()));
    }
    showPart(e, name, on) { (e.parts[name] || []).forEach(p => (p.style.display = on ? '' : 'none')); }

    tick(dt) {
      const t = this.clock;
      // waits
      if (this.waiters.length) {
        const due = this.waiters.filter(w => w.until <= t);
        if (due.length) { this.waiters = this.waiters.filter(w => w.until > t); due.forEach(w => w.res()); }
      }
      // tweens
      const done = [];
      this.tweens.forEach(tw => {
        const k = Math.min(1, (t - tw.start) / tw.dur), v = tw.ez(k);
        Object.keys(tw.to).forEach(p => (tw.e[p] = tw.from[p] + (tw.to[p] - tw.from[p]) * v));
        if (k >= 1) done.push(tw);
      });
      if (done.length) { this.tweens = this.tweens.filter(x => !done.includes(x)); done.forEach(d => d.res()); }
      // entities
      this.ents.forEach(e => { if (e.kind === 'actor') this.animateActor(e, t); this.place(e); });
      if (this.songState) this.updateKaraoke();
      this.emit('tick', t);
    }

    animateActor(e, t) {
      const at = t - e.actStart, ph = e.phase;
      let dy = Math.sin(t * 2.2 + ph) * 3, drot = 0;
      let head = 0, neck = '', arm = 0, wing = Math.sin(t * 3 + ph) * 4, trunk = 0, ear = 0;
      const act = e.action;
      switch (act) {
        case 'hop': dy = -Math.abs(Math.sin(at * 5)) * 40; break;
        case 'bounce': dy = -Math.abs(Math.sin(at * 7)) * 16; break;
        case 'dance': drot = Math.sin(at * 4) * 7; dy = -Math.abs(Math.sin(at * 4)) * 22; arm = Math.sin(at * 8) * 35 - 40; wing = Math.sin(at * 12) * 30; head = Math.sin(at * 4) * 6; trunk = Math.sin(at * 4) * -20; ear = Math.sin(at * 8) * 8; break;
        case 'march': dy = -Math.abs(Math.sin(at * 5)) * 12; drot = Math.sin(at * 5) * 3; arm = Math.sin(at * 5) * 30; break;
        case 'wobble': drot = Math.sin(at * 14) * 4; break;
        case 'float': dy = -40 + Math.sin(at * 1.6) * 28; drot = Math.sin(at * 0.9) * 7; arm = -60 + Math.sin(at * 2) * 20; wing = Math.sin(at * 2) * 20; break;
        case 'jump': dy = -Math.abs(Math.sin(at * 1.9)) * 140; arm = -70; break;
        case 'balance': drot = Math.sin(at * 3) * 6; arm = -80; break;
        case 'tumble': drot = -75 * Math.sin(Math.min(1, at / 1.4) * Math.PI); dy = Math.sin(Math.min(1, at / 1.4) * Math.PI) * 10; break;
        case 'push': drot = 9; dy = Math.abs(Math.sin(t * 12)) * -3; arm = -70; break;
        case 'shake': drot = Math.sin(t * 30) * 1.5; break;
        case 'sad': head = 14; dy = Math.sin(t * 1.2 + ph) * 2; break;
        case 'sleep': head = 16; dy = Math.sin(t * 1.1 + ph) * 3; break;
        case 'lookup': head = -16; break;
        case 'bend': neck = 'rotate(48 70 -380)'; head = 10; break;
        case 'pretzel': neck = `rotate(${70 + Math.sin(t * 4) * 6} 70 -380)`; head = 40; drot = Math.sin(t * 5) * 3; break;
        case 'stretch': neck = `translate(0,${-40 - Math.abs(Math.sin(at * 2)) * 50})`; head = -10; arm = -110; break;
        case 'up': neck = 'translate(0,-60)'; head = -18; arm = -120; break;
        case 'down': neck = 'rotate(55 70 -380)'; head = 14; drot = e.who === 'gerri' ? 0 : 10; arm = 10; break;
        case 'wave': arm = -110 + Math.sin(at * 9) * 25; wing = Math.sin(at * 14) * 35; trunk = -40 + Math.sin(at * 6) * 15; head = Math.sin(at * 6) * 4; break;
        case 'fly': dy = -Math.abs(Math.sin(at * 3)) * 20 - 10; wing = Math.sin(at * 22) * 45; break;
        case 'lift': trunk = -55; dy = -6; break;
        case 'tool': arm = -120 + Math.sin(at * 3) * 6; break;
        case 'think': head = -8; arm = -95; break;
        case 'listen': head = -10 + Math.sin(at * 2) * 3; break;
        case 'cheer': dy = -Math.abs(Math.sin(at * 6)) * 32; arm = -140 + Math.sin(at * 12) * 20; wing = Math.sin(at * 18) * 40; trunk = -70; break;
        case 'breathe': { const k = (Math.sin(at * 1.3) + 1) / 2; dy = -k * 6; head = -k * 8; break; }
        case 'still': dy = 0; break;
      }
      if (e.talking) head += Math.sin(t * 9 + ph) * 2.2;
      e.dy = dy; e.drot = drot;
      // parts
      this.setPart(e, 'head', `rotate(${head.toFixed(1)} ${e.parts.head ? e.parts.head[0].dataset.ox : 0} ${e.parts.head ? e.parts.head[0].dataset.oy : 0})`);
      if (e.parts.neck) this.setPart(e, 'neck', neck);
      if (e.parts.armR) this.setPart(e, 'armR', `rotate(${arm.toFixed(1)} 30 -138)`);
      if (e.parts.armL) this.setPart(e, 'armL', `rotate(${(act === 'dance' || act === 'cheer' || act === 'float' || act === 'jump' || act === 'balance' ? -arm : 0).toFixed(1)} -30 -138)`);
      if (e.parts.wing) this.setPart(e, 'wing', `rotate(${wing.toFixed(1)} -10 -96)`);
      if (e.parts.trunk) this.setPart(e, 'trunk', `rotate(${trunk.toFixed(1)} 46 16)`);
      if (e.parts.ear) this.setPart(e, 'ear', `rotate(${ear.toFixed(1)} -30 -20)`);
      if (e.parts.tail) this.setPart(e, 'tail', `rotate(${(Math.sin(t * 3 + ph) * 4).toFixed(1)} ${e.who === 'gerri' ? '-138 -350' : '-26 -30'})`);
      // blink
      const sleeping = act === 'sleep';
      if (!sleeping && t > e.nextBlink) { e.blinkUntil = t + 0.13; e.nextBlink = t + 2.2 + Math.random() * 3.5; }
      const closed = sleeping || e.eyesShut || t < e.blinkUntil;
      if (closed !== e._closed) { this.showPart(e, 'eyesOpen', !closed); this.showPart(e, 'eyesClosed', closed); e._closed = closed; }
      // talking mouth
      const open = (e.talking && Math.sin(t * 17 + ph) + Math.sin(t * 11) * 0.6 > 0) || e.mouthHold || act === 'cheer';
      if (open !== e._open) { this.showPart(e, 'mouthOpen', open); this.showPart(e, 'mouthClosed', !open); e._open = open; }
    }

    /* ---------- operations ---------- */
    applyOps(b) {
      if (!b) return;
      if (b.bg) this.setBg(b.bg);
      if (b.del) [].concat(b.del).forEach(id => this.remove(id, b.fadeOut));
      if (b.add) b.add.forEach(p => {
        if (CHARACTERS[p.id.split('#')[0]] && !p.type) this.addActor(p.id, p);
        else this.addProp(p.id, p.type, p);
      });
      if (b.to) Object.entries(b.to).forEach(([id, v]) => { const { dur, ez, ...rest } = v; this.tween(id, rest, dur ?? 1, ez); });
      if (b.act) Object.entries(b.act).forEach(([id, a]) => { const e = this.ents.get(id); if (e) { e.action = a; e.actStart = this.clock; } });
      if (b.face) Object.entries(b.face).forEach(([id, f]) => { const e = this.ents.get(id); if (e) e.flip = f; });
      if (b.part) Object.entries(b.part).forEach(([id, parts]) => { const e = this.ents.get(id); if (e) Object.entries(parts).forEach(([k, on]) => this.showPart(e, k, on)); });
      if (b.eyes) Object.entries(b.eyes).forEach(([id, shut]) => { const e = this.ents.get(id); if (e) e.eyesShut = shut; });
      if (b.sfx) [].concat(b.sfx).forEach(s => Sound.sfx(s));
      if (b.fx) [].concat(b.fx).forEach(f => this.effect(f));
      if (b.glow) [].concat(b.glow).forEach(id => { const e = this.ents.get(id); if (e) { e.g.classList.remove('glowing'); e.g.getBoundingClientRect(); e.g.classList.add('glowing'); } });
      if (b.num) { // light up a countdown number on a chalkboard
        const n = this.svg.querySelector(`[data-num="${b.num}"]`); if (n) { n.setAttribute('opacity', '1'); n.setAttribute('fill', '#FFD24A'); }
      }
      if (b.run) b.run(this);
    }

    effect(f) {
      if (f === 'shake') { this.root.classList.remove('shake'); void this.root.offsetWidth; this.root.classList.add('shake'); setTimeout(() => this.root.classList.remove('shake'), 700); }
      if (f === 'confetti' || f === 'stars') {
        for (let i = 0; i < 40; i++) {
          const id = 'cf' + Math.random().toString(36).slice(2, 8);
          const x = Math.random() * 1600, col = ['#FFD24A', '#4FB3E6', '#F47EB0', '#7DAA41', '#fff'][i % 5];
          const e = this.makeEnt(id, 'prop', `<g class="fall" style="animation-delay:${(Math.random() * 1.2).toFixed(2)}s;animation-duration:${(2.4 + Math.random() * 1.5).toFixed(2)}s">${SVGHelpers.star(0, 0, 10 + Math.random() * 10, col)}</g>`, { x, y: -40 }, this.layers.fx);
          setTimeout(() => this.remove(id), 5000);
        }
      }
      if (f === 'flash') { this.ui.fade.classList.add('flash'); setTimeout(() => this.ui.fade.classList.remove('flash'), 500); }
    }

    /* ---------- captions ---------- */
    showCaption(who, text, kind, dir) {
      const name = SPEAKERS[who] ?? (CHARACTERS[who] ? CHARACTERS[who].name : who);
      this.ui.who.textContent = name;
      this.ui.who.hidden = !name;
      this.ui.who.style.setProperty('--who', CHARACTERS[who] ? CHARACTERS[who].color : '#7a4a9a');
      this.ui.line.textContent = text;
      if (dir) { const em = document.createElement('em'); em.textContent = dir + ' '; this.ui.line.prepend(em); }
      this.ui.caption.className = 'caption ' + (kind || '') + (this.captions ? '' : ' off');
      this.ui.caption.hidden = false;
    }
    hideCaption() { this.ui.caption.hidden = true; }

    speakers(who) {
      if (who === 'all') return [...this.ents.values()].filter(e => e.kind === 'actor');
      if (who === 'both') return ['gerri', 'thola'].map(k => this.ents.get(k)).filter(Boolean);
      return [].concat(who).map(k => this.ents.get(k)).filter(Boolean);
    }

    async say(who, text, kind, dir) {
      const tok = this.token;
      const actors = this.speakers(who);
      this.showCaption(who, text, kind, dir);
      actors.forEach(a => (a.talking = true));
      const est = Sound.estimate(text);
      const sp = this.playing ? Sound.speak(text, who) : null;
      if (sp) await Promise.race([sp, this.wait(est * 2.5 + 2)]);
      else await this.wait(est);
      actors.forEach(a => (a.talking = false));
      if (!this.alive(tok)) return;
      await this.wait(0.3);
    }

    async yourTurn(sec = 3) {
      const tok = this.token;
      this.ui.turn.hidden = false;
      this.ui.turnRing.style.animationDuration = sec + 's';
      this.ui.turnRing.classList.remove('run'); void this.ui.turnRing.getBoundingClientRect(); this.ui.turnRing.classList.add('run');
      for (let i = sec; i > 0; i--) {
        this.ui.turnNum.textContent = i;
        Sound.sfx('tick');
        await this.wait(1);
        if (!this.alive(tok)) return;
      }
      this.ui.turn.hidden = true;
    }

    /* ---------- songs ---------- */
    // A sing-along over a recorded track. song.timing lists when each line is sung (seconds into the track).
    async singTrack(song, fx) {
      const tok = this.token;
      const lines = song.timing.map(tm => {
        if (tm.block) return { start: tm.start, words: [], wordTimes: [], block: tm.block, label: tm.label };
        const words = tm.text.split(/\s+/).filter(Boolean);
        const syl = words.map(w => Math.max(1, Sound.syllables(w)));
        const total = syl.reduce((a, b) => a + b, 0), span = (tm.end - tm.start) * 0.92;
        let acc = 0;
        const wordTimes = syl.map(n => { const t = (acc / total) * span; acc += n; return t; });
        return { start: tm.start, words, wordTimes, label: tm.label };
      });
      const plan = { lines, total: song.duration };
      this.hideCaption();
      this.ui.kTitle.textContent = song.title;
      this.ui.karaoke.hidden = false;
      this.ui.karaoke.classList.remove('block');
      this.ui.kLine.innerHTML = ''; this.ui.kNext.textContent = lines[0] && lines[0].words.join(' ');
      this.ui.kLabel.textContent = 'Get ready to sing!';
      const track = this.playing ? Sound.playTrack(song.audio) : null;
      this.songState = { plan, start: this.clock, lineIdx: -1, wordIdx: -1, fx, label: '', track };
      // Follow the track until it ends; the clock is a safety net if it never loads.
      while (this.alive(tok)) {
        const t = this.clock - this.songState.start;
        if (track && (track.ended || track.error) ) break;
        if (t > plan.total + (track && track.currentTime > 0 ? 3 : 0.3)) break;
        await this.wait(0.1);
      }
      this.songState = null;
      Sound.stopTrack();
      if (!this.alive(tok)) return;
      this.ui.karaoke.hidden = true;
      this.ui.karaoke.classList.remove('block');
    }

    async sing(song, fx) {
      if (song.audio) return this.singTrack(song, fx);
      const tok = this.token;
      const lines = [];
      song.parts.forEach(p => p.lines.forEach((l, i) => lines.push({ text: l, label: i === 0 ? p.label : null })));
      const plan = Sound.planSong(lines, { bpm: song.bpm, key: song.key });
      this.hideCaption();
      this.ui.kTitle.textContent = song.title;
      this.ui.karaoke.hidden = false;
      this.ui.kLine.innerHTML = ''; this.ui.kNext.textContent = lines[0] ? lines[0].text : '';
      this.ui.kLabel.textContent = 'Get ready to sing!';
      if (this.playing) Sound.playSong(plan);
      this.songState = { plan, start: this.clock + 0.15, lineIdx: -1, wordIdx: -1, fx, label: '' };
      await this.wait(plan.total + 0.2);
      this.songState = null;
      Sound.stopSong();
      if (!this.alive(tok)) return;
      this.ui.karaoke.hidden = true;
    }

    updateKaraoke() {
      const st = this.songState, lines = st.plan.lines;
      const t = st.track && st.track.currentTime > 0 && !st.track.error ? st.track.currentTime : this.clock - st.start;
      let li = -1;
      for (let i = 0; i < lines.length; i++) if (t >= lines[i].start) li = i;
      if (li !== st.lineIdx) {
        st.lineIdx = li; st.wordIdx = -1;
        if (li >= 0) {
          const ln = lines[li];
          if (ln.label) st.label = ln.label;
          this.ui.kLabel.textContent = st.label;
          this.ui.karaoke.classList.toggle('block', !!ln.block);
          if (ln.block) this.ui.kLine.innerHTML = ln.block.map(l => `<span class="bl">${l.replace(/</g, '&lt;')}</span>`).join('');
          else this.ui.kLine.innerHTML = ln.words.map(w => `<span>${w.replace(/</g, '&lt;')}</span>`).join(' ');
          const nx = lines[li + 1];
          this.ui.kNext.textContent = nx && !nx.block ? (nx.label && nx.label !== st.label ? nx.label + ': ' : '') + nx.words.join(' ') : '';
          if (st.fx) st.fx(li, this, ln);
        }
      }
      if (li >= 0 && !lines[li].block) {
        const ln = lines[li], lt = t - ln.start;
        let wi = -1; ln.wordTimes.forEach((wt, i) => { if (lt >= wt) wi = i; });
        if (wi !== st.wordIdx) {
          st.wordIdx = wi;
          [...this.ui.kLine.children].forEach((sp, i) => sp.className = i < wi ? 'sung' : i === wi ? 'now' : '');
        }
      }
    }

    /* ---------- playback ---------- */
    async runBeat(b, ep) {
      const tok = this.token;
      if (b.cap !== undefined && !b.s) { this.showCaption('narrator', b.cap, 'direction'); }
      this.applyOps(b);
      if (b.title) await this.titleCard(ep, b.title === true ? 3.2 : b.title);
      else if (b.theme) await this.sing(THEME_SONG, b.fx);
      else if (b.song) await this.sing(ep.song, b.fx);
      else if (b.s) {
        await this.say(b.s, b.t, b.q ? 'question' : '', b.cap);
        if (!this.alive(tok)) return;
        this.applyOps(b.then);
        if (b.q) {
          const listeners = this.speakers(b.s); listeners.forEach(a => { a._prev = a.action; a.action = 'listen'; a.actStart = this.clock; });
          await this.yourTurn(b.qd || 3);
          if (!this.alive(tok)) return;
          listeners.forEach(a => { a.action = a._prev; });
          this.applyOps(b.aops);
          if (b.a) await this.say(b.ab || b.s, b.a, 'answer');
        }
      } else if (b.then) this.applyOps(b.then);
      if (!this.alive(tok)) return;
      if (b.w) await this.wait(b.w);
      if (b.cap !== undefined && !b.s && !b.keep) this.hideCaption();
    }

    async titleCard(ep, sec) {
      const c = this.ui.title;
      c.querySelector('.ep').textContent = 'Episode ' + ep.n;
      c.querySelector('.name').textContent = ep.title;
      c.querySelector('.goal').textContent = 'Today we learn: ' + ep.goal;
      c.hidden = false;
      Sound.sfx('chime');
      await this.wait(sec);
      c.hidden = true;
    }

    async runScene(ep, i) {
      const tok = this.token;
      const sc = ep.scenes[i];
      this.emit('scene', i);
      this.ui.fade.classList.add('on');
      await this.wait(0.35);
      if (!this.alive(tok)) return;
      this.clear();
      this.setBg(sc.bg || 'savannah');
      (sc.cast || []).forEach(c => this.addActor(c.id, c));
      (sc.props || []).forEach(p => this.addProp(p.id, p.type, p));
      this.ui.fade.classList.remove('on');
      await this.wait(0.35);
      for (const b of sc.beats) {
        if (!this.alive(tok)) return;
        await this.runBeat(b, ep);
      }
    }

    async play(ep, from = 0) {
      this.stop();
      const tok = this.token;
      this.ep = ep; this.sceneIdx = from;
      this.ui.endCard.hidden = true;
      this.playing = true;
      this.emit('state');
      for (let i = from; i < ep.scenes.length; i++) {
        this.sceneIdx = i;
        await this.runScene(ep, i);
        if (!this.alive(tok)) return;
      }
      this.ui.fade.classList.add('on');
      await this.wait(0.5);
      if (!this.alive(tok)) return;
      this.emit('ended', ep);
    }

    stop() {
      this.token++;
      this.cancelWaits();
      Sound.stopSpeech(); Sound.stopSong(); Sound.stopTrack();
      this.songState = null;
    }

    pause() { if (!this.playing) return; this.playing = false; Sound.pauseSpeech(); Sound.suspend(); this.root.classList.add('paused'); this.emit('state'); }
    resume() { if (this.playing) return; this.playing = true; this.last = performance.now(); Sound.resumeSpeech(); Sound.resume(); this.root.classList.remove('paused'); this.emit('state'); }
    toggle() { this.playing ? this.pause() : this.resume(); }
    seekScene(i) {
      if (!this.ep) return;
      i = Math.max(0, Math.min(this.ep.scenes.length - 1, i));
      const wasPaused = !this.playing;
      this.play(this.ep, i);
      if (wasPaused) { this.root.classList.remove('paused'); }
    }
  }

  window.Engine = Engine;
})();
