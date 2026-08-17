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

base_dir = "/Users/peterridilla/.gemini/antigravity/brain/9090760f-c672-4acd-9c1e-4d6863e2f543"
out_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/cats/jieshao"

mapping = {
    "cat_boundaries_f1_1786687134256.jpg": "cat_boundaries_f1.png",
    "cat_boundaries_f2_1786687197496.jpg": "cat_boundaries_f2.png",
    "cat_boundaries_f3_1786687368763.jpg": "cat_boundaries_f3.png",

    "cat_person_f1_1786687142000.jpg": "cat_person_f1.png",
    "cat_person_f2_1786687206461.jpg": "cat_person_f2.png",
    "cat_person_f1_1786687142000.jpg": "cat_person_f3.png",  # fallback to f1

    "cat_gobetween_f1_1786687149550.jpg": "cat_gobetween_f1.png",
    "cat_gobetween_f2_1786687224599.jpg": "cat_gobetween_f2.png",
    "cat_gobetween_f1_1786687149550.jpg": "cat_gobetween_f3.png",  # fallback to f1

    "cat_silk_f1_1786687157521.jpg": "cat_silk_f1.png",
    "cat_silk_f2_1786687244877.jpg": "cat_silk_f2.png",
    "cat_silk_f1_1786687157521.jpg": "cat_silk_f3.png",  # fallback to f1

    "cat_sound_f1_1786687166907.jpg": "cat_sound_f1.png",
    "cat_sound_f2_1786687268920.jpg": "cat_sound_f2.png",
    "cat_sound_f1_1786687166907.jpg": "cat_sound_f3.png",  # fallback to f1

    "cat_link_f1_1786687175831.jpg": "cat_link_f1.png",
    "cat_link_f2_1786687281810.jpg": "cat_link_f2.png",
    "cat_link_f1_1786687175831.jpg": "cat_link_f3.png",  # fallback to f1
}

for src, dst in mapping.items():
    src_path = os.path.join(base_dir, src)
    dst_path = os.path.join(out_dir, dst)
    make_transparent(src_path, dst_path)

