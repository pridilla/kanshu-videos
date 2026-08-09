# Chinese Character Etymology Video Workflow & Automation Master Guide

This document is the **authoritative, all-inclusive master guide and blueprint** for producing high-converting, visually stunning Chinese Character Etymology videos for **Kanshu**. It incorporates every single architectural pattern, audio secret, prompt engineering specification, visual animation formula, design token, social media distribution strategy, human-in-the-loop review checkpoint, and reusable source code module developed across the project.

---

## 1. Master System Architecture & 5-Scene Composition Structure

Videos are rendered as 9:16 vertical reels (1080 x 1920) at 60 FPS in Remotion. A full etymology lesson consists of **5 distinct scenes**:

```
+-------------------------------------------------------------------------------+
|  1. HOOK / INTRO (0s - ~8.5s)                                                 |
|     - Title: "Why Does 帮助 Contain Cloth & Muscle?"                          |
|     - Intact centered Hanzi: 帮助                                             |
|     - 4 Orbiting Radical Emojis (bouncy spring pop-ins on mention)            |
|     - Flipbook Cat Card 1: 🤝 帮助 (bāng zhù)                                 |
+-------------------------------------------------------------------------------+
|  2. CHARACTER 1 BREAKDOWN: 帮 (bāng) (~8.5s - ~29.4s)                         |
|     - Title: "Character 1: 帮 (bāng) — Protective Backing"                    |
|     - Intact 帮 morphs to center; 助 slides off-screen right                  |
|     - Dynamic Black Spotlight: 邦 (top) -> 巾 (bottom) -> 帮 (whole)          |
|     - Flipbook Cat Cards: 🏰 邦 -> 🧵 巾 -> 🛡️ 帮                           |
+-------------------------------------------------------------------------------+
|  3. CHARACTER 2 BREAKDOWN: 助 (zhù) (~29.4s - ~48.7s)                         |
|     - Title: "Character 2: 助 (zhù) — Muscle Power"                           |
|     - Intact 帮 slides off-screen left; 助 morphs to center                   |
|     - Dynamic Black Spotlight: 且 (left) -> 力 (right) -> 助 (whole)          |
|     - Flipbook Cat Cards: ⛩️ 且 -> 💪 力 -> 🏋️ 助                           |
+-------------------------------------------------------------------------------+
|  4. SYNTHESIS / CONCLUSION (~48.7s - ~54.0s)                                  |
|     - Title: "Synthesis: 帮助 = Protection + Muscle!"                        |
|     - 帮 and 助 morph side-by-side inside glowing Synthesis Aura Ring         |
|     - Sequential highlight: 帮 (orange) -> 助 (orange)                        |
|     - Flipbook Cat Card: 🤝 帮助 (bāng zhù)                                 |
+-------------------------------------------------------------------------------+
|  5. KANSHU APP PROMOTIONAL OUTRO (~54.0s - ~61.1s)                            |
|     - 3D iPhone canvas with live book text & Pinyin ruby annotations          |
|     - Animated touch ripple gesture pointer                                   |
|     - Badges: Apple App Store (Google Play Store commented out)               |
|     - Primary CTA: "Start Reading For Free — Link in Bio"                     |
+-------------------------------------------------------------------------------+
```

---

## 2. Human-in-the-Loop Review Checkpoints & Approval Protocol

To ensure 100% alignment and quality, the AI assistant MUST pause and present intermediate assets to the user for approval at **5 mandatory Review Gates**:

```mermaid
flowchart TD
    G1["Review Gate 1: Script & Story Approval<br>(Review etymology breakdown & Character+Pinyin script)"] -->|User Approved| A1["Generate Single-Pass Voiceover"]
    A1 --> G2["Review Gate 2: Audio & Pronunciation Approval<br>(Listen to generated voiceover & test pace)"]
    G2 -->|User Approved| A2["Generate Cat Sketch PNGs & Sync Config"]
    A2 --> G3["Review Gate 3: Cat Sketch Asset Approval<br>(Inspect 3-frame flipbook doodles & transparency)"]
    G3 -->|User Approved| A3["Run Target Spotlight Calibration"]
    A3 --> G4["Review Gate 4: Spotlight Layout Inspection<br>(Inspect frame snapshots for circle target bounds)"]
    G4 -->|User Approved| A4["Render Full Remotion MP4 & Social Posts"]
    A4 --> G5["Review Gate 5: Final Video & Social Copy Approval<br>(Watch final reel & review SOCIAL_POSTS.md)"]
```

