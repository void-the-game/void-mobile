import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import { AstronautIcon } from '@/components/svg/svgIcons';

const ICON_COLORS = ['#3B82F6', '#E91E63', '#10B981', '#A855F7'];

export function OpponentList({
  opponents,
  currentTurnPlayerId,
}: {
  opponents: any[];
  currentTurnPlayerId?: string;
}) {
  const { colors, fonts } = useTheme();

  if (!opponents || opponents.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionLabel,
          { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
        ]}
      >
        Oponentes
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        {opponents.map((player, i) => (
          <View
            key={player.id}
            style={[
              styles.opponentCard,
              {
                backgroundColor: 'rgba(59,130,246,0.08)',
                borderColor:
                  currentTurnPlayerId === player.id
                    ? 'rgba(59,130,246,0.55)'
                    : 'rgba(59,130,246,0.18)',
              },
            ]}
          >
            <AstronautIcon
              color={ICON_COLORS[i % ICON_COLORS.length]}
              armColor="#1a1a1a"
              armStrokeColor={ICON_COLORS[i % ICON_COLORS.length]}
              size={40}
            />
            <Text
              style={[
                styles.opponentName,
                { fontFamily: fonts.family.aldrich, color: colors.text },
              ]}
              numberOfLines={1}
            >
              {player.name}
            </Text>
            <Text
              style={[
                styles.opponentCards,
                { fontFamily: fonts.family.aldrich },
              ]}
            >
              {player.cardCount ?? '?'} cartas
            </Text>
            {player.isEliminated && (
              <View style={styles.eliminatedBadge}>
                <Text style={styles.eliminatedText}>Eliminado</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  opponentCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    minWidth: 90,
    gap: 4,
  },
  opponentName: { fontSize: 12, textAlign: 'center' },
  opponentCards: { fontSize: 11, color: '#94A3B8' },
  eliminatedBadge: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  eliminatedText: { color: '#EF4444', fontSize: 9, fontWeight: '700' },
});
