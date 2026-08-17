import re

filepath = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/templates/EtymologyTemplate.tsx"

# Let's inspect git diff or git restore to get back the clean template and apply clean replacements
import subprocess

subprocess.run(["git", "checkout", filepath], check=True)

with open(filepath, 'r') as f:
    code = f.read()

# 1. Flag
code = code.replace(
    "const isJieshao = character === '介绍';",
    "const isKaishi = character === '开始';\n  const isJieshao = character === '介绍';"
)

# 2. Titles
code = code.replace(
    "{isJieshao ? 'Contain a Person & Silk?' :",
    "{isKaishi ? 'Contain a Gate & New Life?' : isJieshao ? 'Contain a Person & Silk?' :"
)
code = code.replace(
    "({isJieshao ? 'jiè' :",
    "({isKaishi ? 'kāi' : isJieshao ? 'jiè' :"
)
code = code.replace(
    " — {isJieshao ? 'Go-Between' :",
    " — {isKaishi ? 'Opening the Gate' : isJieshao ? 'Go-Between' :"
)
code = code.replace(
    "({isJieshao ? 'shào' :",
    "({isKaishi ? 'shǐ' : isJieshao ? 'shào' :"
)
code = code.replace(
    " — {isJieshao ? 'Linking Thread' :",
    " — {isKaishi ? 'New Life & Origin' : isJieshao ? 'Linking Thread' :"
)
code = code.replace(
    "= {isJieshao ? 'Connecting Two Parties!' :",
    "= {isKaishi ? 'Opening Gates + Giving Birth!' : isJieshao ? 'Connecting Two Parties!' :"
)

# 3. Emojis
emojis_data = """  const emojisData = isKaishi
    ? [
        { emoji: '🚪', label: '门 (Gate)', angleOffset: -Math.PI / 6, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedCloth },
        { emoji: '👩', label: '女 (Mother)', angleOffset: -Math.PI / 3, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedWall },
        { emoji: '🌱', label: '始 (New Life)', angleOffset: 7 * Math.PI / 6, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedAltar },
      ]
    : isJieshao"""
code = code.replace("  const emojisData = isJieshao", emojis_data)

# 4. Spotlights
spotlight2 = """  if (isKaishi) {
    spot2X = 540;
    spot2Y = 300;
    spot2R = 230;
  } else if (isAiqing) {"""
code = code.replace("  if (isAiqing) {", spotlight2, 1)

spotlight3 = """  if (isKaishi) {
    if (isScreen3LeftQie) {
      spot3X = 400;
      spot3Y = 300;
      spot3R = 140;
    } else if (isScreen3RightLi) {
      spot3X = 640;
      spot3Y = 300;
      spot3R = 140;
    } else if (isScreen3WholeZhu) {
      spot3X = 540;
      spot3Y = 300;
      spot3R = 230;
    }
  } else if (isAiqing) {"""
code = code.replace("  if (isAiqing) {", spotlight3, 1)

# 5. Scene 1 Card
old_s1 = """          {isJieshao ? (
            <OrganicCenterTag
              emoji="🤝"
              radical="介绍"
              pinyin="jiè shào"
              translation="Link Together (Introduce)"
              catImages={[
                'cats/jieshao/cat_link_f1.png',
                'cats/jieshao/cat_link_f2.png',
                'cats/jieshao/cat_link_f3.png',
              ]}
              frame={frame}
              enterFrame={50}
              exitFrame={anim.screen1.endFrame}
            />
          ) :"""

new_s1 = """          {isKaishi ? (
            <OrganicCenterTag
              emoji="🏁"
              radical="开始"
              pinyin="kāi shǐ"
              translation="To Begin / Start"
              catImages={[
                'cats/kaishi/cat_kaishi_f1.png',
                'cats/kaishi/cat_kaishi_f2.png',
                'cats/kaishi/cat_kaishi_f3.png',
              ]}
              frame={frame}
              enterFrame={30}
              exitFrame={anim.screen1.endFrame}
            />
          ) : isJieshao ? (
            <OrganicCenterTag
              emoji="🤝"
              radical="介绍"
              pinyin="jiè shào"
              translation="Link Together (Introduce)"
              catImages={[
                'cats/jieshao/cat_link_f1.png',
                'cats/jieshao/cat_link_f2.png',
                'cats/jieshao/cat_link_f3.png',
              ]}
              frame={frame}
              enterFrame={50}
              exitFrame={anim.screen1.endFrame}
            />
          ) :"""
code = code.replace(old_s1, new_s1)

# 6. Scene 2 Cards
old_s2 = """          {/* SCENE 2 CARDS */}
          
          
          {isJieshao ? (
            <OrganicCenterTag
              emoji="⛩️"
              radical="八"
              pinyin="bā"
              translation="Boundaries"
              catImages={[
                'cats/jieshao/cat_boundaries_f1.png',
                'cats/jieshao/cat_boundaries_f2.png',
                'cats/jieshao/cat_boundaries_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.startFrame}
              exitFrame={anim.screen2.topBang?.endFrame || anim.screen2.endFrame}
            />
          ) :"""

