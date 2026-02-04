import { Ionicons } from '@expo/vector-icons';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { Sizes } from '../../../constants/Sizes';
import { Profile, supabase } from '../../../lib/supabase';
import { chatService, ChatWithDetails } from '../../../services/chatService';

interface ChatsScreenProps {
    onChatPress?: (chatId: string) => void;
    onNewChat?: () => void;
}

const FILTERS = ['All', 'Unread', 'Favourites', 'Groups'];

export default function ChatsScreen({ onChatPress, onNewChat }: ChatsScreenProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Database chats
    const [chats, setChats] = useState<ChatWithDetails[]>([]);
    const [filteredChats, setFilteredChats] = useState<ChatWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Database user search
    const [searchResults, setSearchResults] = useState<Profile[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Current user for "You" detection
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // FAB menu state
    const [showFabMenu, setShowFabMenu] = useState(false);

    // Subscription ref for cleanup
    const subscriptionRef = useRef<RealtimeChannel | null>(null);

    const router = useRouter();

    // Load chats and subscribe when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            initializeScreen();

            return () => {
                // Cleanup subscription when leaving screen
                if (subscriptionRef.current) {
                    chatService.unsubscribe(subscriptionRef.current);
                }
            };
        }, [])
    );

    const initializeScreen = async () => {
        try {
            setIsLoading(true);

            // Get current user
            const userId = await chatService.getCurrentUserId();
            setCurrentUserId(userId);

            // Update online status
            await chatService.updateOnlineStatus(true);

            // Load chats from database
            await loadChats();

            // Subscribe to new messages for real-time updates
            subscriptionRef.current = chatService.subscribeToAllMessages(handleNewMessage);

            setIsLoading(false);
        } catch (error) {
            console.error('[ChatsScreen] Error initializing:', error);
            setIsLoading(false);
        }
    };

    const loadChats = async () => {
        try {
            const chatList = await chatService.getChatList();
            setChats(chatList);
            applyFilters(chatList, searchQuery, activeFilter);
        } catch (error) {
            console.error('[ChatsScreen] Error loading chats:', error);
        }
    };

    // Handle new message for real-time chat list updates
    const handleNewMessage = useCallback(() => {
        // Reload chats to update last message and unread count
        loadChats();
    }, []);

    const applyFilters = (chatList: ChatWithDetails[], query: string, filter: string) => {
        let result = chatList;

        // Apply search query
        if (query.trim()) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(chat => {
                const displayName = chat.name || chat.other_user?.display_name || '';
                const lastMessage = chat.last_message?.content || '';
                return displayName.toLowerCase().includes(lowerQuery) ||
                    lastMessage.toLowerCase().includes(lowerQuery);
            });
        }

        // Apply filter chips
        switch (filter) {
            case 'Unread':
                result = result.filter(chat => chat.unread_count > 0);
                break;
            case 'Groups':
                result = result.filter(chat => chat.is_group);
                break;
            case 'Favourites':
                // TODO: Add favorites functionality
                result = [];
                break;
        }

        setFilteredChats(result);
    };

    // Search users from Supabase database
    const searchUsersFromDatabase = async (query: string) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
                .limit(10);

            if (error) {
                console.error('[Search] Error searching users:', error);
                setSearchResults([]);
            } else {
                setSearchResults(data || []);
            }
        } catch (err) {
            console.error('[Search] Exception:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        applyFilters(chats, query, activeFilter);

        // Search database when query is 2+ characters
        if (query.length >= 2) {
            searchUsersFromDatabase(query);
        } else {
            setSearchResults([]);
        }
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        applyFilters(chats, searchQuery, filter);
    };

    const handleSearchUser = () => {
        setShowFabMenu(false);
    };

    const handleCreateGroup = () => {
        setShowFabMenu(false);
        router.push('/screens/chat/ChatScreen?isGroup=true');
    };

    const handleUserSelect = (user: Profile) => {
        const isCurrentUser = currentUserId && user.id === currentUserId;
        const displayName = user.display_name || user.email || 'User';
        const nameWithYou = isCurrentUser ? `${displayName} (You)` : displayName;

        // Navigate to chat with this user
        router.push({
            pathname: '/screens/chat/ChatScreen',
            params: { id: user.id, name: nameWithYou }
        });
        // Clear search
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleChatPress = (chat: ChatWithDetails) => {
        const displayName = chat.name || chat.other_user?.display_name || 'Chat';
        const targetUserId = chat.other_user?.id || chat.id;

        router.push({
            pathname: '/screens/chat/ChatScreen',
            params: { id: targetUserId, name: displayName }
        });
    };

    const formatTime = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

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
                    placeholder="Search chats or users..."
                    placeholderTextColor={Colors.text.secondary.dark}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearchChange('')}>
                        <Ionicons name="close-circle" size={20} color={Colors.text.secondary.dark} />
                    </TouchableOpacity>
                )}
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
                        onPress={() => handleFilterChange(filter)}
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

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.text.secondary.dark} />
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptySubtitle}>Search for users to start a conversation</Text>
        </View>
    );

    const renderChatItem = ({ item }: { item: ChatWithDetails }) => {
        const displayName = item.name || item.other_user?.display_name || 'Chat';
        const lastMessage = item.last_message?.content || 'Start a conversation';
        const time = formatTime(item.last_message?.created_at || item.created_at);
        const isUnread = item.unread_count > 0;
        const isSentByMe = item.last_message?.sender_id === currentUserId;

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handleChatPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.avatarContainer}>
                    {item.is_group ? (
                        <View style={styles.avatarGroup}>
                            <Ionicons name="people" size={28} color="#CCCCCC" />
                        </View>
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
                            {item.other_user?.is_online && <View style={styles.onlineIndicator} />}
                        </View>
                    )}
                </View>

                <View style={styles.chatContent}>
                    <View style={styles.chatRow}>
                        <Text style={styles.chatName} numberOfLines={1}>{displayName}</Text>
                        <Text style={[styles.chatTime, isUnread && styles.chatTimeUnread]}>
                            {time}
                        </Text>
                    </View>

                    <View style={styles.chatRow}>
                        <Text style={styles.chatMessage} numberOfLines={1}>
                            {isSentByMe && '✓ '}{lastMessage}
                        </Text>

                        <View style={styles.metaContainer}>
                            {isUnread && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadText}>
                                        {item.unread_count > 99 ? '99+' : item.unread_count}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderUserSearchItem = (user: Profile) => {
        const isCurrentUser = currentUserId && user.id === currentUserId;
        const displayName = user.display_name || 'No name';
        const nameWithYou = isCurrentUser ? `${displayName} (You)` : displayName;

        return (
            <TouchableOpacity
                key={user.id}
                style={styles.chatItem}
                onPress={() => handleUserSelect(user)}
                activeOpacity={0.7}
            >
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {(user.display_name || user.email || 'U').charAt(0).toUpperCase()}
                        </Text>
                        {user.is_online && <View style={styles.onlineIndicator} />}
                    </View>
                </View>

                <View style={styles.chatContent}>
                    <Text style={styles.chatName} numberOfLines={1}>
                        {nameWithYou}
                    </Text>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                        {isCurrentUser ? 'Message yourself' : (user.email || 'Tap to chat')}
                    </Text>
                </View>

                <Ionicons name="chatbubble-outline" size={20} color={Colors.text.secondary.dark} />
            </TouchableOpacity>
        );
    };

    const renderSearchResults = () => {
        if (!searchQuery.trim() || searchQuery.length < 2) return null;

        return (
            <View style={styles.searchResultsContainer}>
                <Text style={styles.searchResultsTitle}>Users</Text>

                {isSearching ? (
                    <View style={styles.searchingContainer}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={styles.searchingText}>Searching...</Text>
                    </View>
                ) : searchResults.length > 0 ? (
                    searchResults.map(user => renderUserSearchItem(user))
                ) : (
                    <Text style={styles.noResultsText}>No users found matching &quot;{searchQuery}&quot;</Text>
                )}
            </View>
        );
    };

    const renderLoadingState = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

            {renderHeader()}

            {isLoading ? (
                renderLoadingState()
            ) : (
                <FlatList
                    data={filteredChats}
                    renderItem={renderChatItem}
                    keyExtractor={item => item.id}
                    style={styles.list}
                    contentContainerStyle={[styles.listContent, filteredChats.length === 0 && !searchQuery && styles.listEmpty]}
                    ListHeaderComponent={
                        <>
                            {renderSearchBar()}
                            {renderFilters()}
                            {renderSearchResults()}
                        </>
                    }
                    ListEmptyComponent={!searchQuery ? renderEmptyState : null}
                    showsVerticalScrollIndicator={false}
                    onRefresh={loadChats}
                    refreshing={false}
                />
            )}

            {/* FAB Menu */}
            {showFabMenu && (
                <>
                    <TouchableWithoutFeedback onPress={() => setShowFabMenu(false)}>
                        <View style={styles.fabMenuOverlay} />
                    </TouchableWithoutFeedback>

                    <View style={styles.fabMenuContainer}>
                        <TouchableOpacity
                            style={styles.fabMenuItem}
                            onPress={handleSearchUser}
                            activeOpacity={0.7}
                        >
                            <View style={styles.fabMenuIconBg}>
                                <Ionicons name="search" size={22} color={Colors.text.primary.dark} />
                            </View>
                            <Text style={styles.fabMenuText}>Search User</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.fabMenuItem}
                            onPress={handleCreateGroup}
                            activeOpacity={0.7}
                        >
                            <View style={styles.fabMenuIconBg}>
                                <Ionicons name="people" size={22} color={Colors.text.primary.dark} />
                            </View>
                            <Text style={styles.fabMenuText}>Create Group</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowFabMenu(!showFabMenu)}
                activeOpacity={0.8}
            >
                <Ionicons
                    name={showFabMenu ? "close" : "add-sharp"}
                    size={24}
                    color={Colors.text.primary.light}
                />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: Colors.text.secondary.dark,
        fontSize: 14,
    },
    searchContainer: {
        paddingHorizontal: Sizes.spacing.md,
        paddingBottom: Sizes.spacing.sm,
        marginTop: 8,
    },
    searchPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.darkmode,
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
        fontWeight: Fonts.weight.medium,
        fontFamily: 'System',
        height: 48,
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
    listEmpty: {
        flexGrow: 1,
    },
    searchResultsContainer: {
        paddingHorizontal: Sizes.spacing.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.dark,
    },
    searchResultsTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.secondary.dark,
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    searchingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    searchingText: {
        marginLeft: 10,
        color: Colors.text.secondary.dark,
        fontSize: 14,
    },
    noResultsText: {
        color: Colors.text.secondary.dark,
        fontSize: 14,
        paddingVertical: 12,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary.dark,
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.text.secondary.dark,
        marginTop: 8,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.lg,
        paddingVertical: 12,
    },
    avatarContainer: {
        marginRight: 14,
        position: 'relative',
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
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: Colors.background.dark,
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
    unreadBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary || Colors.background.light,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        fontSize: 11,
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
    fabMenuOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    fabMenuContainer: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: Colors.surface.elevated,
        borderRadius: 16,
        padding: 8,
        minWidth: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    fabMenuIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background.darkmode,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    fabMenuText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary.dark,
    },
});
