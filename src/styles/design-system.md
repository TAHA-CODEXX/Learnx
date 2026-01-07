# Learnx Design System

This document defines the design system for the Learnx e-learning platform. **All developers must follow these guidelines** to ensure consistency across the entire application.

---

## 🎨 Color Palette

### Primary Colors
```css
White (Background): #FFFFFF
Accent Green: #22c55e (rgb(34, 197, 94))
```

### Grayscale
```css
Gray 50:  #F9FAFB - Light backgrounds
Gray 100: #F3F4F6 - Borders, subtle backgrounds
Gray 200: #E5E7EB - Borders
Gray 400: #9CA3AF - Placeholder text, disabled states
Gray 500: #6B7280 - Secondary text
Gray 600: #4B5563 - Secondary text (hover)
Gray 700: #374151 - Button text
Gray 900: #111827 - Primary text, headings
```

### Accent Variations
```css
Green 50:  #F0FDF4 - Light accent backgrounds
Green 100: #DCFCE7 - Borders with green tint
Green 200: #BBF7D0 - Shadows, light highlights
Green 600: #16A34A - Hover states for accent buttons
Green 700: #15803D - Active/pressed states
Green 800: #166534 - Text on light backgrounds
```

### Semantic Colors
```css
Red 50:  #FEF2F2 - Error backgrounds
Red 600: #DC2626 - Error text, destructive actions
Red 700: #B91C1C - Error hover states
```

---

## 📐 Spacing Scale

Follow Tailwind's default spacing scale (4px base):
```
0.5 = 2px
1   = 4px
2   = 8px
3   = 12px
4   = 16px
5   = 20px
6   = 24px
8   = 32px
10  = 40px
12  = 48px
16  = 64px
20  = 80px
```

**Common Usage:**
- **Gaps between elements**: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px)
- **Padding**: `p-2`, `p-3`, `p-4`, `px-4 py-2`
- **Margins**: `mt-2`, `mb-4`, `mx-auto`

---

## 🔤 Typography

### Font Families
```css
Logo: 'Outfit', sans-serif (weights: 600, 700)
Body: 'Inter', system-ui, sans-serif (weights: 400, 500, 600, 700)
```

### Font Sizes
```css
text-xs:   12px (captions, labels)
text-sm:   14px (body text, buttons)
text-base: 16px (default body)
text-lg:   18px (subtitles)
text-xl:   20px (section headings)
text-2xl:  24px (page headings)
text-3xl:  30px (large headings)
text-5xl:  48px (hero headings)
text-7xl:  72px (extra large hero text)
```

### Font Weights
```css
font-normal:    400 (body text)
font-medium:    500 (emphasized text)
font-semibold:  600 (buttons, labels)
font-bold:      700 (headings, CTAs)
```

---

## 🧩 Component Patterns

### Buttons

#### Primary Button (Call-to-Action)
```jsx
<button className="px-5 py-2 text-sm font-semibold bg-accent text-white rounded-md hover:bg-green-600 shadow-sm transition-all">
  Join for Free
</button>
```

#### Large Primary Button (Hero)
```jsx
<button className="px-8 py-3.5 bg-accent text-white font-bold rounded-lg shadow-lg shadow-green-200 hover:bg-green-600 hover:translate-y-[-2px] transition-all">
  Explore Courses
</button>
```

#### Secondary Button
```jsx
<button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-accent transition-colors">
  Log in
</button>
```

#### Outlined Button
```jsx
<button className="px-8 py-3.5 bg-white text-gray-900 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
  Try Premium for $0
</button>
```

#### Icon Button
```jsx
<button className="p-2 text-gray-600 hover:text-accent hover:bg-gray-50 rounded-full transition-all">
  <FiHeart className="h-5 w-5" />
</button>
```

---

### Input Fields

#### Search Input
```jsx
<input
  type="text"
  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
  placeholder="Search courses..."
/>
```

#### Text Input (Standard)
```jsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
/>
```

---

### Cards

#### Basic Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
  {/* Card content */}
</div>
```

#### Card with Hover Effect
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-green-100 transition-all cursor-pointer">
  {/* Card content */}
</div>
```

---

### Dropdowns

#### Dropdown Container
```jsx
<div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
  {/* Dropdown items */}
</div>
```

#### Dropdown Item
```jsx
<a className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors">
  <FiUser className="text-lg" />
  Profile
</a>
```

