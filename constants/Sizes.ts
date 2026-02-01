import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Spacing and dimension constants
 */
export const Sizes = {
    // Screen dimensions
    screen: {
        width,
        height,
    },

    // Spacing scale
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        '2xl': 24,
        '3xl': 32,
        '4xl': 40,
        '5xl': 48,
    },

    // Border radius
    radius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },

    // Component sizes
    avatar: {
        sm: 32,
        md: 40,
        lg: 48,
        xl: 64,
    },

    icon: {
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
    },

    // Input
    inputHeight: 48,
    buttonHeight: 48,

    // Navigation
    headerHeight: Platform.OS === 'ios' ? 44 : 56,
    tabBarHeight: Platform.OS === 'ios' ? 84 : 60,

    // Chat
    messageBubbleMaxWidth: width * 0.75,
} as const;
