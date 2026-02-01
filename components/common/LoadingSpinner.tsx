import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    message?: string;
    fullScreen?: boolean;
}

export function LoadingSpinner({
    size = 'large',
    color = Colors.primary,
    message,
    fullScreen = false,
}: LoadingSpinnerProps) {
    const content = (
        <>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </>
    );

    if (fullScreen) {
        return <View style={styles.fullScreen}>{content}</View>;
    }

    return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreen: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 999,
    },
    message: {
        marginTop: 12,
        fontSize: Fonts.size.md,
        color: Colors.text.secondary.light,
    },
});