### Mandatory Review Gate Specifications:
1. **Gate 1 — Script & Story Review**: Present the proposed etymology breakdown story and script text using inline Character+Pinyin syntax (e.g. `帮助 (bāngzhù)`). Wait for user confirmation before calling ElevenLabs API.
2. **Gate 2 — Audio & Pronunciation Review**: Provide a direct audio playback link to the generated voiceover file (`public/bangzhu_voice_single_pass.mp3`). Allow the user to verify Mandarin tones and pacing before applying `atempo=1.15` acceleration.
3. **Gate 3 — Cat Sketch Asset Review**: Present the generated 3-frame transparent PNG cat drawings. Verify line art style consistency and ping-pong animation sequence before embedding into composition.
4. **Gate 4 — Spotlight Layout Inspection**: Render single frame PNG snapshots at radical breakdown midpoints and present them to the user to confirm the target circle accurately bounds the radical without clipping.
5. **Gate 5 — Final Video Reel & Social Copy Approval**: Present the final rendered MP4 video reel link alongside `SOCIAL_POSTS.md` before committing and pushing to repository.

---

## 3. ElevenLabs Voiceover Specifications & Prompt Engineering

### A. Voice & Model Configuration
- **Voice Model**: `eleven_v3` (MANDATORY: DO NOT use `eleven_multilingual_v2` as it drops Chinese tone contours).
- **Voice ID**: `tnSpp4vdxKPjI9w0GnoV` (George - Warm, engaging, authoritative narrator).
- **API Endpoint**: `POST https://api.elevenlabs.io/v1/text-to-speech/tnSpp4vdxKPjI9w0GnoV/with-timestamps`
- **Output Format**: 192kbps MP3 + JSON alignment metadata (`characters`, `character_start_times_seconds`, `character_end_times_seconds`).

### B. Script Syntax & Prompting Rules
- **Rule 1: Character + Inline Pinyin Syntax**: Format Chinese words as `帮助 (bāngzhù)`, `帮 (bāng)`, `巾 (jīn)`. The `eleven_v3` model interprets `(pinyin)` as an inline pronunciation guide and speaks the Chinese character **once** with 100% accurate Mandarin tones before seamlessly continuing into English narration.
- **Rule 2: Single-Pass Recording**: Always record the full narration script in a **single API request**. Do NOT concatenate separate audio clips, as this causes speech unnaturalness and timestamp misalignment.
- **Rule 3: Audio Pace Acceleration**: Apply `ffmpeg -filter:a "atempo=1.15"` to accelerate the master narration by 15% without pitch distortion, reducing total video duration to a punchy ~54 seconds.

### C. Master Script Reference for `帮助 (bāngzhù)`:
```text
Why does 帮助 (bāngzhù) contain cloth and muscle? Let's break down 帮 (bāng) first. The top part 邦 (bāng) represents territory or community, while the bottom part 巾 (jīn) represents a strip of cloth used to reinforce a shoe. Together, 帮 (bāng) originally meant reinforcing the back of a shoe to give it protective support! Now let's look at 助 (zhù). On the left, 且 (zhǔ) represents a heavy altar pedestal. On the right, 力 (lì) represents a muscle flexing with power. Together, 助 (zhù) means lending your physical strength to help support something heavy! Put them together, and 帮助 (bāngzhù) literally means offering protective support and muscle power to help someone!
```

---

## 4. Automated Timestamp & Alignment Sync System

Word alignments and animation frame boundaries are computed automatically from ElevenLabs alignment JSON via `scripts/sync_single_pass_config.py`.

