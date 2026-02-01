import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PrivacyScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Privacy</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 16,
    },
});
