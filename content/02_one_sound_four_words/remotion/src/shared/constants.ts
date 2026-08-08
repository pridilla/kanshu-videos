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
  pinyin: '"Inter", "Noto Sans SC", sans-serif',
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
export const TOTAL_DURATION = 61.01;
export const TOTAL_FRAMES = Math.ceil(TOTAL_DURATION * FPS);

// ────────────────────────────────────────────────────────────
// SENTENCE TIMING DATA (real ElevenLabs v3 API — no scaling)
// ────────────────────────────────────────────────────────────
export interface Sentence {
  start: number;
  end: number;
  text: string;
  key: string;
}

export const SENTENCES: Sentence[] = [
  { start: 0.000, end: 1.068, text: "Okay so.", key: 'open' },
  { start: 1.219, end: 4.621, text: "Chinese does something that just melts English speakers' brains.", key: 'hook' },
  { start: 4.899, end: 5.770, text: "Same sound.", key: 'setup1' },
  { start: 5.979, end: 8.336, text: "Four completely different words.", key: 'setup2' },
  { start: 8.580, end: 10.809, text: "The only thing that changes is your pitch.", key: 'setup3' },
  { start: 11.088, end: 14.420, text: "Your voice goes up, down, flat, sharp drop —", key: 'setup4' },
  { start: 14.594, end: 17.403, text: "and suddenly you're saying something else entirely.", key: 'setup5' },
  { start: 17.612, end: 20.700, text: "The example everyone uses. The sound is ma.", key: 'setup7' },
  { start: 20.944, end: 21.664, text: "First tone.", key: 't1' },
  { start: 21.989, end: 23.405, text: "Keep it high and flat.", key: 't1d1' },
  { start: 23.649, end: 24.543, text: "Like you're singing.", key: 't1d2' },
  { start: 25.054, end: 25.588, text: "mā.", key: 't1pinyin' },
  { start: 25.716, end: 26.168, text: "Mother.", key: 't1word' },
  { start: 26.285, end: 26.958, text: "Second tone.", key: 't2' },
  { start: 27.132, end: 28.827, text: "Start low, rise up.", key: 't2d1' },
  { start: 28.920, end: 30.325, text: "Like you're surprised.", key: 't2d2' },
  { start: 30.650, end: 31.172, text: "má.", key: 't2pinyin' },
  { start: 31.242, end: 31.753, text: "Hemp.", key: 't2word' },
  { start: 31.881, end: 32.624, text: "Third tone.", key: 't3' },
  { start: 32.833, end: 34.539, text: "Dip down, come back up.", key: 't3d1' },
  { start: 34.655, end: 36.095, text: "Like you're really thinking about it.", key: 't3d2' },
  { start: 36.908, end: 37.279, text: "mǎ.", key: 't3pinyin' },
  { start: 37.523, end: 38.011, text: "Horse.", key: 't3word' },
  { start: 38.185, end: 38.812, text: "Fourth tone.", key: 't4' },
  { start: 38.986, end: 39.729, text: "Drop it hard.", key: 't4d1' },
  { start: 39.903, end: 41.424, text: "Like you're telling someone to stop.", key: 't4d2' },
  { start: 42.028, end: 42.457, text: "mà.", key: 't4pinyin' },
  { start: 42.608, end: 43.200, text: "Scold.", key: 't4word' },
  { start: 43.409, end: 44.210, text: "Same sound.", key: 'sum1' },
  { start: 44.594, end: 45.267, text: "Four words.", key: 'sum2' },
  { start: 45.476, end: 46.985, text: "Wrong pitch, wrong word.", key: 'sum3' },
  { start: 47.496, end: 48.378, text: "That's the whole thing.", key: 'sum4' },
  { start: 48.553, end: 50.224, text: "Every learner gets caught by this.", key: 'wall1' },
  { start: 50.665, end: 53.219, text: "You can know the character cold and still mess it up.", key: 'wall2' },
  { start: 53.463, end: 55.286, text: "Just because your voice went up instead of down.", key: 'wall3' },
  { start: 55.495, end: 56.900, text: "That's how Chinese tones work.", key: 'cta1' },
  { start: 57.178, end: 60.510, text: "Follow kanshu.app to learn more about the language.", key: 'cta2' }
];

