import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';

interface HeaderProps {
    title: string;
    subtitle?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    transparent?: boolean;
}

export function Header({
    title,
    subtitle,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    transparent = false,
}: HeaderProps) {
    return (
        <View style={[styles.container, transparent && styles.transparent]}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
            <View style={styles.content}>
                {leftIcon ? (
                    <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                        {leftIcon}
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}

                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    )}
                </View>

                {rightIcon ? (
                    <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                        {rightIcon}
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondary,
        paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
    },
    transparent: {
        backgroundColor: 'transparent',
    },
    content: {
        height: Sizes.headerHeight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.md,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconPlaceholder: {
        width: 40,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: Fonts.size.lg,
        fontWeight: Fonts.weight.semibold,
        color: '#fff',
    },
    subtitle: {
        fontSize: Fonts.size.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
});
