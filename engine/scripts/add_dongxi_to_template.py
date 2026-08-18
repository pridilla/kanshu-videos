#!/usr/bin/env python3
import os
import re

template_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/templates/EtymologyTemplate.tsx"
root_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/Root.tsx"

with open(template_path, 'r') as f:
    content = f.read()

# 1. Update character flags
content = content.replace("const isXihuan = character === '喜欢';", "const isDongxi = character === '东西';\n  const isXihuan = character === '喜欢';")

# 2. Update isHeroWordPhase
content = content.replace("const isHeroWordPhase = isXihuan && frame < 75;", "const isHeroWordPhase = (isXihuan || isDongxi) && frame < 75;")

# 3. Update charSpacing
content = content.replace("const charSpacing = isKaishi || isXihuan ? 120 : 150;", "const charSpacing = isKaishi || isXihuan || isDongxi ? 120 : 150;")

# 4. Update spot2 and spot3 default positions
content = content.replace("let spot2Y = isKaishi || isXihuan ? 240 : 300;", "let spot2Y = isKaishi || isXihuan || isDongxi ? 240 : 300;")
content = content.replace("let spot2R = isKaishi || isXihuan ? 180 : 230;", "let spot2R = isKaishi || isXihuan || isDongxi ? 180 : 230;")
content = content.replace("let spot3Y = isKaishi || isXihuan ? 240 : 300;", "let spot3Y = isKaishi || isXihuan || isDongxi ? 240 : 300;")
content = content.replace("let spot3R = isKaishi || isXihuan ? 180 : 230;", "let spot3R = isKaishi || isXihuan || isDongxi ? 180 : 230;")

# 5. Add spot2 conditions for isDongxi
spot2_snippet = """  if (isDongxi) {
    if (isScreen2TopBang) {
      spot2X = 540;
      spot2Y = 240;
      spot2R = 170;
    } else if (isScreen2BottomJin) {
      spot2X = 540;
      spot2Y = 240;
      spot2R = 190;
    } else if (isScreen2WholeBang) {
      spot2X = 540;
      spot2Y = 240;
      spot2R = 210;
    }
  } else if (isXihuan) {"""
content = content.replace("  if (isXihuan) {", spot2_snippet, 1)

# 6. Add spot3 conditions for isDongxi
spot3_snippet = """  if (isDongxi) {
    if (isScreen3LeftQie) {
      spot3X = 540;
      spot3Y = 240;
      spot3R = 180;
    } else if (isScreen3RightLi) {
      spot3X = 540;
      spot3Y = 240;
      spot3R = 180;
    } else if (isScreen3WholeZhu) {
      spot3X = 540;
      spot3Y = 240;
      spot3R = 210;
    }
  } else if (isXihuan) {"""
content = content.replace("  if (isXihuan) {", spot3_snippet, 1)

# 7. Add emojisData for isDongxi
emojis_snippet = """  const emojisData = isDongxi
    ? [
        { emoji: '📦', label: '物 (Goods)', angleOffset: -Math.PI / 4, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedCloth },
        { emoji: '🧭', label: '东西 (East & West)', angleOffset: 5 * Math.PI / 4, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.6]) : 0, active: isMentionedWall },
      ]
    : isXihuan"""
content = content.replace("  const emojisData = isXihuan", emojis_snippet, 1)

# 8. Top Header titles
# Screen 1 Header subtitle
content = content.replace(
    "Why <span style={{ color: '#FF6F59' }}>喜欢</span> = War Drum + Cheering!",
    "{isDongxi ? 'Why ' : 'Why '}<span style={{ color: '#FF6F59' }}>{character}</span> = {isDongxi ? 'East + West = Things?!' : 'War Drum + Cheering!'}"
)

