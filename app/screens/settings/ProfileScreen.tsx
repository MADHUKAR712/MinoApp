import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { Fonts } from '../../../constants/Fonts';
import { Sizes } from '../../../constants/Sizes';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.cameraButton}>
                        <Ionicons name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Info Fields */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.item}>
                        <View style={styles.itemIcon}>
                            <Ionicons name="person" size={20} color={Colors.text.secondary.light} />
                        </View>
                        <View style={styles.itemContent}>
                            <Text style={styles.label}>Name</Text>
                            <Text style={styles.value}>{user?.displayName || 'Set your name'}</Text>
                        </View>
                        <Ionicons name="pencil" size={20} color={Colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <View style={styles.itemIcon}>
                            <Ionicons name="information-circle" size={20} color={Colors.text.secondary.light} />
                        </View>
                        <View style={styles.itemContent}>
                            <Text style={styles.label}>About</Text>
                            <Text style={styles.value}>{user?.about || 'Available'}</Text>
                        </View>
                        <Ionicons name="pencil" size={20} color={Colors.primary} />
                    </TouchableOpacity>

                    <View style={styles.item}>
                        <View style={styles.itemIcon}>
                            <Ionicons name="call" size={20} color={Colors.text.secondary.light} />
                        </View>
                        <View style={styles.itemContent}>
                            <Text style={styles.label}>Phone</Text>
                            <Text style={styles.value}>{user?.email || 'No email'}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.helperText}>
                    This is not your username or pin. This name will be visible to your contacts.
                </Text>
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
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.spacing.md,
        marginTop: 40,
    },
    backButton: {
        marginRight: Sizes.spacing.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: Fonts.weight.bold,
        color: '#fff',
    },
    content: {
        padding: Sizes.spacing.xl,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: Sizes.spacing.xl,
        position: 'relative',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: Colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.background.dark,
    },
    section: {
        marginTop: Sizes.spacing.lg,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.spacing.xl,
    },
    itemIcon: {
        marginRight: Sizes.spacing.lg,
        marginTop: 4,
    },
    itemContent: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: Colors.text.secondary.dark,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    helperText: {
        fontSize: 12,
        color: Colors.text.secondary.dark,
        textAlign: 'center',
        marginTop: Sizes.spacing.xl,
    },
});
