/**
 * Root Layout - Expo Router entry point
 * Wraps entire app with Context Providers
 */
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import { ThemeProvider } from '../context/ThemeContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="screens/auth/SplashScreen" />
            <Stack.Screen name="screens/auth/WelcomeScreen" />
            <Stack.Screen name="screens/auth/GoogleLoginScreen" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" />
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
