import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing, useCurrentFrame, useVideoConfig, Audio, staticFile, Img } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, SPRING_BOUNCE, SPRING_SMOOTH } from '../shared/constants';
import { FloatingParticles } from './Icons';

// ────────────────────────────────────────────────────────────
// SVG BADGES & TOUCH GESTURE INDICATOR
// ────────────────────────────────────────────────────────────

const AppleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.96.99-3.1-.97.04-2.14.65-2.83 1.45-.62.72-1.16 1.88-1.01 3 .09.01.21.02.32.02.88 0 1.87-.55 2.53-1.37z" />
  </svg>
);

const GooglePlayIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#410099" d="M3.609 1.814L13.792 12 3.61 22.186a2.37 2.37 0 0 1-.61-1.616V3.43c0-.624.225-1.203.609-1.616z" />
    <path fill="#00E676" d="M17.156 8.636l2.977 1.719c1.078.623 1.078 2.667 0 3.29l-2.977 1.719-3.364-3.364 3.364-3.364z" />
    <path fill="#FF3D00" d="M3.609 1.814L13.792 12l3.364-3.364L4.856.914A2.39 2.39 0 0 0 3.609 1.814z" />
    <path fill="#FFC107" d="M3.609 22.186L13.792 12l3.364 3.364-12.3 7.722a2.39 2.39 0 0 1-1.247-.899z" />
  </svg>
);

// Dynamic 4-Seed Paper Grain Texture Component
const PaperGrainTexture: React.FC<{ seed: number; opacity?: number }> = ({ seed, opacity = 0.045 }) => {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity, zIndex: 2 }}>
      <filter id={`paper-noise-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" seed={seed} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#paper-noise-${seed})`} />
    </svg>
  );
};

