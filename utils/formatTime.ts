/**
 * Time formatting utilities for chat timestamps
 */

/**
 * Parse timestamp from string or number
 */
function parseTimestamp(timestamp: string | number): Date {
    if (typeof timestamp === 'string') {
        return new Date(timestamp);
    }
    return new Date(timestamp);
}

/**
 * Format timestamp to readable time (e.g., "2:30 PM")
 */
export function formatTime(timestamp: string | number): string {
    const date = parseTimestamp(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Alias for formatTime (used in message bubbles)
 */
export function formatMessageTime(timestamp: string | number): string {
    return formatTime(timestamp);
}

/**
 * Format timestamp for chat list (e.g., "Yesterday", "Monday", "12/25/2025")
 */
export function formatChatListTime(timestamp: string | number): string {
    const now = new Date();
    const date = parseTimestamp(timestamp);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return formatTime(timestamp);
    }

    if (diffDays === 1) {
        return 'Yesterday';
    }

    if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format date for message separators (e.g., "Today", "December 25, 2025")
 */
export function formatDateSeparator(timestamp: string | number): string {
    const now = new Date();
    const date = parseTimestamp(timestamp);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    }

    if (diffDays === 1) {
        return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format call duration (e.g., "1:23:45" or "5:30")
 */
export function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get relative time string (e.g., "just now", "5 minutes ago")
 */
export function getRelativeTime(timestamp: string | number): string {
    const now = Date.now();
    const date = parseTimestamp(timestamp);
    const diffSeconds = Math.floor((now - date.getTime()) / 1000);

    if (diffSeconds < 60) {
        return 'just now';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }

    return formatChatListTime(timestamp);
}
