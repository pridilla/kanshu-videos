import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, SPRING_OVERSHOOT, SPRING_GENTLE, SPRING_BOUNCE, FPS, getLocalFrame, easeOutCubic } from '../shared/constants';
import { FloatingParticles, TVIcon, HeadphonesIcon, ReadingIcon, BrainIcon, SmoothProgressBar, CheckIcon, SoundWaves } from '../shared/Icons';

// ────────────────────────────────────────────────────────────
// ACTION CARDS COMPONENT
// Fixed: no double margin/gap conflict, proper spring with local time
// ────────────────────────────────────────────────────────────

const ActionCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  sub: string;
  index: number;
  time: number;
  startTime: number;
}> = ({ icon, label, sub, index, time, startTime }) => {
  const localTime = time - startTime;
  const frame = Math.max(0, Math.round(localTime * FPS));
  const fps = FPS;
  const delayFrames = index * 10;
  const s = spring({ frame: Math.max(0, frame - delayFrames), fps, config: SPRING_OVERSHOOT });

  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + 0.15 * s})`,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        border: `1px solid ${COLORS.border}`,
        padding: '28px 36px',
        width: 240,
        textAlign: 'center',
        boxShadow: s > 0.9 ? '0 6px 24px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        {icon}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.text, fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: FONTS.body, fontSize: 20, color: COLORS.pinyin, marginTop: 6 }}>{sub}</div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 12-14: Action Cards (41.66s - 45.19s)
// Cards ACCUMULATE — they never disappear, only new ones spring in
// Fixed: clean flex layout, no margin/gap conflicts
// ────────────────────────────────────────────────────────────

export const ActionCardsScene: React.FC<{ time: number; progress: number; cardKey: string }> = ({
  time,
  progress,
  cardKey,
}) => {
  const cards = [
    { key: 'watch', icon: <TVIcon scale={1.3} />, label: 'WATCH', sub: 'Chinese shows' },
    { key: 'listenp', icon: <HeadphonesIcon scale={1.3} />, label: 'LISTEN', sub: 'to podcasts' },
    { key: 'read', icon: <ReadingIcon scale={1.3} />, label: 'READ', sub: 'along with audio' },
  ];

  const startMap: Record<string, number> = { watch: 41.66, listenp: 43.10, read: 44.21 };

  const activeIdx = cards.findIndex((c) => c.key === cardKey);
  const visibleCards = cards.filter((c) => time >= startMap[c.key]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />
      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {visibleCards.map((card, i) => (
          <ActionCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            sub={card.sub}
            index={i}
            time={time}
            startTime={startMap[card.key]}
          />
        ))}
      </div>
      {activeIdx >= 0 && (
        /* Subtitle removed — rendered globally in SilentPeriod.tsx */
        null
      )}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 15: Pattern Match (45.42s - 48.09s)
// Fixed: lines actually flow into brain, not random diagonals
// ────────────────────────────────────────────────────────────

export const PatternScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 45.42, FPS);
  const fps = FPS;

  const springVal = spring({ frame, fps, config: SPRING_GENTLE });

  // Lines animate in flowing toward brain
  const lineProgress = interpolate(
    frame,
    [15, 45],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      <div style={{ position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', opacity: springVal }}>
        <BrainIcon scale={1.8} pulse />
      </div>

      {/* Pattern lines flowing into brain */}
      {lineProgress > 0 && (
        <svg
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80%',
            height: '35%',
            overflow: 'visible',
          }}
          viewBox="0 0 800 300"
        >
          {[0, 1, 2, 3, 4].map((i) => {
            const startX = 50 + i * 170;
            const startY = 280 - i * 40;
            const endX = 400;
            const endY = 80;
            const p = Math.max(0, Math.min(1, lineProgress * 1.5 - i * 0.15));
            const easedP = easeOutCubic(p);
            const curX = startX + (endX - startX) * easedP;
            const curY = startY + (endY - startY) * easedP;
            return (
              <line
                key={i}
                x1={startX}
                y1={startY}
                x2={curX}
                y2={curY}
                stroke={COLORS.primary}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={p * 0.6}
              />
            );
          })}
        </svg>
      )}

      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: `translateX(-50%) scale(${springVal})`,
          opacity: springVal,
          fontFamily: FONTS.display,
          fontSize: 56,
          color: COLORS.text,
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        PATTERN MATCH
      </div>
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONTS.body,
          fontSize: 26,
          color: COLORS.pinyin,
          opacity: springVal,
          textAlign: 'center',
        }}
      >
        let your brain do what it knows
      </div>

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 16: Speech Emerges (48.36s - 52.17s)
// Fixed: progress bar fills with ease-out, checkmark draws on
// ────────────────────────────────────────────────────────────

export const EmergeScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 48.36, FPS);
  const fps = FPS;

  const fillP = easeOutCubic(Math.min(1, progress * 1.4));
  const speechSpring = time > 50.0
    ? spring({ frame: Math.max(0, Math.round((time - 50.0) * FPS)), fps, config: SPRING_OVERSHOOT })
    : 0;

  const checkProgress = fillP > 0.95
    ? interpolate(frame, [Math.round((50.0 - 48.36) * FPS), Math.round((50.5 - 48.36) * FPS)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)', width: 600 }}>
        <SmoothProgressBar progress={fillP} width={600} height={18} />
        <div style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.pinyin, marginTop: 10, textAlign: 'center' }}>
          Input Accumulated
        </div>
        {fillP > 0.95 && (
          <div style={{ position: 'absolute', right: -16, top: -16 }}>
            <CheckIcon scale={1.2} drawProgress={checkProgress} />
          </div>
        )}
      </div>

      {/* Speech emerges */}
      {speechSpring > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translateX(-50%) scale(${speechSpring})`,
            opacity: speechSpring,
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: FONTS.display, fontSize: 56, color: COLORS.text, lineHeight: 1.1 }}>Speech emerges</div>
          <div style={{ fontFamily: FONTS.display, fontSize: 48, color: COLORS.primary, marginTop: 10, lineHeight: 1.1 }}>
            naturally
          </div>
        </div>
      )}

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 17: Don't Force It → It Comes (52.40s - 53.99s)
// Fixed: proper stacking, no fragile absolute inside relative
// ────────────────────────────────────────────────────────────

