import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';

interface MessageInputProps {
    onSend: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function MessageInput({
    onSend,
    placeholder = 'Type a message...',
    disabled = false,
}: MessageInputProps) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        const trimmed = message.trim();
        if (trimmed && !disabled) {
            onSend(trimmed);
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.text.secondary.light}
                    multiline
                    maxLength={4096}
                    editable={!disabled}
                />
            </View>
            <TouchableOpacity
                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!message.trim() || disabled}
            >
                <View style={styles.sendIcon}>
                    <View style={styles.sendArrow} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: Sizes.spacing.sm,
        paddingVertical: Sizes.spacing.sm,
        backgroundColor: Colors.surface.light,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
    },
    inputContainer: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: Sizes.spacing.md,
        paddingVertical: Platform.OS === 'ios' ? 10 : 0,
        marginRight: Sizes.spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    input: {
        flex: 1,
        fontSize: Fonts.size.md,
        color: Colors.text.primary.light,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: Colors.text.secondary.light,
    },
    sendIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 0,
        borderTopWidth: 6,
        borderBottomWidth: 6,
        borderLeftColor: '#fff',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        marginLeft: 4,
    },
});
