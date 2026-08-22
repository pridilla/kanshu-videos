#!/usr/bin/env python3
import os

out_dir = 'engine/public/cats/mashang'
os.makedirs(out_dir, exist_ok=True)

def generate_svgs():
    # 1. Cat Hook (Galloping horse ambush)
    for f in [1, 2]:
        bob = 12 if f == 2 else 0
        wob = -8 if f == 2 else 8
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <g stroke="#0F172A" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Speed Lines -->
    <path d="M 50 320 L 180 320" stroke-width="10" opacity="0.6"/>
    <path d="M 80 480 L 220 480" stroke-width="10" opacity="0.6"/>
    <path d="M 40 620 L 160 620" stroke-width="10" opacity="0.6"/>
    
    <!-- Horse Gallop -->
    <!-- Tail -->
    <path d="M 220 {480+bob} C 140 {420+bob}, 120 {560+bob}, 160 {600+bob}" stroke-width="16"/>
    <path d="M 210 {500+bob} C 150 {470+bob}, 140 {580+bob}, 180 {620+bob}" stroke-width="12"/>
    
    <!-- Body -->
    <path d="M 240 {520+bob} C 280 {440+bob}, 460 {440+bob}, 540 {480+bob} C 620 {420+bob}, 680 {300+bob}, 700 {240+bob} C 730 {250+bob}, 750 {300+bob}, 720 {360+bob} C 680 {460+bob}, 600 {560+bob}, 540 {580+bob} C 460 {640+bob}, 320 {640+bob}, 240 {520+bob} Z" fill="#FFFFFF"/>
    
    <!-- Horse Head & Ears -->
    <path d="M 700 {240+bob} L 690 {190+bob} L 720 {220+bob} Z" fill="#FFFFFF"/>
    <path d="M 715 {225+bob} L 730 {180+bob} L 745 {220+bob} Z" fill="#FFFFFF"/>
    <path d="M 700 {240+bob} C 740 {220+bob}, 770 {260+bob}, 760 {300+bob} C 750 {330+bob}, 710 {340+bob}, 680 {320+bob}" fill="#FFFFFF"/>
    
    <!-- Horse Eye & Nostril -->
    <circle cx="730" cy="{260+bob}" r="6" fill="#0F172A"/>
    <circle cx="755" cy="{295+bob}" r="5" fill="#0F172A"/>
    
    <!-- Flowing Mane -->
    <path d="M 640 {340+bob} C 590 {300+bob}, 580 {360+bob}, 540 {380+bob}" stroke-width="12"/>
    <path d="M 600 {400+bob} C 560 {370+bob}, 540 {420+bob}, 500 {440+bob}" stroke-width="12"/>
    
    <!-- Legs (Galloping) -->
    <path d="M 520 {580+bob} C 580 {660+bob}, 640 {720+bob}, 700 {740+bob}"/>
    <path d="M 500 {600+bob} C 540 {660+bob}, 580 {720+bob}, 620 {750+bob}"/>
    <path d="M 280 {580+bob} C 220 {650+bob}, 180 {710+bob}, 140 {730+bob}"/>
    <path d="M 320 {600+bob} C 280 {660+bob}, 240 {720+bob}, 200 {740+bob}"/>
    
    <!-- Hooves -->
    <rect x="690" y="{730+bob}" width="25" height="20" rx="4" fill="#0F172A"/>
    <rect x="610" y="{740+bob}" width="25" height="20" rx="4" fill="#0F172A"/>
    <rect x="130" y="{720+bob}" width="25" height="20" rx="4" fill="#0F172A"/>
    <rect x="190" y="{730+bob}" width="25" height="20" rx="4" fill="#0F172A"/>
    
    <!-- Cute Samurai Cat Riding -->
    <!-- Cat Body -->
    <ellipse cx="380" cy="{360+bob}" rx="90" ry="80" fill="#FFFFFF"/>
    <!-- Cat Head -->
    <ellipse cx="380" cy="{240+bob}" rx="85" ry="75" fill="#FFFFFF"/>
    <!-- Cat Ears -->
    <path d="M 320 {190+bob} L 310 {120+bob} L 360 {170+bob} Z" fill="#FFFFFF"/>
    <path d="M 440 {190+bob} L 450 {120+bob} L 400 {170+bob} Z" fill="#FFFFFF"/>
    <!-- Headband -->
    <path d="M 295 {220+bob} Q 380 {240+bob} 465 {220+bob}" stroke="#FF6F59" stroke-width="14"/>
    <path d="M 295 {220+bob} L {230+wob} {200+bob}" stroke="#FF6F59" stroke-width="12"/>
    <path d="M 295 {220+bob} L {240+wob} {240+bob}" stroke="#FF6F59" stroke-width="12"/>
    <!-- Happy Face -->
    <path d="M 340 {245+bob} Q 355 {230+bob} 370 {245+bob}" stroke-width="8"/>
    <path d="M 390 {245+bob} Q 405 {230+bob} 420 {245+bob}" stroke-width="8"/>
    <polygon points="375,{255+bob} 385,{255+bob} 380,{262+bob}" fill="#0F172A"/>
    <path d="M 370 {265+bob} Q 380 {275+bob} 390 {265+bob}" stroke-width="6"/>
    <!-- Whiskers -->
    <path d="M 320 {250+bob} L 280 {245+bob}"/>
    <path d="M 320 {260+bob} L 280 {265+bob}"/>
    <path d="M 440 {250+bob} L 480 {245+bob}"/>
    <path d="M 440 {260+bob} L 480 {265+bob}"/>
    <!-- Holding Reins -->
    <ellipse cx="440" cy="{360+bob}" rx="20" ry="18" fill="#FFFFFF"/>
    <path d="M 455 {360+bob} L 730 {310+bob}" stroke="#0F172A" stroke-width="8"/>
  </g>