export const NoForceScene: React.FC<{ time: number; progress: number; cardKey: string }> = ({
  time,
  progress,
  cardKey,
}) => {
  const frame = getLocalFrame(time, 52.40, FPS);
  const fps = FPS;

  const dontFade = easeOutCubic(Math.min(1, (time - 52.4) / 0.6));
  const comesSpring = cardKey === 'comes' || time >= 53.41
    ? spring({ frame: Math.max(0, Math.round((time - 53.41) * FPS)), fps, config: SPRING_OVERSHOOT })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />
      <div
        style={{
          position: 'absolute',
          top: '26%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: dontFade,
        }}
      >
        <div style={{ fontFamily: FONTS.display, fontSize: 58, color: COLORS.text, lineHeight: 1.1 }}>
          YOU DON'T FORCE IT
        </div>
      </div>

      {time >= 53.41 && (
        <div
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            transform: `translateX(-50%) scale(${comesSpring})`,
            opacity: comesSpring,
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: FONTS.display, fontSize: 80, color: COLORS.primary, fontWeight: 800, lineHeight: 1.1 }}>
            IT COMES.
          </div>
        </div>
      )}

      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 18: Guilt (54.26s - 57.09s)
// ────────────────────────────────────────────────────────────

export const GuiltScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 54.26, FPS);
  const fps = FPS;
  const dontSpring = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_OVERSHOOT });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />
      <div
        style={{
          position: 'absolute',
          top: '24%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 54,
            color: COLORS.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          FEELING GUILTY?
          <span style={{ color: COLORS.primary, fontSize: 44, fontWeight: 800 }}>✕</span>
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 96,
            color: COLORS.primary,
            fontWeight: 800,
            marginTop: 20,
            opacity: dontSpring,
            transform: `scale(${dontSpring})`,
            lineHeight: 1,
          }}
        >
          DON'T.
        </div>
      </div>
      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 19: Supposed to Be Silent (57.52s - 58.57s)
// ────────────────────────────────────────────────────────────

export const BeTrueScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 57.52, FPS);
  const fps = FPS;
  const springVal = spring({ frame, fps, config: SPRING_GENTLE });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={8} />
      <div
        style={{
          position: 'absolute',
          top: '26%',
          left: '50%',
          transform: `translateX(-50%) scale(${springVal})`,
          opacity: springVal,
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: FONTS.display, fontSize: 66, color: COLORS.text, lineHeight: 1.15 }}>
          You're supposed
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 66, color: COLORS.text, marginTop: 10, lineHeight: 1.15 }}>
          to be <span style={{ color: COLORS.primary }}>silent</span>.
        </div>
      </div>
      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────
// SCENE 20: Closing (58.94s - 60.57s)
// Fixed: spring-based pulse instead of robotic sin wave
// ────────────────────────────────────────────────────────────

export const ReadyScene: React.FC<{ time: number; progress: number }> = ({ time, progress }) => {
  const frame = getLocalFrame(time, 58.94, FPS);
  const fps = FPS;

  const textSpring = spring({ frame, fps, config: SPRING_GENTLE });

  // Organic pulse using spring-like sine combo
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.08) * Math.sin(frame * 0.03 + 1);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <FloatingParticles count={10} />
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: `translateX(-50%)`,
          textAlign: 'center',
          opacity: textSpring,
        }}
      >
        <div style={{ fontFamily: FONTS.display, fontSize: 56, color: COLORS.body, lineHeight: 1.2 }}>
          The words will come
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 56, color: COLORS.body, marginTop: 10, lineHeight: 1.2 }}>
          when they're ready.
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 52,
            color: COLORS.primary,
            marginTop: 28,
            opacity: pulse,
            fontWeight: 700,
          }}
        >
          Just Listen.
        </div>
      </div>
      {/* Subtitle removed — rendered globally in SilentPeriod.tsx */}
    </AbsoluteFill>
  );
};
