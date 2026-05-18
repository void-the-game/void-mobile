import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import type { PublicActionPayload } from '@/types/multiplayer.types';

const CARD = {
  backgroundColor: 'rgba(59,130,246,0.08)',
  borderColor: 'rgba(59,130,246,0.22)',
};

export function ActivityLogFeed({ log }: { log: PublicActionPayload[] }) {
  const { fonts } = useTheme();

  if (!log || log.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionLabel,
          { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
        ]}
      >
        Últimas jogadas
      </Text>
      <View style={[styles.logCard, CARD]}>
        {log.slice(0, 5).map((item, i) => (
          <View
            key={i}
            style={[
              styles.logRow,
              { borderBottomColor: 'rgba(59,130,246,0.1)' },
            ]}
          >
            <Text
              style={[
                styles.logText,
                { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
              ]}
            >
              <Text style={{ color: '#60A5FA' }}>{item.playerName}</Text>
              {' — '}
              {item.effectDescription}
            </Text>
          </View>
        ))}
      </View>
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
  logCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  logRow: { paddingVertical: 9, paddingHorizontal: 14, borderBottomWidth: 1 },
  logText: { fontSize: 12, lineHeight: 17 },
});
