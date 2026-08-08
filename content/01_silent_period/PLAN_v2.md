# Video #1: "The Silent Period" — Motion Graphics Rebuild Plan

## 📋 Executive Summary

**Video #1** in a series based on Stephen Krashen's Input Hypothesis for Mandarin learners. 60s, 9:16 (1080×1920), no music, just TTS narration. No Kanshu branding. Self-contained educational social content for TikTok/Reels/Shorts.

---

## 🎨 Brand Design System (Kanshu — sourced from app + website)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#FFFFFF` (white) | **Light mode video background** (matching app's light theme) |
| `--text` | `#0F172A` (slate-900) | Body text, story content |
| `--body-text` | `#334155` (slate-700) | Secondary text, labels |
| `--primary` | `#FF6F59` (coral) | Headlines, CTAs, accent elements, progress bars |
| `--border` | `#E5E5EA` (gray-200) | Dividers, card outlines |
| `--card` | `#F2F2F7` (gray-100) | Card backgrounds, content areas |
| `--pinyin` | `#8E8E93` (gray-500) | Pinyin annotations, secondary info |
| `--secondary` | `#5856D6` (indigo) | Optional accent for variety |
| `--glass-bg` | `rgba(255,255,255,0.7)` + `backdrop-filter: blur(12px)` | Glass cards |
| `--glass-border` | `rgba(255,255,255,0.3)` | Glass card borders |

### Font Stack (from website layout.tsx + globals.css)

| Font | Variable | Weight | Usage |
|------|----------|--------|-------|
| **Inter** (sans-serif) | `--font-inter` | 400/500/600/700/800 | Body text, labels, data — **modern, clean** |
| **Finger Paint** (display) | `--font-finger-paint` | 400 | Headlines, titles, "personality" text — **logo font** |
| **ZCOOL KuaiLe** (Chinese) | `--font-zcool` | 400 | Chinese characters (看书 logo) |

**Key rule:** Finger Paint for all major headlines/titles, Inter for body. NO Times New Roman anywhere.

---

## 🚫 What I'm Fixing (Your 7 Points)

1. **Font too small** → Text scaled up 2-3x. Minimum font size 48px for body, 72-120px for headlines. No text smaller than 36px.
2. **Times New Roman** → Completely eliminated. All text uses Inter (body) or Finger Paint (headlines).
3. **Too static** → Continuous animation in EVERY scene: text builds character-by-character, elements spring in with overshoot, background has particles or subtle parallax, progress bars animate, icons pulse.
4. **No subtitles** → Added! Bottom-of-screen subtitle track showing the current spoken word/phrase in sync with narration. Kinetic typography — each word reveals progressively.
5. **Bad motion design** → Every animation now uses proper easing:
   - **Entrances:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoot bounce-in
   - **Exits:** `cubic-bezier(0.5, 0, 0.75, 0)` — fast fade-out
   - **Sustained motion:** `ease-in-out` or linear for continuous elements
   - **Text reveals:** Character-by-character with 40ms stagger + 0.1s per letter
   - **Fade in/out:** Always quad-eased, never linear
6. **Wrong visual style** → Now uses Kanshu's ACTUAL design: white background (`#FFFFFF`), coral accent (`#FF6F59`), slate-900 text (`#0F172A`), with glassmorphism cards. Finger Paint for titles, Inter for body.
7. **Text & speech are good** → Script kept as-is, fast TTS preserved (1.4x tempo, 3.4 words/sec). Re-using narrator_fast.mp3.

---

## 🎬 Scene-by-Scene Breakdown

### SCENE 1: Hook — "Start Speaking" Cross-Out (0s–5.5s)

**Narration:** "If you just started learning Chinese and someone tells you to speak from day one — they're wrong. Here's why."

**On Screen:**
- White bg `#FFFFFF`. Finger Paint font, 96px, primary color `#FF6F59`.
- **Animation:** "START SPEAKING" builds letter-by-letter (40ms stagger per letter). Each letter springs in with overshoot (elastic ease).
- After full text appears (3.3s): Two red X strokes slash diagonally through the text — fast (0.1s draw time), with a slight wobble on completion.
- Text fades out with quad ease (0.3s).
- "LISTEN FIRST" fades in at center, 72px Finger Paint in primary color.
- **Subtitle** (bottom 10% of frame): `"If you just started learning Chinese... they're wrong."` — Inter 36px, slate-500, revealed word-by-word.

