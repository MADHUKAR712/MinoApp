/**
 * App configuration
 */
export const config = {
    // App info
    app: {
        name: 'Mino',
        version: '1.0.0',
        buildNumber: 1,
    },

    // API
    api: {
        timeout: 30000,
        retryAttempts: 3,
    },

    // Auth
    auth: {
        otpLength: 6,
        otpExpirySeconds: 60,
        maxPhoneLength: 15,
    },

    // Chat
    chat: {
        pageSize: 50,
        maxMessageLength: 4096,
        typingTimeoutMs: 3000,
    },

    // Media
    media: {
        maxImageSizeMB: 10,
        maxVideoSizeMB: 50,
        maxFileSizeMB: 100,
        supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        supportedVideoTypes: ['video/mp4', 'video/quicktime'],
    },

    // Feature flags
    features: {
        calls: false, // Coming soon
        status: false, // Coming soon
        groupChat: false, // Coming soon
    },
} as const;

export default config;
