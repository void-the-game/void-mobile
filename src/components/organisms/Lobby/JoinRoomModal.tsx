import React from 'react';
import { View, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';

const CARD = {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.22)',
};

type JoinRoomModalProps = {
    visible: boolean;
    joinCode: string;
    onJoinCodeChange: (code: string) => void;
    onJoin: () => void;
    onClose: () => void;
};

export function JoinRoomModal({
    visible,
    joinCode,
    onJoinCodeChange,
    onJoin,
    onClose,
}: JoinRoomModalProps) {
    const { colors, fonts } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalKeyboard}
                >
                    <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHandle} />

                        <Text
                            style={[
                                styles.modalTitle,
                                { fontFamily: fonts.family.aldrich, color: colors.text },
                            ]}
                        >
                            Entrar na sala
                        </Text>

                        <Text style={[styles.modalSubtitle, { fontFamily: fonts.family.aldrich }]}>
                            Digite o código da sala para se conectar à tripulação
                        </Text>

                        <TextInput
                            style={[
                                styles.modalInput,
                                { color: colors.text, fontFamily: fonts.family.aldrich, ...CARD },
                            ]}
                            placeholder="Ex: ABC123"
                            placeholderTextColor="#4B5563"
                            value={joinCode}
                            onChangeText={onJoinCodeChange}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            maxLength={10}
                        />

                        <TouchableOpacity
                            style={[
                                styles.primaryBtn,
                                { backgroundColor: joinCode.trim() ? '#3B82F6' : '#374151' },
                            ]}
                            onPress={onJoin}
                            disabled={!joinCode.trim()}
                        >
                            <Text style={[styles.primaryBtnText, { fontFamily: fonts.family.aldrich }]}>
                                Confirmar entrada
                            </Text>
                            <Feather name="log-in" size={18} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryBtn}
                            onPress={onClose}
                        >
                            <Text style={[styles.secondaryBtnText, { fontFamily: fonts.family.aldrich }]}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalKeyboard: {
        justifyContent: 'flex-end',
    },
    modalCard: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 36,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.2)',
        gap: 12,
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(148,163,184,0.3)',
        alignSelf: 'center',
        marginBottom: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        letterSpacing: 2,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
    },
    primaryBtnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
        flexShrink: 1,
        textAlign: 'center',
    },
    secondaryBtn: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    secondaryBtnText: {
        color: '#64748B',
        fontSize: 14,
    },
});
