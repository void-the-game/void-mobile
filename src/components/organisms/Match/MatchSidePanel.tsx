import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/types/multiplayer.types';
import { translateCard } from '@/utils/cardTranslations';

export interface MatchSidePanelProps {
  isMyTurn: boolean;
  selectedCard: Card | null;
  onConfirmPlay: () => void;
}

export function MatchSidePanel({
  isMyTurn,
  selectedCard,
  onConfirmPlay,
}: MatchSidePanelProps) {
  const { fonts } = useTheme();

  return (
    <View
      style={[
        styles.sidePanel,
        {
          borderLeftColor: 'rgba(59,130,246,0.15)',
          backgroundColor: 'rgba(0,0,0,0.35)',
        },
      ]}
    >
      {/* Indicador de turno */}
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

      {/* Carta selecionada */}
      {selectedCard ? (
        <View
          style={[styles.selectedInfo, { borderColor: selectedCard.color }]}
        >
          <View
            style={[
              styles.selectedColorDot,
              { backgroundColor: selectedCard.color },
            ]}
          />
          <Text
            style={[styles.selectedText, { fontFamily: fonts.family.aldrich }]}
            numberOfLines={2}
          >
            {translateCard(selectedCard.type)}
          </Text>
        </View>
      ) : null}

      {/* Botão Jogar Carta */}
      <Pressable
        style={[
          styles.actionBtn,
          styles.primaryBtn,
          (!isMyTurn || !selectedCard) && styles.disabledBtn,
        ]}
        onPress={onConfirmPlay}
        disabled={!isMyTurn || !selectedCard}
      >
        <Feather
          name="play"
          size={15}
          color={!isMyTurn || !selectedCard ? '#4B5563' : 'white'}
        />
        <Text
          style={[
            styles.actionBtnText,
            {
              fontFamily: fonts.family.aldrich,
              color: !isMyTurn || !selectedCard ? '#4B5563' : 'white',
            },
          ]}
        >
          Jogar Carta
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidePanel: {
    width: 110,
    borderLeftWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
  },
  turnBadge: {
    width: '100%',
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 4,
  },
  turnBadgeText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  selectedInfo: {
    width: '100%',
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    padding: 6,
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  selectedColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderCurve: 'continuous',
  },
  selectedText: {
    color: '#E2E8F0',
    fontSize: 9,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  actionBtn: {
    width: '100%',
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingVertical: 10,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
  },
  primaryBtn: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.5)',
  },
  disabledBtn: {
    backgroundColor: 'rgba(31,41,55,0.3)',
    borderColor: 'rgba(55,65,81,0.3)',
  },
  actionBtnText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
