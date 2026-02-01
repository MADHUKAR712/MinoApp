import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Input({
    label,
    error,
    containerStyle,
    leftIcon,
    rightIcon,
    ...props
}: InputProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
                <TextInput
                    style={[styles.input, leftIcon ? styles.inputWithLeftIcon : undefined]}
                    placeholderTextColor={Colors.text.secondary.light}
                    {...props}
                />
                {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Sizes.spacing.md,
    },
    label: {
        fontSize: Fonts.size.sm,
        fontWeight: Fonts.weight.medium,
        color: Colors.text.primary.light,
        marginBottom: Sizes.spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Sizes.inputHeight,
        backgroundColor: Colors.surface.light,
        borderRadius: Sizes.radius.lg,
        borderWidth: 1,
        borderColor: Colors.border.light,
        paddingHorizontal: Sizes.spacing.md,
    },
    inputError: {
        borderColor: Colors.error,
    },
    input: {
        flex: 1,
        fontSize: Fonts.size.md,
        color: Colors.text.primary.light,
    },
    inputWithLeftIcon: {
        marginLeft: Sizes.spacing.sm,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: Fonts.size.sm,
        color: Colors.error,
        marginTop: Sizes.spacing.xs,
    },
});
