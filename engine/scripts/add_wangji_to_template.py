import re

filepath = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/templates/EtymologyTemplate.tsx"
with open(filepath, 'r') as f:
    content = f.read()

replacements = [
    (
        "const isPengyou = character === '朋友';",
        "const isWangji = character === '忘记';\n  const isPengyou = character === '朋友';"
    ),
    (
        "let spot2Y = isAiqing ? 220 : isPengyou ? 300 : 210;",
        "let spot2Y = isWangji ? 210 : isAiqing ? 220 : isPengyou ? 300 : 210;"
    ),
    (
        "} else if (isPengyou) {\n    topRad = 'cat_peng_left';",
        "} else if (isWangji) {\n    topRad = 'cat_wang_top';\n    bottomRad = 'cat_wang_bottom';\n    wholeChar = 'cat_wang_whole';\n  } else if (isPengyou) {\n    topRad = 'cat_peng_left';"
    ),
    (
        "} else if (isPengyou) {\n    leftRad = 'cat_you_left';",
        "} else if (isWangji) {\n    leftRad = 'cat_ji_left';\n    rightRad = 'cat_ji_right';\n    wholeChar2 = 'cat_ji_whole';\n  } else if (isPengyou) {\n    leftRad = 'cat_you_left';"
    ),
    (
        "    : isPengyou\n    ? 'cat_pengyou_word'",
        "    : isWangji\n    ? 'cat_wangji_word'\n    : isPengyou\n    ? 'cat_pengyou_word'"
    ),
    (
        "{isAiqing ? 'Contain a Friend & Heart?' : isPengyou ? 'Feature 2 Moons & 2 Hands?' : 'Contain Cloth & Muscle?'}",
        "{isWangji ? 'Contain Disappearing & Words?' : isAiqing ? 'Contain a Friend & Heart?' : isPengyou ? 'Feature 2 Moons & 2 Hands?' : 'Contain Cloth & Muscle?'}"
    ),
    (
        "({isAiqing ? 'ài' : isPengyou ? 'péng' : 'bāng'})</span> — {isAiqing ? 'Hand Embracing Friend' : isPengyou ? 'Twin Companions' : 'Protective Backing'}",
        "({isWangji ? 'wàng' : isAiqing ? 'ài' : isPengyou ? 'péng' : 'bāng'})</span> — {isWangji ? 'Disappearing Heart' : isAiqing ? 'Hand Embracing Friend' : isPengyou ? 'Twin Companions' : 'Protective Backing'}"
    ),
    (
        "({isAiqing ? 'qíng' : isPengyou ? 'yǒu' : 'zhù'})</span> — {isAiqing ? 'Youthful Heart' : isPengyou ? 'Helping Hands' : 'Muscle Power'}",
        "({isWangji ? 'jì' : isAiqing ? 'qíng' : isPengyou ? 'yǒu' : 'zhù'})</span> — {isWangji ? 'Recording Words' : isAiqing ? 'Youthful Heart' : isPengyou ? 'Helping Hands' : 'Muscle Power'}"
    ),
    (
        "= {isAiqing ? 'Blossoming Affection!' : isPengyou ? 'Companions + Helping Hands!' : 'Protection + Muscle!'}",
        "= {isWangji ? 'Disappearing from Memory!' : isAiqing ? 'Blossoming Affection!' : isPengyou ? 'Companions + Helping Hands!' : 'Protection + Muscle!'}"
    )
]

for old, new in replacements:
    content = content.replace(old, new)

# Now for the JSX blocks (Scene 1, Scene 2 Top, Scene 2 Bottom, Scene 2 Whole, etc.)
# Because they are large, we use Regex or just insert the Wangji blocks.

scene1_wangji = """
          {isWangji ? (
            <OrganicCenterTag
              emoji="🫥"
              radical="忘记"
              pinyin="wàng jì"
              translation="Disappearing from Memory"
              catImages={[
                'cats/cat_wangji_word_frame_1.png',
                'cats/cat_wangji_word_frame_2.png',
                'cats/cat_wangji_word_frame_3.png',
              ]}
              frame={frame}
              enterFrame={50}
              exitFrame={anim.screen1.endFrame}
            />
          ) : isAiqing ? ("""
