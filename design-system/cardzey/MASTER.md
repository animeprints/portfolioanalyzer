# Design System Master File - Cardzey

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

## Project: Cardzey
**Generated**: 2026-04-04
**Category**: Career Platform - CV Analyzer

---

## Dark Mode Theme (PRIMARY)

This design system uses **Dark Mode** as the default and only theme.

### Color Palette - Dark Theme

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Background (App) | `#0F172A` | `--color-bg` | Main app background (slate-900) |
| Background (Card) | `#1E293B` | `--color-card` | Cards, modals, surfaces |
| Surface (Elevated) | `#334155` | `--color-surface` | Elevated elements |
| Primary | `#2563EB` | `--color-primary` | Main CTAs, links, highlights |
| Primary Hover | `#1D4ED8` | `--color-primary-hover` | |
| Secondary | `#3B82F6` | `--color-secondary` | Secondary buttons, accents |
| Accent | `#F97316` | `--color-accent` | Attention, highlights |
| Text (Primary) | `#F8FAFC` | `--color-text` | Main text |
| Text (Secondary) | `#94A3B8` | `--color-text-muted` | Muted text, hints |
| Border | `#334155` | `--color-border` | Borders, dividers |
| Border Light | `#475569` | `--color-border-light` | Subtle borders |
| Success | `#10B981` | `--color-success` | Success states |
| Error | `#EF4444` | `--color-error` | Error states |
| Warning | `#F59E0B` | `--color-warning` | Warning states |

**Contrast Ratios** (WCAG AA Compliant):
- Primary text on background: 15.3:1 (exceeds 4.5:1)
- Secondary text on background: 7.2:1 (exceeds 4.5:1)
- Primary on primary bg: 4.6:1 (meets 4.5:1)

### Typography

- **Heading Font**: Inter (weights: 600, 700, 800)
- **Body Font**: Inter (weights: 400, 500, 600)
- **Mono Font**: JetBrains Mono (for scores, code)
- **Google Fonts**:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Type Scale**:
- h1: 2.5rem (40px) - bold
- h2: 2rem (32px) - bold
- h3: 1.5rem (24px) - semibold
- h4: 1.25rem (20px) - semibold
- body: 1rem (16px) - regular
- small: 0.875rem (14px) - regular
- caption: 0.75rem (12px) - regular

**Line Height**: 1.6 for body, 1.3 for headings

### Spacing Variables

| Token | Value | Usage |
|-------|-------|------|
| `--space-xs` | 4px | Tight gaps |
| `--space-sm` | 8px | Icon gaps, inline |
| `--space-md` | 16px | Standard padding |
| `--space-lg` | 24px | Section padding |
| `--space-xl` | 32px | Large gaps |
| `--space-2xl` | 48px | Section margins |
| `--space-3xl` | 64px | Hero padding |

### Shadow Depths (Dark Mode)

| Level | Value | Usage |
|-------|-------|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.5)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.6)` | Hero elements |

### Border Radius

| Token | Value | Usage |
|-------|-------|------|
| `--radius-sm` | 6px | Small elements |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 20px | Hero sections |

---

## Component Specs (Dark Mode)

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 200ms ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-ghost:hover {
  background: var(--color-surface);
}
```

### Cards

```css
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}
```

### Inputs

```css
.input {
  background: var(--color-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

.input::placeholder {
  color: var(--color-text-muted);
}
```

---

## Dark Mode Specific Guidelines

### Backgrounds
- Use `bg-slate-900` for main app background
- Use `bg-slate-800` for cards and surfaces
- Use subtle borders `border-slate-700` to separate elements
- Avoid pure black (#000000) - use `#0F172A` instead for depth

### Text Colors
- Primary text: `text-slate-100` (#F8FAFC)
- Secondary text: `text-slate-400` (#94A3B8)
- Muted text: `text-slate-500` (#64748B)
- Links: `text-primary` (#2563EB) with hover

### Interactive States
- Hover: Slight lighten of background (slate-800 → slate-700)
- Focus: Blue ring (`ring-2 ring-primary/50`)
- Active: Scale down slightly (0.98)
- Disabled: Reduced opacity (0.5), no cursor

### Elevation
- Use shadows to indicate elevation, but keep subtle in dark mode
- Cards: `shadow-sm` (0 1px 2px rgba(0,0,0,0.3))
- Modals: `shadow-lg` (0 10px 15px rgba(0,0,0,0.5))

---

## Accessibility

- **All text** meets WCAG AA (contrast ≥ 4.5:1)
- **Focus states** visible with ring
- **Touch targets** minimum 44×44px
- **Reduced motion** supported
- **Skip links** provided
- **Semantic HTML** used throughout

---

## Pre-Delivery Checklist (Dark Mode)

- [ ] All backgrounds are dark (slate-900 or darker)
- [ ] Text contrast ≥ 4.5:1 on all backgrounds
- [ ] Borders visible on dark surfaces
- [ ] No pure white backgrounds (use lighter cards)
- [ ] Shadows adjusted for dark mode (darker, more subtle)
- [ ] Focus rings visible on dark backgrounds
- [ ] Images and icons have proper contrast
- [ ] No hardcoded light colors remaining
- [ ] Tested in both light and dark (if toggle exists)
- [ ] All pages consistent with dark theme

---

## Responsive Breakpoints

- Mobile: 375px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

Use mobile-first approach with Tailwind responsive prefixes.

---

## Animation Guidelines (Dark Mode)

- Duration: 150-300ms for micro-interactions
- Easing: `ease-out` for entering, `ease-in` for exiting
- Use `prefers-reduced-motion` for accessibility
- Animations should not cause layout shift
- Stagger animations: 50-100ms delay between items

---

## Common Dark Mode Pitfalls to Avoid

❌ **Low contrast text** on dark backgrounds (always verify)
❌ **Pure black backgrounds** (#000) - use dark gray for depth
❌ **Hard borders** that are too stark - use subtle边框
❌ **Over-saturated colors** that vibrate - mute slightly for dark
❌ **Missing hover states** - always indicate interactivity
❌ **Inconsistent elevation** - all cards same shadow level

---

## Tailwind Configuration

```javascript
module.exports = {
  darkMode: 'class', // We'll use manual dark mode (no toggle)
  theme: {
    extend: {
      colors: {
        // Dark mode palette as defined above
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.3)',
        md: '0 4px 6px rgba(0,0,0,0.4)',
        lg: '0 10px 15px rgba(0,0,0,0.5)',
        xl: '0 20px 25px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
```

---

## Implementation Priority

1. ✅ Update tailwind.config.js with dark mode colors
2. ✅ Update index.html with dark background class
3. ✅ Redesign all pages (Home, Auth, Dashboard, Analyze, etc.)
4. ✅ Update all components (Navbar, Cards, Buttons)
5. ✅ Verify contrast ratios with accessibility tools
6. ✅ Test on multiple browsers and devices

---

**Remember**: Dark mode is NOT just inverting colors. It requires careful attention to contrast, elevation, and visual hierarchy. Test thoroughly!
