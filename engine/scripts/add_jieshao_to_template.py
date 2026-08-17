import re

filepath = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/templates/EtymologyTemplate.tsx"
with open(filepath, 'r') as f:
    content = f.read()

replacements = [
    (
        "const isWangji = character === '忘记';",
        "const isJieshao = character === '介绍';\n  const isWangji = character === '忘记';"
    ),
    (
        "let spot2Y = isWangji ? 210 : isAiqing ? 220 : isPengyou ? 300 : 210;",
        "let spot2Y = isJieshao ? 250 : isWangji ? 210 : isAiqing ? 220 : isPengyou ? 300 : 210;"
    ),
    (
        "{isWangji ? 'Contain Disappearing & Words?' :",
        "{isJieshao ? 'Contain a Person & Silk?' : isWangji ? 'Contain Disappearing & Words?' :"
    ),
    (
        "({isWangji ? 'wàng' :",
        "({isJieshao ? 'jiè' : isWangji ? 'wàng' :"
    ),
    (
        " — {isWangji ? 'Disappearing Heart' :",
        " — {isJieshao ? 'Go-Between' : isWangji ? 'Disappearing Heart' :"
    ),
    (
        "({isWangji ? 'jì' :",
        "({isJieshao ? 'shào' : isWangji ? 'jì' :"
    ),
    (
        " — {isWangji ? 'Recording Words' :",
        " — {isJieshao ? 'Linking Thread' : isWangji ? 'Recording Words' :"
    ),
    (
        "= {isWangji ? 'Disappearing from Memory!' :",
        "= {isJieshao ? 'Connecting Two Parties!' : isWangji ? 'Disappearing from Memory!' :"
    )
]

for old, new in replacements:
    content = content.replace(old, new)

scene1_jieshao = """
          {isJieshao ? (
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
          ) : isWangji ? ("""
content = content.replace("{isWangji ? (", scene1_jieshao, 1)

scene2_top_jieshao = """
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
          ) : isWangji ? ("""
content = content.replace("{isWangji ? (", scene2_top_jieshao, 1)

scene2_bottom_jieshao = """
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
          ) : isWangji ? ("""
content = content.replace("{isWangji ? (", scene2_bottom_jieshao, 1)

scene2_whole_jieshao = """
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
          ) : isWangji ? ("""
content = content.replace("{isWangji ? (", scene2_whole_jieshao, 1)

scene3_left_jieshao = """
          {isJieshao ? (
            <OrganicCenterTag
              emoji="🧵"
              radical="纟"
              pinyin="sī"
              translation="Silk Thread"
              catImages={[
                'cats/jieshao/cat_silk_f1.png',
                'cats/jieshao/cat_silk_f2.png',
                'cats/jieshao/cat_silk_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen3.startFrame}
              exitFrame={anim.screen3.leftQie?.endFrame || anim.screen3.endFrame}
            />
          ) : isWangji ? ("""
content = content.replace("{isWangji ? (", scene3_left_jieshao, 1)

scene3_right_jieshao = """
          {isJieshao ? (
            <OrganicCenterTag
              emoji="🗣️"
              radical="召"
              pinyin="zhào"
              translation="Summon (Sound)"
              catImages={[
                'cats/jieshao/cat_sound_f1.png',
                'cats/jieshao/cat_sound_f2.png',
                'cats/jieshao/cat_sound_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen3.leftQie?.endFrame || anim.screen3.startFrame}
              exitFrame={anim.screen3.rightLi?.endFrame || anim.screen3.endFrame}
            />
          ) : isWangji ? ("""
content = content.replace("{isWangji ? (", scene3_right_jieshao, 1)

scene3_whole_jieshao = """
          {isJieshao ? (
            <OrganicCenterTag
              emoji="🔗"
              radical="绍"
              pinyin="shào"
              translation="To Link / Connect"
              catImages={[
                'cats/jieshao/cat_link_f1.png',
                'cats/jieshao/cat_link_f2.png',
                'cats/jieshao/cat_link_f3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen3.rightLi?.endFrame || anim.screen3.startFrame}
              exitFrame={anim.screen3.endFrame}
            />
          ) : isWangji ? ("""
content = content.replace("{isWangji ? (", scene3_whole_jieshao, 1)

with open(filepath, 'w') as f:
    f.write(content)
print("Updated EtymologyTemplate.tsx successfully!")
