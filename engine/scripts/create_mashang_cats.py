#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFont

def make_transparent(img, threshold=240):
    img = img.convert('RGBA')
    datas = img.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If nearly white, make transparent
        if r > threshold and g > threshold and b > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            # Clean dark line
            brightness = (r + g + b) // 3
            alpha = 255 if brightness < threshold else int((255 - brightness) * (255 / (255 - threshold)))
            new_data.append((15, 23, 42, alpha))
    img.putdata(new_data)
    return img

def draw_horse_cat_hook(frame_idx=1):
    # Canvas
    W, H = 1000, 1000
    img = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    ink = (15, 23, 42, 255)
    lw = 12

    bob = 15 if frame_idx == 2 else 0
    leg_offset = 25 if frame_idx == 2 else 0

    # 1. Horse Body
    # Torso
    draw.ellipse([300, 520 + bob, 720, 760 + bob], outline=ink, width=lw)
    # Horse Neck & Head
    draw.polygon([(620, 600 + bob), (780, 360 + bob), (860, 390 + bob), (700, 680 + bob)], outline=ink, width=lw)
    # Horse Head
    draw.ellipse([760, 340 + bob, 920, 480 + bob], outline=ink, width=lw)
    # Horse Muzzle
    draw.ellipse([860, 400 + bob, 940, 470 + bob], outline=ink, width=lw)
    # Horse Ear
    draw.polygon([(780, 350 + bob), (800, 270 + bob), (840, 350 + bob)], outline=ink, width=lw)
    # Horse Mane (flowing lines)
    for i in range(5):
        mx = 660 + i * 25
        my = 400 + i * 40 + bob
        draw.arc([mx - 60, my - 60, mx + 60, my + 60], start=180, end=320, fill=ink, width=lw-2)
    # Horse Eye
    draw.ellipse([820, 380 + bob, 836, 396 + bob], fill=ink)
    # Horse Nostril
    draw.ellipse([910, 430 + bob, 922, 442 + bob], fill=ink)

    # Horse Legs (galloping)
    # Front Leg 1
    draw.line([(700, 700 + bob), (780 + leg_offset, 850 + bob), (840 + leg_offset, 880 + bob)], fill=ink, width=lw)
    # Front Leg 2
    draw.line([(660, 720 + bob), (720 - leg_offset, 860 + bob), (770 - leg_offset, 890 + bob)], fill=ink, width=lw)
    # Back Leg 1
    draw.line([(380, 700 + bob), (280 - leg_offset, 840 + bob), (220 - leg_offset, 870 + bob)], fill=ink, width=lw)
    # Back Leg 2
    draw.line([(420, 710 + bob), (340 + leg_offset, 850 + bob), (300 + leg_offset, 880 + bob)], fill=ink, width=lw)
    # Hooves
    for hx, hy in [(840 + leg_offset, 880 + bob), (770 - leg_offset, 890 + bob), (220 - leg_offset, 870 + bob), (300 + leg_offset, 880 + bob)]:
        draw.rectangle([hx - 15, hy - 15, hx + 15, hy + 15], fill=ink)

    # Horse Tail (flowing)
    draw.arc([200, 520 + bob, 360, 680 + bob], start=100, end=240, fill=ink, width=lw)
    draw.arc([160, 560 + bob, 320, 720 + bob], start=100, end=240, fill=ink, width=lw)

    # 2. Cat Riding On Horse
    cx, cy = 480, 380 + bob
    # Cat Body
    draw.ellipse([cx - 100, cy - 60, cx + 100, cy + 140], outline=ink, width=lw)
    # Cat Head
    draw.ellipse([cx - 90, cy - 180, cx + 90, cy], outline=ink, width=lw)
    # Cat Ears
    draw.polygon([(cx - 70, cy - 150), (cx - 80, cy - 240), (cx - 20, cy - 170)], outline=ink, width=lw)
    draw.polygon([(cx + 20, cy - 170), (cx + 80, cy - 240), (cx + 70, cy - 150)], outline=ink, width=lw)
    # Cat Eyes (happy squint)
    draw.arc([cx - 55, cy - 110, cx - 25, cy - 80], start=190, end=350, fill=ink, width=lw-4)
    draw.arc([cx + 25, cy - 110, cx + 55, cy - 80], start=190, end=350, fill=ink, width=lw-4)
    # Cat Nose & Mouth
    draw.polygon([(cx - 10, cy - 75), (cx + 10, cy - 75), (cx, cy - 65)], fill=ink)
    draw.arc([cx - 25, cy - 70, cx, cy - 45], start=0, end=180, fill=ink, width=lw-4)
    draw.arc([cx, cy - 70, cx + 25, cy - 45], start=0, end=180, fill=ink, width=lw-4)
    # Whiskers
    draw.line([(cx - 85, cy - 75), (cx - 130, cy - 85)], fill=ink, width=lw-4)
    draw.line([(cx - 85, cy - 65), (cx - 130, cy - 65)], fill=ink, width=lw-4)
    draw.line([(cx + 85, cy - 75), (cx + 130, cy - 85)], fill=ink, width=lw-4)
    draw.line([(cx + 85, cy - 65), (cx + 130, cy - 65)], fill=ink, width=lw-4)
    # Cat Warrior Headband
    draw.line([(cx - 95, cy - 145), (cx + 95, cy - 145)], fill=ink, width=lw)
    # Headband tail flowing
    draw.line([(cx - 95, cy - 145), (cx - 160, cy - 170 + bob)], fill=ink, width=lw-3)
    draw.line([(cx - 95, cy - 145), (cx - 150, cy - 130 + bob)], fill=ink, width=lw-3)
    # Cat Paws holding reins
    draw.ellipse([cx + 60, cy + 30, cx + 110, cy + 80], outline=ink, width=lw)
    # Reins line to horse mouth
    draw.line([(cx + 85, cy + 55), (880, 440 + bob)], fill=ink, width=lw-4)

    # Speed lines
    for sy in [300, 500, 700, 850]:
        sx = 80 if frame_idx == 1 else 120
        draw.line([(sx, sy), (sx + 100, sy)], fill=ink, width=lw-4)

    return img

