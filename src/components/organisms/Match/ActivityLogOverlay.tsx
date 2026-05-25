import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';
import type { PublicActionPayload } from '@/types/multiplayer.types';
import { translateLog } from '@/utils/cardTranslations';

interface ActivityLogOverlayProps {
  log: PublicActionPayload[];
}

export function ActivityLogOverlay({ log }: ActivityLogOverlayProps) {
  const { fonts } = useTheme();

  if (log.length === 0) return null;

  return (
    <View style={styles.container}>
      {log.slice(0, 3).map((item, i) => (
        <View key={i} testID="log-entry">
          <Text style={[styles.logText, { fontFamily: fonts.family.aldrich }]}>
            <Text style={styles.playerName}>{item.playerName}</Text>
            {' — '}
            {translateLog(item.effectDescription)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    top: 72,
    maxWidth: 200,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
    padding: 8,
    gap: 4,
  },
  logText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#94A3B8',
  },
  playerName: {
    color: '#60A5FA',
  },
});
