import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
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
  drawAnimationKey?: string | number;
  discardAnimationKey?: string | number;
  discardPreviewCard?: Card | null;
}

const DISCARD_CARD_WIDTH = 72;
const DISCARD_CARD_HEIGHT = 104;

const DECK_CARD_WIDTH = 64;
const DECK_CARD_HEIGHT = 92;

export function TableArea({
  discardPile,
  deckRemaining,
  onDrawCard,
  drawAnimationKey,
  discardAnimationKey,
  discardPreviewCard,
}: TableAreaProps) {
  const { fonts } = useTheme();

  const topCard =
    discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  const prevDeckRef = useRef(deckRemaining);
  const prevTopCardIdRef = useRef<string | number | undefined>(topCard?.id);

  const deckScale = useRef(new Animated.Value(1)).current;
  const deckRotate = useRef(new Animated.Value(0)).current;
  const deckLift = useRef(new Animated.Value(0)).current;

  const discardScale = useRef(new Animated.Value(0.92)).current;
  const discardTranslateY = useRef(new Animated.Value(10)).current;
  const discardOpacity = useRef(new Animated.Value(topCard ? 1 : 0.65)).current;
  const discardGlow = useRef(new Animated.Value(0.08)).current;

  const drawGhostX = useRef(new Animated.Value(0)).current;
  const drawGhostY = useRef(new Animated.Value(0)).current;
  const drawGhostScale = useRef(new Animated.Value(0.88)).current;
  const drawGhostOpacity = useRef(new Animated.Value(0)).current;
  const drawGhostRotate = useRef(new Animated.Value(0)).current;
  const prevDrawAnimationKeyRef = useRef<string | number | undefined>(
    drawAnimationKey,
  );
  const [showDrawGhost, setShowDrawGhost] = useState(false);

  const discardGhostX = useRef(new Animated.Value(0)).current;
  const discardGhostY = useRef(new Animated.Value(0)).current;
  const discardGhostScale = useRef(new Animated.Value(1)).current;
  const discardGhostOpacity = useRef(new Animated.Value(0)).current;
  const discardGhostRotate = useRef(new Animated.Value(0)).current;
  const prevDiscardAnimationKeyRef = useRef<string | number | undefined>(
    discardAnimationKey,
  );
  const [showDiscardGhost, setShowDiscardGhost] = useState(false);

  useEffect(() => {
    if (deckRemaining !== prevDeckRef.current) {
      prevDeckRef.current = deckRemaining;

      deckRotate.setValue(0);
      deckScale.setValue(0.96);
      deckLift.setValue(-3);

      Animated.parallel([
        Animated.spring(deckScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 4,
          tension: 150,
        }),
        Animated.sequence([
          Animated.timing(deckRotate, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(deckRotate, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(deckLift, {
          toValue: 0,
          useNativeDriver: true,
          friction: 5,
          tension: 120,
        }),
      ]).start();
    }
  }, [deckRemaining, deckRotate, deckScale, deckLift]);

  useEffect(() => {
    if (topCard?.id !== prevTopCardIdRef.current) {
      prevTopCardIdRef.current = topCard?.id;

      discardScale.setValue(0.86);
      discardTranslateY.setValue(12);
      discardOpacity.setValue(0.2);
      discardGlow.setValue(0.18);

      Animated.parallel([
        Animated.spring(discardScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 120,
        }),
        Animated.timing(discardTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(discardOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(discardGlow, {
            toValue: 0.22,
            duration: 120,
            useNativeDriver: false,
          }),
          Animated.timing(discardGlow, {
            toValue: 0.08,
            duration: 220,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
  }, [
    topCard?.id,
    discardScale,
    discardTranslateY,
    discardOpacity,
    discardGlow,
  ]);

  useEffect(() => {
    if (
      drawAnimationKey !== undefined &&
      drawAnimationKey !== prevDrawAnimationKeyRef.current
    ) {
      prevDrawAnimationKeyRef.current = drawAnimationKey;
      setShowDrawGhost(true);

      drawGhostX.setValue(0);
      drawGhostY.setValue(0);
      drawGhostScale.setValue(0.86);
      drawGhostOpacity.setValue(0);
      drawGhostRotate.setValue(0);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(drawGhostOpacity, {
            toValue: 1,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(drawGhostOpacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(drawGhostOpacity, {
            toValue: 0,
            duration: 140,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(drawGhostX, {
          toValue: 92,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(drawGhostY, {
          toValue: 122,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.spring(drawGhostScale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
            tension: 140,
          }),
          Animated.timing(drawGhostScale, {
            toValue: 0.94,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(drawGhostRotate, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowDrawGhost(false);
      });
    }
  }, [
    drawAnimationKey,
    drawGhostOpacity,
    drawGhostRotate,
    drawGhostScale,
    drawGhostX,
    drawGhostY,
  ]);

  useEffect(() => {
    if (
      discardAnimationKey !== undefined &&
      discardAnimationKey !== prevDiscardAnimationKeyRef.current &&
      discardPreviewCard
    ) {
      prevDiscardAnimationKeyRef.current = discardAnimationKey;
      setShowDiscardGhost(true);

      discardGhostX.setValue(-42);
      discardGhostY.setValue(118);
      discardGhostScale.setValue(0.94);
      discardGhostOpacity.setValue(0);
      discardGhostRotate.setValue(0);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(discardGhostOpacity, {
            toValue: 1,
            duration: 70,
            useNativeDriver: true,
          }),
          Animated.timing(discardGhostOpacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(discardGhostOpacity, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(discardGhostX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(discardGhostY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(discardGhostScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 130,
        }),
        Animated.timing(discardGhostRotate, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowDiscardGhost(false);
      });
    }
  }, [
    discardAnimationKey,
    discardPreviewCard,
    discardGhostOpacity,
    discardGhostRotate,
    discardGhostScale,
    discardGhostX,
    discardGhostY,
  ]);

  const deckRotation = deckRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-4deg'],
  });

  const drawGhostRotation = drawGhostRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '12deg'],
  });

  const discardGhostRotation = discardGhostRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  const animatedGlowStyle = useMemo(
    () => ({
      opacity: discardGlow,
    }),
    [discardGlow],
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardsRow}>
        <View style={styles.deckWrapper}>
          <Pressable
            onPress={onDrawCard}
            disabled={!onDrawCard}
            style={({ pressed }) => [
              styles.deckPressable,
              pressed && onDrawCard ? styles.deckPressed : null,
            ]}
          >
            <Animated.View
              style={[
                styles.deckPile,
                {
                  transform: [
                    { translateY: deckLift },
                    { scale: deckScale },
                    { rotate: deckRotation },
                  ],
                },
              ]}
            >
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
            </Animated.View>
          </Pressable>

          <Text style={[styles.deckText, { fontFamily: fonts.family.aldrich }]}>
            {deckRemaining}
          </Text>
        </View>

        <View style={styles.discardWrapper}>
          {topCard ? (
            <Animated.View
              style={[
                styles.topCard,
                {
                  borderColor: topCard.color,
                  shadowColor: topCard.color,
                  opacity: discardOpacity,
                  transform: [
                    { scale: discardScale },
                    { translateY: discardTranslateY },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.cardGlow,
                  { backgroundColor: topCard.color },
                  animatedGlowStyle,
                ]}
              />

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
            </Animated.View>
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

      {showDrawGhost && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.drawGhost,
            {
              opacity: drawGhostOpacity,
              transform: [
                { translateX: drawGhostX },
                { translateY: drawGhostY },
                { scale: drawGhostScale },
                { rotate: drawGhostRotation },
              ],
            },
          ]}
        >
          <CardBack
            rotation={0}
            width={DECK_CARD_WIDTH}
            height={DECK_CARD_HEIGHT}
          />
        </Animated.View>
      )}

      {showDiscardGhost && discardPreviewCard && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.discardGhost,
            {
              opacity: discardGhostOpacity,
              transform: [
                { translateX: discardGhostX },
                { translateY: discardGhostY },
                { scale: discardGhostScale },
                { rotate: discardGhostRotation },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.topCard,
              styles.ghostCardFace,
              {
                borderColor: discardPreviewCard.color,
                shadowColor: discardPreviewCard.color,
              },
            ]}
          >
            <View
              style={[
                styles.cardGlow,
                { backgroundColor: discardPreviewCard.color, opacity: 0.12 },
              ]}
            />
            <View
              style={[
                styles.cardBar,
                { backgroundColor: discardPreviewCard.color },
              ]}
            />
            <View style={styles.iconWrap}>
              <CardIcon
                iconName={getCardIconName(discardPreviewCard.type)}
                color={discardPreviewCard.color}
                textColor={getCardTextColor(discardPreviewCard.color)}
                size={52}
              />
            </View>
            <Text
              style={[styles.cardText, { fontFamily: fonts.family.aldrich }]}
            >
              {translateCard(discardPreviewCard.type)}
            </Text>
          </View>
        </Animated.View>
      )}
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
    opacity: 0.92,
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
    zIndex: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  ghostCardFace: {
    zIndex: 50,
  },

  cardGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 999,
    opacity: 0.08,
    top: -20,
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

  drawGhost: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 40,
  },

  discardGhost: {
    position: 'absolute',
    left: 86,
    top: 0,
    zIndex: 45,
  },
});
