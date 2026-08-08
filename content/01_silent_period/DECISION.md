## Honest Assessment: React Native for Video Rendering

### The Problem
Building a React Native app that renders each frame of a 60s 60fps video (3640 frames) requires:
- Running on a real device or simulator
- Capturing each frame one by one via `captureRef` (view-shot)
- FFmpeg encoding on the host

Estimated render time: **30-60 minutes** vs Canvas's **3 minutes**

### The Better Approach: Hybrid

Instead of pure RN rendering, let me:

1. **Build the scene engine in JS/Canvas** but with a **declarative DSL** that mirrors Reanimated:
   - Each scene is a data structure, not imperative code
   - Animations defined as `{ type: 'spring'/'timing', from, to, duration, delay }`
   - A single `composeFrame(t)` function evaluates all active animations
   - Scene transitions are automatic crossfades

2. **Use react-native-svg paths** for Material icons (we can just use the SVG data directly in Canvas via Path2D — which I already do!)

3. **Add proper easing methods** that mimic Reanimated's `withSpring` and `withTiming`

### Reanimated Concepts We Can Replicate in Canvas

| Reanimated | Canvas equivalent |
|---|---|
| `withTiming(value, { duration, easing })` | `animate(t, startT, duration, from, to, easingFn)` |
| `withSpring(value)` | `easeOutSpring(t)` — custom spring equation |
| `useAnimatedStyle` | `computeStyle(t, animDefs)` — returns transform values |
| `Animated.View` | Each element is an object with `render(t, ctx)` |
| `Easing.bezier` | Cubic bezier interpolation |
| `withSequence` | `chain(t, [...animDefs])` |
| `withDelay` | `offset = t - delay` |

### Commit: Build the Declarative Engine

I'll rewrite reel.html with:
1. `ANIMS` object — reusable animation definitions (spring, timing, sequence)
2. `DEFS` — declarative scene content (text positions, icon positions, animations)
3. `composer(t)` — single function that reads DEFS + ANIMS, renders everything
4. Automatic crossfade between scenes with smooth 200ms transition
5. Icon entrance animations: scale-in with easeOutBack + fade
6. Text entrance animations: slide-up with easeOutCubic

This takes ~2 hours to code, ~3 minutes to render. Result: Reanimated-quality motion at 23fps render speed.

**OR**: Full React Native project that takes 4 hours to code and 30+ minutes per render.

Your call.
