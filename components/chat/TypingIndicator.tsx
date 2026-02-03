import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export function TypingIndicator() {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        Animated.parallel([
            animate(dot1, 0),
            animate(dot2, 150),
            animate(dot3, 300),
        ]).start();
    }, [dot1, dot2, dot3]);

    const renderDot = (animation: Animated.Value) => (
        <Animated.View
            style={[
                styles.dot,
                {
                    transform: [
                        {
                            translateY: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -4],
                            }),
                        },
                    ],
                },
            ]}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                {renderDot(dot1)}
                {renderDot(dot2)}
                {renderDot(dot3)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        marginVertical: 4,
    },
    bubble: {
        flexDirection: 'row',
        backgroundColor: Colors.chat.received,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.text.secondary.light,
    },
});
