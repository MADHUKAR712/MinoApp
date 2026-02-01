import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';

interface AvatarProps {
    uri?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showOnlineStatus?: boolean;
    isOnline?: boolean;
    style?: ViewStyle;
}

export function Avatar({
    uri,
    name,
    size = 'md',
    showOnlineStatus = false,
    isOnline = false,
    style,
}: AvatarProps) {
    const getSize = () => Sizes.avatar[size];
    const avatarSize = getSize();

    const getInitials = (name?: string) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <View style={[styles.container, { width: avatarSize, height: avatarSize }, style]}>
            {uri ? (
                <Image
                    source={{ uri }}
                    style={[styles.image, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
                    ]}
                >
                    <Text style={[styles.initials, { fontSize: avatarSize * 0.4 }]}>
                        {getInitials(name)}
                    </Text>
                </View>
            )}
            {showOnlineStatus && (
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: isOnline ? Colors.online : Colors.offline },
                    ]}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        resizeMode: 'cover',
    },
    placeholder: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: '#fff',
        fontWeight: Fonts.weight.semibold,
    },
    statusDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
});