#### Dropdown Separator
```jsx
<div className="border-t border-gray-100 my-2"></div>
```

---

### Badges & Pills

#### Status Badge
```jsx
<span className="inline-block px-4 py-1.5 text-xs font-bold text-accent bg-green-50 rounded-full border border-green-100 uppercase tracking-widest">
  New
</span>
```

---

## 🌐 Layout Patterns

### Container
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Navbar
```jsx
<nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Nav content */}
    </div>
  </div>
</nav>
```

### Section Spacing
```jsx
<section className="py-16 md:py-24">
  {/* Section content */}
</section>
```

---

## ✨ Effects & Transitions

### Shadows
```css
shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)         - Subtle elevation
shadow:     0 1px 3px rgba(0, 0, 0, 0.1)          - Default cards
shadow-md:  0 4px 6px rgba(0, 0, 0, 0.1)          - Hover states
shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.1)        - Dropdowns, modals
shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.1)        - Elevated elements
shadow-green-200: Custom green-tinted shadow      - Primary buttons
```

### Border Radius
```css
rounded-md:   6px  - Buttons, inputs
rounded-lg:   8px  - Cards, larger buttons
rounded-xl:   12px - Dropdowns, modals
rounded-full: 9999px - Pills, icon buttons, avatars
```

### Transitions
```css
transition-all:     All properties (use sparingly)
transition-colors:  Only color changes
transition-shadow:  Only shadow changes
duration-200:       200ms (default, snappy)
```

**Common Pattern:**
```jsx
className="hover:bg-gray-50 transition-colors"
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px  - Small tablets
md:  768px  - Tablets
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large
```

**Usage:**
```jsx
className="text-xl md:text-3xl lg:text-5xl"
className="hidden md:block"  // Show only on desktop
className="block md:hidden"  // Show only on mobile
```

---

## ♿ Accessibility Guidelines

### Focus States
**Always include focus rings on interactive elements:**
```jsx
className="focus:outline-none focus:ring-2 focus:ring-accent"
className="focus:ring-2 focus:ring-accent rounded-full" // For circular elements
```

### ARIA Attributes
```jsx
// Dropdowns
aria-expanded={isOpen}
aria-haspopup="true"

// Buttons
aria-label="Close menu"
title="Wishlist"
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Use semantic HTML (`<button>`, `<a>`, `<input>`)
- Tab order should be logical

---

## 🎯 Green Accent Usage Rules

**✅ Green should be used for:**
- Primary action buttons (CTAs)
- Hover states on icons and links
- Focus rings
- Active states
- Success messages
- Highlights and badges
- Underlines for emphasis

**❌ Do NOT overuse green:**
- Backgrounds should remain white
- Avoid green backgrounds for large sections
- Keep green usage to ~20% of the visual hierarchy

---

## 📝 Coding Standards

### Class Name Order
Follow this order for consistency:
1. Layout (flex, grid, block)
2. Positioning (relative, absolute)
3. Sizing (w-, h-, max-w-)
4. Spacing (p-, m-, gap-)
5. Typography (text-, font-, tracking-)
6. Colors (bg-, text-, border-)
7. Effects (shadow-, rounded-)
8. States (hover:, focus:, active:)
9. Transitions (transition-)

**Example:**
```jsx
className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg shadow-sm hover:bg-green-600 transition-colors"
```

### Component Structure
```jsx
// 1. Imports
import { useState } from "react";
import { FiIcon } from "react-icons/fi";

// 2. Component
const ComponentName = () => {
  // 3. State & hooks
  const [isOpen, setIsOpen] = useState(false);
  
  // 4. Handlers
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  
  // 5. Render
  return (
    <div className="...">
      {/* Content */}
    </div>
  );
};

export default ComponentName;
```

---

## 🚀 Quick Reference

### Most Common Patterns

**Button:** `px-4 py-2 bg-accent text-white rounded-md hover:bg-green-600 transition-colors`

**Input:** `px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent`

**Card:** `bg-white rounded-xl shadow-sm border border-gray-100 p-6`

**Link:** `text-gray-700 hover:text-accent transition-colors`

**Icon Button:** `p-2 text-gray-600 hover:text-accent hover:bg-gray-50 rounded-full transition-all`

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- [Google Fonts - Outfit](https://fonts.google.com/specimen/Outfit)

---

**Last Updated:** January 6, 2026  
**Version:** 1.0.0  
**Maintained by:** Learnx Development Team
