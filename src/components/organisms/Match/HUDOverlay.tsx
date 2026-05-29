import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/types/multiplayer.types';

export interface HUDOverlayProps {
  isMyTurn: boolean;
  selectedCard: Card | null;
  onConfirmPlay: () => void;
  /** Progresso do timer: 1.0 = início, 0.0 = expirado. Undefined = sem timer */
  timerProgress?: number;
}

export function HUDOverlay({
  isMyTurn,
  selectedCard,
  onConfirmPlay,
  timerProgress,
}: HUDOverlayProps) {
  const { fonts } = useTheme();

  const isPlayEnabled = isMyTurn && selectedCard !== null;

  // Cor da barra: verde → amarelo → vermelho conforme o tempo passa
  const timerColor =
    timerProgress === undefined
      ? '#10B981'
      : timerProgress > 0.5
        ? '#10B981'
        : timerProgress > 0.25
          ? '#F59E0B'
          : '#EF4444';

  const showTimer = isMyTurn && timerProgress !== undefined;

  return (
    <View style={styles.overlay}>
      {/* TurnIndicator badge + timer — top-right */}
      <View style={[styles.turnBadgeWrapper, { pointerEvents: 'auto' }]}>
        <View
          style={[
            styles.turnBadge,
            {
              backgroundColor: isMyTurn
                ? 'rgba(16,185,129,0.15)'
                : 'rgba(239,68,68,0.1)',
              borderColor: isMyTurn ? '#10B981' : '#EF4444',
            },
          ]}
        >
          <Feather
            name={isMyTurn ? 'zap' : 'clock'}
            size={14}
            color={isMyTurn ? '#10B981' : '#EF4444'}
          />
          <Text
            style={[
              styles.turnBadgeText,
              {
                fontFamily: fonts.family.aldrich,
                color: isMyTurn ? '#10B981' : '#EF4444',
              },
            ]}
          >
            {isMyTurn ? 'Seu Turno' : 'Aguardando'}
          </Text>
        </View>

        {/* Barra de progresso do timer — só visível no turno do jogador */}
        {showTimer && (
          <View style={styles.timerBarTrack}>
            <View
              style={[
                styles.timerBarFill,
                {
                  width: `${(timerProgress ?? 1) * 100}%`,
                  backgroundColor: timerColor,
                },
              ]}
            />
          </View>
        )}
      </View>

      {/* PlayButton — bottom-right */}
      <Pressable
        testID="play-button"
        style={[
          styles.playButton,
          {
            pointerEvents: 'auto',
            backgroundColor: isPlayEnabled
              ? 'rgba(59,130,246,0.9)'
              : 'rgba(31,41,55,0.5)',
          },
        ]}
        onPress={onConfirmPlay}
        disabled={!isPlayEnabled}
      >
        <Feather
          name="play"
          size={24}
          color={isPlayEnabled ? 'white' : '#4B5563'}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  turnBadgeWrapper: {
    position: 'absolute',
    top: 8,
    right: 24,
    alignItems: 'stretch',
    gap: 4,
  },
  turnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  turnBadgeText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  timerBarTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  playButton: {
    position: 'absolute',
    bottom: 16,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
