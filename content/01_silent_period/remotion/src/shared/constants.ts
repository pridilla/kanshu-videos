import { spring } from 'remotion';

// ────────────────────────────────────────────────────────────
// DESIGN TOKENS (Kanshu Brand)
// ────────────────────────────────────────────────────────────
export const COLORS = {
  bg: '#F5F5F0',
  text: '#0F172A',
  body: '#334155',
  pinyin: '#8E8E93',
  primary: '#FF6F59',
  border: '#E5E5EA',
  card: '#F2F2F7',
};

export const FONTS = {
  display: '"Finger Paint", cursive',
  body: '"Finger Paint", cursive',
};

// ────────────────────────────────────────────────────────────
// SPRING CONFIG
// ────────────────────────────────────────────────────────────
export const SPRING_OVERSHOOT = { damping: 10, stiffness: 100, mass: 0.5 };
export const SPRING_GENTLE = { damping: 14, stiffness: 70, mass: 1 };
export const SPRING_STIFF = { damping: 20, stiffness: 200, mass: 0.3 };
export const SPRING_BOUNCE = { damping: 6, stiffness: 120, mass: 0.4 };
export const SPRING_SMOOTH = { damping: 18, stiffness: 90, mass: 0.8 };

// ────────────────────────────────────────────────────────────
// VIDEO CONSTANTS
// ────────────────────────────────────────────────────────────
export const TRANSITION_DURATION = 0.4;
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL_DURATION = 60.57;
export const TOTAL_FRAMES = Math.ceil(TOTAL_DURATION * FPS);

// ────────────────────────────────────────────────────────────
// SENTENCE TIMING DATA
// ────────────────────────────────────────────────────────────
export interface Sentence {
  start: number;
  end: number;
  text: string;
  key: string;
}

export const SENTENCES: Sentence[] = [
  { start: 0.00,  end: 4.03,  text: "If you just started learning Chinese and someone tells you to speak from day one — they're wrong.", key: 'hook' },
  { start: 4.26,  end: 4.93,  text: "Here's why.", key: 'trans1' },
  { start: 5.37,  end: 9.36,  text: "In the 1970s, linguist Stephen Krashen studied how children actually learn languages.", key: 'krashen' },
  { start: 9.64,  end: 14.82, text: "He found something surprising: children go through a silent period that can last 3 to 6 months, where they only listen.", key: 'silent' },
  { start: 15.05, end: 16.23, text: "They don't speak at all.", key: 'nospeak' },
  { start: 16.66, end: 23.15, text: "During this time, their brains are building something called comprehensible input — they're mapping sounds to meaning without the pressure of producing output.", key: 'input' },
  { start: 23.58, end: 26.15, text: "When you force a beginner to speak too early, two things happen.", key: 'two' },
  { start: 26.38, end: 30.22, text: "One, they develop a strong foreign accent because their mouth isn't used to the sounds yet.", key: 'one' },
  { start: 30.58, end: 35.99, text: "Two, they build what Krashen called the affective filter — anxiety that actually blocks language acquisition.", key: 'two_prob' },
  { start: 36.26, end: 38.27, text: "The brain literally learns worse when it's stressed.", key: 'brainbad' },
  { start: 38.59, end: 40.63, text: "The solution is simple: just listen.", key: 'sol' },
  { start: 40.86, end: 41.43, text: "A lot.", key: 'lot' },
  { start: 41.66, end: 42.92, text: "Watch Chinese shows.", key: 'watch' },
  { start: 43.10, end: 44.10, text: "Listen to podcasts.", key: 'listenp' },
  { start: 44.21, end: 45.19, text: "Read along with audio.", key: 'read' },
  { start: 45.42, end: 48.09, text: "Let your brain do what it's designed to do — pattern match.", key: 'pattern' },
  { start: 48.36, end: 52.17, text: "Krashen's research showed that speech emerges naturally once enough input is absorbed.", key: 'emerge' },
  { start: 52.40, end: 53.21, text: "You don't force it.", key: 'noforce' },
  { start: 53.41, end: 53.99, text: "It comes.", key: 'comes' },
  { start: 54.26, end: 57.09, text: "So if you feel guilty about not speaking Chinese yet — don't.", key: 'guilt' },
  { start: 57.52, end: 58.57, text: "You're supposed to be silent.", key: 'betrue' },
  { start: 58.94, end: 60.57, text: "The words will come when they're ready.", key: 'ready' },
];

