#!/usr/bin/env python3
import os
import glob
from PIL import Image, ImageOps, ImageEnhance

def make_transparent_lineart(img_path, out_path, size=680):
    img = Image.open(img_path).convert('RGBA')
    
    # Crop borders slightly to remove any bounding lines
    w, h = img.size
    crop_margin = int(w * 0.02)
    img = img.crop((crop_margin, crop_margin, w - crop_margin, h - crop_margin))
    
    # Convert to grayscale for thresholding
    gray = img.convert('L')
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(gray)
    gray = enhancer.enhance(2.0)
    
    # Create mask: white background becomes transparent, dark line stays solid
    # Deep slate color for lines: #0F172A (RGB: 15, 23, 42)
    line_r, line_g, line_b = 15, 23, 42
    
    datas = gray.getdata()
    new_data = []
    for item in datas:
        # Inverted luminance as alpha
        alpha = 255 - item
        if alpha < 35:
            new_data.append((255, 255, 255, 0))
        else:
            # Smooth anti-aliased edge
            new_data.append((line_r, line_g, line_b, int(min(255, alpha * 1.3))))
            
    res = Image.new('RGBA', gray.size)
    res.putdata(new_data)
    
    # Resize to target size keeping aspect ratio
    res.thumbnail((size, size), Image.Resampling.LANCZOS)
    
    # Center on square canvas
    canvas = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    offset = ((size - res.width) // 2, (size - res.height) // 2)
    canvas.paste(res, offset, res)
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    canvas.save(out_path, 'PNG')
    print(f"✅ Saved transparent lineart: {out_path}")

def generate_micro_variation(img_path, out_path, rotate_deg=1.5, scale=1.02, size=680):
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    
    # Rotate slightly
    rot = img.rotate(rotate_deg, resample=Image.Resampling.BICUBIC, expand=False)
    
    # Scale slightly
    new_w = int(w * scale)
    new_h = int(h * scale)
    scaled = rot.resize((new_w, new_h), Image.Resampling.BICUBIC)
    
    # Center crop back to original
    left = (new_w - w) // 2
    top = (new_h - h) // 2
    cropped = scaled.crop((left, top, left + w, top + h))
    
    cropped.save(out_path, 'PNG')
    print(f"✅ Created micro-animation frame: {out_path}")

def main():
    brain_dir = "/Users/peterridilla/.gemini/antigravity/brain/65f57bf0-24c4-4b3a-ad2f-1dac1b2037a1"
    out_dir = "/Users/peterridilla/Documents/fun/kanshu/videos/engine/public/cats/chicu"
    os.makedirs(out_dir, exist_ok=True)
    
    # Map generated JPEGs
    files = {
        'cat_chicu_f1': sorted(glob.glob(f"{brain_dir}/cat_chicu_f1_*.jpg")),
        'cat_chicu_f2': sorted(glob.glob(f"{brain_dir}/cat_chicu_f2_*.jpg")),
        'cat_mouth_f1': sorted(glob.glob(f"{brain_dir}/cat_mouth_f1_*.jpg")),
        'cat_mouth_f2': sorted(glob.glob(f"{brain_dir}/cat_mouth_f2_*.jpg")),
        'cat_beg_f1': sorted(glob.glob(f"{brain_dir}/cat_beg_f1_*.jpg")),
        'cat_beg_f2': sorted(glob.glob(f"{brain_dir}/cat_beg_f2_*.jpg")),
        'cat_eat_f1': sorted(glob.glob(f"{brain_dir}/cat_eat_f1_*.jpg")),
        'cat_eat_f2': sorted(glob.glob(f"{brain_dir}/cat_eat_f2_*.jpg")),
        'cat_jar_f1': sorted(glob.glob(f"{brain_dir}/cat_jar_f1_*.jpg")),
        'cat_jar_f2': sorted(glob.glob(f"{brain_dir}/cat_jar_f2_*.jpg")),
        'cat_time_f1': sorted(glob.glob(f"{brain_dir}/cat_time_f1_*.jpg")),
        'cat_time_f2': sorted(glob.glob(f"{brain_dir}/cat_time_f2_*.jpg")),
        'cat_sour_f1': sorted(glob.glob(f"{brain_dir}/cat_sour_f1_*.jpg")),
    }
    
    for key, paths in files.items():
        if paths:
            latest = paths[-1]
            out_p = os.path.join(out_dir, f"{key}.png")
            make_transparent_lineart(latest, out_p)
            
    # For cat_sour_f2: generate micro-variation from cat_sour_f1
    sour_f1 = os.path.join(out_dir, "cat_sour_f1.png")
    sour_f2 = os.path.join(out_dir, "cat_sour_f2.png")
    if os.path.exists(sour_f1):
        generate_micro_variation(sour_f1, sour_f2, rotate_deg=-2.0, scale=1.015)
        
    # For cat_jealous_f1 & cat_jealous_f2 (Scene 4): use cat_chicu_f1/f2 or variations
    chicu_f1 = os.path.join(out_dir, "cat_chicu_f1.png")
    chicu_f2 = os.path.join(out_dir, "cat_chicu_f2.png")
    jealous_f1 = os.path.join(out_dir, "cat_jealous_f1.png")
    jealous_f2 = os.path.join(out_dir, "cat_jealous_f2.png")
    if os.path.exists(chicu_f1):
        make_transparent_lineart(files['cat_chicu_f1'][-1], jealous_f1)
    if os.path.exists(chicu_f2):
        make_transparent_lineart(files['cat_chicu_f2'][-1], jealous_f2)

if __name__ == '__main__':
    main()
