import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/types/multiplayer.types';
import { AstronautIcon } from '@/components/svg/svgIcons';

interface TableCenterProps {
  discardPile: Card[];
  deckRemaining: number;
}

export function TableCenter({ discardPile, deckRemaining }: TableCenterProps) {
  const { fonts } = useTheme();

  const topCard =
    discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  return (
    <View style={styles.container}>
      {/* Baralho (Deck) */}
      <View style={styles.deckContainer}>
        <View style={styles.deckCard}>
          <AstronautIcon color="#4B5563" size={24} />
        </View>
        <Text style={[styles.deckText, { fontFamily: fonts.family.aldrich }]}>
          Deck: {deckRemaining}
        </Text>
      </View>

      {/* Descarte (Top Card) */}
      <View style={styles.discardContainer}>
        {topCard ? (
          <View
            style={[
              styles.cardSlot,
              { borderColor: topCard.color, borderWidth: 2 },
            ]}
          >
            <View
              style={[styles.cardColorBar, { backgroundColor: topCard.color }]}
            />
            <Text
              style={[styles.cardType, { fontFamily: fonts.family.aldrich }]}
            >
              {topCard.type}
            </Text>
          </View>
        ) : (
          <View style={[styles.cardSlot, styles.emptySlot]}>
            <Text
              style={[styles.emptyText, { fontFamily: fonts.family.aldrich }]}
            >
              Vazio
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginVertical: 16,
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.1)',
  },
  deckContainer: {
    alignItems: 'center',
    gap: 8,
  },
  deckCard: {
    width: 72,
    height: 104,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  discardContainer: {
    alignItems: 'center',
  },
  cardSlot: {
    width: 72,
    height: 104,
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  emptySlot: {
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  cardColorBar: {
    width: '100%',
    height: 6,
  },
  cardType: {
    color: '#E2E8F0',
    fontSize: 11,
    textAlign: 'center',
    padding: 4,
    flex: 1,
    textAlignVertical: 'center',
  },
  emptyText: {
    color: '#4B5563',
    fontSize: 12,
  },
});
