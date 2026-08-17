import os
from PIL import Image

def make_transparent(img_path, out_path):
    img = Image.open(img_path).convert('RGBA')
    datas = img.getdata()

    new_data = []
    for item in datas:
        # Check if pixel is close to white (R > 235, G > 235, B > 235)
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            new_data.append((255, 255, 255, 0))  # Transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "PNG")
    print(f"✅ Processed transparency: {out_path}")

base_dir = "/Users/peterridilla/.gemini/antigravity/brain/65f57bf0-24c4-4b3a-ad2f-1dac1b2037a1"
out_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/cats/kaishi"

mapping = {
    # 1. Hook / Synthesis: 开始 (Start line flag)
    "cat_hook_f1_1786869499691.jpg": ["cat_hook_f1.png", "cat_hook_f3.png", "cat_kaishi_f1.png", "cat_kaishi_f3.png"],
    "cat_hook_f2_1786869515694.jpg": ["cat_hook_f2.png", "cat_kaishi_f2.png"],

    # 2. Gate / Unlatch: 门 / 开 (Lifting gate latch)
    "cat_gate_f1_1786869526638.jpg": ["cat_gate_f1.png", "cat_gate_f3.png"],
    "cat_gate_f2_1786869537440.jpg": ["cat_gate_f2.png"],

    # 3. Open path: 开 (Walking through open doors)
    "cat_open_f1_1786869549304.jpg": ["cat_open_f1.png", "cat_open_f3.png"],
    "cat_open_f2_1786869563661.jpg": ["cat_open_f2.png"],

    # 4. Woman / Mother: 女 (Mother hugging kitten)
    "cat_woman_f1_1786869575091.jpg": ["cat_woman_f1.png", "cat_woman_f3.png"],
    "cat_woman_f2_1786869589762.jpg": ["cat_woman_f2.png"],

    # 5. Origin / Sound: 台 (Megaphone on platform)
    "cat_origin_f1_1786869603247.jpg": ["cat_origin_f1.png", "cat_origin_f3.png"],
    "cat_origin_f2_1786869619556.jpg": ["cat_origin_f2.png"],

    # 6. New Life / Birth: 始 (Kitten with seedling)
    "cat_birth_f1_1786869635299.jpg": ["cat_birth_f1.png", "cat_birth_f2.png", "cat_birth_f3.png"],
}

for src_name, dst_list in mapping.items():
    src_path = os.path.join(base_dir, src_name)
    if not os.path.exists(src_path):
        print(f"Warning: {src_path} not found")
        continue
    for dst_name in dst_list:
        dst_path = os.path.join(out_dir, dst_name)
        make_transparent(src_path, dst_path)

print("All cat sketches processed!")
