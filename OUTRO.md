# Kanshu App Outro Documentation

This document describes the design, architecture, brand identity, and technical implementation of the **Kanshu.app Promotional Outro** component (`KanshuAppOutro` / `AppOutro.tsx`) within the `kanshu-videos` engine repository.

---

## 📐 Overview & Purpose

The **Kanshu Outro** is a high-converting, realistic 60 FPS Remotion video scene (duration: **425 frames / ~7.08 seconds**) designed for mobile video platforms (TikTok, Instagram Reels, YouTube Shorts). It demonstrates the core value proposition of [**Kanshu.app**](https://kanshu.app):

> *"Read Chinese Literature Without Constant Lookups"*

It bridges the educational topic of any video (e.g., character etymology, tones, or grammar breakdown) directly into an interactive demonstration of Kanshu's mobile e-reader.

---

## 🎨 Brand Identity & Visual Design Tokens

| Token | Value | Purpose |
|---|---|---|
| **Background Canvas** | `#FAF9F6` | Warm, off-white paper canvas |
| **Radial Gradient** | `radial-gradient(circle at 50% 16%, rgba(255,111,89,0.12) 0%, rgba(250,249,246,1) 75%)` | Soft ambient warm highlight |
| **Brand Primary Accent** | `#FF6F59` | Coral primary color for highlights, CTA, and tags |
| **Text Primary** | `#0F172A` | Deep slate for headlines and app titles |
| **Text Reader Body** | `#1E293B` | Dark charcoal for reader body text |
| **Pinyin Tone Text** | `#8E8E93` | Neutral gray for top Pinyin syllables |
| **Display Font** | `Finger Paint` (Google Fonts) | Playful hand-drawn font for slogan & CTA button |
| **Reader Body Font** | `"Noto Sans SC"`, `"PingFang SC"`, sans-serif | Modern clean Chinese typography |
| **Logo Asset** | `kanshu_favicon.svg` ([`engine/public/kanshu_favicon.svg`](file:///Users/peterridilla/Documents/fun/kanshu/videos/engine/public/kanshu_favicon.svg)) | Official website SVG brand icon |

---

## 📱 iPhone 17 Device Specs

- **Chassis Dimensions**: **`580px` × `1240px`**
- **Aspect Ratio**: **`19.5:9`** (`580 / 1240 = 0.468` aspect ratio matching flagship iPhones)
- **Corner Radius**: `48px`
- **Dynamic Island Cutout**: `140px` × `26px` pill cut
- **Box Shadow**: `0 30px 90px rgba(15, 23, 42, 0.22)` with double outer chassis ring

---

## 📖 Real App Reader Integration (`mandarin_book_reader`)

The reader display inside `AppOutro.tsx` is built to match the exact HTML/CSS rendering pipeline of the mobile app ([`mandarin_book_reader/src/utils/htmlGenerator.ts`](file:///Users/peterridilla/Documents/fun/mandarin_book_reader/src/utils/htmlGenerator.ts)):

1. **Zero Inter-Word Spacing**:
   ```css
   .word-container {
     display: inline; /* ZERO margin, ZERO padding between Chinese words */
   }
   ```
2. **Per-Character Stacked Pinyin (`<ruby>` / `<rt>`)**:
   ```html
   <span class="word-container" data-word="物理学家">
     <ruby>物<rt>wù</rt></ruby>
     <ruby>理<rt>lǐ</rt></ruby>
     <ruby>学<rt>xué</rt></ruby>
     <ruby>家<rt>jiā</rt></ruby>
   </span>
   ```
3. **Pinyin Relative Sizing & Gap**:
   - `rt` font size: **`0.48em`**
   - Vertical gap: `paddingBottom: 3px` above character
4. **Selected Target Word Highlight**:
   - Identical typography & layout to surrounding text.
   - Highlights with `backgroundColor: 'rgba(255, 111, 89, 0.25)'`, `color: '#FF6F59'`, and `borderBottom: '3.5px solid #FF6F59'`.

---

## 👆 Animated Touch Gesture Pointer (`TouchGesture`)

- **Appearance**: Translucent white circle pointer with coral border and central dot.
- **Ripple Effect**: Expanding ring (`scale: 0.8 -> 2.4`, `opacity: 0.7 -> 0`) triggering on frame 45.
- **Timing**: Appears over the target word between frames 25 and 65.

---

## 📋 Learning Insight Bottom Sheet (`TranslationModal.tsx`)

At frame 50, an authentic bottom sheet slides up from the bottom of the device (`bottom: 0`, `borderTopLeftRadius: 38px`, `borderTopRightRadius: 38px`):

- **Target Word Header**: Word (`物理学家`), Pinyin (`wù lǐ xué jiā`), Definition (`Physicist (Noun)`).
- **FULL Sentence Context**: Displays the **entire sentence** from the book:
  - Chinese: `"在那个极度寒冷的冬夜，几位年轻的物理学家聚集在观测台前。"` with stacked Pinyin above each word.
  - English: `"On that extremely cold winter night, a few young physicists gathered in front of the observatory."`

---

## 🎙 Voiceover Track & Audio

- **Narration Engine**: ElevenLabs API
- **Voice ID**: `tnSpp4vdxKPjI9w0GnoV`
- **Audio Asset**: [`public/kanshu_outro_elevenlabs.mp3`](file:///Users/peterridilla/Documents/fun/kanshu/videos/engine/public/kanshu_outro_elevenlabs.mp3)
- **Script**: *"Read Chinese literature without constant lookups. Tap any word for instant learning insights. Download Kanshu today — link in bio."*

---

## 🔗 Connecting the Outro to Core Video Scenes

In future video compositions (e.g. `ToneVideo.tsx`, `EtymologyTemplate.tsx`, or new video series):

1. **Composition Sequence**:
   ```tsx
   <Series>
     <Series.Sequence durationInFrames={300}>
       <CoreEducationalScene targetWord="物理学家" />
     </Series.Sequence>
     <Series.Sequence durationInFrames={425}>
       <KanshuAppOutro targetWord="物理学家" />
     </Series.Sequence>
   </Series>
   ```
2. **Context Continuity**:
   - The `targetWord` analyzed in the core educational scene (e.g. `物理学家`, `休`, `妈妈骑马`) is passed to `KanshuAppOutro` to automatically highlight that word in the e-reader view and populate its definition in the bottom modal sheet.

---

## 🛠 Command Reference

- **Render Preview Still**:
  ```bash
  npx remotion still src/index.ts KanshuAppOutroPreview out/outro_warm_45.png --frame=45
  ```
- **Render Full Video MP4**:
  ```bash
  npx remotion render src/index.ts KanshuAppOutroPreview out/kanshu_outro_warm.mp4
  ```
