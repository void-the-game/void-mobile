import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';

export interface MatchTopBarProps {
  nickname: string;
  onSync: () => void;
}

export function MatchTopBar({ nickname, onSync }: MatchTopBarProps) {
  const { fonts } = useTheme();

  return (
    <View style={styles.topBar}>
      <Text
        style={[styles.nicknameLabel, { fontFamily: fonts.family.aldrich }]}
      >
        {nickname}
      </Text>
      <Pressable onPress={onSync} style={styles.syncBtn}>
        <Feather name="refresh-cw" size={13} color="#94A3B8" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nicknameLabel: {
    color: '#94A3B8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  syncBtn: {
    padding: 6,
  },
});
