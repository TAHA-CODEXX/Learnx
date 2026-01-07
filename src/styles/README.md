# Styles Documentation

This folder contains the design system and styling resources for the Learnx platform.

## 📁 Files

### `design-system.md`
**The complete design system reference guide.**

This is your **source of truth** for:
- Color palette
- Typography (fonts, sizes, weights)
- Spacing scale
- Component patterns (buttons, inputs, cards, etc.)
- Layout patterns
- Effects & transitions
- Responsive breakpoints
- Accessibility guidelines
- Coding standards

**👉 All team members MUST read this before starting development.**

### `constants.js`
**JavaScript constants for programmatic access to design tokens.**

Use this when you need to access design values in your JavaScript/React code:

```jsx
import { COLORS, FONTS, SPACING } from '@/styles/constants';

// Example: inline styles
const buttonStyle = {
  backgroundColor: COLORS.accent,
  color: COLORS.primary,
  fontFamily: FONTS.body,
};

// Example: conditional rendering
const textColor = isActive ? COLORS.accent : COLORS.gray[500];
```

## 🎨 How to Use

### For Designers
1. Read `design-system.md` thoroughly
2. Use the documented color palette in all designs
3. Follow the component patterns for consistency
4. Reference font sizes and weights when creating mockups

### For Developers
1. **Always check `design-system.md` before creating new components**
2. Use Tailwind classes that match our design tokens
3. Import from `constants.js` when you need programmatic access to values
4. Follow the coding standards section for class name ordering

### For New Team Members
1. Start with the "Quick Reference" section in `design-system.md`
2. Study the "Component Patterns" to understand our approach
3. Review existing components in `src/components/` to see patterns in practice
4. Ask questions if anything is unclear!

## ✅ Best Practices

- **Consistency is key**: Always use predefined colors, spacing, and patterns
- **Don't create custom values**: Use the existing design tokens
- **Follow the 80/20 rule**: 80% white background, 20% green accents
- **Accessibility first**: Always include focus states and ARIA attributes
- **Mobile-first**: Design for mobile, enhance for desktop

## 🚫 Common Mistakes to Avoid

❌ Using custom colors not in the palette  
✅ Use only colors defined in `design-system.md`

❌ Arbitrary spacing like `padding: 13px`  
✅ Use Tailwind's spacing scale: `p-3` (12px) or `p-4` (16px)

❌ Overusing green everywhere  
✅ Keep green to ~20% (buttons, icons, accents)

❌ Forgetting focus states  
✅ Always add `focus:ring-2 focus:ring-accent`

## 📞 Questions?

If you're unsure about a design decision:
1. Check `design-system.md` first
2. Look at existing components for examples
3. Ask the team lead for clarification

---

**Remember:** A consistent design system creates a better user experience! 🎯