### Scaling & Frame Calculation
Given speech acceleration factor $S = 1.15$ and target FPS = 60:
$$\text{Frame}(t) = \text{round}\left( \frac{t}{S} \times 60 \right)$$

### Centralized `animationTimestamps` Schema in `config.json`:
```json
{
  "audioSrc": "bangzhu_voice_single_pass_fast.mp3",
  "lessonDurationInFrames": 3241,
  "wordsAlignment": [
    { "word": "Why", "start": 0.0, "end": 0.25 },
    { "word": "does", "start": 0.25, "end": 0.48 }
  ],
  "animationTimestamps": {
    "screen1": {
      "startFrame": 0,
      "endFrame": 508,
      "clothMention": { "startFrame": 206, "endFrame": 238 },
      "wallMention": { "startFrame": 285, "endFrame": 330 },
      "altarMention": { "startFrame": 340, "endFrame": 376 },
      "muscleMention": { "startFrame": 430, "endFrame": 472 }
    },
    "screen2": {
      "startFrame": 508,
      "endFrame": 1763,
      "topBang": { "startFrame": 508, "endFrame": 952 },
      "bottomJin": { "startFrame": 952, "endFrame": 1440 },
      "wholeBang": { "startFrame": 1440, "endFrame": 1763 }
    },
    "screen3": {
      "startFrame": 1763,
      "endFrame": 2920,
      "wholeZhuIntro": { "startFrame": 1763, "endFrame": 1962 },
      "leftQie": { "startFrame": 1962, "endFrame": 2233 },
      "rightLi": { "startFrame": 2233, "endFrame": 2625 },
      "wholeZhuOutro": { "startFrame": 2625, "endFrame": 2920 }
    },
    "screen4": {
      "startFrame": 2920,
      "endFrame": 3241,
      "bangHighlightEndFrame": 3160
    }
  }
}
```

---

## 5. Dynamic Target Spotlight Coordinate Calibration Loop (Visual AI Inspection)

Chinese characters have diverse structural decompositions (Top-Bottom splits like `帮`, Left-Right splits like `助`, or Surround enclosures like `国`). **Do NOT guess coordinate values!** Always execute the **Spotlight Coordinate Calibration Loop**:

```mermaid
flowchart TD
    Est["1. Estimate Initial Radical Coordinates (x, y, radius)"] --> Render["2. Render Single Frame Snapshots at Breakdown Phase Midpoints"]
    Render --> Inspect["3. AI Visual Inspection (Check Circle Bounds & Pointer Alignment)"]
    Inspect -->|Off-center or Stroke Clipped| Adjust["4. Adjust x, y, or radius Parameters"]
    Adjust --> Render
    Inspect -->|Pixel Perfect| Lock["5. Lock Calibrated Coordinates into Composition"]
```

---

## 6. Design System Tokens: Colors, Typography & Font Usage Rules

### A. Color Palette (`COLORS`)
- **Background Canvas**: `#FAF9F6` (Warm off-white paper canvas from brand guidelines).
- **Primary Brand Accent**: `#FF6F59` (Vibrant Coral Orange/Red). Used for active word highlights, CTA buttons, spotlight rings, and header borders.
- **Dark Pill / Mask Overlay**: `#0F172A` (Deep Slate Navy). Used for dynamic target spotlight background (`rgba(15, 23, 42, 0.95)`) and dark card tags.
- **Card Subtitle / Pinyin**: `#94A3B8` (Cool Grey).
- **Ruby Inactive Pinyin**: `#8E8E93` (Muted Grey).

### B. Typography & Font Assignment Rules

| Font Family | Variable / Constant | Purpose & Usage Rules |
| :--- | :--- | :--- |
| **Finger Paint** | `FONTS.display` | **All English Headings & Display Callouts**. Use ONLY for top brand badges (`CHINESE CHARACTER ETYMOLOGY`), screen title headers, card tag translation labels (ALL CAPS), and primary CTA buttons. |
| **Noto Sans SC** | `"Noto Sans SC"` | **All Chinese Hanzi Characters**. ALWAYS use for main intact morphing Hanzi (`fontSize: 340px`, weight `900`), card tag Hanzi (`fontSize: 40px`, weight `900`), and reader book text. |
| **Roboto** | `FONTS.pinyin` | **Pinyin Pronunciation & Subtitles**. ALWAYS use for Pinyin annotations in card tags (`fontSize: 28px`, italic, weight `700`), subtitles, and real-time speech captions. |

