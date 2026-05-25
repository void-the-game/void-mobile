import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { PlayerInfo } from '@/types/multiplayer.types';
import { CardBack } from './CardBack';

interface OpponentAreaProps {
  opponent: PlayerInfo | undefined;
  isOpponentTurn: boolean;
}

const FAN_ANGLE_STEP = 5; // graus — leque mais suave
const FAN_CARD_WIDTH = 52;
// Espaçamento horizontal entre CardBacks
const getFanHorizontalStep = (count: number) =>
  Math.max(16, Math.min(FAN_CARD_WIDTH * 0.8, 160 / Math.max(count - 1, 1)));

export function OpponentArea({ opponent, isOpponentTurn }: OpponentAreaProps) {
  const { fonts } = useTheme();

  if (!opponent) return null;

  const cardsCount: number =
    (opponent.hand as any)?.count ?? (opponent.hand as any)?.length ?? 0;

  const visibleCount = Math.min(cardsCount, 7);

  return (
    <View style={styles.container}>
      {/* Avatar + info row */}
      <View style={styles.infoRow}>
        <View style={styles.avatarWrapper}>
          <View
            style={[
              styles.avatarContainer,
              isOpponentTurn && styles.avatarTurnGlow,
            ]}
          >
            {opponent.avatar ? (
              <Image
                source={{ uri: opponent.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <AstronautIcon
                color="#3B82F6"
                armColor="#093075"
                armStrokeColor="#3B82F6"
                size={36}
              />
            )}
          </View>
          {opponent.isEliminated && (
            <View style={styles.eliminatedBadge}>
              <Text style={styles.eliminatedText}>Eliminado</Text>
            </View>
          )}
        </View>
        <View style={styles.nameColumn}>
          <Text
            style={[styles.opponentName, { fontFamily: fonts.family.aldrich }]}
            numberOfLines={1}
          >
            {opponent.name}
          </Text>
          <Text
            style={[styles.cardCount, { fontFamily: fonts.family.aldrich }]}
          >
            {cardsCount} cartas
          </Text>
        </View>
      </View>

      {/* Fan layout of CardBacks */}
      {visibleCount > 0 && (
        <View style={styles.fanContainer}>
          {Array.from({ length: visibleCount }, (_, i) => {
            const rotation = (i - (visibleCount - 1) / 2) * FAN_ANGLE_STEP;
            const offsetX =
              (i - (visibleCount - 1) / 2) * getFanHorizontalStep(visibleCount);
            return (
              <CardBack
                key={i}
                rotation={rotation}
                offsetX={offsetX}
                style={styles.fanCard}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '32%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59,130,246,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // borderWidth fixo para não causar layout shift ao alternar o glow
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarTurnGlow: {
    borderColor: '#3B82F6',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  eliminatedBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  eliminatedText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700',
  },
  nameColumn: {
    alignItems: 'flex-start',
    gap: 2,
  },
  opponentName: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  cardCount: {
    fontSize: 11,
    color: '#94A3B8',
  },
  fanContainer: {
    height: 90,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fanCard: {
    position: 'absolute',
  },
});
