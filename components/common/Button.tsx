import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
}: ButtonProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return { bg: Colors.secondary, text: '#fff' };
            case 'outline':
                return { bg: 'transparent', text: Colors.primary, border: Colors.primary };
            case 'ghost':
                return { bg: 'transparent', text: Colors.primary };
            default:
                return { bg: Colors.primary, text: '#fff' };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { height: 36, fontSize: Fonts.size.sm, px: Sizes.spacing.md };
            case 'lg':
                return { height: 56, fontSize: Fonts.size.lg, px: Sizes.spacing['2xl'] };
            default:
                return { height: 48, fontSize: Fonts.size.md, px: Sizes.spacing.xl };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                {
                    backgroundColor: variantStyles.bg,
                    height: sizeStyles.height,
                    paddingHorizontal: sizeStyles.px,
                    borderWidth: variantStyles.border ? 1 : 0,
                    borderColor: variantStyles.border,
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variantStyles.text} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        { color: variantStyles.text, fontSize: sizeStyles.fontSize },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: Sizes.radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontWeight: Fonts.weight.semibold,
    },
});
