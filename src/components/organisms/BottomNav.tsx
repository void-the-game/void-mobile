import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomTab = 'home' | 'friends' | 'ranking' | 'profile';

export const TABS: { key: BottomTab; label: string; icon: string }[] = [
  { key: 'home', label: 'Início', icon: 'home-outline' },
  { key: 'friends', label: 'Amigos', icon: 'people-outline' },
  { key: 'ranking', label: 'Ranking', icon: 'trophy-outline' },
  { key: 'profile', label: 'Perfil', icon: 'person-outline' },
];

export function BottomNav({
  active,
  onChange,
  backgroundColor,
}: {
  active: BottomTab;
  onChange: (tab: BottomTab) => void;
  backgroundColor: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        navStyles.bar,
        { backgroundColor, paddingBottom: insets.bottom || 16 },
      ]}
    >
      {TABS.map((t) => {
        const focused = active === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            style={navStyles.tab}
            onPress={() => onChange(t.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
          >
            <Ionicons
              name={(focused ? t.icon.replace('-outline', '') : t.icon) as any}
              size={22}
              color={focused ? '#3B82F6' : '#64748B'}
            />
            <Text style={[navStyles.label, focused && navStyles.labelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const navStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,130,246,0.18)',
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 11, color: '#64748B' },
  labelActive: { color: '#3B82F6', fontWeight: '600' },
});
