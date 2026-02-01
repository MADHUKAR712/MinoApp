import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';
import { formatTime } from '../../utils/formatTime';

interface StatusListItemProps {
    id: string;
    name: string;
    avatar?: string;
    timestamp: string;
    isViewed?: boolean;
    isMine?: boolean;
    onPress: (id: string) => void;
}

export function StatusListItem({
    id,
    name,
    avatar,
    timestamp,
    isViewed = false,
    isMine = false,
    onPress,
}: StatusListItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(id)} activeOpacity={0.7}>
            <View style={[styles.avatarRing, isViewed && styles.avatarRingViewed]}>
                <Avatar uri={avatar} name={name} size="lg" />
            </View>
            <View style={styles.content}>
                <Text style={styles.name}>{isMine ? 'My Status' : name}</Text>
                <Text style={styles.time}>{formatTime(timestamp as any)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.md,
        paddingVertical: Sizes.spacing.sm,
        backgroundColor: '#fff',
    },
    avatarRing: {
        padding: 2,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    avatarRingViewed: {
        borderColor: Colors.text.secondary.light,
    },
    content: {
        flex: 1,
        marginLeft: Sizes.spacing.md,
    },
    name: {
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.semibold,
        color: Colors.text.primary.light,
        marginBottom: 2,
    },
    time: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.light,
    },
});
