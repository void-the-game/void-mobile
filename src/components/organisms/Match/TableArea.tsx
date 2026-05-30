import React, { useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import type { Card } from '@/types/multiplayer.types';
import { CardIcon } from '@/components/svg/CardIcon';
import { CardBack } from '@/components/organisms/Match/CardBack';

import {
  translateCard,
  getCardIconName,
  getCardTextColor,
} from '@/utils/cardTranslations';

export interface TableAreaProps {
  discardPile: Card[];
  deckRemaining: number;
  onDrawCard?: () => void;
  deckRef?: React.RefObject<View | null>;
  discardRef?: React.RefObject<View | null>;
}

const DISCARD_CARD_WIDTH = 72;
const DISCARD_CARD_HEIGHT = 104;
const DECK_CARD_WIDTH = 64;
const DECK_CARD_HEIGHT = 92;

export function TableArea({
  discardPile,
  deckRemaining,
  onDrawCard,
  deckRef,
  discardRef,
}: TableAreaProps) {
  const { fonts } = useTheme();

  const topCard =
    discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  const internalDeckRef = useRef<View>(null);
  const internalDiscardRef = useRef<View>(null);
  const activeDeckRef = deckRef ?? internalDeckRef;
  const activeDiscardRef = discardRef ?? internalDiscardRef;

  return (
    <View style={styles.container}>
      <View style={styles.cardsRow}>
        {/* ── DECK ── */}
        <View style={styles.deckWrapper}>
          <Pressable
            onPress={onDrawCard}
            disabled={!onDrawCard}
            style={({ pressed }) => [
              styles.deckPressable,
              pressed && onDrawCard ? styles.deckPressed : null,
            ]}
          >
            <View ref={activeDeckRef as any} style={styles.deckPile}>
              <CardBack
                rotation={-5}
                offsetX={-2}
                width={DECK_CARD_WIDTH}
                height={DECK_CARD_HEIGHT}
                style={styles.backDeckFar}
              />
              <CardBack
                rotation={3}
                offsetX={2}
                width={DECK_CARD_WIDTH}
                height={DECK_CARD_HEIGHT}
                style={styles.backDeckNear}
              />
            </View>
          </Pressable>

          <Text style={[styles.deckText, { fontFamily: fonts.family.aldrich }]}>
            {deckRemaining}
          </Text>
        </View>

        {/* ── PILHA DE DESCARTE ── */}
        <View ref={activeDiscardRef as any} style={styles.discardWrapper}>
          {topCard ? (
            <View
              style={[
                styles.topCard,
                {
                  borderColor: topCard.color,
                  shadowColor: topCard.color,
                },
              ]}
            >
              <View
                style={[styles.cardBar, { backgroundColor: topCard.color }]}
              />
              <View style={styles.iconWrap}>
                <CardIcon
                  iconName={getCardIconName(topCard.type)}
                  color={topCard.color}
                  textColor={getCardTextColor(topCard.color)}
                  size={52}
                />
              </View>
              <Text
                style={[styles.cardText, { fontFamily: fonts.family.aldrich }]}
              >
                {translateCard(topCard.type)}
              </Text>
            </View>
          ) : (
            <View style={[styles.topCard, styles.empty]}>
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

export default TableArea;

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
    gap: 22,
  },
  deckWrapper: {
    width: DECK_CARD_WIDTH,
    height: DECK_CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  deckPressable: {
    width: DECK_CARD_WIDTH + 8,
    height: DECK_CARD_HEIGHT + 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  deckPressed: {
    opacity: 0.85,
  },
  deckPile: {
    width: DECK_CARD_WIDTH + 8,
    height: DECK_CARD_HEIGHT + 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backDeckFar: {
    zIndex: 1,
    opacity: 0.78,
  },
  backDeckNear: {
    zIndex: 2,
    opacity: 0.94,
  },
  deckText: {
    position: 'absolute',
    bottom: -24,
    color: '#9CA3AF',
    fontSize: 12,
  },
  discardWrapper: {
    width: DISCARD_CARD_WIDTH,
    height: DISCARD_CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCard: {
    width: DISCARD_CARD_WIDTH,
    height: DISCARD_CARD_HEIGHT,
    borderRadius: 10,
    backgroundColor: '#0A0A14',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cardBar: {
    width: '100%',
    height: 6,
  },
  iconWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 9,
    color: '#E2E8F0',
    paddingBottom: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingHorizontal: 4,
    letterSpacing: 0.3,
  },
  empty: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#374151',
    backgroundColor: 'transparent',
  },
  emptyText: {
    color: '#4B5563',
    fontSize: 12,
  },
});