---

## 7. Background Music, Pattern & Motion Systems

### A. Royalty-Free Chinese Lofi Background Music
- **Audio File**: `public/chinese_lofi_bgm.mp3` (Jade Tea Loop).
- **Volume Level**: **8% volume** (`volume={0.08}`) during the etymology lesson sequence.
- **Fade-Out Transition**: Fades out smoothly in the last 60 frames (1 second) before the outro:
```tsx
const bgmFadeOut = interpolate(frame, [lessonDurationInFrames - 60, lessonDurationInFrames], [1, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
const bgmVolume = 0.08 * bgmFadeOut;
```

### B. Oriental Cloud Lattice Background (`ChineseBackground.tsx`)
- **Texture Asset**: `public/chinese_cloud_pattern.png` (Traditional Chinese oriental cloud lattice vector pattern).
- **Visual Style**: Subtle 18% opacity overlay over the `#FAF9F6` warm canvas.
- **Drift Motion**: Continuous horizontal parallax drift at 0.05px per frame (`transform: translateX(${frame * 0.05}px)`).
- **Subtle Background Mesh Grid**: Quadratic moving grid slide (`backgroundSize: '54px 54px'`, opacity 0.28).

---

## 8. Screen Transition Physics & Morphing Patterns

Screen transitions use fluid Remotion spring physics (`SPRING_SMOOTH`: `damping: 22, mass: 0.9, stiffness: 120`).

### A. Morphing Character Coordinates ($X$ Position & Scale)
Intact Hanzi characters **morph continuously** across screens:

$$\text{morph1To2} = \text{spring}(\text{frame} - \text{screen1EndFrame})$$
$$\text{morph2To3} = \text{spring}(\text{frame} - \text{screen2EndFrame})$$
$$\text{morph3To4} = \text{spring}(\text{frame} - \text{screen3EndFrame})$$

- **Character 1 (`帮`) Position ($X$)**:
  - Screen 1: $-150\text{px}$ (Left side of compound word).
  - Screen 2: $0\text{px}$ (Center focus, scaled up to $1.4\times$).
  - Screen 3: $-800\text{px}$ (Slides completely off-screen left).
  - Screen 4: $-150\text{px}$ (Morphs back to left side of synthesis aura ring).

- **Character 2 (`助`) Position ($X$)**:
  - Screen 1: $+150\text{px}$ (Right side of compound word).
  - Screen 2: $+800\text{px}$ (Slides completely off-screen right).
  - Screen 3: $0\text{px}$ (Center focus, scaled up to $1.4\times$).
  - Screen 4: $+150\text{px}$ (Morphs back to right side of synthesis aura ring).

### B. Card Tag Entrance & Exit Transitions (`OrganicCenterTag.tsx`)
- **Entrance**: Moves from left off-screen ($-1400\text{px} \rightarrow 0\text{px}$) with gentle overshoot spring (`damping: 18, mass: 0.8, stiffness: 140`).
- **Exit**: Moves off-screen right ($0\text{px} \rightarrow +1400\text{px}$) when `frame >= exitFrame`.

---

## 9. Flipbook Cat Sketch Generation & Consistency Pipeline

### A. Card Tag Label Styling
- **Pill Container**: `backgroundColor: '#0F172A'`, `padding: '14px 38px'`, `borderRadius: 26px`, `border: '2px solid rgba(255, 111, 89, 0.5)'`, `boxShadow: '0 16px 40px rgba(15, 23, 42, 0.45)'`.
- **Line 1**: Emoji (`38px`) + Hanzi (`40px`, Noto Sans SC `#FFFFFF`, 900 weight) + Pinyin (`28px`, Roboto `#94A3B8`, 700 weight italic).
- **Line 2**: Translation (`22px`, Finger Paint `#FF6F59`, 700 weight, ALL CAPS).

