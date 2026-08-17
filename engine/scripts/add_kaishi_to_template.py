import re

filepath = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/templates/EtymologyTemplate.tsx"
with open(filepath, 'r') as f:
    content = f.read()

replacements = [
    (
        "const isJieshao = character === '介绍';",
        "const isKaishi = character === '开始';\n  const isJieshao = character === '介绍';"
    ),
    (
        "{isJieshao ? 'Contain a Person & Silk?' :",
        "{isKaishi ? 'Contain a Gate & New Life?' : isJieshao ? 'Contain a Person & Silk?' :"
    ),
    (
        "({isJieshao ? 'jiè' :",
        "({isKaishi ? 'kāi' : isJieshao ? 'jiè' :"
    ),
    (
        " — {isJieshao ? 'Go-Between' :",
        " — {isKaishi ? 'Opening the Gate' : isJieshao ? 'Go-Between' :"
    ),
    (
        "({isJieshao ? 'shào' :",
        "({isKaishi ? 'shǐ' : isJieshao ? 'shào' :"
    ),
    (
        " — {isJieshao ? 'Linking Thread' :",
        " — {isKaishi ? 'New Life & Origin' : isJieshao ? 'Linking Thread' :"
    ),
    (
        "= {isJieshao ? 'Connecting Two Parties!' :",
        "= {isKaishi ? 'Opening Gates + Giving Birth!' : isJieshao ? 'Connecting Two Parties!' :"
    )
]

for old, new in replacements:
    content = content.replace(old, new)

# Emojis for Scene 1
emojis_snippet = """  const emojisData = isKaishi
    ? [
        { emoji: '🚪', label: '开 (Gate)', angleOffset: -Math.PI / 6, scale: isMentionedCloth ? interpolate(clothSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedCloth },
        { emoji: '👩', label: '女 (Mother)', angleOffset: -Math.PI / 3, scale: isMentionedWall ? interpolate(wallSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedWall },
        { emoji: '🌱', label: '始 (New Life)', angleOffset: 7 * Math.PI / 6, scale: isMentionedAltar ? interpolate(altarSpring, [0, 1], [0, 1.65]) : 0, active: isMentionedAltar },
      ]
    : isJieshao"""
content = content.replace("  const emojisData = isJieshao", emojis_snippet)

# Spotlights
spotlights_condition = """  if (isKaishi) {
    spot2X = 540;
    spot2Y = 300;
    spot2R = 230;
  } else if (isAiqing) {"""
content = content.replace("  if (isAiqing) {", spotlights_condition, 1)

spotlights_s3 = """  if (isKaishi) {
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
content = content.replace("  if (isAiqing) {", spotlights_s3, 1)

# Scene 1 card
scene1_kaishi = """          {isKaishi ? (
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
          ) : isJieshao ? ("""
content = content.replace("{isJieshao ? (", scene1_kaishi, 1)

# Scene 2 top/latch card
scene2_top_kaishi = """          {isKaishi ? (
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
              exitFrame={anim.screen2.topBang?.endFrame || anim.screen2.endFrame}
            />
          ) : isJieshao ? ("""
content = content.replace("{isJieshao ? (", scene2_top_kaishi, 1)

# Scene 2 bottom (not used for kaishi, just fallback to null or empty)
scene2_bottom_kaishi = """          {isKaishi ? null : isJieshao ? ("""
content = content.replace("{isJieshao ? (", scene2_bottom_kaishi, 1)

# Scene 2 whole char card
scene2_whole_kaishi = """          {isKaishi ? (
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
              enterFrame={anim.screen2.topBang?.endFrame || anim.screen2.startFrame}
              exitFrame={anim.screen2.endFrame}
            />
          ) : isJieshao ? ("""
content = content.replace("{isJieshao ? (", scene2_whole_kaishi, 1)

# Scene 3 left radical (女)
scene3_left_kaishi = """          {isKaishi ? (
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
              exitFrame={anim.screen3.leftQie?.endFrame || anim.screen3.endFrame}
            />
          ) : isJieshao ? ("""
content = content.replace("{isJieshao ? (", scene3_left_kaishi, 1)

# Scene 3 right radical (台)
scene3_right_kaishi = """          {isKaishi ? (
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
              enterFrame={anim.screen3.leftQie?.endFrame || anim.screen3.startFrame}
              exitFrame={anim.screen3.rightLi?.endFrame || anim.screen3.endFrame}
            />
          ) : isJieshao ? ("""
content = content.replace("{isJieshao ? (", scene3_right_kaishi, 1)

# Scene 3 whole char card (始)
scene3_whole_kaishi = """          {isKaishi ? (
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
              enterFrame={anim.screen3.rightLi?.endFrame || anim.screen3.startFrame}
              exitFrame={anim.screen3.endFrame}
            />
          ) : isJieshao ? ("""
content = content.replace("{isJieshao ? (", scene3_whole_kaishi, 1)

# Scene 4 synthesis card
scene4_kaishi = """          {isKaishi ? (
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
          ) : isJieshao ? ("""
content = content.replace("{isJieshao ? (", scene4_kaishi, 1)

with open(filepath, 'w') as f:
    f.write(content)
print("Updated EtymologyTemplate.tsx with Kaishi successfully!")
