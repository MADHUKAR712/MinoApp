/**
 * AuthContext - User authentication state management
 * Uses native Google Sign-In (no Supabase Auth)
 */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { authService } from '../services/authService';
import { removeItem, setItem, StorageKeys } from '../utils/storage';

interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    about?: string;
    googleId?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved user on startup & listen for auth state
    useEffect(() => {
        // 1. Initial Load
        const loadUser = async () => {
            try {
                // Check if we can restore session (via Supabase or Google)
                const user = await authService.signInSilently();
                if (user) {
                    setUser(user);
                    await setItem(StorageKeys.USER, user);
                } else {
                    // Clean up if no valid session found
                    await removeItem(StorageKeys.USER);
                    setUser(null);
                }
            } catch (error) {
                console.error('[AuthContext] Failed to load user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();

        // 2. Listen for Auth Changes (Sign In, Sign Out, Refresh)
        // This ensures if the session expires or changes, our state reflects it.
        // const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        //    if (event === 'SIGNED_IN' && session) { ... }
        //    else if (event === 'SIGNED_OUT') { setUser(null); }
        // });
        // NOTE: Since we wrap Google Sign In, the native flow drives the specific user details. 
        // Simple listener might not get the full profile. 
        // We rely on signInWithGoogle / signInSilently to set the full user state.

    }, []);

    const signInWithGoogle = useCallback(async () => {
        const result = await authService.signInWithGoogle();

        if (result.success && result.user) {
            // User Data is already standardized in authService
            const userProfile: User = {
                id: result.user.id,
                email: result.user.email,
                displayName: result.user.displayName,
                avatarUrl: result.user.avatarUrl,
                about: undefined, // Will be fetched/merged if we strictly used DB profile return
                googleId: result.user.googleId,
            };

            // Fetch latest DB profile to ensure we have 'about' and other fields
            // that might not be in the Google object
            const dbProfile = await authService.getUserProfile(result.user.googleId);
            if (dbProfile) {
                userProfile.about = dbProfile.about;
                userProfile.displayName = dbProfile.display_name || userProfile.displayName;
                userProfile.avatarUrl = dbProfile.avatar_url || userProfile.avatarUrl;
            }

            setUser(userProfile);
            await setItem(StorageKeys.USER, userProfile);
        }

        return { success: result.success, error: result.error };
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authService.signOut();
            await removeItem(StorageKeys.USER);
            setUser(null);
        } catch (error) {
            console.error('[AuthContext] Logout failed:', error);
        }
    }, []);

    const updateProfile = useCallback(async (data: Partial<User>): Promise<void> => {
        if (!user) return;
        try {
            // Update DB first
            const success = await authService.updateUserProfile(user.id, data);

            if (!success) {
                throw new Error('Failed to update profile on server');
            }

            const updatedUser = { ...user, ...data };
            await setItem(StorageKeys.USER, updatedUser);
            setUser(updatedUser);
        } catch (error) {
            console.error('[AuthContext] Profile update failed:', error);
            throw error;
        }
    }, [user]);

    const value = useMemo<AuthContextType>(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle,
        logout,
        updateProfile,
    }), [user, isLoading, signInWithGoogle, logout, updateProfile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