</svg>'''
        with open(os.path.join(out_dir, f'cat_hook_f{f}.svg'), 'w') as out:
            out.write(svg)
        with open(os.path.join(out_dir, f'cat_horse_f{f}.svg'), 'w') as out:
            out.write(svg)

    # 2. Cat Grooming Horse Mane (马 - Mane)
    for f in [1, 2]:
        brush_x = 440 if f == 1 else 465
        bob = 8 if f == 2 else 0
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <g stroke="#0F172A" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Horse Profile on Right -->
    <path d="M 460 {420+bob} C 520 {320+bob}, 580 {260+bob}, 640 {240+bob} C 670 {250+bob}, 690 {290+bob}, 670 {350+bob} C 620 {440+bob}, 560 {540+bob}, 500 {580+bob}" fill="#FFFFFF"/>
    <path d="M 640 {240+bob} L 630 {180+bob} L 660 {220+bob} Z" fill="#FFFFFF"/>
    <circle cx="650" cy="{280+bob}" r="6" fill="#0F172A"/>
    
    <!-- Flowing Mane (highlighted with sparkles) -->
    <path d="M 580 {290+bob} C 500 {270+bob}, 460 {340+bob}, 400 {360+bob}" stroke="#FF6F59" stroke-width="16"/>
    <path d="M 540 {350+bob} C 480 {340+bob}, 440 {410+bob}, 380 {430+bob}" stroke="#FF6F59" stroke-width="16"/>
    <path d="M 500 {420+bob} C 450 {410+bob}, 420 {480+bob}, 360 {500+bob}" stroke="#FF6F59" stroke-width="16"/>
    
    <!-- Sparkles on Mane -->
    <path d="M 420 280 L 420 310 M 405 295 L 435 295" stroke="#FF6F59" stroke-width="6"/>
    <path d="M 350 370 L 350 400 M 335 385 L 365 385" stroke="#FF6F59" stroke-width="6"/>

    <!-- Cute Cat on Left Grooming with Comb -->
    <ellipse cx="260" cy="500" rx="100" ry="90" fill="#FFFFFF"/>
    <ellipse cx="260" cy="360" rx="90" ry="80" fill="#FFFFFF"/>
    <!-- Cat Ears -->
    <path d="M 195 300 L 180 230 L 235 280 Z" fill="#FFFFFF"/>
    <path d="M 325 300 L 340 230 L 285 280 Z" fill="#FFFFFF"/>
    <!-- Happy Face -->
    <path d="M 220 365 Q 235 350 250 365" stroke-width="8"/>
    <path d="M 270 365 Q 285 350 300 365" stroke-width="8"/>
    <polygon points="255,375 265,375 260,382" fill="#0F172A"/>
    <path d="M 250 385 Q 260 395 270 385" stroke-width="6"/>
    <!-- Whiskers -->
    <path d="M 190 370 L 150 365 M 190 380 L 150 385"/>
    <path d="M 330 370 L 370 365 M 330 380 L 370 385"/>
    <!-- Comb Brush in Paw -->
    <ellipse cx="340" cy="460" rx="22" ry="20" fill="#FFFFFF"/>
    <rect x="{brush_x}" y="380" width="30" height="70" rx="6" fill="#0F172A"/>
    <path d="M {brush_x+30} 395 L {brush_x+55} 395 M {brush_x+30} 415 L {brush_x+55} 415 M {brush_x+30} 435 L {brush_x+55} 435" stroke-width="8"/>
  </g>
</svg>'''
        with open(os.path.join(out_dir, f'cat_mane_f{f}.svg'), 'w') as out:
            out.write(svg)

    # 3. Cat Running with 4 Hooves (马 - 4 Hooves)
    for f in [1, 2]:
        step = 30 if f == 2 else -30
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <g stroke="#0F172A" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Dust Clouds -->
    <path d="M 140 680 Q 180 630 230 680 Q 280 630 330 680" stroke-width="10" opacity="0.6"/>
    <path d="M 500 680 Q 550 630 600 680 Q 650 630 700 680" stroke-width="10" opacity="0.6"/>
    
    <!-- Cat Sprinting -->
    <ellipse cx="400" cy="380" rx="110" ry="90" fill="#FFFFFF"/>
    <ellipse cx="400" cy="240" rx="90" ry="80" fill="#FFFFFF"/>
    <!-- Ears -->
    <path d="M 330 180 L 310 110 L 370 160 Z" fill="#FFFFFF"/>
    <path d="M 470 180 L 490 110 L 430 160 Z" fill="#FFFFFF"/>
    <!-- Intense Running Face -->
    <circle cx="365" cy="240" r="10" fill="#0F172A"/>
    <circle cx="435" cy="240" r="10" fill="#0F172A"/>
    <polygon points="395,255 405,255 400,262" fill="#0F172A"/>
    <path d="M 385 270 Q 400 290 415 270" stroke-width="8"/>
    <!-- Whiskers -->
    <path d="M 330 250 L 280 240 M 330 265 L 280 270"/>
    <path d="M 470 250 L 520 240 M 470 265 L 520 270"/>

    <!-- 4 Galloping Horse Hooves (Highlighted in Coral) -->
    <path d="M 340 450 L {260-step} 600" stroke="#FF6F59" stroke-width="16"/>
    <rect x="{240-step}" y="600" width="35" height="30" rx="6" fill="#FF6F59"/>
    
    <path d="M 370 460 L {330+step} 610" stroke="#FF6F59" stroke-width="16"/>
    <rect x="{310+step}" y="610" width="35" height="30" rx="6" fill="#FF6F59"/>
    
    <path d="M 430 460 L {470-step} 610" stroke="#FF6F59" stroke-width="16"/>
    <rect x="{450-step}" y="610" width="35" height="30" rx="6" fill="#FF6F59"/>
    
    <path d="M 460 450 L {540+step} 600" stroke="#FF6F59" stroke-width="16"/>
    <rect x="{520+step}" y="600" width="35" height="30" rx="6" fill="#FF6F59"/>
  </g>
