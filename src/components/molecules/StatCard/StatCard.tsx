import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  const { colors, fonts, gutters } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'rgba(59,130,246,0.08)',
          borderColor: 'rgba(59,130,246,0.22)',
          borderRadius: gutters.md,
        },
      ]}
    >
      {icon && <View style={{ marginBottom: 4 }}>{icon}</View>}
      <Text
        style={{
          fontFamily: fonts.family.aldrich,
          fontSize: fonts.size.lg,
          color: colors.primary,
          fontWeight: 'bold',
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: fonts.family.aldrich,
          fontSize: fonts.size.xs,
          color: '#94A3B8',
          marginTop: 2,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginBottom: 12,
  },
});
