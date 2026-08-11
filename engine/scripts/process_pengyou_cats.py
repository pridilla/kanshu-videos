#!/usr/bin/env python3
import os
import glob
from PIL import Image

brain_dir = "/Users/peterridilla/.gemini/antigravity/brain/e92c1308-de72-4bf8-a156-15b657987fdc"
cats_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/cats"

os.makedirs(cats_dir, exist_ok=True)

def make_transparent_image(in_path):
    img = Image.open(in_path).convert('RGBA')
    datas = img.getdata()
    new_data = []
    for item in datas:
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img

mappings = {
    "cat_pengyou_word_frame_1": "cat_pengyou_word_frame_1.png",
    "cat_pengyou_word_frame_2": "cat_pengyou_word_frame_2.png",
    "cat_pengyou_word_frame_3": "cat_pengyou_word_frame_3.png",
    "cat_peng_left_frame_1": "cat_peng_left_frame_1.png",
    "cat_peng_left_frame_2": "cat_peng_left_frame_2.png",
    "cat_peng_left_frame_3": "cat_peng_left_frame_3.png",
    "cat_peng_right_frame_1": "cat_peng_right_frame_1.png",
    "cat_peng_right_frame_2": "cat_peng_right_frame_2.png",
    "cat_peng_right_frame_3": "cat_peng_right_frame_3.png",
    "cat_peng_whole_frame_1": "cat_peng_whole_frame_1.png",
    "cat_peng_whole_frame_2": "cat_peng_whole_frame_2.png",
    "cat_peng_whole_frame_3": "cat_peng_whole_frame_3.png",
    "cat_you_top_frame_1": "cat_you_top_frame_1.png",
}

for key, target_name in mappings.items():
    pattern = os.path.join(brain_dir, f"{key}*.png")
    matches = glob.glob(pattern)
    if matches:
        src = matches[0]
        out_path = os.path.join(cats_dir, target_name)
        img = make_transparent_image(src)
        img.save(out_path, "PNG")
        print(f"✅ Saved transparent: {out_path}")

# Fill missing frames for cat_you_top
you_top_1 = os.path.join(cats_dir, "cat_you_top_frame_1.png")
if os.path.exists(you_top_1):
    img = Image.open(you_top_1)
    img.save(os.path.join(cats_dir, "cat_you_top_frame_2.png"))
    img.save(os.path.join(cats_dir, "cat_you_top_frame_3.png"))
    print("✅ Created cat_you_top_frame_2 and 3")

# For cat_you_bottom (🤝 又 - Holding Paws / Helping Hand), use transparent version of cat_zhu_right or cat_pengyou_word
pengyou_word_1 = os.path.join(cats_dir, "cat_pengyou_word_frame_1.png")
pengyou_word_2 = os.path.join(cats_dir, "cat_pengyou_word_frame_2.png")
pengyou_word_3 = os.path.join(cats_dir, "cat_pengyou_word_frame_3.png")

if os.path.exists(pengyou_word_1):
    Image.open(pengyou_word_1).save(os.path.join(cats_dir, "cat_you_bottom_frame_1.png"))
    Image.open(pengyou_word_2).save(os.path.join(cats_dir, "cat_you_bottom_frame_2.png"))
    Image.open(pengyou_word_3).save(os.path.join(cats_dir, "cat_you_bottom_frame_3.png"))
    print("✅ Created cat_you_bottom_frame_1, 2, and 3")

# For cat_you_whole (🤛 友 - True Friendship), use transparent version of cat_peng_whole
peng_whole_1 = os.path.join(cats_dir, "cat_peng_whole_frame_1.png")
peng_whole_2 = os.path.join(cats_dir, "cat_peng_whole_frame_2.png")
peng_whole_3 = os.path.join(cats_dir, "cat_peng_whole_frame_3.png")

if os.path.exists(peng_whole_1):
    Image.open(peng_whole_1).save(os.path.join(cats_dir, "cat_you_whole_frame_1.png"))
    Image.open(peng_whole_2).save(os.path.join(cats_dir, "cat_you_whole_frame_2.png"))
    Image.open(peng_whole_3).save(os.path.join(cats_dir, "cat_you_whole_frame_3.png"))
    print("✅ Created cat_you_whole_frame_1, 2, and 3")
