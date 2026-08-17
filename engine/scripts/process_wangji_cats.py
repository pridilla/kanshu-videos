#!/usr/bin/env python3
import os
import glob
from PIL import Image

brain_dir = "/Users/peterridilla/.gemini/antigravity/brain/73a5812d-c147-4587-930c-1596ac39678e"
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
    "cat_wangji_word_frame_1": "cat_wangji_word_frame_1.png",
    "cat_wangji_word_frame_2": "cat_wangji_word_frame_2.png",
    "cat_wangji_word_frame_3": "cat_wangji_word_frame_3.png",
    
    "cat_wang_whole_frame_1": "cat_wang_whole_frame_1.png",
    "cat_wang_whole_frame_2": "cat_wang_whole_frame_2.png",
    "cat_wang_whole_frame_3": "cat_wang_whole_frame_3.png",
    
    "cat_wang_top_frame_1": "cat_wang_top_frame_1.png",
    "cat_wang_top_frame_2": "cat_wang_top_frame_2.png",
    "cat_wang_top_frame_3": "cat_wang_top_frame_3.png",
    
    "cat_wang_bottom_frame_1": "cat_wang_bottom_frame_1.png",
    "cat_wang_bottom_frame_2": "cat_wang_bottom_frame_2.png",
    "cat_wang_bottom_frame_3": "cat_wang_bottom_frame_3.png",

    "cat_ji_whole_frame_1": "cat_ji_whole_frame_1.png",
    "cat_ji_whole_frame_2": "cat_ji_whole_frame_2.png",
    "cat_ji_whole_frame_3": "cat_ji_whole_frame_3.png",

    "cat_ji_left_frame_1": "cat_ji_left_frame_1.png",
    "cat_ji_left_frame_2": "cat_ji_left_frame_2.png",
    "cat_ji_left_frame_3": "cat_ji_left_frame_3.png",

    "cat_ji_right_frame_1": "cat_ji_right_frame_1.png",
    "cat_ji_right_frame_2": "cat_ji_right_frame_2.png",
    "cat_ji_right_frame_3": "cat_ji_right_frame_3.png",
}

for key, target_name in mappings.items():
    pattern = os.path.join(brain_dir, f"{key}*.png")
    matches = glob.glob(pattern)
    if matches:
        src = sorted(matches)[-1]
        out_path = os.path.join(cats_dir, target_name)
        img = make_transparent_image(src)
        img.save(out_path, "PNG")
        print(f"✅ Saved transparent: {out_path}")