content = content.replace("{isAiqing ? (", scene1_wangji, 1)

scene2_top_wangji = """
          {isWangji ? (
            <OrganicTag
              emoji="💨"
              radical="亡"
              pinyin="wáng"
              translation="Disappearing / Lost"
              catImages={[
                'cats/cat_wang_top_frame_1.png',
                'cats/cat_wang_top_frame_2.png',
                'cats/cat_wang_top_frame_3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.startFrame}
              exitFrame={anim.screen2.topBang?.endFrame || anim.screen2.endFrame}
            />
          ) : isAiqing ? ("""
content = content.replace("{isAiqing ? (", scene2_top_wangji, 1)

scene2_bottom_wangji = """
          {isWangji ? (
            <OrganicTag
              emoji="❤️"
              radical="心"
              pinyin="xīn"
              translation="Heart / Mind"
              catImages={[
                'cats/cat_wang_bottom_frame_1.png',
                'cats/cat_wang_bottom_frame_2.png',
                'cats/cat_wang_bottom_frame_3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.topBang?.endFrame || anim.screen2.startFrame}
              exitFrame={anim.screen2.bottomJin?.endFrame || anim.screen2.endFrame}
            />
          ) : isAiqing ? ("""
content = content.replace("{isAiqing ? (", scene2_bottom_wangji, 1)

scene2_whole_wangji = """
          {isWangji ? (
            <OrganicCenterTag
              emoji="🫥"
              radical="忘"
              pinyin="wàng"
              translation="Disappearing from the Heart (Forget)"
              catImages={[
                'cats/cat_wang_whole_frame_1.png',
                'cats/cat_wang_whole_frame_2.png',
                'cats/cat_wang_whole_frame_3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen2.bottomJin?.endFrame || anim.screen2.startFrame}
              exitFrame={anim.screen2.endFrame}
            />
          ) : isAiqing ? ("""
content = content.replace("{isAiqing ? (", scene2_whole_wangji, 1)


# Similarly for Screen 3 (char 2)
# The next {isAiqing ? ( is at line 839
scene3_left_wangji = """
          {isWangji ? (
            <OrganicTag
              emoji="🗣️"
              radical="讠"
              pinyin="yán"
              translation="Speech / Words"
              catImages={[
                'cats/cat_ji_left_frame_1.png',
                'cats/cat_ji_left_frame_2.png',
                'cats/cat_ji_left_frame_3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen3.startFrame}
              exitFrame={anim.screen3.leftQie?.endFrame || anim.screen3.endFrame}
            />
          ) : isAiqing ? ("""
content = content.replace("{isAiqing ? (", scene3_left_wangji, 1)


scene3_right_wangji = """
          {isWangji ? (
            <OrganicTag
              emoji="🧍"
              radical="己"
              pinyin="jǐ"
              translation="Oneself / Self"
              catImages={[
                'cats/cat_ji_right_frame_1.png',
                'cats/cat_ji_right_frame_2.png',
                'cats/cat_ji_right_frame_3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen3.leftQie?.endFrame || anim.screen3.startFrame}
              exitFrame={anim.screen3.rightLi?.endFrame || anim.screen3.endFrame}
            />
          ) : isAiqing ? ("""
content = content.replace("{isAiqing ? (", scene3_right_wangji, 1)

scene3_whole_wangji = """
          {isWangji ? (
            <OrganicCenterTag
              emoji="📝"
              radical="记"
              pinyin="jì"
              translation="Record / Remember"
              catImages={[
                'cats/cat_ji_whole_frame_1.png',
                'cats/cat_ji_whole_frame_2.png',
                'cats/cat_ji_whole_frame_3.png',
              ]}
              frame={frame}
              enterFrame={anim.screen3.rightLi?.endFrame || anim.screen3.startFrame}
              exitFrame={anim.screen3.endFrame}
            />
          ) : isAiqing ? ("""
content = content.replace("{isAiqing ? (", scene3_whole_wangji, 1)


with open(filepath, 'w') as f:
    f.write(content)
print("Updated EtymologyTemplate.tsx successfully!")
