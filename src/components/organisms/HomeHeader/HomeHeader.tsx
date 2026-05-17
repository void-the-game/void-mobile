import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { spacing } from '@/theme/spacing';
import Icon from 'react-native-vector-icons/Feather';
import { SideMenu } from '@/components/organisms/SideMenu';

export default function HomeHeader() {
  const { colors, layout } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <View
        style={[
          layout.row,
          layout.itemsCenter,
          layout.justifyBetween,
          spacing.py_smd,
          spacing.px_md,
        ]}
      >
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={28} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon name="bell" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}