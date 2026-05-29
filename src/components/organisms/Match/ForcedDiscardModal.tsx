import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { translateCard } from '@/utils/cardTranslations';

export function ForcedDiscardModal({
  visible,
  reason,
  requiredColor,
  hand,
  onConfirm,
}: {
  visible: boolean;
  reason: 'vortex' | 'black_hole';
  requiredColor: string;
  hand: { id: string; type: string; color: string }[];
  onConfirm: (ids: string[]) => void;
}) {
  const { colors, fonts } = useTheme();
  const [selected, setSelected] = useState<string[]>([]);

  const isMatchColor = (c: { color: string; type: string }) =>
    c.color === requiredColor || c.type === 'joker';

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const isValidSubmit = () => {
    if (reason === 'vortex') {
      if (selected.length !== 1) return false;
      const card = hand.find((c) => c.id === selected[0]);
      return card && isMatchColor(card);
    } else {
      if (selected.length === 1) {
        const card = hand.find((c) => c.id === selected[0]);
        return card && isMatchColor(card);
      }
      if (selected.length === 2) {
        return true; // Any 2 cards
      }
      return false;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
    >
      <View style={modalStyles.overlay}>
        <View
          style={[
            modalStyles.sheet,
            {
              backgroundColor: colors.background,
              borderColor: 'rgba(239,68,68,0.3)',
            },
          ]}
        >
          <View style={modalStyles.handle} />
          <View style={modalStyles.titleRow}>
            <Feather name="trash-2" size={20} color="#EF4444" />
            <Text
              style={[
                modalStyles.title,
                { fontFamily: fonts.family.aldrich, color: '#EF4444' },
              ]}
            >
              {reason === 'vortex' ? 'Vórtice!' : 'Buraco Negro!'}
            </Text>
          </View>
          <Text
            style={[
              modalStyles.subtitle,
              { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
            ]}
          >
            {reason === 'vortex'
              ? `Descarte 1 carta da cor `
              : `Descarte 1 carta da cor `}
            <Text style={{ color: '#60A5FA' }}>{requiredColor}</Text>
            {reason === 'black_hole' && ' ou 2 de qualquer cor.'}
          </Text>

          <ScrollView
            style={modalStyles.scrollView}
            contentContainerStyle={{ gap: 8 }}
          >
            {hand.length === 0 ? (
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
                  Você não tem cartas para descartar. Aceite a punição.
                </Text>
              </View>
            ) : (
              hand.map((card) => {
                const sel = selected.includes(card.id);
                const highlight = isMatchColor(card);
                return (
                  <Pressable
                    key={card.id}
                    style={[
                      modalStyles.optionBtn,
                      {
                        borderColor: sel
                          ? '#EF4444'
                          : highlight
                            ? 'rgba(59,130,246,0.5)'
                            : 'rgba(148,163,184,0.2)',
                        backgroundColor: sel
                          ? 'rgba(239,68,68,0.1)'
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
                          color: highlight ? '#60A5FA' : '#94A3B8',
                          fontFamily: fonts.family.aldrich,
                        },
                      ]}
                    >
                      {translateCard(card.type)}
                    </Text>
                    {sel && <Feather name="check" size={16} color="#EF4444" />}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
          <View style={modalStyles.btnRow}>
            <Pressable
              style={[modalStyles.primaryBtn, modalStyles.cancelBtn]}
              onPress={() => onConfirm([])}
            >
              <Text
                style={[
                  modalStyles.cancelBtnText,
                  { fontFamily: fonts.family.aldrich },
                ]}
              >
                Aceitar Punição
              </Text>
            </Pressable>

            <Pressable
              style={[
                modalStyles.primaryBtn,
                modalStyles.confirmBtn,
                { opacity: isValidSubmit() ? 1 : 0.4 },
              ]}
              onPress={() => {
                if (isValidSubmit()) onConfirm(selected);
              }}
              disabled={!isValidSubmit()}
            >
              <Text
                style={[
                  modalStyles.primaryBtnText,
                  { fontFamily: fonts.family.aldrich },
                ]}
              >
                Descartar
              </Text>
              <Feather name="arrow-right" size={18} color="white" />
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
    paddingHorizontal: 20,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    padding: 24,
    borderCurve: 'continuous',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(148,163,184,0.3)',
    alignSelf: 'center',
    marginBottom: 20,
    borderCurve: 'continuous',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 16 },
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
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderCurve: 'continuous',
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
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    backgroundColor: 'rgba(239,68,68,0.08)',
    padding: 12,
    borderCurve: 'continuous',
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
  cancelBtnText: {
    color: '#E5E7EB',
    fontSize: 13,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 999,
    gap: 8,
    borderCurve: 'continuous',
  },
  primaryBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
