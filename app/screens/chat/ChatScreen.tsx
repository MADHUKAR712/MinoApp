import { Ionicons } from '@expo/vector-icons';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import { Message, Profile } from '../../../lib/supabase';
import { chatService, MessageWithSender } from '../../../services/chatService';

interface DisplayMessage {
    id: string;
    content: string;
    time: string;
    isSent: boolean;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    senderId: string;
}

export default function ChatScreen() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const otherUserId = typeof id === 'string' ? id : '';
    const contactName = typeof name === 'string' ? name : 'Chat';
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    // State
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [otherUserProfile, setOtherUserProfile] = useState<Profile | null>(null);

    // Refs for cleanup
    const subscriptionRef = useRef<RealtimeChannel | null>(null);

    // Initialize chat on mount
    useEffect(() => {
        initializeChat();

        return () => {
            // Cleanup subscription on unmount
            if (subscriptionRef.current) {
                chatService.unsubscribe(subscriptionRef.current);
            }
        };
    }, [otherUserId]);

    const initializeChat = async () => {
        try {
            setIsLoading(true);

            // Get current user ID
            const userId = await chatService.getCurrentUserId();
            setCurrentUserId(userId);

            if (!userId || !otherUserId) {
                console.error('[ChatScreen] Missing user IDs');
                setIsLoading(false);
                return;
            }

            // Get other user's profile for display
            const profile = await chatService.getUserProfile(otherUserId);
            setOtherUserProfile(profile);

            // Get or create chat
            const { chatId: existingChatId } = await chatService.getOrCreatePrivateChat(otherUserId);
            setChatId(existingChatId);

            // Load existing messages
            const existingMessages = await chatService.getMessages(existingChatId);
            const displayMessages = existingMessages.map(msg => transformMessage(msg, userId));
            setMessages(displayMessages);

            // Mark messages as read
            await chatService.markMessagesAsRead(existingChatId);

            // Subscribe to new messages
            subscriptionRef.current = chatService.subscribeToMessages(
                existingChatId,
                (newMessage) => handleNewMessage(newMessage, userId)
            );

            setIsLoading(false);
        } catch (error) {
            console.error('[ChatScreen] Error initializing chat:', error);
            setIsLoading(false);
        }
    };

    // Transform database message to display format
    const transformMessage = (msg: MessageWithSender | Message, userId: string): DisplayMessage => {
        const createdAt = new Date(msg.created_at);
        return {
            id: msg.id,
            content: msg.content,
            time: createdAt.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }),
            isSent: msg.sender_id === userId,
            status: msg.is_read ? 'read' : 'sent',
            senderId: msg.sender_id || '',
        };
    };

    // Handle incoming real-time message
    const handleNewMessage = useCallback((newMessage: Message, userId: string) => {
        setMessages(prev => {
            // Check if message already exists (optimistic update)
            if (prev.some(m => m.id === newMessage.id)) {
                return prev;
            }
            return [...prev, transformMessage(newMessage, userId)];
        });

        // Mark as read if it's from the other user
        if (newMessage.sender_id !== userId && chatId) {
            chatService.markMessagesAsRead(chatId);
        }

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [chatId]);

    const handleSend = async () => {
        console.log('[ChatScreen] handleSend called', { message: message.trim(), chatId, isSending });

        if (!message.trim() || isSending) {
            console.log('[ChatScreen] Early return - empty message or already sending');
            return;
        }

        // If no chatId yet, we need to create the chat first
        let activeChatId = chatId;
        if (!activeChatId && otherUserId && currentUserId) {
            console.log('[ChatScreen] No chatId, creating chat...');
            try {
                const { chatId: newChatId } = await chatService.getOrCreatePrivateChat(otherUserId);
                activeChatId = newChatId;
                setChatId(newChatId);
                console.log('[ChatScreen] Chat created:', newChatId);
            } catch (error) {
                console.error('[ChatScreen] Error creating chat:', error);
                Alert.alert('Error', 'Failed to start chat. Check connection.');
                return;
            }
        }

        if (!activeChatId) {
            console.error('[ChatScreen] No chat ID available');
            Alert.alert('Error', 'Chat initialization failed.');
            return;
        }

        const messageContent = message.trim();
        const tempId = `temp_${Date.now()}`;

        // Optimistic update
        const optimisticMessage: DisplayMessage = {
            id: tempId,
            content: messageContent,
            time: new Date().toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }),
            isSent: true,
            status: 'sending',
            senderId: currentUserId || '',
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setMessage('');
        setIsSending(true);

        try {
            console.log('[ChatScreen] Sending message to chat:', activeChatId);
            const sentMessage = await chatService.sendMessage(activeChatId, messageContent);

            // Replace optimistic message with real one
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === tempId
                        ? { ...transformMessage(sentMessage, currentUserId || ''), status: 'sent' as const }
                        : msg
                )
            );
        } catch (error: any) {
            console.error('[ChatScreen] Error sending message:', error);
            Alert.alert('Send Failed', error.message || 'Could not send message. Please try again.');

            // Mark as failed
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === tempId ? { ...msg, status: 'sending' as const } : msg
                )
            );
        } finally {
            setIsSending(false);
        }

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item }: { item: DisplayMessage }) => {
        const isSent = item.isSent;

        return (
            <View style={[styles.messageContainer, isSent ? styles.messageSent : styles.messageReceived]}>
                <View style={[styles.messageBubble, isSent ? styles.bubbleSent : styles.bubbleReceived]}>
                    <Text style={styles.messageText}>{item.content}</Text>

                    <View style={styles.messageFooter}>
                        <Text style={styles.messageTime}>{item.time}</Text>
                        {isSent && (
                            <Ionicons
                                name={
                                    item.status === 'sending'
                                        ? 'time-outline'
                                        : item.status === 'read'
                                            ? 'checkmark-done'
                                            : 'checkmark-done-outline'
                                }
                                size={14}
                                color={
                                    item.status === 'read'
                                        ? Colors.primary
                                        : Colors.text.secondary.dark
                                }
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    const getDisplayName = () => {
        if (otherUserProfile?.display_name) {
            return otherUserProfile.display_name;
        }
        return contactName.replace(' (You)', '');
    };

    const getOnlineStatus = () => {
        if (otherUserProfile?.is_online) {
            return 'Online';
        }
        if (otherUserProfile?.last_seen) {
            const lastSeen = new Date(otherUserProfile.last_seen);
            return `Last seen ${lastSeen.toLocaleDateString()}`;
        }
        return 'Offline';
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.surface.dark} />
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading chat...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.surface.dark} />

            {/* HEADER */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={Colors.text.primary.dark} />
                </TouchableOpacity>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getDisplayName().charAt(0).toUpperCase()}</Text>
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerName} numberOfLines={1}>{getDisplayName()}</Text>
                    <Text style={styles.headerStatus}>{getOnlineStatus()}</Text>
                </View>

                <View style={styles.headerActions}>
                    <Ionicons name="videocam-outline" size={22} color={Colors.text.primary.dark} />
                    <Ionicons name="call-outline" size={22} color={Colors.text.primary.dark} />
                    <Ionicons name="ellipsis-vertical" size={22} color={Colors.text.primary.dark} />
                </View>
            </View>

            {/* MESSAGES */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubble-outline" size={48} color={Colors.text.secondary.dark} />
                        <Text style={styles.emptyText}>No messages yet</Text>
                        <Text style={styles.emptySubtext}>Send a message to start the conversation</Text>
                    </View>
                }
            />

            {/* INPUT BAR */}
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
                            editable={!isSending}
                        />

                        <Ionicons name="attach" size={22} color={Colors.text.secondary.dark} />
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={isSending || !message.trim()}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color={Colors.surface.dark} />
                        ) : (
                            <Ionicons
                                name={message.trim() ? 'send' : 'mic'}
                                size={20}
                                color={Colors.surface.dark}
                            />
                        )}
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

    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadingText: {
        marginTop: 12,
        color: Colors.text.secondary.dark,
        fontSize: 14,
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
        flexGrow: 1,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },

    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.text.primary.dark,
        fontWeight: '600',
    },

    emptySubtext: {
        marginTop: 4,
        fontSize: 14,
        color: Colors.text.secondary.dark,
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

    sendButtonDisabled: {
        opacity: 0.6,
    },
});
