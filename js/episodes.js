/* Gerri's Space Dream — Season 1.
 * Every scene, line, pause question and sing-along comes from
 * docs/season-1-scripts.md. See engine.js for the beat format.
 */
(function () {
  /* ---------- helpers ---------- */
  const G = (o = {}) => ({ id: 'gerri', x: 470, y: 795, s: 0.85, ...o });
  const T = (o = {}) => ({ id: 'thola', x: 860, y: 795, s: 1.3, flip: -1, ...o });
  const Z = (o = {}) => ({ id: 'zuri', x: 1100, y: 795, s: 0.8, flip: -1, ...o });
  const K = (o = {}) => ({ id: 'kiki', x: 1300, y: 795, s: 1.1, flip: -1, ...o });
  const B = (o = {}) => ({ id: 'bongani', x: 1400, y: 795, s: 1.0, flip: -1, ...o });
  const say = (s, t, o = {}) => ({ s, t, ...o });
  const ask = (s, t, a, o = {}) => ({ s, t, q: true, a, ...o });
  const lbl = (id, text, x, y, color, o = {}) => ({ id, type: 'label', text, x, y, color, layer: 'front', pop: true, ...o });
  const big = (id, text, x, y, o = {}) => ({ id, type: 'text', text, x, y, layer: 'front', pop: true, ...o });
  const HELMET = { gerri: { x: 0, y: -52, s: 0.75 }, thola: { x: 0, y: -26, s: 0.62 }, zuri: { x: 6, y: -24, s: 0.72 }, bongani: { x: 0, y: -60, s: 1 }, kiki: { x: 0, y: -26, s: 0.55 } };
  const helmet = who => ({ id: 'helmet-' + who, type: 'helmet', on: who + ':head', ...HELMET[who] });

  const intro = () => ({
    name: 'Theme song', bg: 'night',
    cast: [G({ x: 560, act: 'lookup' })],
    beats: [
      { w: 1.2 },
      { add: [T({ x: 1000, pop: true })], sfx: 'pop', act: { thola: 'wave' }, w: 0.8 },
      { theme: true, act: { gerri: 'dance', thola: 'dance' } },
      { act: { gerri: null, thola: null }, title: true },
    ],
  });

  const ROCKET = { x: 1220, y: 795 };

  /* ---------- theme ---------- */
  // The recorded theme song ("Gerri's adventure"). Line times are in seconds into the track;
  // nudge them here if the words run ahead of or behind the singing.
  const THEME_LINES = ['Look up high, way up high,', "Gerri's dreaming of the sky!", 'With Thola building, step by step,', "We'll reach the stars – we're not done yet!"];
  window.THEME_SONG = {
    title: "Gerri's Space Dream", audio: 'assets/audio/theme-gerris-adventure.mp3', duration: 26.9,
    timing: [
      { text: THEME_LINES[0], start: 1.25, end: 4.3, label: 'Theme song' },
      { text: THEME_LINES[1], start: 4.85, end: 7.4 },
      { text: THEME_LINES[2], start: 7.95, end: 11.1 },
      { text: THEME_LINES[3], start: 11.55, end: 14.7 },
      { block: THEME_LINES, start: 15.0, label: 'Sing along!' },
    ],
  };

  const song = (title, v1, ch, v2, o = {}) => ({ title, ...o, parts: [{ label: 'Verse 1', lines: v1 }, { label: 'Chorus', lines: ch }, { label: 'Verse 2', lines: v2 }, { label: 'Chorus', lines: ch }] });

  const EPISODES = [];

  /* ================= Episode 1 ================= */
  EPISODES.push({
    n: 1, title: 'Gerri Looks Up', goal: 'big and small', runtime: 'about 6 minutes',
    song: song("I'm Reaching for the Stars",
      ['A ladybird is small, small, small,', 'A tree is big and tall, tall, tall,', 'But I want something bigger still –', "I'm reaching for the stars!"],
      ['Reach, reach, reach for the stars,', 'Up past the Moon and up past Mars!', 'Big or small, we try it all –', "I'm reaching for the stars!"],
      ["My friend Thola's small and smart,", 'She builds with all her clever heart,', 'A rocket big enough for me –', "I'm reaching for the stars!"], { bpm: 104, key: 60 }),
    yt: { title: 'Gerri the Giraffe Wants to Go to Space! | Big and Small for Kids', description: 'Gerri the Giraffe dreams of flying to the stars, and her inventor friend Thola builds her very first rocket. But is it big enough? Learn big and small with a fun sing-along song!', tags: 'kids cartoon, big and small, preschool learning, giraffe cartoon, space for kids' },
    scenes: [
      intro(),
      { name: 'Under the stars', bg: 'night', cast: [G({ x: 640 })],
        beats: [
          say('gerri', "Hi friends! I'm Gerri!", { act: { gerri: 'wave' } }),
          say('gerri', 'I dream of flying to the stars.', { act: { gerri: 'lookup' } }),
          ask('gerri', 'Are stars close or far?', 'Far!', { aops: { act: { gerri: 'bounce' } } }),
          { add: [T({ x: 1060, pop: true })], sfx: 'pop', act: { gerri: null }, w: 0.4 },
          say('thola', "I'm Thola, an inventor! I'll build you a spaceship!", { act: { thola: 'hop' }, then: { act: { thola: null } } }),
        ] },
      { name: 'The tiny rocket', bg: 'workshop', cast: [G({ x: 640 }), T({ x: 1020, act: 'tool' })], props: [],
        beats: [
          { cap: 'Thola builds a tiny cardboard rocket…', part: { thola: { tool: true } }, sfx: ['pop'], w: 1.2 },
          { add: [{ id: 'box', type: 'box', x: 1180, y: 795, s: 0.9, pop: true }], sfx: 'chime', act: { thola: 'cheer' }, w: 1.4 },
          { act: { thola: null }, part: { thola: { tool: false } }, to: { gerri: { x: 960, dur: 1.4 } }, w: 1.4 },
          { act: { gerri: 'bend' }, w: 0.8 },
          { del: 'box', add: [{ id: 'hat', type: 'box', on: 'gerri:head', x: 8, y: -32, s: 0.62 }], sfx: 'bonk', act: { gerri: null }, w: 0.8 },
          { cap: 'Only her head fits – the box sits on her head like a hat!', w: 2 },
          say('gerri', "Thola, something's wrong!", { act: { gerri: 'wobble' } }),
          say('thola', 'Eish!', { act: { thola: 'hop', gerri: null }, then: { act: { thola: null } } }),
        ] },
      { name: 'Big or small?', bg: 'workshop', cast: [G({ x: 470 }), T({ x: 1240 })],
        props: [{ id: 'box', type: 'box', x: 900, y: 795, s: 0.9 }],
        beats: [
          { add: [lbl('l1', 'SMALL', 900, 600, '#4FB3E6')], sfx: 'pop', w: 0.6 },
          { add: [lbl('l2', 'BIG', 300, 330, '#E04848')], sfx: 'pop', w: 0.6 },
          ask('thola', 'Friends, is the rocket big or small?', 'Small!', { aops: { glow: 'l1' } }),
          ask('thola', 'Is Gerri big or small?', 'Big!', { aops: { glow: 'l2', act: { gerri: 'bounce' } } }),
        ] },
      { name: 'Big and small everywhere', bg: 'savannah', cast: [],
        beats: [
          { add: [{ id: 'a', type: 'ladybird', x: 480, y: 700, s: 1.6, pop: true }, { id: 'b', type: 'tree', x: 1150, y: 790, s: 1.1, pop: true }, lbl('la', 'SMALL', 480, 600, '#4FB3E6'), lbl('lb', 'BIG', 1150, 500, '#E04848')], sfx: 'pop' },
          say('thola', 'A ladybird is small. A tree is big!', { w: 0.5 }),
          { del: ['a', 'b', 'la', 'lb'], add: [{ id: 'a', type: 'pebble', x: 480, y: 760, s: 1.8, pop: true }, { id: 'b', type: 'rock', x: 1150, y: 790, s: 1.4, pop: true }, lbl('la', 'SMALL', 480, 620, '#4FB3E6'), lbl('lb', 'BIG', 1150, 480, '#E04848')], sfx: 'pop' },
          say('gerri', 'A pebble is small. A rock is big!', { w: 0.5 }),
          { del: ['a', 'b', 'la', 'lb'], add: [T({ id: 'thola', x: 520, flip: 1, pop: true }), G({ x: 1050, pop: true }), lbl('la', 'SMALL', 520, 480, '#4FB3E6'), lbl('lb', 'BIG', 1350, 300, '#E04848')], sfx: 'pop' },
          say('both', 'Thola is small. Gerri is big!', { act: { gerri: 'bounce', thola: 'bounce' }, w: 0.6 }),
        ] },
      { name: "Sing-along: I'm Reaching for the Stars", bg: 'workshop', cast: [G({ x: 520, act: 'dance' }), T({ x: 980, act: 'dance' })],
        beats: [{ song: true, fx: (i, e) => {
          if (i === 0) e.applyOps({ add: [{ id: 'sl', type: 'ladybird', x: 1300, y: 640, s: 1.5, pop: true }, lbl('sll', 'SMALL', 1300, 540, '#4FB3E6')] });
          if (i === 1) e.applyOps({ add: [{ id: 'st', type: 'tree', x: 1380, y: 790, s: 0.9, pop: true }] , del: ['sl', 'sll'] });
          if (i === 2) e.applyOps({ del: ['st'] });
          if (i === 4 || i === 12) e.applyOps({ fx: 'stars', sfx: 'sparkle' });
          if (i === 8) e.applyOps({ glow: 'thola', act: { thola: 'cheer' } });
          if (i === 9) e.applyOps({ act: { thola: 'dance' } });
        } }] },
      { name: 'A bigger plan', bg: 'workshop', cast: [G({ x: 470 }), T({ x: 1240, flip: -1, act: 'tool' })],
        props: [{ id: 'board', type: 'chalkboard', drawing: 'rocket', x: 880, y: 760, s: 1 }],
        beats: [
          { part: { thola: { tool: true } }, cap: 'Thola draws a BIGGER rocket on the chalkboard.', w: 2.2 },
          ask('gerri', 'Should the next rocket be big or small, friends?', 'BIG!', { aops: { act: { gerri: 'hop', thola: 'cheer' }, sfx: 'chime' } }),
          { act: { gerri: null, thola: null }, w: 0.4 },
        ] },
      { name: 'Goodnight', bg: 'night', cast: [G({ x: 560, act: 'lookup' }), T({ x: 950 })],
        beats: [
          say('thola', 'Today we learned big and small!'),
          say('gerri', "One day I'll fly up there. Bye, friends!", { act: { gerri: 'wave' } }),
          say('thola', 'Sharp sharp!', { act: { thola: 'wave' } }),
          { add: [{ id: 'tw', type: 'sticker', x: 1250, y: 180, s: 1.8, anim: 'twinkle', layer: 'fx', pop: true }], sfx: 'sparkle', w: 2.5 },
        ] },
    ],
  });

  /* ================= Episode 2 ================= */
  const blocks = n => Array.from({ length: n }, (_, i) => ({ id: 'bk' + (i + 1), type: 'block', n: i + 1, x: 250, y: 795 - i * 60, drop: 0.5 }));
  EPISODES.push({
    n: 2, title: "The Door's Too Short!", goal: 'tall and short', runtime: 'about 6 minutes',
    song: song('How Tall Is Gerri?',
      ['Stack a block and stack one more,', 'Measure up from the floor,', 'One, two, three, and up we go –', "How tall is Gerri? Let's find out!"],
      ['Tall, tall, Gerri is tall!', 'Short, short, the door is small!', 'Count the blocks and you will see', 'Just how tall is Gerri!'],
      ["Five, six, seven, eight blocks high,", "Gerri's head is near the sky,", 'Build the door as tall as she –', "Then she'll fit inside, whee!"], { bpm: 108, key: 62 }),
    yt: { title: "The Door's Too Short! | Gerri the Giraffe Learns Tall and Short", description: 'Thola builds a bigger rocket, but the door is way too short for Gerri! Count blocks and learn to measure tall and short with a catchy sing-along.', tags: 'tall and short, measuring for kids, counting to 8, preschool cartoon, giraffe for kids' },
    scenes: [
      intro(),
      { name: 'The short door', bg: 'workshop', cast: [G({ x: 560 }), T({ x: 900 })],
        props: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 560, w: 240, door: 'short' }],
        beats: [
          { cap: 'A big silver-and-red rocket! But its door only reaches Gerri’s knees…', w: 2.4 },
          { to: { gerri: { x: 1000, dur: 1.2 }, thola: { x: 700, dur: 1 } }, face: { thola: 1 }, w: 1.2 },
          { act: { gerri: 'pretzel' }, sfx: 'oops', cap: 'Gerri bends her neck like a pretzel… and gets stuck!', eyes: { gerri: true }, w: 2.4 },
          say('thola', 'Eish! The door is too short!', { act: { thola: 'hop' }, then: { act: { thola: null, gerri: null }, eyes: { gerri: false } } }),
        ] },
      { name: 'Tall or short?', bg: 'workshop', cast: [G({ x: 470 }), T({ x: 820 })],
        props: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 560, w: 240, door: 'short' }],
        beats: [
          { add: [lbl('lt', 'TALL', 320, 300, '#E04848'), lbl('ls', 'SHORT', 1220, 610, '#4FB3E6')], sfx: 'pop', w: 0.8 },
          ask('thola', 'Is Gerri tall or short, friends?', 'Tall!', { aops: { glow: 'lt' } }),
          ask('thola', 'And the door?', 'Short!', { aops: { glow: 'ls' } }),
          say('thola', "Let's measure Gerri.", { act: { thola: 'tool' }, part: { thola: { tool: true } } }),
        ] },
      { name: 'Measuring with blocks', bg: 'workshop', cast: [G({ x: 520 }), T({ x: 380, flip: 1, s: 1.1 })],
        props: [{ id: 'ladder', type: 'ladder', x: 140, y: 795, s: 1.2 }],
        beats: [
          { cap: 'Thola stacks glowing wooden blocks beside Gerri…', w: 1.2 },
          ...blocks(8).map((b, i) => ({ add: [b], sfx: 'pop', s: 'all', t: ['One', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight!'][i], ...(i === 3 ? { to: { thola: { x: 160, y: 590, dur: 0.8 } } } : {}) })),
          { to: { thola: { x: 380, y: 795, dur: 0.8 } }, w: 0.8 },
          say('thola', 'Gerri is 8 blocks tall! The door is only 2.', { add: [lbl('l8', '8 blocks', 250, 260, '#E04848'), lbl('l2', '2 blocks', 1150, 640, '#4FB3E6'), { id: 'b2a', type: 'block', n: 1, x: 1150, y: 795 }, { id: 'b2b', type: 'block', n: 2, x: 1150, y: 735 }] }),
          ask('gerri', 'Which is taller, friends – 8 or 2?', 'Eight!', { aops: { glow: 'l8', act: { gerri: 'hop' }, sfx: 'chime' } }),
          { act: { gerri: null }, w: 0.3 },
        ] },
      { name: 'Sing-along: How Tall Is Gerri?', bg: 'workshop', cast: [G({ x: 640, act: 'dance' }), T({ x: 1040, act: 'dance' })],
        beats: [{ song: true, fx: (i, e) => {
          const n = (i % 8) + 1;
          if (i % 4 === 0) [...Array(8)].forEach((_, k) => e.remove('sb' + (k + 1)));
          e.applyOps({ add: [{ id: 'sb' + n, type: 'block', n, x: 250, y: 795 - ((n - 1) % 8) * 60, drop: 0.4, anim: 'bob' }] });
          if (i === 4 || i === 12) e.applyOps({ add: [lbl('st', 'TALL', 1350, 260, '#E04848')], del: 'ss' });
          if (i === 5 || i === 13) e.applyOps({ add: [lbl('ss', 'SHORT', 1350, 660, '#4FB3E6')], del: 'st' });
          if (i === 7 || i === 15) e.applyOps({ del: ['st', 'ss'] });
        } }] },
      { name: 'A tall new door', bg: 'workshop', cast: [G({ x: 520 }), T({ x: 900, act: 'tool' })],
        props: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 600, w: 250, door: 'short' }],
        beats: [
          { part: { thola: { tool: true } }, cap: 'Thola cuts a new door – 8 blocks tall!', sfx: 'pop', w: 1.4 },
          { del: 'rocket', add: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 600, w: 250, door: 'tall', win: 'high' }], sfx: 'chime', act: { thola: 'cheer' }, w: 1.2 },
          { to: { gerri: { x: 1220, op: 0, dur: 1.4 } }, act: { thola: null }, w: 1.4 },
          { del: 'rocket', add: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 600, w: 250, door: 'tall', win: 'high', face: 'gerri' }], sfx: 'pop' },
          say('gerri', 'I fit!'),
          { cap: 'Gerri sits down… BONK! Her head bumps the ceiling.', sfx: 'bonk', fx: 'shake', w: 1.4 },
          say('gerri', "Hee hee! It's a bit wobbly. Next time!", { add: [{ id: 'rk', type: 'rocket', ...ROCKET, h: 600, w: 250, door: 'tall', win: 'high', face: 'gerri', anim: 'wobble' }], del: 'rocket' }),
        ] },
      { name: 'Goodnight', bg: 'night', cast: [G({ x: 560, act: 'lookup' }), T({ x: 950 })],
        beats: [
          say('thola', 'Today we measured tall and short!'),
          say('gerri', 'Bye, friends!', { act: { gerri: 'wave', thola: 'wave' }, w: 1.6 }),
        ] },
    ],
  });

  /* ================= Episode 3 ================= */
  const SHAPE_COL = { circle: '#4FB3E6', square: '#F7C93A', triangle: '#E04848', rectangle: '#7DAA41' };
  EPISODES.push({
    n: 3, title: 'Shapes Make a Spaceship', goal: 'shapes', runtime: 'about 7 minutes',
    song: song('Circle, Square and Triangle',
      ['A circle goes round like the big yellow Sun,', 'A square has four sides – count them, everyone!', 'One, two, three, four!'],
      ['Circle, square and triangle,', 'Rectangle too!', 'Shapes can build a rocket ship –', 'Just for me and you!'],
      ["A triangle's strong with three pointy tips,", 'It holds up the bottom of rocket ships,', 'One, two, three!'], { bpm: 100, key: 65 }),
    yt: { title: 'Shapes Make a Spaceship! | Learn Circle, Square and Triangle with Gerri', description: "Gerri's rocket keeps falling over, so Thola uses shapes to make it strong. Learn circles, squares, triangles and rectangles with a fun shape song!", tags: 'shapes for kids, learn shapes, preschool shapes song, kids cartoon, space rocket for kids' },
    scenes: [
      intro(),
      { name: 'FLUMP!', bg: 'workshop', cast: [G({ x: 520 }), T({ x: 860 })],
        props: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 680, w: 210, door: 'tall', anim: 'wobble' }],
        beats: [
          { cap: 'The tall rocket wobbles… and wobbles…', w: 1.8 },
          { to: { rocket: { rot: 84, x: 1000, dur: 0.8, ez: 'inOut' } }, w: 0.7 },
          { sfx: 'flump', fx: 'shake', w: 0.8 },
          say('gerri', 'It fell over!', { act: { gerri: 'wobble' }, then: { act: { gerri: null } } }),
          say('thola', 'Eish! The right shapes will make it strong!', { act: { thola: 'tool' }, part: { thola: { tool: true } } }),
        ] },
      { name: 'Name the shapes', bg: 'workshop', cast: [G({ x: 330 }), T({ x: 1380 })],
        beats: [
          ask('thola', 'Round, round – what is it?', 'Circle!', { ab: 'gerri', add: [{ id: 's1', type: 'shape', shape: 'circle', color: SHAPE_COL.circle, x: 620, y: 380, pop: true, anim: 'bob' }], sfx: 'pop', aops: { del: 's1', add: [{ id: 's1', type: 'shape', shape: 'circle', name: 'CIRCLE', color: SHAPE_COL.circle, x: 620, y: 380, anim: 'bob' }], sfx: 'chime' } }),
          ask('thola', 'Four same sides?', 'Square!', { ab: 'gerri', add: [{ id: 's2', type: 'shape', shape: 'square', color: SHAPE_COL.square, x: 980, y: 380, pop: true, anim: 'bob' }], sfx: 'pop', aops: { del: 's2', add: [{ id: 's2', type: 'shape', shape: 'square', name: 'SQUARE', color: SHAPE_COL.square, x: 980, y: 380, anim: 'bob' }], sfx: 'chime' } }),
          ask('thola', 'Three pointy corners?', 'Triangle!', { ab: 'gerri', add: [{ id: 's3', type: 'shape', shape: 'triangle', color: SHAPE_COL.triangle, x: 620, y: 650, s: 0.9, pop: true, anim: 'bob' }], sfx: 'pop', aops: { del: 's3', add: [{ id: 's3', type: 'shape', shape: 'triangle', name: 'TRIANGLE', color: SHAPE_COL.triangle, x: 620, y: 650, s: 0.9, anim: 'bob' }], sfx: 'chime' } }),
          ask('thola', 'Two long, two short sides?', 'Rectangle!', { ab: 'gerri', add: [{ id: 's4', type: 'shape', shape: 'rectangle', color: SHAPE_COL.rectangle, x: 1000, y: 650, s: 0.8, pop: true, anim: 'bob' }], sfx: 'pop', aops: { del: 's4', add: [{ id: 's4', type: 'shape', shape: 'rectangle', name: 'RECTANGLE', color: SHAPE_COL.rectangle, x: 1000, y: 650, s: 0.8, anim: 'bob' }], sfx: 'chime' } }),
        ] },
      { name: 'Building with shapes', bg: 'workshop', cast: [G({ x: 470 }), T({ x: 860, act: 'tool' })],
        beats: [
          say('thola', 'A rectangle body!', { part: { thola: { tool: true } }, add: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 560, w: 230, color: 'silverred', pop: true }], glow: 'rocket', sfx: 'pop' }),
          ask('gerri', 'Which shape makes a round window, friends?', 'Circle!', { aops: { del: 'rocket', add: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 560, w: 230, door: 'tall', win: 'low' }], glow: 'rocket', sfx: 'chime' } }),
          say('thola', 'Strong triangle legs, a triangle nose, square buttons!', { del: 'rocket', add: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 600, w: 230, door: 'tall', win: 'low', legs: true, nose: true, buttons: true }], glow: 'rocket', sfx: 'chime' }),
          { to: { gerri: { x: 900, rot: 6, dur: 1.2 } }, cap: 'Gerri leans on it… it doesn’t wobble!', w: 1.8 },
          say('both', 'Sharp sharp!', { to: { gerri: { rot: 0, dur: 0.4 } }, act: { gerri: 'hop', thola: 'cheer' }, sfx: 'sparkle', then: { act: { gerri: null, thola: null } } }),
        ] },
      { name: 'Sing-along: Circle, Square and Triangle', bg: 'savannah', cast: [G({ x: 330, act: 'dance' }), T({ x: 1330, act: 'dance' })],
        beats: [{ song: true, fx: (i, e) => {
          const order = ['circle', 'square', 'triangle', 'rectangle'];
          const sh = order[i % 4];
          e.applyOps({ add: [{ id: 'ds' + (i % 6), type: 'shape', shape: sh, color: SHAPE_COL[sh], x: 560 + (i % 3) * 240, y: 260 + (i % 2) * 260, s: 0.8, pop: true, anim: i % 2 ? 'spin' : 'bob' }] });
          if (i === 3 || i === 10) e.applyOps({ add: [{ id: 'dsr', type: 'rocket', x: 800, y: 795, h: 360, w: 140, legs: true, win: 'high', pop: true }] });
          if (i === 7 || i === 15) e.applyOps({ del: 'dsr', fx: 'stars' });
        } }] },
      { name: 'Shape hunt', bg: 'savannah', cast: [G({ x: 600 }), T({ x: 950 })],
        beats: [
          say('thola', 'Look – the Sun is a circle!', { add: [{ id: 'sun', type: 'shape', shape: 'circle', color: '#FFD24A', x: 1260, y: 200, r: 80, pop: true, anim: 'pulse', layer: 'front' }], sfx: 'chime', act: { gerri: 'lookup' } }),
          ask('gerri', 'Find a shape in your room, friends!', null, { qd: 4 }),
          { del: 'sun', add: [{ id: 'rocket', type: 'rocket', ...ROCKET, h: 600, w: 230, door: 'tall', win: 'low', legs: true, nose: true, buttons: true, face: 'knees' }], to: { gerri: { x: 1220, op: 0, dur: 1.2 } }, act: { gerri: null }, w: 1.4 },
          say('gerri', "The window's a bit low. Next time!"),
        ] },
      { name: 'Goodnight', bg: 'night', cast: [G({ x: 560, act: 'lookup' }), T({ x: 950 })],
        beats: [
          say('thola', 'Today we learned shapes!'),
          say('gerri', 'Triangles make rockets strong! Bye, friends!', { act: { gerri: 'wave', thola: 'wave' }, w: 1 }),
        ] },
    ],
  });

  /* ================= Episode 4 ================= */
  const R4 = { id: 'rocket', type: 'rocket', ...ROCKET, h: 600, w: 230, door: 'tall', legs: true, nose: true, buttons: true };
  EPISODES.push({
    n: 4, title: 'The Window Problem', goal: 'high and low', runtime: 'about 6 minutes',
    song: song('Look Up High, Look Down Low',
      ['Look up high, what do you see?', 'Birds and clouds and a tall, tall tree!', "Look down low, what's on the ground?", 'Beetles and flowers all around!'],
      ['Up, up, up! Down, down, down!', 'High in the sky, low on the ground!', 'Up, up, up! Down, down, down!', 'Look all around!'],
      ['Window high so I can see', 'All the stars that wait for me,', 'Look down low and wave goodbye –', "One day I'll fly into the sky!"], { bpm: 112, key: 64 }),
    yt: { title: 'The Window Problem! | Up and Down, High and Low with Gerri the Giraffe', description: "Gerri can't see out of her rocket because the window is too low! Play the up-and-down game and learn high and low with Gerri and Thola.", tags: 'up and down for kids, high and low, position words, preschool learning, kids space cartoon' },
    scenes: [
      intro(),
      { name: "I can't see out!", bg: 'workshop', cast: [T({ x: 820, flip: 1 })],
        props: [{ ...R4, win: 'low', face: 'knees' }],
        beats: [
          { cap: 'Gerri sits inside the rocket. Thola peeks in the window… and sees only knees!', w: 2.6 },
          say('gerri', "I can't see out!", { add: [{ id: 'zz', type: 'label', text: '?', x: 1220, y: 160, color: '#7a4a9a', layer: 'front', pop: true }] }),
          ask('gerri', 'Friends, is the window high or low?', 'Low!', { del: 'zz' }),
          say('gerri', 'But my eyes are up high!'),
        ] },
      { name: 'The up-and-down game', bg: 'savannah', cast: [G({ x: 640 }), T({ x: 1050 })],
        beats: [
          say('thola', 'When I say UP, look up! DOWN, look down! Play along, friends!'),
          say('thola', 'UP!', { act: { gerri: 'up' }, add: [{ id: 'bird', type: 'bird', x: 400, y: 120, s: 1.4, anim: 'fly-across', layer: 'fx' }] }),
          say('thola', 'DOWN!', { act: { gerri: 'down' }, add: [{ id: 'beetle', type: 'beetle', x: 980, y: 760, s: 1.4, pop: true }] }),
          say('thola', 'UP!', { act: { gerri: 'up' }, del: 'beetle' }),
          say('thola', 'DOWN!', { act: { gerri: 'down' } }),
          say('thola', 'Up! Down! Up! Down!', { act: { gerri: 'stretch' } }),
          { act: { gerri: 'tumble' }, sfx: 'flump', cap: 'Faster and faster… until Gerri flops down giggling!', w: 1.8 },
          { act: { gerri: null }, w: 0.4 },
        ] },
      { name: 'Where should the window go?', bg: 'workshop', cast: [G({ x: 640 }), T({ x: 1040 })],
        beats: [
          { add: [{ id: 'win', type: 'ball', r: 60, color: '#9fd4ff', x: 680, y: 720, pop: true }], sfx: 'pop' },
          say('gerri', 'Low – I see my toes!', { act: { gerri: 'down' } }),
          { to: { win: { y: 480, dur: 0.6 } }, act: { gerri: null }, w: 0.6 },
          say('gerri', 'Middle – my tummy!'),
          { to: { win: { x: 800, y: 210, dur: 0.6 } }, act: { gerri: 'lookup' }, w: 0.6 },
          say('gerri', 'High – I see the stars!', { fx: 'stars', sfx: 'sparkle' }),
          ask('thola', 'High or low, friends?', 'HIGH!', { aops: { sfx: 'chime' } }),
          { del: 'win', add: [{ ...R4, x: 1260, win: 'high', face: 'gerri', pop: true }], to: { gerri: { op: 0, dur: 0.4 } }, cap: 'Thola fixes the window high up. Gerri’s happy face fills it!', act: { thola: 'cheer' }, w: 2.4 },
        ] },
      { name: 'Sing-along: Look Up High, Look Down Low', bg: 'savannah', cast: [G({ x: 560, act: 'up' }), T({ x: 1000, act: 'dance' })],
        beats: [{ song: true, fx: (i, e) => {
          const up = [0, 1, 4, 6, 8, 9, 12, 14].includes(i);
          e.applyOps({ act: { gerri: up ? 'up' : 'down', thola: up ? 'cheer' : 'dance' } });
          if (i === 1) e.applyOps({ add: [{ id: 'bird', type: 'bird', x: 300, y: 140, s: 1.3, anim: 'fly-across', layer: 'fx' }] });
          if (i === 3) e.applyOps({ add: [{ id: 'fl', type: 'flower', x: 820, y: 795, pop: true }, { id: 'bt', type: 'beetle', x: 1300, y: 770, s: 1.3, pop: true }] });
          if (i === 9) e.applyOps({ fx: 'stars' });
        } }] },
      { name: 'A high window', bg: 'workshop', cast: [T({ x: 820, flip: 1 })], props: [{ ...R4, win: 'high', face: 'gerri' }],
        beats: [
          say('gerri', 'Can we go to space now?'),
          say('thola', 'Almost! First, astronauts learn to count down. Next time!', { act: { thola: 'wave' } }),
        ] },
      { name: 'Goodnight', bg: 'night', cast: [G({ x: 560, act: 'lookup' }), T({ x: 950 })],
        beats: [
          say('thola', 'Today we learned high and low!'),
          say('gerri', 'Now I can see the stars! Bye, friends!', { act: { gerri: 'wave', thola: 'wave' }, w: 1 }),
        ] },
    ],
  });

  /* ================= Episode 5 ================= */
  const COUNT = ['Ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one…'];
  EPISODES.push({
    n: 5, title: 'Countdown Practice', goal: 'counting back from 10', runtime: 'about 5 minutes',
    song: song('10, 9, 8... Blast Off!',
      ["Ten, nine, eight, we're standing straight,", "Seven, six, five, we can't wait!", 'Four, three, two, get ready, crew –', 'One... BLAST OFF!'],
      ['Count it down, down, down,', 'Then up, up, up we go!', 'Count it down, down, down –', 'Blast off! Whoa!'],
      ['Helmet on and buckle tight,', "Rocket's ready for the flight!", "Count it slowly, don't you rush –", 'One... BLAST OFF!'], { bpm: 116, key: 60 }),
    yt: { title: 'Countdown to Blast Off! | Count Backwards from 10 with Gerri the Giraffe', description: 'Gerri is so excited to blast off that she forgets to finish counting! Shout along and learn to count backwards from 10 with a rocket countdown song.', tags: 'countdown song for kids, count backwards from 10, blast off, preschool numbers, space for kids' },
    scenes: [
      intro(),
      { name: 'Too excited!', bg: 'workshop', cast: [G({ x: 560, act: 'bounce' }), T({ x: 900 })],
        props: [{ ...R4, win: 'high' }, { id: 'bush', type: 'bush', x: 140, y: 800, s: 1.2, layer: 'front' }],
        beats: [
          { add: [helmet('gerri')], sfx: 'pop', cap: 'Gerri wears a cardboard helmet and bounces by the rocket.', w: 2 },
          say('thola', 'Astronauts count down. Ten, nine...'),
          say('gerri', 'BLAST OFF!', { act: { gerri: 'hop' }, then: { to: { gerri: { x: 140, y: 900, dur: 0.7 } }, sfx: 'whoosh' } }),
          { w: 0.8, sfx: 'flump', fx: 'shake' },
          { to: { gerri: { x: 330, y: 795, dur: 0.7 } }, add: [{ id: 'lv', type: 'leaves', on: 'gerri:head', x: -10, y: -90, s: 0.8 }], act: { gerri: null }, w: 0.8 },
          say('gerri', 'Oops! Too excited!', { act: { gerri: 'wobble' }, then: { act: { gerri: null } } }),
        ] },
      { name: 'Backwards counting', bg: 'workshop', cast: [G({ x: 330 }), T({ x: 1320 })],
        props: [{ id: 'board', type: 'chalkboard', countdown: true, x: 820, y: 760, s: 1.15 }],
        beats: [
          say('thola', 'A countdown goes backwards. Say it with us, friends!'),
          ...COUNT.map((c, i) => ({ s: 'all', t: c, num: 10 - i, sfx: 'tick' })),
          { s: 'all', t: 'BLAST OFF!', fx: 'stars', sfx: 'whoosh', act: { gerri: 'hop', thola: 'cheer' } },
          { act: { gerri: null, thola: null }, del: 'board', add: [{ id: 'board', type: 'chalkboard', countdown: true, x: 820, y: 760, s: 1.15 }] },
          say('gerri', 'Ten, nine, eight...', { num: 10, then: { num: 9 } }),
          ask('gerri', 'Um, what comes next, friends?', 'Seven!', { aops: { num: 7, run: e => { e.applyOps({ num: 8 }); } } }),
          say('gerri', 'Six, five, four, three, two, one... BLAST OFF!', { run: e => [6, 5, 4, 3, 2, 1].forEach(n => e.applyOps({ num: n })), then: { fx: 'stars', sfx: 'sparkle', act: { gerri: 'cheer' } } }),
          { cap: 'Star confetti falls!', w: 1.6 },
        ] },
      { name: 'Sing-along: 10, 9, 8... Blast Off!', bg: 'savannah', cast: [G({ x: 470, act: 'dance' }), T({ x: 1150, act: 'dance' })],
        beats: [{ song: true, fx: (i, e) => {
          const map = { 0: [10, 9, 8], 1: [7, 6, 5], 2: [4, 3, 2], 3: [1], 8: [10, 9, 8], 9: [7, 6, 5], 10: [4, 3, 2], 11: [1] };
          if (map[i]) {
            [...Array(11)].forEach((_, k) => e.remove('n' + k));
            map[i].forEach((n, k) => e.applyOps({ add: [big('n' + n, String(n), 640 + k * 160, 300, { drop: 0.5, size: 150 })] }));
            // crouch lower with every number
            const lower = { 0: 0.85, 1: 0.8, 2: 0.74, 8: 0.85, 9: 0.8, 10: 0.74 }[i];
            if (lower) e.applyOps({ to: { gerri: { s: lower, dur: 0.6 } }, act: { gerri: 'still', thola: 'still' } });
            if (i === 3 || i === 11) e.applyOps({ to: { gerri: { s: 0.85, dur: 0.4 } }, act: { gerri: 'jump', thola: 'jump' }, fx: 'stars', sfx: 'whoosh', add: [big('bo', 'BLAST OFF!', 800, 300, { size: 140 })] });
          }
          if (i === 4 || i === 12) e.applyOps({ del: ['n1', 'bo'], act: { gerri: 'dance', thola: 'dance' } });
        } }] },
      { name: 'Shout it loud!', bg: 'savannah', cast: [G({ x: 400 }), T({ x: 1280 })],
        beats: [
          say('thola', 'Stand up, friends, shout it loud!', { act: { thola: 'cheer' } }),
          ...['TEN!', 'NINE!', 'EIGHT!', 'SEVEN!', 'SIX!', 'FIVE!', 'FOUR!', 'THREE!', 'TWO!', 'ONE!'].map((c, i) => ({ s: 'all', t: c, del: 'bn' + (11 - i), add: [big('bn' + (10 - i), String(10 - i), 820, 470, { size: 300 })], sfx: 'tick' })),
          { s: 'all', t: 'BLAST OFF!', del: 'bn1', add: [{ id: 'toy', type: 'toyRocket', x: 820, y: 795, s: 1.5 }], sfx: 'whoosh', then: { to: { toy: { y: 120, dur: 1.4 } } } },
          { w: 1.4, del: 'toy', add: [{ id: 'para', type: 'parachute', x: 820, y: 160, s: 1.2 }], then: { to: { para: { y: 700, x: 900, dur: 4, ez: 'lin' } } } },
          { w: 2 },
          say('gerri', "Next time it's MY turn!", { act: { gerri: 'hop' } }),
          say('thola', "First, let's learn about the Moon!", { act: { gerri: null } }),
        ] },
      { name: 'Goodnight', bg: 'night', cast: [G({ x: 560, act: 'lookup' }), T({ x: 950 })],
        beats: [
          say('thola', 'Today we counted backwards from ten!'),
          say('gerri', 'Ten, nine...', { act: { gerri: 'sleep' } }),
          { add: [{ id: 'z', type: 'zzz', x: 760, y: 150, layer: 'fx', fadeIn: 0.6 }], w: 1.2 },
          say('thola', 'Bye, friends!', { cap: '(whisper)', act: { thola: 'wave' }, w: 1.2 }),
        ] },
    ],
  });

  /* ================= Episode 6 ================= */
  const R6 = { ...R4, color: 'silver', win: 'high' };
  EPISODES.push({
    n: 6, title: 'Meet the Moon', goal: 'Moon shapes', runtime: 'about 7 minutes',
    song: song('Hello, Mister Moon',
      ['Hello, Mister Moon, so round and bright,', 'You light up the savannah every night,', 'The Sun shines on you, and you shine on me –', 'Hello, Mister Moon!'],
      ['Full moon, half moon,', 'Crescent moon smile,', 'Sometimes you hide', 'For a little while!', 'Hello, Mister Moon!'],
      ["One day I'll fly up to say hello,", "In Thola's rocket, off we'll go!", "Till then I'll wave from way down here –", 'Hello, Mister Moon!'], { bpm: 88, key: 57 }),
    yt: { title: 'Meet the Moon! | Moon Shapes for Kids with Gerri the Giraffe', description: 'While the rocket glue dries, Thola shows Gerri why the Moon changes shape using a torch and a ball. Learn full, half, crescent and new moon with a gentle song!', tags: 'moon for kids, moon phases, space for preschoolers, kids science, bedtime cartoon' },
    scenes: [
      intro(),
      { name: 'Wet glue', bg: 'workshopEve', cast: [G({ x: 560 }), T({ x: 880 })],
        props: [{ ...R6, x: 1250 }, { id: 'sign', type: 'sign', text: 'WET GLUE –|WAIT!', x: 1010, y: 795 }],
        beats: [
          { cap: 'The rocket is covered in silver paper. A full Moon glows outside.', w: 2.2 },
          say('gerri', 'Can my rocket go to the Moon?', { act: { gerri: 'lookup' } }),
          say('thola', "Let's learn about it while the glue dries!", { act: { gerri: null } }),
        ] },
      { name: 'The Moon tonight', bg: { sky: 'night', moon: 'full', moonX: 1150, moonY: 200, moonR: 110 }, cast: [G({ x: 460, act: 'lookup' }), T({ x: 780, act: 'lookup' })],
        beats: [
          say('thola', 'The Moon is a big ball of rock going around Earth.'),
          say('thola', "The Sun shines on it – that's why it glows!"),
          ask('gerri', 'What shape is it tonight, friends?', 'A circle!', { aops: { sfx: 'chime' } }),
        ] },
      { name: 'Torch, ball and Moon', bg: 'darkroom', cast: [G({ x: 1380, s: 0.7 }), T({ x: 220, s: 1.2, flip: 1 })],
        props: [{ id: 'torch', type: 'torch', x: 330, y: 560, s: 1 }, { id: 'earth', type: 'planet', name: 'earth', x: 820, y: 520, r: 60 },
          { id: 'moon', type: 'moon', phase: 'full', x: 1100, y: 520, r: 60 }],
        beats: [
          { cap: "Thola's torch is the Sun. Gerri holds the Moon around the Earth.", w: 2.4 },
          say('thola', 'Whole bright side – FULL MOON!', { add: [lbl('ml', 'FULL MOON', 1100, 400, '#7a4a9a')], glow: 'moon' }),
          { del: ['moon', 'ml'], add: [{ id: 'moon', type: 'moon', phase: 'half', x: 820, y: 290, r: 60, pop: true }, lbl('ml', 'HALF MOON', 820, 170, '#7a4a9a')], sfx: 'pop' },
          say('gerri', 'Half – HALF MOON!'),
          { del: ['moon', 'ml'], add: [{ id: 'moon', type: 'moon', phase: 'crescent', x: 560, y: 520, r: 60, pop: true }, lbl('ml', 'CRESCENT MOON', 560, 400, '#7a4a9a')], sfx: 'pop' },
          say('gerri', 'A thin smile – CRESCENT MOON!'),
          { del: ['moon', 'ml'], add: [{ id: 'moon', type: 'moon', phase: 'new', x: 820, y: 750, r: 60, pop: true }], sfx: 'pop' },
          say('gerri', "Now it's dark?"),
          say('thola', 'Still there – a NEW MOON!', { add: [lbl('ml', 'NEW MOON', 820, 640, '#7a4a9a')] }),
          ask('gerri', 'Make a crescent with your hand, friends!', null, { qd: 4 }),
        ] },
      { name: 'Sing-along: Hello, Mister Moon', bg: { sky: 'night' }, cast: [G({ x: 470, act: 'dance' }), T({ x: 830, act: 'dance' })],
        props: [{ id: 'moon', type: 'moon', phase: 'full', face: true, x: 1220, y: 260, r: 110, anim: 'bob' }],
        beats: [{ song: true, fx: (i, e) => {
          const phases = ['full', 'half', 'crescent', 'new'];
          const p = i >= 4 && i <= 7 ? phases[i - 4] : i >= 13 && i <= 16 ? phases[i - 13] : (i === 8 || i === 17 ? 'full' : null);
          if (p) e.applyOps({ del: 'moon', add: [{ id: 'moon', type: 'moon', phase: p, face: p === 'full', x: 1220, y: 260, r: 110, anim: 'bob' }], sfx: 'sparkle' });
        } }] },
      { name: 'Morning', bg: 'workshop', cast: [G({ x: 560 }), T({ x: 880 })], props: [{ ...R6, x: 1250, anim: 'gleam' }],
        beats: [
          { cap: 'Morning. The rocket gleams silver. Gerri goes quiet.', sfx: 'sparkle', act: { gerri: 'sad' }, w: 2.2 },
          say('gerri', "Space is very far away, isn't it?"),
          say('thola', 'Are you okay?', { face: { thola: -1 } }),
          say('gerri', "I'll tell you next time.", { cap: '(small voice)' }),
        ] },
      { name: 'Goodnight', bg: 'nightCrescent', cast: [G({ x: 560, act: 'lookup' }), T({ x: 950 })],
        beats: [
          say('thola', 'Today we learned Moon shapes!'),
          say('gerri', 'Goodnight, Mister Moon. Bye, friends!', { act: { gerri: 'wave', thola: 'wave' }, w: 1 }),
        ] },
    ],
  });

  /* ================= Episode 7 ================= */
  EPISODES.push({
    n: 7, title: 'Gerri Feels Worried', goal: 'feelings, being brave', runtime: 'about 7 minutes',
    song: song('Brave Like Me',
      ['When my tummy feels wobbly and my knees start to shake,', 'I take a big breath, a big breath I take,', "I hold my friend's hand and I say it out loud –", "I can be brave, and I'm proud!"],
      ['Brave like me, brave like you,', 'Feeling scared but trying too!', 'With a friend right by my side,', 'I can be brave!'],
      ["I've got my blanket, my snack and my song,", 'A picture of home to carry along,', 'Thola is with me, wherever I go –', 'I can be brave, I know!'], { bpm: 92, key: 62 }),
    yt: { title: 'Gerri Feels Worried | Feelings and Being Brave for Kids', description: 'Gerri feels worried about going so far from home, so Thola helps her name her feelings and pack a Brave Bag. A gentle episode about feelings, deep breaths and courage.', tags: 'feelings for kids, being brave, emotions for preschoolers, calming breathing for kids, social emotional learning' },
    scenes: [
      intro(),
      { name: 'Under the acacia', bg: 'acacia', cast: [G({ x: 640, act: 'sad' }), T({ x: 980 })],
        beats: [
          say('gerri', 'Space is so far. What if I miss home?'),
          say('thola', "You're feeling worried. That's okay – everyone does sometimes. Even me!", { act: { thola: 'bounce' }, then: { act: { thola: null } } }),
        ] },
      { name: 'Feeling cards', bg: 'acacia', cast: [G({ x: 360 }), T({ x: 1380 })],
        beats: [
          ask('thola', 'Big smile?', 'Happy!', { ab: 'gerri', add: [{ id: 'c1', type: 'card', face: 'happy', x: 640, y: 420, pop: true }], sfx: 'pop', aops: { glow: 'c1' } }),
          ask('thola', 'A tear?', 'Sad.', { ab: 'gerri', add: [{ id: 'c2', type: 'card', face: 'sad', x: 860, y: 420, pop: true }], sfx: 'pop', aops: { glow: 'c2' } }),
          ask('thola', 'Wobbly mouth?', 'Worried, like me.', { ab: 'gerri', add: [{ id: 'c3', type: 'card', face: 'worried', x: 1080, y: 420, pop: true }], sfx: 'pop', aops: { glow: 'c3', act: { gerri: 'sad' } } }),
          say('thola', 'Proud smile – BRAVE! Brave means you feel scared but try anyway.', { add: [{ id: 'c4', type: 'card', face: 'brave', x: 860, y: 700, s: 0.9, pop: true }], sfx: 'chime', act: { gerri: null } }),
          ask('gerri', 'How do YOU feel today, friends?', null, { qd: 4 }),
        ] },
      { name: 'The Brave Bag', bg: 'acacia', cast: [G({ x: 400 }), T({ x: 1180 })],
        props: [{ id: 'bag', type: 'bag', x: 800, y: 720, s: 1.3 }],
        beats: [
          { cap: 'A backpack with a star – the Brave Bag!', glow: 'bag', sfx: 'chime', w: 1.8 },
          { add: [{ id: 'i1', type: 'blanket', x: 800, y: 300, s: 0.8, pop: true }], cap: 'A patchwork blanket…', w: 1.2, then: { to: { i1: { y: 680, s: 0.2, op: 0, dur: 0.7 } } } },
          { add: [{ id: 'i2', type: 'drawing', x: 800, y: 300, pop: true }], cap: 'A drawing of home and friends…', w: 1.6, then: { to: { i2: { y: 680, s: 0.2, op: 0, dur: 0.7 } } } },
          { add: [{ id: 'i3', type: 'leaves', x: 800, y: 300, s: 1.4, pop: true }], cap: 'Acacia leaves…', w: 1.4, then: { to: { i3: { y: 680, s: 0.2, op: 0, dur: 0.7 } } } },
          { add: [{ id: 'i4', type: 'walkie', x: 1000, y: 560, s: 1.2, pop: true }], cap: 'And a walkie-talkie from Thola.', w: 1 },
          say('thola', 'So you can talk to me any time!', { act: { thola: 'bounce' }, then: { to: { i4: { x: 800, y: 680, s: 0.2, op: 0, dur: 0.7 } }, act: { thola: null }, sfx: 'pop' } }),
          ask('gerri', 'What would you put in your Brave Bag, friends?', null, { qd: 4 }),
        ] },
      { name: 'Sing-along: Brave Like Me', bg: 'savannah', cast: [G({ x: 300, s: 0.7 }), T({ x: 1350, act: 'dance' })],
        beats: [{ song: true, fx: (i, e) => {
          // Gerri walks a little taller with every line
          const k = Math.min(1, i / 12);
          e.applyOps({ to: { gerri: { x: 300 + k * 600, s: 0.7 + k * 0.2, dur: 1.5 } }, act: { gerri: i % 4 === 3 ? 'cheer' : 'march' } });
          if (i === 3 || i === 11 || i === 15) e.applyOps({ fx: 'stars' });
        } }] },
      { name: 'Smell the flower, blow the candle', bg: 'acacia', cast: [G({ x: 470 }), T({ x: 820, flip: 1 })],
        props: [{ id: 'fl', type: 'flower', x: 1080, y: 795, s: 1.5 }, { id: 'cd', type: 'candle', x: 1300, y: 795, s: 1.4 }],
        beats: [
          say('thola', 'Smell the flower…', { glow: 'fl', act: { thola: 'breathe', gerri: 'breathe' }, then: { w: 0 } }),
          { cap: '(breathe in…)', w: 2.5 },
          say('thola', '…blow out the candle.', { glow: 'cd' }),
          { cap: '(breathe out…)', run: e => { const c = e.ents.get('cd'); if (c) c.pose.querySelector('.flicker').style.opacity = 0; }, w: 2.5 },
          ask('thola', 'Try it, friends!', null, { qd: 5 }),
          say('gerri', 'A tiny bit worried, but brave too!', { act: { gerri: 'lookup', thola: null } }),
        ] },
      { name: 'Goodnight', bg: 'night', cast: [G({ x: 560, act: 'lookup' }), T({ x: 950 })],
        beats: [
          say('thola', 'Today we learned about feelings!'),
          say('gerri', 'Brave means trying! Bye, friends!', { act: { gerri: 'wave', thola: 'wave' }, w: 1 }),
        ] },
    ],
  });

  /* ================= Episode 8 ================= */
  const PLAN_X = { mercury: 260, venus: 380, earth: 510, mars: 630, jupiter: 790, saturn: 990, uranus: 1180, neptune: 1340 };
  const pl = (name, label) => ({ id: name, type: 'planet', name, label, x: PLAN_X[name], y: 290, pop: true, layer: 'back' });
  EPISODES.push({
    n: 8, title: 'The Planet Parade', goal: '8 planets', runtime: 'about 8 minutes',
    song: song('Planet Parade',
      ["Mercury's first, so close to the Sun,", 'Venus is second, a hot, cloudy one,', 'Earth is our home, the third in the line,', 'Mars is fourth, red and shiny!'],
      ['March, march, the Planet Parade,', "Round and round the Sun they've stayed!", 'Eight little planets, big and small –', "Let's say hello to them all!"],
      ["Jupiter's fifth, the biggest of all,", "Saturn's sixth with its rings like a ball,", 'Uranus is seventh, it spins on its side,', "Neptune's eighth, way out wide!"], { bpm: 112, key: 62 }),
    yt: { title: 'The Planet Parade! | Learn the 8 Planets with Gerri the Giraffe', description: 'Gerri and Thola make their own planets and line them up from the Sun in a fun Planet Parade. Learn all eight planets in order with a marching sing-along song!', tags: 'planets for kids, solar system song, 8 planets in order, space for kids, preschool science' },
    scenes: [
      intro(),
      { name: 'Paint pots everywhere', bg: 'workshop', cast: [G({ x: 560 }), T({ x: 900 })],
        props: [{ id: 'paint', type: 'paint', x: 1150, y: 795, s: 1.2 }],
        beats: [
          say('gerri', 'Where will I go in space?'),
          say('thola', "Planets! Earth and seven more. Let's make a Planet Parade!", { act: { thola: 'hop' } }),
          { act: { thola: 'tool' }, part: { thola: { tool: true } }, cap: 'They paint balls and balloons as planets… and a big paper Sun!', sfx: 'pop',
            add: [{ id: 'p1', type: 'planet', name: 'mars', x: 1100, y: 500, pop: true }, { id: 'p2', type: 'planet', name: 'neptune', x: 1300, y: 450, pop: true }, { id: 'p3', type: 'planet', name: 'sun', x: 1400, y: 200, r: 80, pop: true }], w: 2.6 },
        ] },
      { name: 'Line them up', bg: 'savannah', cast: [G({ x: 420, s: 0.62 }), T({ x: 1450, s: 1.1 })],
        props: [{ id: 'sun', type: 'planet', name: 'sun', x: 30, y: 290, r: 150, layer: 'back' }],
        beats: [
          say('thola', '1, MERCURY – tiny and hot!', { add: [pl('mercury', '1 Mercury')], sfx: 'pop' }),
          say('thola', '2, VENUS – cloudy and hot!', { add: [pl('venus', '2 Venus')], sfx: 'pop' }),
          ask('gerri', '3 – which planet do we live on, friends?', 'EARTH!', { aops: { add: [pl('earth', '3 Earth')], sfx: 'chime' } }),
          say('thola', '4, MARS – red and dusty!', { add: [pl('mars', '4 Mars')], sfx: 'pop' }),
          say('gerri', '5, JUPITER – the biggest, with a red spot like mine!', { add: [pl('jupiter', '5 Jupiter')], sfx: 'pop' }),
          say('thola', '6, SATURN – with rings!', { add: [pl('saturn', '6 Saturn'), { id: 'hoop', type: 'hoop', on: 'gerri:neck', x: 95, y: -470, s: 0.75, rot: -18 }], sfx: 'boing', act: { gerri: 'wobble' } }),
          say('gerri', '7, URANUS – spins on its side!', { add: [pl('uranus', '7 Uranus')], sfx: 'pop', act: { thola: 'tumble', gerri: null } }),
          say('gerri', '8, NEPTUNE – blue and windy!', { add: [pl('neptune', '8 Neptune')], sfx: 'whoosh', act: { thola: null, gerri: 'shake' } }),
          ask('all', 'Count them, friends! One to EIGHT!', null, { qd: 5, act: { gerri: null } }),
          { s: 'all', t: 'One, two, three, four, five, six, seven, EIGHT!', glow: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'], sfx: 'chime' },
        ] },
      { name: 'Sing-along: Planet Parade', bg: 'savannah', cast: [G({ x: 160, s: 0.55, act: 'march' }), T({ x: 300, s: 1, act: 'march' })],
        props: [{ id: 'sun', type: 'planet', name: 'sun', x: 30, y: 290, r: 150, layer: 'back' }],
        beats: [{ song: true, fx: (i, e) => {
          const order = ['mercury', 'venus', 'earth', 'mars', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
          const nm = i < 4 ? order[i] : i >= 8 && i < 12 ? order[i] : null;
          if (nm) e.applyOps({ add: [{ ...pl(nm, nm[0].toUpperCase() + nm.slice(1)), anim: 'bob' }], sfx: 'pop' });
          if (i === 4 || i === 12) e.applyOps({ glow: Object.keys(PLAN_X) });
          e.applyOps({ to: { gerri: { x: 160 + i * 75, dur: 2 }, thola: { x: 300 + i * 75, dur: 2 } } });
        } }] },
      { name: 'Too heavy!', bg: 'workshop', cast: [G({ x: 560 }), T({ x: 1020, flip: 1 })],
        props: [{ ...R6, x: 1250 }],
        beats: [
          { cap: 'They paint a planet stripe around the rocket.', del: 'rocket', add: [{ ...R6, x: 1250, stripe: true }], sfx: 'sparkle', glow: 'rocket', w: 2 },
          { act: { thola: 'push' }, cap: 'Thola pushes it… it won’t move!', w: 2 },
          say('thola', 'Eish! Too heavy!', { act: { thola: null } }),
          say('gerri', 'We need help. Next time!'),
        ] },
      { name: 'Goodnight', bg: 'night', cast: [G({ x: 560, act: 'lookup' }), T({ x: 950 })],
        props: Object.keys(PLAN_X).map((n, i) => ({ id: n, type: 'planet', name: n, x: 260 + i * 160, y: 140, s: 0.5, anim: 'twinkle' })),
        beats: [
          say('gerri', 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!'),
          say('gerri', 'Bye, friends!', { act: { gerri: 'wave', thola: 'wave' }, w: 1 }),
        ] },
    ],
  });

  /* ================= Episode 9 ================= */
  const R9 = { ...R6, stripe: true };
  EPISODES.push({
    n: 9, title: 'Thola Needs Help', goal: 'teamwork', runtime: 'about 6 minutes',
    song: song('Many Hands',
      ["When a job's too big for one,", 'Call your friends and get it done!', 'Push together, pull together,', 'Many hands make it lighter!'],
      ['Many hands, many hands,', 'Working together, we can!', 'Big or small, we help it all –', 'With many, many hands!'],
      ['Zuri pushes, Kiki sings,', 'Bongani lifts the heavy things,', 'Thola steers and Gerri too –', 'Teamwork, me and you!'], { bpm: 108, key: 64 }),
    yt: { title: 'Thola Needs Help! | Teamwork and Asking for Help with Gerri the Giraffe', description: "The rocket is too heavy for Thola to move alone, so she learns it's okay to ask friends for help. A fun episode about teamwork, saying please and thank you.", tags: 'teamwork for kids, asking for help, manners for kids, preschool cartoon, friendship song' },
    scenes: [
      intro(),
      { name: 'Too heavy to push', bg: { sky: 'day', pad: true }, cast: [G({ x: 330, s: 0.75 }), T({ x: 520, flip: 1 })],
        props: [{ id: 'cart', type: 'cart', x: 820, y: 795, s: 1 }, { ...R9, x: 1100, y: 600, rot: -90, s: 0.9 }],
        beats: [
          { cap: 'The rocket lies on a cart. The launch pad is across the field.', w: 2 },
          { act: { thola: 'push' }, cap: 'Thola pushes – her feet spin in the dust!', sfx: 'whoosh', w: 2 },
          { act: { gerri: 'push' }, to: { gerri: { x: 420, dur: 0.6 } }, cap: 'Gerri helps – it barely moves.', w: 2 },
          say('thola', 'An inventor should do it alone.', { act: { thola: 'sad', gerri: null }, cap: '(sad)' }),
          say('gerri', 'Even inventors need help!'),
          ask('gerri', 'Friends, what can we do when it’s too hard?', 'Ask for help!', { aops: { act: { thola: 'bounce' } } }),
        ] },
      { name: 'Asking friends', bg: 'savannah', cast: [G({ x: 380, s: 0.75 }), T({ x: 600, flip: 1 })],
        beats: [
          { add: [Z({ x: 960, pop: true })], sfx: 'pop', w: 0.4 },
          say('thola', 'Zuri, please help?', { act: { thola: null } }),
          say('zuri', 'Of course!', { act: { zuri: 'hop' }, then: { act: { zuri: null } } }),
          { add: [K({ x: 1500, y: 200, s: 0.7, act: 'fly' })], to: { kiki: { x: 458, y: 196, dur: 1.4 } }, sfx: 'whoosh', w: 1.4 },
          say('kiki', "I'll-help-I'll-help!", { act: { kiki: 'bounce' }, cap: '' }),
          { add: [B({ x: 1300, pop: true })], sfx: 'pop', act: { kiki: null }, w: 0.4 },
          say('gerri', "Bongani, you're strong. Please help?"),
          say('bongani', 'Okay!', { cap: '(shy smile)', act: { bongani: 'wave' }, then: { act: { bongani: null } } }),
          ask('gerri', 'What magic word did we say, friends?', 'PLEASE!', { aops: { sfx: 'chime', fx: 'stars' } }),
        ] },
      { name: 'Heave-ho!', bg: { sky: 'day', pad: true }, cast: [B({ x: 320, flip: 1, s: 0.9 }), Z({ x: 470, flip: 1, s: 0.7 }), G({ x: 220, s: 0.7 }), T({ x: 590, flip: 1, s: 1.1 }), K({ x: 640, y: 380, act: 'fly' })],
        props: [{ id: 'cart', type: 'cart', x: 900, y: 795, s: 1 }, { ...R9, x: 1180, y: 600, rot: -90, s: 0.9 }],
        beats: [
          say('thola', 'On three! One, two, THREE!'),
          { s: 'all', t: 'Heave-ho!', act: { bongani: 'push', zuri: 'push', gerri: 'push', thola: 'push' },
            to: { cart: { x: 1180, dur: 3 }, rocket: { x: 1460, dur: 3 }, bongani: { x: 600, dur: 3 }, zuri: { x: 750, dur: 3 }, gerri: { x: 500, dur: 3 }, thola: { x: 870, dur: 3 }, kiki: { x: 900, dur: 3 } } },
          say('kiki', 'Left-a-bit! Right-a-bit!', { act: { kiki: 'fly' } }),
          { w: 1.2, act: { bongani: 'lift', zuri: null, gerri: null, thola: null } },
          { cap: 'Bongani lifts the rocket upright onto the launch pad with his trunk!', to: { rocket: { rot: 0, x: 1080, y: 780, dur: 1.6, ez: 'back' } }, sfx: 'whoosh', w: 1.8 },
          { sfx: 'thud', fx: 'shake', act: { bongani: null }, w: 0.6 },
          { s: 'all', t: 'HOORAY!', act: { gerri: 'cheer', thola: 'cheer', zuri: 'cheer', bongani: 'cheer', kiki: 'cheer' }, fx: 'confetti', sfx: 'cheer' },
          ask('gerri', 'What do we say when someone helps, friends?', 'THANK YOU!', { act: { gerri: null, thola: null, zuri: null, bongani: null, kiki: 'fly' }, aops: { sfx: 'chime', act: { gerri: 'wave', thola: 'wave' } } }),
        ] },
      { name: 'Sing-along: Many Hands', bg: 'launchpad', cast: [G({ x: 330, s: 0.65, act: 'dance' }), T({ x: 1450, act: 'dance' }), Z({ x: 620, s: 0.65, act: 'dance' }), B({ x: 1260, s: 0.8, act: 'dance' }), K({ x: 820, y: 300, act: 'fly' })],
        props: [{ ...R9, x: 1080, y: 760, s: 0.85 }],
        beats: [{ song: true, fx: (i, e) => {
          if (i === 8) e.applyOps({ act: { zuri: 'push' } });
          if (i === 9) e.applyOps({ act: { zuri: 'dance', kiki: 'cheer' } });
          if (i === 10) e.applyOps({ act: { kiki: 'fly', bongani: 'lift' } });
          if (i === 11) e.applyOps({ act: { bongani: 'dance', thola: 'cheer', gerri: 'cheer' } });
          if (i === 12) e.applyOps({ act: { thola: 'dance', gerri: 'dance' } });
          e.applyOps({ to: { kiki: { x: 500 + ((i * 260) % 900), y: 220 + (i % 3) * 60, dur: 1.8 } } });
          if (i === 7 || i === 15) e.applyOps({ fx: 'stars' });
        } }] },
      { name: 'Sunset', bg: 'launchpad', cast: [G({ x: 300, s: 0.75 }), T({ x: 520, flip: -1 }), Z({ x: 700, s: 0.6, flip: -1 }), B({ x: 1400, s: 0.8, flip: -1 }), K({ x: 1530, y: 640, flip: -1, s: 0.9 })],
        props: [{ ...R9, x: 1080, y: 760, s: 0.85 }],
        beats: [
          say('thola', "It's okay to ask for help!", { act: { thola: 'bounce' } }),
          say('gerri', 'Next: astronaut training! Bye, friends!', { act: { gerri: 'wave', thola: 'wave', zuri: 'wave', bongani: 'wave', kiki: 'wave' }, w: 1 }),
        ] },
    ],
  });

  /* ================= Episode 10 ================= */
  const TEAM = (o = {}) => [G({ x: 250, s: 0.7, ...o.g }), T({ x: 520, flip: -1, ...o.t }), Z({ x: 780, s: 0.62, ...o.z }), B({ x: 1060, s: 0.8, ...o.b }), K({ x: 1320, s: 1, ...o.k })];
  const HELMETS = ['gerri', 'thola', 'zuri', 'bongani', 'kiki'].map(helmet);
  const allAct = a => ({ gerri: a, thola: a, zuri: a, bongani: a, kiki: a });
  EPISODES.push({
    n: 10, title: 'Astronaut Training', goal: 'move along', runtime: 'about 7 minutes',
    song: song('Astro Exercise',
      ['Reach up high to touch a star,', 'Stretch your arms out, near and far,', 'Bend down low and touch the ground –', 'Astronauts move all around!'],
      ['Astro, astro, exercise!', 'Jump and float and touch the skies!', 'Strong and healthy, here we go –', 'Astro, astro, whoa!'],
      ["Jump like you're upon the Moon,", 'Float like a big balloon,', 'Stand on one foot, hold it still –', 'Astronauts can do it! Yes, we will!'], { bpm: 116, key: 65 }),
    yt: { title: 'Astronaut Training! | Move and Exercise with Gerri the Giraffe', description: 'Gerri and her friends get ready for space with stretching, Moon jumps, floating and balancing. Stand up and train like an astronaut with this move-along episode!', tags: 'exercise for kids, movement song, brain break for kids, preschool PE, astronaut for kids' },
    scenes: [
      intro(),
      { name: 'Welcome to training', bg: 'savannah', cast: TEAM(),
        props: [{ id: 'cone1', type: 'cone', x: 120, y: 800 }, { id: 'cone2', type: 'cone', x: 1500, y: 800 }, { id: 'log', type: 'log', x: 800, y: 870, layer: 'front' }],
        beats: [
          { add: HELMETS, sfx: 'pop', cap: 'Everyone wears a cardboard helmet. Thola has a whistle!', w: 1.8 },
          say('thola', 'Welcome to Astronaut Training!', { sfx: 'whistle', act: { thola: 'hop' }, then: { act: { thola: null } } }),
          ask('gerri', 'Stand up, friends, and train with us!', null, { qd: 3 }),
        ] },
      { name: 'Stretch', bg: 'savannah', cast: TEAM(), props: [{ id: 'log', type: 'log', x: 800, y: 870, layer: 'front' }],
        beats: [
          { add: HELMETS },
          say('thola', 'Reach up to the stars…', { act: { ...allAct('up'), gerri: 'stretch' } }),
          { cap: 'Gerri’s neck stretch goes extra high!', w: 1.6 },
          say('thola', '…touch your toes!', { act: allAct('down') }),
          ask('thola', 'Stretch with us!', null, { qd: 4, act: { ...allAct('up'), gerri: 'stretch' } }),
          { act: allAct(null) },
        ] },
      { name: 'Moon jumps', bg: 'savannah', cast: TEAM(),
        beats: [
          { add: HELMETS },
          say('thola', 'Moon Jumps! Boing!', { act: { ...allAct('jump'), bongani: null }, sfx: 'boing' }),
          { sfx: 'boing', w: 1.6 },
          { act: { bongani: 'hop' }, w: 0.5, then: { sfx: 'thud', fx: 'shake', act: { ...allAct('wobble'), bongani: 'cheer' } } },
          { cap: "Bongani's jump shakes the ground! Everyone wobbles, laughing.", w: 2 },
          ask('thola', 'Jump with us, friends! Boing!', null, { qd: 4, act: allAct('jump'), sfx: 'boing' }),
          { act: allAct(null) },
        ] },
      { name: 'Floating', bg: 'deepspace', cast: TEAM({ k: { y: 700 } }),
        beats: [
          { add: HELMETS, act: allAct('float') },
          say('gerri', 'In space we float!'),
          ask('gerri', 'Move your arms slooowly, friends!', null, { qd: 5 }),
        ] },
      { name: 'Balance', bg: 'savannah', cast: TEAM(),
        beats: [
          { add: HELMETS, act: allAct('balance') },
          ...['One', 'two', 'three', 'four', 'five!'].map(c => ({ s: 'all', t: c, sfx: 'tick' })),
          { act: { gerri: 'tumble' }, sfx: 'flump', cap: 'Gerri wobbles and tumbles softly, laughing.', w: 1.8 },
          ask('thola', "It's okay to wobble! Try the other foot, friends!", null, { qd: 4, act: { gerri: 'balance' }, face: { gerri: -1 } }),
          { act: allAct(null), face: { gerri: 1 } },
        ] },
      { name: 'Sing-along: Astro Exercise', bg: 'savannah', cast: TEAM(),
        beats: [{ add: HELMETS }, { song: true, fx: (i, e) => {
          const moves = ['up', 'stretch', 'down', 'dance', 'cheer', 'jump', 'dance', 'cheer', 'jump', 'float', 'balance', 'cheer', 'cheer', 'jump', 'dance', 'cheer'];
          e.applyOps({ act: allAct(moves[i] || 'dance') });
          if (moves[i] === 'jump') e.applyOps({ sfx: 'boing' });
        } }] },
      { name: 'Rest and refuel', bg: 'sunset', cast: TEAM(), props: [{ id: 'water', type: 'water', x: 1080, y: 820, layer: 'front' }],
        beats: [
          { act: allAct('breathe'), cap: 'Lying on the grass, slow breaths…', w: 2 },
          say('gerri', 'Astronauts eat healthy food, drink water and sleep well!', { add: [{ id: 'lv', type: 'leaves', x: 420, y: 330, s: 1.2, pop: true }], act: { bongani: 'lift' } }),
          { cap: 'Thola gives everyone star stickers.', add: ['gerri', 'thola', 'zuri', 'bongani', 'kiki'].map((w, i) => ({ id: 'st' + i, type: 'sticker', x: [250, 520, 780, 1060, 1320][i], y: 150, pop: true, layer: 'front', anim: 'twinkle' })), sfx: 'sparkle', w: 1.6 },
          { s: 'all', t: 'HOORAY!', act: allAct('cheer'), fx: 'confetti', sfx: 'cheer' },
        ] },
      { name: 'Ready to fly', bg: 'launchpadNight', cast: [G({ x: 520 }), T({ x: 800 })], props: [{ ...R9, x: 1080, y: 760, s: 0.85 }],
        beats: [
          say('gerri', "I'm ready to fly! Bye, friends!", { act: { gerri: 'wave', thola: 'wave' }, w: 1 }),
        ] },
    ],
  });

  /* ================= Episode 11 ================= */
  EPISODES.push({
    n: 11, title: 'One Last Problem', goal: 'never give up', runtime: 'about 6 minutes',
    song: song('Try, Try Again',
      ['When things go wrong and I feel sad,', 'I think of all the fixes we had,', 'A door too short, a window too low –', 'We tried again, and so we grow!'],
      ['Try, try, try again,', "Don't give up, my friend!", "If at first it doesn't go,", 'Try, try, try again!'],
      ['A wobble here, a bonk up there,', 'We fix it all with lots of care,', "With Thola's help and friends so true –", "There's nothing that we can't do!"], { bpm: 100, key: 60 }),
    yt: { title: 'One Last Problem! | Never Give Up with Gerri the Giraffe', description: "The night before launch, Gerri's neck won't fit in the rocket and she wants to give up. Thola reminds her of every problem they've solved, and together they try again!", tags: 'never give up, growth mindset for kids, perseverance, preschool cartoon, kids space adventure' },
    scenes: [
      intro(),
      { name: 'BONK!', bg: 'launchpadNight', cast: [T({ x: 760, flip: 1 })], props: [{ ...R9, x: 1080, y: 760, s: 0.9, face: 'gerri' }],
        beats: [
          { cap: 'Gerri sits inside for practice. She lifts her head…', w: 2 },
          { sfx: 'bonk', fx: 'shake', cap: 'BONK! Her horns hit the pointy top!', w: 1.4 },
          say('gerri', "My neck doesn't fit!"),
          say('thola', 'Eish! Not again!', { act: { thola: 'hop' }, then: { act: { thola: null } } }),
        ] },
      { name: 'Remember?', bg: 'acaciaNight', cast: [G({ x: 470, act: 'sad' }), T({ x: 800 })],
        beats: [
          say('gerri', "Maybe giraffes can't go to space."),
          say('thola', 'Remember? The tiny rocket…', { add: [{ id: 'b1', type: 'bubble', inner: { type: 'box', s: 0.5, dy: 40 }, text: 'too small', x: 1050, y: 180, s: 0.75, pop: true, layer: 'front' }], sfx: 'pop' }),
          say('thola', 'The short door…', { add: [{ id: 'b2', type: 'bubble', inner: { type: 'rocket', h: 300, w: 120, door: 'short', s: 0.4, dy: 70 }, text: 'too short', x: 1350, y: 200, s: 0.75, pop: true, layer: 'front' }], sfx: 'pop' }),
          say('thola', 'The wobbly rocket…', { add: [{ id: 'b3', type: 'bubble', inner: { type: 'rocket', h: 300, w: 100, s: 0.4, dy: 70 }, text: 'wobbly', x: 1100, y: 440, s: 0.75, pop: true, layer: 'front', anim: 'wobble' }], sfx: 'pop' }),
          say('thola', 'The low window…', { add: [{ id: 'b4', type: 'bubble', inner: { type: 'rocket', h: 300, w: 120, win: 'low', s: 0.4, dy: 70 }, text: 'too low', x: 1400, y: 470, s: 0.75, pop: true, layer: 'front' }], sfx: 'pop' }),
          say('gerri', 'We fixed them all! We never gave up!', { act: { gerri: 'bounce' }, glow: ['b1', 'b2', 'b3', 'b4'], sfx: 'chime' }),
          ask('gerri', 'Should I give up, friends?', "No! Let's try again!", { act: { gerri: null }, aops: { del: ['b1', 'b2', 'b3', 'b4'], act: { gerri: 'cheer', thola: 'cheer' } } }),
        ] },
      { name: 'The Neck Dome', bg: 'workshopNight', cast: [G({ x: 470 }), T({ x: 800, act: 'tool' })],
        props: [{ id: 'lan1', type: 'lantern', x: 140, y: 380, layer: 'front' }, { id: 'lan2', type: 'lantern', x: 1500, y: 380, layer: 'front' }, { ...R9, x: 1220, y: 795, s: 0.85 }],
        beats: [
          say('thola', 'A tall, clear dome for your neck!', { part: { thola: { tool: true } } }),
          say('gerri', "A Neck Dome! I'll see stars all around!", { act: { gerri: 'hop' }, then: { act: { gerri: null } } }),
          { add: [Z({ x: 1650, s: 0.7 }), B({ x: 1800, s: 0.85 }), K({ x: 1700, y: 200, act: 'fly' }), { id: 'bowl', type: 'bowl', x: 1700, y: 600, s: 0.8 }, { id: 'lights', type: 'lights', x: 1700, y: 140, s: 0.8, layer: 'front' }],
            to: { zuri: { x: 960, dur: 1.8 }, bongani: { x: 1440, dur: 2 }, kiki: { x: 1040, y: 320, dur: 1.8 }, bowl: { x: 1200, y: 560, dur: 2 }, lights: { x: 1120, y: 140, dur: 2 } }, sfx: 'whoosh', cap: 'Zuri, Kiki and Bongani arrive with a big clear bowl and fairy lights!', w: 2.4 },
          { act: { zuri: 'push', bongani: 'lift', kiki: 'fly', thola: 'tool' }, cap: 'Teamwork!', sfx: ['pop'], w: 1.2 },
          { del: ['rocket', 'bowl'], add: [{ ...R9, x: 1220, y: 795, s: 0.85, dome: true, pop: true }], sfx: 'sparkle', fx: 'stars', w: 1.2 },
          { del: 'rocket', add: [{ ...R9, x: 1220, y: 795, s: 0.85, dome: true, domeFace: true }], to: { gerri: { op: 0, dur: 0.6 } }, cap: 'Gerri lifts her neck into the dome – perfect! Stars all around her head.', w: 2.6 },
          say('thola', 'Sharp sharp!', { act: { thola: 'cheer', zuri: 'cheer', bongani: 'cheer' } }),
        ] },
      { name: 'Sing-along: Try, Try Again', bg: 'launchpadNight', cast: [G({ x: 300, s: 0.75, act: 'dance' }), T({ x: 560, act: 'dance' }), Z({ x: 760, s: 0.6, act: 'dance' }), B({ x: 1420, s: 0.8, act: 'dance' }), K({ x: 1300, y: 260, act: 'fly' })],
        props: [{ ...R9, x: 1080, y: 760, s: 0.85, dome: true, anim: 'gleam' }],
        beats: [{ song: true, fx: (i, e) => {
          const bub = { 2: ['rocket', { h: 300, w: 120, door: 'short' }], 10: ['rocket', { h: 300, w: 100 }] }[i];
          if (bub) e.applyOps({ add: [{ id: 'sb', type: 'bubble', inner: { type: bub[0], ...bub[1], s: 0.4, dy: 70 }, x: 1350, y: 520, s: 0.7, pop: true, layer: 'front' }] });
          if (i === 4 || i === 12) e.applyOps({ del: 'sb', fx: 'stars' });
          if (i === 8) e.applyOps({ sfx: 'bonk' });
        } }] },
      { name: 'Tomorrow is launch day', bg: 'launchpadNight', cast: [G({ x: 470 }), T({ x: 760 })],
        props: [{ ...R9, x: 1150, y: 760, s: 0.85, dome: true, anim: 'gleam' }],
        beats: [
          say('thola', 'Today we learned never to give up!'),
          say('gerri', 'Tomorrow is LAUNCH DAY!', { act: { gerri: 'hop' }, then: { act: { gerri: null } } }),
          ask('gerri', 'Will you count down with me, friends?', 'Yay! Bye!', { aops: { act: { gerri: 'wave', thola: 'wave' } } }),
          { glow: 'rocket', sfx: 'sparkle', w: 2 },
        ] },
    ],
  });

  /* ================= Episode 12 ================= */
  const R12 = { ...R9, dome: true };
  EPISODES.push({
    n: 12, title: 'Blast Off!', goal: 'season finale', runtime: 'about 8 minutes',
    song: song("I'm Reaching for the Stars (Finale)",
      ['We started small, small, small,', 'Then built a rocket big and tall,', 'With shapes and friends and trying again –', "I'm reaching for the stars!"],
      ['Reach, reach, reach for the stars,', 'Up past the Moon and up past Mars!', 'Big or small, we try it all –', "I'm reaching for the stars!"],
      ['Now here I am, way up high,', 'Floating in the starry sky,', 'Dreams come true when you believe –', 'I touched the stars!'], { bpm: 104, key: 60 }),
    yt: { title: 'BLAST OFF! Gerri the Giraffe Goes to Space! | Season Finale', description: "It's launch day! Help Gerri and Thola check the rocket, shout the countdown and blast off into space to see the Earth, the Moon and the stars. Gerri's dream finally comes true!", tags: 'blast off, space for kids, kids cartoon finale, countdown for kids, dreams come true' },
    scenes: [
      intro(),
      { name: 'Launch day', bg: 'sunrise', cast: [G({ x: 470 }), T({ x: 760 }), Z({ x: 120, s: 0.55, flip: 1 }), B({ x: 1500, s: 0.7 }), K({ x: 1400, y: 300, act: 'fly' })],
        props: [{ ...R12, x: 1080, y: 760, s: 0.85 }, ...['#E2563E', '#4FB3E6', '#F7C93A', '#F47EB0', '#7DAA41'].map((c, i) => ({ id: 'bl' + i, type: 'balloon', color: c, x: 860 + i * 110, y: 520 - (i % 2) * 40, layer: 'back' }))],
        beats: [
          { cap: 'Sunrise. Balloons at the launch pad. Friends gather to watch!', w: 2 },
          say('gerri', "It's LAUNCH DAY!", { act: { gerri: 'cheer', zuri: 'bounce', bongani: 'bounce' }, sfx: 'cheer', then: { act: { gerri: null } } }),
        ] },
      { name: 'Rocket check', bg: 'sunrise', cast: [G({ x: 330 }), T({ x: 640 })],
        props: [{ ...R12, x: 1100, y: 760, s: 0.9 }],
        beats: [
          ask('thola', 'Rocket big or small?', 'BIG!', { aops: { add: [{ id: 't1', type: 'tick', x: 1300, y: 200, pop: true, layer: 'front' }], sfx: 'chime' } }),
          ask('thola', 'Door tall or short?', 'TALL!', { aops: { add: [{ id: 't2', type: 'tick', x: 1300, y: 300, pop: true, layer: 'front' }], sfx: 'chime' } }),
          ask('thola', 'Strong legs?', 'TRIANGLES!', { aops: { add: [{ id: 't3', type: 'tick', x: 1300, y: 400, pop: true, layer: 'front' }], sfx: 'chime' } }),
          ask('thola', 'Window?', 'HIGH!', { aops: { add: [{ id: 't4', type: 'tick', x: 1300, y: 500, pop: true, layer: 'front' }], sfx: 'chime' } }),
          say('thola', 'Neck fits the dome?'),
          { s: 'all', t: 'YES!', add: [{ id: 't5', type: 'tick', x: 1300, y: 600, pop: true, layer: 'front' }], sfx: 'chime', glow: 'rocket' },
          say('gerri', 'Packed!', { add: [{ id: 'bag', type: 'bag', x: 470, y: 640, s: 0.6, pop: true }], cap: '(patting her Brave Bag)' }),
        ] },
      { name: 'Brave goodbyes', bg: 'sunrise', cast: [G({ x: 520 }), T({ x: 300, flip: 1 }), Z({ x: 820, s: 0.6 }), B({ x: 1050, s: 0.75 }), K({ x: 1250, s: 1 })],
        beats: [
          { act: { gerri: 'bend' }, add: [{ id: 'h', type: 'heart', x: 820, y: 330, layer: 'fx', pop: true, anim: 'bob' }], cap: 'Gerri hugs her friends with her neck.', w: 2.2 },
          say('gerri', 'A bit worried…', { act: { gerri: 'breathe' }, del: 'h' }),
          { cap: '(breathes in… and out)', w: 2.2 },
          say('gerri', '…but BRAVE!', { act: { gerri: 'cheer' } }),
          say('thola', "I'm coming too!", { cap: '(goggles down)', act: { thola: 'hop' } }),
          { to: { gerri: { op: 0, x: 700, dur: 1 }, thola: { op: 0, x: 700, dur: 1 } }, cap: 'They climb in!', w: 1.2 },
        ] },
      { name: 'Countdown', bg: 'sunrise', cast: [Z({ x: 180, s: 0.6, flip: 1 }), B({ x: 1460, s: 0.75 }), K({ x: 340, s: 0.9, flip: 1 })],
        props: [{ ...R12, x: 820, y: 760, s: 0.9, face: 'both', domeFace: true }],
        beats: [
          say('gerri', 'Stand up, friends! Shout it!'),
          ...['TEN!', 'NINE!', 'EIGHT!', 'SEVEN!', 'SIX!', 'FIVE!', 'FOUR!', 'THREE!', 'TWO!', 'ONE!'].map((c, i) => ({ s: 'all', t: c, del: 'cn' + (11 - i), add: [big('cn' + (10 - i), String(10 - i), 1180, 360, { size: 240 })], sfx: 'tick' })),
          { s: 'all', t: 'BLAST OFF!', del: 'cn1', add: [{ id: 'smoke', type: 'smoke', x: 820, y: 780, s: 0.3, layer: 'front' }], to: { smoke: { s: 1.6, dur: 1.2 } }, sfx: 'blastoff', fx: 'shake' },
          { to: { rocket: { y: -900, dur: 3.2, ez: 'inOut' }, smoke: { op: 0, dur: 3 } }, act: { zuri: 'cheer', bongani: 'cheer', kiki: 'cheer' }, cap: 'Gentle sparkly smoke… the rocket rises… the animals cheer!', fx: 'stars', w: 3.4 },
        ] },
      { name: 'In space!', bg: 'space', cast: [],
        props: [{ ...R12, x: 600, y: 760, s: 0.75, face: 'both', domeFace: true, anim: 'drift' }, { id: 'moon', type: 'moon', phase: 'full', face: true, x: 260, y: 170, r: 70 }],
        beats: [
          { cap: 'Starry space. Earth appears, blue and green.', sfx: 'sparkle', w: 2.2 },
          say('gerri', 'Hello, home! Hello, Mister Moon!', { glow: 'moon' }),
          say('gerri', 'My dream came true!', { fx: 'stars' }),
          say('thola', 'Because we never gave up – together!'),
        ] },
      { name: 'Friends cheer', bg: 'launchpad', cast: [Z({ x: 500, s: 0.75 }), B({ x: 1050, s: 0.9, flip: -1 }), K({ x: 780, y: 520, act: 'fly' })],
        props: [{ id: 'walkie', type: 'walkie', x: 780, y: 760, s: 1.6 }],
        beats: [
          { s: 'all', t: 'HOORAY, Gerri! HOORAY, Thola!', act: { zuri: 'cheer', bongani: 'cheer', kiki: 'cheer' }, fx: 'confetti', sfx: 'cheer' },
          { w: 1 },
        ] },
      { name: "Sing-along: I'm Reaching for the Stars (Finale)", bg: 'space', cast: [G({ x: 470, y: 760, s: 0.7, act: 'float' }), T({ x: 1000, y: 640, act: 'float' })],
        beats: [{ add: [helmet('gerri'), helmet('thola')] }, { song: true, fx: (i, e) => {
          const moments = [['box', {}], ['rocket', { h: 300, w: 120, door: 'short' }], ['shape', { shape: 'triangle', color: '#E04848' }], ['moon', { phase: 'crescent' }], ['planet', { name: 'saturn' }], ['card', { face: 'brave' }], ['sticker', {}], ['rocket', { h: 300, w: 110, dome: true }]];
          const m = moments[i % moments.length];
          const id = 'm' + i;
          e.applyOps({ add: [{ id, type: m[0], ...m[1], x: 1750, y: 120 + (i % 3) * 90, s: 0.5, layer: 'fx' }], to: { [id]: { x: -200, y: 300 + (i % 3) * 60, dur: 3, ez: 'lin' } } });
          setTimeout(() => e.remove(id), 3500);
          if (i === 4 || i === 12) e.applyOps({ fx: 'stars', sfx: 'sparkle' });
        } }] },
      { name: 'See you on Mars!', bg: 'deepspace', cast: [],
        props: [{ id: 'mars', type: 'planet', name: 'mars', x: 1250, y: 330, r: 150, anim: 'pulse' }, { ...R12, x: 520, y: 820, s: 0.65, face: 'both', domeFace: true, anim: 'drift' }],
        beats: [
          { cap: 'A red planet glows…', w: 1.6 },
          ask('thola', 'Which planet, friends?', 'MARS!', { aops: { sfx: 'chime' } }),
          say('gerri', "Let's visit!"),
          say('gerri', 'Never give up on your dreams, friends! See you on Mars!'),
          { to: { rocket: { x: 1250, y: 420, s: 0.15, dur: 2.4, ez: 'inOut' } }, sfx: 'whoosh', w: 2.2 },
          { add: [big('end', 'The End… for now!', 800, 760, { size: 96, color: '#FFE27A', stroke: '#3a2a6a', fadeIn: 1.2, pop: false })], sfx: 'sparkle', fx: 'stars', w: 3.5 },
        ] },
    ],
  });

  window.EPISODES = EPISODES;
})();
