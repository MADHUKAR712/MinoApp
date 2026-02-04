import { RealtimeChannel } from '@supabase/supabase-js';
import { Message, Profile, supabase } from '../lib/supabase';

/**
 * Enhanced Chat Service with real-time messaging support
 * Provides WhatsApp-like one-to-one chat functionality
 */

export interface ChatWithDetails {
    id: string;
    name: string | null;
    is_group: boolean;
    created_at: string;
    updated_at: string;
    other_user: Profile | null;
    last_message: Message | null;
    unread_count: number;
}

export interface MessageWithSender extends Message {
    sender: Profile | null;
}

export const chatService = {
    /**
     * Get current authenticated user ID
     */
    async getCurrentUserId(): Promise<string | null> {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id || null;
    },

    /**
     * Get or create a private chat between current user and target user
     * This is the core function for starting a 1-on-1 conversation
     */
    async getOrCreatePrivateChat(otherUserId: string): Promise<{ chatId: string; isNew: boolean }> {
        const currentUserId = await this.getCurrentUserId();
        if (!currentUserId) throw new Error('User not authenticated');

        // Find existing private chat between these two users
        const { data: existingChats, error: findError } = await supabase
            .from('chat_participants')
            .select('chat_id')
            .eq('user_id', currentUserId);

        if (findError) throw findError;

        // Check each chat to see if it's a private chat with the target user
        for (const participant of existingChats || []) {
            const { data: chatData, error: chatError } = await supabase
                .from('chats')
                .select('id, is_group')
                .eq('id', participant.chat_id)
                .eq('is_group', false)
                .single();

            if (chatError || !chatData) continue;

            // Check if target user is also in this chat
            const { data: otherParticipant, error: otherError } = await supabase
                .from('chat_participants')
                .select('user_id')
                .eq('chat_id', chatData.id)
                .eq('user_id', otherUserId)
                .single();

            if (!otherError && otherParticipant) {
                // Found existing private chat
                return { chatId: chatData.id, isNew: false };
            }
        }

        // No existing chat found, create a new one
        const { data: newChat, error: createError } = await supabase
            .from('chats')
            .insert({
                is_group: false,
                created_by: currentUserId,
            })
            .select()
            .single();

        if (createError || !newChat) throw createError || new Error('Failed to create chat');

        // Add both users as participants
        const { error: participantsError } = await supabase
            .from('chat_participants')
            .insert([
                { chat_id: newChat.id, user_id: currentUserId, role: 'member' },
                { chat_id: newChat.id, user_id: otherUserId, role: 'member' },
            ]);

        if (participantsError) throw participantsError;

        return { chatId: newChat.id, isNew: true };
    },

    /**
     * Send a message in a chat
     */
    async sendMessage(
        chatId: string,
        content: string,
        messageType: 'text' | 'image' | 'video' | 'audio' | 'document' = 'text',
        mediaUrl?: string
    ): Promise<Message> {
        const currentUserId = await this.getCurrentUserId();
        if (!currentUserId) throw new Error('User not authenticated');

        // Insert the message
        const { data: message, error: msgError } = await supabase
            .from('messages')
            .insert({
                chat_id: chatId,
                sender_id: currentUserId,
                content,
                message_type: messageType,
                media_url: mediaUrl || null,
                is_read: false,
            })
            .select()
            .single();

        if (msgError || !message) throw msgError || new Error('Failed to send message');

        // Update chat's updated_at timestamp
        await supabase
            .from('chats')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', chatId);

        return message;
    },

    /**
     * Get messages for a chat with sender profile info
     */
    async getMessages(chatId: string, limit = 50, offset = 0): Promise<MessageWithSender[]> {
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:profiles!messages_sender_id_fkey(*)
            `)
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return (data as MessageWithSender[]) || [];
    },

    /**
     * Get all chats for current user with last message and other participant info
     */
    async getChatList(): Promise<ChatWithDetails[]> {
        const currentUserId = await this.getCurrentUserId();
        if (!currentUserId) throw new Error('User not authenticated');

        // Get all chats where user is a participant
        const { data: participations, error: partError } = await supabase
            .from('chat_participants')
            .select('chat_id')
            .eq('user_id', currentUserId);

        if (partError) throw partError;
        if (!participations || participations.length === 0) return [];

        const chatIds = participations.map(p => p.chat_id);

        // Get chat details with participants
        const { data: chats, error: chatError } = await supabase
            .from('chats')
            .select('*')
            .in('id', chatIds)
            .order('updated_at', { ascending: false });

        if (chatError) throw chatError;

        // Build detailed chat list
        const chatList: ChatWithDetails[] = [];

        for (const chat of chats || []) {
            // Get other participant for private chats
            let otherUser: Profile | null = null;
            if (!chat.is_group) {
                const { data: otherParticipant } = await supabase
                    .from('chat_participants')
                    .select('user_id')
                    .eq('chat_id', chat.id)
                    .neq('user_id', currentUserId)
                    .single();

                if (otherParticipant) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', otherParticipant.user_id)
                        .single();
                    otherUser = profile;
                }
            }

            // Get last message
            const { data: lastMessageData } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', chat.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // Count unread messages
            const { count: unreadCount } = await supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .eq('chat_id', chat.id)
                .eq('is_read', false)
                .neq('sender_id', currentUserId);

            chatList.push({
                id: chat.id,
                name: chat.name,
                is_group: chat.is_group,
                created_at: chat.created_at,
                updated_at: chat.updated_at,
                other_user: otherUser,
                last_message: lastMessageData || null,
                unread_count: unreadCount || 0,
            });
        }

        return chatList;
    },

    /**
     * Mark all messages in a chat as read (for messages not sent by current user)
     */
    async markMessagesAsRead(chatId: string): Promise<void> {
        const currentUserId = await this.getCurrentUserId();
        if (!currentUserId) return;

        await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('chat_id', chatId)
            .eq('is_read', false)
            .neq('sender_id', currentUserId);
    },

    /**
     * Subscribe to new messages in a chat (real-time)
     * Returns an unsubscribe function
     */
    subscribeToMessages(
        chatId: string,
        onNewMessage: (message: Message) => void
    ): RealtimeChannel {
        const channel = supabase
            .channel(`messages:${chatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    onNewMessage(payload.new as Message);
                }
            )
            .subscribe();

        return channel;
    },

    /**
     * Subscribe to all chats for current user (for chat list updates)
     */
    subscribeToAllMessages(
        onNewMessage: (message: Message) => void
    ): RealtimeChannel {
        const channel = supabase
            .channel('all_messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    onNewMessage(payload.new as Message);
                }
            )
            .subscribe();

        return channel;
    },

    /**
     * Unsubscribe from a channel
     */
    unsubscribe(channel: RealtimeChannel): void {
        supabase.removeChannel(channel);
    },

    /**
     * Get user profile by ID
     */
    async getUserProfile(userId: string): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) return null;
        return data;
    },

    /**
     * Update user online status
     */
    async updateOnlineStatus(isOnline: boolean): Promise<void> {
        const currentUserId = await this.getCurrentUserId();
        if (!currentUserId) return;

        await supabase
            .from('profiles')
            .update({
                is_online: isOnline,
                last_seen: new Date().toISOString(),
            })
            .eq('id', currentUserId);
    },
};