# Screen 2 Header title
s2_old = "Character 1: <span style={{ color: '#FF6F59' }}>{char1} ({isXihuan ? 'xǐ' : isKaishi ? 'kāi' : isJieshao ? 'jiè' : isWangji ? 'wàng' : isAiqing ? 'ài' : isPengyou ? 'péng' : 'bāng'})</span> — {isXihuan ? 'Celebratory War Drum' : isKaishi ? 'Opening the Gate' : isJieshao ? 'Go-Between' : isWangji ? 'Disappearing Heart' : isAiqing ? 'Hand Embracing Friend' : isPengyou ? 'Twin Companions' : 'Protective Backing'}"
s2_new = "Character 1: <span style={{ color: '#FF6F59' }}>{char1} ({isDongxi ? 'dōng' : isXihuan ? 'xǐ' : isKaishi ? 'kāi' : isJieshao ? 'jiè' : isWangji ? 'wàng' : isAiqing ? 'ài' : isPengyou ? 'péng' : 'bāng'})</span> — {isDongxi ? 'Sunrise & Travel Sack' : isXihuan ? 'Celebratory War Drum' : isKaishi ? 'Opening the Gate' : isJieshao ? 'Go-Between' : isWangji ? 'Disappearing Heart' : isAiqing ? 'Hand Embracing Friend' : isPengyou ? 'Twin Companions' : 'Protective Backing'}"
content = content.replace(s2_old, s2_new)

# Screen 3 Header title
s3_old = "Character 2: <span style={{ color: '#FF6F59' }}>{char2} ({isXihuan ? 'huān' : isKaishi ? 'shǐ' : isJieshao ? 'shào' : isWangji ? 'jì' : isAiqing ? 'qíng' : isPengyou ? 'yǒu' : 'zhù'})</span> — {isXihuan ? 'Singing Bird & Cheering' : isKaishi ? 'New Life & Origin' : isJieshao ? 'Linking Thread' : isWangji ? 'Recording Words' : isAiqing ? 'Youthful Heart' : isPengyou ? 'Helping Hands' : 'Muscle Power'}"
s3_new = "Character 2: <span style={{ color: '#FF6F59' }}>{char2} ({isDongxi ? 'xī' : isXihuan ? 'huān' : isKaishi ? 'shǐ' : isJieshao ? 'shào' : isWangji ? 'jì' : isAiqing ? 'qíng' : isPengyou ? 'yǒu' : 'zhù'})</span> — {isDongxi ? 'Sunset & Bird in Nest' : isXihuan ? 'Singing Bird & Cheering' : isKaishi ? 'New Life & Origin' : isJieshao ? 'Linking Thread' : isWangji ? 'Recording Words' : isAiqing ? 'Youthful Heart' : isPengyou ? 'Helping Hands' : 'Muscle Power'}"
content = content.replace(s3_old, s3_new)

# Screen 4 Header title
s4_old = "Synthesis: <span style={{ color: '#FF6F59' }}>{character}</span> = {isXihuan ? 'Victory Drum + Joyful Cheering!' : isKaishi ? 'Opening Gates + Giving Birth!' : isJieshao ? 'Connecting Two Parties!' : isWangji ? 'Disappearing from Memory!' : isAiqing ? 'Blossoming Affection!' : isPengyou ? 'Companions + Helping Hands!' : 'Protection + Muscle!'}"
s4_new = "Synthesis: <span style={{ color: '#FF6F59' }}>{character}</span> = {isDongxi ? 'East Market + West Market!' : isXihuan ? 'Victory Drum + Joyful Cheering!' : isKaishi ? 'Opening Gates + Giving Birth!' : isJieshao ? 'Connecting Two Parties!' : isWangji ? 'Disappearing from Memory!' : isAiqing ? 'Blossoming Affection!' : isPengyou ? 'Companions + Helping Hands!' : 'Protection + Muscle!'}"
content = content.replace(s4_old, s4_new)

