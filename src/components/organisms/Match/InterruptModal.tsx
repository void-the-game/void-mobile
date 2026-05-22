import React, { useEffect, useRef } from 'react';
import { View, Modal, Pressable, Animated, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { translateCard } from '@/utils/cardTranslations';
import { Card } from '@/types/multiplayer.types';

const CARD = {
  backgroundColor: 'rgba(59,130,246,0.08)',
  borderColor: 'rgba(59,130,246,0.22)',
};

export function InterruptModal({
  visible,
  attackerName,
  cardType,
  timeoutMs,
  availableResponses = [],
  onRespond,
  onSkip,
}: {
  visible: boolean;
  attackerName: string;
  cardType: string;
  timeoutMs: number;
  availableResponses?: Card[];
  onRespond: (cardId: string) => void;
  onSkip: () => void;
}) {
  const { colors, fonts } = useTheme();
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      progress.setValue(1);
      Animated.timing(progress, {
        toValue: 0,
        duration: timeoutMs,
        useNativeDriver: false,
      }).start(() => onSkip());
    }
  }, [visible, timeoutMs, progress, onSkip]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View
          style={[
            modalStyles.sheet,
            {
              backgroundColor: colors.background,
              borderColor: 'rgba(59,130,246,0.22)',
            },
          ]}
        >
          <View style={modalStyles.handle} />
          <View style={modalStyles.titleRow}>
            <Feather name="alert-triangle" size={20} color="#EF4444" />
            <Text
              style={[
                modalStyles.title,
                { fontFamily: fonts.family.aldrich, color: '#EF4444' },
              ]}
            >
              Reação necessária!
            </Text>
          </View>
          <Text
            style={[
              modalStyles.subtitle,
              { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
            ]}
          >
            <Text style={{ color: '#60A5FA' }}>{attackerName}</Text> jogou{' '}
            <Text style={{ color: '#F1F5F9', fontWeight: 'bold' }}>
              {translateCard(cardType)}
            </Text>
          </Text>
          <View style={modalStyles.timerTrack}>
            <Animated.View
              style={[modalStyles.timerFill, { width: barWidth }]}
            />
          </View>
          <View style={{ gap: 8 }}>
            {availableResponses.map((card) => (
              <Pressable
                key={card.id}
                style={[
                  modalStyles.optionBtn,
                  CARD,
                  {
                    borderColor:
                      card.color === 'joker' ? '#D946EF' : card.color,
                  },
                ]}
                onPress={() => onRespond(card.id)}
              >
                <View
                  style={[
                    modalStyles.colorDot,
                    {
                      backgroundColor:
                        card.color === 'joker' ? '#D946EF' : card.color,
                    },
                  ]}
                />
                <Text
                  style={[
                    modalStyles.optionText,
                    { fontFamily: fonts.family.aldrich },
                  ]}
                >
                  Jogar {translateCard(card.type)}
                </Text>
                <Feather name="chevron-right" size={16} color="#60A5FA" />
              </Pressable>
            ))}

            {availableResponses.length === 0 && (
              <View style={modalStyles.noResponseBox}>
                <Text
                  style={[
                    modalStyles.noResponseText,
                    { fontFamily: fonts.family.aldrich },
                  ]}
                >
                  Você não tem cartas para se defender deste ataque (Defesa
                  Pontual). Aguarde o tempo ou aceite.
                </Text>
              </View>
            )}

            <Pressable
              style={[
                modalStyles.optionBtn,
                {
                  backgroundColor: 'rgba(55,65,81,0.3)',
                  borderColor: 'rgba(75,85,99,0.3)',
                },
              ]}
              onPress={onSkip}
            >
              <Text
                style={[
                  modalStyles.optionText,
                  { fontFamily: fonts.family.aldrich, color: '#64748B' },
                ]}
              >
                {availableResponses.length > 0 ? 'Não reagir' : 'Compreendo'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderCurve: 'continuous',
    borderTopWidth: 1,
    padding: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(148,163,184,0.3)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 16 },
  timerTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(55,65,81,0.6)',
    borderRadius: 2,
    borderCurve: 'continuous',
    marginBottom: 16,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 2,
    borderCurve: 'continuous',
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  optionText: {
    color: '#F1F5F9',
    fontSize: 14,
    flex: 1,
  },
  noResponseBox: {
    padding: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 12,
    borderCurve: 'continuous',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  noResponseText: {
    color: '#FCA5A5',
    fontSize: 13,
  },
});
