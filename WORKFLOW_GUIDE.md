# Chinese Character Etymology Video Workflow & Automation Master Guide

This document captures the **complete end-to-end architecture, voice prompting secrets, cat sketch flipbook prompting pipeline, timing alignment algorithms, visual animation mechanics, and message-by-message feedback analysis** for producing Chinese Character Etymology videos for **Kanshu**.

---

## 1. Video Architecture & Composition Structure

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

## 2. Flipbook Cat Sketch Generation & Character Consistency Pipeline

The cat sketch flipbooks (`OrganicCenterTag.tsx`) are the primary visual delight element. To ensure cat drawings remain **100% consistent across frames** without flickering art style or changing body features:

### A. Master Image Prompting Structure
Always use a single anchor master character definition in the prompt:

```text
[ANCHOR DESIGN]: Minimalist hand-drawn black ink line art sketch of a cute chubby round cat, simple black stroke on pure solid white background, cute cartoon doodle style, clear black outline, no color fill, no shading, no background textures.

[FRAME ACTION]: Frame 1: The chubby cat is holding a wooden shield over a wall.
```

### B. 3-Frame Consistent Image-to-Image Generation Sequence

1. **Frame 1 (Base Anchor Image)**:
   - Generate Frame 1 using the Master Image Prompt.
   - Example prompt for radical `巾` (Cloth):
     `Minimalist hand-drawn black ink line art sketch of a cute chubby round cat wearing a protective cloth apron, simple black stroke on pure solid white background, cute cartoon doodle style, clear outline, no shading.`

2. **Frame 2 (Micro Movement - Image-to-Image Seed Anchoring)**:
   - Pass **Frame 1** as the reference image input (`ImagePaths: ["cats/cat_jin_frame_1.png"]`).
   - Use a low variation/denoising strength (**0.25 - 0.35**) to lock cat proportions, face shape, and stroke weight while prompting micro movement:
     `Same chubby round cat from reference image, slightly tilting head left and winking right eye, minimalist black ink line art sketch, pure solid white background.`

3. **Frame 3 (Peak Action - Image-to-Image Seed Anchoring)**:
   - Pass **Frame 1** as reference image input with low variation strength (**0.25 - 0.35**):
     `Same chubby round cat from reference image, lifting cloth apron up slightly with right paw, minimalist black ink line art sketch, pure solid white background.`

### C. Transparency & Canvas Post-Processing
1. **Background Removal**: Strip the pure white background to convert the image into a 32-bit transparent PNG with alpha channel (`rembg i frame_1.png frame_1_trans.png`).
2. **Bounding Box Normalization**: Crop transparent padding so all 3 frames share identical center anchors, preventing the cat from jumping vertically or horizontally when cycling frames.

---

## 3. ElevenLabs Voiceover Specifications & Prompt Engineering

### Voice & Model Configuration
- **Voice Model**: `eleven_v3` (MANDATORY: DO NOT use `eleven_multilingual_v2` as it drops Chinese tone contours).
- **Voice ID**: `tnSpp4vdxKPjI9w0GnoV` (George - Warm, engaging, authoritative narrator).
- **API Endpoint**: `POST https://api.elevenlabs.io/v1/text-to-speech/tnSpp4vdxKPjI9w0GnoV/with-timestamps`
- **Output Format**: 192kbps MP3 + JSON alignment metadata (`characters`, `character_start_times_seconds`, `character_end_times_seconds`).

### Script Syntax & Prompting Rules
- **Rule 1: Character + Inline Pinyin Syntax**: Format Chinese words as `帮助 (bāngzhù)`, `帮 (bāng)`, `巾 (jīn)`. The `eleven_v3` model interprets `(pinyin)` as an inline pronunciation guide and speaks the Chinese character **once** with 100% accurate Mandarin tones before seamlessly continuing into English narration.
- **Rule 2: Single-Pass Recording**: Always record the full narration script in a **single API request**. Do NOT concatenate separate audio clips, as this causes speech unnaturalness and timestamp misalignment.
- **Rule 3: Audio Pace Acceleration**: Apply `ffmpeg -filter:a "atempo=1.15"` to accelerate the master narration by 15% without pitch distortion, reducing total video duration to a punchy ~54 seconds.

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

## 5. Visual Components & Animation Implementation

### A. Real-Time Captions (`RealtimeCaptions.tsx`)
- **Positioning**: Fixed container at `bottom: 200px` above card tags.
- **Word Highlight Logic**: Active word highlights in vibrant `#FF6F59` with a subtle scale pop (`scale(1.08)`):
```tsx
const isActive = currentTime >= word.start && currentTime <= word.end;
```

### B. High-Contrast Dynamic Target Spotlight (`DynamicSmoothSpotlight`)
- **Dark Mask Overlay**: Full screen `rgba(15, 23, 42, 0.95)` with dynamic SVG `<mask/>` circular cutout.
- **Target Ring**: Bright SVG `<circle/>` stroke `#FF6F59` with `strokeWidth: 5px` and glowing filter.
- **Snug Pointer Arrow**: Pointing emoji `👇` dynamically positioned snugly at `top: -(radius - 15)`.

### C. Flipbook Cat Sketch Cards (`OrganicCenterTag.tsx`)
- **Card Design**: Compact 2-line dark pill container (`backgroundColor: '#0F172A'`, `borderRadius: 26px`, `border: '2px solid rgba(255, 111, 89, 0.5)'`).
- **Cat Sketch Images**: Transparent borderless PNG drawings stored in `public/cats/cat_*.png`.
- **Absolute 6 FPS Ping-Pong Loop**: Calculated globally to ensure uniform animation rhythm across card entries:
```tsx
const cycleIndex = Math.floor(frame / 10) % 4;
const pingPongMap = [0, 1, 2, 1]; // 0 -> 1 -> 2 -> 1 loop
const flipIndex = pingPongMap[cycleIndex] % catImages.length;
const currentCatSrc = catImages[flipIndex] || catImages[0];
```

### D. App Promotional Outro (`AppOutro.tsx`)
- 3D iPhone canvas displaying Chinese reading text with Pinyin ruby annotations.
- Live touch gesture pointer with expanding ripple effect (`TouchGesture`).
- Store Badges: Apple App Store badge displayed; Google Play Store badge commented out.
- Primary CTA: `"Start Reading For Free — Link in Bio"`.

---

## 6. Message-by-Message Feedback Analysis

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
