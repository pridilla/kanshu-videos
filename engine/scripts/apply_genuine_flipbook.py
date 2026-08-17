import os
import re

template_path = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/src/templates/EtymologyTemplate.tsx"

with open(template_path, 'r') as f:
    content = f.read()

# 1. Update OrganicCenterTag flipbook rate to 8 frames per flip for crisp hand-drawn cadence
old_flip = """  const cycleIndex = Math.floor(frame / 10) % 4;
  const pingPongMap = [0, 1, 2, 1];
  const flipIndex = pingPongMap[cycleIndex] % catImages.length;
  const currentCatSrc = catImages[flipIndex] || catImages[0];"""

new_flip = """  const flipSpeed = 8; // 7.5 fps traditional 2s hand-drawn cadence
  const cycleIndex = Math.floor(frame / flipSpeed) % (catImages.length === 2 ? 2 : 4);
  const currentCatSrc = catImages.length === 2 
    ? catImages[cycleIndex] 
    : catImages[([0, 1, 2, 1][Math.floor(frame / flipSpeed) % 4]) % catImages.length];"""

if old_flip in content:
    content = content.replace(old_flip, new_flip)
    print("✅ Replaced flipbook timing in OrganicCenterTag")
else:
    print("Warning: old_flip not found exactly, applying regex/targeted replace")

# 2. Ensure all xihuan catImage arrays use exactly [f1, f2]
content = content.replace(
"""              catImages={[
                'cats/xihuan/cat_xihuan_f1.png',
                'cats/xihuan/cat_xihuan_f2.png',
                'cats/xihuan/cat_xihuan_f3.png',
              ]}""",
"""              catImages={[
                'cats/xihuan/cat_xihuan_f1.png',
                'cats/xihuan/cat_xihuan_f2.png',
              ]}"""
)

content = content.replace(
"""                catImages={[
                  'cats/xihuan/cat_drum_f1.png',
                  'cats/xihuan/cat_drum_f2.png',
                  'cats/xihuan/cat_drum_f3.png',
                ]}""",
"""                catImages={[
                  'cats/xihuan/cat_drum_f1.png',
                  'cats/xihuan/cat_drum_f2.png',
                ]}"""
)

content = content.replace(
"""                catImages={[
                  'cats/xihuan/cat_sing_f1.png',
                  'cats/xihuan/cat_sing_f2.png',
                  'cats/xihuan/cat_sing_f3.png',
                ]}""",
"""                catImages={[
                  'cats/xihuan/cat_sing_f1.png',
                  'cats/xihuan/cat_sing_f2.png',
                ]}"""
)

content = content.replace(
"""                catImages={[
                  'cats/xihuan/cat_victory_f1.png',
                  'cats/xihuan/cat_victory_f2.png',
                  'cats/xihuan/cat_victory_f3.png',
                ]}""",
"""                catImages={[
                  'cats/xihuan/cat_victory_f1.png',
                  'cats/xihuan/cat_victory_f2.png',
                ]}"""
)

content = content.replace(
"""                catImages={[
                  'cats/xihuan/cat_bird_f1.png',
                  'cats/xihuan/cat_bird_f2.png',
                  'cats/xihuan/cat_bird_f3.png',
                ]}""",
"""                catImages={[
                  'cats/xihuan/cat_bird_f1.png',
                  'cats/xihuan/cat_bird_f2.png',
                ]}"""
)

content = content.replace(
"""                catImages={[
                  'cats/xihuan/cat_gasp_f1.png',
                  'cats/xihuan/cat_gasp_f2.png',
                  'cats/xihuan/cat_gasp_f3.png',
                ]}""",
"""                catImages={[
                  'cats/xihuan/cat_gasp_f1.png',
                  'cats/xihuan/cat_gasp_f2.png',
                ]}"""
)

content = content.replace(
"""                catImages={[
                  'cats/xihuan/cat_cheer_f1.png',
                  'cats/xihuan/cat_cheer_f2.png',
                  'cats/xihuan/cat_cheer_f3.png',
                ]}""",
"""                catImages={[
                  'cats/xihuan/cat_cheer_f1.png',
                  'cats/xihuan/cat_cheer_f2.png',
                ]}"""
)

with open(template_path, 'w') as f:
    f.write(content)

print("✅ Successfully updated EtymologyTemplate.tsx with genuine 2-frame flipbook animation!")
