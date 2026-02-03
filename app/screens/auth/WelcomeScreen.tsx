/**
 * WelcomeScreen - Onboarding first screen
 * Shows app intro with navigation to login
 */
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PandaLogo from '../../../components/PandaLogo';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';

const { width } = Dimensions.get('window');

// Onboarding slides data
const SLIDES = [
    {
        id: '1',
        title: 'Welcome to MIMO',
        description: 'A simple, secure, and reliable way to stay\nconnected with your friends and family\naround the world.',
    },
    {
        id: '2',
        title: 'Fast & Secure',
        description: 'End-to-end encryption ensures your\nmessages stay private. Fast delivery\neven on slow networks.',
    },
    {
        id: '3',
        title: 'Free Forever',
        description: 'No hidden costs. No ads. Just pure\ncommunication with the people\nyou care about.',
    },
];

export default function WelcomeScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    const handleGetStarted = () => {
        // Navigate to Google login screen
        router.push('/screens/auth/GoogleLoginScreen' as any);
    };

    const handleNextSlide = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleGetStarted();
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
        <View style={styles.slideContainer}>
            {/* Illustration Card */}
            <View style={styles.illustrationCard}>
                <PandaLogo width={120} height={120} color={Colors.primary} />
            </View>

            {/* Welcome Text */}
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {SLIDES.map((_, index) => {
                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                    ];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });
                    const dotOpacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.4, 1, 0.4],
                        extrapolate: 'clamp',
                    });
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => flatListRef.current?.scrollToIndex({ index })}
                        >
                            <Animated.View
                                style={[
                                    styles.dot,
                                    { width: dotWidth, opacity: dotOpacity },
                                    currentIndex === index && styles.dotActive,
                                ]}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Get Started Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleNextSlide}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>
                    {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                <Text style={styles.buttonArrow}>→</Text>
            </TouchableOpacity>

            {/* Skip Button (only show if not on last slide) */}
            {currentIndex < SLIDES.length - 1 && (
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}

            {/* Terms */}
            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    By tapping &quot;Get Started&quot;, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of{'\n'}Service</Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
        alignItems: 'center',
        paddingTop: 60,
    },
    slideContainer: {
        width: width,
        alignItems: 'center',
        paddingTop: 20,
    },
    illustrationCard: {
        width: width * 0.55,
        aspectRatio: 1,
        backgroundColor: Colors.surface.dark,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
    },
    iconsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.surface.elevated,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleCenter: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.primary,
    },
    userIcon: {
        alignItems: 'center',
    },
    userHead: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
        marginBottom: 2,
    },
    userBody: {
        width: 18,
        height: 10,
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        backgroundColor: Colors.primary,
    },
    chatIconSmall: {
        width: 20,
        height: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderBottomLeftRadius: 2,
    },
    groupIcon: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    groupPerson1: {
        width: 10,
        height: 16,
        backgroundColor: Colors.primary,
        borderRadius: 5,
        marginRight: -4,
    },
    groupPerson2: {
        width: 10,
        height: 14,
        backgroundColor: Colors.primary,
        borderRadius: 5,
        opacity: 0.7,
    },
    connectionLine: {
        width: 80,
        height: 8,
        backgroundColor: Colors.surface.elevated,
        borderRadius: 4,
        marginTop: 16,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: Fonts.weight.bold,
        color: '#FFFFFF',
        marginBottom: 16,
    },
    description: {
        fontSize: Fonts.size.md,
        color: Colors.text.secondary.dark,
        textAlign: 'center',
        lineHeight: 22,
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.surface.elevated,
    },
    dotActive: {
        backgroundColor: '#FFFFFF',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 80,
        borderRadius: 30,
        marginBottom: 12,
        gap: 8,
    },
    buttonText: {
        fontSize: Fonts.size.lg,
        fontWeight: Fonts.weight.semibold,
        color: '#000000',
    },
    buttonArrow: {
        fontSize: Fonts.size.xl,
        color: '#000000',
    },
    skipButton: {
        marginBottom: 16,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    skipText: {
        fontSize: Fonts.size.md,
        color: Colors.text.secondary.dark,
    },
    termsContainer: {
        alignItems: 'center',
    },
    termsText: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.dark,
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: Colors.primary,
    },
});