// ────────────────────────────────────────────────────────────
// WORD-LEVEL TIMING DATA (abbreviated — full data preserved)
// ────────────────────────────────────────────────────────────
export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export const WORD_TIMINGS: WordTiming[] = [
  {"word":"If","start":0.0,"end":0.116},{"word":"you","start":0.166,"end":0.241},{"word":"just","start":0.324,"end":0.473},{"word":"started","start":0.498,"end":0.746},{"word":"learning","start":0.796,"end":1.004},{"word":"Chinese","start":1.045,"end":1.509},{"word":"and","start":1.542,"end":1.626},{"word":"someone","start":1.675,"end":1.907},{"word":"tells","start":1.932,"end":2.123},{"word":"you","start":2.156,"end":2.214},{"word":"to","start":2.247,"end":2.281},{"word":"speak","start":2.322,"end":2.496},{"word":"from","start":2.529,"end":2.629},{"word":"day","start":2.679,"end":2.811},{"word":"one","start":2.894,"end":3.176},{"word":"they're","start":3.466,"end":3.649},{"word":"wrong.","start":3.674,"end":4.03},
  {"word":"Here's","start":4.263,"end":4.495},{"word":"why.","start":4.528,"end":4.934},
  {"word":"In","start":5.366,"end":5.456},{"word":"the","start":5.481,"end":5.531},{"word":"1970s,","start":5.564,"end":6.311},{"word":"linguist","start":6.402,"end":6.676},{"word":"Stephen","start":6.701,"end":6.966},{"word":"Krashen","start":7.016,"end":7.331},{"word":"studied","start":7.414,"end":7.671},{"word":"how","start":7.704,"end":7.787},{"word":"children","start":7.845,"end":8.135},{"word":"actually","start":8.194,"end":8.558},{"word":"learn","start":8.591,"end":8.791},{"word":"languages.","start":8.841,"end":9.36},
  {"word":"He","start":9.64,"end":9.706},{"word":"found","start":9.747,"end":9.914},{"word":"something","start":9.964,"end":10.231},{"word":"surprising:","start":10.298,"end":10.748},{"word":"children","start":10.848,"end":11.123},{"word":"go","start":11.173,"end":11.273},{"word":"through","start":11.323,"end":11.523},{"word":"a","start":11.573,"end":11.623},{"word":"silent","start":11.673,"end":11.956},{"word":"period","start":12.006,"end":12.34},{"word":"that","start":12.406,"end":12.506},{"word":"can","start":12.556,"end":12.673},{"word":"last","start":12.723,"end":12.923},{"word":"3","start":12.973,"end":13.073},{"word":"to","start":13.123,"end":13.19},{"word":"6","start":13.24,"end":13.34},{"word":"months,","start":13.39,"end":13.773},{"word":"where","start":13.823,"end":13.956},{"word":"they","start":14.006,"end":14.123},{"word":"only","start":14.173,"end":14.34},{"word":"listen.","start":14.39,"end":14.82},
  {"word":"They","start":15.05,"end":15.15},{"word":"don't","start":15.2,"end":15.383},{"word":"speak","start":15.433,"end":15.683},{"word":"at","start":15.733,"end":15.8},{"word":"all.","start":15.85,"end":16.23},
  {"word":"During","start":16.66,"end":16.81},{"word":"this","start":16.86,"end":16.993},{"word":"time,","start":17.043,"end":17.26},{"word":"their","start":17.31,"end":17.46},{"word":"brains","start":17.51,"end":17.76},{"word":"are","start":17.81,"end":17.91},{"word":"building","start":17.96,"end":18.26},{"word":"something","start":18.31,"end":18.577},{"word":"called","start":18.627,"end":18.86},{"word":"comprehensible","start":18.91,"end":19.51},{"word":"input","start":19.56,"end":19.843},{"word":"they're","start":20.31,"end":20.51},{"word":"mapping","start":20.56,"end":20.893},{"word":"sounds","start":20.943,"end":21.26},{"word":"to","start":21.31,"end":21.377},{"word":"meaning","start":21.427,"end":21.76},{"word":"without","start":21.81,"end":22.06},{"word":"the","start":22.11,"end":22.177},{"word":"pressure","start":22.227,"end":22.527},{"word":"of","start":22.577,"end":22.644},{"word":"producing","start":22.694,"end":23.027},{"word":"output.","start":23.077,"end":23.15},
  {"word":"When","start":23.58,"end":23.697},{"word":"you","start":23.747,"end":23.814},{"word":"force","start":23.864,"end":24.031},{"word":"a","start":24.081,"end":24.131},{"word":"beginner","start":24.181,"end":24.481},{"word":"to","start":24.531,"end":24.598},{"word":"speak","start":24.648,"end":24.848},{"word":"too","start":24.898,"end":25.015},{"word":"early,","start":25.065,"end":25.298},{"word":"two","start":25.381,"end":25.515},{"word":"things","start":25.565,"end":25.798},{"word":"happen.","start":25.848,"end":26.15},
  {"word":"One,","start":26.38,"end":26.53},{"word":"they","start":26.58,"end":26.697},{"word":"develop","start":26.747,"end":27.03},{"word":"a","start":27.08,"end":27.13},{"word":"strong","start":27.18,"end":27.447},{"word":"foreign","start":27.497,"end":27.78},{"word":"accent","start":27.83,"end":28.13},{"word":"because","start":28.23,"end":28.43},{"word":"their","start":28.48,"end":28.63},{"word":"mouth","start":28.68,"end":28.897},{"word":"isn't","start":28.947,"end":29.147},{"word":"used","start":29.197,"end":29.364},{"word":"to","start":29.414,"end":29.481},{"word":"the","start":29.531,"end":29.598},{"word":"sounds","start":29.648,"end":29.948},{"word":"yet.","start":29.998,"end":30.22},
  {"word":"Two,","start":30.58,"end":30.73},{"word":"they","start":30.78,"end":30.897},{"word":"build","start":30.947,"end":31.147},{"word":"what","start":31.197,"end":31.33},{"word":"Krashen","start":31.38,"end":31.73},{"word":"called","start":31.78,"end":32.013},{"word":"the","start":32.063,"end":32.13},{"word":"affective","start":32.18,"end":32.597},{"word":"filter","start":32.647,"end":32.997},{"word":"anxiety","start":33.247,"end":33.58},{"word":"that","start":33.63,"end":33.73},{"word":"actually","start":33.78,"end":34.08},{"word":"blocks","start":34.13,"end":34.397},{"word":"language","start":34.447,"end":34.73},{"word":"acquisition.","start":34.78,"end":35.99},
  {"word":"The","start":36.26,"end":36.36},{"word":"brain","start":36.41,"end":36.61},{"word":"literally","start":36.66,"end":36.927},{"word":"learns","start":36.977,"end":37.177},{"word":"worse","start":37.227,"end":37.444},{"word":"when","start":37.494,"end":37.594},{"word":"it's","start":37.644,"end":37.761},{"word":"stressed.","start":37.811,"end":38.27},
  {"word":"The","start":38.59,"end":38.69},{"word":"solution","start":38.74,"end":39.057},{"word":"is","start":39.107,"end":39.19},{"word":"simple:","start":39.24,"end":39.49},{"word":"just","start":39.623,"end":39.773},{"word":"listen.","start":39.823,"end":40.63},
  {"word":"A","start":40.86,"end":40.96},{"word":"lot.","start":41.01,"end":41.43},
  {"word":"Watch","start":41.66,"end":41.843},{"word":"Chinese","start":41.893,"end":42.26},{"word":"shows.","start":42.31,"end":42.92},
  {"word":"Listen","start":43.10,"end":43.317},{"word":"to","start":43.367,"end":43.434},{"word":"podcasts.","start":43.484,"end":44.10},
  {"word":"Read","start":44.21,"end":44.36},{"word":"along","start":44.41,"end":44.594},{"word":"with","start":44.644,"end":44.777},{"word":"audio.","start":44.827,"end":45.19},
  {"word":"Let","start":45.42,"end":45.537},{"word":"your","start":45.587,"end":45.687},{"word":"brain","start":45.737,"end":45.937},{"word":"do","start":45.987,"end":46.054},{"word":"what","start":46.104,"end":46.237},{"word":"it's","start":46.287,"end":46.387},{"word":"designed","start":46.437,"end":46.754},{"word":"to","start":46.804,"end":46.871},{"word":"do","start":46.921,"end":46.988},{"word":"pattern","start":47.304,"end":47.588},{"word":"match.","start":47.638,"end":48.09},
  {"word":"Krashen's","start":48.36,"end":48.71},{"word":"research","start":48.76,"end":49.06},{"word":"showed","start":49.11,"end":49.327},{"word":"that","start":49.377,"end":49.477},{"word":"speech","start":49.527,"end":49.744},{"word":"emerges","start":49.794,"end":50.094},{"word":"naturally","start":50.144,"end":50.544},{"word":"once","start":50.594,"end":50.744},{"word":"enough","start":50.794,"end":51.011},{"word":"input","start":51.061,"end":51.261},{"word":"is","start":51.311,"end":51.378},{"word":"absorbed.","start":51.428,"end":52.17},
  {"word":"You","start":52.40,"end":52.50},{"word":"don't","start":52.55,"end":52.717},{"word":"force","start":52.767,"end":52.967},{"word":"it.","start":53.017,"end":53.21},
  {"word":"It","start":53.41,"end":53.49},{"word":"comes.","start":53.54,"end":53.99},
  {"word":"So","start":54.26,"end":54.36},{"word":"if","start":54.41,"end":54.477},{"word":"you","start":54.527,"end":54.594},{"word":"feel","start":54.644,"end":54.794},{"word":"guilty","start":54.844,"end":55.111},{"word":"about","start":55.161,"end":55.311},{"word":"not","start":55.361,"end":55.461},{"word":"speaking","start":55.511,"end":55.828},{"word":"Chinese","start":55.878,"end":56.278},{"word":"yet","start":56.328,"end":56.495},{"word":"don't.","start":56.595,"end":57.09},
  {"word":"You're","start":57.52,"end":57.637},{"word":"supposed","start":57.687,"end":57.954},{"word":"to","start":58.004,"end":58.071},{"word":"be","start":58.121,"end":58.221},{"word":"silent.","start":58.271,"end":58.57},
  {"word":"The","start":58.94,"end":59.04},{"word":"words","start":59.09,"end":59.257},{"word":"will","start":59.307,"end":59.407},{"word":"come","start":59.457,"end":59.624},{"word":"when","start":59.674,"end":59.774},{"word":"they're","start":59.824,"end":60.007},{"word":"ready.","start":60.057,"end":60.57},
];