</svg>'''
        with open(os.path.join(out_dir, f'cat_hooves_f{f}.svg'), 'w') as out:
            out.write(svg)

    # 4. Cat Climbing / Mounting Upward (上 - Mounting / Baseline)
    for f in [1, 2]:
        climb = 25 if f == 2 else 0
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <g stroke="#0F172A" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Big Glowing UP Arrow (Ideograph 上) -->
    <polygon points="400,{140-climb} 340,{210-climb} 380,{210-climb} 380,{300-climb} 420,{300-climb} 420,{210-climb} 460,{210-climb}" fill="#FF6F59" stroke="#FF6F59" stroke-width="8"/>
    
    <!-- Horizontal Saddle Stirrup Baseline (The line in 上) -->
    <line x1="150" y1="620" x2="650" y2="620" stroke="#0F172A" stroke-width="18"/>
    <rect x="220" y="620" width="80" height="15" fill="#0F172A"/>
    <rect x="500" y="620" width="80" height="15" fill="#0F172A"/>
    
    <!-- Cat Reaching & Climbing UPWARD -->
    <ellipse cx="400" cy="{520-climb}" rx="100" ry="90" fill="#FFFFFF"/>
    <ellipse cx="400" cy="{380-climb}" rx="85" ry="75" fill="#FFFFFF"/>
    <!-- Ears -->
    <path d="M 335 {320-climb} L 320 {250-climb} L 375 {300-climb} Z" fill="#FFFFFF"/>
    <path d="M 465 {320-climb} L 480 {250-climb} L 425 {300-climb} Z" fill="#FFFFFF"/>
    <!-- Determined Face -->
    <ellipse cx="365" cy="{380-climb}" rx="10" ry="12" fill="#0F172A"/>
    <ellipse cx="435" cy="{380-climb}" rx="10" ry="12" fill="#0F172A"/>
    <polygon points="395,{395-climb} 405,{395-climb} 400,{402-climb}" fill="#0F172A"/>
    <path d="M 385 {410-climb} Q 400 {425-climb} 415 {410-climb}" stroke-width="6"/>
    
    <!-- Paws Gripping and Climbing UP -->
    <path d="M 320 {440-climb} L 300 {350-climb}"/>
    <circle cx="300" cy="{340-climb}" r="20" fill="#FFFFFF"/>
    <path d="M 480 {440-climb} L 500 {350-climb}"/>
    <circle cx="500" cy="{340-climb}" r="20" fill="#FFFFFF"/>
    
    <!-- Cat Feet on Baseline -->
    <ellipse cx="340" cy="{600-climb//2}" rx="25" ry="18" fill="#FFFFFF"/>
    <ellipse cx="460" cy="{600-climb//2}" rx="25" ry="18" fill="#FFFFFF"/>
  </g>
</svg>'''
        with open(os.path.join(out_dir, f'cat_mount_f{f}.svg'), 'w') as out:
            out.write(svg)

    # 5. Imperial Courier Cat on Horseback (Synthesis 马上)
    for f in [1, 2]:
        bob = 10 if f == 2 else 0
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <g stroke="#0F172A" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Clouds Below -->
    <path d="M 120 700 Q 180 640 250 700 Q 320 640 400 700 Q 480 640 560 700 Q 640 640 720 700" stroke-width="12" opacity="0.7"/>
    
    <!-- Royal Horse -->
    <!-- Tail -->
    <path d="M 230 {490+bob} C 150 {430+bob}, 130 {570+bob}, 170 {610+bob}" stroke-width="16"/>
    <!-- Body -->
    <path d="M 250 {530+bob} C 290 {450+bob}, 470 {450+bob}, 550 {490+bob} C 630 {430+bob}, 690 {310+bob}, 710 {250+bob} C 740 {260+bob}, 760 {310+bob}, 730 {370+bob} C 690 {470+bob}, 610 {570+bob}, 550 {590+bob} C 470 {650+bob}, 330 {650+bob}, 250 {530+bob} Z" fill="#FFFFFF"/>
    <!-- Head -->
    <path d="M 710 {250+bob} L 700 {200+bob} L 730 {230+bob} Z" fill="#FFFFFF"/>
    <circle cx="740" cy="{270+bob}" r="6" fill="#0F172A"/>
    <!-- Golden Saddle -->
    <path d="M 330 {470+bob} Q 420 {500+bob} 510 {470+bob}" stroke="#FF6F59" stroke-width="18"/>

    <!-- Imperial Courier Cat with Official Hat & Royal Scroll -->
    <ellipse cx="420" cy="{360+bob}" rx="90" ry="80" fill="#FFFFFF"/>
    <ellipse cx="420" cy="{240+bob}" rx="85" ry="75" fill="#FFFFFF"/>
    <!-- Ears -->
    <path d="M 360 {190+bob} L 350 {120+bob} L 400 {170+bob} Z" fill="#FFFFFF"/>
    <path d="M 480 {190+bob} L 490 {120+bob} L 440 {170+bob} Z" fill="#FFFFFF"/>
    <!-- Imperial Official Hat -->
    <ellipse cx="420" cy="{170+bob}" rx="70" ry="20" fill="#0F172A"/>
    <path d="M 380 {170+bob} L 390 {120+bob} L 450 {120+bob} L 460 {170+bob} Z" fill="#0F172A"/>
    <line x1="330" y1="{170+bob}" x2="510" y2="{170+bob}" stroke="#FF6F59" stroke-width="8"/>
    <!-- Happy Confident Face -->
    <path d="M 380 {245+bob} Q 395 {230+bob} 410 {245+bob}" stroke-width="8"/>
    <path d="M 430 {245+bob} Q 445 {230+bob} 460 {245+bob}" stroke-width="8"/>
    <polygon points="415,{255+bob} 425,{255+bob} 420,{262+bob}" fill="#0F172A"/>
    <path d="M 410 {265+bob} Q 420 {275+bob} 430 {265+bob}" stroke-width="6"/>

    <!-- Imperial Golden Scroll in Hand -->
    <rect x="490" y="{310+bob}" width="110" height="45" rx="8" fill="#FFFFFF" stroke="#FF6F59" stroke-width="12"/>
    <line x1="505" y1="{295+bob}" x2="505" y2="{370+bob}" stroke="#FF6F59" stroke-width="14"/>
    <line x1="585" y1="{295+bob}" x2="585" y2="{370+bob}" stroke="#FF6F59" stroke-width="14"/>
    <line x1="530" y1="{332+bob}" x2="560" y2="{332+bob}" stroke="#0F172A" stroke-width="8"/>
  </g>
</svg>'''
        with open(os.path.join(out_dir, f'cat_courier_f{f}.svg'), 'w') as out:
            out.write(svg)

    print(f"✅ Generated all 10 high-resolution SVG mascot assets in {out_dir}")

if __name__ == '__main__':
    generate_svgs()
