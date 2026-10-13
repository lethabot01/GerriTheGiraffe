#!/usr/bin/env node
/* Writes the list of every spoken line, so the lines can be recorded or generated with an AI voice tool.
 *   node scripts/export-voice-lines.js
 * Output: docs/voice-lines.csv (one row per clip) and docs/voice-lines.md (grouped by character). */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
global.window = global;
require(path.join(root, 'js/characters.js'));
require(path.join(root, 'js/episodes.js'));

const WHO = { all: 'Everyone', both: 'Gerri & Thola' };
const nameOf = s => WHO[s] || (CHARACTERS[s] ? CHARACTERS[s].name : s);
const rows = [];
EPISODES.forEach(ep => ep.scenes.forEach((sc, si) => sc.beats.forEach((b, bi) => {
  if (!b.s || !b.t) return;
  const id = voiceLineId(ep.n, si, bi);
  const base = { episode: ep.n, episodeTitle: ep.title, scene: si, sceneName: sc.name };
  rows.push({ ...base, id, character: nameOf(b.s), text: b.t, note: [b.cap, b.q ? 'question to the children, then a pause' : ''].filter(Boolean).join('; ') });
  if (b.q && b.a) rows.push({ ...base, id: id + '-a', character: nameOf(b.ab || b.s), text: b.a, note: 'answer, after the pause' });
})));

const file = r => `ep${String(r.episode).padStart(2, '0')}/${r.id}.mp3`;
const csv = v => `"${String(v).replace(/"/g, '""')}"`;
fs.writeFileSync(path.join(root, 'docs/voice-lines.csv'),
  ['file,character,text,note,episode,scene'].concat(rows.map(r => [file(r), r.character, r.text, r.note, `${r.episode} ${r.episodeTitle}`, `${r.scene} ${r.sceneName}`].map(csv).join(','))).join('\n') + '\n');

const chars = [...new Set(rows.map(r => r.character))];
let md = `# Voice lines\n\n${rows.length} lines to record. Save each line as the file shown, inside \`assets/voices/\`,\n` +
  `then run \`node scripts/build-voice-manifest.js\`. Any line without a file keeps using the browser voice.\n\n` +
  `"Thola" is pronounced **Tola**. Lines from Everyone are shouted together by the cast.\n`;
chars.forEach(c => {
  const mine = rows.filter(r => r.character === c);
  md += `\n## ${c} (${mine.length} lines)\n\n| File | Line | Note |\n|---|---|---|\n`;
  mine.forEach(r => (md += `| \`${file(r)}\` | ${r.text.replace(/\|/g, '\\|')} | ${r.note.replace(/\|/g, '\\|')} |\n`));
});
fs.writeFileSync(path.join(root, 'docs/voice-lines.md'), md);
console.log(`Wrote ${rows.length} lines for ${chars.length} speakers to docs/voice-lines.csv and docs/voice-lines.md`);
