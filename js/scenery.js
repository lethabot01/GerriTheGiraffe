/* Gerri's Space Dream — backgrounds and props.
 * Stage is 1600 x 900; the ground line sits around y = 780.
 * BACKGROUNDS[name](opts) and PROPS[type](opts) return SVG markup.
 */
(function () {
  const { star } = window.SVGHelpers;

  // Small deterministic random so the stars are in the same place every time.
  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  const SKIES = {
    day: ['#9C8BD0', '#F4B474', '#FFD97A'],
    sunset: ['#7E6AC2', '#F08A5D', '#FFC66B'],
    dawn: ['#B9A4E0', '#FFB38A', '#FFE7A3'],
    dusk: ['#3E3A86', '#A0619C', '#F39A6B'],
    night: ['#0D1844', '#1E2D6B', '#3B4C8F'],
    space: ['#05081F', '#0D1440', '#1A1F5C'],
    dark: ['#151227', '#231d3a', '#33284a'],
  };

  function sky(kind, seed = 7) {
    const [a, b, c] = SKIES[kind] || SKIES.day;
    let out = `<defs><linearGradient id="sky-${kind}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#sky-${kind})"/>`;
    if (kind === 'night' || kind === 'space' || kind === 'dusk' || kind === 'dark') {
      const r = rng(seed);
      const n = kind === 'dusk' ? 25 : kind === 'dark' ? 0 : 90;
      for (let i = 0; i < n; i++) {
        const x = r() * 1600, y = r() * (kind === 'space' ? 900 : 560), s = 1 + r() * 2.6;
        out += `<circle class="twinkle" style="animation-delay:${(r() * 3).toFixed(2)}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" fill="#FFF6D8"/>`;
      }
      for (let i = 0; i < (kind === 'space' ? 10 : kind === 'night' ? 6 : 0); i++) {
        out += `<g class="twinkle" style="animation-delay:${(r() * 3).toFixed(2)}s">${star(r() * 1600, r() * 500, 7 + r() * 6, '#FFE9A8')}</g>`;
      }
    } else {
      out += `<circle cx="1260" cy="560" r="90" fill="#FFF1B8" opacity=".55"/><circle cx="1260" cy="560" r="60" fill="#FFF6D0" opacity=".8"/>`;
      out += cloud(260, 180, 1.2) + cloud(980, 130, 0.9) + cloud(1380, 260, 0.7);
    }
    return out;
  }

  const cloud = (x, y, s) => `<g class="drift" transform="translate(${x},${y}) scale(${s})" opacity=".75">
    <ellipse cx="0" cy="0" rx="110" ry="34" fill="#FFE4C2"/><ellipse cx="-40" cy="-22" rx="56" ry="38" fill="#FFE9CC"/><ellipse cx="34" cy="-30" rx="64" ry="46" fill="#FFEFD6"/></g>`;

  function acacia(x, y, s, col = '#7E9B3A', trunk = '#6B4A2B') {
    return `<g transform="translate(${x},${y}) scale(${s})">
      <path d="M-8,0 C-6,-60 -10,-110 -40,-150 M-4,-70 C10,-110 30,-130 60,-150 M-6,-40 C-30,-60 -60,-70 -90,-130" stroke="${trunk}" stroke-width="16" fill="none" stroke-linecap="round"/>
      <ellipse cx="-10" cy="-160" rx="170" ry="34" fill="${col}"/>
      <ellipse cx="-70" cy="-172" rx="90" ry="24" fill="${col}"/><ellipse cx="60" cy="-176" rx="100" ry="26" fill="${col}"/>
      <ellipse cx="-10" cy="-150" rx="150" ry="14" fill="#000" opacity=".08"/></g>`;
  }

  function ground(kind) {
    const night = kind === 'night' || kind === 'dark' || kind === 'dusk';
    const far = night ? '#4b3f6e' : '#C58FA0', mid = night ? '#5a5a3a' : '#E7A948', near = night ? '#6b6236' : '#F0BC55';
    const tree = night ? '#2f3b2a' : '#7E9B3A', trunk = night ? '#2a2018' : '#6B4A2B';
    let g = `<path d="M0,640 Q200,590 420,630 T860,610 T1300,628 T1600,600 V900 H0Z" fill="${far}" opacity=".55"/>`;
    g += acacia(170, 660, 0.55, tree, trunk) + acacia(1420, 650, 0.7, tree, trunk) + acacia(1180, 668, 0.35, tree, trunk);
    g += `<path d="M0,690 Q400,650 800,680 T1600,670 V900 H0Z" fill="${mid}"/>`;
    g += `<path d="M0,760 Q500,730 900,752 T1600,744 V900 H0Z" fill="${near}"/>`;
    const r = rng(11);
    for (let i = 0; i < 26; i++) {
      const x = r() * 1600, y = 720 + r() * 160, h = 14 + r() * 18;
      g += `<path d="M${x},${y} l-6,-${h} M${x},${y} l2,-${h * 1.2} M${x},${y} l8,-${h * 0.9}" stroke="${night ? '#7f7444' : '#C98E2C'}" stroke-width="3" stroke-linecap="round"/>`;
    }
    return g;
  }

  function moon(phase, x, y, r) {
    const glow = `<circle cx="${x}" cy="${y}" r="${r * 1.6}" fill="#FFF3C4" opacity=".12"/><circle cx="${x}" cy="${y}" r="${r * 1.25}" fill="#FFF3C4" opacity=".15"/>`;
    return glow + PROPS.moon({ phase, r, face: phase === 'full' }).replace('<g>', `<g transform="translate(${x},${y})">`);
  }

  function shed(dark) {
    const w = dark ? '#6a4a33' : '#A9714A', w2 = dark ? '#5a3d29' : '#8E5C3A';
    return `<g transform="translate(60,420)">
      <rect x="0" y="40" width="430" height="330" fill="${w}"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${i * 54 + 10},40 v330" stroke="${w2}" stroke-width="4"/>`).join('')}
      <path d="M-30,50 L215,-60 L460,50Z" fill="${dark ? '#7a3b2c' : '#C2563A'}"/>
      <path d="M-30,50 L215,-60 L460,50" stroke="${dark ? '#4e231a' : '#8E3A24'}" stroke-width="10" fill="none" stroke-linejoin="round"/>
      <rect x="40" y="110" width="110" height="80" rx="6" fill="${dark ? '#f2c56a' : '#FFE7A8'}" stroke="${w2}" stroke-width="8"/>
      <path d="M95,110 v80 M40,150 h110" stroke="${w2}" stroke-width="6"/>
      <rect x="300" y="210" width="100" height="160" fill="${w2}"/>
      <path d="M200,100 l20,30 M230,96 l-4,40 M260,100 l-14,30" stroke="#9aa3ad" stroke-width="7" stroke-linecap="round"/>
      <rect x="180" y="300" width="40" height="50" rx="6" fill="#E24B4B"/><rect x="226" y="314" width="34" height="36" rx="6" fill="#4FB3E6"/><rect x="190" y="292" width="20" height="10" fill="#9aa3ad"/>
      <path d="M-20,58 q60,34 120,4 q60,34 120,4 q60,34 120,4 q60,34 120,4" stroke="#3a2a1a" stroke-width="2.5" fill="none"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<circle class="twinkle" style="animation-delay:${(i * 0.25).toFixed(2)}s" cx="${-20 + i * 40 + 20}" cy="${74 - Math.abs(((i % 3) - 1)) * 10}" r="7" fill="#FFE07A"/>`).join('')}
      <g transform="translate(215,-6)"><path d="M-70,-30 v-26 M70,-30 v-26" stroke="#5a3d29" stroke-width="4"/>
        <rect x="-150" y="-30" width="300" height="62" rx="6" fill="#E9C48A" stroke="#8E5C3A" stroke-width="5"/>
        <text y="-6" text-anchor="middle" font-size="21" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#4a2a12">GERRI &amp; THOLA'S</text>
        <text y="20" text-anchor="middle" font-size="21" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#4a2a12">BIG IDEAS WORKSHOP</text></g>
      <g transform="translate(170,140)"><rect x="-58" y="-40" width="116" height="84" rx="4" fill="#2F3B33" stroke="#8E5C3A" stroke-width="6"/>
        <text y="-14" text-anchor="middle" font-size="14" font-family="'Baloo 2',sans-serif" font-weight="700" fill="#F4F1E8">DREAM IT.</text>
        <text y="4" text-anchor="middle" font-size="14" font-family="'Baloo 2',sans-serif" font-weight="700" fill="#F4F1E8">BUILD IT.</text>
        <text y="22" text-anchor="middle" font-size="14" font-family="'Baloo 2',sans-serif" font-weight="700" fill="#F4F1E8">BELIEVE IT!</text></g>
      <g transform="translate(-6,120)"><path d="M0,-40 v14" stroke="#3a2a1a" stroke-width="3"/><rect x="-14" y="-26" width="28" height="38" rx="6" fill="#FFD27A" stroke="#4a3a2a" stroke-width="4"/><circle cy="-6" r="40" fill="#FFD27A" opacity=".18"/></g>
      <g transform="translate(20,300)"><rect x="0" y="0" width="140" height="70" rx="4" fill="#3E86C4" stroke="#2a5f8f" stroke-width="4"/>
        <text x="70" y="22" text-anchor="middle" font-size="15" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#fff">RECYCLE</text>
        <text x="70" y="40" text-anchor="middle" font-size="15" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#fff">REUSE</text>
        <text x="70" y="58" text-anchor="middle" font-size="15" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#fff">IMAGINE!</text></g>
      </g>`;
  }

  window.BACKGROUNDS = function (o) {
    if (typeof o === 'string') o = PRESETS[o] || { sky: o };
    let out = sky(o.sky || 'day', o.seed);
    if (o.moon) out += moon(o.moon, o.moonX || 1250, o.moonY || 190, o.moonR || 80);
    if (o.earth) out += `<g transform="translate(${o.earthX || 1230},${o.earthY || 620})">${PROPS.planet({ name: 'earth', r: o.earthR || 230 })}</g>`;
    if (o.ground !== false) out += ground(o.sky);
    if (o.bigTree) out += acacia(560, 520, 1.6, o.sky === 'night' || o.sky === 'dark' ? '#2f3b2a' : '#7E9B3A', o.sky === 'night' || o.sky === 'dark' ? '#2a2018' : '#6B4A2B');
    if (o.shed) out += shed(o.sky === 'night' || o.sky === 'dark' || o.sky === 'dusk');
    if (o.pad) out += `<g transform="translate(1080,780)"><rect x="-190" y="-26" width="380" height="34" rx="8" fill="#8d96a3"/><rect x="-170" y="-40" width="340" height="18" rx="6" fill="#b5bec9"/><path d="M-150,8 v40 M150,8 v40" stroke="#6d7580" stroke-width="12"/></g>`;
    if (o.tint) out += `<rect width="1600" height="900" fill="${o.tint}"/>`;
    return out;
  };

  const PRESETS = {
    night: { sky: 'night', moon: 'full' },
    nightCrescent: { sky: 'night', moon: 'crescent' },
    workshop: { sky: 'day', shed: true, bigTree: true },
    workshopEve: { sky: 'dusk', shed: true, bigTree: true, moon: 'full', moonX: 1350, moonY: 160, moonR: 60 },
    workshopNight: { sky: 'night', shed: true, bigTree: true, tint: 'rgba(10,10,40,.15)' },
    darkroom: { sky: 'dark', ground: false },
    savannah: { sky: 'day' },
    sunset: { sky: 'sunset' },
    sunrise: { sky: 'dawn', pad: true },
    launchpad: { sky: 'sunset', pad: true },
    launchpadNight: { sky: 'night', pad: true, moon: 'crescent' },
    space: { sky: 'space', ground: false, earth: true },
    deepspace: { sky: 'space', ground: false },
    acacia: { sky: 'day', bigTree: true },
    acaciaNight: { sky: 'night', bigTree: true, moon: 'half' },
  };

  /* ---------------- Props ---------------- */
  const PROPS = {};

  // The season's rocket. It changes episode by episode.
  // opts: h (height), w, color: cardboard|silverred|silver, door: tiny|short|tall|none,
  //       win: none|low|high, legs (triangle legs), stripe (planet stripe), dome (neck dome),
  //       nose (triangle nose), buttons (square buttons)
  PROPS.rocket = (o = {}) => {
    const h = o.h || 520, w = o.w || 220, c = o.color || 'silverred';
    const body = c === 'cardboard' ? '#C9925A' : '#C9D2DD', body2 = c === 'cardboard' ? '#B07A45' : '#A9B4C2';
    const red = c === 'cardboard' ? '#A86A38' : '#E04848';
    const top = -h + w * 0.55;
    let s = `<g>`;
    if (o.legs) s += `<path d="M${-w / 2},-120 L${-w / 2 - 70},0 L${-w / 2 + 10},0Z M${w / 2},-120 L${w / 2 + 70},0 L${w / 2 - 10},0Z" fill="${red}" stroke="#9b2c2c" stroke-width="4" stroke-linejoin="round"/>`;
    else s += `<path d="M${-w / 2},-110 L${-w / 2 - 50},0 L${-w / 2},0Z M${w / 2},-110 L${w / 2 + 50},0 L${w / 2},0Z" fill="${red}"/>`;
    s += `<rect x="${-w / 2}" y="${top}" width="${w}" height="${h - w * 0.55 - (o.legs ? 30 : 0)}" rx="18" fill="${body}" stroke="${body2}" stroke-width="5"/>`;
    s += `<path d="M${-w / 2 + 14},${top + 10} v${h - w * 0.55 - 40}" stroke="#fff" stroke-width="10" opacity=".35" stroke-linecap="round"/>`;
    if (o.stripe) s += `<rect x="${-w / 2}" y="${top + (h - w * 0.55) * 0.55}" width="${w}" height="40" fill="#4FB3E6"/>` +
      ['#E8A04A', '#4FB3E6', '#5DA34E', '#E2563E', '#D9A066'].map((col, i) => `<circle cx="${-w / 2 + 24 + i * (w - 48) / 4}" cy="${top + (h - w * 0.55) * 0.55 + 20}" r="13" fill="${col}" stroke="#fff" stroke-width="2"/>`).join('');
    // nose cone
    if (!o.dome) s += `<path d="M${-w / 2 - 4},${top + 6} L0,${-h} L${w / 2 + 4},${top + 6}Z" fill="${o.nose || c !== 'cardboard' ? red : body2}" stroke="#9b2c2c" stroke-width="4" stroke-linejoin="round"/>`;
    else {
      // The Neck Dome replaces the nose cone: a tall, clear bubble with stars inside.
      const dc = top - w * 0.3, rx = w * 0.44, ry = w * 0.62;
      s += `<ellipse cx="0" cy="${top + 4}" rx="${w / 2 + 6}" ry="16" fill="${red}" stroke="#9b2c2c" stroke-width="4"/>`;
      if (o.domeFace) s += `<g transform="translate(0,${dc + w * 0.12}) scale(${w / 250})">${FACES.gerriHead}</g>`;
      s += `<ellipse cx="0" cy="${dc}" rx="${rx}" ry="${ry}" fill="#BFE6FF" opacity=".42" stroke="#e8f7ff" stroke-width="6"/>
      <path d="M${-rx * 0.55},${dc - ry * 0.45} q10,-30 40,-36" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".85"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle class="twinkle" style="animation-delay:${i * .3}s" cx="${(Math.cos(i * 2.1) * rx * 0.75).toFixed(1)}" cy="${(dc + Math.sin(i * 1.7) * ry * 0.75).toFixed(1)}" r="5" fill="#FFE27A"/>`).join('')}`;
    }
    // door
    const doorH = { tiny: 70, short: 110, tall: h * 0.62 }[o.door || 'none'];
    if (doorH) s += `<rect x="${-w * 0.22}" y="${-doorH - (o.legs ? 30 : 0) - 6}" width="${w * 0.44}" height="${doorH}" rx="12" fill="${body2}" stroke="#7d8896" stroke-width="4"/><circle cx="${w * 0.12}" cy="${-doorH / 2 - (o.legs ? 30 : 0)}" r="6" fill="${red}"/>`;
    // round window
    const win = o.win || 'none';
    if (win !== 'none') {
      const wy = win === 'low' ? -110 : top + 70;
      s += `<circle cx="0" cy="${wy}" r="${w * 0.24}" fill="#3a6fa8" stroke="#6b7684" stroke-width="10"/><circle cx="0" cy="${wy}" r="${w * 0.24}" fill="#9fd4ff" opacity=".55"/><path d="M${-w * 0.12},${wy - w * 0.08} q8,-14 22,-16" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      const who = o.face === 'both' ? 'thola' : o.face;
      if (who) s += `<g transform="translate(0,${wy + 4}) scale(${w / 520})">${FACES[who] || ''}</g>`;
    }
    if (o.buttons) s += `<rect x="${w * 0.24}" y="${top + 150}" width="22" height="22" rx="3" fill="#4FB3E6"/><rect x="${w * 0.24}" y="${top + 180}" width="22" height="22" rx="3" fill="#F7C93A"/>`;
    // painted stars (orange, yellow, blue, red), like the rocket in the workshop picture
    if (c !== 'cardboard') [[-0.24, 0.3, '#F29A2E'], [0.22, 0.42, '#F7C93A'], [-0.18, 0.62, '#4FB3E6'], [0.26, 0.74, '#E2563E'], [-0.26, 0.86, '#F7C93A']].forEach(([fx, fy, col]) => {
      s += star(w * fx, top + (h - w * 0.55) * fy, w * 0.07, col);
    });
    // bottle-cap rivets
    for (let i = 0; i < 4; i++) s += `<circle cx="${-w / 2 + 16}" cy="${top + 40 + i * 70}" r="7" fill="#4FB3E6" stroke="#2f6f9a" stroke-width="2"/><circle cx="${w / 2 - 16}" cy="${top + 40 + i * 70}" r="7" fill="#E04848" stroke="#9b2c2c" stroke-width="2"/>`;
    return s + `</g>`;
  };

  PROPS.box = (o = {}) => `<g><rect x="-70" y="-90" width="140" height="90" rx="6" fill="#C9925A" stroke="#a06c3a" stroke-width="4"/>
    <path d="M-70,-90 L0,-150 L70,-90Z" fill="#B07A45" stroke="#a06c3a" stroke-width="4" stroke-linejoin="round"/><circle cx="0" cy="-46" r="18" fill="#9fd4ff" stroke="#8a6a44" stroke-width="5"/></g>`;

  PROPS.label = (o = {}) => {
    const t = o.text || '', fs = o.size || 46, w = Math.max(90, t.length * fs * 0.62 + 44);
    return `<g><rect x="${-w / 2}" y="${-fs * 0.9}" width="${w}" height="${fs * 1.5}" rx="${fs * 0.5}" fill="${o.bg || '#fff'}" stroke="${o.color || '#E04848'}" stroke-width="6"/>
      <text x="0" y="${fs * 0.22}" text-anchor="middle" font-size="${fs}" font-family="'Baloo 2', 'Trebuchet MS', sans-serif" font-weight="800" fill="${o.color || '#E04848'}">${t}</text></g>`;
  };

  PROPS.text = (o = {}) => `<g><text x="0" y="0" text-anchor="middle" font-size="${o.size || 120}" font-family="'Baloo 2', 'Trebuchet MS', sans-serif" font-weight="800" fill="${o.color || '#FFD24A'}" stroke="${o.stroke || '#5a2d0c'}" stroke-width="${o.sw ?? 8}" paint-order="stroke">${o.text || ''}</text></g>`;

  PROPS.chalkboard = (o = {}) => {
    let s = `<g><rect x="-230" y="-330" width="460" height="300" rx="14" fill="#2F4A3A" stroke="#8E5C3A" stroke-width="16"/>
      <path d="M-200,-40 v40 M200,-40 v40" stroke="#8E5C3A" stroke-width="14" stroke-linecap="round"/>`;
    if (o.drawing === 'rocket') s += `<g fill="none" stroke="#F4F1E8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M-40,-60 v-170 l40,-60 l40,60 v170z M-40,-60 l-40,30 v-50 l40,-40 M40,-60 l40,30 v-50 l-40,-40"/><circle cx="0" cy="-190" r="18"/></g>
      <text x="130" y="-180" text-anchor="middle" font-size="40" font-family="'Baloo 2',sans-serif" fill="#F4F1E8" font-weight="700">BIG!</text>`;
    if (o.lines) o.lines.forEach((l, i) => s += `<text x="0" y="${-260 + i * 60}" text-anchor="middle" font-size="46" font-family="'Baloo 2',sans-serif" fill="#F4F1E8" font-weight="700">${l}</text>`);
    if (o.countdown) {
      for (let i = 10; i >= 1; i--) {
        const k = 10 - i, x = -180 + (k % 5) * 90, y = -230 + Math.floor(k / 5) * 120;
        s += `<text data-num="${i}" x="${x}" y="${y}" text-anchor="middle" font-size="72" font-family="'Baloo 2',sans-serif" fill="#F4F1E8" font-weight="800" opacity=".35">${i}</text>`;
      }
    }
    return s + '</g>';
  };

  PROPS.block = (o = {}) => `<g><rect x="-40" y="-60" width="80" height="60" rx="8" fill="${o.color || '#E8A64B'}" stroke="#a0662a" stroke-width="4"/>
    <rect x="-40" y="-60" width="80" height="60" rx="8" fill="#FFE9A8" opacity=".35" class="glow"/>
    ${o.n ? `<text x="0" y="-16" text-anchor="middle" font-size="36" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#5a2d0c">${o.n}</text>` : ''}</g>`;

  PROPS.ladder = () => `<g stroke="#8E5C3A" stroke-width="10" stroke-linecap="round"><path d="M-30,0 v-200 M30,0 v-200"/>${[1, 2, 3, 4].map(i => `<path d="M-30,${-i * 44} h60"/>`).join('')}</g>`;

  PROPS.shape = (o = {}) => {
    const c = o.color || '#E04848', st = 'stroke="#fff" stroke-width="8" stroke-linejoin="round"';
    const r = o.r || 70;
    const shapes = {
      circle: `<circle r="${r}" fill="${c}" ${st}/>`,
      square: `<rect x="${-r}" y="${-r}" width="${2 * r}" height="${2 * r}" rx="8" fill="${c}" ${st}/>`,
      triangle: `<path d="M0,${-r * 1.1} L${r * 1.1},${r * 0.8} L${-r * 1.1},${r * 0.8}Z" fill="${c}" ${st}/>`,
      rectangle: `<rect x="${-r * 1.4}" y="${-r * 0.75}" width="${2.8 * r}" height="${1.5 * r}" rx="8" fill="${c}" ${st}/>`,
    };
    return `<g><g class="glow">${shapes[o.shape || 'circle']}</g>${o.name ? `<text y="${r + 60}" text-anchor="middle" font-size="44" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#fff" stroke="#5a2d0c" stroke-width="7" paint-order="stroke">${o.name}</text>` : ''}</g>`;
  };

  PROPS.moon = (o = {}) => {
    const r = o.r || 80, p = o.phase || 'full';
    const lit = '#FFF4C8', dark = '#3b4268';
    let s = `<g><circle r="${r}" fill="${p === 'full' ? lit : dark}" ${p === 'new' ? 'stroke="#8d96c7" stroke-width="4" stroke-dasharray="10 8"' : ''}/>`;
    if (p === 'half') s += `<path d="M0,${-r} A${r},${r} 0 0 1 0,${r}Z" fill="${lit}"/>`;
    if (p === 'crescent') s += `<path d="M0,${-r} A${r},${r} 0 0 1 0,${r} A${r * 0.6},${r} 0 0 0 0,${-r}Z" fill="${lit}"/>`;
    if (p !== 'new') s += `<circle cx="${r * 0.3}" cy="${-r * 0.2}" r="${r * 0.14}" fill="#E8DDB0" opacity=".7"/><circle cx="${r * 0.5}" cy="${r * 0.35}" r="${r * 0.09}" fill="#E8DDB0" opacity=".7"/>`;
    if (p === 'full' && o.face) s += `<circle cx="${-r * .3}" cy="${-r * .1}" r="${r * .08}" fill="#8a7a50"/><circle cx="${r * .2}" cy="${-r * .1}" r="${r * .08}" fill="#8a7a50"/><path d="M${-r * .3},${r * .25} Q${-r * .05},${r * .45} ${r * .2},${r * .25}" stroke="#8a7a50" stroke-width="${r * .05}" fill="none" stroke-linecap="round"/>`;
    return s + '</g>';
  };

  const PLANETS = {
    sun: { c: '#FFC93C', r: 120 }, mercury: { c: '#B9A89A', r: 26 }, venus: { c: '#E9C77B', r: 38 },
    earth: { c: '#3C8DDB', r: 40 }, mars: { c: '#D9573B', r: 32 }, jupiter: { c: '#D9A066', r: 78 },
    saturn: { c: '#E8CF8A', r: 62 }, uranus: { c: '#8FDCE0', r: 48 }, neptune: { c: '#4466D8', r: 46 },
  };
  PROPS.planet = (o = {}) => {
    const n = o.name || 'earth', P = PLANETS[n], r = o.r || P.r;
    let s = '<g>';
    if (n === 'sun') s += `<circle r="${r * 1.35}" fill="#FFE27A" opacity=".35" class="glow"/>`;
    if (n === 'saturn') s += `<ellipse rx="${r * 1.9}" ry="${r * 0.45}" fill="none" stroke="#C8A86A" stroke-width="${r * 0.18}" transform="rotate(-15)"/>`;
    s += `<circle r="${r}" fill="${P.c}"/>`;
    if (n === 'earth') s += `<defs><clipPath id="earthClip${r}"><circle r="${r}"/></clipPath></defs><g clip-path="url(#earthClip${r})" fill="#5DB65A">
      <ellipse cx="${-r * .35}" cy="${-r * .3}" rx="${r * .32}" ry="${r * .2}" transform="rotate(25 ${-r * .35} ${-r * .3})"/>
      <ellipse cx="${-r * .2}" cy="${r * .15}" rx="${r * .14}" ry="${r * .3}" transform="rotate(-15 ${-r * .2} ${r * .15})"/>
      <ellipse cx="${r * .38}" cy="${-r * .05}" rx="${r * .26}" ry="${r * .36}" transform="rotate(-20 ${r * .38} ${-r * .05})"/>
      <ellipse cx="${r * .55}" cy="${r * .55}" rx="${r * .2}" ry="${r * .1}"/>
      <ellipse cx="0" cy="${-r * .95}" rx="${r * .6}" ry="${r * .12}" fill="#f4fbff"/>
      <path d="M${-r * .8},${-r * .02} q${r * .3},${-r * .12} ${r * .6},0 M${r * .05},${r * .5} q${r * .3},${-r * .1} ${r * .55},0" stroke="#fff" stroke-width="${r * .05}" fill="none" stroke-linecap="round" opacity=".7"/></g>
      <circle r="${r}" fill="none" stroke="#bfe6ff" stroke-width="${r * .05}" opacity=".7"/>`;
    if (n === 'jupiter') s += `<path d="M${-r},${-r * .3} h${2 * r} M${-r},${r * .15} h${2 * r} M${-r * .9},${r * .5} h${1.8 * r}" stroke="#B8794A" stroke-width="${r * .1}"/><ellipse cx="${r * .3}" cy="${r * .32}" rx="${r * .22}" ry="${r * .12}" fill="#C0452E"/>`;
    if (n === 'mars') s += `<circle cx="${-r * .3}" cy="${-r * .2}" r="${r * .18}" fill="#B9442C"/><circle cx="${r * .3}" cy="${r * .3}" r="${r * .12}" fill="#B9442C"/>`;
    if (n === 'neptune' || n === 'uranus') s += `<path d="M${-r * .8},${-r * .2} q${r * .8},${-r * .2} ${r * 1.6},0" stroke="#fff" stroke-width="${r * .08}" fill="none" opacity=".4"/>`;
    s += `<circle cx="${-r * .35}" cy="${-r * .35}" r="${r * .25}" fill="#fff" opacity=".18"/>`;
    if (o.label) s += `<text y="${r + 48}" text-anchor="middle" font-size="34" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#fff" stroke="#2a1a4a" stroke-width="6" paint-order="stroke">${o.label}</text>`;
    return s + '</g>';
  };

  PROPS.card = (o = {}) => {
    const faces = {
      happy: `<path d="M-30,10 Q0,45 30,10" stroke="#5a2d0c" stroke-width="7" fill="none" stroke-linecap="round"/>`,
      sad: `<path d="M-26,30 Q0,8 26,30" stroke="#5a2d0c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-24,-4 q-6,14 0,20 q6,-6 0,-20z" fill="#5BB8F0"/>`,
      worried: `<path d="M-28,24 q7,-8 14,0 t14,0 t14,0" stroke="#5a2d0c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-36,-34 l18,6 M36,-34 l-18,6" stroke="#5a2d0c" stroke-width="5" stroke-linecap="round"/>`,
      brave: `<path d="M-30,12 Q0,38 30,12" stroke="#5a2d0c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-36,-30 l18,-6 M36,-30 l-18,-6" stroke="#5a2d0c" stroke-width="5" stroke-linecap="round"/>`,
    };
    const col = { happy: '#FFD24A', sad: '#8EC5F0', worried: '#C9B6EB', brave: '#F59B57' }[o.face || 'happy'];
    return `<g><rect x="-90" y="-120" width="180" height="210" rx="22" fill="#fff" stroke="${col}" stroke-width="8"/>
      <circle cy="-24" r="62" fill="${col}"/><circle cx="-20" cy="-40" r="8" fill="#5a2d0c"/><circle cx="20" cy="-40" r="8" fill="#5a2d0c"/>
      <g transform="translate(0,-24)">${faces[o.face || 'happy']}</g>
      <text y="72" text-anchor="middle" font-size="34" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#5a2d0c">${(o.face || 'happy').toUpperCase()}</text></g>`;
  };

  PROPS.bag = () => `<g><path d="M-60,-20 q0,-90 60,-90 q60,0 60,90 v60 q0,20 -20,20 h-80 q-20,0 -20,-20z" fill="#E2563E" stroke="#a83a26" stroke-width="5"/>
    <path d="M-30,-110 q30,-40 60,0" stroke="#a83a26" stroke-width="10" fill="none"/>${star(0, -20, 30, '#FFD24A')}</g>`;
  PROPS.blanket = () => `<g>${[0, 1, 2, 3].map(i => `<rect x="${-60 + (i % 2) * 60}" y="${-60 + Math.floor(i / 2) * 60}" width="60" height="60" fill="${['#E2563E', '#4FB3E6', '#F7C93A', '#7DAA41'][i]}"/>`).join('')}<rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="8 6"/></g>`;
  PROPS.drawing = () => `<g><rect x="-70" y="-55" width="140" height="110" fill="#fff" stroke="#ddd" stroke-width="3" transform="rotate(-4)"/><path d="M-40,20 v-30 l25,-20 l25,20 v30z" fill="#E2563E"/><circle cx="35" cy="-25" r="14" fill="#FFD24A"/><path d="M20,30 v-30 M35,30 v-25" stroke="#7a5a3a" stroke-width="6"/></g>`;
  PROPS.leaves = () => `<g>${[[-20, 0, -30], [10, -10, 20], [0, 10, 70]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="14" fill="#7DAA41" transform="rotate(${r} ${x} ${y})"/>`).join('')}</g>`;
  PROPS.walkie = () => `<g><rect x="-26" y="-60" width="52" height="90" rx="10" fill="#F07D23" stroke="#b8561a" stroke-width="4"/><rect x="12" y="-100" width="8" height="44" rx="4" fill="#555"/><rect x="-16" y="-48" width="32" height="24" rx="4" fill="#9fd4ff"/><circle cx="0" cy="8" r="9" fill="#5a2d0c"/></g>`;
  PROPS.cone = () => `<g><path d="M-26,0 L0,-70 L26,0Z" fill="#F07D23"/><path d="M-17,-24 h34 M-10,-44 h20" stroke="#fff" stroke-width="8"/><rect x="-36" y="-6" width="72" height="10" rx="4" fill="#d16615"/></g>`;
  PROPS.log = () => `<g><rect x="-160" y="-46" width="320" height="46" rx="23" fill="#8E5C3A"/><ellipse cx="160" cy="-23" rx="16" ry="23" fill="#C9925A"/><path d="M-120,-30 h80 M0,-18 h100" stroke="#6b4329" stroke-width="5" stroke-linecap="round"/></g>`;
  PROPS.helmet = (o = {}) => `<g><path d="M-60,0 q0,-70 60,-70 q60,0 60,70z" fill="#C9925A" stroke="#a06c3a" stroke-width="5"/><rect x="-66" y="-6" width="132" height="14" rx="6" fill="#E04848"/>${star(0, -36, 16, '#FFD24A')}</g>`;
  PROPS.hoop = () => `<g><ellipse rx="120" ry="34" fill="none" stroke="#E26BB0" stroke-width="12"/></g>`;
  PROPS.bush = () => `<g><ellipse cx="-50" cy="-40" rx="70" ry="50" fill="#6E9B3A"/><ellipse cx="40" cy="-50" rx="80" ry="60" fill="#7DAA41"/><ellipse cx="0" cy="-20" rx="110" ry="30" fill="#5d8a30"/></g>`;
  PROPS.ladybird = () => `<g><ellipse rx="26" ry="22" fill="#E2393E"/><path d="M0,-22 v44" stroke="#222" stroke-width="3"/><circle cx="-10" cy="-4" r="5" fill="#222"/><circle cx="10" cy="6" r="5" fill="#222"/><circle cx="-22" cy="-12" r="10" fill="#222"/></g>`;
  PROPS.tree = () => acacia(0, 0, 1.1);
  PROPS.pebble = () => `<g><ellipse rx="22" ry="14" fill="#a3988c"/></g>`;
  PROPS.rock = () => `<g><path d="M-160,0 q-10,-120 80,-150 q100,-30 170,40 q40,60 10,110z" fill="#9a8f84"/><path d="M-80,-120 q40,-20 80,0" stroke="#bdb3a8" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
  PROPS.beetle = () => `<g><ellipse rx="22" ry="16" fill="#3a7a3a"/><path d="M0,-16 v32" stroke="#1f4a1f" stroke-width="3"/><circle cx="24" r="9" fill="#1f4a1f"/></g>`;
  PROPS.bird = () => `<g><path d="M-30,0 q15,-20 30,0 q15,-20 30,0" stroke="#3a2a5a" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
  PROPS.flower = () => `<g><path d="M0,0 v-80" stroke="#5d8a30" stroke-width="6"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-102" rx="12" ry="22" fill="#F47EB0" transform="rotate(${a} 0 -80)"/>`).join('')}<circle cy="-80" r="12" fill="#FFD24A"/></g>`;
  PROPS.candle = () => `<g><rect x="-16" y="-80" width="32" height="80" rx="6" fill="#FFF1D6" stroke="#e5cfa5" stroke-width="3"/><path class="flicker" d="M0,-120 q14,20 0,36 q-14,-16 0,-36z" fill="#FFB43C"/></g>`;
  PROPS.sign = (o = {}) => `<g><path d="M0,0 v-140" stroke="#8E5C3A" stroke-width="10"/><rect x="-120" y="-220" width="240" height="90" rx="10" fill="#FFF6D8" stroke="#8E5C3A" stroke-width="6"/>
    ${(o.text || '').split('|').map((l, i, a) => `<text y="${-175 + (i - (a.length - 1) / 2) * 34 + 10}" text-anchor="middle" font-size="30" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#C2563A">${l}</text>`).join('')}</g>`;
  PROPS.paint = () => `<g>${[['#E2563E', -70], ['#4FB3E6', 0], ['#F7C93A', 70]].map(([c, x]) => `<g transform="translate(${x},0)"><rect x="-26" y="-50" width="52" height="50" rx="6" fill="#ccd3dc"/><ellipse cy="-50" rx="26" ry="8" fill="${c}"/><path d="M-18,-50 q-4,20 4,24" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/></g>`).join('')}</g>`;
  PROPS.torch = () => `<g><rect x="-60" y="-18" width="80" height="36" rx="8" fill="#5a5f6a"/><path d="M20,-26 l30,-10 v72 l-30,-10z" fill="#9aa3ad"/><path d="M50,-36 L420,-160 L420,160 L50,36Z" fill="#FFF1B8" opacity=".22"/></g>`;
  PROPS.ball = (o = {}) => `<g><circle r="${o.r || 40}" fill="${o.color || '#fff'}"/><circle cx="-12" cy="-12" r="${(o.r || 40) * .3}" fill="#fff" opacity=".3"/></g>`;
  PROPS.cart = () => `<g><rect x="-280" y="-70" width="560" height="40" rx="10" fill="#8E5C3A"/><circle cx="-200" cy="-26" r="30" fill="#5a3d29" stroke="#3a2618" stroke-width="8"/><circle cx="200" cy="-26" r="30" fill="#5a3d29" stroke="#3a2618" stroke-width="8"/></g>`;
  PROPS.bowl = () => `<g><path d="M-110,0 a110,110 0 0 1 220,0z" fill="#BFE6FF" opacity=".55" stroke="#e8f7ff" stroke-width="6"/><path d="M-60,-60 q20,-30 50,-36" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
  PROPS.lights = (o = {}) => { let s = `<g><path d="M-200,0 q100,60 200,0 q100,60 200,0" stroke="#3a3a3a" stroke-width="3" fill="none"/>`; for (let i = 0; i < 9; i++) { const x = -200 + i * 50, y = Math.sin((i % 4) / 4 * Math.PI) * 44; s += `<circle class="twinkle" style="animation-delay:${i * .2}s" cx="${x}" cy="${y + 6}" r="9" fill="${['#FFD24A', '#F47EB0', '#4FB3E6', '#7DAA41'][i % 4]}"/>`; } return s + '</g>'; };
  PROPS.lantern = () => `<g><path d="M0,-90 v20" stroke="#5a3d29" stroke-width="4"/><rect x="-22" y="-70" width="44" height="60" rx="10" fill="#FFD27A" class="glow" stroke="#8E5C3A" stroke-width="5"/><circle cy="-40" r="70" fill="#FFD27A" opacity=".15"/></g>`;
  PROPS.balloon = (o = {}) => `<g class="bob"><path d="M0,0 q-10,40 4,90" stroke="#888" stroke-width="2" fill="none"/><ellipse cy="-40" rx="34" ry="42" fill="${o.color || '#E2563E'}"/><circle cx="-12" cy="-56" r="8" fill="#fff" opacity=".4"/></g>`;
  PROPS.toyRocket = () => `<g><rect x="-14" y="-70" width="28" height="60" rx="6" fill="#E04848"/><path d="M-14,-70 l14,-26 l14,26z" fill="#C9D2DD"/><path d="M-14,-24 l-12,18 h12z M14,-24 l12,18 h-12z" fill="#4FB3E6"/></g>`;
  PROPS.parachute = () => `<g><path d="M-70,-120 a70,50 0 0 1 140,0z" fill="#F7C93A" stroke="#E2563E" stroke-width="4"/><path d="M-70,-120 L-10,-60 M70,-120 L10,-60 M0,-120 v60" stroke="#666" stroke-width="2"/>${PROPS.toyRocket().replace('<g>', '<g transform="translate(0,20) scale(.9)">')}</g>`;
  PROPS.sticker = () => `<g>${star(0, 0, 28, '#FFD24A')}</g>`;
  PROPS.tick = () => `<g><circle r="34" fill="#5DB65A" stroke="#fff" stroke-width="5"/><path d="M-16,0 l10,12 l20,-24" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  PROPS.smoke = () => `<g>${[[-80, 0, 60], [0, 20, 80], [80, 0, 60], [-140, 40, 50], [140, 40, 50]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".85"/>`).join('')}${[0, 1, 2, 3, 4, 5].map(i => star(-120 + i * 50, -20 + (i % 2) * 40, 10, '#FFE27A')).join('')}</g>`;
  PROPS.zzz = () => `<g class="bob"><text font-size="44" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#fff">z</text><text x="26" y="-34" font-size="56" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#fff">Z</text></g>`;
  PROPS.whistle = () => `<g><path d="M0,0 l-40,-90" stroke="#E04848" stroke-width="3"/><rect x="-16" y="-10" width="30" height="18" rx="8" fill="#C9D2DD"/></g>`;
  PROPS.heart = () => `<g><path d="M0,30 C-60,-10 -40,-60 0,-30 C40,-60 60,-10 0,30Z" fill="#F47EB0"/></g>`;
  PROPS.water = () => `<g><path d="M-140,0 q140,-40 280,0 q-140,30 -280,0z" fill="#6FC3EE" opacity=".8"/></g>`;
  PROPS.cheese = PROPS.sticker;

  PROPS.bubble = (o = {}) => {
    const inner = o.inner ? PROPS[o.inner.type](o.inner).replace('<g>', `<g transform="translate(0,${o.inner.dy || 0}) scale(${o.inner.s || .35})">`) : '';
    return `<g><circle cx="-90" cy="140" r="12" fill="#fff"/><circle cx="-60" cy="110" r="18" fill="#fff"/>
      <ellipse rx="150" ry="110" fill="#fff" stroke="#e7d9ff" stroke-width="5"/>${inner}
      ${o.text ? `<text y="88" text-anchor="middle" font-size="26" font-family="'Baloo 2',sans-serif" font-weight="800" fill="#7a4a9a">${o.text}</text>` : ''}</g>`;
  };

  // Faces seen through the rocket's window and dome.
  const FACES = {
    gerri: `<ellipse cx="0" cy="0" rx="70" ry="62" fill="#F7C93A"/><ellipse cx="18" cy="28" rx="46" ry="28" fill="#FFE3A0"/>
      <ellipse cx="-24" cy="-12" rx="16" ry="19" fill="#fff"/><circle cx="-21" cy="-9" r="11" fill="#24130a"/><circle cx="-25" cy="-14" r="4" fill="#fff"/>
      <ellipse cx="26" cy="-12" rx="16" ry="19" fill="#fff"/><circle cx="29" cy="-9" r="11" fill="#24130a"/><circle cx="25" cy="-14" r="4" fill="#fff"/>
      <path d="M-4,30 Q18,54 40,30" stroke="#6B3F1F" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-40,-50 q12,-10 22,0" fill="#EE9433"/>`,
    thola: `<circle cx="-40" cy="-6" r="13" fill="#B98443"/><circle cx="40" cy="-6" r="13" fill="#B98443"/><ellipse rx="48" ry="44" fill="#D7A15C"/><ellipse cy="18" rx="32" ry="24" fill="#F4DEB2"/>
      <ellipse cx="-16" cy="-2" rx="13" ry="15" fill="#fff"/><circle cx="-14" cy="0" r="9" fill="#24130a"/><ellipse cx="18" cy="-2" rx="13" ry="15" fill="#fff"/><circle cx="20" cy="0" r="9" fill="#24130a"/>
      <ellipse cx="2" cy="16" rx="8" ry="5" fill="#3a2212"/><path d="M-8,28 Q2,36 12,28" stroke="#5A3518" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="-16" cy="-34" r="15" fill="#F07D23"/><circle cx="-16" cy="-34" r="9" fill="#A9D8F2"/><circle cx="16" cy="-34" r="15" fill="#F07D23"/><circle cx="16" cy="-34" r="9" fill="#A9D8F2"/>`,
    knees: `<rect x="-70" y="-10" width="60" height="120" rx="28" fill="#F7C93A"/><rect x="10" y="-10" width="60" height="120" rx="28" fill="#E4AE24"/>
      <ellipse cx="-40" cy="20" rx="16" ry="12" fill="#EE9433"/><ellipse cx="40" cy="30" rx="14" ry="11" fill="#EE9433"/>`,
  };
  FACES.gerriHead = `<g transform="rotate(-8)"><rect x="-38" y="-118" width="14" height="60" rx="7" fill="#E4AE24"/><circle cx="-31" cy="-120" r="16" fill="#A8652A"/>
      <rect x="18" y="-118" width="14" height="60" rx="7" fill="#F7C93A"/><circle cx="25" cy="-120" r="16" fill="#AD692C"/></g>${FACES.gerri}`;

  window.PROPS = PROPS;
  window.PLANETS = PLANETS;
})();
