import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/types/multiplayer.types';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { CardIcon } from '@/components/svg/CardIcon';
import {
  translateCard,
  getCardIconName,
  getCardTextColor,
} from '@/utils/cardTranslations';

interface TableAreaProps {
  discardPile: Card[];
  deckRemaining: number;
}

export function TableArea({ discardPile, deckRemaining }: TableAreaProps) {
  const { fonts } = useTheme();

  const topCard =
    discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  return (
    <View style={styles.container}>
      <View style={styles.cardsRow}>
        {/* Deck */}
        <View style={styles.deckWrapper}>
          <View style={styles.deckCard}>
            <AstronautIcon color="#4B5563" size={28} />
          </View>
          <Text style={[styles.deckText, { fontFamily: fonts.family.aldrich }]}>
            {deckRemaining}
          </Text>
        </View>

        {/* Descarte */}
        <View style={styles.discardWrapper}>
          {topCard ? (
            <View
              style={[
                styles.topCard,
                {
                  shadowColor: topCard.color,
                  shadowRadius: 12,
                  elevation: 8,
                  borderColor: topCard.color,
                  borderWidth: 2,
                },
              ]}
            >
              <View
                style={[
                  styles.cardColorBar,
                  { backgroundColor: topCard.color },
                ]}
              />
              {/* Ícone da carta do topo */}
              <View style={styles.topCardIconWrapper}>
                <CardIcon
                  iconName={getCardIconName(topCard.type)}
                  color={topCard.color}
                  textColor={getCardTextColor(topCard.color)}
                  size={52}
                />
              </View>
              <Text
                style={[
                  styles.cardTypeText,
                  { fontFamily: fonts.family.aldrich },
                ]}
              >
                {translateCard(topCard.type)}
              </Text>
            </View>
          ) : (
            <View style={[styles.topCard, styles.emptySlot]}>
              <Text
                style={[styles.emptyText, { fontFamily: fonts.family.aldrich }]}
              >
                Vazio
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  deckWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  deckCard: {
    width: 72,
    height: 104,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  discardWrapper: {
    alignItems: 'center',
  },
  topCard: {
    width: 72,
    height: 104,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(59,130,246,0.08)',
    overflow: 'hidden',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
  },
  emptySlot: {
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  cardColorBar: {
    width: '100%',
    height: 6,
  },
  topCardIconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTypeText: {
    color: '#E2E8F0',
    fontSize: 9,
    textAlign: 'center',
    paddingHorizontal: 4,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  emptyText: {
    color: '#4B5563',
    fontSize: 12,
  },
});