def draw_cat_mane(frame_idx=1):
    W, H = 1000, 1000
    img = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    ink = (15, 23, 42, 255)
    lw = 12
    bob = 10 if frame_idx == 2 else 0

    # Horse head on right
    draw.ellipse([550, 320 + bob, 850, 620 + bob], outline=ink, width=lw)
    draw.polygon([(650, 340 + bob), (680, 220 + bob), (740, 330 + bob)], outline=ink, width=lw)
    draw.ellipse([720, 420 + bob, 740, 440 + bob], fill=ink)
    draw.ellipse([810, 520 + bob, 830, 540 + bob], fill=ink)
    # Luxurious Flowing Mane
    for i in range(6):
        my = 280 + i * 50 + bob
        draw.arc([420 - i*15, my, 650, my + 100], start=160, end=330, fill=ink, width=lw+2)

    # Cute cat on left combing mane with comb brush
    cx, cy = 300, 520 - bob
    draw.ellipse([cx - 110, cy - 60, cx + 110, cy + 180], outline=ink, width=lw)
    draw.ellipse([cx - 95, cy - 190, cx + 95, cy - 10], outline=ink, width=lw)
    # Ears
    draw.polygon([(cx - 75, cy - 160), (cx - 85, cy - 250), (cx - 25, cy - 180)], outline=ink, width=lw)
    draw.polygon([(cx + 25, cy - 180), (cx + 85, cy - 250), (cx + 75, cy - 160)], outline=ink, width=lw)
    # Eyes
    draw.arc([cx - 55, cy - 110, cx - 25, cy - 80], start=190, end=350, fill=ink, width=lw-4)
    draw.arc([cx + 25, cy - 110, cx + 55, cy - 80], start=190, end=350, fill=ink, width=lw-4)
    # Nose & Mouth
    draw.polygon([(cx - 10, cy - 75), (cx + 10, cy - 75), (cx, cy - 65)], fill=ink)
    draw.arc([cx - 25, cy - 70, cx, cy - 45], start=0, end=180, fill=ink, width=lw-4)
    draw.arc([cx, cy - 70, cx + 25, cy - 45], start=0, end=180, fill=ink, width=lw-4)
    # Cat Paw holding comb grooming mane
    brush_x = 460 if frame_idx == 1 else 490
    draw.ellipse([cx + 40, cy - 30, cx + 110, cy + 40], outline=ink, width=lw)
    # Comb
    draw.rectangle([brush_x, 380 + bob, brush_x + 35, 480 + bob], fill=ink)
    for ci in range(5):
        draw.line([(brush_x + 35, 390 + ci*20 + bob), (brush_x + 65, 390 + ci*20 + bob)], fill=ink, width=lw-5)

    # Sparkles
    draw.line([(520, 240), (520, 270)], fill=ink, width=lw-6)
    draw.line([(505, 255), (535, 255)], fill=ink, width=lw-6)
    return img

