import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { Sizes } from '../../../constants/Sizes';

interface Message {
    id: string;
    content: string;
    time: string;
    isSent: boolean;
    status?: 'sent' | 'delivered' | 'read';
    isDeleted?: boolean;
    isForwarded?: boolean;
    type?: 'text' | 'link';
}

const mockMessages: Message[] = [
    { id: '1', content: 'Hey! Are we still meeting for the MIMO project demo?', time: '10:42 AM', isSent: false },
    { id: '2', content: "Yes, absolutely! I'll be there in 10 minutes. 🚀", time: '10:45 AM', isSent: true, status: 'read' },
    { id: '3', content: "Great! I'll secure the conference room. See you soon!", time: '10:46 AM', isSent: false },
];

export default function ChatScreen() {
    const router = useRouter();
    const { name } = useLocalSearchParams();
    const contactName = typeof name === 'string' ? name : 'John Doe';
    const insets = useSafeAreaInsets();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(mockMessages);

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'sent': return 'checkmark-outline';
            case 'delivered': return 'checkmark-done-outline';
            case 'read': return 'checkmark-done-outline';
            default: return 'time-outline';
        }
    };

    const handleSend = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                content: message.trim(),
                time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
                isSent: true,
                status: 'sent',
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isSent = item.isSent;
        const bubbleStyle = isSent ? styles.bubbleSent : styles.bubbleReceived;

        return (
            <View style={[styles.messageContainer, isSent ? styles.messageSent : styles.messageReceived]}>
                <View style={[styles.messageBubble, bubbleStyle]}>
                    {item.isForwarded && (
                        <View style={styles.forwardedContainer}>
                            <Ionicons name="arrow-redo" size={12} color={Colors.text.secondary.dark} style={styles.forwardedIcon} />
                            <Text style={styles.forwardedText}>Forwarded</Text>
                        </View>
                    )}

                    {item.isDeleted ? (
                        <View style={styles.deletedContainer}>
                            <Ionicons name="ban-outline" size={16} color={Colors.text.secondary.dark} style={{ marginRight: 6 }} />
                            <Text style={[styles.messageText, { fontStyle: 'italic', color: Colors.text.secondary.dark }]}>This message was deleted</Text>
                        </View>
                    ) : (
                        <Text style={[styles.messageText, item.type === 'link' ? styles.linkText : null]}>
                            {item.content}
                        </Text>
                    )}

                    <View style={styles.messageFooter}>
                        <Text style={styles.messageTime}>{item.time}</Text>
                        {isSent && (
                            <Ionicons
                                name={getStatusIcon(item.status) as any}
                                size={14}
                                color={item.status === 'read' ? Colors.primary : Colors.text.secondary.dark}
                                style={{ marginLeft: 2 }}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.surface.dark} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={Colors.text.primary.dark} />
                </TouchableOpacity>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{contactName.charAt(0)}</Text>
                </View>

                <TouchableOpacity style={styles.headerInfo} activeOpacity={0.8}>
                    <Text style={styles.headerName} numberOfLines={1}>{contactName}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="videocam-outline" size={24} color={Colors.text.primary.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="call-outline" size={24} color={Colors.text.primary.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="ellipsis-vertical" size={24} color={Colors.text.primary.dark} />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} // Using padding for Android too as per new layout strategy
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {/* Messages */}
                <View style={styles.messagesContainer}>
                    <FlatList
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.messagesList}
                    />
                </View>

                {/* Input Bar - Updated to WhatsApp Design */}
                <View style={styles.inputBarContainer}>
                    <View style={styles.inputPill}>
                        <TouchableOpacity style={styles.emojiButton}>
                            <Ionicons name="happy-outline" size={24} color={Colors.text.secondary.dark} />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Message"
                            placeholderTextColor={Colors.text.secondary.dark}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />

                        <TouchableOpacity style={styles.inputAction}>
                            <Ionicons name="attach" size={24} color={Colors.text.secondary.dark} style={{ transform: [{ rotate: '-45deg' }] }} />
                        </TouchableOpacity>

                        {!message.trim() && (
                            <>
                                <TouchableOpacity style={styles.inputAction}>
                                    <View style={styles.rupeeContainer}>
                                        <Text style={styles.rupeeIcon}>₹</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.inputAction}>
                                    <Ionicons name="camera-outline" size={24} color={Colors.text.secondary.dark} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.micButton}
                        onPress={handleSend}
                    >
                        <Ionicons
                            name={message.trim() ? "send" : "mic"}
                            size={20}
                            color={Colors.text.primary.dark}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface.dark,
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: Sizes.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.dark,
    },
    backButton: {
        marginRight: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.avatarBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: Fonts.weight.semibold,
        color: Colors.text.primary.dark,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: Fonts.weight.semibold,
        color: Colors.text.primary.dark,
    },
    headerStatus: {
        fontSize: 12,
        color: Colors.text.secondary.dark,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    headerAction: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    messagesList: {
        paddingHorizontal: Sizes.spacing.md,
        paddingBottom: 20,
        paddingTop: 20,
    },
    messageContainer: {
        marginVertical: 6,
        width: '100%',
    },
    messageSent: {
        alignItems: 'flex-end',
    },
    messageReceived: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    bubbleSent: {
        backgroundColor: Colors.chat.sent,
        borderBottomRightRadius: 4,
    },
    bubbleReceived: {
        backgroundColor: Colors.chat.received,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        color: Colors.text.primary.dark,
        lineHeight: 22,
    },
    linkText: {
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    messageTime: {
        fontSize: 10,
        color: Colors.text.secondary.dark,
    },
    forwardedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    forwardedIcon: {
        marginRight: 4,
    },
    forwardedText: {
        fontSize: 12,
        color: Colors.text.secondary.dark,
        fontStyle: 'italic',
    },
    deletedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // New Input Bar Styles
    inputBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 5,
        backgroundColor: 'transparent',
    },
    inputPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.darkmode,
        borderRadius: 24,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 6,
        minHeight: 48,
    },
    emojiButton: {
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text.primary.dark,
        maxHeight: 120,
        marginLeft: 4,
    },
    inputAction: {
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rupeeContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.text.secondary.dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rupeeIcon: {
        fontSize: 12,
        color: Colors.text.secondary.dark,
        fontWeight: 'bold',
    },
    micButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.background.light, // Using the new Green
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
});
