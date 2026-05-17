import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import { AstronautIcon } from '@/components/svg/svgIcons';

const CARD = {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.22)',
};

export function PlayerHand({
    hand,
    isMyTurn,
    onPlayCard,
}: {
    hand: { id: string; type: string; color: string }[];
    isMyTurn: boolean;
    onPlayCard: (cardId: string) => void;
}) {
    const { fonts } = useTheme();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionLabel, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
                Sua mão ({hand.length} cartas)
            </Text>
            {hand.length === 0 ? (
                <View style={[styles.emptyHand, CARD]}>
                    <AstronautIcon color="#374151" armColor="#1a1a1a" armStrokeColor="#374151" size={44} />
                    <Text style={[{ color: '#4B5563', fontFamily: fonts.family.aldrich, fontSize: 13, marginTop: 10 }]}>
                        Sem cartas na mão
                    </Text>
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                    {hand.map(card => (
                        <TouchableOpacity
                            key={card.id}
                            style={[
                                styles.cardBtn,
                                {
                                    backgroundColor: 'rgba(59,130,246,0.08)',
                                    borderColor: isMyTurn ? 'rgba(59,130,246,0.55)' : 'rgba(59,130,246,0.18)',
                                    opacity: isMyTurn ? 1 : 0.45,
                                },
                            ]}
                            onPress={() => isMyTurn && onPlayCard(card.id)}
                            disabled={!isMyTurn}
                            activeOpacity={0.75}
                        >
                            <View style={[styles.cardColorBar, { backgroundColor: card.color }]} />
                            <Text
                                style={[styles.cardType, { fontFamily: fonts.family.aldrich, color: '#E2E8F0' }]}
                                numberOfLines={2}
                            >
                                {card.type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: { paddingHorizontal: 16, marginBottom: 20 },
    sectionLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
    emptyHand: { alignItems: 'center', paddingVertical: 28, borderRadius: 14, borderWidth: 1 },
    cardBtn: {
        width: 82,
        height: 118,
        borderRadius: 12,
        borderWidth: 1.5,
        overflow: 'hidden',
        alignItems: 'center',
    },
    cardColorBar: { width: '100%', height: 6 },
    cardType: { fontSize: 12, textAlign: 'center', padding: 8, flex: 1 },
});
