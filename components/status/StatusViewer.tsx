import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';

const { width, height } = Dimensions.get('window');

interface StatusViewerProps {
    imageUri: string;
    username: string;
    timestamp: string;
    onClose: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

export function StatusViewer({
    imageUri,
    username,
    timestamp,
    onClose,
    onNext,
    onPrevious,
}: StatusViewerProps) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                </View>
            </View>

            <View style={styles.navigation}>
                <TouchableOpacity style={styles.navArea} onPress={onPrevious} />
                <TouchableOpacity style={styles.navArea} onPress={onNext} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        width,
        height,
    },
    header: {
        position: 'absolute',
        top: 44,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: Fonts.weight.bold,
    },
    userInfo: {
        marginLeft: 12,
    },
    username: {
        fontSize: Fonts.size.md,
        fontWeight: Fonts.weight.semibold,
        color: '#fff',
    },
    timestamp: {
        fontSize: Fonts.size.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    navigation: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
    },
    navArea: {
        flex: 1,
    },
});