### B. 3-Frame Consistent Image-to-Image Generation Sequence

1. **Master Prompt Anchor**:
   > `"Minimalist hand-drawn black ink line art sketch of a cute chubby round cat [ACTION], simple black stroke on pure solid white background, cute cartoon doodle style, clear black outline, no color fill, no shading."`

2. **Frame 1 (Base Anchor)**: Generate Frame 1 using the Master Prompt.
3. **Frame 2 & 3 (Image-to-Image Seed Anchoring)**: Pass **Frame 1** as the reference input image with a low variation weight (**0.25 – 0.35**) to lock cat proportions, face shape, and stroke width while prompting micro-actions.
4. **Absolute 6 FPS Ping-Pong Loop**:
```tsx
const cycleIndex = Math.floor(frame / 10) % 4;
const pingPongMap = [0, 1, 2, 1]; // 0 -> 1 -> 2 -> 1 loop
const flipIndex = pingPongMap[cycleIndex] % catImages.length;
const currentCatSrc = catImages[flipIndex] || catImages[0];
```

---

## 10. Social Media Distribution & Platform Best Practices

Every generated video MUST be accompanied by a dedicated `SOCIAL_POSTS.md` file formatted specifically for 5 primary platforms:

### A. TikTok Best Practices
- **Hook**: First sentence must raise immediate curiosity ("Why does 帮助 contain cloth & muscle?").
- **Caption Length**: Short & punchy (150–250 characters).
- **Hashtag Mix**: 5–7 hashtags (`#LearnChinese #ChineseEtymology #Mandarin #Hanzi #KanshuApp #HSK`).
- **CTA**: Clear call-to-action to check link in bio.

### B. Instagram Reels Best Practices
- **Storytelling Format**: Rich medium-length breakdown (250–450 characters) listing radical 1, radical 2, and synthesis.
- **Visual Emojis**: Bulleted list with bold character titles.
- **Hashtag Strategy**: 7–10 targeted tags (`#learnchinese #chinesecharacter #hsk #etymology #chinesestudy #kanshu #mandarinlearning`).

### C. YouTube Shorts Best Practices
- **Title Specification**: Short & clicky title under 60 characters with key term & emoji (`Why Does 帮助 Mean HELP in Chinese? 🇨🇳 #Shorts`).
- **Description**: Include brief summary, direct Kanshu web link, and `#Shorts #LearnChinese #Mandarin`.

### D. RedNote (小红书 - Xiaohongshu) Best Practices
- **Title Strategy**: Curiosity-driven Chinese title with emojis (`💡原来“帮助”的“帮”竟然是鞋后跟？！汉字拆解超有趣！`).
- **Bilingual Tone**: Friendly educational tone in native Chinese with bulleted radical meanings.
- **Hashtags**: `#学中文 #汉字演变 #中文学习 #Kanshu #汉语学习 #对外汉语`.

### E. X (Twitter) Best Practices
- **Length Constraint**: Strictly under 280 characters.
- **Format**: 1-sentence hook + punchy mathematical breakdown (`帮 = shoe cloth. 助 = altar muscle. 帮 + 助 = Help!`).
- **Hashtags**: 2–3 clean tags (`#LearnChinese #Mandarin #Hanzi`).

---

## 11. Full Reusable Source Code Reference Architecture

