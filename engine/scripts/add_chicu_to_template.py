#!/usr/bin/env python3
import re

template_file = '/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/templates/EtymologyTemplate.tsx'

with open(template_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add isChicu declaration
content = content.replace(
    "const isDongxi = character === '东西';",
    "const isChicu = character === '吃醋';\n  const isDongxi = character === '东西';"
)

# 2. Add isChicu to isHeroWordPhase or custom hook
# For isChicu:
# Frame 0 - 75: "JEALOUS"
# Frame 75 - 169: Intact 吃醋 + "JEALOUS"
# Frame 169 - 271: "LITERALLY: EATING VINEGAR"
# Frame 271 - 324: "BUT WHY?"

content = content.replace(
    "const isHeroWordPhase = (isXihuan || isDongxi) && frame < 75;",
    "const isHeroWordPhase = (isXihuan || isDongxi || isChicu) && frame < 75;"
)

# 3. Add isChicu charSpacing
content = content.replace(
    "const charSpacing = isKaishi || isXihuan || isDongxi ? 120 : 150;",
    "const charSpacing = isKaishi || isXihuan || isDongxi || isChicu ? 120 : 150;"
)

# 4. Add spotlight coordinates for Scene 2 (吃: 口 left, 乞 right, 吃 whole)
old_spot2 = """  if (isDongxi) {
    if (isScreen2TopBang) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 140;
    } else if (isScreen2BottomJin) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 150;
    } else if (isScreen2WholeBang) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 160;
    }
  }"""

new_spot2 = """  if (isChicu) {
    if (isScreen2TopBang) {
      // 口 (left)
      spot2X = 460;
      spot2Y = 160;
      spot2R = 100;
    } else if (isScreen2BottomJin) {
      // 乞 (right)
      spot2X = 610;
      spot2Y = 160;
      spot2R = 110;
    } else if (isScreen2WholeBang) {
      // 吃 (whole)
      spot2X = 540;
      spot2Y = 160;
      spot2R = 150;
    }
  } else if (isDongxi) {
    if (isScreen2TopBang) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 140;
    } else if (isScreen2BottomJin) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 150;
    } else if (isScreen2WholeBang) {
      spot2X = 540;
      spot2Y = 160;
      spot2R = 160;
    }
  }"""
content = content.replace(old_spot2, new_spot2)

# 5. Add spotlight coordinates for Scene 3 (醋: 酉 left, 昔 right, 醋 whole)
old_spot3 = """  if (isDongxi) {
    if (isScreen3LeftQie) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    } else if (isScreen3RightLi) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    } else if (isScreen3WholeZhu) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 160;
    }
  }"""

new_spot3 = """  if (isChicu) {
    if (isScreen3LeftQie) {
      // 酉 (left)
      spot3X = 450;
      spot3Y = 160;
      spot3R = 110;
    } else if (isScreen3RightLi) {
      // 昔 (right)
      spot3X = 620;
      spot3Y = 160;
      spot3R = 110;
    } else if (isScreen3WholeZhu) {
      // 醋 (whole)
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    }
  } else if (isDongxi) {
    if (isScreen3LeftQie) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    } else if (isScreen3RightLi) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 150;
    } else if (isScreen3WholeZhu) {
      spot3X = 540;
      spot3Y = 160;
      spot3R = 160;
    }
  }"""
content = content.replace(old_spot3, new_spot3)

# 6. Emojis data
old_emojis = """  const emojisData = isDongxi
    ? [
        { emoji: '📦', label: '物 (Goods)', angleOffset: -Math.PI / 4, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedCloth },
        { emoji: '🧭', label: '东西 (East & West)', angleOffset: 5 * Math.PI / 4, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedWall },
      ]
    : isXihuan"""

new_emojis = """  const emojisData = isChicu
    ? [
        { emoji: '🍜', label: '吃 (Eating)', angleOffset: -Math.PI / 4, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedCloth },
        { emoji: '🍶', label: '醋 (Vinegar)', angleOffset: 5 * Math.PI / 4, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedWall },
      ]
    : isDongxi
    ? [
        { emoji: '📦', label: '物 (Goods)', angleOffset: -Math.PI / 4, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedCloth },
        { emoji: '🧭', label: '东西 (East & West)', angleOffset: 5 * Math.PI / 4, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedWall },
      ]
    : isXihuan"""
content = content.replace(old_emojis, new_emojis)

# 7. Hero Word Takeover Text for isChicu
old_hero_words = """{isHeroWordPhase && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            pointerEvents: 'none',
          }}
        >
          {isWordChinese && (
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 140,
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '0.04em',
                transform: `scale(${interpolate(springChinese, [0, 1], [0.4, 1.0])})`,
                filter: 'drop-shadow(0 15px 30px rgba(15, 23, 42, 0.2))',
              }}
            >
              CHINESE
            </div>
          )}
          {isWordIs && (
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 140,
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '0.04em',
                transform: `scale(${interpolate(springIs, [0, 1], [0.4, 1.0])})`,
                filter: 'drop-shadow(0 15px 30px rgba(15, 23, 42, 0.2))',
              }}
            >
              IS
            </div>
          )}
          {isWordWild && (
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 150,
                fontWeight: 900,
                color: '#FF6F59',
                letterSpacing: '0.04em',
                transform: `scale(${interpolate(springWild, [0, 1], [0.4, 1.25])})`,
                filter: 'drop-shadow(0 20px 50px rgba(255, 111, 89, 0.7))',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span>WILD</span>
              <span style={{ fontSize: 160 }}>🔥</span>
            </div>
          )}
        </AbsoluteFill>
      )}"""

new_hero_words = """{isHeroWordPhase && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            pointerEvents: 'none',
          }}
        >
          {isChicu ? (
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 130,
                fontWeight: 900,
                color: '#FF6F59',
                letterSpacing: '0.04em',
                transform: `scale(${interpolate(springChinese, [0, 1], [0.4, 1.1])})`,
                filter: 'drop-shadow(0 20px 50px rgba(255, 111, 89, 0.6))',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span>JEALOUS</span>
              <span style={{ fontSize: 130 }}>😒</span>
            </div>
          ) : (
            <>
              {isWordChinese && (
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 140,
                    fontWeight: 900,
                    color: '#0F172A',
                    letterSpacing: '0.04em',
                    transform: `scale(${interpolate(springChinese, [0, 1], [0.4, 1.0])})`,
                    filter: 'drop-shadow(0 15px 30px rgba(15, 23, 42, 0.2))',
                  }}
                >
                  CHINESE
                </div>
              )}
              {isWordIs && (
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 140,
                    fontWeight: 900,
                    color: '#0F172A',
                    letterSpacing: '0.04em',
                    transform: `scale(${interpolate(springIs, [0, 1], [0.4, 1.0])})`,
                    filter: 'drop-shadow(0 15px 30px rgba(15, 23, 42, 0.2))',
                  }}
                >
                  IS
                </div>
              )}
              {isWordWild && (
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 150,
                    fontWeight: 900,
                    color: '#FF6F59',
                    letterSpacing: '0.04em',
                    transform: `scale(${interpolate(springWild, [0, 1], [0.4, 1.25])})`,
                    filter: 'drop-shadow(0 20px 50px rgba(255, 111, 89, 0.7))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <span>WILD</span>
                  <span style={{ fontSize: 160 }}>🔥</span>
                </div>
              )}
            </>
          )}
        </AbsoluteFill>
      )}"""
content = content.replace(old_hero_words, new_hero_words)

# 8. Headers for isChicu
old_header_s1 = """                <h1 style={{ fontFamily: FONTS.display, fontSize: 48, color: '#FF6F59', margin: 0, fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  CHINESE IS WILD 🔥
                </h1>
                <div style={{ fontFamily: FONTS.display, fontSize: 28, color: '#FFFFFF', fontWeight: 700 }}>
                  {isDongxi ? 'Why ' : 'Why '}<span style={{ color: '#FF6F59' }}>{character}</span> = {isDongxi ? 'East + West = Things?!' : 'War Drum + Cheering!'}
                </div>"""

new_header_s1 = """                <h1 style={{ fontFamily: FONTS.display, fontSize: 48, color: '#FF6F59', margin: 0, fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {isChicu ? 'JEALOUS 😒' : 'CHINESE IS WILD 🔥'}
                </h1>
                <div style={{ fontFamily: FONTS.display, fontSize: 28, color: '#FFFFFF', fontWeight: 700 }}>
                  {isChicu ? (
                    <span>Why <span style={{ color: '#FF6F59' }}>{character}</span> = Eating Vinegar?!</span>
                  ) : isDongxi ? (
                    <span>Why <span style={{ color: '#FF6F59' }}>{character}</span> = East + West = Things?!</span>
                  ) : (
                    <span>Why <span style={{ color: '#FF6F59' }}>{character}</span> = War Drum + Cheering!</span>
                  )}
                </div>"""
content = content.replace(old_header_s1, new_header_s1)

old_header_s2 = """                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 940 }}>
                  Character 1: <span style={{ color: '#FF6F59' }}>{char1} ({isDongxi ? 'dōng' : isXihuan ? 'xǐ' : isKaishi ? 'kāi' : isJieshao ? 'jiè' : isWangji ? 'wàng' : isAiqing ? 'ài' : isPengyou ? 'péng' : 'bāng'})</span> — {isDongxi ? 'Sunrise & Travel Sack' : isXihuan ? 'Celebratory War Drum' : isKaishi ? 'Opening the Gate' : isJieshao ? 'Go-Between' : isWangji ? 'Disappearing Heart' : isAiqing ? 'Hand Embracing Friend' : isPengyou ? 'Twin Companions' : 'Protective Backing'}
                </h2>"""

new_header_s2 = """                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 940 }}>
                  Character 1: <span style={{ color: '#FF6F59' }}>{char1} ({isChicu ? 'chī' : isDongxi ? 'dōng' : isXihuan ? 'xǐ' : isKaishi ? 'kāi' : isJieshao ? 'jiè' : isWangji ? 'wàng' : isAiqing ? 'ài' : isPengyou ? 'péng' : 'bāng'})</span> — {isChicu ? 'Open Mouth & Begging for Food' : isDongxi ? 'Sunrise & Travel Sack' : isXihuan ? 'Celebratory War Drum' : isKaishi ? 'Opening the Gate' : isJieshao ? 'Go-Between' : isWangji ? 'Disappearing Heart' : isAiqing ? 'Hand Embracing Friend' : isPengyou ? 'Twin Companions' : 'Protective Backing'}
                </h2>"""
content = content.replace(old_header_s2, new_header_s2)

old_header_s3 = """                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 940 }}>
                  Character 2: <span style={{ color: '#FF6F59' }}>{char2} ({isDongxi ? 'xī' : isXihuan ? 'huān' : isKaishi ? 'shǐ' : isJieshao ? 'shào' : isWangji ? 'jì' : isAiqing ? 'qíng' : isPengyou ? 'yǒu' : 'zhù'})</span> — {isDongxi ? 'Sunset & Bird in Nest' : isXihuan ? 'Singing Bird & Cheering' : isKaishi ? 'New Life & Origin' : isJieshao ? 'Linking Thread' : isWangji ? 'Recording Words' : isAiqing ? 'Youthful Heart' : isPengyou ? 'Helping Hands' : 'Muscle Power'}
                </h2>"""

new_header_s3 = """                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 940 }}>
                  Character 2: <span style={{ color: '#FF6F59' }}>{char2} ({isChicu ? 'cù' : isDongxi ? 'xī' : isXihuan ? 'huān' : isKaishi ? 'shǐ' : isJieshao ? 'shào' : isWangji ? 'jì' : isAiqing ? 'qíng' : isPengyou ? 'yǒu' : 'zhù'})</span> — {isChicu ? 'Wine Jar & Fermented Vinegar' : isDongxi ? 'Sunset & Bird in Nest' : isXihuan ? 'Singing Bird & Cheering' : isKaishi ? 'New Life & Origin' : isJieshao ? 'Linking Thread' : isWangji ? 'Recording Words' : isAiqing ? 'Youthful Heart' : isPengyou ? 'Helping Hands' : 'Muscle Power'}
                </h2>"""
content = content.replace(old_header_s3, new_header_s3)

old_header_s4 = """                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 940 }}>
                  Synthesis: <span style={{ color: '#FF6F59' }}>{character}</span> = {isDongxi ? 'East Market + West Market!' : isXihuan ? 'Victory Drum + Joyful Cheering!' : isKaishi ? 'Opening Gates + Giving Birth!' : isJieshao ? 'Connecting Two Parties!' : isWangji ? 'Disappearing from Memory!' : isAiqing ? 'Blossoming Affection!' : isPengyou ? 'Companions + Helping Hands!' : 'Protection + Muscle!'}
                </h2>"""

new_header_s4 = """                <h2 style={{ fontFamily: FONTS.display, fontSize: 38, color: '#0F172A', margin: 0, lineHeight: 1.25, maxWidth: 940 }}>
                  Synthesis: <span style={{ color: '#FF6F59' }}>{character}</span> = {isChicu ? 'Drinking Vinegar = Romantic Jealousy!' : isDongxi ? 'East Market + West Market!' : isXihuan ? 'Victory Drum + Joyful Cheering!' : isKaishi ? 'Opening Gates + Giving Birth!' : isJieshao ? 'Connecting Two Parties!' : isWangji ? 'Disappearing from Memory!' : isAiqing ? 'Blossoming Affection!' : isPengyou ? 'Companions + Helping Hands!' : 'Protection + Muscle!'}
                </h2>"""
content = content.replace(old_header_s4, new_header_s4)

# 9. Scene 1 Cards for isChicu
old_scene1_cards = """          {/* SCENE 1 CARD */}
          {isDongxi ? ("""

new_scene1_cards = """          {/* SCENE 1 CARD */}
          {isChicu ? (
            <OrganicCenterTag
              emoji="🍶"
              radical="吃醋"
              pinyin="chī cù"
              translation="Eating Vinegar = Jealousy"
              catImages={[
                'cats/chicu/cat_chicu_f1.png',
                'cats/chicu/cat_chicu_f2.png',
              ]}
              frame={frame}
              enterFrame={75}
              exitFrame={anim.screen1.endFrame}
            />
          ) : isDongxi ? ("""
content = content.replace(old_scene1_cards, new_scene1_cards)

# 10. Scene 2 Cards for isChicu
old_scene2_cards = """          {/* SCENE 2 CARDS */}
          {isDongxi ? ("""

new_scene2_cards = """          {/* SCENE 2 CARDS */}
          {isChicu ? (
            <>
              <OrganicCenterTag
                emoji="👄"
                radical="口"
                pinyin="kǒu"
                translation="Open Mouth"
                catImages={[
                  'cats/chicu/cat_mouth_f1.png',
                  'cats/chicu/cat_mouth_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="🥺"
                radical="乞"
                pinyin="qǐ"
                translation="Begging for Food"
                catImages={[
                  'cats/chicu/cat_beg_f1.png',
                  'cats/chicu/cat_beg_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.endFrame}
                exitFrame={anim.screen2.bottomJin.endFrame}
              />
              <OrganicCenterTag
                emoji="😋"
                radical="吃"
                pinyin="chī"
                translation="Swallowing & Eating Food"
                catImages={[
                  'cats/chicu/cat_eat_f1.png',
                  'cats/chicu/cat_eat_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.bottomJin.endFrame}
                exitFrame={anim.screen2.endFrame}
              />
            </>
          ) : isDongxi ? ("""
content = content.replace(old_scene2_cards, new_scene2_cards)

# 11. Scene 3 Cards for isChicu
old_scene3_cards = """          {/* SCENE 3 CARDS */}
          {isDongxi ? ("""

new_scene3_cards = """          {/* SCENE 3 CARDS */}
          {isChicu ? (
            <>
              <OrganicCenterTag
                emoji="🏺"
                radical="酉"
                pinyin="yǒu"
                translation="Ancient Wine Jar"
                catImages={[
                  'cats/chicu/cat_jar_f1.png',
                  'cats/chicu/cat_jar_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.startFrame}
                exitFrame={anim.screen3.leftQie.endFrame}
              />
              <OrganicCenterTag
                emoji="⏳"
                radical="昔"
                pinyin="xī"
                translation="Sun Over Past Days"
                catImages={[
                  'cats/chicu/cat_time_f1.png',
                  'cats/chicu/cat_time_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.leftQie.endFrame}
                exitFrame={anim.screen3.rightLi.endFrame}
              />
              <OrganicCenterTag
                emoji="😖"
                radical="醋"
                pinyin="cù"
                translation="Aged Sour Vinegar"
                catImages={[
                  'cats/chicu/cat_sour_f1.png',
                  'cats/chicu/cat_sour_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.rightLi.endFrame}
                exitFrame={anim.screen3.endFrame}
              />
            </>
          ) : isDongxi ? ("""
content = content.replace(old_scene3_cards, new_scene3_cards)

# 12. Scene 4 Card for isChicu
old_scene4_cards = """          {/* SCENE 4 CARD */}
          {isDongxi ? ("""

new_scene4_cards = """          {/* SCENE 4 CARD */}
          {isChicu ? (
            <OrganicCenterTag
              emoji="👑"
              radical="吃醋"
              pinyin="chī cù"
              translation="Loyal Wife's Vinegar Test = Jealousy!"
              catImages={[
                'cats/chicu/cat_jealous_f1.png',
                'cats/chicu/cat_jealous_f2.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          ) : isDongxi ? ("""
content = content.replace(old_scene4_cards, new_scene4_cards)

with open(template_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated EtymologyTemplate.tsx with 吃醋 support!")
