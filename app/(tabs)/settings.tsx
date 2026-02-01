import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PandaLogo from '../../components/PandaLogo';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Sizes } from '../../constants/Sizes';
import { useAuth } from '../../context/AuthContext';

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
}

const SettingItem = ({ icon, title, subtitle, onPress }: SettingItemProps) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={styles.itemIconContainer}>
            {icon}
        </View>
        <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{title}</Text>
            {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/screens/auth/GoogleLoginScreen');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>
                <Ionicons name="search" size={24} color={Colors.text.primary.dark} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/screens/settings/ProfileScreen')}>
                    <Image
                        source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName} numberOfLines={1}>{user?.displayName || 'User'}</Text>
                        <Text style={styles.profileStatus} numberOfLines={1}>{user?.about || 'Available'}</Text>
                    </View>
                    <View style={styles.profileActions}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="qr-code-outline" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="add-circle-outline" size={28} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Settings Items */}
                <SettingItem
                    icon={<Ionicons name="key-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Account"
                    subtitle="Security notifications, change number"
                    onPress={() => router.push('/screens/settings/ProfileScreen')}
                />

                <SettingItem
                    icon={<Ionicons name="lock-closed-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Privacy"
                    subtitle="Block contacts, disappearing messages"
                    onPress={() => router.push('/screens/settings/PrivacyScreen')}
                />

                <SettingItem
                    icon={<Ionicons name="person-circle-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Avatar"
                    subtitle="Create, edit, profile photo"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="list-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Lists"
                    subtitle="Manage people and groups"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="chatbubbles-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Chats"
                    subtitle="Theme, wallpapers, chat history"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="megaphone-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Broadcasts"
                    subtitle="Manage lists and send broadcasts"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="notifications-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Notifications"
                    subtitle="Message, group & call tones"
                    onPress={() => router.push('/screens/settings/NotificationsScreen')}
                />

                <SettingItem
                    icon={<Ionicons name="server-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Storage and data"
                    subtitle="Network usage, auto-download"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="accessibility-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Accessibility"
                    subtitle="Increase contrast, animation"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="globe-outline" size={24} color={Colors.text.secondary.light} />}
                    title="App language"
                    subtitle="English (device's language)"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="help-circle-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Help and feedback"
                    subtitle="Help centre, contact us, privacy policy"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="people-outline" size={24} color={Colors.text.secondary.light} />}
                    title="Invite a friend"
                    onPress={() => { }}
                />

                <SettingItem
                    icon={<Ionicons name="shield-checkmark-outline" size={24} color={Colors.text.secondary.light} />}
                    title="App updates"
                    onPress={() => { }}
                />

                {/* Sign Out (Custom Item) */}
                <SettingItem
                    icon={<Ionicons name="log-out-outline" size={24} color={Colors.critical} />}
                    title="Sign Out"
                    subtitle="Log out from this device"
                    onPress={handleLogout}
                />


                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>from</Text>
                    <View style={styles.metaContainer}>
                        <PandaLogo width={20} height={20} color={Colors.text.primary.dark} />
                        <Text style={[styles.brandText, { marginLeft: 6 }]}>MIMO</Text>
                    </View>
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.spacing.lg,
        paddingTop: 50,
        paddingBottom: Sizes.spacing.sm,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: Fonts.weight.bold,
        color: Colors.text.primary.dark,
        fontFamily: 'System',
    },
    scrollContent: {
        paddingTop: Sizes.spacing.sm,
        paddingBottom: 40,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.spacing.lg,
    },
    avatar: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        marginRight: Sizes.spacing.lg,
    },
    profileInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    profileName: {
        fontSize: 20,
        fontWeight: '500', // Semi-bold but not too heavy
        color: Colors.text.primary.dark,
        marginBottom: 4,
    },
    profileStatus: {
        fontSize: 14,
        color: Colors.text.secondary.dark,
    },
    profileActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.divider.dark,
        marginVertical: Sizes.spacing.sm,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18, // More breathing room
        paddingHorizontal: Sizes.spacing.xl,
    },
    itemIconContainer: {
        width: 30,
        alignItems: 'center',
        marginRight: 24, // Matches WhatsApp spacing
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        color: Colors.text.primary.dark,
        marginBottom: 2,
    },
    itemSubtitle: {
        fontSize: 14,
        color: Colors.text.secondary.dark,
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 12,
        color: Colors.text.secondary.dark,
        opacity: 0.7,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    brandText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.text.primary.dark,
        letterSpacing: 0.5,
    },
});