def draw_cat_hooves(frame_idx=1):
    W, H = 1000, 1000
    img = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    ink = (15, 23, 42, 255)
    lw = 12
    step = 30 if frame_idx == 2 else 0

    # Cat with 4 horse hoof boots running at sonic speed
    cx, cy = 480, 420
    draw.ellipse([cx - 130, cy - 70, cx + 130, cy + 150], outline=ink, width=lw)
    draw.ellipse([cx - 100, cy - 200, cx + 100, cy - 10], outline=ink, width=lw)
    # Ears
    draw.polygon([(cx - 80, cy - 170), (cx - 90, cy - 260), (cx - 30, cy - 190)], outline=ink, width=lw)
    draw.polygon([(cx + 30, cy - 190), (cx + 90, cy - 260), (cx + 80, cy - 170)], outline=ink, width=lw)
    # Eyes (intense running)
    draw.ellipse([cx - 50, cy - 120, cx - 25, cy - 95], fill=ink)
    draw.ellipse([cx + 25, cy - 120, cx + 50, cy - 95], fill=ink)
    # Nose & Mouth
    draw.polygon([(cx - 8, cy - 80), (cx + 8, cy - 80), (cx, cy - 70)], fill=ink)
    draw.arc([cx - 30, cy - 75, cx + 30, cy - 35], start=0, end=180, fill=ink, width=lw-4)

    # 4 Galloping Horse Hooves kicking up dust
    # Front Hoof 1
    draw.line([(cx + 60, cy + 100), (cx + 160 + step, cy + 240)], fill=ink, width=lw)
    draw.rectangle([(cx + 145 + step, cy + 240), (cx + 185 + step, cy + 270)], fill=ink)
    # Front Hoof 2
    draw.line([(cx + 30, cy + 110), (cx + 100 - step, cy + 260)], fill=ink, width=lw)
    draw.rectangle([(cx + 85 - step, cy + 260), (cx + 125 - step, cy + 290)], fill=ink)
    # Back Hoof 1
    draw.line([(cx - 60, cy + 100), (cx - 160 - step, cy + 240)], fill=ink, width=lw)
    draw.rectangle([(cx - 185 - step, cy + 240), (cx - 145 - step, cy + 270)], fill=ink)
    # Back Hoof 2
    draw.line([(cx - 30, cy + 110), (cx - 100 + step, cy + 260)], fill=ink, width=lw)
    draw.rectangle([(cx - 125 + step, cy + 260), (cx - 85 + step, cy + 290)], fill=ink)

    # Dust clouds at bottom
    for dx in [220, 320, 680, 780]:
        draw.arc([dx - 50, 720, dx + 50, 800], start=180, end=360, fill=ink, width=lw-4)
    return img

def draw_cat_mount(frame_idx=1):
    W, H = 1000, 1000
    img = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    ink = (15, 23, 42, 255)
    lw = 12
    climb = 20 if frame_idx == 2 else 0

    # Tall Horse saddle on right
    draw.arc([550, 350, 850, 650], start=180, end=360, fill=ink, width=lw+4)
    draw.rectangle([650, 480, 750, 560], outline=ink, width=lw) # Saddle stirrup
    draw.line([(700, 350), (700, 480)], fill=ink, width=lw) # Stirrup strap

    # Cat climbing upward (ideograph 上)
    cx, cy = 420, 580 - climb
    draw.ellipse([cx - 100, cy - 60, cx + 100, cy + 160], outline=ink, width=lw)
    draw.ellipse([cx - 90, cy - 190, cx + 90, cy - 10], outline=ink, width=lw)
    # Ears
    draw.polygon([(cx - 70, cy - 160), (cx - 80, cy - 250), (cx - 20, cy - 180)], outline=ink, width=lw)
    draw.polygon([(cx + 20, cy - 180), (cx + 80, cy - 250), (cx + 70, cy - 160)], outline=ink, width=lw)
    # Determined eyes
    draw.ellipse([cx - 40, cy - 110, cx - 20, cy - 90], fill=ink)
    draw.ellipse([cx + 20, cy - 110, cx + 40, cy - 90], fill=ink)
    # Reaching Paws UPWARD
    draw.line([(cx + 50, cy - 40), (660, 440)], fill=ink, width=lw)
    draw.ellipse([640, 420, 680, 460], outline=ink, width=lw) # Gripping paw

    # Giant glowing UP arrow indicator (ideograph 上)
    arrow_y = 220 - climb
    draw.polygon([(420, arrow_y - 60), (370, arrow_y + 20), (470, arrow_y + 20)], fill=ink)
    draw.rectangle([400, arrow_y + 20, 440, arrow_y + 90], fill=ink)
    return img

