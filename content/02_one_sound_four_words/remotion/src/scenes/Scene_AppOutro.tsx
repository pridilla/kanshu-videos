import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig, Audio, staticFile } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, SPRING_BOUNCE, SPRING_SMOOTH, FPS } from '../shared/constants';
import { FloatingParticles } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// SVG BADGES & ICONS
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

const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#FF6F59' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const PointerIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#FF3B30' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5.5 3.214a1 1 0 0 1 1.623-.777l12.43 10.358a1 1 0 0 1-.476 1.722l-5.186 1.037 2.923 5.48a1 1 0 0 1-1.758.938l-2.923-5.48-3.486 3.978A1 1 0 0 1 7 20.73V4.214a1 1 0 0 1-.5-1Safety"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth="1.5"
    />
  </svg>
);

// ────────────────────────────────────────────────────────────
// MAIN APP OUTRO COMPONENT
// ────────────────────────────────────────────────────────────

export const KanshuAppOutro: React.FC<{
  showAudio?: boolean;
  audioSrc?: string;
}> = ({ showAudio = true, audioSrc = 'kanshu_outro_voice.mp3' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── SPRINGS & ANIMATIONS ──
  // Header animation (starts frame 0)
  const headerSpring = spring({ frame, fps, config: SPRING_OVERSHOOT });
  
  // Phone mockup entrance (starts frame 10)
  const phoneSpring = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING_GENTLE });
  const phoneY = interpolate(phoneSpring, [0, 1], [150, 0]);

  // Cursor tap animation sequence (frame 45 -> tap, frame 55 -> popover)
  const cursorProgress = spring({ frame: Math.max(0, frame - 35), fps, config: SPRING_SMOOTH });
  const cursorX = interpolate(cursorProgress, [0, 1], [180, 50]);
  const cursorY = interpolate(cursorProgress, [0, 1], [320, 175]);
  const cursorScale = interpolate(
    frame,
    [35, 52, 58, 65],
    [0.8, 1.2, 0.9, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Tooltip Popover entrance (frame 55)
  const tooltipSpring = spring({ frame: Math.max(0, frame - 55), fps, config: SPRING_BOUNCE });
  
  // App Badges & CTA entrance (frame 80)
  const ctaSpring = spring({ frame: Math.max(0, frame - 80), fps, config: SPRING_OVERSHOOT });

  // Continuous floating oscillation for phone frame
  const floatY = Math.sin(frame / 20) * 6;
  
  // Pulsing glow for CTA button
  const pulseScale = 1 + Math.sin(frame / 12) * 0.03;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FAF9F6',
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(255, 111, 89, 0.12) 0%, rgba(250, 249, 246, 1) 70%)',
        width: 1080,
        height: 1920,
        overflow: 'hidden',
        fontFamily: FONTS.pinyin,
      }}
    >
      {/* Background ambient floating particles */}
      <FloatingParticles count={14} color="#FF6F59" />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TOP BRAND HEADER & HEADLINE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: headerSpring,
          transform: `scale(${interpolate(headerSpring, [0, 1], [0.9, 1])})`,
          zIndex: 10,
        }}
      >
        {/* Kanshu Logo Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px 24px',
            borderRadius: 999,
            border: '1.5px solid rgba(255, 111, 89, 0.25)',
            boxShadow: '0 8px 24px rgba(255, 111, 89, 0.15)',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#FF6F59',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 111, 89, 0.4)',
            }}
          >
            <span style={{ fontFamily: '"ZCOOL KuaiLe", sans-serif', color: '#FFF', fontSize: 20, fontWeight: 700 }}>
              看书
            </span>
          </div>
          <span style={{ fontFamily: FONTS.display, fontSize: 28, color: '#0F172A', fontWeight: 700, letterSpacing: '-0.02em' }}>
            kanshu.app
          </span>
          <span
            style={{
              backgroundColor: '#FF6F59',
              color: '#FFF',
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            AI Reader
          </span>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Read Native Chinese <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #FF6F59 0%, #E11D48 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            With Instant AI Lookup
          </span>
        </h1>

        <p
          style={{
            fontSize: 26,
            color: '#475569',
            marginTop: 14,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          Master Mandarin naturally by reading books you love.
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* CENTER STAGE: SMARTPHONE READER MOCKUP */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 530,
          left: '50%',
          transform: `translateX(-50%) translateY(${phoneY + floatY}px) scale(${phoneSpring})`,
          opacity: phoneSpring,
          width: 720,
          height: 920,
          backgroundColor: '#FFFFFF',
          borderRadius: 48,
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18), 0 0 0 12px #1E293B, 0 0 0 16px rgba(255,255,255,0.4)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        {/* Phone Notch / Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 140,
            height: 28,
            backgroundColor: '#1E293B',
            borderRadius: 20,
            zIndex: 30,
          }}
        />

        {/* E-Reader Top Bar */}
        <div
          style={{
            padding: '54px 36px 16px 36px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFA',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: '#334155' }}>
            《三体》 Chapter 3
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#FF6F59',
              fontWeight: 700,
              backgroundColor: 'rgba(255, 111, 89, 0.1)',
              padding: '4px 12px',
              borderRadius: 12,
            }}
          >
            <SparkleIcon size={14} color="#FF6F59" />
            AI AI Mode
          </div>
        </div>

        {/* E-Reader Chinese Text Page */}
        <div
          style={{
            padding: '36px 40px',
            fontSize: 32,
            lineHeight: 1.8,
            color: '#1E293B',
            fontFamily: '"Noto Serif SC", "Songti SC", serif',
            textAlign: 'justify',
            position: 'relative',
          }}
        >
          <span>在那个极度寒冷的冬夜，几位年轻的 </span>

          {/* Interactive Word target: 物理学家 */}
          <span
            style={{
              position: 'relative',
              backgroundColor: tooltipSpring > 0.1 ? 'rgba(255, 111, 89, 0.25)' : 'transparent',
              color: tooltipSpring > 0.1 ? '#D97706' : '#1E293B',
              borderBottom: tooltipSpring > 0.1 ? '3px solid #FF6F59' : '2px dashed #CBD5E1',
              borderRadius: 6,
              padding: '2px 6px',
              fontWeight: 700,
              transition: 'background-color 0.2s',
            }}
          >
            物理学家
          </span>

          <span> 聚集在观测台前。他们正在探讨宇宙背景辐射的微弱异常信号...</span>

          <p style={{ marginTop: 24, textIndent: '2em', opacity: 0.7 }}>
            这是人类历史上最重要的一次实验，其结果将彻底改变我们对自然法则的认知。
          </p>

          {/* Animated Tap Cursor Pointer */}
          {frame >= 30 && frame <= 85 && (
            <div
              style={{
                position: 'absolute',
                top: cursorY,
                left: cursorX,
                transform: `scale(${cursorScale})`,
                zIndex: 40,
                pointerEvents: 'none',
              }}
            >
              <PointerIcon size={44} color="#FF3B30" />
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* FLOATING GLASSMORPHISM AI TOOLTIP POPOVER */}
          {/* ──────────────────────────────────────────────────────────── */}
          {tooltipSpring > 0.01 && (
            <div
              style={{
                position: 'absolute',
                top: 130,
                left: 30,
                right: 30,
                transform: `scale(${tooltipSpring}) translateY(${interpolate(tooltipSpring, [0, 1], [20, 0])}px)`,
                opacity: tooltipSpring,
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 28,
                padding: 24,
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255, 111, 89, 0.2)',
                border: '1.5px solid rgba(255, 111, 89, 0.3)',
                zIndex: 50,
                fontFamily: FONTS.pinyin,
              }}
            >
              {/* Tooltip Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    物理学家
                    <span style={{ fontSize: 20, color: '#FF6F59', fontWeight: 600 }}>wù lǐ xué jiā</span>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#D97706',
                    fontSize: 14,
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid #FDE68A',
                  }}
                >
                  HSK 5
                </div>
              </div>

              {/* Definition */}
              <div style={{ fontSize: 20, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
                💡 Noun: Physicist
              </div>

              {/* Contextual AI Breakdown */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  padding: '12px 16px',
                  borderRadius: 14,
                  fontSize: 16,
                  color: '#475569',
                  borderLeft: '4px solid #FF6F59',
                  lineHeight: 1.45,
                }}
              >
                <strong>AI Breakdown:</strong> 物理 (physics) + 学家 (specialist). Refers to a scientist specializing in natural physics laws.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* BOTTOM SECTION: APP BADGES & CALL-TO-ACTION */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: ctaSpring,
          transform: `translateY(${interpolate(ctaSpring, [0, 1], [60, 0])}px)`,
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
            marginBottom: 28,
          }}
        >
          {/* iOS App Store Badge */}
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <AppleIcon size={32} />
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' }}>
                Download on the
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                App Store
              </div>
            </div>
          </div>

          {/* Google Play Badge */}
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <GooglePlayIcon size={30} />
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' }}>
                GET IT ON
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                Google Play
              </div>
            </div>
          </div>
        </div>

        {/* Primary Pulsing CTA Button */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            background: 'linear-gradient(135deg, #FF6F59 0%, #DF0A0A 100%)',
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 800,
            padding: '20px 48px',
            borderRadius: 999,
            boxShadow: '0 14px 40px rgba(223, 10, 10, 0.4)',
            transform: `scale(${pulseScale})`,
            letterSpacing: '-0.01em',
          }}
        >
          <span>Start Reading For Free — Link in Bio</span>
        </div>
      </div>

      {/* Reusable Voiceover Audio Track */}
      {showAudio && (
        <Audio src={staticFile(audioSrc)} />
      )}
    </AbsoluteFill>
  );
};