**Motion elements:** Background particles (floating dots, slate-200, 10-15 of them drifting upward slowly). Text letters spring-in with individual timing.

---

### SCENE 2: The Research — Krashen Book (5.5s–23.5s)

**Narration:** "In the 1970s, linguist Stephen Krashen studied how children actually learn languages. He found that kids who were forced to speak developed bad accents... But kids who were allowed to listen first developed perfect pronunciation. He called this the silent period — a phase where the brain absorbs the sounds, rhythm, and structure of a language without producing it. And this applies to adults too."

**On Screen:**
- Glass card (white bg with subtle shadow/border, rounded-2xl) at center containing "KRASHEN" (Finger Paint, 48px, primary) and "1977" (Inter, 36px, slate-500).
- Below: Timeline bar (horizontal line with animated fill).
  - **Animation:** Bar fills from left to right (3s, ease-in-out). At 1/3: dot with "Month 3" label. At 2/3: dot with "Month 6" label. At end: pulse icon "💬 Speech emerges" appears with bounce.
- Illustration area: Simple drawn brain outline (slate-300) on left side. Sound waves radiating from right side.
- **Subtitle:** Narration text appears bottom, word-by-word, Inter 36px, slate-500.

**Motion elements:** 
- Bar fill uses cubic-bezier ease (not linear)
- Dots appear with spring animation
- Brain icon draws in with stroke-dashoffset animation (3s)
- Sound waves: concentric arcs expanding continuously (pulse animation, 2s loop)
- Book card has subtle floating animation (3s ease-in-out, 8px Y offset)

---

### SCENE 3: The Problem — Forced Speaking Hurts (23.5s–38.5s)

**Narration:** "When you force a beginner to speak too early, two things happen. First, they develop a bad accent because they use the wrong mouth muscles. Second, their brain creates something called the affective filter — basically anxiety that blocks learning."

**On Screen:**
- Split layout (50/50). Left side: mouth icon with red X. Right side: brain icon with red X.
- **Mouth icon** (left): Simple drawn ellipses (lips shape) in slate-400. Red X overlay.
- **Brain icon** (right): Simple drawn hemisphere in slate-400. Red X overlay.
- Between them: A translucent wall rises from bottom — colored primary `#FF6F59` at 15% opacity. Label "AFFECTIVE FILTER" (Inter, 24px, primary) appears on the wall.
- **Animation:** Icons slide in from left/right (0.5s each, cubic-bezier overshoot). Red X's draw in fast (0.15s). Wall rises from Y=H to Y=H/2 (1.5s, ease-out).
- **Subtitle:** Bottom text, Inter 36px, slate-500, word-by-word reveal.

**Motion elements:**
- Icons enter with staggered timing (left 0.2s, right 0.6s)
- Red X strokes animate from top-left to bottom-right (fast, 0.1s)
- Wall rises with a subtle wobble (elastic at end)
- Background: subtle pulse animation on the wall (opacity oscillates 0.12-0.18)

---

### SCENE 4: The Solution — Just Listen (38.5s–54.5s)

**Narration:** "The solution is simple: just listen. A lot. Watch Chinese shows. Listen to podcasts. Read. Your brain needs massive input — not output — during the silent period. The more you listen, the faster you speak when you're ready."

**On Screen:**
- Top bar: "Input Accumulated" progress bar (glass card style, fills across full width over scene duration).
- Three icons in a row — **Watch** (TV icon, drawn), **Listen** (headphones), **Read** (book). Icons staggered in with 0.3s delay between each.
- Each icon: dark slate `#0F172A`, rounded corners, glass card background.
- Below each: label in Inter, 28px, slate-700.
- **Animation:** 
  - Progress bar fills from 0% to 100% over 16s (ease-in-out).
  - Icons enter left-to-right with stagger. Each icon springs up from below (overshoot).
  - Once all three are in: icons pulse gently (subtle 3s scale loop).
