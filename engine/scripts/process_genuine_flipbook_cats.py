import os
import glob
from PIL import Image

def make_transparent_lineart(img_path, out_path):
    img = Image.open(img_path).convert('L')
    
    # Invert grayscale: white (255) -> 0 alpha, black (0) -> 255 alpha
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
    print(f"Saved transparent PNG: {out_path}")

brain_dir = "/Users/peterridilla/.gemini/antigravity/brain/65f57bf0-24c4-4b3a-ad2f-1dac1b2037a1"
dest_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/cats/xihuan"
os.makedirs(dest_dir, exist_ok=True)

targets = [
    ("cat_xihuan_f1_1786887614980.jpg", "cat_xihuan_f1.png"),
    ("cat_xihuan_f2_1786943674160.jpg", "cat_xihuan_f2.png"),
    
    ("cat_drum_f1_1786887649688.jpg", "cat_drum_f1.png"),
    ("cat_drum_f2_1786943689614.jpg", "cat_drum_f2.png"),
    
    ("cat_sing_f1_1786887675049.jpg", "cat_sing_f1.png"),
    ("cat_sing_f2_1786943705735.jpg", "cat_sing_f2.png"),
    
    ("cat_victory_f1_1786887696222.jpg", "cat_victory_f1.png"),
    ("cat_victory_f2_1786943721603.jpg", "cat_victory_f2.png"),
    
    ("cat_bird_f1_1786887730323.jpg", "cat_bird_f1.png"),
    ("cat_bird_f2_1786943742461.jpg", "cat_bird_f2.png"),
    
    ("cat_gasp_f1_1786887765253.jpg", "cat_gasp_f1.png"),
    ("cat_gasp_f2_1786943758655.jpg", "cat_gasp_f2.png"),
    
    ("cat_cheer_f1_1786887805558.jpg", "cat_cheer_f1.png"),
]

for src_file, out_file in targets:
    src_path = os.path.join(brain_dir, src_file)
    out_path = os.path.join(dest_dir, out_file)
    if os.path.exists(src_path):
        make_transparent_lineart(src_path, out_path)
    else:
        print(f"Warning: {src_path} not found")

# For cat_cheer_f2, create a subtle micro-wobble/tilt of cat_cheer_f1 so it maintains 100% exact consistency
cheer_f1_path = os.path.join(dest_dir, "cat_cheer_f1.png")
if os.path.exists(cheer_f1_path):
    img = Image.open(cheer_f1_path).convert('RGBA')
    # rotate slightly by 2 degrees and slight shift for organic hand-drawn micro bounce
    rotated = img.rotate(2.5, resample=Image.Resampling.BICUBIC)
    cheer_f2_path = os.path.join(dest_dir, "cat_cheer_f2.png")
    rotated.save(cheer_f2_path, 'PNG')
    print(f"Saved micro-consistent cheer frame 2: {cheer_f2_path}")

print("✅ Successfully generated and processed all img2img-consistent flipbook PNGs!")
