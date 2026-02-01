/**
 * Typography scale
 */
export const Fonts = {
    // Font families
    family: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },

    // Font sizes
    size: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        '2xl': 20,
        '3xl': 24,
        '4xl': 30,
        '5xl': 36,
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    // Font weights
    weight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
} as const;
