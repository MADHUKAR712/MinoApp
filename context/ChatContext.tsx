/**
 * ChatContext - Chat messages state management
 * Handles conversations, messages, and real-time updates
 */
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react';

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    timestamp: number;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'video' | 'audio' | 'document';
    mediaUrl?: string;
}

export interface Chat {
    id: string;
    name: string;
    avatarUrl?: string;
    isGroup: boolean;
    participants: string[];
    lastMessage?: Message;
    unreadCount: number;
    isPinned: boolean;
    isMuted: boolean;
}

interface ChatContextType {
    chats: Chat[];
    messages: Record<string, Message[]>;
    activeChat: Chat | null;
    setActiveChat: (chat: Chat | null) => void;
    sendMessage: (chatId: string, text: string) => Promise<void>;
    markAsRead: (chatId: string) => void;
    loadMessages: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps): React.JSX.Element {
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [activeChat, setActiveChat] = useState<Chat | null>(null);

    const sendMessage = useCallback(async (chatId: string, text: string): Promise<void> => {
        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            chatId,
            senderId: 'current_user', // TODO: Get from AuthContext
            text,
            timestamp: Date.now(),
            status: 'sending',
            type: 'text',
        };

        // Optimistically add message
        setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), newMessage],
        }));

        // Update chat's last message
        setChats(prev =>
            prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, lastMessage: newMessage }
                    : chat
            )
        );

        // TODO: Send message to backend
        // Simulate network delay and update status
        setTimeout(() => {
            setMessages(prev => ({
                ...prev,
                [chatId]: prev[chatId]?.map(msg =>
                    msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
                ) || [],
            }));
        }, 500);
    }, []);

    const markAsRead = useCallback((chatId: string): void => {
        setChats(prev =>
            prev.map(chat =>
                chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
            )
        );
        // TODO: Send read receipt to backend
    }, []);

    const loadMessages = useCallback(async (chatId: string): Promise<void> => {
        // TODO: Fetch messages from backend
        // For now, initialize empty if not exists
        if (!messages[chatId]) {
            setMessages(prev => ({ ...prev, [chatId]: [] }));
        }
    }, [messages]);

    const value = useMemo<ChatContextType>(() => ({
        chats,
        messages,
        activeChat,
        setActiveChat,
        sendMessage,
        markAsRead,
        loadMessages,
    }), [chats, messages, activeChat, sendMessage, markAsRead, loadMessages]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat(): ChatContextType {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
