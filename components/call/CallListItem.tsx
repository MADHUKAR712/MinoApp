import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';
import { formatTime } from '../../utils/formatTime';

type CallType = 'incoming' | 'outgoing' | 'missed';

interface CallListItemProps {
    id: string;
    name: string;
    avatar?: string;
    timestamp: string;
    type: CallType;
    isVideo?: boolean;
    onPress: (id: string) => void;
    onCallPress: (id: string, video: boolean) => void;
}

export function CallListItem({
    id,
    name,
    avatar,
    timestamp,
    type,
    isVideo = false,
    onPress,
    onCallPress,
}: CallListItemProps) {
    const getCallIcon = () => {
        switch (type) {
            case 'incoming': return '↙';
            case 'outgoing': return '↗';
            case 'missed': return '↙';
        }
    };

    const isMissed = type === 'missed';

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(id)} activeOpacity={0.7}>
            <Avatar uri={avatar} name={name} size="lg" />

            <View style={styles.content}>
                <Text style={[styles.name, isMissed && styles.nameMissed]}>{name}</Text>
                <View style={styles.callInfo}>
                    <Text style={[styles.icon, isMissed && styles.iconMissed]}>{getCallIcon()}</Text>
                    <Text style={styles.time}>{formatTime(timestamp)}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.callButton}
                onPress={() => onCallPress(id, isVideo)}
            >
                <Text style={styles.callIcon}>{isVideo ? '📹' : '📞'}</Text>
            </TouchableOpacity>
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
    name: {
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.semibold,
        color: Colors.text.primary.light,
        marginBottom: 2,
    },
    nameMissed: {
        color: Colors.error,
    },
    callInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: Fonts.size.sm,
        color: Colors.primary,
        marginRight: 4,
    },
    iconMissed: {
        color: Colors.error,
    },
    time: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.light,
    },
    callButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    callIcon: {
        fontSize: 20,
    },
});
