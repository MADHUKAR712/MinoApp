import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Fonts } from '../../constants/Fonts';
import { formatDateSeparator } from '../../utils/formatTime';

interface DateSeparatorProps {
    date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
    return (
        <View style={styles.container}>
            <View style={styles.badge}>
                <Text style={styles.text}>{formatDateSeparator(date)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: Sizes.spacing.md,
    },
    badge: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: Sizes.spacing.md,
        paddingVertical: Sizes.spacing.xs,
        borderRadius: Sizes.radius.md,
    },
    text: {
        fontSize: Fonts.size.xs,
        fontWeight: Fonts.weight.medium,
        color: Colors.text.secondary.light,
        textTransform: 'uppercase',
    },
});
