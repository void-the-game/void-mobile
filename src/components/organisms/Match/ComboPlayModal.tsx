import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/types/multiplayer.types';
import { translateCard } from '@/utils/cardTranslations';

export function ComboPlayModal({
  visible,
  comboCard,
  hand,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  comboCard: Card | null;
  hand: Card[];
  onConfirm: (payload: {
    recycleCardIds?: string[];
    essenceCardId?: string;
  }) => void;
  onCancel: () => void;
}) {
  const { colors, fonts } = useTheme();
  const [selected, setSelected] = useState<string[]>([]);

  if (!comboCard) return null;

  const isRecycle = comboCard.type === 'recycle';
  const isExtraPower = comboCard.type === 'extra_power';

  // Opções para reciclar: qualquer carta que não seja ela mesma (limitado a 1 ou pode ser mais? O guia diz "máximo 1 outra carta" no recycle)
  // Opções para poder extra: essência da mesma cor ou curinga.
  const options = hand.filter(
    (c) =>
      c.id !== comboCard.id &&
      (isRecycle
        ? true
        : (c.type === 'essence' && c.color === comboCard.color) ||
          c.type === 'joker'),
  );

  const toggle = (id: string) => {
    if (isExtraPower) {
      setSelected((prev) => (prev.includes(id) ? [] : [id])); // Só 1 permitida no Extra Power
    } else {
      setSelected((prev) => (prev.includes(id) ? [] : [id])); // Limitaremos a 1 carta para combinar
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
    >
      <View style={modalStyles.overlay}>
        <View
          style={[
            modalStyles.sheet,
            {
              backgroundColor: colors.background,
              borderColor: 'rgba(59,130,246,0.3)',
            },
          ]}
        >
          <View style={modalStyles.titleRow}>
            <Feather
              name={isRecycle ? 'refresh-cw' : 'zap'}
              size={20}
              color="#60A5FA"
            />
            <Text
              style={[
                modalStyles.title,
                { fontFamily: fonts.family.aldrich, color: '#60A5FA' },
              ]}
            >
              {isRecycle ? 'Reciclar' : 'Poder Extra'}
            </Text>
          </View>
          <Text
            style={[
              modalStyles.subtitle,
              { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
            ]}
          >
            {isRecycle
              ? 'Deseja descartar junto mais alguma carta de sua mão?'
              : 'Selecione uma essência da mesma cor ou Coringa para combar o poder, ou jogue sem combo.'}
          </Text>

          <ScrollView
            style={modalStyles.scrollView}
            contentContainerStyle={{ gap: 8 }}
          >
            {options.length === 0 ? (
              <View style={modalStyles.warningBox}>
                <Feather
                  name="info"
                  size={14}
                  color="#FCA5A5"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    modalStyles.warningText,
                    { fontFamily: fonts.family.aldrich },
                  ]}
                >
                  Você não possui cartas para combar. O efeito base será
                  aplicado.
                </Text>
              </View>
            ) : (
              options.map((card) => {
                const sel = selected.includes(card.id);
                return (
                  <Pressable
                    key={card.id}
                    style={[
                      modalStyles.optionBtn,
                      {
                        borderColor: sel ? '#60A5FA' : 'rgba(148,163,184,0.2)',
                        backgroundColor: sel
                          ? 'rgba(59,130,246,0.1)'
                          : 'rgba(59,130,246,0.02)',
                      },
                    ]}
                    onPress={() => toggle(card.id)}
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
                        {
                          color: sel ? '#60A5FA' : '#94A3B8',
                          fontFamily: fonts.family.aldrich,
                        },
                      ]}
                    >
                      {translateCard(card.type)}
                    </Text>
                    {sel && <Feather name="check" size={16} color="#60A5FA" />}
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          <View style={modalStyles.btnRow}>
            <Pressable
              style={[modalStyles.primaryBtn, modalStyles.cancelBtn]}
              onPress={onCancel}
            >
              <Text
                style={{
                  color: '#E5E7EB',
                  fontFamily: fonts.family.aldrich,
                  fontSize: 13,
                }}
              >
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={[modalStyles.primaryBtn, modalStyles.confirmBtn]}
              onPress={() => {
                if (isRecycle) {
                  onConfirm({ recycleCardIds: selected });
                } else {
                  onConfirm({ essenceCardId: selected[0] });
                }
              }}
            >
              <Text
                style={[
                  modalStyles.primaryBtnText,
                  { fontFamily: fonts.family.aldrich },
                ]}
              >
                Jogar Carta
              </Text>
              <Feather name="play" size={16} color="white" />
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
    justifyContent: 'center',
    padding: 20,
    paddingHorizontal: 20,
  },
  sheet: {
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 13, marginBottom: 16, lineHeight: 18 },
  scrollView: {
    maxHeight: 200,
    marginBottom: 16,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
    flex: 1,
  },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    backgroundColor: 'rgba(239,68,68,0.08)',
    padding: 12,
  },
  warningText: {
    color: '#FCA5A5',
    fontSize: 13,
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'rgba(55,65,81,0.3)',
    borderColor: 'rgba(75,85,99,0.3)',
    borderWidth: 1,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#60A5FA',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 14,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
