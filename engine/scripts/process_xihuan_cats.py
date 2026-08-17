import os
import glob
from PIL import Image, ImageOps

def make_transparent_lineart(img_path, out_path):
    img = Image.open(img_path).convert('L')
    
    # Invert grayscale: white (255) -> 0, black (0) -> 255
    # Boost contrast so paper background is 0 alpha
    table = []
    for i in range(256):
        if i >= 235:
            table.append(0)
        elif i <= 150:
            table.append(255)
        else:
            table.append(int((235 - i) / (235 - 150) * 255))
            
    alpha = img.point(table, mode='L')
    
    # Create dark slate color image (#0F172A = rgb(15, 23, 42))
    solid = Image.new('RGBA', img.size, (15, 23, 42, 255))
    solid.putalpha(alpha)
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    solid.save(out_path, 'PNG')
    print(f"Saved: {out_path}")

def generate_subtle_wobble_frames(base_png_path, out_prefix):
    img = Image.open(base_png_path).convert('RGBA')
    w, h = img.size
    
    # Frame 1: Original
    img.save(f"{out_prefix}_f1.png", 'PNG')
    
    # Frame 2: Slight stretch
    f2 = img.resize((int(w * 1.015), int(h * 0.985)), Image.Resampling.BILINEAR)
    canvas2 = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    x_off2 = (w - f2.width) // 2
    y_off2 = h - f2.height
    canvas2.paste(f2, (x_off2, y_off2))
    canvas2.save(f"{out_prefix}_f2.png", 'PNG')
    
    # Frame 3: Slight bounce
    f3 = img.resize((int(w * 0.985), int(h * 1.015)), Image.Resampling.BILINEAR)
    canvas3 = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    x_off3 = (w - f3.width) // 2
    y_off3 = h - f3.height
    canvas3.paste(f3, (x_off3, y_off3))
    canvas3.save(f"{out_prefix}_f3.png", 'PNG')
    print(f"Generated 3 flipbook frames for: {out_prefix}")

brain_dir = "/Users/peterridilla/.gemini/antigravity/brain/65f57bf0-24c4-4b3a-ad2f-1dac1b2037a1"
dest_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/cats/xihuan"
os.makedirs(dest_dir, exist_ok=True)

actions = [
    ("cat_xihuan_f1", "cat_xihuan"),
    ("cat_drum_f1", "cat_drum"),
    ("cat_sing_f1", "cat_sing"),
    ("cat_victory_f1", "cat_victory"),
    ("cat_bird_f1", "cat_bird"),
    ("cat_gasp_f1", "cat_gasp"),
    ("cat_cheer_f1", "cat_cheer"),
]

for src_prefix, out_name in actions:
    matches = glob.glob(f"{brain_dir}/{src_prefix}_*.jpg")
    if matches:
        latest = max(matches, key=os.path.getmtime)
        temp_png = f"{dest_dir}/{out_name}_base.png"
        make_transparent_lineart(latest, temp_png)
        generate_subtle_wobble_frames(temp_png, f"{dest_dir}/{out_name}")
        if os.path.exists(temp_png):
            os.remove(temp_png)
    else:
        print(f"Warning: No match found for {src_prefix}")

print("✅ Finished processing all xihuan cat flipbook frames!")
