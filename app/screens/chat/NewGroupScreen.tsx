import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewGroupScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>New Group</Text>
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
