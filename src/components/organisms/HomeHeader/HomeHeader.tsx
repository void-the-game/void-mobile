import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import Icon from 'react-native-vector-icons/Feather';

export default function HomeHeader() {
  const { colors, layout, spacing } = useTheme();

  return (
    <View
      style={[
        layout.row,
        layout.itemsCenter,
        layout.justifyBetween,
        spacing.py_2xl,
      ]}
    >
      <TouchableOpacity>
        <Icon name="menu" size={28} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="bell" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}