### A. Background Component (`ChineseBackground.tsx`)
```tsx
import React from 'react';
import { AbsoluteFill, interpolate, staticFile } from 'remotion';

export interface ChineseBackgroundProps {
  frame: number;
  lessonTotalFrames?: number;
  morph1To2?: number;
  morph2To3?: number;
  morph3To4?: number;
}

export const ChineseBackground: React.FC<ChineseBackgroundProps> = ({
  frame,
  lessonTotalFrames = 2772,
  morph1To2 = 0,
  morph2To3 = 0,
  morph3To4 = 0,
}) => {
  const enterProgress = Math.min(1, Math.max(0, frame / 35));
  const enterOpacity = Math.pow(enterProgress, 2);

  const exitStartFrame = lessonTotalFrames - 45;
  const exitProgress = Math.min(1, Math.max(0, (frame - exitStartFrame) / 45));
  const exitOpacity = Math.pow(1 - exitProgress, 2);

  const totalOpacity = enterOpacity * exitOpacity;
  const enterY = (1 - enterProgress) * (1 - enterProgress) * 50;

  const continuousPanY = frame * 0.4;
  const transitionPanX =
    interpolate(morph1To2, [0, 1], [0, 60]) +
    interpolate(morph2To3, [0, 1], [0, -100]) +
    interpolate(morph3To4, [0, 1], [0, 50]);

  const patternScale =
    1.0 +
    interpolate(morph1To2, [0, 1], [0, 0.05]) +
    interpolate(morph2To3, [0, 1], [0, -0.06]) +
    interpolate(morph3To4, [0, 1], [0, 0.05]);

  if (totalOpacity <= 0.001) return null;

  return (
    <AbsoluteFill
      style={{
        opacity: totalOpacity * 0.12,
        transform: `translateY(${enterY}px) scale(${patternScale})`,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -200,
          width: 'calc(100% + 400px)',
          height: 'calc(100% + 400px)',
          backgroundImage: `url(${staticFile('chinese_cloud_pattern.png')})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '950px auto',
          backgroundPosition: `${transitionPanX}px ${-continuousPanY}px`,
        }}
      />
    </AbsoluteFill>
  );
};
```

### B. Python Sync Script (`sync_single_pass_config.py`)
```python
#!/usr/bin/env python3
import os
import sys
import json
import argparse
import subprocess

def get_audio_duration(file_path):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file_path]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        return float(res.stdout.strip())
    except ValueError:
        return 0.0

def sec_to_frame(sec, fps=60):
    return int(round(sec * fps))

def main():
    parser = argparse.ArgumentParser(description="Sync single-pass alignment with config.json and optional speed factor")
    parser.add_argument('--speed', type=float, default=1.15)
    parser.add_argument('--audio', default='public/bangzhu_voice_single_pass_fast.mp3')
    parser.add_argument('--config', default='content/04_etymology_bangzhu/config.json')
    parser.add_argument('--alignment', default='public/bangzhu_voice_single_pass_alignment.json')
    args = parser.parse_args()

    speed_factor = args.speed
    with open(args.alignment, 'r') as f:
        align = json.load(f)

    chars = align.get('characters', [])
    starts = align.get('character_start_times_seconds', [])
    ends = align.get('character_end_times_seconds', [])

    raw_words_alignment = []
    current_word_chars = []
    word_start = None
    word_end = None

    for c, s, e in zip(chars, starts, ends):
        if c in [' ', '\n', '\t']:
            if current_word_chars:
                w_str = ''.join(current_word_chars).strip()
                if w_str:
                    raw_words_alignment.append({"word": w_str, "start": word_start, "end": word_end})
                current_word_chars = []
                word_start = None
                word_end = None
        else:
            if word_start is None:
                word_start = s
            word_end = e
            current_word_chars.append(c)

    words_alignment = [{"word": wa['word'], "start": round(wa['start']/speed_factor, 3), "end": round(wa['end']/speed_factor, 3)} for wa in raw_words_alignment]

    audio_duration = get_audio_duration(args.audio)
    total_frames = sec_to_frame(audio_duration)

    with open(args.config, 'r') as f:
        cfg = json.load(f)

    cfg['audioSrc'] = os.path.basename(args.audio)
    cfg['wordsAlignment'] = words_alignment
    cfg['lessonDurationInFrames'] = total_frames

    with open(args.config, 'w') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

    print(f"✅ Successfully updated {args.config} with {speed_factor}x speed alignment!")

if __name__ == '__main__':
    main()