def draw_cat_courier_synthesis(frame_idx=1):
    W, H = 1000, 1000
    img = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    ink = (15, 23, 42, 255)
    lw = 12
    bob = 15 if frame_idx == 2 else 0

    # Noble Imperial Courier Cat on Horse with Royal Scroll
    # Horse
    draw.ellipse([260, 540 + bob, 740, 780 + bob], outline=ink, width=lw)
    draw.polygon([(640, 600 + bob), (800, 360 + bob), (880, 390 + bob), (720, 680 + bob)], outline=ink, width=lw)
    draw.ellipse([780, 340 + bob, 940, 480 + bob], outline=ink, width=lw)
    draw.polygon([(800, 350 + bob), (820, 270 + bob), (860, 350 + bob)], outline=ink, width=lw)
    draw.ellipse([840, 380 + bob, 856, 396 + bob], fill=ink)
    # Mane
    for i in range(5):
        mx = 680 + i * 25
        my = 400 + i * 40 + bob
        draw.arc([mx - 60, my - 60, mx + 60, my + 60], start=180, end=320, fill=ink, width=lw-2)

    # Cat
    cx, cy = 470, 380 + bob
    draw.ellipse([cx - 95, cy - 60, cx + 95, cy + 140], outline=ink, width=lw)
    draw.ellipse([cx - 85, cy - 180, cx + 85, cy], outline=ink, width=lw)
    draw.polygon([(cx - 65, cy - 150), (cx - 75, cy - 240), (cx - 15, cy - 170)], outline=ink, width=lw)
    draw.polygon([(cx + 15, cy - 170), (cx + 75, cy - 240), (cx + 65, cy - 150)], outline=ink, width=lw)
    # Happy eyes
    draw.arc([cx - 50, cy - 110, cx - 20, cy - 80], start=190, end=350, fill=ink, width=lw-4)
    draw.arc([cx + 20, cy - 110, cx + 50, cy - 80], start=190, end=350, fill=ink, width=lw-4)
    draw.polygon([(cx - 8, cy - 75), (cx + 8, cy - 75), (cx, cy - 65)], fill=ink)
    draw.arc([cx - 25, cy - 70, cx + 25, cy - 40], start=0, end=180, fill=ink, width=lw-4)

    # Imperial Courier Hat with feather
    draw.rectangle([cx - 70, cy - 210, cx + 70, cy - 175], fill=ink)
    draw.arc([cx + 40, cy - 300, cx + 120, cy - 190], start=200, end=340, fill=ink, width=lw-4)

    # Imperial Royal Scroll in hand
    sx, sy = cx + 80, cy - 40
    draw.rectangle([sx, sy, sx + 120, sy + 40], outline=ink, width=lw)
    draw.line([(sx + 10, sy - 15), (sx + 10, sy + 55)], fill=ink, width=lw)
    draw.line([(sx + 110, sy - 15), (sx + 110, sy + 55)], fill=ink, width=lw)
    draw.line([(sx + 30, sy + 20), (sx + 90, sy + 20)], fill=ink, width=lw-5) # Ribbon

    # Clouds below
    for cl_x in [200, 420, 650, 850]:
        draw.arc([cl_x - 90, 820, cl_x + 90, 920], start=180, end=360, fill=ink, width=lw-3)
    return img

def main():
    out_dir = 'engine/public/cats/mashang'
    os.makedirs(out_dir, exist_ok=True)

    assets = {
        'cat_hook_f1.png': draw_horse_cat_hook(1),
        'cat_hook_f2.png': draw_horse_cat_hook(2),
        'cat_mane_f1.png': draw_cat_mane(1),
        'cat_mane_f2.png': draw_cat_mane(2),
        'cat_hooves_f1.png': draw_cat_hooves(1),
        'cat_hooves_f2.png': draw_cat_hooves(2),
        'cat_horse_f1.png': draw_horse_cat_hook(1),
        'cat_horse_f2.png': draw_horse_cat_hook(2),
        'cat_mount_f1.png': draw_cat_mount(1),
        'cat_mount_f2.png': draw_cat_mount(2),
        'cat_courier_f1.png': draw_cat_courier_synthesis(1),
        'cat_courier_f2.png': draw_cat_courier_synthesis(2),
    }

    for name, img in assets.items():
        p = os.path.join(out_dir, name)
        img.save(p, 'PNG')
        print(f"✅ Generated transparent mascot asset: {p}")

if __name__ == '__main__':
    main()
