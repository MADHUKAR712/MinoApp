import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';
import { formatTime } from '../../utils/formatTime';

interface ChatListItemProps {
    id: string;
    name: string;
    avatar?: string;
    lastMessage?: string;
    timestamp?: string;
    unreadCount?: number;
    isOnline?: boolean;
    onPress: (id: string) => void;
}

export function ChatListItem({
    id,
    name,
    avatar,
    lastMessage,
    timestamp,
    unreadCount = 0,
    isOnline = false,
    onPress,
}: ChatListItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(id)} activeOpacity={0.7}>
            <Avatar uri={avatar} name={name} size="lg" showOnlineStatus isOnline={isOnline} />

            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    {timestamp && (
                        <Text style={[styles.time, unreadCount > 0 && styles.timeUnread]}>
                            {formatTime(timestamp)}
                        </Text>
                    )}
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.message} numberOfLines={1}>
                        {lastMessage || 'No messages yet'}
                    </Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
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
    content: {
        flex: 1,
        marginLeft: Sizes.spacing.md,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        flex: 1,
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.semibold,
        color: Colors.text.primary.light,
    },
    time: {
        fontSize: Fonts.size.xs,
        color: Colors.text.secondary.light,
        marginLeft: Sizes.spacing.sm,
    },
    timeUnread: {
        color: Colors.primary,
    },
    message: {
        flex: 1,
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.light,
    },
    badge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: Sizes.spacing.sm,
    },
    badgeText: {
        fontSize: Fonts.size.xs,
        fontWeight: Fonts.weight.bold,
        color: '#fff',
    },
});
