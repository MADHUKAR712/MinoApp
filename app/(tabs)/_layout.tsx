/**
 * Tabs Layout - Bottom Tab Navigation
 * Authenticated user main navigation
 */
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';

type TabIconName = 'chatbubbles' | 'disc' | 'call' | 'settings';

export default function TabsLayout() {
    const { isDark } = useTheme();

    const getTabBarIcon = (name: TabIconName) => {
        return ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
            <Ionicons
                name={focused ? name : `${name}-outline`}
                size={size}
                color={color}
            />
        );
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.tabBar.active,
                tabBarInactiveTintColor: Colors.tabBar.inactive,
                tabBarStyle: {
                    backgroundColor: isDark ? Colors.background.dark : Colors.background.light,
                    borderTopColor: isDark ? Colors.border.dark : Colors.border.light,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="chats"
                options={{
                    title: 'Chats',
                    tabBarIcon: getTabBarIcon('chatbubbles'),
                }}
            />
            <Tabs.Screen
                name="status"
                options={{
                    title: 'Status',
                    tabBarIcon: getTabBarIcon('disc'),
                }}
            />
            <Tabs.Screen
                name="calls"
                options={{
                    title: 'Calls',
                    tabBarIcon: getTabBarIcon('call'),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: getTabBarIcon('settings'),
                }}
            />
        </Tabs>
    );
}
