# Gerri's Space Dream

An animated preschool cartoon series (ages 3–6) built from the *Season 1 Scripts and Sing-Alongs* document.
All 12 episodes play in the browser: animated characters, voiced dialogue, "your turn" pauses for
children at home, and a karaoke sing-along with original music in every episode.

## Watch it

Open `index.html` in a browser, or serve the folder:

```sh
npx http-server .   # then open http://localhost:8080
```

Press **Play** on the stage, or pick an episode from the guide. Keyboard: `Space` play/pause,
`←` `→` change scene, `F` full screen. Each episode can be linked directly with `#ep1` … `#ep12`.

| Toggle   | What it does |
|----------|--------------|
| Voices   | Characters speak using the browser's built-in speech voices (they sound different on each device). Off = captions-only timing. |
| Music    | The recorded theme song, the sing-along music and sound effects. The episode sing-alongs and effects are synthesized with Web Audio. |
| Captions | Shows every spoken line. Questions, answers and stage directions stay visible either way. |

## Season 1

| # | Episode | Learning goal | Sing-along |
|---|---------|---------------|------------|
| 1 | Gerri Looks Up | big and small | I'm Reaching for the Stars |
| 2 | The Door's Too Short! | tall and short | How Tall Is Gerri? |
| 3 | Shapes Make a Spaceship | shapes | Circle, Square and Triangle |
| 4 | The Window Problem | high and low | Look Up High, Look Down Low |
| 5 | Countdown Practice | counting back from 10 | 10, 9, 8... Blast Off! |
| 6 | Meet the Moon | Moon shapes | Hello, Mister Moon |
| 7 | Gerri Feels Worried | feelings, being brave | Brave Like Me |
| 8 | The Planet Parade | 8 planets | Planet Parade |
| 9 | Thola Needs Help | teamwork | Many Hands |
| 10 | Astronaut Training | move along | Astro Exercise |
| 11 | One Last Problem | never give up | Try, Try Again |
| 12 | Blast Off! | season finale | I'm Reaching for the Stars (Finale) |

Every episode follows the script's structure: theme song intro → title card → story scenes →
sing-along → goodnight. Lines marked *(pause)* in the script become a 3-second **Your turn!**
countdown before the answer is said. The YouTube title, description and tags for each episode
are shown under the player with a copy button.

## Project layout

```
index.html            page shell: player, episode guide, cast
css/style.css         styles
js/characters.js      SVG puppets: Gerri, Thola, Bongani, Kiki, Zuri (with talking mouths, blinking, posable parts)
js/scenery.js         backgrounds (savannah, workshop, night, space…) and props (rocket stages, blocks, shapes, moon phases, planets…)
js/audio.js           Web Audio music generator, sound effects, character voices
js/engine.js          timeline engine: scenes, beats, tweens, actions, captions, pauses, karaoke
js/episodes.js        all 12 episodes as scene/beat data
assets/cast/          the original character artwork
assets/audio/         the recorded theme song ("Gerri's adventure"), played at the start of every episode
docs/                 the source scripts (.docx and a Markdown copy)
```

### Editing an episode

Episodes live in `js/episodes.js`. A scene sets a background, a cast and props, then plays beats:

```js
{ name: 'Big or small?', bg: 'workshop', cast: [G({ x: 470 }), T({ x: 1240 })],
  beats: [
    say('gerri', "Hi friends! I'm Gerri!", { act: { gerri: 'wave' } }),
    ask('thola', 'Is Gerri big or small?', 'Big!'),        // pause for the viewer, then the answer
    { cap: 'Thola draws a bigger rocket.', w: 2 },          // stage direction caption, wait 2 s
    { add: [{ id: 'box', type: 'box', x: 900, y: 795, pop: true }], sfx: 'pop' },
  ] }
```

Actions (`act`): `wave`, `hop`, `bounce`, `dance`, `cheer`, `march`, `lookup`, `up`, `down`, `bend`,
`stretch`, `jump`, `float`, `balance`, `tumble`, `push`, `wobble`, `sad`, `sleep`, `breathe`, `lift`, `fly`, `tool`.
The stage is 1600 × 900 with the ground at about `y = 795`.

### Sing-along cues

Every sing-along counts in on the beat ("3, 2, 1, Sing!"), shows a bouncing star over the word being
sung, a progress bar for the current line, a "next" hint just before the next line, and a banner at each
new section ("Chorus · everybody sing!", "Last chorus · sing it LOUD!"). Each song also has action
prompts tied to its lyrics (for example "Reach up!" or "Crouch down…"). Edit them in the `cues` option
of each `song(...)` in `js/episodes.js`, keyed by line number (counting from 0, chorus lines included).

The words, cues and the characters' mouths all follow the music's own audio clock, so they stay in time
after pausing. In the episode sing-alongs, a synthesized singing voice sings each syllable's vowel in
time with the highlighted words.

### Theme song timing

The intro plays `assets/audio/theme-gerris-adventure.mp3`. The karaoke highlights each word in time
with the recording, using the line timings in `THEME_SONG.timing` (`js/episodes.js`). The timings were
estimated from the vocals. If the words run ahead of or behind the singing, adjust the `start` and `end`
seconds there. After the four lines, the outro shows the whole verse as a "Sing along!" card.
