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

brain_dir = "/Users/peterridilla/.gemini/antigravity/brain/8cc70d68-b456-4af2-82ae-02fa63f307db"
dest_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/cats/dongxi"
os.makedirs(dest_dir, exist_ok=True)

targets = [
    ("cat_dongxi_f1", "cat_dongxi_f1.png"),
    ("cat_dongxi_f2", "cat_dongxi_f2.png"),
    ("cat_dong_f1", "cat_dong_f1.png"),
    ("cat_dong_f2", "cat_dong_f2.png"),
    ("cat_xi_f1", "cat_xi_f1.png"),
    ("cat_xi_f2", "cat_xi_f2.png"),
    ("cat_market_f1", "cat_market_f1.png"),
    ("cat_market_f2", "cat_market_f2.png"),
]

for prefix, out_file in targets:
    matches = glob.glob(os.path.join(brain_dir, f"{prefix}_*.jpg"))
    if matches:
        latest = max(matches, key=os.path.getmtime)
        out_path = os.path.join(dest_dir, out_file)
        make_transparent_lineart(latest, out_path)
    else:
        print(f"Warning: No match found for {prefix}")

print("✅ Finished processing all dongxi cat flipbook frames!")
