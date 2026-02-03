import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_STORAGE_KEY = '@mimo_chats';

export interface StoredChat {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    isGroup?: boolean;
    isPinned?: boolean;
    updatedAt: number; // timestamp for sorting
}

/**
 * Local chat storage service using AsyncStorage
 */
export const chatStorage = {
    /**
     * Get all saved chats, sorted by most recent
     */
    async getChats(): Promise<StoredChat[]> {
        try {
            const data = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
            if (!data) return [];

            const chats: StoredChat[] = JSON.parse(data);
            return chats.sort((a, b) => b.updatedAt - a.updatedAt);
        } catch (error) {
            console.error('[chatStorage] Error getting chats:', error);
            return [];
        }
    },

    /**
     * Save or update a chat
     */
    async saveChat(chat: Omit<StoredChat, 'updatedAt'>): Promise<void> {
        try {
            const chats = await this.getChats();
            const existingIndex = chats.findIndex(c => c.id === chat.id);

            const chatWithTimestamp: StoredChat = {
                ...chat,
                updatedAt: Date.now(),
            };

            if (existingIndex >= 0) {
                chats[existingIndex] = chatWithTimestamp;
            } else {
                chats.unshift(chatWithTimestamp);
            }

            await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
        } catch (error) {
            console.error('[chatStorage] Error saving chat:', error);
        }
    },

    /**
     * Search chats by name (case-insensitive)
     */
    async searchChats(query: string): Promise<StoredChat[]> {
        const chats = await this.getChats();
        if (!query.trim()) return chats;

        const lowerQuery = query.toLowerCase();
        return chats.filter(chat =>
            chat.name.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Delete a chat
     */
    async deleteChat(chatId: string): Promise<void> {
        try {
            const chats = await this.getChats();
            const filtered = chats.filter(c => c.id !== chatId);
            await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('[chatStorage] Error deleting chat:', error);
        }
    },

    /**
     * Clear all chats (for testing)
     */
    async clearAll(): Promise<void> {
        await AsyncStorage.removeItem(CHATS_STORAGE_KEY);
    },
};
