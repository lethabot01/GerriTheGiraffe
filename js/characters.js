/* Gerri's Space Dream — character puppets.
 * Every character is drawn facing right with its feet at (0,0).
 * Named parts (data-part) are animated by the engine:
 *   eyesOpen / eyesClosed  – blinking
 *   mouthOpen / mouthClosed – talking
 *   head, neck, armR, wing, trunk – posed by actions
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

  // Shared cartoon eye: big white, brown iris, two highlights.
  const eye = (cx, cy, rx, ry, iris, lashes, lid) => `
    <g data-part="eyesOpen">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" stroke="#3b2414" stroke-width="2.5"/>
      <circle cx="${cx + rx * 0.18}" cy="${cy + ry * 0.08}" r="${rx * 0.7}" fill="${iris}"/>
      <circle cx="${cx + rx * 0.18}" cy="${cy + ry * 0.08}" r="${rx * 0.38}" fill="#24130a"/>
      <circle cx="${cx - rx * 0.08}" cy="${cy - ry * 0.22}" r="${rx * 0.22}" fill="#fff"/>
      <circle cx="${cx + rx * 0.42}" cy="${cy + ry * 0.3}" r="${rx * 0.1}" fill="#fff"/>
      ${lashes ? `<path d="M${cx - rx * 0.6},${cy - ry * 0.85} l-7,-9 M${cx - rx * 0.1},${cy - ry * 1.0} l-3,-11 M${cx + rx * 0.45},${cy - ry * 0.9} l3,-10" stroke="#3b2414" stroke-width="3" stroke-linecap="round"/>` : ''}
    </g>
    <g data-part="eyesClosed" style="display:none">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx + 1}" ry="${ry + 1}" fill="${lid}"/>
      <path d="M${cx - rx},${cy} Q${cx},${cy + ry * 0.7} ${cx + rx},${cy}" stroke="#3b2414" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      ${lashes ? `<path d="M${cx - rx * 0.5},${cy + ry * 0.3} l-5,7 M${cx + rx * 0.4},${cy + ry * 0.32} l4,7" stroke="#3b2414" stroke-width="3" stroke-linecap="round"/>` : ''}
    </g>`;

  /* ---------------- Gerri the Giraffe ---------------- */
  function gerri() {
    const Y = '#F7C93A', Yd = '#E4AE24', S = '#EE9433', M = '#FFE3A0', H = '#6B3F1F', MANE = '#B4602A';
    const leg = (x, c) => `<rect x="${x}" y="-330" width="34" height="315" rx="16" fill="${c}"/>
      <ellipse cx="${x + 17}" cy="-150" rx="12" ry="9" fill="${S}" opacity=".8"/>
      <rect x="${x - 3}" y="-30" width="40" height="30" rx="9" fill="${H}"/>`;
    let scarfStars = '';
    [[88, -330], [100, -290], [92, -258], [68, -392], [104, -380]].forEach(([x, y]) => scarfStars += star(x, y, 7, '#fff'));
    return `
    <g data-part="tail"><path d="M-138,-350 C-170,-310 -168,-260 -158,-215" stroke="${Yd}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M-158,-230 q-16,20 -6,48 q8,-10 10,0 q8,-12 10,2 q6,-26 -14,-50z" fill="${MANE}"/></g>
    ${leg(-88, Yd)}${leg(72, Yd)}
    <ellipse cx="-12" cy="-345" rx="138" ry="82" fill="${Y}"/>
    <ellipse cx="0" cy="-296" rx="100" ry="28" fill="${M}" opacity=".8"/>
    <path d="M-90,-380 q20,-22 42,-4 q10,22 -14,30 q-30,4 -28,-26z M-30,-405 q26,-12 38,8 q-4,24 -30,20 q-20,-8 -8,-28z M30,-372 q24,-14 36,6 q2,22 -24,24 q-22,-6 -12,-30z M-120,-330 q16,-20 34,-2 q4,22 -18,24 q-20,-4 -16,-22z M-50,-330 q18,-14 32,2 q0,20 -20,20 q-18,-6 -12,-22z" fill="${S}"/>
    ${leg(-122, Y)}${leg(40, Y)}
    <g data-part="neck" data-ox="70" data-oy="-380">
      <path d="M22,-392 C44,-478 78,-570 94,-648" stroke="${MANE}" stroke-width="22" fill="none" stroke-linecap="round" stroke-dasharray="2 13"/>
      <path d="M22,-375 C48,-470 82,-560 98,-652 L152,-640 C142,-552 132,-466 128,-360 Z" fill="${Y}"/>
      <path d="M70,-440 q16,-12 26,4 q0,18 -18,16 q-14,-6 -8,-20z M92,-520 q14,-10 24,4 q-2,16 -18,14 q-12,-6 -6,-18z M58,-498 q10,-8 18,2 q0,12 -12,12 q-10,-4 -6,-14z M110,-590 q12,-8 20,4 q-2,14 -16,12 q-10,-6 -4,-16z M98,-468 q10,-6 16,4 q-2,10 -12,10z" fill="${S}"/>
      <g data-part="head" data-ox="0" data-oy="20" transform="translate(132,-668) scale(1.3)">
        <g transform="rotate(-12)"><rect x="-34" y="-104" width="13" height="66" rx="6" fill="${Yd}"/><circle cx="-27.5" cy="-106" r="17" fill="#9A5527"/><circle cx="-31" cy="-111" r="5" fill="#B9733F"/></g>
        <g transform="rotate(4)"><rect x="-4" y="-110" width="13" height="70" rx="6" fill="${Y}"/><circle cx="2.5" cy="-112" r="17" fill="#A55E2C"/><circle cx="-1" cy="-117" r="5" fill="#C17E47"/></g>
        <g transform="translate(-46,-34) rotate(-28)"><ellipse rx="38" ry="16" fill="${Y}"/><ellipse cx="-4" rx="26" ry="8" fill="#F4A69C"/></g>
        <ellipse cx="0" cy="-14" rx="54" ry="50" fill="${Y}"/>
        <path d="M-30,-58 q8,-18 18,-2 q8,-16 16,2 q10,-12 14,6" fill="#A55E2C"/>
        <ellipse cx="44" cy="14" rx="52" ry="37" fill="${M}"/>
        <path d="M-40,-30 q10,-10 18,0 q-2,12 -14,10z" fill="${S}"/>
        <ellipse cx="80" cy="0" rx="5.5" ry="3.5" fill="${H}"/>
        <ellipse cx="62" cy="-6" rx="4.5" ry="3" fill="${H}" opacity=".7"/>
        <path d="M-12,-56 q18,-10 34,-2" stroke="${H}" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${eye(6, -24, 21, 24, '#8A4B1C', true, Y)}
        <ellipse cx="-14" cy="12" rx="12" ry="7" fill="#F49A7E" opacity=".45"/>
        <g data-part="mouthClosed"><path d="M30,32 Q57,52 86,30" stroke="${H}" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>
        <g data-part="mouthOpen" style="display:none"><path d="M28,28 Q57,72 88,26 Q58,38 28,28Z" fill="#7a2626" stroke="${H}" stroke-width="3"/><ellipse cx="58" cy="48" rx="13" ry="7" fill="#F0857F"/></g>
        <g transform="translate(-34,-48) rotate(-36)"><ellipse rx="34" ry="14" fill="${Y}"/><ellipse cx="-3" rx="22" ry="7" fill="#F4A69C"/></g>
      </g>
    </g>
    <g data-part="scarf">
      <path d="M26,-380 C40,-410 120,-418 138,-392 C142,-368 70,-352 28,-358 Z" fill="#4FB3E6" stroke="#2f8cc2" stroke-width="3"/>
      <path d="M78,-372 C86,-320 92,-280 86,-236 L116,-232 C120,-280 116,-330 112,-374 Z" fill="#59BDEB" stroke="#2f8cc2" stroke-width="3"/>
      <path d="M88,-236 l-2,14 M95,-235 l-1,14 M102,-234 l0,14 M109,-233 l1,14 M115,-232 l2,13" stroke="#2f8cc2" stroke-width="3" stroke-linecap="round"/>
      ${scarfStars}
    </g>`;
  }

  /* ---------------- Thola the Meerkat ---------------- */
  function thola() {
    const B = '#D7A15C', Bd = '#B98443', C = '#F4DEB2', D = '#5A3518';
    return `
    <path data-part="tail" d="M-26,-30 C-70,-20 -92,-40 -96,-86" stroke="${Bd}" stroke-width="15" fill="none" stroke-linecap="round"/>
    <path d="M-96,-80 l-2,-14" stroke="${D}" stroke-width="13" stroke-linecap="round"/>
    <ellipse cx="-20" cy="-8" rx="22" ry="9" fill="${Bd}"/><ellipse cx="22" cy="-8" rx="22" ry="9" fill="${Bd}"/>
    <rect x="-32" y="-60" width="22" height="54" rx="10" fill="${B}"/><rect x="10" y="-60" width="22" height="54" rx="10" fill="${B}"/>
    <g data-part="armL" data-ox="-30" data-oy="-138"><path d="M-30,-138 C-48,-120 -46,-96 -36,-84" stroke="${Bd}" stroke-width="15" fill="none" stroke-linecap="round"/></g>
    <ellipse cx="0" cy="-92" rx="44" ry="74" fill="${B}"/>
    <ellipse cx="6" cy="-88" rx="27" ry="54" fill="${C}"/>
    <rect x="-48" y="-78" width="96" height="17" rx="6" fill="#6F9C38" stroke="#4d7322" stroke-width="2"/>
    <rect x="-8" y="-80" width="16" height="21" rx="3" fill="#b8c46a" stroke="#4d7322" stroke-width="2"/>
    <rect x="-52" y="-68" width="26" height="30" rx="5" fill="#7DAA41" stroke="#4d7322" stroke-width="2"/>
    <rect x="26" y="-68" width="26" height="30" rx="5" fill="#7DAA41" stroke="#4d7322" stroke-width="2"/>
    <path d="M33,-68 l-2,-18 M40,-68 l1,-20 M46,-68 l3,-14" stroke="#9aa3ad" stroke-width="4" stroke-linecap="round"/>
    <path d="M-44,-68 l-3,-16" stroke="#e07a3a" stroke-width="4" stroke-linecap="round"/>
    <g data-part="armR" data-ox="30" data-oy="-138"><path d="M30,-138 C50,-122 50,-100 40,-86" stroke="${Bd}" stroke-width="15" fill="none" stroke-linecap="round"/>
      <g data-part="tool" style="display:none"><path d="M40,-86 l14,-34" stroke="#9aa3ad" stroke-width="6" stroke-linecap="round"/><circle cx="56" cy="-124" r="8" fill="none" stroke="#9aa3ad" stroke-width="5"/></g></g>
    <g data-part="head" data-ox="0" data-oy="22" transform="translate(0,-178)">
      <circle cx="-36" cy="-6" r="11" fill="${Bd}"/><circle cx="-36" cy="-6" r="6" fill="${D}"/>
      <circle cx="36" cy="-6" r="11" fill="${Bd}"/><circle cx="36" cy="-6" r="6" fill="${D}"/>
      <ellipse cx="0" cy="0" rx="40" ry="38" fill="${B}"/>
      <ellipse cx="0" cy="16" rx="28" ry="22" fill="${C}"/>
      <ellipse cx="-15" cy="-2" rx="15" ry="17" fill="${D}" opacity=".35"/>
      <ellipse cx="17" cy="-2" rx="15" ry="17" fill="${D}" opacity=".35"/>
      ${eye(-14, -2, 12, 14, '#8a4b1c', true, B)}
      ${eye(17, -2, 12, 14, '#8a4b1c', true, B)}
      <ellipse cx="2" cy="14" rx="8" ry="5.5" fill="#3a2212"/>
      <g data-part="mouthClosed"><path d="M-9,24 Q2,32 13,24" stroke="${D}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <g data-part="mouthOpen" style="display:none"><path d="M-10,22 Q2,42 14,22 Q2,26 -10,22Z" fill="#7a2626"/><ellipse cx="2" cy="31" rx="5" ry="3" fill="#F0857F"/></g>
      <g data-part="goggles">
        <path d="M-40,-24 Q0,-44 40,-24" stroke="#5b5b66" stroke-width="7" fill="none"/>
        <circle cx="-15" cy="-30" r="15" fill="#F07D23" stroke="#c45c10" stroke-width="3"/><circle cx="-15" cy="-30" r="9.5" fill="#A9D8F2"/><circle cx="-18" cy="-33" r="3" fill="#fff"/>
        <circle cx="16" cy="-30" r="15" fill="#F07D23" stroke="#c45c10" stroke-width="3"/><circle cx="16" cy="-30" r="9.5" fill="#A9D8F2"/><circle cx="13" cy="-33" r="3" fill="#fff"/>
      </g>
    </g>`;
  }

  /* ---------------- Bongani the Baby Elephant ---------------- */
  function bongani() {
    const G = '#A6A9AE', Gd = '#8F9399', P = '#F2B3AC', N = '#EDE3CF';
    const leg = (x, c) => `<rect x="${x}" y="-110" width="44" height="110" rx="18" fill="${c}"/>
      <ellipse cx="${x + 11}" cy="-6" rx="7" ry="5" fill="${N}"/><ellipse cx="${x + 23}" cy="-6" rx="7" ry="5" fill="${N}"/><ellipse cx="${x + 35}" cy="-6" rx="7" ry="5" fill="${N}"/>`;
    return `
    <path d="M-112,-150 C-128,-130 -130,-110 -124,-96" stroke="${Gd}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-124,-100 q-8,10 0,18 q8,-6 6,-18z" fill="#6b6e73"/>
    ${leg(-78, Gd)}${leg(30, Gd)}
    <ellipse cx="-14" cy="-140" rx="104" ry="80" fill="${G}"/>
    ${leg(-104, G)}${leg(6, G)}
    <g data-part="head" data-ox="-20" data-oy="40" transform="translate(70,-196)">
      <circle cx="0" cy="0" r="72" fill="${G}"/>
      <path d="M-14,-70 q-4,-22 4,-30 M-2,-72 q2,-24 12,-28 M8,-70 q10,-18 20,-18" stroke="#7a7d82" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g data-part="trunk" data-ox="46" data-oy="16"><path d="M40,10 C78,22 92,58 84,96 C82,108 96,114 104,98" stroke="${G}" stroke-width="32" fill="none" stroke-linecap="round"/>
        <path d="M70,40 l12,-4 M78,58 l12,-2 M80,76 l12,0" stroke="${Gd}" stroke-width="3" stroke-linecap="round"/></g>
      ${eye(26, -12, 16, 19, '#8a4b1c', true, G)}
      <path d="M8,-40 q16,-10 32,-2" stroke="#5c5f63" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="18" cy="24" rx="14" ry="8" fill="${P}" opacity=".6"/>
      <g data-part="mouthClosed"><path d="M24,42 Q38,54 54,42" stroke="#5c5f63" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g data-part="mouthOpen" style="display:none"><path d="M22,40 Q38,70 56,40 Q38,46 22,40Z" fill="#7a2626"/><ellipse cx="39" cy="54" rx="9" ry="5" fill="#F0857F"/></g>
      <g data-part="ear" data-ox="-30" data-oy="-20"><ellipse cx="-50" cy="6" rx="50" ry="64" fill="${G}" stroke="${Gd}" stroke-width="3"/><ellipse cx="-50" cy="8" rx="35" ry="48" fill="${P}"/></g>
    </g>`;
  }

  /* ---------------- Kiki the Hornbill ---------------- */
  function kiki() {
    const K = '#25252B', C = '#F3E7CC';
    return `
    <path d="M-28,-52 L-78,-2 L-62,6 L-20,-34 Z" fill="${K}"/>
    <path d="M-78,-2 L-62,6 L-70,-10Z" fill="#F26B1D"/><path d="M-70,-12 l8,-8 l6,6z" fill="#F7B731"/>
    <path d="M-8,-12 v14 M8,-12 v14 M-14,2 h12 M2,2 h14" stroke="#6b6b75" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="-4" cy="-62" rx="42" ry="52" fill="${K}"/>
    <ellipse cx="10" cy="-58" rx="26" ry="40" fill="${C}"/>
    <g data-part="wing" data-ox="-10" data-oy="-96"><path d="M-10,-96 C-58,-90 -64,-40 -36,-20 C-20,-36 -8,-60 -10,-96Z" fill="#33333a"/>
      <path d="M-50,-40 C-46,-30 -40,-24 -36,-20 C-38,-30 -42,-36 -50,-40Z" fill="#F26B1D"/></g>
    <g data-part="head" data-ox="0" data-oy="30" transform="translate(14,-122)">
      <path d="M-10,-30 l-8,-24 l12,10 l2,-22 l10,20 l10,-16 l-2,26z" fill="#F26B1D"/><path d="M-4,-34 l2,-14 l6,12z" fill="#F7B731"/>
      <circle cx="0" cy="0" r="33" fill="${K}"/>
      <ellipse cx="10" cy="4" rx="21" ry="23" fill="${C}"/>
      ${eye(12, -2, 12, 13, '#8a4b1c', true, C)}
      <g data-part="mouthClosed">
        <path d="M26,-18 C74,-40 118,-12 112,26 C92,10 62,8 28,12 Z" fill="#F7B731" stroke="#d8861c" stroke-width="3"/>
        <path d="M28,12 C62,8 92,10 112,26" stroke="#9c4a10" stroke-width="3" fill="none"/>
        <path d="M30,-16 C60,-32 90,-26 104,-6" stroke="#F26B1D" stroke-width="8" fill="none" stroke-linecap="round"/></g>
      <g data-part="mouthOpen" style="display:none">
        <path d="M26,-18 C74,-42 118,-18 112,18 C92,2 62,0 28,4 Z" fill="#F7B731" stroke="#d8861c" stroke-width="3"/>
        <path d="M30,-16 C60,-32 90,-26 104,-8" stroke="#F26B1D" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M28,10 C60,14 88,22 104,40 C80,36 52,32 28,22Z" fill="#F7B731" stroke="#d8861c" stroke-width="3"/>
        <path d="M30,6 C60,4 86,10 100,22 C80,22 54,18 30,14Z" fill="#b8333a"/></g>
    </g>`;
  }

  /* ---------------- Zuri the Zebra ---------------- */
  function zuri() {
    const W = '#FBFBF7', K = '#26262c';
    let stripes = '';
    for (let x = -100; x <= 80; x += 26) stripes += `<path d="M${x},-260 Q${x + 14},-200 ${x - 2},-120" stroke="${K}" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    const leg = (x, c) => `<rect x="${x}" y="-200" width="26" height="196" rx="12" fill="${c}"/>
      <path d="M${x},-150 h26 M${x},-120 h26 M${x},-90 h26 M${x},-60 h26" stroke="${K}" stroke-width="8"/>
      <rect x="${x - 2}" y="-26" width="30" height="26" rx="7" fill="${K}"/>`;
    return `
    <defs><clipPath id="zuriBody"><ellipse cx="-10" cy="-200" rx="110" ry="64"/></clipPath>
      <clipPath id="zuriNeck"><path d="M30,-232 C48,-282 70,-322 92,-352 L140,-332 C120,-300 104,-262 98,-212 Z"/></clipPath></defs>
    <path d="M-116,-214 C-136,-190 -138,-160 -132,-130" stroke="${W}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M-132,-142 q-10,16 -2,34 q10,-8 10,-34z" fill="${K}"/>
    ${leg(-80, '#ecece6')}${leg(52, '#ecece6')}
    <ellipse cx="-10" cy="-200" rx="110" ry="64" fill="${W}"/>
    <g clip-path="url(#zuriBody)">${stripes}</g>
    ${leg(-104, W)}${leg(28, W)}
    <path d="M24,-238 C42,-290 66,-330 88,-360" stroke="${K}" stroke-width="26" fill="none" stroke-linecap="round" stroke-dasharray="3 10"/>
    <path d="M30,-232 C48,-282 70,-322 92,-352 L140,-332 C120,-300 104,-262 98,-212 Z" fill="${W}"/>
    <g clip-path="url(#zuriNeck)"><path d="M40,-300 l90,20 M50,-270 l90,18 M58,-240 l80,16 M70,-326 l70,22" stroke="${K}" stroke-width="10"/></g>
    <g data-part="head" data-ox="-10" data-oy="20" transform="translate(116,-362)">
      <path d="M-28,-26 l-6,-42 l22,30z" fill="${W}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-6,-30 l4,-42 l14,36z" fill="${W}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="10" cy="0" rx="46" ry="34" fill="${W}"/>
      <path d="M-24,-22 q10,8 4,24 M-8,-30 q10,10 6,26" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <ellipse cx="50" cy="14" rx="30" ry="23" fill="#4a4a52"/>
      <ellipse cx="66" cy="6" rx="5" ry="3.5" fill="#1d1d22"/>
      ${eye(12, -6, 14, 16, '#7a4318', true, W)}
      <g data-part="mouthClosed"><path d="M34,28 Q50,38 68,26" stroke="#1d1d22" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
      <g data-part="mouthOpen" style="display:none"><path d="M34,24 Q52,50 70,22 Q52,30 34,24Z" fill="#7a2626"/></g>
      <g transform="translate(-24,-34) rotate(-15)"><path d="M0,0 l-24,-14 v28z M0,0 l24,-14 v28z" fill="#F47EB0" stroke="#d2508a" stroke-width="3" stroke-linejoin="round"/><circle r="7" fill="#F9A0C8" stroke="#d2508a" stroke-width="3"/></g>
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