// ────────────────────────────────────────────────────────────
// WORD-LEVEL TIMING DATA (real ElevenLabs v3 API)
// ────────────────────────────────────────────────────────────
export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export const WORD_TIMINGS: WordTiming[] = [
  {"word":"Okay","start":0.000,"end":0.464},
  {"word":"so.","start":0.580,"end":1.068},
  {"word":"Chinese","start":1.219,"end":1.614},
  {"word":"does","start":1.637,"end":1.776},
  {"word":"something","start":1.800,"end":2.113},
  {"word":"that","start":2.159,"end":2.287},
  {"word":"just","start":2.345,"end":2.589},
  {"word":"melts","start":2.670,"end":2.995},
  {"word":"English","start":3.088,"end":3.390},
  {"word":"speakers'","start":3.425,"end":3.808},
  {"word":"brains.","start":3.843,"end":4.621},
  {"word":"Same","start":4.899,"end":5.213},
  {"word":"sound.","start":5.259,"end":5.770},
  {"word":"Four","start":5.979,"end":6.351},
  {"word":"completely","start":6.502,"end":7.117},
  {"word":"different","start":7.291,"end":7.651},
  {"word":"words.","start":7.686,"end":8.336},
  {"word":"The","start":8.580,"end":8.707},
  {"word":"only","start":8.754,"end":8.916},
  {"word":"thing","start":8.940,"end":9.067},
  {"word":"that","start":9.102,"end":9.207},
  {"word":"changes","start":9.242,"end":9.776},
  {"word":"is","start":9.892,"end":10.124},
  {"word":"your","start":10.205,"end":10.333},
  {"word":"pitch.","start":10.379,"end":10.809},
  {"word":"Your","start":11.088,"end":11.250},
  {"word":"voice","start":11.297,"end":11.529},
  {"word":"goes","start":11.575,"end":11.761},
  {"word":"up,","start":11.831,"end":12.144},
  {"word":"down,","start":12.260,"end":12.748},
  {"word":"flat,","start":12.829,"end":13.398},
  {"word":"sharp","start":13.479,"end":13.758},
  {"word":"drop","start":13.816,"end":14.129},
  {"word":"—","start":14.373,"end":14.420},
  {"word":"and","start":14.594,"end":14.745},
  {"word":"suddenly","start":14.779,"end":15.139},
  {"word":"you're","start":15.221,"end":15.406},
  {"word":"saying","start":15.429,"end":15.627},
  {"word":"something","start":15.673,"end":15.928},
  {"word":"else","start":15.987,"end":16.474},
  {"word":"entirely.","start":16.532,"end":17.403},
  {"word":"The","start":17.612,"end":17.740},
  {"word":"example","start":17.774,"end":18.134},
  {"word":"everyone","start":18.181,"end":18.483},
  {"word":"uses.","start":18.529,"end":19.086},
  {"word":"The","start":19.330,"end":19.446},
  {"word":"sound","start":19.504,"end":19.806},
  {"word":"is","start":19.876,"end":20.027},
  {"word":"ma.","start":20.143,"end":20.700},
  {"word":"First","start":20.944,"end":21.199},
  {"word":"tone.","start":21.234,"end":21.664},
  {"word":"Keep","start":21.989,"end":22.163},
  {"word":"it","start":22.209,"end":22.268},
  {"word":"high","start":22.291,"end":22.546},
  {"word":"and","start":22.616,"end":22.848},
  {"word":"flat.","start":22.906,"end":23.405},
  {"word":"Like","start":23.649,"end":23.858},
  {"word":"you're","start":23.893,"end":24.032},
  {"word":"singing.","start":24.055,"end":24.543},
  {"word":"ma.","start":25.054,"end":25.588},
  {"word":"Mother.","start":25.716,"end":26.168},
  {"word":"Second","start":26.285,"end":26.552},
  {"word":"tone.","start":26.586,"end":26.958},
  {"word":"Start","start":27.132,"end":27.434},
  {"word":"low,","start":27.492,"end":28.003},
  {"word":"rise","start":28.096,"end":28.386},
  {"word":"up.","start":28.432,"end":28.827},
  {"word":"Like","start":28.920,"end":29.210},
  {"word":"you're","start":29.268,"end":29.454},
  {"word":"surprised.","start":29.489,"end":30.325},
  {"word":"ma.","start":30.650,"end":31.172},
  {"word":"Hemp.","start":31.242,"end":31.753},
  {"word":"Third","start":31.881,"end":32.136},
  {"word":"tone.","start":32.171,"end":32.624},
  {"word":"Dip","start":32.833,"end":33.042},
  {"word":"down,","start":33.088,"end":33.645},
  {"word":"come","start":33.761,"end":33.936},
  {"word":"back","start":33.959,"end":34.133},
  {"word":"up.","start":34.214,"end":34.539},
  {"word":"Like","start":34.655,"end":34.853},
  {"word":"you're","start":34.876,"end":35.039},
  {"word":"really","start":35.062,"end":35.271},
  {"word":"thinking","start":35.317,"end":35.607},
  {"word":"about","start":35.654,"end":35.851},
  {"word":"it.","start":35.898,"end":36.095},
  {"word":"ma.","start":36.908,"end":37.279},
  {"word":"Horse.","start":37.523,"end":38.011},
  {"word":"Fourth","start":38.185,"end":38.440},
  {"word":"tone.","start":38.487,"end":38.812},
  {"word":"Drop","start":38.986,"end":39.218},
  {"word":"it","start":39.265,"end":39.323},
  {"word":"hard.","start":39.346,"end":39.729},
  {"word":"Like","start":39.903,"end":40.135},
  {"word":"you're","start":40.170,"end":40.333},
  {"word":"telling","start":40.356,"end":40.577},
  {"word":"someone","start":40.611,"end":40.844},
  {"word":"to","start":40.867,"end":40.925},
  {"word":"stop.","start":40.960,"end":41.424},
  {"word":"ma.","start":42.028,"end":42.457},
  {"word":"Scold.","start":42.608,"end":43.200},
  {"word":"Same","start":43.409,"end":43.688},
  {"word":"sound.","start":43.723,"end":44.210},
  {"word":"Four","start":44.594,"end":44.791},
  {"word":"words.","start":44.837,"end":45.267},
  {"word":"Wrong","start":45.476,"end":45.743},
  {"word":"pitch,","start":45.801,"end":46.173},
  {"word":"wrong","start":46.289,"end":46.532},
  {"word":"word.","start":46.590,"end":46.985},
  {"word":"That's","start":47.496,"end":47.740},
  {"word":"the","start":47.775,"end":47.844},
  {"word":"whole","start":47.868,"end":48.007},
  {"word":"thing.","start":48.030,"end":48.378},
  {"word":"Every","start":48.553,"end":48.842},
  {"word":"learner","start":48.889,"end":49.179},
  {"word":"gets","start":49.249,"end":49.388},
  {"word":"caught","start":49.435,"end":49.620},
  {"word":"by","start":49.655,"end":49.736},
  {"word":"this.","start":49.783,"end":50.224},
  {"word":"You","start":50.665,"end":50.781},
  {"word":"can","start":50.828,"end":50.967},
  {"word":"know","start":51.048,"end":51.188},
  {"word":"the","start":51.246,"end":51.315},
  {"word":"character","start":51.350,"end":51.640},
  {"word":"cold","start":51.698,"end":52.035},
  {"word":"and","start":52.116,"end":52.349},
  {"word":"still","start":52.430,"end":52.639},
  {"word":"mess","start":52.685,"end":52.825},
  {"word":"it","start":52.859,"end":52.906},
  {"word":"up.","start":52.952,"end":53.219},
  {"word":"Just","start":53.463,"end":53.649},
  {"word":"because","start":53.684,"end":53.881},
  {"word":"your","start":53.904,"end":54.009},
  {"word":"voice","start":54.044,"end":54.253},
  {"word":"went","start":54.276,"end":54.392},
  {"word":"up","start":54.427,"end":54.496},
  {"word":"instead","start":54.555,"end":54.764},
  {"word":"of","start":54.798,"end":54.845},
  {"word":"down.","start":54.891,"end":55.286},
  {"word":"That's","start":55.495,"end":55.739},
  {"word":"how","start":55.774,"end":55.878},
  {"word":"Chinese","start":55.959,"end":56.273},
  {"word":"tones","start":56.296,"end":56.505},
  {"word":"work.","start":56.540,"end":56.900},
  {"word":"Follow","start":57.178,"end":57.457},
  {"word":"kanshu.app","start":57.515,"end":58.618},
  {"word":"to","start":58.827,"end":58.955},
  {"word":"learn","start":59.024,"end":59.210},
  {"word":"more","start":59.257,"end":59.408},
  {"word":"about","start":59.431,"end":59.593},
  {"word":"the","start":59.616,"end":59.686},
  {"word":"language.","start":59.721,"end":60.510}
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

export function getLocalFrame(time: number, sceneStart: number, fps: number): number {
  return Math.max(0, Math.round((time - sceneStart) * fps));
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number): number {
  return t * t * t;
}

// ────────────────────────────────────────────────────────────
// OVERLAY SENTENCES — short text that appears ON the previous scene
// ────────────────────────────────────────────────────────────
export const OVERLAY_SENTENCE_KEYS = new Set([
  'setup1',
  't1word',
  't2word',
  't3word',
  't4word',
]);

export function isOverlaySentence(key: string): boolean {
  return OVERLAY_SENTENCE_KEYS.has(key);
}

export function getBaseSentenceIndexAtTime(t: number): number {
  const idx = SENTENCES.findIndex((s) => t >= s.start && t <= s.end);
  if (idx < 0) {
    let lastIdx = -1;
    for (let i = SENTENCES.length - 1; i >= 0; i--) {
      if (t >= SENTENCES[i].start) { lastIdx = i; break; }
    }
    if (lastIdx < 0) return 0;
    for (let i = lastIdx; i >= 0; i--) {
      if (!isOverlaySentence(SENTENCES[i].key)) return i;
    }
    return 0;
  }
  for (let i = idx; i >= 0; i--) {
    if (!isOverlaySentence(SENTENCES[i].key)) return i;
  }
  return 0;
}

export function getNextBaseSentenceIndex(fromIdx: number): number {
  for (let i = fromIdx + 1; i < SENTENCES.length; i++) {
    if (!isOverlaySentence(SENTENCES[i].key)) return i;
  }
  return SENTENCES.length - 1;
}
