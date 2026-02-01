import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { Sizes } from '../../../constants/Sizes';

interface Chat {
    id: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    isGroup?: boolean;
    isPinned?: boolean;
    isMuted?: boolean;
    type?: 'text' | 'photo' | 'video' | 'doc';
}

const mockChats: Chat[] = [
    { id: '1', name: 'MCA SEM-3 BOYS B:2024', lastMessage: 'Sarthak: From 1 Feb 2026', time: '12:50 pm', isGroup: true, isPinned: true },
    { id: '2', name: 'Takshil Prajapati', lastMessage: '✓✓ Haa..', time: '8:00 pm', isPinned: true },
    { id: '3', name: 'QalamWebStudio', lastMessage: '✓✓ You: 📄 VyapStock.pptx', time: '6:25 pm', type: 'doc' },
    { id: '4', name: 'Tirupati Sanidhya 🚩PARIVAR', lastMessage: 'Papa: 📷 Photo', time: '5:43 pm', isGroup: true },
    { id: '5', name: '❤️lovely family 😊', lastMessage: 'Dada: https://www.threads.com/@mp...', time: '5:41 pm', isGroup: true, unreadCount: 2 },
    { id: '6', name: 'STARTUP GROUP', lastMessage: 'Takshil: Ha thik hai done 👍', time: '5:24 pm', isGroup: true },
    { id: '7', name: 'Madhukar (You)', lastMessage: 'Message yourself', time: '5:21 pm' },
];

interface ChatsScreenProps {
    onChatPress?: (chatId: string) => void;
    onNewChat?: () => void;
}

const FILTERS = ['All', 'Unread', 'Favourites', 'Groups'];

export default function ChatsScreen({ onChatPress, onNewChat }: ChatsScreenProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const router = useRouter();

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>MIMO</Text>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIconBtn}>
                    <Ionicons name="camera-outline" size={24} color={Colors.text.primary.dark} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconBtn}>
                    <Ionicons name="ellipsis-vertical" size={24} color={Colors.text.primary.dark} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <View style={styles.searchPill}>
                <Ionicons name="search-outline" size={20} color={Colors.text.secondary.dark} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Ask Meta AI or Search"
                    placeholderTextColor={Colors.text.secondary.dark}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
        </View>
    );

    const renderFilters = () => (
        <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
                {FILTERS.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterChip,
                            activeFilter === filter && styles.filterChipActive
                        ]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text style={[
                            styles.filterText,
                            activeFilter === filter && styles.filterTextActive
                        ]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderChatItem = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push({ pathname: '/screens/chat/ChatScreen', params: { id: item.id, name: item.name } })}
            activeOpacity={0.7}
        >
            <View style={styles.avatarContainer}>
                {item.isGroup ? (
                    <View style={styles.avatarGroup}>
                        <Ionicons name="people" size={28} color="#CCCCCC" />
                    </View>
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                    </View>
                )}
            </View>

            <View style={styles.chatContent}>
                <View style={styles.chatRow}>
                    <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.chatTime, item.unreadCount ? styles.chatTimeUnread : undefined]}>
                        {item.time}
                    </Text>
                </View>

                <View style={styles.chatRow}>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>

                    <View style={styles.metaContainer}>
                        {item.isPinned && (
                            <Ionicons name="pin" size={16} color={Colors.text.secondary.dark} style={styles.pinIcon} />
                        )}
                        {item.unreadCount && item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

            {renderHeader()}

            <FlatList
                data={mockChats}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        {renderSearchBar()}
                        {renderFilters()}
                    </>
                }
                showsVerticalScrollIndicator={false}
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={onNewChat} activeOpacity={0.8}>
                <Ionicons name="add-sharp" size={24} color={Colors.text.primary.light} />
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
        paddingTop: 50, // More top padding for status bar
        paddingBottom: Sizes.spacing.sm,
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
    searchContainer: {
        paddingHorizontal: Sizes.spacing.md,
        paddingBottom: Sizes.spacing.sm,
        marginTop: 8,
    },
    searchPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.darkmode, // Lighter than background
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        height: 48,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text.primary.dark,
    },
    filterContainer: {
        marginBottom: 8,
    },
    filterContent: {
        paddingHorizontal: Sizes.spacing.md,
        paddingVertical: 8,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.background.darkmode,
        marginRight: 4,
    },
    filterChipActive: {
        backgroundColor: Colors.background.darkmode,
    },
    filterText: {
        fontSize: 14,
        color: Colors.text.secondary.dark,
        fontWeight: '500',
    },
    filterTextActive: {
        color: Colors.text.primary.dark,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 100,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.lg,
        paddingVertical: 12,
    },
    avatarContainer: {
        marginRight: 14,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.background.darkmode,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarGroup: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.background.darkmode,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary.dark,
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center',
    },
    chatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary.dark,
        flex: 1,
    },
    chatTime: {
        fontSize: 12,
        color: Colors.text.secondary.dark,
    },
    chatTimeUnread: {
        color: Colors.primary,
    },
    chatMessage: {
        fontSize: 14,
        color: Colors.text.secondary.dark,
        flex: 1,
        paddingRight: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pinIcon: {
        transform: [{ rotate: '45deg' }],
    },
    unreadBadge: {
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Colors.background.light,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    unreadText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.text.primary.light,
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
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
});
