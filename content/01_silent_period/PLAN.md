# Video #1 Plan: "The Silent Period"

## Core Concept
A ~50-60s short-form video explaining why beginners should NOT be forced to speak a new language. Based on Stephen Krashen's research. Informative, self-contained, no slogans.

## Target Length: ~55 seconds
That gives room to explain *why* the Silent Period matters, with concrete examples/data, without rushing.

## Script (to be spoken by narrator)

### Hook (0-4s)
> "If you just started learning Chinese and someone tells you to speak from day one — they're wrong. Here's why."

### The Research (4-20s)
> "In the 1970s, linguist Stephen Krashen studied how children actually learn languages. He found something surprising: children go through a 'silent period' that can last 3 to 6 months, where they only listen. They don't speak at all.

> During this time, their brains are building something called 'comprehensible input' — they're mapping sounds to meaning without the pressure of producing output."

### The Problem with Early Speaking (20-35s)
> "When you force a beginner to speak too early, two things happen:
> 1. They develop a strong foreign accent because their mouth isn't used to the sounds yet.
> 2. They build what Krashen called the 'affective filter' — anxiety that actually blocks language acquisition.

> The brain literally learns worse when it's stressed."

### The Solution (35-48s)
> "The solution is simple: just listen. A lot. Watch Chinese shows. Listen to podcasts. Read along with audio. Let your brain do what it's designed to do — pattern-match.

> Krashen's research showed that speech 'emerges' naturally once enough input is absorbed. You don't force it. It comes."

### CTA (48-55s)
> "So if you feel guilty about not speaking Chinese yet — don't. You're supposed to be silent. The words will come when they're ready."

## Visual Storyboard (55 seconds, 9 scenes)

### Scene 1 — Hook (0-4s)
| Element | Description |
|---------|-------------|
| Visual | Tight close-up on text "START SPEAKING" appearing letter-by-letter, then a large red X slashes through it |
| Motion | Text builds with a shake animation, red X wipes across with impact |
| Text on screen | "START SPEAKING" → gets crossed out → "LISTEN FIRST" fades in below |
| Audio | Narration only |

### Scene 2 — The Study (4-10s)
| Element | Description |
|---------|-------------|
| Visual | Animated book/journal from the 70s (simple flat illustration style), pages flip to show "Krashen 1977" |
| Motion | Book animates in from left with page-flip effect, stays for 2s, then pulls back to reveal next element |
| Text on screen | "Krashen (1977)" subtitle below the book |
| Audio | Narration only |

### Scene 3 — Silent Period Explained (10-20s)
| Element | Description |
|---------|-------------|
| Visual | A timeline bar animates from left to right spanning 6 months. Dots appear: "Month 1" → "Month 3" → "Month 6". At Month 6, speech icon (speech bubble) appears |
| Motion | Bar draws progressively. Dots pulse when they appear. Speech bubble pops in at the end |
| Text on screen | "3-6 months" on the bar, "Silent Period" as heading |
| Audio | Narration only |

### Scene 4 — Comprehension Input Diagram (20-28s)
| Element | Description |
|---------|-------------|
| Visual | Two arrows: top arrow labeled "Sounds" with Chinese characters (你好吗) flowing → ear icon. Bottom arrow labeled "Meaning" with translation "How are you?" → brain icon. After a beat, they merge into one arrow "Comprehensible Input" |
| Motion | Arrows draw from left, icons pop in. Merge animation with morph |
| Text on screen | Key terms as they're spoken |
| Audio | Narration only |

### Scene 5 — The Two Problems (28-35s)
| Element | Description |
|---------|-------------|
| Visual | Split screen. Left half: mouth icon + red X + "Bad Accent". Right half: brain icon + red X + "Anxiety Blocks Learning". A barrier wall (Affective Filter) rises in front of the right brain |
| Motion | Both halves animate in simultaneously. Wall slides up with a heavy sound effect feel (visual only, no audio sfx) |
| Text on screen | "Bad Accent" / "Anxiety Blocks Learning" |
| Audio | Narration only |

### Scene 6 — Brain Stress Visual (35-42s)
| Element | Description |
|---------|-------------|
| Visual | Simple brain outline. Orange warning pulses around it when "stress" is mentioned. Then a green calm glow when "just listen" is said. Text appears: "Acquisition happens in calm states" |
| Motion | Pulse animation (scale + glow oscillation). Transition to green with smooth color lerp |
| Text on screen | "Acquisition ≠ Learning" / "Calm = Better Results" |
| Audio | Narration only |

### Scene 7 — What To Do Instead (42-50s)
| Element | Description |
|---------|-------------|
| Visual | Three icons pop in one by one: (1) TV/movie icon "Watch Shows", (2) Headphones icon "Podcasts", (3) Book+ear icon "Read & Listen". Each has a subtle scale bounce on entry |
| Motion | Icons stagger in every 2s with bounce animation, arranged in a row at the bottom. A progress bar fills above them representing "Input Accumulated" |
| Text on screen | Action labels below each icon |
| Audio | Narration only |

### Scene 8 — The Emergence (50-55s)
| Element | Description |
|---------|-------------|
| Visual | A dimmed speaker icon at bottom, grows brighter and gains a speech bubble "你好！" as the narrator says "The words will come" |
| Motion | Slow brightness ramp + scale growth. Speech bubble fades in with a pop |
| Text on screen | "Speech emerges naturally" centered above |
| Audio | Narration only |

### Scene 9 — End Card (55-58s)
| Element | Description |
|---------|-------------|
| Visual | Clean text-only: "Just Listen." in large coral (#FF6F59) text. Below in smaller white text: "Follow for more language science" |
| Motion | Text fades in slowly |
| Text on screen | "Just Listen." + CTA |
| Audio | Silence (or music tail) |

## Motion Graphics Rules
- No static slides — every scene has at least one continuous animation
- All text appears letter-by-word or with a reveal animation (never all-at-once)
- Transitions between scenes: whip pan (translateX 120% with 0.3s ease) or sweep (clip-path rectangle)
- Background is always in subtle motion: floating gradient orbs or a grid with slow rotation
- Icons are simple flat-style SVGs drawn with canvas (fill + stroke), no downloads
- Color palette: #050510 (bg), #FFFFFF (primary text), #FF6F59 (accent), #8888AA (secondary text)

## Sound Design
| Layer | Details |
|--------|---------|
| Narrator | ElevenLabs Rachel (21m00Tcm4TlvDq8ikWAM), eleven_multilingual_v2 |
| Music | NONE explicitly — user requested no music. If there's dead air, use extremely subtle ambient texture at -30dB |
| SFX | NONE — no whooshes, clicks, impacts. Rely on visual motion to convey energy |

## Technical Specs
| Parameter | Value |
|-----------|-------|
| Resolution | 1080×1920 (9:16) |
| Framerate | 24fps |
| Duration | ~55s (TTS dependent) |
| Render | HTML5 Canvas + Puppeteer → ffmpeg |
| Audio | pydub mix: narrator -2dB, ambient (if any) -30dB |

## Questions for Peter Before Building
1. **Script tone**: Is this informative enough or too academic? Should I add more concrete examples (e.g., "A child learning English doesn't speak for months — they listen to 5,000+ hours before their first word")?
2. **Whip vs cut transitions**: Do you prefer fast cuts between scenes or animated transitions (whip pan, slide)?
3. **Icons**: Should I draw them programmatically on canvas (simple flat style) or find SVG data to embed?
4. **Length**: 55s target — if the TTS comes in at 45s or 65s, should I adjust script or keep visuals going?
5. **First frame**: The "START SPEAKING" cross-out hook — do you like this approach or something else?
