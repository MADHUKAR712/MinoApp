import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { Sizes } from '../../../constants/Sizes';

type CallType = 'incoming' | 'outgoing' | 'missed';

interface CallItem {
    id: string;
    name: string;
    type: CallType;
    time: string;
    isVideo?: boolean;
}

const mockCalls: CallItem[] = [
    { id: '1', name: 'Alex Rivera', type: 'incoming', time: '10 mins ago' },
    { id: '2', name: 'Sarah Chen', type: 'missed', time: 'Yesterday' },
    { id: '3', name: 'MIMO Support', type: 'outgoing', time: 'Tuesday', isVideo: true },
    { id: '4', name: 'James Wilson', type: 'incoming', time: 'Sunday', isVideo: true },
    { id: '5', name: 'Elena Kostic', type: 'outgoing', time: 'Last week' },
];

interface CallsScreenProps {
    onCallPress?: (callId: string) => void;
    onNewCall?: () => void;
}

export default function CallsScreen({ onCallPress, onNewCall }: CallsScreenProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'missed'>('all');

    const filteredCalls = activeTab === 'missed'
        ? mockCalls.filter(call => call.type === 'missed')
        : mockCalls;

    const getCallIcon = (type: CallType) => {
        switch (type) {
            case 'incoming': return <Ionicons name="arrow-down-outline" size={16} color={Colors.primary} />;
            case 'outgoing': return <Ionicons name="arrow-up-outline" size={16} color={Colors.primary} />;
            case 'missed': return <Ionicons name="arrow-down-outline" size={16} color={Colors.critical} />;
        }
    };

    const renderCallItem = ({ item }: { item: CallItem }) => (
        <TouchableOpacity
            style={styles.callItem}
            onPress={() => onCallPress?.(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>

            <View style={styles.callContent}>
                <Text style={[styles.callName, item.type === 'missed' && styles.callNameMissed]}>
                    {item.name}
                </Text>
                <View style={styles.callInfo}>
                    <View style={styles.callIconContainer}>
                        {getCallIcon(item.type)}
                    </View>
                    <Text style={styles.callTime}>{item.type}, {item.time}</Text>
                </View>
            </View>

            <View style={styles.callActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons
                        name={item.isVideo ? "videocam-outline" : "call-outline"}
                        size={22}
                        color={Colors.primary}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoButton}>
                    <Ionicons name="information-circle-outline" size={22} color={Colors.primary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Calls</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Ionicons name="search-outline" size={24} color={Colors.text.primary.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Ionicons name="ellipsis-vertical" size={24} color={Colors.text.primary.dark} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tab Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'all' && styles.tabActive]}
                    onPress={() => setActiveTab('all')}
                >
                    <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'missed' && styles.tabActive]}
                    onPress={() => setActiveTab('missed')}
                >
                    <Text style={[styles.tabText, activeTab === 'missed' && styles.tabTextActive]}>Missed</Text>
                </TouchableOpacity>
            </View>

            {/* Call List */}
            <FlatList
                data={filteredCalls}
                renderItem={renderCallItem}
                keyExtractor={item => item.id}
                style={styles.callList}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={onNewCall} activeOpacity={0.8}>
                <Ionicons name="call-outline" size={24} color={Colors.text.primary.light} />
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
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: Sizes.spacing.lg,
        marginBottom: Sizes.spacing.md,
        backgroundColor: Colors.surface.dark,
        borderRadius: 10,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: Colors.input.dark,
    },
    tabText: {
        fontSize: Fonts.size.md,
        color: Colors.text.secondary.dark,
        fontWeight: Fonts.weight.medium,
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    callList: {
        flex: 1,
    },
    callItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.lg,
        paddingVertical: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: Fonts.weight.semibold,
        color: '#000000',
    },
    callContent: {
        flex: 1,
    },
    callName: {
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.medium,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    callNameMissed: {
        color: Colors.error,
    },
    callInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    callIconContainer: {
        marginRight: 6,
    },
    callTime: {
        fontSize: Fonts.size.sm,
        color: Colors.text.secondary.dark,
        textTransform: 'capitalize',
    },
    callActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
});
