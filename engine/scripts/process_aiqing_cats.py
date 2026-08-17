#!/usr/bin/env python3
import os
import glob
from PIL import Image

brain_dir = "/Users/peterridilla/.gemini/antigravity/brain/448ea3ee-a752-4268-b5d7-9204915d30c4"
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
    "cat_aiqing_word_frame_1": "cat_aiqing_word_frame_1.png",
    "cat_aiqing_word_frame_2": "cat_aiqing_word_frame_2.png",
    "cat_aiqing_word_frame_3": "cat_aiqing_word_frame_3.png",
}

for key, target_name in mappings.items():
    pattern = os.path.join(brain_dir, f"{key}*.png")
    matches = glob.glob(pattern)
    if matches:
        src = matches[-1]
        out_path = os.path.join(cats_dir, target_name)
        img = make_transparent_image(src)
        img.save(out_path, "PNG")
        print(f"✅ Saved transparent: {out_path}")

# Re-use aiqing_word for all radicals to save time
frames = ["cat_aiqing_word_frame_1.png", "cat_aiqing_word_frame_2.png", "cat_aiqing_word_frame_3.png"]

radicals = ["cat_ai_whole", "cat_ai_top", "cat_ai_bottom", "cat_qing_whole", "cat_qing_left", "cat_qing_right"]

for rad in radicals:
    for i, frame in enumerate(frames):
        src = os.path.join(cats_dir, frame)
        if os.path.exists(src):
            dest = os.path.join(cats_dir, f"{rad}_frame_{i+1}.png")
            Image.open(src).save(dest)
            print(f"✅ Copied to: {dest}")