```

---

## 11. Message-by-Message Feedback Analysis

| Step | User Request / Feedback | Root Cause | Engineering Solution |
| :--- | :--- | :--- | :--- |
| **1** | Use Pinyin using v3 | Speech engine skipped Chinese characters when unguided. | Switched to `eleven_v3`. |
| **2** | Cut audio according to timestamps | Dual pronunciations occurred when stitching snippets. | Switched to single-pass master recording. |
| **3** | Character + Pinyin prompt engineering | Passing `帮助 (bāngzhù)` forced single native Mandarin pronunciation. | Adopted `帮助 (bāngzhù)` character+pinyin prompt format. |
| **4** | Refactor animation timelines | Hardcoded frame numbers made audio updates difficult. | Created `sync_single_pass_config.py` to write `animationTimestamps` to `config.json`. |
| **5** | Faster speech track | 1.0x narration felt slow for Reels/TikTok. | Applied `ffmpeg atempo=1.15` and `--speed 1.15` alignment scaling. |
| **6** | Comment out Play Store in outro | Google Play Store app not available yet. | Commented out Google Play Store badge in `AppOutro.tsx`. |
| **7** | Incoherent flipbook animations | Relative frame indexing caused phase offsets & visual snapping. | Implemented global absolute 6 FPS ping-pong loop `[0, 1, 2, 1]`. |
| **8** | Concurrency 8 is super slow | CPU thread thrashing on macOS. | Reverted to standard default Remotion thread concurrency. |
| **9** | Target Spotlight Radical Inspection Loop | Visual calibration required to prevent circle stroke clipping. | Documented Visual AI Inspection Loop & coordinate mapping for Top/Bottom & Left/Right radicals. |
| **10** | Social Media Copy Metadata | Needed platform-specific captions & hashtag strategies. | Documented TikTok, IG Reels, YT Shorts, RedNote, and X formats & generated `SOCIAL_POSTS.md`. |
| **11** | Human-in-the-Loop Review Gates | User wants to review script, audio, assets, and layout at each stage. | Established 5 mandatory User Review Checkpoints in section 2. |

---

## 12. Step-by-Step Production Checklist with Mandatory Review Gates

1. **Step 1: Script Preparation**
   - Write etymology narration text using Character+Pinyin syntax (e.g. `帮助 (bāngzhù)`).
   - 🛑 **[USER REVIEW GATE 1]**: Present script & etymology narrative to user for approval before calling ElevenLabs.

2. **Step 2: Single-Pass Audio Generation**
   - Generate ElevenLabs single-pass voiceover + JSON alignment metadata.
   - 🛑 **[USER REVIEW GATE 2]**: Provide audio playback link to user for pronunciation & tone approval.

3. **Step 3: Audio Pace Acceleration & Alignment Sync**
   - Run `ffmpeg -i audio.mp3 -filter:a "atempo=1.15" -b:a 192k audio_fast.mp3`.
   - Run `python3 scripts/sync_single_pass_config.py --speed 1.15 --audio audio_fast.mp3`.

4. **Step 4: Flipbook Cat Sketch Generation**
   - Generate 3 consistent PNG frames per radical using Image-to-Image seed anchoring (0.3 variation weight) and strip background transparency.
   - 🛑 **[USER REVIEW GATE 3]**: Present 3-frame cat doodle sketch drawings to user for style approval.

5. **Step 5: Spotlight Coordinate Calibration**
   - Run Visual AI Inspection loop by rendering midpoint frame PNG snapshots (`calib_top_bang.png`).
   - 🛑 **[USER REVIEW GATE 4]**: Present spotlight frame snapshots to user to confirm radical circle target bounds.

6. **Step 6: Video Render & Social Media Metadata Generation**
   - Execute `npx remotion render src/index.ts EtymologyComposition out/final_reel.mp4`.
   - Create `SOCIAL_POSTS.md` with platform copy for TikTok, IG Reels, YT Shorts, RedNote, and X.
   - 🛑 **[USER REVIEW GATE 5]**: Present final MP4 video link and `SOCIAL_POSTS.md` copy to user for final sign-off before committing.
