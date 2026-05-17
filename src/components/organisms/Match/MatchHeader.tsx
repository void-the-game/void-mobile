import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { AstronautIcon } from '@/components/svg/svgIcons';

export function MatchHeader({
    myAvatar,
    myNickname,
    isMyTurn,
    onSync,
}: {
    myAvatar?: string;
    myNickname: string;
    isMyTurn: boolean;
    onSync: () => void;
}) {
    const { fonts } = useTheme();

    return (
        <View style={styles.matchHeader}>
            {myAvatar ? (
                <Image source={{ uri: myAvatar }} style={styles.matchAvatar} />
            ) : (
                <AstronautIcon color="#3B82F6" armColor="#093075" armStrokeColor="#3B82F6" size={56} />
            )}
            <View style={{ flex: 1 }}>
                <View style={[
                    styles.matchBubble,
                    {
                        borderColor: isMyTurn ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.35)',
                        backgroundColor: isMyTurn ? 'rgba(16,185,129,0.06)' : 'rgba(30,41,59,0.95)',
                    },
                ]}>
                    <Text style={[styles.matchBubbleLabel, { fontFamily: fonts.family.aldrich }]}>
                        {myNickname} 👾
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <Feather
                            name={isMyTurn ? 'zap' : 'clock'}
                            size={12}
                            color={isMyTurn ? '#10B981' : '#94A3B8'}
                        />
                        <Text style={[styles.matchBubbleStatus, { fontFamily: fonts.family.aldrich, color: isMyTurn ? '#10B981' : '#94A3B8' }]}>
                            {isMyTurn ? 'Seu turno!' : 'Aguardando...'}
                        </Text>
                    </View>
                    <View style={[styles.bubbleTail, {
                        borderRightColor: isMyTurn ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.35)',
                    }]} />
                </View>
            </View>
            <TouchableOpacity onPress={onSync} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Feather name="refresh-cw" size={16} color="#4B5563" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    matchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 12,
    },
    matchAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.2)',
    },
    matchBubble: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderTopLeftRadius: 2,
    },
    matchBubbleLabel: { fontSize: 13, fontWeight: '700', color: '#E2E8F0' },
    matchBubbleStatus: { fontSize: 12 },
    bubbleTail: {
        position: 'absolute',
        left: -8,
        top: 12,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderTopWidth: 6,
        borderBottomWidth: 6,
        borderRightWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
});
