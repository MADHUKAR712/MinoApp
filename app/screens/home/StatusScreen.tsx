import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { Sizes } from '../../../constants/Sizes';

interface StatusItem {
    id: string;
    name: string;
    time: string;
    isViewed?: boolean;
}

const recentUpdates: StatusItem[] = [
    { id: '1', name: 'Alex Rivera', time: '10 minutes ago' },
    { id: '2', name: 'Jordan Smith', time: '45 minutes ago' },
    { id: '3', name: 'Jamie Chen', time: '1 hour ago' },
];

const viewedUpdates: StatusItem[] = [
    { id: '4', name: 'Marcus Wright', time: 'Yesterday, 11:30 PM', isViewed: true },
];

interface StatusScreenProps {
    onStatusPress?: (statusId: string) => void;
    onAddStatus?: () => void;
}

export default function StatusScreen({ onStatusPress, onAddStatus }: StatusScreenProps) {
    const renderStatusItem = (item: StatusItem, isViewed: boolean = false) => (
        <TouchableOpacity
            key={item.id}
            style={styles.statusItem}
            onPress={() => onStatusPress?.(item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.avatarRing, isViewed && styles.avatarRingViewed]}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
            </View>
            <View style={styles.statusContent}>
                <Text style={styles.statusName}>{item.name}</Text>
                <Text style={styles.statusTime}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Updates</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Ionicons name="search-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Status Heading */}
                <Text style={styles.statusTitle}>Status</Text>
                {/* My Status */}
                <TouchableOpacity style={styles.myStatusItem} onPress={onAddStatus} activeOpacity={0.7}>
                    <View style={styles.myAvatarContainer}>
                        <View style={styles.myAvatar}>
                            <Text style={styles.avatarText}>M</Text>
                        </View>
                        <View style={styles.addButton}>
                            <Text style={styles.addIcon}>+</Text>
                        </View>
                    </View>
                    <View style={styles.statusContent}>
                        <Text style={styles.myStatusName}>My Status</Text>
                        <Text style={styles.statusTime}>Tap to add status update</Text>
                    </View>
                </TouchableOpacity>

                {/* Recent Updates */}
                <Text style={styles.sectionTitle}>RECENT UPDATES</Text>
                {recentUpdates.map(item => renderStatusItem(item))}

                {/* Viewed Updates */}
                <Text style={styles.sectionTitle}>VIEWED UPDATES</Text>
                {viewedUpdates.map(item => renderStatusItem(item, true))}
            </ScrollView>

            {/* FAB - Pencil */}
            <TouchableOpacity style={styles.fabPencil} activeOpacity={0.8}>
                <Ionicons name="pencil-sharp" size={24} color={Colors.text.primary.dark} />
            </TouchableOpacity>

            {/* FAB - Camera */}
            <TouchableOpacity style={styles.fabCamera} onPress={onAddStatus} activeOpacity={0.8}>
                <Ionicons name="camera-sharp" size={24} color={Colors.text.primary.light} />
            </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.lg,
        paddingTop: 50,
        paddingBottom: Sizes.spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: Fonts.weight.bold,
        color: Colors.text.primary.dark,
        fontFamily: 'System',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 16,
    },
    headerIconBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.primary.dark,
        marginBottom: 16,
        marginTop: 8,
    },
    privacyLink: {
        paddingHorizontal: Sizes.spacing.lg,
        paddingVertical: 8,
    },
    privacyText: {
        fontSize: Fonts.size.sm,
        color: Colors.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: Sizes.spacing.lg,
    },
    myStatusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
    },
    myAvatarContainer: {
        position: 'relative',
        marginRight: 14,
    },
    myAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.avatarBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.background.dark,
    },
    addIcon: {
        fontSize: 14,
        color: Colors.text.primary.light,
        fontWeight: Fonts.weight.bold,
    },
    myStatusName: {
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.semibold,
        color: Colors.text.primary.dark,
    },
    sectionTitle: {
        fontSize: Fonts.size.xs,
        fontWeight: Fonts.weight.semibold,
        color: Colors.text.secondary.dark,
        letterSpacing: 1,
        marginTop: 20,
        marginBottom: 12,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    avatarRing: {
        padding: 2,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: Colors.primary,
        marginRight: 14,
    },
    avatarRingViewed: {
        borderColor: Colors.text.secondary.dark,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: Fonts.weight.semibold,
        color: Colors.text.primary.light,
    },
    statusContent: {
        flex: 1,
    },
    statusName: {
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.medium,
        color: Colors.text.primary.dark,
        marginBottom: 2,
    },
    statusTime: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.dark,
    },
    fabPencil: {
        position: 'absolute',
        bottom: 100,
        right: Sizes.spacing.xl,
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: Colors.surface.dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabCamera: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: Colors.background.light,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },

});