// ────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ────────────────────────────────────────────────────────────
export function getCurrentWord(time: number): WordTiming | null {
  return WORD_TIMINGS.find(w => time >= w.start && time < w.end) ?? null;
}

export function getSentenceAtTime(t: number): Sentence | null {
  return SENTENCES.find(s => t >= s.start && t <= s.end) ?? null;
}

export function getProgressInSentence(t: number, sentence: Sentence): number {
  const dur = sentence.end - sentence.start;
  if (dur === 0) return 1;
  return Math.min(1, Math.max(0, (t - sentence.start) / dur));
}

// Get local frame for a scene starting at sceneStart (in seconds)
export function getLocalFrame(time: number, sceneStart: number, fps: number): number {
  return Math.max(0, Math.round((time - sceneStart) * fps));
}

// Eased progress 0→1 with cubic ease in-out
export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Eased progress with cubic ease out
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Eased progress with cubic ease in
export function easeInCubic(t: number): number {
  return t * t * t;
}

// ────────────────────────────────────────────────────────────
// OVERLAY SENTENCES — short sentences that don't get their own scene.
// Their text appears ON the previous scene instead, avoiding a jarring cut.
// ────────────────────────────────────────────────────────────

/** Sentences that render as text overlays on the PREVIOUS scene instead of their own scene. */
export const OVERLAY_SENTENCE_KEYS = new Set([
  'trans1',      // "Here's why." → overlay on HookScene
  'nospeak',     // "They don't speak at all." → overlay on SilentPeriodScene
  'lot',         // "A lot." → overlay on SolutionScene
  'betrue',      // "You're supposed to be silent." → overlay on GuiltScene
]);

