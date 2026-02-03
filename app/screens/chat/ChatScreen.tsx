import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { Sizes } from '../../../constants/Sizes';
import { chatStorage } from '../../../services/chatStorage';

interface Message {
    id: string;
    content: string;
    time: string;
    isSent: boolean;
    status?: 'sent' | 'delivered' | 'read';
}

export default function ChatScreen() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const chatId = typeof id === 'string' ? id : `chat_${Date.now()}`;
    const contactName = typeof name === 'string' ? name : 'New Chat';
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: message.trim(),
            time: new Date().toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }),
            isSent: true,
            status: 'sent',
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Save chat to storage so it appears in ChatsScreen
        await chatStorage.saveChat({
            id: chatId,
            name: contactName,
            lastMessage: newMessage.content,
            time: newMessage.time,
        });
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isSent = item.isSent;

        return (
            <View style={[styles.messageContainer, isSent ? styles.messageSent : styles.messageReceived]}>
                <View style={[styles.messageBubble, isSent ? styles.bubbleSent : styles.bubbleReceived]}>
                    <Text style={styles.messageText}>{item.content}</Text>

                    <View style={styles.messageFooter}>
                        <Text style={styles.messageTime}>{item.time}</Text>
                        {isSent && (
                            <Ionicons
                                name="checkmark-done-outline"
                                size={14}
                                color={item.status === 'read' ? Colors.primary : Colors.text.secondary.dark}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.surface.dark} />

            {/* HEADER (NO KeyboardAvoidingView) */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={Colors.text.primary.dark} />
                </TouchableOpacity>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{contactName.charAt(0)}</Text>
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerName} numberOfLines={1}>{contactName}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>

                <View style={styles.headerActions}>
                    <Ionicons name="videocam-outline" size={22} color={Colors.text.primary.dark} />
                    <Ionicons name="call-outline" size={22} color={Colors.text.primary.dark} />
                    <Ionicons name="ellipsis-vertical" size={22} color={Colors.text.primary.dark} />
                </View>
            </View>

            {/* MESSAGES (NO KeyboardAvoidingView) */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* INPUT BAR (ONLY THIS USES KeyboardAvoidingView) */}
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 60 : 0}
            >
                <View style={[styles.inputBarContainer]}>
                    <View style={styles.inputPill}>
                        <Ionicons name="happy-outline" size={22} color={Colors.text.secondary.dark} />

                        <TextInput
                            style={styles.textInput}
                            placeholder="Message"
                            placeholderTextColor={Colors.text.secondary.dark}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />

                        <Ionicons name="attach" size={22} color={Colors.text.secondary.dark} />
                    </View>

                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons
                            name={message.trim() ? 'send' : 'mic'}
                            size={20}
                            color={Colors.surface.dark}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.md,
        paddingBottom: 12,
        backgroundColor: Colors.surface.dark,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.dark,
    },

    backButton: {
        marginRight: 6,
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

    messagesList: {
        paddingHorizontal: Sizes.spacing.md,
        paddingVertical: 16,
    },

    messageContainer: {
        marginVertical: 6,
    },

    messageSent: {
        alignItems: 'flex-end',
    },

    messageReceived: {
        alignItems: 'flex-start',
    },

    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
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
    },

    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
        gap: 4,
    },

    messageTime: {
        fontSize: 10,
        color: Colors.text.secondary.dark,
    },

    inputBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 10,
        backgroundColor: Colors.surface.dark,
    },

    inputPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.darkmode,
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 6,
    },

    textInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text.primary.dark,
        marginHorizontal: 8,
        maxHeight: 120,
    },

    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.background.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