new_s2 = """          {/* SCENE 2 CARDS */}
          
          
          {isKaishi ? (
            <>
              <OrganicCenterTag
                emoji="🚪"
                radical="门/开"
                pinyin="kāi"
                translation="Unlatching the Gate"
                catImages={[
                  'cats/kaishi/cat_gate_f1.png',
                  'cats/kaishi/cat_gate_f2.png',
                  'cats/kaishi/cat_gate_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.startFrame}
                exitFrame={anim.screen2.topBang.endFrame}
              />
              <OrganicCenterTag
                emoji="🚀"
                radical="开"
                pinyin="kāi"
                translation="Opening a Clear Path"
                catImages={[
                  'cats/kaishi/cat_open_f1.png',
                  'cats/kaishi/cat_open_f2.png',
                  'cats/kaishi/cat_open_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen2.topBang.endFrame}
                exitFrame={anim.screen2.endFrame}
              />
            </>
          ) : isJieshao ? (
            <OrganicCenterTag
              emoji="⛩️"
              radical="八"
              pinyin="bā"
              translation="Boundaries"
              catImages={[
                'cats/jieshao/cat_boundaries_f1.png',
                'cats/jieshao/cat_boundaries_f2.png',
                'cats/jieshao/cat_boundaries_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.startFrame}
              exitFrame={anim.screen2.topBang?.endFrame || anim.screen2.endFrame}
            />
          ) :"""
code = code.replace(old_s2, new_s2)

# 7. Scene 3 Cards
old_s3 = """          {/* SCENE 3 CARDS */}
          
          
          {isJieshao ? (
            <OrganicCenterTag
              emoji="🧍"
              radical="人"
              pinyin="rén"
              translation="Person"
              catImages={[
                'cats/jieshao/cat_person_f1.png',
                'cats/jieshao/cat_person_f2.png',
                'cats/jieshao/cat_person_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.topBang?.endFrame || anim.screen2.startFrame}
              exitFrame={anim.screen2.bottomJin?.endFrame || anim.screen2.endFrame}
            />
          ) :"""

new_s3 = """          {/* SCENE 3 CARDS */}
          
          
          {isKaishi ? (
            <>
              <OrganicCenterTag
                emoji="👩"
                radical="女"
                pinyin="nǚ"
                translation="Woman / Mother"
                catImages={[
                  'cats/kaishi/cat_woman_f1.png',
                  'cats/kaishi/cat_woman_f2.png',
                  'cats/kaishi/cat_woman_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.startFrame}
                exitFrame={anim.screen3.leftQie.endFrame}
              />
              <OrganicCenterTag
                emoji="🗣️"
                radical="台"
                pinyin="tái"
                translation="Platform (Sound)"
                catImages={[
                  'cats/kaishi/cat_origin_f1.png',
                  'cats/kaishi/cat_origin_f2.png',
                  'cats/kaishi/cat_origin_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.leftQie.endFrame}
                exitFrame={anim.screen3.rightLi.endFrame}
              />
              <OrganicCenterTag
                emoji="🌱"
                radical="始"
                pinyin="shǐ"
                translation="Origin of Life / Birth"
                catImages={[
                  'cats/kaishi/cat_birth_f1.png',
                  'cats/kaishi/cat_birth_f2.png',
                  'cats/kaishi/cat_birth_f3.png',
                ]}
                frame={frame}
                enterFrame={anim.screen3.rightLi.endFrame}
                exitFrame={anim.screen3.endFrame}
              />
            </>
          ) : isJieshao ? (
            <OrganicCenterTag
              emoji="🧍"
              radical="人"
              pinyin="rén"
              translation="Person"
              catImages={[
                'cats/jieshao/cat_person_f1.png',
                'cats/jieshao/cat_person_f2.png',
                'cats/jieshao/cat_person_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.topBang?.endFrame || anim.screen2.startFrame}
              exitFrame={anim.screen2.bottomJin?.endFrame || anim.screen2.endFrame}
            />
          ) :"""
code = code.replace(old_s3, new_s3)

# 8. Scene 4 Cards
old_s4 = """          {/* SCENE 4 CARD */}
          
          
          {isJieshao ? (
            <OrganicCenterTag
              emoji="🤝"
              radical="介"
              pinyin="jiè"
              translation="Person between boundaries (Go-between)"
              catImages={[
                'cats/jieshao/cat_gobetween_f1.png',
                'cats/jieshao/cat_gobetween_f2.png',
                'cats/jieshao/cat_gobetween_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.bottomJin?.endFrame || anim.screen2.startFrame}
              exitFrame={anim.screen2.endFrame}
            />
          ) :"""

new_s4 = """          {/* SCENE 4 CARD */}
          
          
          {isKaishi ? (
            <OrganicCenterTag
              emoji="🏁"
              radical="开始"
              pinyin="kāi shǐ"
              translation="Unlatch Gate + New Life = Start!"
              catImages={[
                'cats/kaishi/cat_kaishi_f1.png',
                'cats/kaishi/cat_kaishi_f2.png',
                'cats/kaishi/cat_kaishi_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen4.startFrame}
              exitFrame={anim.screen4.endFrame}
            />
          ) : isJieshao ? (
            <OrganicCenterTag
              emoji="🤝"
              radical="介"
              pinyin="jiè"
              translation="Person between boundaries (Go-between)"
              catImages={[
                'cats/jieshao/cat_gobetween_f1.png',
                'cats/jieshao/cat_gobetween_f2.png',
                'cats/jieshao/cat_gobetween_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.bottomJin?.endFrame || anim.screen2.startFrame}
              exitFrame={anim.screen2.endFrame}
            />
          ) :"""
code = code.replace(old_s4, new_s4)

with open(filepath, 'w') as f:
    f.write(code)

print("Cleanly updated EtymologyTemplate.tsx with Kaishi!")
