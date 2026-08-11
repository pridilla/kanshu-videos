#!/usr/bin/env python3
"""
Process Cat Image Transparency
------------------------------
Converts white background (threshold > 235) in line art sketches to transparent PNG.
"""

import sys
import os
from PIL import Image

def make_transparent(img_path, out_path=None):
    if out_path is None:
        out_path = img_path

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

if __name__ == "__main__":
    if len(sys.argv) > 1:
        make_transparent(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
