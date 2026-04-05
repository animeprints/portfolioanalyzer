# Component Library Reference

## 🎨 Effects
```tsx
import { GradientBackground, ParallaxLayer, GrainOverlay } from './components/Effects';

// Aurora mesh background
<GradientBackground intensity="intense" animated={true}>
  {/* Your content */}
</GradientBackground>

// Scroll-linked parallax element
<ParallaxLayer speed={0.5} rotate={5} scale={1.1}>
  <div>Floating content</div>
</ParallaxLayer>

// Subtle grain overlay (auto-positioned)
<GrainOverlay opacity={0.03} intensity="medium" />
```

## ✨ Enhanced UI
```tsx
import {
  MagneticButton,
  TiltCard,
  GradientBorder,
  BentoGrid,
  BentoCard,
  TextRevealEnhanced,
  PageTransition
} from './components/EnhancedUI';

// Magnetic button that follows cursor
<MagneticButton strength={40}>
  <button className="bg-gold-500">Click Me</button>
</MagneticButton>

// 3D tilt card with glow
<TiltCard maxTilt={15} glow glowColor="rgba(212,165,116,0.2)">
  <div className="p-8">Card content</div>
</TiltCard>

// Animated gradient border
<GradientBorder gradient="gold" borderWidth={2}>
  <div>Content</div>
</GradientBorder>

// Bento grid layout
<BentoGrid cols={3} gap="gap-6">
  <BentoCard gradient="gold" colSpan={2} rowSpan={1}>
    <TiltCard>Featured</TiltCard>
  </BentoCard>
  <BentoCard gradient="violet">...</BentoCard>
  <BentoCard gradient="cyan">...</BentoCard>
</BentoGrid>

// Text reveal animation (scroll-triggered)
<TextRevealEnhanced
  as="h2"
  type="word"
  staggerDelay={0.05}
  className="text-white"
>
  Your Title Here
</TextRevealEnhanced>

// Page transition wrapper
<PageTransition>
  <YourPage />
</PageTransition>
```

## 🎯 Usage Patterns

### Hero Section with Aurora Background
```tsx
<section className="relative min-h-[80vh] flex items-center justify-center">
  <GradientBackground intensity="intense">
    <div className="absolute inset-0">
      <ParallaxLayer speed={0.3} className="absolute top-20 left-20">
        <div className="w-64 h-64 bg-gold-400/20 rounded-full blur-3xl animate-float" />
      </ParallaxLayer>
    </div>

    <div className="relative z-10 text-center">
      <TextRevealEnhanced as="h1" type="word">
        Transform Your CV into
        <span className="block text-gold-gradient"> a Masterpiece</span>
      </TextRevealEnhanced>

      <MagneticButton strength={30}>
        <Link to="/analyze" className="btn-gold">
          Start Analysis
        </Link>
      </MagneticButton>
    </div>
  </GradientBackground>
</section>
```

### Feature Cards Grid
```tsx
<BentoGrid cols={3}>
  {features.map((feature, i) => (
    <BentoCard key={i} gradient={['gold','violet','cyan'][i % 3]}>
      <TiltCard maxTilt={10}>
        <div className="p-6">
          <feature.icon className="w-12 h-12 text-gold-400" />
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
        </div>
      </TiltCard>
    </BentoCard>
  ))}
</BentoGrid>
```

## 🎨 Gradient Options

### Background Intensity
- `subtle`: 30% opacity
- `moderate`: 50% opacity
- `intense`: 70% opacity

### BentoCard Gradients
- `gold`: Amber/gold tones
- `violet`: Purple/purple tones
- `cyan`: Cyan/blue tones
- `purple`: Deep purple with indigo
- `blue`: Cyan through blue
- `mixed`: Rainbow (cyan+violet+gold)

### Text Gradient Classes
- `text-gold-gradient`: Gold with flow animation
- `text-violet-gradient`: Violet with flow animation

## ⚙️ Configuration

All animations respect `prefers-reduced-motion`. Components automatically disable animations when users prefer reduced motion, providing static fallbacks.

## 🎬 Animation Principles

1. **Spring Physics**: All micro-interactions use spring for natural feel
2. **Blur Reveals**: Text emerges from blur to focus (like camera focus)
3. **Staggering**: Grid items cascade with 0.03-0.05s delays
4. **Parallax Depth**: Multiple layers move at different speeds on scroll
5. **Magnetic Attraction**: Buttons subtly follow cursor within 40px radius
6. **3D Tilt**: Cards respond to mouse position with perspective

## 📐 Design Tokens

From Tailwind config:
- Colors: gold, violet, silver, surface
- Shadows: glow, glow-strong, inner-glow
- Backdrop blur: xs, light, glass, heavy
- Fonts: display (Syne), body (Manrope), accent (Playfair)

## 🚀 Performance Tips

1. Use `ParallaxLayer` sparingly (3-5 layers max per page)
2. Keep `ParticleBackground` count reasonable (800-1200)
3. Wrap heavy 3D in `{isAuthenticated && <...>}` for public pages
4. Use `once` prop on `whileInView` for one-time animations
5. All transforms use GPU-accelerated properties
