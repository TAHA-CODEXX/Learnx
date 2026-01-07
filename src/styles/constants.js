/**
 * Learnx Design System - JavaScript Constants
 * Import these constants to ensure consistency across components
 */

export const COLORS = {
    // Primary
    primary: '#FFFFFF',
    accent: '#22c55e',

    // Grays
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        900: '#111827',
    },

    // Green Variations
    green: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        600: '#16A34A',
        700: '#15803D',
        800: '#166534',
    },

    // Semantic
    error: {
        50: '#FEF2F2',
        600: '#DC2626',
        700: '#B91C1C',
    },
};

export const FONTS = {
    logo: '"Outfit", sans-serif',
    body: '"Inter", system-ui, sans-serif',
};

export const SPACING = {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
};

export const BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

// Usage example:
// import { COLORS } from '@/styles/constants';
// const buttonStyle = { backgroundColor: COLORS.accent };
