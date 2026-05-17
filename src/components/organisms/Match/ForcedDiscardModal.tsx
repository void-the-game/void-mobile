import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';

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
    const colorCards = hand.filter(c => c.color === requiredColor);

    const toggle = (id: string) =>
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={modalStyles.overlay}>
                <View style={[modalStyles.sheet, { backgroundColor: colors.background, borderColor: 'rgba(239,68,68,0.3)' }]}>
                    <View style={modalStyles.handle} />
                    <View style={modalStyles.titleRow}>
                        <Feather name="trash-2" size={20} color="#EF4444" />
                        <Text style={[modalStyles.title, { fontFamily: fonts.family.aldrich, color: '#EF4444' }]}>
                            {reason === 'vortex' ? 'Vórtice!' : 'Buraco Negro!'}
                        </Text>
                    </View>
                    <Text style={[modalStyles.subtitle, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
                        Descarte cartas da cor:{' '}
                        <Text style={{ color: '#60A5FA' }}>{requiredColor}</Text>
                    </Text>
                    <View style={{ gap: 8, marginBottom: 16 }}>
                        {colorCards.length === 0 ? (
                            <View style={modalStyles.warningBox}>
                                <Feather name="info" size={14} color="#FCA5A5" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#FCA5A5', fontFamily: fonts.family.aldrich, fontSize: 13, flex: 1 }}>
                                    Sem cartas dessa cor. O efeito alternativo será aplicado.
                                </Text>
                            </View>
                        ) : (
                            colorCards.map(card => {
                                const sel = selected.includes(card.id);
                                return (
                                    <TouchableOpacity
                                        key={card.id}
                                        style={[
                                            modalStyles.optionBtn,
                                            {
                                                borderColor: sel ? '#EF4444' : 'rgba(59,130,246,0.22)',
                                                backgroundColor: sel ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.08)',
                                            },
                                        ]}
                                        onPress={() => toggle(card.id)}
                                    >
                                        <View style={[modalStyles.colorDot, { backgroundColor: card.color }]} />
                                        <Text style={{ color: '#E5E7EB', fontFamily: fonts.family.aldrich, fontSize: 14, flex: 1 }}>
                                            {card.type}
                                        </Text>
                                        {sel && <Feather name="check" size={16} color="#EF4444" />}
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>
                    <TouchableOpacity
                        style={[
                            modalStyles.primaryBtn,
                            { backgroundColor: selected.length > 0 || colorCards.length === 0 ? '#EF4444' : '#374151' },
                        ]}
                        onPress={() => onConfirm(selected)}
                    >
                        <Text style={[modalStyles.primaryBtnText, { fontFamily: fonts.family.aldrich }]}>
                            {colorCards.length === 0 ? 'Confirmar' : `Descartar (${selected.length})`}
                        </Text>
                        <Feather name="arrow-right" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const modalStyles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
    sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, padding: 24 },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(148,163,184,0.3)',
        alignSelf: 'center',
        marginBottom: 20,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    title: { fontSize: 18, fontWeight: '700' },
    subtitle: { fontSize: 14, marginBottom: 16 },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1.5,
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 16,
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
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 999,
        gap: 8,
    },
    primaryBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
