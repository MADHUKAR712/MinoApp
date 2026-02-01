/**
 * SplashScreen - App entry point with real auth check
 * Shows loading animation while checking auth state
 * Redirects to Home (authenticated) or Welcome (not authenticated)
 */
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { useAuth } from '../../../context/AuthContext';
import PandaLogo from '../../../components/PandaLogo';

const { width } = Dimensions.get('window');
const SPLASH_DURATION = 2500; // Minimum splash time for branding

export default function SplashScreen() {
    const { isAuthenticated, isLoading } = useAuth();
    const [authChecked, setAuthChecked] = useState(false);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Progress bar animation - reflects actual loading
    useEffect(() => {
        const animation = Animated.timing(progressAnim, {
            toValue: 1,
            duration: SPLASH_DURATION,
            useNativeDriver: false,
        });

        animation.start(() => {
            setAuthChecked(true);
        });

        return () => animation.stop();
    }, [progressAnim]);

    // Navigate after auth check + animation complete
    useEffect(() => {
        if (authChecked && !isLoading) {
            // Fade out before navigation
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                if (isAuthenticated) {
                    // User is logged in → go to main app
                    router.replace('/(tabs)/chats');
                } else {
                    // User not logged in → go to welcome (Google Sign-In)
                    router.replace('/screens/auth/WelcomeScreen');
                }
            });
        }
    }, [authChecked, isLoading, isAuthenticated, fadeAnim]);

    // Calculate loading status text
    const getLoadingText = () => {
        if (isLoading) return 'Checking session...';
        if (!authChecked) return 'Starting up...';
        if (isAuthenticated) return 'Welcome back!';
        return 'Ready!';
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

            {/* Logo */}
            <View style={styles.logoContainer}>
                <PandaLogo width={120} height={120} color={Colors.primary} />

                <Text style={styles.appName}>MIMO</Text>
                <Text style={styles.tagline}>CONNECT. CHAT. SHARE.</Text>
            </View>

            {/* Loader Section - Real progress */}
            <View style={styles.loaderSection}>
                <Text style={styles.loadingText}>{getLoadingText()}</Text>
                <View style={styles.progressContainer}>
                    <Animated.View
                        style={[styles.progressBar, { width: progressWidth }]}
                    />
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.fromText}>FROM</Text>
                <Text style={styles.companyName}>∞ INFINITELABS</Text>
            </View>
        </Animated.View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    chatIcon: {
        width: 50,
        height: 40,
    },
    chatBubble: {
        width: 40,
        height: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderBottomLeftRadius: 4,
    },
    appName: {
        fontSize: 36,
        fontWeight: Fonts.weight.bold,
        color: '#FFFFFF',
        letterSpacing: 4,
        marginBottom: 8,
    },
    tagline: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.dark,
        letterSpacing: 2,
    },
    loaderSection: {
        position: 'absolute',
        bottom: 140,
        alignItems: 'center',
        width: width * 0.6,
    },
    loadingText: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.dark,
        marginBottom: 12,
    },
    progressContainer: {
        width: '100%',
        height: 3,
        backgroundColor: Colors.surface.dark,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    fromText: {
        fontSize: Fonts.size.xs,
        color: Colors.text.secondary.dark,
        letterSpacing: 1,
        marginBottom: 4,
    },
    companyName: {
        fontSize: Fonts.size.sm,
        color: Colors.primary,
        letterSpacing: 1,
    },
});
