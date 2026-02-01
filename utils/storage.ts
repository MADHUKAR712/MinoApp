/**
 * AsyncStorage helper utilities
 * Type-safe, error-handled storage operations
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys enum for type safety
 */
export enum StorageKeys {
    USER = '@mino/user',
    THEME = '@mino/theme',
    ONBOARDING_COMPLETE = '@mino/onboarding_complete',
    NOTIFICATIONS_ENABLED = '@mino/notifications_enabled',
    CHAT_DRAFTS = '@mino/chat_drafts',
    LAST_SYNC = '@mino/last_sync',
}

/**
 * Get item from storage with type safety
 */
export async function getItem<T>(key: StorageKeys): Promise<T | null> {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value) as T;
        }
        return null;
    } catch (error) {
        console.error(`Storage getItem error for ${key}:`, error);
        return null;
    }
}

/**
 * Set item in storage
 */
export async function setItem<T>(key: StorageKeys, value: T): Promise<boolean> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Storage setItem error for ${key}:`, error);
        return false;
    }
}

/**
 * Remove item from storage
 */
export async function removeItem(key: StorageKeys): Promise<boolean> {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Storage removeItem error for ${key}:`, error);
        return false;
    }
}

/**
 * Clear all app storage (use with caution!)
 */
export async function clearAll(): Promise<boolean> {
    try {
        const keys = Object.values(StorageKeys);
        await AsyncStorage.multiRemove(keys);
        return true;
    } catch (error) {
        console.error('Storage clearAll error:', error);
        return false;
    }
}

/**
 * Get multiple items from storage
 */
export async function getMultiple<T extends Record<string, unknown>>(
    keys: StorageKeys[]
): Promise<Partial<T>> {
    try {
        const pairs = await AsyncStorage.multiGet(keys);
        const result: Record<string, unknown> = {};

        for (const [key, value] of pairs) {
            if (value !== null) {
                result[key] = JSON.parse(value);
            }
        }

        return result as Partial<T>;
    } catch (error) {
        console.error('Storage getMultiple error:', error);
        return {};
    }
}

/**
 * Set multiple items in storage
 */
export async function setMultiple(
    items: Partial<Record<StorageKeys, unknown>>
): Promise<boolean> {
    try {
        const pairs: [string, string][] = Object.entries(items).map(
            ([key, value]) => [key, JSON.stringify(value)]
        );
        await AsyncStorage.multiSet(pairs);
        return true;
    } catch (error) {
        console.error('Storage setMultiple error:', error);
        return false;
    }
}