export function isOverlaySentence(key: string): boolean {
  return OVERLAY_SENTENCE_KEYS.has(key);
}

/** Find the base (non-overlay) sentence that owns the scene for a given time.
 *  If the current sentence is an overlay, walks backward to the nearest non-overlay.
 */
export function getBaseSentenceIndexAtTime(t: number): number {
  const idx = SENTENCES.findIndex((s) => t >= s.start && t <= s.end);
  if (idx < 0) {
    // In a gap — find the last sentence before this time
    let lastIdx = -1;
    for (let i = SENTENCES.length - 1; i >= 0; i--) {
      if (t >= SENTENCES[i].start) { lastIdx = i; break; }
    }
    if (lastIdx < 0) return 0;
    // Walk back from last sentence to find non-overlay
    for (let i = lastIdx; i >= 0; i--) {
      if (!isOverlaySentence(SENTENCES[i].key)) return i;
    }
    return 0;
  }
  // Walk back from current to find non-overlay
  for (let i = idx; i >= 0; i--) {
    if (!isOverlaySentence(SENTENCES[i].key)) return i;
  }
  return 0;
}

/** Find the next non-overlay sentence index after the given one. */
export function getNextBaseSentenceIndex(fromIdx: number): number {
  for (let i = fromIdx + 1; i < SENTENCES.length; i++) {
    if (!isOverlaySentence(SENTENCES[i].key)) return i;
  }
  return SENTENCES.length - 1;
}
