import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { Card } from '@/types/multiplayer.types';
import { translateCard } from '@/utils/cardTranslations';

interface PlayerHandProps {
  hand: Card[];
  isMyTurn: boolean;
  selectedCardId: string | null;
  onSelectCard: (card: Card) => void;
}

export function PlayerHand({
  hand,
  isMyTurn,
  selectedCardId,
  onSelectCard,
}: PlayerHandProps) {
  const { fonts } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionLabel,
          { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
        ]}
      >
        Sua mão ({hand.length} cartas)
      </Text>

      {hand.length === 0 ? (
        <View style={[styles.emptyHand]}>
          <AstronautIcon
            color="#374151"
            armColor="#1a1a1a"
            armStrokeColor="#374151"
            size={36}
          />
          <Text
            style={[
              {
                color: '#4B5563',
                fontFamily: fonts.family.aldrich,
                fontSize: 11,
                marginTop: 8,
              },
            ]}
          >
            Sem cartas na mão
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.handScroll}
        >
          {hand.map((card) => {
            const isSelected = card.id === selectedCardId;
            const canInteract = isMyTurn;

            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardBtn,
                  {
                    // Borda usa a cor real da carta vindade do servidor
                    borderColor: isSelected
                      ? card.color
                      : canInteract
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.06)',
                    backgroundColor: isSelected
                      ? `${card.color}22`
                      : 'rgba(15,23,42,0.6)',
                    opacity: canInteract ? 1 : 0.4,
                    // Carta selecionada sobe levemente
                    transform: [{ translateY: isSelected ? -8 : 0 }],
                  },
                ]}
                onPress={() => canInteract && onSelectCard(card)}
                disabled={!canInteract}
                activeOpacity={0.75}
              >
                {/* Barra de cor no topo */}
                <View
                  style={[styles.cardColorBar, { backgroundColor: card.color }]}
                />

                {/* Tipo da carta */}
                <Text
                  style={[
                    styles.cardType,
                    {
                      fontFamily: fonts.family.aldrich,
                      color: isSelected ? '#F8FAFC' : '#CBD5E1',
                    },
                  ]}
                  numberOfLines={4}
                >
                  {translateCard(card.type).replace(/ /g, '\n')}
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
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 0, marginBottom: 4 },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  emptyHand: {
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderStyle: 'dashed',
  },
  handScroll: {
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  cardBtn: {
    width: 76,
    height: 108,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardColorBar: {
    width: '100%',
    height: 5,
  },
  cardType: {
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingTop: 6,
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 5,
  },
});
