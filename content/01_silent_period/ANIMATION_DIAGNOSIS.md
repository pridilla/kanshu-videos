# Animation Diagnosis: What's Wrong with v9

## Visual Issues Found

### 1. No scene transitions — abrupt pops
When one sentence ends and another begins, the scene content disappears instantly. Even a 100ms crossfade would help.

### 2. Animations are "flat" — no depth or parallax
Everything renders at a single Z layer. No scale-in entrances, no slide-ins, no spring effects. Icons just appear.

### 3. No unified animation timing
Each scene uses ad-hoc `clamp()` with arbitrary start times. Some animations finish in 0.3s, others in 2s. No consistent "animation vocabulary."

### 4. Icons animate poorly
The book in Krashen scene scales from 0.5 to 1.0 linearly — no `easeOutBack` bounce. The ear icons just fade in. No personality.

### 5. The subtitle card
It's a bare rectangle with hard edges. No glass effect, no rounding, no shadow.

### 6. Empty frames between scene transitions
Between sentences there are gaps (e.g., sol→lot has 230ms gap) where the subtitle area is blank AND the scene content is blank = black frame.

## What React Native + Reanimated Fixes
- Spring-based animations (`withSpring`, `withTiming`) = bounce, overshoot, natural feel
- `Animated.View` with `useAnimatedStyle` = declarative transforms with 60fps UI thread
- Layout transitions = automatic animate from old to new
- `react-native-svg` icons = crisp Material icons with stroke animations

## Final Call
The Canvas approach CAN be fixed by adding:
1. A unified animation system with proper timing curves
2. Spring-based icon entrances
3. Crossfade between scenes
4. Proper subtitle card with glassmorphism

But React Native gives you all this for free with Reanimated.
