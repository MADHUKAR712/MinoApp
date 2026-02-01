import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';
import { formatMessageTime } from '../../utils/formatTime';

interface MessageBubbleProps {
    content: string;
    timestamp: string;
    isSent: boolean;
    status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export function MessageBubble({
    content,
    timestamp,
    isSent,
    status = 'sent',
}: MessageBubbleProps) {
    const getStatusIcon = () => {
        switch (status) {
            case 'sending': return '○';
            case 'sent': return '✓';
            case 'delivered': return '✓✓';
            case 'read': return '✓✓';
            case 'failed': return '!';
            default: return '';
        }
    };

    return (
        <View style={[styles.container, isSent ? styles.sent : styles.received]}>
            <View style={[styles.bubble, isSent ? styles.bubbleSent : styles.bubbleReceived]}>
                <Text style={[styles.content, isSent && styles.contentSent]}>{content}</Text>
                <View style={styles.meta}>
                    <Text style={[styles.time, isSent && styles.timeSent]}>
                        {formatMessageTime(timestamp)}
                    </Text>
                    {isSent && (
                        <Text style={[styles.status, status === 'read' && styles.statusRead]}>
                            {getStatusIcon()}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 2,
        paddingHorizontal: Sizes.spacing.md,
    },
    sent: {
        alignItems: 'flex-end',
    },
    received: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: Sizes.messageBubbleMaxWidth,
        paddingHorizontal: Sizes.spacing.md,
        paddingVertical: Sizes.spacing.sm,
        borderRadius: Sizes.radius.lg,
    },
    bubbleSent: {
        backgroundColor: Colors.chat.sent,
        borderBottomRightRadius: 4,
    },
    bubbleReceived: {
        backgroundColor: Colors.chat.received,
        borderBottomLeftRadius: 4,
    },
    content: {
        fontSize: Fonts.size.md,
        color: Colors.text.primary.light,
        lineHeight: Fonts.size.md * Fonts.lineHeight.normal,
    },
    contentSent: {
        color: Colors.text.primary.light,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    time: {
        fontSize: Fonts.size.xs,
        color: Colors.text.secondary.light,
    },
    timeSent: {
        color: 'rgba(0,0,0,0.5)',
    },
    status: {
        fontSize: Fonts.size.xs,
        marginLeft: 4,
        color: 'rgba(0,0,0,0.5)',
    },
    statusRead: {
        color: Colors.accent,
    },
});