# 9. Cards for Scene 1, 2, 3, 4
card_s1_snippet = """          {isDongxi ? (
            <OrganicCenterTag
              emoji="📦"
              radical="东西"
              pinyin="dōng xi"
              translation="Things & Objects"
              catImages={[
                'cats/dongxi/cat_dongxi_f1.png',
                'cats/dongxi/cat_dongxi_f2.png',
              ]}
              frame={frame}
              enterFrame={75}
              exitFrame={anim.screen1.endFrame}
            />
          ) : isXihuan ? ("""
content = content.replace("          {isXihuan ? (", card_s1_snippet, 1)

card_s2_snippet = """          {isDongxi ? (
            <>
              <OrganicCenterTag
                emoji="🌅"
                radical="东"
                pinyin="dōng"
                translation="Travel Sack on Carrying Pole"
                catImages={[
                  'cats/dongxi/cat_dong_f1.png',
                  'cats/dongxi/cat_dong_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="☀️"
                radical="东"
                pinyin="dōng"
                translation="Sunrise in the East"
                catImages={[
                  'cats/dongxi/cat_dong_f1.png',
                  'cats/dongxi/cat_dong_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.endFrame}
                exitFrame={anim.screen2.endFrame}
              />
            </>
          ) : isXihuan ? ("""
content = content.replace("          {isXihuan ? (", card_s2_snippet, 1)

card_s3_snippet = """          {isDongxi ? (
            <>
              <OrganicCenterTag
                emoji="🌇"
                radical="西"
                pinyin="xī"
                translation="Sunset & Bird in Woven Nest"
                catImages={[
                  'cats/dongxi/cat_xi_f1.png',
                  'cats/dongxi/cat_xi_f2.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.startFrame}
                exitFrame={anim.screen3.endFrame}
              />
            </>
          ) : isXihuan ? ("""
content = content.replace("          {isXihuan ? (", card_s3_snippet, 1)

card_s4_snippet = """          {isDongxi ? (
            <OrganicCenterTag
              emoji="🛍️"
              radical="东西"
              pinyin="dōng xi"
              translation="East & West Markets = Buying Goods!"
              catImages={[
                'cats/dongxi/cat_market_f1.png',
                'cats/dongxi/cat_market_f2.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          ) : isXihuan ? ("""
content = content.replace("          {isXihuan ? (", card_s4_snippet, 1)

with open(template_path, 'w') as f:
    f.write(content)

print(f"✅ Updated {template_path} for dongxi!")

# Update Root.tsx
with open(root_path, 'r') as f:
    root_content = f.read()

if "import dongxiConfig" not in root_content:
    root_content = root_content.replace(
        "import xihuanConfig from '../../content/10_etymology_xihuan/config.json';",
        "import xihuanConfig from '../../content/10_etymology_xihuan/config.json';\nimport dongxiConfig from '../../content/11_etymology_dongxi/config.json';"
    )
    
    root_content = root_content.replace(
        "const xihuanTotalFrames = xihuanConfig.lessonDurationInFrames + (xihuanConfig.outroDurationInFrames || 0);",
        "const xihuanTotalFrames = xihuanConfig.lessonDurationInFrames + (xihuanConfig.outroDurationInFrames || 0);\n      const dongxiTotalFrames = dongxiConfig.lessonDurationInFrames + (dongxiConfig.outroDurationInFrames || 0);"
    )

    composition_snippet = """      {/* Etymology Video Template Composition (Video #11: 东西) */}
      <Composition
        id="EtymologyDongxi"
        component={() => (
          <FontLoader>
            <EtymologyTemplate {...(dongxiConfig as EtymologyConfig)} />
          </FontLoader>
        )}
        durationInFrames={dongxiTotalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />\n\n"""

    root_content = root_content.replace(
        "      {/* Etymology Video Template Composition (Video #10: 喜欢) */}",
        composition_snippet + "      {/* Etymology Video Template Composition (Video #10: 喜欢) */}"
    )

    with open(root_path, 'w') as f:
        f.write(root_content)
    print(f"✅ Updated {root_path} with EtymologyDongxi composition!")