// Realistic Touch Ripple Gesture Indicator
const TouchGesture: React.FC<{ progress: number }> = ({ progress }) => {
  const scale = interpolate(progress, [0, 0.4, 0.55, 0.75, 1], [1.3, 1.0, 0.85, 1.1, 1.0]);
  const opacity = interpolate(progress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);
  const rippleScale = interpolate(progress, [0.45, 0.85], [0.8, 2.4]);
  const rippleOpacity = interpolate(progress, [0.45, 0.65, 0.85], [0, 0.7, 0]);

  return (
    <div style={{ position: 'relative', opacity, zIndex: 60 }}>
      {/* Tap Ripple Ring */}
      {progress >= 0.4 && (
        <div
          style={{
            position: 'absolute',
            top: -26,
            left: -26,
            width: 88,
            height: 88,
            borderRadius: '50%',
            border: '3.5px solid #FF6F59',
            backgroundColor: 'rgba(255, 111, 89, 0.22)',
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Touch Circle Pointer */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '3.5px solid #FF6F59',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          transform: `scale(${scale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FF6F59' }} />
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// MAIN REDESIGNED WARM KANSHU OUTRO COMPONENT
// ────────────────────────────────────────────────────────────

export const KanshuAppOutro: React.FC<{
  showAudio?: boolean;
  audioSrc?: string;
}> = ({ showAudio = true, audioSrc = 'kanshu_outro_elevenlabs.mp3' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── 1. 4 DIFFERENT PAPER TEXTURES CYCLING EVERY 0.5s (30 FRAMES) ──
  const paperSeeds = [14, 48, 82, 126];
  const activeSeedIndex = Math.floor(frame / 30) % 4;
  const activePaperSeed = paperSeeds[activeSeedIndex];

  // ── 2. QUADRATIC IN/OUT MOVING BACKGROUND GRID ──
  const gridIn = interpolate(frame, [0, 45], [0, 1], { easing: Easing.quad, extrapolateRight: 'clamp' });
  const gridOut = interpolate(frame, [380, 425], [0, 1], { easing: Easing.quad, extrapolateLeft: 'clamp' });
  const gridOpacity = gridIn * (1 - gridOut) * 0.08;
  const gridOffsetY = interpolate(gridIn, [0, 1], [40, 0]) + interpolate(gridOut, [0, 1], [0, -40]);

  // ── SPRINGS & ANIMATIONS ──
  const headerSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });
  const phoneSpring = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING_GENTLE });
  const phoneY = interpolate(phoneSpring, [0, 1], [120, 0]);

  // Touch gesture sequence (frame 25 -> 65, touch tap at frame 45)
  const gestureProgress = interpolate(frame, [25, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const modalSpring = spring({ frame: Math.max(0, frame - 50), fps, config: SPRING_SMOOTH });
  const ctaSpring = spring({ frame: Math.max(0, frame - 80), fps, config: SPRING_OVERSHOOT });

  // Floating gentle movement for phone frame
  const floatY = Math.sin(frame / 22) * 6;
  const pulseScale = 1 + Math.sin(frame / 14) * 0.025;

  // Richer, longer Chinese book text tokens filling the phone screen completely (no trailing three dots!)
  const paragraph1Tokens = [
    { word: '在那个', chars: ['在', '那', '个'], pinyins: ['zài', 'nà', 'gè'] },
    { word: '极度', chars: ['极', '度'], pinyins: ['jí', 'dù'] },
    { word: '寒冷的', chars: ['寒', '冷', '的'], pinyins: ['hán', 'lěng', 'de'] },
    { word: '冬夜，', chars: ['冬', '夜', '，'], pinyins: ['dōng', 'yè', ''] },
    { word: '几位', chars: ['几', '位'], pinyins: ['jǐ', 'wèi'] },
    { word: '年轻的', chars: ['年', '轻', '的'], pinyins: ['nián', 'qīng', 'de'] },
    { word: '物理学家', chars: ['物', '理', '学', '家'], pinyins: ['wù', 'lǐ', 'xué', 'jiā'], isTarget: true },
    { word: '聚集在', chars: ['聚', '集', '在'], pinyins: ['jù', 'jí', 'zài'] },
    { word: '观测台前。', chars: ['观', '测', '台', '前', '。'], pinyins: ['guān', 'cè', 'tái', 'qián', ''] },
    { word: '他们正在', chars: ['他', '们', '正', '在'], pinyins: ['tā', 'men', 'zhèng', 'zài'] },
    { word: '探讨', chars: ['探', '讨'], pinyins: ['tàn', 'tǎo'] },
    { word: '宇宙背景辐射的', chars: ['宇', '宙', '背', '景', '辐', '射', '的'], pinyins: ['yǔ', 'zhòu', 'bèi', 'jǐng', 'fú', 'shè', 'de'] },
    { word: '微弱异常', chars: ['微', '弱', '异', '常'], pinyins: ['wēi', 'ruò', 'yì', 'cháng'] },
    { word: '信号。', chars: ['信', '号', '。'], pinyins: ['xìn', 'hào', ''] },
  ];

  const paragraph2Tokens = [
    { word: '这是人类', chars: ['这', '是', '人', '类'], pinyins: ['zhè', 'shì', 'rén', 'lèi'] },
    { word: '历史上', chars: ['历', '史', '上'], pinyins: ['lì', 'shǐ', 'shàng'] },
    { word: '最重要的', chars: ['最', '重', '要', '的'], pinyins: ['zuì', 'zhòng', 'yào', 'de'] },
    { word: '一次实验，', chars: ['一', '次', '实', '验', '，'], pinyins: ['yī', 'cì', 'shí', 'yàn', ''] },
    { word: '其结果将', chars: ['其', '结', '果', '将'], pinyins: ['qí', 'jié', 'guǒ', 'jiāng'] },
    { word: '彻底改变', chars: ['彻', '底', '改', '变'], pinyins: ['chè', 'dǐ', 'gǎi', 'biàn'] },
    { word: '我们对', chars: ['我', '们', '对'], pinyins: ['wǒ', 'men', 'duì'] },
    { word: '自然法则的', chars: ['自', '然', '法', '则', '的'], pinyins: ['zì', 'rán', 'fǎ', 'zé', 'de'] },
    { word: '认知。', chars: ['认', '知', '。'], pinyins: ['rèn', 'zhī', ''] },
  ];

  const paragraph3Tokens = [
    { word: '窗外的', chars: ['窗', '外', '的'], pinyins: ['chuāng', 'wài', 'de'] },
    { word: '风暴在咆哮，', chars: ['风', '暴', '在', '咆', '哮', '，'], pinyins: ['fēng', 'bào', 'zài', 'páo', 'xiào', ''] },
    { word: '但实验室里', chars: ['但', '实', '验', '室', '里'], pinyins: ['dàn', 'shí', 'yàn', 'shì', 'lǐ'] },
    { word: '只有机器的', chars: ['只', '有', '机', '器', '的'], pinyins: ['zhǐ', 'yǒu', 'jī', 'qì', 'de'] },
    { word: '低吟', chars: ['低', '吟'], pinyins: ['dī', 'yín'] },
    { word: '与紧张的', chars: ['与', '紧', '张', '的'], pinyins: ['yǔ', 'jǐn', 'zhāng', 'de'] },
    { word: '心跳声。', chars: ['心', '跳', '声', '。'], pinyins: ['xīn', 'tiào', 'shēng', ''] },
  ];

  const paragraph4Tokens = [
    { word: '如果这个', chars: ['如', '果', '这', '个'], pinyins: ['rú', 'guǒ', 'zhè', 'gè'] },
    { word: '假设被证实，', chars: ['假', '设', '被', '证', '实', '，'], pinyins: ['jiǎ', 'shè', 'bèi', 'zhèng', 'shí', ''] },
    { word: '全新的', chars: ['全', '新', '的'], pinyins: ['quán', 'xīn', 'de'] },
    { word: '纪元即将开启。', chars: ['纪', '元', '即', '将', '开', '启', '。'], pinyins: ['jì', 'yuán', 'jí', 'jiāng', 'kāi', 'qǐ', ''] },
    { word: '所有研究人员', chars: ['所', '有', '研', '究', '人', '员'], pinyins: ['suǒ', 'yǒu', 'yán', 'jiū', 'rén', 'yuán'] },
    { word: '都在屏息凝视。', chars: ['都', '在', '屏', '息', '凝', '视', '。'], pinyins: ['dōu', 'zài', 'píng', 'xī', 'níng', 'shì', ''] },
  ];

  // Helper renderer: display inline with zero margin/padding between words, and small gap above characters
  const renderTokens = (tokens: typeof paragraph1Tokens) =>
    tokens.map((token, wIdx) => {
      const isTarget = !!token.isTarget;

      return (
        <span
          key={wIdx}
          className="word-container"
          style={{
            display: 'inline',
            backgroundColor: isTarget && modalSpring > 0.1 ? 'rgba(255, 111, 89, 0.25)' : 'transparent',
            color: isTarget && modalSpring > 0.1 ? '#FF6F59' : 'inherit',
            borderBottom: isTarget ? '3.5px solid #FF6F59' : 'none',
            borderRadius: isTarget ? 3 : 0,
            position: 'relative',
          }}
        >
          {token.chars.map((char, cIdx) => (
            <ruby key={cIdx} style={{ rubyAlign: 'center' }}>
              {char}
              {token.pinyins[cIdx] ? (
                <rt
                  style={{
                    fontSize: '0.48em',
                    color: isTarget && modalSpring > 0.1 ? '#FF6F59' : '#8E8E93',
                    rubyPosition: 'over',
                    paddingBottom: 3, // Clean small vertical gap between Pinyin and Chinese character!
                  }}
                >
                  {token.pinyins[cIdx]}
                </rt>
              ) : (
                <rt style={{ fontSize: '0.48em', rubyPosition: 'over', paddingBottom: 3 }}>&nbsp;</rt>
              )}
            </ruby>
          ))}

          {/* Touch Gesture Pointer Positioned Over Target Word */}
          {isTarget && frame >= 25 && frame <= 65 && (
            <span
              style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'inline-block',
              }}
            >
              <TouchGesture progress={gestureProgress} />
            </span>
          )}
        </span>
      );
    });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FAF9F6', // Warm off-white paper canvas from brand.md
        backgroundImage: 'radial-gradient(circle at 50% 16%, rgba(255, 111, 89, 0.09) 0%, rgba(250, 249, 246, 1) 75%)',
        width: 1080,
        height: 1920,
        overflow: 'hidden',
        fontFamily: FONTS.pinyin,
      }}
    >
      {/* 1. DISCRETE 4-SEED PAPER TEXTURE OVERLAY (CYCLES EVERY 0.5 SECONDS) */}
      <PaperGrainTexture seed={activePaperSeed} opacity={0.042} />

      {/* 2. SUBTLE QUADRATIC MOVING BACKGROUND GRID */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          backgroundImage: `linear-gradient(rgba(255, 111, 89, 0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 111, 89, 0.14) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          opacity: gridOpacity,
          transform: `translateY(${gridOffsetY}px)`,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Warm ambient background floating particles */}
      <FloatingParticles count={14} color="#FF6F59" />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. TOP BRAND HEADER & OFFICIAL WEBSITE SVG LOGO */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: headerSpring,
          transform: `scale(${interpolate(headerSpring, [0, 1], [0.92, 1])})`,
          zIndex: 10,
          padding: '0 40px',
        }}
      >
        {/* Brand Logo Tag with Official Website Favicon SVG */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            backgroundColor: '#FFFFFF',
            padding: '12px 32px',
            borderRadius: 999,
            border: '1.5px solid rgba(255, 111, 89, 0.25)',
            boxShadow: '0 8px 24px rgba(255, 111, 89, 0.14)',
            marginBottom: 16,
          }}
        >
          {/* Official Website Favicon SVG Icon */}
          <Img
            src={staticFile('kanshu_favicon.svg')}
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              boxShadow: '0 4px 14px rgba(255, 111, 89, 0.35)',
            }}
          />

          {/* Clean Slogan / App Name in Finger Paint */}
          <span style={{ fontFamily: FONTS.display, fontSize: 40, color: '#0F172A', fontWeight: 500 }}>
            kanshu.app
          </span>
        </div>

        {/* Hand-drawn Playful Slogan (Finger Paint font per brand.md) */}
        <h1
          style={{
            fontFamily: FONTS.display,
            fontSize: 44,
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          Read Chinese Literature <br />
          <span style={{ color: '#FF6F59' }}>Without Constant Lookups</span>
        </h1>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. REALISTIC IPHONE 17 MOCKUP (580px × 1240px, ratio 0.468) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 360,
          left: '50%',
          transform: `translateX(-50%) translateY(${phoneY + floatY}px) scale(${phoneSpring})`,
          opacity: phoneSpring,
          width: 580,           // Compact device width -> Zero text overlaps with header & CTA!
          height: 1240,         // Exact 19.5:9 flagship iPhone proportions (580 / 1240 = 0.468)
          backgroundColor: '#FFFFFF',
          borderRadius: 48,     // Sleek modern iPhone chassis corner radius
          boxShadow: '0 30px 90px rgba(15, 23, 42, 0.22), 0 0 0 10px #0F172A, 0 0 0 14px rgba(255,255,255,0.7)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        {/* Dynamic Island Pill Cutout */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 140,
            height: 26,
            backgroundColor: '#0F172A',
            borderRadius: 16,
            zIndex: 30,
          }}
        />

        {/* E-Reader Top Bar */}
        <div
          style={{
            padding: '48px 24px 12px 24px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFA',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: '#334155', fontFamily: 'Inter, sans-serif' }}>
            《三体》 Chapter 3
          </div>
          <div
            style={{
              fontSize: 15,
              color: '#FF6F59',
              fontWeight: 800,
              backgroundColor: 'rgba(255, 111, 89, 0.12)',
              padding: '5px 12px',
              borderRadius: 12,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            AI Reader Mode
          </div>
        </div>

        {/* E-READER DISPLAY WITH LARGER FONT SIZE (31px) FULLY FILLING THE PHONE DISPLAY */}
        <div
          style={{
            padding: '24px 28px',
            fontSize: 31,
            lineHeight: 1.85,
            color: '#1E293B',
            fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif', // Sans-serif per user request!
            position: 'relative',
            height: '100%',
            fontWeight: 400,
          }}
        >
          <p style={{ margin: 0, textIndent: '2em', textAlign: 'justify', marginBottom: 14 }}>
            {renderTokens(paragraph1Tokens)}
          </p>

          <p style={{ margin: 0, textIndent: '2em', textAlign: 'justify', marginBottom: 14 }}>
            {renderTokens(paragraph2Tokens)}
          </p>

          <p style={{ margin: 0, textIndent: '2em', textAlign: 'justify', marginBottom: 14 }}>
            {renderTokens(paragraph3Tokens)}
          </p>

          <p style={{ margin: 0, textIndent: '2em', textAlign: 'justify', opacity: 0.9 }}>
            {renderTokens(paragraph4Tokens)}
          </p>
        </div>

        {/* Dim overlay behind sheet so book characters stay visible in background */}
        {modalSpring > 0.01 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.18)',
              opacity: modalSpring,
              zIndex: 40,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/* 3. AUTHENTIC BOTTOM LEARNING INSIGHT MODAL SHEET */}
        {/* ──────────────────────────────────────────────────────────── */}
        {modalSpring > 0.01 && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,            // Anchored cleanly to bottom of phone screen!
              left: 0,
              right: 0,
              transform: `translateY(${interpolate(modalSpring, [0, 1], [600, 0])}px)`,
              opacity: modalSpring,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(24px)',
              borderTopLeftRadius: 38,
              borderTopRightRadius: 38,
              boxShadow: '0 -20px 60px rgba(0, 0, 0, 0.25)',
              borderTop: '1.5px solid rgba(255, 111, 89, 0.3)',
              overflow: 'hidden',
              zIndex: 50,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Grab Bar Handle */}
            <div style={{ width: '100%', alignItems: 'center', paddingTop: 14, paddingBottom: 6, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 48, height: 6, borderRadius: 3, backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
            </div>

            <div style={{ padding: '16px 28px 36px 28px' }}>
              {/* Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>Learning Insight</span>
                  <span
                    style={{
                      backgroundColor: '#FF6F59',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: 12,
                      padding: '4px 12px',
                      borderRadius: 12,
                      letterSpacing: '0.05em',
                    }}
                  >
                    PREMIUM AI
                  </span>
                </div>
              </div>

              {/* Word & Definition Section */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 2 }}>
                  Word
                </div>
                <div style={{ fontSize: 50, fontWeight: 900, color: '#0F172A', fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.1 }}>
                  物理学家
                </div>
                <div style={{ fontSize: 24, fontStyle: 'italic', color: '#8E8E93', marginTop: 2, marginBottom: 2 }}>wù lǐ xué jiā</div>
                <div style={{ fontSize: 20, color: '#334155', fontWeight: 600 }}>Physicist (Noun)</div>
              </div>

              <div style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.08)', margin: '12px 0' }} />

              {/* Sentence Context Section with FULL sentence & FULL English translation */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#FF6F59', textTransform: 'uppercase', marginBottom: 8 }}>
                  Sentence Context
                </div>

                {/* FULL Chinese Sentence with Authentic Stacked Ruby Pinyin Layout */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '4px 6px', marginBottom: 12 }}>
                  {[
                    { char: '在那个', pinyin: 'zài nà gè' },
                    { char: '极度', pinyin: 'jí dù' },
                    { char: '寒冷的', pinyin: 'hán lěng de' },
                    { char: '冬夜，', pinyin: 'dōng yè,' },
                    { char: '几位', pinyin: 'jǐ wèi' },
                    { char: '年轻的', pinyin: 'nián qīng de' },
                    { char: '物理学家', pinyin: 'wù lǐ xué jiā', isTarget: true },
                    { char: '聚集在', pinyin: 'jù jí zài' },
                    { char: '观测台前。', pinyin: 'guān cè tái qián.' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, lineHeight: '13px', color: item.isTarget ? '#FF6F59' : '#8E8E93', fontWeight: item.isTarget ? 800 : 500 }}>
                        {item.pinyin}
                      </span>
                      <span style={{ fontSize: 22, lineHeight: '24px', color: item.isTarget ? '#FF6F59' : '#0F172A', fontWeight: item.isTarget ? 800 : 600, fontFamily: '"Noto Sans SC", sans-serif' }}>
                        {item.char}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FULL English Translation */}
                <div style={{ fontSize: 16, fontStyle: 'italic', color: '#475569', lineHeight: 1.45 }}>
                  "On that extremely cold winter night, a few young physicists gathered in front of the observatory."
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom iPhone Home Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 140,
            height: 4,
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 2,
            zIndex: 60,
          }}
        />
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. BOTTOM SECTION: DUAL APP BADGES & FINGER PAINT CTA */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: ctaSpring,
          transform: `translateY(${interpolate(ctaSpring, [0, 1], [50, 0])}px)`,
          zIndex: 20,
        }}
      >
        {/* App Store & Google Play Badges Side-by-Side */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            marginBottom: 20,
          }}
        >
          {/* Apple App Store */}
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <AppleIcon size={30} />
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.8 }}>Download on the</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>App Store</div>
            </div>
          </div>

          {/* Google Play Store */}
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <GooglePlayIcon size={28} />
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.8 }}>GET IT ON</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Google Play</div>
            </div>
          </div>
        </div>

        {/* Primary Warm CTA Button (Finger Paint Font per brand.md) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FF6F59',
            color: '#FFFFFF',
            fontFamily: FONTS.display,
            fontSize: 26,
            fontWeight: 700,
            padding: '18px 44px',
            borderRadius: 999,
            boxShadow: '0 12px 36px rgba(255, 111, 89, 0.4)',
            transform: `scale(${pulseScale})`,
          }}
        >
          <span>Start Reading For Free — Link in Bio</span>
        </div>
      </div>

      {/* Voiceover Audio Track */}
      {showAudio && (
        <Audio src={staticFile(audioSrc)} />
      )}
    </AbsoluteFill>
  );
};
