import { supabase } from '../lib/supabase';
import { Chat, Message } from '../types';

/**
 * Chat service for managing chats and messages
 */
export const chatService = {
    /**
     * Get all chats for current user
     */
    async getChats(): Promise<Chat[]> {
        const { data, error } = await supabase
            .from('chats')
            .select('*, participants(*), lastMessage:messages(*)')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data ?? [];
    },

    /**
     * Get messages for a chat
     */
    async getMessages(chatId: string, limit = 50): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data ?? [];
    },

    /**
     * Send a message
     */
    async sendMessage(chatId: string, content: string, type: 'text' = 'text'): Promise<Message> {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                chat_id: chatId,
                content,
                type,
                status: 'sending',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create or get existing private chat
     */
    async getOrCreatePrivateChat(userId: string): Promise<Chat> {
        // TODO: Implement logic to find existing chat or create new
        throw new Error('Not implemented');
    },

    /**
     * Subscribe to new messages in a chat
     */
    subscribeToMessages(chatId: string, callback: (message: Message) => void) {
        return supabase
            .channel(`messages:${chatId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
                (payload: { new: Message }) => callback(payload.new as Message)
            )
            .subscribe();
    },
};
