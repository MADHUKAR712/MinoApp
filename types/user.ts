/**
 * User type definition
 */
export interface User {
    id: string;
    phone: string;
    name: string;
    avatar?: string;
    status?: string;
    lastSeen?: string;
    isOnline?: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Auth session type
 */
export interface AuthSession {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}