- **Subtitle:** Bottom text, Inter 36px, slate-500, word-by-word.

**Motion elements:**
- Progress bar fill uses cubic-bezier ease-in-out
- Icons have staggered entrance (0.3s delay each)
- Each icon entrance: translateY(50px)→0 + scale(0.8)→1 → overshoot
- Pulse loop on icons: scale(1)→scale(1.03)→scale(1) over 3s, staggered phase

---

### SCENE 5: CTA — You Can Speak (54.5s–60.5s)

**Narration:** "So if you feel guilty about not speaking Chinese yet — don't. You're building the neural patterns for perfect speech. Keep listening. And when you're ready, the words will come."

**On Screen:**
- Speaker icon (drawn, slate-400) at center top. Grows from opacity 0→1 and scale 0.6→1.2 over first 3s.
- After 3.5s: A speech bubble appears — glass card style, rounded-2xl. Inside: "你好" (ZCOOL KuaiLe, 40px, slate-900 — Chinese font for Chinese text). Below bubble: "Speech emerges naturally" (Inter, 28px, slate-700).
- **Big headline** at 57s: **"Just Listen."** (Finger Paint, 96px, primary `#FF6F59`) — fades in with quad ease, has a subtle text-shadow glow (primary at 20% opacity, 4px blur).
- **Subtitle:** "Keep listening. The words will come." — bottom, Inter 36px.

**Motion elements:**
- Speaker icon: continuous gentle pulse (scale 1.0→1.05, 4s cycle)
- Speech bubble: enters with spring from bottom, overshoot
- "Just Listen.": fade-in + scale(0.95→1.0) over 0.5s, quad ease
- Background particles slow and drift upward (calm, meditative feel)

---

## 🎞️ Motion Design Specifications

### Easing Curves

| Event | Curve | CSS Equivalent |
|-------|-------|----------------|
| Text letter build | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot spring |
| Element entrance | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot spring |
| Element exit | `cubic-bezier(0.5, 0, 0.75, 0)` | Fast ease-out |
| Progress bar fill | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard ease-in-out |
| Fade in | `cubic-bezier(0.4, 0, 0.6, 1)` | Smooth fade |
| Pulse loop | `ease-in-out` | Symmetric |

### Easing Implementation (Canvas 2D)
```javascript
// Custom easing functions:
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeInQuad(t) { return t * t; }
function easeOutQuad(t) { return 1 - (1 - t) * (1 - t); }
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
```

### Timing & Staggering

- **Letter-by-letter build:** Each letter delays by 40ms from previous. The letter itself fades in over 100ms with easeOutBack scaling.
- **Icon stagger:** 300ms between each icon in a row.
- **Subtitle reveal:** Words appear 1 at a time, synced to narration word timestamps (from narrator_timing.json). Each word fades in over 150ms, easeOutQuad.
- **Scene transitions:** Cross-fade (opacity 0→1) over 200ms + subtle scale bump (0.98→1.0).

### Subtitle System (Kinetic Typography)

**Position:** Bottom 12% of frame (Y=1690 to Y=1920). Background: subtle glass bar (white at 90% opacity, slight shadow).

**Format:** Inter 32px, slate-500 weight, centered.

**Animation:** Each word is an independent text element. Word N fades in (easeOutQuad, 150ms) at timestamp T_N. Word N-1 stays visible until end of sentence, then all fade out together (easeInQuad, 200ms).

**Color coding:** Currently spoken word (or emphasized word) appears in primary `#FF6F59` briefly, then fades to slate-500.

**Data source:** `narrator_timing.json` from the fast TTS — contains word-level timestamps with start/end times.

### Background Particles

- 15-20 small circles (4-12px diameter) in slate-200 `#E2E8F0`
- Drift upward at varying speeds (0.3-1.2 px/frame)
- Slight horizontal oscillation (sine wave, period 2-5s)
- Opacity 0.3-0.6
- Wrap around bottom when they exit top

---

## 🎬 Technical Implementation

### Rendering Pipeline (same as before, proven to work)

