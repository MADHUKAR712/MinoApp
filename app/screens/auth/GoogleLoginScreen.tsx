/**
 * GoogleLoginScreen - Google & Apple Sign-In
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PandaLogo from '../../../components/PandaLogo';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { Sizes } from '../../../constants/Sizes';
import { useAuth } from '../../../context/AuthContext';

export default function GoogleLoginScreen() {
    const { signInWithGoogle, isAuthenticated } = useAuth();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isAppleLoading, setIsAppleLoading] = useState(false);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            BackHandler.exitApp();
        }
    };

    const handleGoogleSignIn = async () => {
        if (isGoogleLoading || isAppleLoading) return;

        setIsGoogleLoading(true);
        try {
            console.log('[GoogleLogin] Starting Google sign-in...');
            const result = await signInWithGoogle();
            console.log('[GoogleLogin] Sign-in result:', result);

            if (result.success) {
                console.log('[GoogleLogin] Success! Navigating to home...');
                setTimeout(() => {
                    router.replace('/(tabs)/chats');
                }, 100);
            } else {
                if (result.error !== 'cancelled') {
                    Alert.alert(
                        'Sign In Failed',
                        result.error || 'Failed to sign in. Please try again.'
                    );
                }
            }
        } catch (error: any) {
            console.error('[GoogleLogin] Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleAppleSignIn = async () => {
        if (isGoogleLoading || isAppleLoading) return;

        setIsAppleLoading(true);
        try {
            console.log('[AppleLogin] Starting Apple sign-in...');
            // Apple Sign-In will be implemented when iOS is ready
            Alert.alert(
                'Coming Soon',
                'Apple Sign-In will be available soon for iOS devices.'
            );
        } catch (error: any) {
            console.error('[AppleLogin] Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsAppleLoading(false);
        }
    };

    // If already authenticated, redirect
    React.useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)/chats');
        }
    }, [isAuthenticated]);

    const isLoading = isGoogleLoading || isAppleLoading;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <PandaLogo width={100} height={100} color={Colors.primary} />
                </View>

                <Text style={styles.title}>Sign in to MIMO</Text>
                <Text style={styles.subtitle}>
                    Continue with your account to{'\n'}
                    start chatting with friends and family
                </Text>

                {/* Social Sign In Buttons */}
                <View style={styles.buttonContainer}>
                    {/* Google Sign In Button */}
                    <TouchableOpacity
                        style={[styles.socialButton, styles.googleButton, isLoading && styles.buttonDisabled]}
                        onPress={handleGoogleSignIn}
                        activeOpacity={0.8}
                        disabled={isLoading}
                    >
                        {isGoogleLoading ? (
                            <ActivityIndicator color="#000000" size="small" />
                        ) : (
                            <>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.googleIcon}>G</Text>
                                </View>
                                <Text style={styles.googleButtonText}>Continue with Google</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Apple Sign In Button - Show on iOS or as option */}
                    <TouchableOpacity
                        style={[styles.socialButton, styles.appleButton, isLoading && styles.buttonDisabled]}
                        onPress={handleAppleSignIn}
                        activeOpacity={0.8}
                        disabled={isLoading}
                    >
                        {isAppleLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.appleIcon}></Text>
                                </View>
                                <Text style={styles.appleButtonText}>Continue with Apple</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        {"🔒 Secure authentication"}
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.termsText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {'\n'}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.lg,
        paddingTop: 50,
        paddingBottom: Sizes.spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 32,
        color: '#FFFFFF',
        marginTop: -4,
    },
    content: {
        flex: 1,
        paddingHorizontal: Sizes.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 32,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatBubble: {
        width: 32,
        height: 26,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        borderBottomLeftRadius: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: Fonts.weight.bold,
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: Fonts.size.md,
        color: Colors.text.secondary.dark,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        width: '100%',
        gap: 12,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
    },
    appleButton: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#333333',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleIcon: {
        fontSize: 18,
        fontWeight: Fonts.weight.bold,
        color: '#4285F4',
    },
    appleIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    googleButtonText: {
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.semibold,
        color: '#000000',
    },
    appleButtonText: {
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.semibold,
        color: '#FFFFFF',
    },
    infoContainer: {
        marginTop: 24,
    },
    infoText: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.dark,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: Sizes.spacing.xl,
        paddingBottom: 30,
        alignItems: 'center',
    },
    termsText: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.dark,
        textAlign: 'center',
        lineHeight: 20,
    },
    termsLink: {
        color: Colors.primary,
    },
});
