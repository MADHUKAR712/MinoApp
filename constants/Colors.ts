/**
 * MIMO App Color Palette - Monochrome (Black & White) Theme
 * Refined 'Black' to match user reference (#14141A aesthetic)
 */
export const Colors = {
    // Primary brand colors
    primary: '#ffffffff',      // White for active elements/text
    primaryDark: '#CCCCCC',
    primaryLight: '#FFFFFF',
    secondary: '#14141A',    // The specific dark color
    accent: '#FFFFFF',

    // Background
    background: {
        light: '#FFFFFF',
        dark: '#14141A',
        darkmode: '#262626' // Specific Dark Navy/Black from reference
    },

    // Surface/Cards
    surface: {
        light: '#F7F8FA',
        dark: '#14141A', // Same as background for seamless look
        elevated: '#1E1E26', // Slightly lighter for headers/elevated
    },



    // Input backgrounds
    input: {
        light: '#F0F2F5',
        dark: '#1E1E26', // Slightly lighter
    },

    // Text
    text: {
        primary: {
            light: '#000000',
            dark: '#FFFFFF',
        },
        secondary: {
            light: '#6B7280',
            dark: '#8E8E93', // iOS Standard Dark Gray
        },
        accent: '#FFFFFF',
    },

    // Chat bubbles
    chat: {
        sent: '#2C2C2E',     // Apple Dark Gray
        received: '#1C1C1E', // Darker
        sentText: '#FFFFFF',
        receivedText: '#FFFFFF',
    },

    // Status indicators
    online: '#FFFFFF',
    offline: '#666666',

    // Semantic colors
    error: '#FFFFFF',
    warning: '#FFFFFF',
    success: '#FFFFFF',
    info: '#FFFFFF',
    critical: '#FF3B30', // Red for destructive actions

    // Border
    border: {
        light: '#E5E7EB',
        dark: '#2C2C2E',
    },

    // Divider
    divider: {
        light: '#F3F4F6',
        dark: '#2C2C2E',
    },

    // Tab bar
    tabBar: {
        active: '#FFFFFF',
        inactive: '#8E8E93',
        background: '#14141A',
    },

    // FAB
    fab: '#FFFFFF',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.8)',

    // Shadow
    shadow: '#000000',

    // Specific UI Elements
    avatarBackground: '#8B6914',

    // Keyboard
    keyboard: {
        background: '#14141A',
        key: '#2C2C2E',
        keyText: '#FFFFFF',
    },
} as const;

export type ColorKey = keyof typeof Colors;