```
HTML5 Canvas (reel.html) → Puppeteer (CDP Runtime.evaluate) → 
CDP Page.captureScreenshot (JPEG, 92 quality) → 
FFmpeg (libx264, CRF 18) → Pydub (mix TTS) → FFmpeg (mux)
```

### File Structure
```
/Users/peterridilla/Documents/fun/kanshu/videos/01_silent_period/
├── reel.html              # Canvas renderer — COMPLETELY REWRITTEN
├── render_all.mjs         # Puppeteer framegrabber (same as before)
├── narrator_fast.mp3       # REUSE: existing 60.57s, 1.4x speed TTS
├── narrator_timing.json    # REUSE: existing word-level timestamps
├── frames/                 # Temp directory for JPEG frames
├── scene_raw.mp4           # Video output (no audio)
└── final_reel.mp4          # Final output (with mixed TTS audio)
```

### Key Renderer Changes

1. **Design tokens** → `C.bg = '#FFFFFF'`, `C.text = '#0F172A'`, `C.primary = '#FF6F59'`, `C.bodyText = '#334155'`, etc.
2. **Font loading** → Load Inter and Finger Paint via Google Fonts CDN in `reel.html` `<head>`. ZCOOL KuaiLe loaded similarly.
3. **Subtitle system** → Load `narrator_timing.json` into a JS variable. Each frame checks which words are active at timestamp `t` and renders them bottom-center.
4. **Background** → White bg `#FFFFFF` + floating particles (slate-200 circles) instead of dark bg with orbs.
5. **Easing** → All motion uses `easeOutBack` / `easeInOutQuad` / `easeOutCubic` instead of linear `clamp()`.
6. **Letter-by-letter text** → `drawTextLetterByLetter(text, x, y, font, color, progress)` — renders N letters each with individual offset/opacity.

---

## 📝 Script (keeping as-is from previous approval)

```
If you just started learning Chinese and someone tells you to speak from
day one — they're wrong. Here's why.

In the 1970s, linguist Stephen Krashen studied how children actually
learn languages. He found that kids who were forced to speak developed
bad accents. But kids who were allowed to listen first developed perfect
pronunciation. He called this the silent period — a phase where the
brain absorbs the sounds, rhythm, and structure of a language without
producing it. And this applies to adults too.

When you force a beginner to speak too early, two things happen. First,
they develop a bad accent because they use the wrong mouth muscles.
Second, their brain creates something called the affective filter —
basically anxiety that blocks learning.

The solution is simple: just listen. A lot. Watch Chinese shows. Listen
to podcasts. Read. Your brain needs massive input — not output — during
the silent period. The more you listen, the faster you speak when you're
ready.

So if you feel guilty about not speaking Chinese yet — don't. You're
building the neural patterns for perfect speech. Keep listening. And
when you're ready, the words will come.
```

**Duration:** 60.57s | **Words:** 205 | **Rate:** 3.4 words/sec

---

## 🎥 Next Steps After Video #1

| # | Topic | Hook |
|---|-------|------|
| 2 | Acquisition vs Learning | "Studying grammar doesn't make you fluent" |
| 3 | Natural Order | "English and Chinese aren't learned in the same sequence" |
| 4 | The Monitor | "Stop checking every word before you speak" |
| 5 | Input Hypothesis (i+1) | "Hard texts don't teach. You need i+1" |
| 6 | Affective Filter | "Why you freeze up in conversations" |
| 7 | Free Voluntary Reading | "Reading for pleasure beats flashcards" |
| 8 | Compelling Input | "What you WANT to read > what you should read" |
| 9 | The Silent Period for Adults | "Your brain needs to marinate" |
| 10 | Summary / Call to Action | "10 things I wish I knew about learning Chinese" |

---

## ❓ Questions for You

1. The white bg — should it be pure `#FFFFFF` or a very slight warm white (like `#F8F7F5`)? I used pure white now but can adjust.

2. For the subtitle reveal — I'm thinking word-by-word with the current word highlighted in coral. Does that work, or do you want something simpler (full sentence visible, just fades in)?

3. End card — should there be a small "follow for more" at the tail end, or do you want it completely clean?

4. The drawn icons (brain, mouth, TV, headphones, book) — should I keep them simple and minimal or more detailed? 
