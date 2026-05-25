import React from 'react';
import { View, Pressable, Image, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { CardIcon } from '@/components/svg/CardIcon';
import { Card } from '@/types/multiplayer.types';
import {
  translateCard,
  getCardIconName,
  getCardTextColor,
} from '@/utils/cardTranslations';

// Largura da carta — usada para calcular o offset horizontal do leque
const CARD_WIDTH = 64;

interface PlayerAreaProps {
  hand: Card[];
  isMyTurn: boolean;
  selectedCardId: string | null;
  onSelectCard: (card: Card) => void;
  playerName?: string;
  playerAvatar?: string;
}

export function PlayerArea({
  hand,
  isMyTurn,
  selectedCardId,
  onSelectCard,
  playerName,
  playerAvatar,
}: PlayerAreaProps) {
  const { fonts } = useTheme();

  // Ângulo máximo de 5° para leque mais suave
  const angleStep = Math.min(5, 60 / Math.max(hand.length, 1));
  // Espaçamento horizontal entre cartas: usa o espaço disponível
  // Quanto mais cartas, menor o passo — mínimo de 20px para sempre mostrar borda
  const horizontalStep = Math.max(
    20,
    Math.min(CARD_WIDTH * 0.85, 200 / Math.max(hand.length - 1, 1)),
  );

  return (
    <View style={styles.container}>
      {hand.length === 0 ? (
        <View style={styles.emptyState}>
          <AstronautIcon
            color="#374151"
            armColor="#1a1a1a"
            armStrokeColor="#374151"
            size={36}
          />
          <Text
            style={[styles.emptyText, { fontFamily: fonts.family.aldrich }]}
          >
            Sem cartas na mão
          </Text>
        </View>
      ) : (
        <View style={styles.fanContainer}>
          {/* Renderizar não-selecionadas primeiro, selecionada por último (fica acima) */}
          {[...hand]
            .sort((a, b) => {
              const aSelected = a.id === selectedCardId ? 1 : 0;
              const bSelected = b.id === selectedCardId ? 1 : 0;
              return aSelected - bSelected;
            })
            .map((card) => {
              const i = hand.indexOf(card);
              const isSelected = card.id === selectedCardId;
              const rotation = (i - (hand.length - 1) / 2) * angleStep;
              const arcOffset = Math.abs(i - (hand.length - 1) / 2) * 2;
              const horizontalOffset =
                (i - (hand.length - 1) / 2) * horizontalStep;

              return (
                <Pressable
                  key={card.id}
                  testID={`player-card-${card.id}`}
                  style={[
                    styles.card,
                    {
                      borderColor: isSelected
                        ? card.color
                        : 'rgba(255,255,255,0.15)',
                      backgroundColor: isSelected
                        ? '#1E293B'
                        : 'rgba(15,23,42,0.85)',
                      opacity: !isMyTurn && !isSelected ? 0.4 : 1,
                      transform: isSelected
                        ? [
                            { translateX: horizontalOffset },
                            { translateY: -20 },
                            { rotate: `${rotation}deg` },
                          ]
                        : [
                            { translateX: horizontalOffset },
                            { translateY: arcOffset },
                            { rotate: `${rotation}deg` },
                          ],
                    },
                  ]}
                  onPress={() => onSelectCard(card)}
                >
                  {/* Barra de cor no topo */}
                  <View
                    style={[
                      styles.cardColorBar,
                      { backgroundColor: card.color },
                    ]}
                  />

                  {/* Ícone da carta */}
                  <View style={styles.cardIconWrapper}>
                    <CardIcon
                      iconName={getCardIconName(card.type)}
                      color={card.color}
                      textColor={getCardTextColor(card.color)}
                      size={38}
                    />
                  </View>

                  {/* Nome curto da carta */}
                  <Text
                    style={[
                      styles.cardType,
                      {
                        fontFamily: fonts.family.aldrich,
                        color: isSelected ? '#F8FAFC' : '#CBD5E1',
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {translateCard(card.type)}
                  </Text>

                  {/* Indicador de seleção */}
                  {isSelected && (
                    <View
                      style={[
                        styles.selectedDot,
                        { backgroundColor: card.color },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
        </View>
      )}

      {/* Info do jogador local — canto inferior esquerdo */}
      <View style={styles.playerInfo}>
        <View style={styles.avatarContainer}>
          {playerAvatar ? (
            <Image source={{ uri: playerAvatar }} style={styles.avatarImage} />
          ) : (
            <AstronautIcon
              color="#10B981"
              armColor="#064e3b"
              armStrokeColor="#10B981"
              size={28}
            />
          )}
        </View>
        <View style={styles.playerNameColumn}>
          {playerName ? (
            <Text
              style={[
                styles.playerNameText,
                { fontFamily: fonts.family.aldrich },
              ]}
              numberOfLines={1}
            >
              {playerName}
            </Text>
          ) : null}
          <Text
            style={[styles.cardCountText, { fontFamily: fonts.family.aldrich }]}
          >
            {hand.length} cartas
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '40%',
    width: '100%',
    overflow: 'hidden',
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 8,
  },
  fanContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: 92,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardColorBar: {
    width: '100%',
    height: 5,
  },
  cardIconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  cardType: {
    fontSize: 7,
    textAlign: 'center',
    paddingHorizontal: 3,
    paddingBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  // Info do jogador local
  playerInfo: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(16,185,129,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  playerNameColumn: {
    gap: 1,
  },
  playerNameText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  cardCountText: {
    fontSize: 10,
    color: '#6EE7B7',
  },
});
