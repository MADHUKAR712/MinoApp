import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Database types
export type Profile = {
    id: string;
    phone: string | null;
    email: string | null;
    google_id: string | null;
    display_name: string | null;
    about: string | null;
    avatar_url: string | null;
    is_online: boolean;
    last_seen: string;
    created_at: string;
    updated_at: string;
};

export type Chat = {
    id: string;
    name: string | null;
    is_group: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
};

export type Message = {
    id: string;
    chat_id: string;
    sender_id: string | null;
    content: string;
    message_type: 'text' | 'image' | 'video' | 'audio' | 'document';
    media_url: string | null;
    reply_to: string | null;
    is_read: boolean;
    created_at: string;
};

export type ChatParticipant = {
    id: string;
    chat_id: string;
    user_id: string;
    role: 'admin' | 'member';
    joined_at: string;
};
