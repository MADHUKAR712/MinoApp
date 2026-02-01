import { User } from './user';

/**
 * Message status
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * Message type
 */
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'location';

/**
 * Message interface
 */
export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    type: MessageType;
    content: string;
    mediaUrl?: string;
    status: MessageStatus;
    replyToId?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Chat participant
 */
export interface ChatParticipant {
    userId: string;
    user: User;
    joinedAt: string;
    isAdmin?: boolean;
}

/**
 * Chat interface
 */
export interface Chat {
    id: string;
    type: 'private' | 'group';
    name?: string;
    avatar?: string;
    participants: ChatParticipant[];
    lastMessage?: Message;
    unreadCount: number;
    isPinned: boolean;
    isMuted: boolean;
    createdAt: string;
    updatedAt: string;
}
