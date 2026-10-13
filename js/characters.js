/* Gerri's Space Dream — character puppets.
 * Drawn to match the character artwork in assets/cast/.
 * Every character faces right with its feet at (0,0).
 * Named parts (data-part) are animated by the engine:
 *   eyesOpen / eyesClosed  – blinking
 *   mouthOpen / mouthClosed – talking and singing
 *   head, neck, armR, armL, wing, trunk, ear, tail – posed by actions
 *   (data-ox / data-oy give each part's pivot point)
 */
(function () {
  const star = (cx, cy, r, fill, rot = 0) => {
    let p = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2 + rot;
      const rr = i % 2 ? r * 0.45 : r;
      p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1));
    }
    return `<polygon points="${p.join(' ')}" fill="${fill}" stroke-linejoin="round"/>`;
  };

  // Soft irregular patch (giraffe spots, fur markings).
  const blob = (cx, cy, r, fill, seed = 1, op = 1) => {
    let d = '';
    const n = 7;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rr = r * (0.78 + 0.22 * Math.sin(seed * 3.7 + i * 2.3));
      const x = cx + Math.cos(a) * rr * 1.15, y = cy + Math.sin(a) * rr * 0.85;
      d += (i ? ' L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
    }
    return `<path d="${d}Z" fill="${fill}" stroke="${fill}" stroke-width="${(r * 0.35).toFixed(1)}" stroke-linejoin="round" opacity="${op}"/>`;
  };

  // Shared cartoon eye: big white, warm brown iris, two highlights, optional lashes.
  const eye = (cx, cy, rx, ry, iris, lashes, lid, side = 1) => `
    <g data-part="eyesOpen">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" stroke="#3b2414" stroke-width="2.2"/>
      <circle cx="${cx + rx * 0.12}" cy="${cy + ry * 0.12}" r="${rx * 0.72}" fill="${iris}"/>
      <circle cx="${cx + rx * 0.12}" cy="${cy + ry * 0.12}" r="${rx * 0.72}" fill="none" stroke="#3b1f0c" stroke-width="${rx * 0.12}"/>
      <circle cx="${cx + rx * 0.14}" cy="${cy + ry * 0.14}" r="${rx * 0.38}" fill="#1c0e06"/>
      <circle cx="${cx - rx * 0.12}" cy="${cy - ry * 0.18}" r="${rx * 0.24}" fill="#fff"/>
      <circle cx="${cx + rx * 0.4}" cy="${cy + ry * 0.36}" r="${rx * 0.1}" fill="#fff"/>
      ${lashes ? `<path d="M${cx + side * rx * 0.55},${cy - ry * 0.82} l${side * 7},-7 M${cx + side * rx * 0.85},${cy - ry * 0.5} l${side * 8},-4 M${cx + side * rx * 0.1},${cy - ry * 0.98} l${side * 3},-8" stroke="#3b2414" stroke-width="2.6" stroke-linecap="round"/>` : ''}
    </g>
    <g data-part="eyesClosed" style="display:none">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx + 1}" ry="${ry + 1}" fill="${lid}"/>
      <path d="M${cx - rx},${cy} Q${cx},${cy + ry * 0.7} ${cx + rx},${cy}" stroke="#3b2414" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${lashes ? `<path d="M${cx + side * rx * 0.6},${cy + ry * 0.25} l${side * 5},6 M${cx + side * rx * 0.95},${cy + 1} l${side * 6},3" stroke="#3b2414" stroke-width="2.4" stroke-linecap="round"/>` : ''}
    </g>`;
  const brow = (x1, y1, x2, y2, lift, col = '#4a2a12', w = 4) => `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - lift} ${x2},${y2}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;

  /* ---------------- Gerri the Giraffe ----------------
   * Golden coat with orange patches, fuzzy brown ossicones, big pink-lined ears,
   * arched brows, a bunched light-blue scarf with white stars and a fringed tail end. */
  function gerri() {
    const Y = '#F7C93F', Yl = '#FFDF78', Yd = '#E2A92E', S = '#EBA03A', M = '#FFE6A8', H = '#6B3F1F', MANE = '#A85A26', P = '#F3A49A';
    const leg = (x, c, near) => `
      <path d="M${x},-340 C${x - 2},-250 ${x + 2},-170 ${x - 1},-30 L${x + 27},-30 C${x + 26},-170 ${x + 30},-250 ${x + 30},-340 Z" fill="${c}"/>
      <ellipse cx="${x + 14}" cy="-160" rx="17" ry="13" fill="${c}"/>
      ${near ? blob(x + 14, -250, 9, S, x) + blob(x + 12, -110, 7, S, x + 3) : ''}
      <path d="M${x - 5},-32 h38 l5,32 h-48 z" fill="${H}"/><path d="M${x + 14},-30 v28" stroke="#3a1f0c" stroke-width="2"/>`;
    let scarfStars = '';
    [[60, -428], [104, -432], [130, -412], [78, -392], [118, -388], [100, -340], [96, -298], [104, -262]].forEach(([x, y], i) => scarfStars += star(x, y, 7.5, '#fff', i * 0.4));
    let mane = '';
    for (let i = 0; i < 11; i++) {
      const k = i / 10, x = 16 + 80 * k + Math.sin(k * 2) * 6, y = -392 - 262 * k;
      mane += `<path d="M${x + 4},${y + 14} L${x - 13},${y + 4} L${x + 3},${y - 10} Z" fill="${MANE}"/>`;
    }
    return `
    <g data-part="tail" data-ox="-140" data-oy="-372"><path d="M-140,-372 C-168,-340 -170,-296 -164,-244" stroke="${Yd}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M-164,-256 q-18,22 -8,54 q8,-10 10,2 q8,-12 10,2 q8,-30 -12,-58z" fill="${MANE}"/></g>
    ${leg(-96, Yd, false)}${leg(64, Yd, false)}
    <ellipse cx="-14" cy="-360" rx="136" ry="80" fill="${Y}"/>
    <ellipse cx="-14" cy="-318" rx="118" ry="34" fill="${Yd}" opacity=".45"/>
    <ellipse cx="-30" cy="-402" rx="96" ry="26" fill="${Yl}" opacity=".55"/>
    ${blob(-96, -372, 22, S, 1)}${blob(-40, -392, 24, S, 2)}${blob(20, -372, 22, S, 3)}${blob(-120, -330, 15, S, 4)}${blob(-62, -334, 18, S, 5)}${blob(-4, -326, 14, S, 6)}${blob(54, -334, 12, S, 7)}
    ${leg(-126, Y, true)}${leg(36, Y, true)}
    <g data-part="neck" data-ox="70" data-oy="-380">
      ${mane}
      <path d="M14,-380 C40,-470 74,-560 90,-652 L150,-640 C140,-552 134,-472 132,-372 Z" fill="${Y}"/>
      <path d="M118,-380 C122,-470 132,-560 146,-640 L150,-640 C140,-552 134,-472 132,-372 Z" fill="${Yd}" opacity=".5"/>
      ${blob(64, -452, 13, S, 8)}${blob(98, -500, 12, S, 9)}${blob(76, -540, 10, S, 10)}${blob(112, -578, 11, S, 11)}${blob(100, -622, 9, S, 12)}${blob(110, -456, 9, S, 13)}
      <g data-part="head" data-ox="0" data-oy="30" transform="translate(122,-680) scale(1.45)">
        <g transform="rotate(-16 -26 -50)"><rect x="-33" y="-104" width="13" height="58" rx="6" fill="${Yd}"/><circle cx="-26.5" cy="-106" r="15" fill="#A8652A"/><circle cx="-31" cy="-111" r="5" fill="#C47E3C"/><circle cx="-20" cy="-100" r="4" fill="#8C4F1E"/></g>
        <g transform="rotate(12 14 -54)"><rect x="8" y="-108" width="13" height="60" rx="6" fill="${Y}"/><circle cx="14.5" cy="-110" r="15" fill="#AD692C"/><circle cx="10" cy="-115" r="5" fill="#C9833F"/><circle cx="21" cy="-104" r="4" fill="#8C4F1E"/></g>
        <g data-part="ear" data-ox="-40" data-oy="-34"><path d="M-36,-40 C-62,-70 -92,-72 -102,-60 C-92,-40 -64,-26 -40,-26 Z" fill="${Y}"/><path d="M-44,-40 C-62,-58 -82,-60 -90,-56 C-82,-44 -64,-36 -46,-34 Z" fill="${P}"/></g>
        <ellipse cx="0" cy="-14" rx="54" ry="48" fill="${Y}"/>
        <ellipse cx="-12" cy="-40" rx="34" ry="16" fill="${Yl}" opacity=".6"/>
        <path d="M-14,-60 l4,-14 l6,10 l5,-14 l5,12 l7,-10 l1,16 z" fill="${MANE}"/>
        ${blob(-34, -30, 8, S, 14)}${blob(30, -46, 6, S, 15)}
        <ellipse cx="20" cy="22" rx="42" ry="31" fill="${M}" transform="rotate(-10 20 22)"/>
        <ellipse cx="-34" cy="12" rx="11" ry="7" fill="${P}" opacity=".55"/>
        <ellipse cx="54" cy="4" rx="8" ry="5" fill="${P}" opacity=".45"/>
        ${eye(-17, -14, 14, 17, '#7A4317', true, Y, -1)}
        ${eye(26, -18, 13, 16, '#7A4317', true, Y, 1)}
        ${brow(-31, -36, -6, -38, 9)}${brow(14, -40, 38, -38, 9)}
        <ellipse cx="14" cy="22" rx="3.5" ry="2.6" fill="${H}"/><ellipse cx="34" cy="18" rx="3.5" ry="2.6" fill="${H}"/>
        <g data-part="mouthClosed"><path d="M0,40 Q24,56 50,34" stroke="${H}" stroke-width="3.6" fill="none" stroke-linecap="round"/></g>
        <g data-part="mouthOpen" style="display:none"><path d="M-2,37 Q24,72 52,32 Q26,44 -2,37Z" fill="#7a2626" stroke="${H}" stroke-width="2.5"/><ellipse cx="25" cy="54" rx="11" ry="6" fill="#EF7F79"/><path d="M6,40 q18,6 38,-2" stroke="#fff" stroke-width="3" fill="none" opacity=".9"/></g>
        <path d="M40,-44 C64,-72 94,-76 104,-64 C96,-44 68,-32 44,-30 Z" fill="${Y}"/><path d="M48,-44 C66,-62 86,-64 94,-60 C86,-48 68,-40 50,-38 Z" fill="${P}"/>
      </g>
    </g>
    <g data-part="scarf">
      <path d="M68,-404 C64,-350 78,-312 70,-268 L94,-266 C100,-312 92,-352 92,-404 Z" fill="#3F96CC"/>
      <path d="M14,-430 C24,-462 136,-468 152,-436 C160,-414 30,-402 16,-410 Z" fill="#4AA6DB" stroke="#2f80b5" stroke-width="3"/>
      <path d="M18,-402 C30,-434 140,-438 154,-408 C160,-384 34,-374 20,-382 Z" fill="#5BB8E8" stroke="#2f80b5" stroke-width="3"/>
      <path d="M40,-424 q30,8 64,2 M44,-396 q34,8 70,0" stroke="#2f80b5" stroke-width="2.5" fill="none" opacity=".7"/>
      <path d="M92,-392 C100,-340 104,-300 96,-246 L128,-242 C132,-300 128,-344 120,-392 Z" fill="#5BB8E8" stroke="#2f80b5" stroke-width="3"/>
      <path d="M98,-246 l-2,16 M105,-245 l-1,16 M112,-244 l0,16 M119,-243 l1,16 M126,-242 l2,15" stroke="#2f80b5" stroke-width="3.2" stroke-linecap="round"/>
      ${scarfStars}
    </g>`;
  }

  /* ---------------- Thola the Meerkat ----------------
   * Slim sandy meerkat: dark eye patches, pointed muzzle, orange goggles on her forehead,
   * green tool belt with pouches and tools, a spanner in her hand. */
  function thola() {
    const B = '#E5B565', Bd = '#C9964A', C = '#FCEBC4', D = '#5A3418';
    return `
    <g data-part="tail" data-ox="-20" data-oy="-40"><path d="M-20,-40 C-62,-34 -88,-14 -108,-6" stroke="${Bd}" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M-100,-9 L-114,-4" stroke="${D}" stroke-width="11" stroke-linecap="round"/></g>
    <ellipse cx="-17" cy="-6" rx="19" ry="7" fill="${Bd}"/><ellipse cx="19" cy="-6" rx="19" ry="7" fill="${Bd}"/>
    <ellipse cx="-14" cy="-38" rx="17" ry="30" fill="${B}"/><ellipse cx="15" cy="-38" rx="17" ry="30" fill="${B}"/>
    <g data-part="armL" data-ox="-24" data-oy="-140"><path d="M-24,-140 C-44,-124 -50,-104 -36,-90" stroke="${Bd}" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="-34" cy="-90" r="6" fill="${B}"/></g>
    <path d="M-28,-156 C-42,-112 -40,-60 -24,-28 C-10,-14 12,-14 26,-28 C40,-60 42,-112 28,-156 Z" fill="${B}"/>
    <path d="M-16,-150 C-24,-112 -22,-62 -10,-36 C-2,-28 8,-28 14,-36 C24,-62 26,-112 18,-150 Z" fill="${C}"/>
    <path d="M-10,-148 l4,8 l4,-8 l4,8 l4,-8" stroke="${C}" stroke-width="3" fill="none"/>
    <path d="M-40,-88 Q0,-80 40,-88 L40,-73 Q0,-65 -40,-73 Z" fill="#6E9B3A" stroke="#4b7124" stroke-width="2"/>
    <rect x="-8" y="-90" width="16" height="19" rx="3" fill="#a8b86a" stroke="#4b7124" stroke-width="2"/><rect x="-4" y="-86" width="8" height="11" rx="2" fill="none" stroke="#4b7124" stroke-width="2"/>
    <path d="M-44,-80 h24 v30 q0,4 -4,4 h-16 q-4,0 -4,-4 z" fill="#7DAA41" stroke="#4b7124" stroke-width="2"/><path d="M-44,-74 h24" stroke="#4b7124" stroke-width="2"/>
    <path d="M20,-80 h24 v30 q0,4 -4,4 h-16 q-4,0 -4,-4 z" fill="#7DAA41" stroke="#4b7124" stroke-width="2"/><path d="M20,-74 h24" stroke="#4b7124" stroke-width="2"/>
    <path d="M26,-80 l-2,-16 M33,-80 l0,-20 M40,-80 l3,-14" stroke="#9aa3ad" stroke-width="4" stroke-linecap="round"/><path d="M33,-96 h-3 v-8 h6 v8z" fill="#E07A3A"/>
    <path d="M-38,-80 l-3,-16 M-30,-80 l1,-12" stroke="#9aa3ad" stroke-width="4" stroke-linecap="round"/><rect x="-42" y="-102" width="6" height="9" rx="2" fill="#4FB3E6"/>
    <g data-part="armR" data-ox="24" data-oy="-140"><path d="M24,-140 C40,-126 42,-108 36,-94" stroke="${Bd}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <g data-part="tool"><path d="M36,-96 L44,-62" stroke="#a7b0ba" stroke-width="6" stroke-linecap="round"/><path d="M38,-62 a9,9 0 1 0 14,-4 l-5,4 l-4,-3 z" fill="#a7b0ba"/></g>
      <circle cx="36" cy="-95" r="6.5" fill="${B}"/></g>
    <g data-part="head" data-ox="0" data-oy="24" transform="translate(0,-186)">
      <circle cx="-31" cy="-4" r="9" fill="${Bd}"/><circle cx="-31" cy="-4" r="4.5" fill="${D}"/>
      <circle cx="31" cy="-4" r="9" fill="${Bd}"/><circle cx="31" cy="-4" r="4.5" fill="${D}"/>
      <ellipse cx="0" cy="-4" rx="34" ry="31" fill="${B}"/>
      <ellipse cx="0" cy="12" rx="25" ry="19" fill="${C}"/>
      <ellipse cx="2" cy="22" rx="16" ry="11" fill="${C}"/>
      <ellipse cx="-13" cy="-4" rx="12" ry="13" fill="${D}" opacity=".45" transform="rotate(20 -13 -4)"/>
      <ellipse cx="14" cy="-4" rx="12" ry="13" fill="${D}" opacity=".45" transform="rotate(-20 14 -4)"/>
      ${eye(-13, -4, 9.5, 11, '#8a4b1c', true, B, -1)}
      ${eye(14, -4, 9.5, 11, '#8a4b1c', true, B, 1)}
      ${brow(-21, -18, -5, -19, 5, D, 3)}${brow(6, -19, 22, -18, 5, D, 3)}
      <path d="M-6,13 Q2,9 9,13 Q7,21 1.5,22 Q-4,21 -6,13Z" fill="#3a2212"/><ellipse cx="0" cy="13" rx="2.5" ry="1.4" fill="#fff" opacity=".5"/>
      <g data-part="mouthClosed"><path d="M-9,26 Q1,34 12,26" stroke="${D}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>
      <g data-part="mouthOpen" style="display:none"><path d="M-10,25 Q1,42 13,25 Q1,29 -10,25Z" fill="#7a2626"/><ellipse cx="1.5" cy="33" rx="5" ry="3" fill="#EF7F79"/></g>
      <path d="M-4,-34 l3,-7 l3,7 l3,-6 l2,6" stroke="${Bd}" stroke-width="2.5" fill="none"/>
      <g data-part="goggles" transform="translate(0,-10)">
        <path d="M-34,-18 Q0,-36 34,-18" stroke="#3f3f48" stroke-width="5" fill="none"/>
        <circle cx="-12" cy="-24" r="11" fill="#F07D23" stroke="#b9550f" stroke-width="2.5"/><circle cx="-12" cy="-24" r="7" fill="#A9D8F2"/><path d="M-15,-27 l3,-2" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="12" cy="-24" r="11" fill="#F07D23" stroke="#b9550f" stroke-width="2.5"/><circle cx="12" cy="-24" r="7" fill="#A9D8F2"/><path d="M9,-27 l3,-2" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="-2" y="-27" width="4" height="5" fill="#3f3f48"/>
      </g>
    </g>`;
  }

  /* ---------------- Bongani the Baby Elephant ----------------
   * 3/4 view: two big pink-lined ears, a tuft of hair, brows and lashes,
   * trunk curled up holding his blue bottle cap. */
  function bongani() {
    const G = '#A7A6A4', Gl = '#BDBCB9', Gd = '#8D8C8A', P = '#EBB2A6', N = '#EEE4D2';
    const leg = (x, c, h = 100) => `<path d="M${x},-${h} h44 v${h - 8} q0,8 -8,8 h-28 q-8,0 -8,-8z" fill="${c}"/>
      <ellipse cx="${x + 10}" cy="-5" rx="6.5" ry="5" fill="${N}"/><ellipse cx="${x + 22}" cy="-4" rx="6.5" ry="5" fill="${N}"/><ellipse cx="${x + 34}" cy="-5" rx="6.5" ry="5" fill="${N}"/>`;
    return `
    <path d="M-86,-128 C-104,-114 -106,-96 -100,-82" stroke="${Gd}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-100,-86 q-8,10 0,18 q8,-6 6,-18z" fill="#5f5e5c"/>
    ${leg(-62, Gd)}${leg(24, Gd)}
    <ellipse cx="-8" cy="-118" rx="84" ry="68" fill="${G}"/>
    <ellipse cx="-14" cy="-152" rx="60" ry="22" fill="${Gl}" opacity=".6"/>
    <path d="M-60,-96 q6,-6 12,0 M-20,-80 q6,-6 12,0" stroke="${Gd}" stroke-width="2.5" fill="none"/>
    ${leg(-84, G)}${leg(2, G)}
    <g data-part="head" data-ox="-10" data-oy="40" transform="translate(48,-206)">
      <g data-part="ear" data-ox="-40" data-oy="0"><ellipse cx="-70" cy="0" rx="48" ry="60" fill="${G}" stroke="${Gd}" stroke-width="3" transform="rotate(-14 -70 0)"/><ellipse cx="-68" cy="4" rx="32" ry="44" fill="${P}" transform="rotate(-14 -68 4)"/></g>
      <ellipse cx="66" cy="-2" rx="32" ry="48" fill="${Gd}" transform="rotate(14 66 -2)"/><ellipse cx="66" cy="0" rx="20" ry="34" fill="${P}" opacity=".8" transform="rotate(14 66 0)"/>
      <ellipse cx="0" cy="0" rx="62" ry="60" fill="${G}"/>
      <ellipse cx="-8" cy="-30" rx="38" ry="18" fill="${Gl}" opacity=".7"/>
      <path d="M-14,-56 q-6,-20 6,-30 M-4,-58 q2,-24 16,-26 M6,-56 q12,-16 24,-12 M-22,-52 q-12,-14 -6,-28" stroke="#6f6e6c" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${eye(-20, -8, 13, 15, '#7a4318', true, G, -1)}
      ${eye(20, -10, 13, 15, '#7a4318', true, G, 1)}
      ${brow(-32, -28, -10, -30, 7, '#555452', 4)}${brow(9, -32, 31, -30, 7, '#555452', 4)}
      <ellipse cx="-34" cy="18" rx="10" ry="6" fill="${P}" opacity=".7"/><ellipse cx="36" cy="16" rx="9" ry="6" fill="${P}" opacity=".6"/>
      <g data-part="mouthClosed"><path d="M-22,36 Q-10,48 4,40" stroke="#555452" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
      <g data-part="mouthOpen" style="display:none"><path d="M-24,34 Q-10,62 6,38 Q-8,42 -24,34Z" fill="#7a2626"/><ellipse cx="-9" cy="47" rx="7" ry="4" fill="#EF7F79"/></g>
      <g data-part="trunk" data-ox="6" data-oy="14">
        <path d="M-4,12 C-6,46 8,70 34,68 C58,66 70,42 72,4 L90,6 C90,52 70,88 32,88 C-4,88 -20,56 -18,14 Z" fill="${G}"/>
        <path d="M4,50 q6,4 12,2 M16,62 q6,2 12,-2 M48,62 q4,-4 6,-10 M62,44 q4,-2 6,-8" stroke="${Gd}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="81" cy="5" rx="9.5" ry="4.5" fill="${Gd}"/>
        <g transform="translate(82,-8) rotate(-12)"><ellipse rx="12" ry="5" fill="#c9d3dc"/><ellipse cy="-3" rx="10" ry="4" fill="#3d8fd6"/><ellipse cx="-3" cy="-4" rx="3" ry="1.3" fill="#fff" opacity=".7"/></g>
      </g>
    </g>`;
  }

  /* ---------------- Kiki the Hornbill ----------------
   * Big black head, cream face and fluffy chest, a curved yellow-to-orange beak,
   * orange crest, orange-tipped wings and a long tail with yellow and orange tips. */
  function kiki() {
    const K = '#24242B', K2 = '#33333c', C = '#F5E8C8';
    return `
    <g transform="translate(0,-14) scale(1,0.82)">
    <path d="M-16,-46 L-44,16 L-26,22 L0,-30 Z" fill="${K}"/>
    <path d="M-44,16 L-26,22 L-30,10 L-40,6 Z" fill="#E8542A"/><path d="M-40,6 L-30,10 L-27,0 L-36,-4 Z" fill="#F7B731"/>
    <path d="M-6,-44 L-18,24 L-2,26 L8,-32 Z" fill="${K2}"/>
    <path d="M-18,24 L-2,26 L-4,14 L-15,12 Z" fill="#E8542A"/><path d="M-15,12 L-4,14 L-3,4 L-13,2 Z" fill="#F7B731"/>
    </g>
    <path d="M-8,-10 v10 M8,-10 v10 M-16,0 q8,-6 14,0 M0,0 q8,-6 16,0" stroke="#6b6b75" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="-62" rx="38" ry="52" fill="${K}"/>
    <path d="M6,-104 C34,-100 40,-60 30,-34 C20,-18 0,-16 -4,-34 C-10,-60 -8,-90 6,-104Z" fill="${C}"/>
    <path d="M2,-40 l5,6 l4,-7 l5,6 l4,-6" stroke="${C}" stroke-width="3" fill="none"/>
    <g data-part="wing" data-ox="-12" data-oy="-96"><path d="M-12,-98 C-52,-94 -62,-46 -42,-14 C-30,-24 -20,-44 -12,-98Z" fill="${K2}"/>
      <path d="M-42,-14 C-38,-26 -34,-36 -30,-44 L-24,-40 C-28,-30 -34,-20 -42,-14Z" fill="#E8542A"/><path d="M-30,-44 C-26,-52 -22,-58 -20,-64 L-15,-60 C-18,-52 -22,-46 -24,-40Z" fill="#F7B731"/>
      <path d="M-40,-60 q10,-6 20,-4 M-44,-40 q12,-4 22,0" stroke="#4a4a54" stroke-width="2" fill="none"/></g>
    <g data-part="head" data-ox="0" data-oy="34" transform="translate(12,-130)">
      <path d="M-24,-26 l-16,-24 l14,6 l-2,-20 l14,16 l6,-20 l8,22 z" fill="#E8542A"/><path d="M-12,-34 l2,-16 l7,13z M-28,-34 l-8,-10 l10,4z" fill="#F7B731"/>
      <circle cx="0" cy="0" r="38" fill="${K}"/>
      <path d="M2,-28 C28,-30 38,-6 30,18 C20,34 0,34 -6,20 C-12,4 -10,-22 2,-28Z" fill="${C}"/>
      ${eye(12, -4, 13, 14, '#7a4318', true, C, 1)}
      ${brow(2, -22, 24, -20, 6, '#1a1a20', 3.5)}
      <g data-part="mouthClosed">
        <path d="M28,-20 C62,-46 116,-34 132,4 C134,12 126,14 120,8 C102,-10 68,-10 32,12 Z" fill="#F9B934" stroke="#d07818" stroke-width="2.5"/>
        <path d="M70,-30 C96,-30 120,-14 132,4 C134,12 126,14 120,8 C108,-4 92,-10 74,-12 Z" fill="#F2701F"/>
        <path d="M30,-18 C56,-38 92,-38 112,-22" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M32,12 C66,-2 100,-2 120,8 C104,20 66,28 34,22 Z" fill="#F7A531" stroke="#d07818" stroke-width="2"/></g>
      <g data-part="mouthOpen" style="display:none">
        <path d="M28,-22 C62,-50 116,-40 132,-4 C134,4 126,6 120,0 C102,-18 68,-18 32,4 Z" fill="#F9B934" stroke="#d07818" stroke-width="2.5"/>
        <path d="M70,-34 C96,-34 120,-20 132,-4 C134,4 126,6 120,0 C108,-12 92,-18 74,-18 Z" fill="#F2701F"/>
        <path d="M30,-20 C56,-42 92,-42 112,-26" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M32,4 C64,4 96,14 110,30 C88,32 60,30 32,22 Z" fill="#b8333a"/>
        <path d="M32,20 C64,26 92,30 112,30 C96,42 62,44 34,32 Z" fill="#F7A531" stroke="#d07818" stroke-width="2"/></g>
    </g>`;
  }

  /* ---------------- Zuri the Zebra ----------------
   * Cream foal with dark-brown stripes, a brown mohawk mane, tall ears, a dark muzzle,
   * big lashed eyes and a front leg she waves hello with. */
  function zuri() {
    const W = '#F6EFDF', Wd = '#E4D8C2', K = '#3A2A1F', M = '#4B3627';
    let bodyStripes = '';
    for (let x = -108; x <= 70; x += 24) bodyStripes += `<path d="M${x},-292 Q${x + 18},-232 ${x - 4},-150" stroke="${K}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    const legStripes = (x, w, top) => { let s = ''; for (let y = top + 24; y < -34; y += 26) s += `<path d="M${x},${y} q${w / 2},6 ${w},0" stroke="${K}" stroke-width="8" fill="none"/>`; return s; };
    const leg = (x, c, top = -230) => `<path d="M${x},${top} h30 v${-top - 28} h-30z" fill="${c}"/>${legStripes(x, 30, top)}
      <path d="M${x - 3},-30 h36 l2,30 h-40z" fill="${K}"/>`;
    return `
    <defs><clipPath id="zuriBody"><ellipse cx="-12" cy="-222" rx="112" ry="66"/></clipPath>
      <clipPath id="zuriNeck"><path d="M24,-262 C40,-310 64,-352 92,-384 L146,-360 C126,-326 110,-290 104,-236 Z"/></clipPath></defs>
    <path d="M-118,-236 C-140,-206 -146,-176 -142,-146" stroke="${Wd}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M-142,-160 q-18,18 -10,46 q8,-8 10,2 q6,-10 10,0 q6,-28 -10,-48z" fill="${K}"/>
    ${leg(-80, Wd)}${leg(44, Wd)}
    <ellipse cx="-12" cy="-222" rx="112" ry="66" fill="${W}"/>
    <g clip-path="url(#zuriBody)">${bodyStripes}</g>
    <ellipse cx="-12" cy="-176" rx="90" ry="20" fill="${Wd}" opacity=".5"/>
    ${leg(-108, W)}
    <path d="M18,-266 C36,-316 62,-360 90,-394" stroke="${K}" stroke-width="22" fill="none" stroke-linecap="round" stroke-dasharray="4 8"/>
    <path d="M24,-262 C40,-310 64,-352 92,-384 L146,-360 C126,-326 110,-290 104,-236 Z" fill="${W}"/>
    <g clip-path="url(#zuriNeck)"><path d="M40,-330 l60,-10 l40,22 M44,-300 l56,-8 l40,22 M50,-270 l54,-6 l36,20" stroke="${K}" stroke-width="10" fill="none" stroke-linejoin="round"/></g>
    <g data-part="armR" data-ox="34" data-oy="-206">
      <path d="M20,-216 h30 v188 h-30z" fill="${W}"/>${legStripes(20, 30, -216)}
      <path d="M17,-30 h36 l2,30 h-40z" fill="${K}"/>
    </g>
    <g data-part="head" data-ox="-10" data-oy="40" transform="translate(124,-420) scale(1.38)">
      <path d="M-26,-40 C-44,-72 -52,-104 -40,-112 C-24,-104 -12,-74 -10,-46 Z" fill="${W}"/><path d="M-26,-50 C-38,-74 -42,-96 -36,-102 C-26,-94 -18,-74 -16,-54 Z" fill="${Wd}"/><path d="M-40,-112 C-36,-106 -32,-100 -30,-96" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      <path d="M12,-48 C20,-80 36,-108 48,-110 C54,-96 44,-68 30,-42 Z" fill="${W}"/><path d="M20,-54 C26,-78 38,-98 44,-100 C46,-88 40,-70 30,-52 Z" fill="${Wd}"/><path d="M48,-110 l-4,10" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-22,-50 l-6,-26 l12,12 l2,-28 l10,22 l8,-26 l6,26 l12,-18 l-4,30 z" fill="#5a3a24"/>
      <ellipse cx="0" cy="-8" rx="50" ry="48" fill="${W}"/>
      <path d="M-44,-20 q14,4 22,-10 M-48,0 q16,2 26,-8 M-46,18 q14,0 22,-10 M36,-36 q-10,8 -6,18 M46,-14 q-10,6 -8,16" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M-8,-46 q4,10 2,20 M4,-48 q6,10 2,22" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${eye(-19, -12, 13, 15, '#7a4318', true, W, -1)}
      ${eye(21, -14, 13, 15, '#7a4318', true, W, 1)}
      ${brow(-31, -32, -9, -33, 6, K, 4)}${brow(10, -35, 32, -33, 6, K, 4)}
      <ellipse cx="20" cy="22" rx="34" ry="24" fill="${M}"/>
      <ellipse cx="14" cy="12" rx="14" ry="6" fill="#6a5040" opacity=".7"/>
      <ellipse cx="10" cy="26" rx="4.5" ry="3" fill="#1d130c"/><ellipse cx="32" cy="24" rx="4.5" ry="3" fill="#1d130c"/>
      <g data-part="mouthClosed"><path d="M4,38 Q20,50 40,36" stroke="#1d130c" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
      <g data-part="mouthOpen" style="display:none"><path d="M2,36 Q22,72 44,34 Q24,44 2,36Z" fill="#7a2626" stroke="#1d130c" stroke-width="2"/><ellipse cx="23" cy="52" rx="9" ry="5" fill="#EF7F79"/></g>
    </g>`;
  }

  window.CHARACTERS = {
    gerri: { name: 'Gerri', color: '#F2B21E', draw: gerri, height: 720 },
    thola: { name: 'Thola', color: '#6F9C38', draw: thola, height: 230 },
    bongani: { name: 'Bongani', color: '#8F9399', draw: bongani, height: 290 },
    kiki: { name: 'Kiki', color: '#F26B1D', draw: kiki, height: 190 },
    zuri: { name: 'Zuri', color: '#E25C98', draw: zuri, height: 440 },
  };
  window.SVGHelpers = { star };
})();
