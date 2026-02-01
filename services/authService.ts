import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    offlineAccess: false,
    scopes: ['profile', 'email'],
});

export interface GoogleUser {
    id: string; // This will hold the DB UUID eventually, or Google ID temporarily
    email: string;
    displayName: string;
    avatarUrl?: string;
    googleId: string;
}

/**
 * Authentication service - Native Google Sign-In (without Supabase Auth)
 * Just uses Google for login and saves user data to Supabase database
 */
export const authService = {
    /**
     * Sign in with Google using native SDK
     * Returns user data directly from Google (no Supabase Auth)
     */
    async signInWithGoogle(): Promise<{ success: boolean; user?: GoogleUser; error?: string }> {
        try {
            console.log('[Auth] Starting native Google Sign-In...');

            // Check Play Services availability (Android only)
            if (Platform.OS === 'android') {
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            }

            // Perform native sign-in
            const response = await GoogleSignin.signIn();

            if (!isSuccessResponse(response)) {
                console.log('[Auth] Sign-in cancelled by user');
                return { success: false, error: 'cancelled' };
            }

            const { data: userInfo } = response;
            console.log('[Auth] Google user:', userInfo.user.email);

            // Get ID Token
            const idToken = response.data?.idToken;
            if (!idToken) {
                console.error('[Auth] No ID token present!');
                return { success: false, error: 'No ID token received from Google' };
            }

            // Exchange for Supabase Session
            const { data: sessionData, error: sessionError } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: idToken,
            });

            if (sessionError) {
                console.error('[Auth] Supabase session error:', sessionError);
                return { success: false, error: sessionError.message };
            }

            console.log('[Auth] Supabase session established:', sessionData.session?.user.email);

            // Create temporary user object from Google data (or Supabase user)
            const user: GoogleUser = {
                id: sessionData.user?.id || userInfo.user.id, // Use Supabase Auth User ID
                email: userInfo.user.email,
                displayName: userInfo.user.name || userInfo.user.email.split('@')[0],
                avatarUrl: userInfo.user.photo || undefined,
                googleId: userInfo.user.id,
            };

            // Save user profile to Supabase database (RLS will now allow this)
            const dbProfile = await this.saveUserProfile(user);

            if (dbProfile) {
                // user.id is already the Auth User ID, which matches dbProfile.id if RLS works
            }

            console.log('[Auth] Sign-in successful:', user.email);
            return { success: true, user };

        } catch (error: any) {
            console.error('[Auth] Sign-in error:', error);

            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        return { success: false, error: 'Sign-in already in progress' };
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        return { success: false, error: 'Google Play Services not available' };
                    case statusCodes.SIGN_IN_CANCELLED:
                        return { success: false, error: 'cancelled' };
                    default:
                        return { success: false, error: error.message || 'Sign-in failed' };
                }
            }

            return { success: false, error: error.message || 'Sign-in failed' };
        }
    },

    /**
     * Save user profile to Supabase database
     * Handles UUID generation for new users
     */
    async saveUserProfile(user: GoogleUser): Promise<any | null> {
        try {
            console.log('[Auth] Saving user profile:', user.email);

            // Upsert with Auth User ID
            // If google_id exists, this will update the row.
            // Note: If the existing row has a different ID, this attempts to update the ID to match Auth ID.
            // If this violates Foreign Key constraints (e.g. existing messages), it might fail.
            // Ideally, cleaning the DB or handling migration is recommended for meaningful ID changes.

            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id, // Use the Supabase Auth User ID
                    email: user.email,
                    display_name: user.displayName,
                    avatar_url: user.avatarUrl,
                    google_id: user.googleId,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'google_id',
                })
                .select()
                .single();

            if (error) {
                console.error('[Auth] Failed to save profile:', error);

                // Fallback: If update failed (likely due to FK constraint on changing ID), 
                // try to fetch existing ID and update non-ID fields only.
                if (error.code === '23503' || error.code === '23505') {
                    // 23503 = FK violation, 23505 = Unique violation (if ID conflict with another row? Unlikely given google_id unique)
                    console.log('[Auth] Attempting fallback update for existing profile...');
                    const { data: existing, error: fetchErr } = await supabase.from('profiles').select('id').eq('google_id', user.googleId).single();
                    if (existing) {
                        // Update without changing ID
                        const { data: fallbackData } = await supabase.from('profiles').update({
                            email: user.email,
                            display_name: user.displayName,
                            avatar_url: user.avatarUrl,
                            updated_at: new Date().toISOString(),
                        }).eq('id', existing.id).select().single();
                        return fallbackData;
                    }
                }
                return null;
            } else {
                console.log('[Auth] Profile saved successfully');
                return data;
            }
        } catch (e) {
            console.error('[Auth] Profile save exception:', e);
            return null;
        }
    },

    /**
     * Get user profile from Supabase database
     */
    async getUserProfile(googleId: string): Promise<any | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('google_id', googleId)
                .maybeSingle(); // Safe for 0 rows

            if (error) {
                console.error('[Auth] Failed to fetch profile from DB:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('[Auth] Profile fetch exception:', e);
            return null;
        }
    },

    /**
     * Update user profile in Supabase database
     */
    async updateUserProfile(userId: string, updates: Partial<GoogleUser> | any): Promise<boolean> {
        try {
            // RLS Policy: "Users can update their own profile" where auth.uid() = id
            // We must update the row where id = userId (which should match auth.uid())

            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: updates.displayName || updates.display_name,
                    about: updates.about,
                    avatar_url: updates.avatarUrl || updates.avatar_url,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (error) {
                console.error('[Auth] Failed to update profile:', error);
                return false;
            }
            return true;
        } catch (e) {
            console.error('[Auth] Profile update exception:', e);
            return false;
        }
    },

    /**
     * Sign out from Google
     */
    async signOut(): Promise<void> {
        try {
            await supabase.auth.signOut(); // Sign out from Supabase
            if (await GoogleSignin.getCurrentUser()) {
                await GoogleSignin.signOut(); // Sign out from Google
            }
        } catch (e) {
            console.log('[Auth] Sign-out error:', e);
        }
    },

    /**
     * Check if user has previous Google sign-in
     */
    hasPreviousSignIn(): boolean {
        return GoogleSignin.hasPreviousSignIn();
    },

    /**
     * Get current Google user
     */
    getCurrentUser() {
        return GoogleSignin.getCurrentUser();
    },

    /**
     * Try to sign in silently (if user previously signed in)
     */
    async signInSilently(): Promise<GoogleUser | null> {
        try {
            // First check if we have a valid Supabase session
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                console.log('[Auth] Found existing Supabase session');
                return {
                    id: session.user.id,
                    email: session.user.email || '',
                    displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
                    avatarUrl: session.user.user_metadata?.avatar_url,
                    googleId: session.user.identities?.find(i => i.provider === 'google')?.id || '',
                };
            }

            // If no Supabase session, try Google silent sign-in
            if (!this.hasPreviousSignIn()) {
                return null;
            }

            const response = await GoogleSignin.signInSilently();

            // Check if response has data (success case)
            if (response.type === 'success' && response.data) {
                const userInfo = response.data;
                const idToken = response.data.idToken;

                if (idToken) {
                    // Exchange for Supabase Session
                    const { error } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: idToken,
                    });

                    if (error) {
                        console.error('[Auth] Silent Supabase exchange failed:', error);
                        // Continue? Or return null? User is signed in to Google but not Supabase.
                        // We should return null so AuthContext knows we aren't fully auth'd?
                        // Or maybe we treat it as "needs login".
                        return null;
                    }
                }

                return {
                    id: userInfo.user.id, // This will be updated to Supabase ID in AuthContext if needed, or we can fetch session again
                    email: userInfo.user.email,
                    displayName: userInfo.user.name || userInfo.user.email.split('@')[0],
                    avatarUrl: userInfo.user.photo || undefined,
                    googleId: userInfo.user.id,
                };
            }
            return null;
        } catch (e) {
            console.log('[Auth] Silent sign-in failed:', e);
            return null;
        }
    },
};
