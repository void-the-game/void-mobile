import React from 'react';
import {
  TouchableOpacity,
  Image,
  type ImageSourcePropType,
  type TouchableOpacityProps,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';

type MenuButtonProps = {
  title: string;
  characterImage: ImageSourcePropType;
} & TouchableOpacityProps;

function MenuButton({ title, characterImage, ...props }: MenuButtonProps) {
  const { colors, fonts, gutters, layout, spacing } = useTheme();

  return (
    <TouchableOpacity
      style={{
        ...layout.itemsCenter,
        ...layout.justifyBetween,
        ...spacing.py_md,
        width: '45%',
        minWidth: 130,
        aspectRatio: 1,

        backgroundColor: colors.surface,
        borderRadius: gutters.md,
        borderWidth: 1,
        borderColor: '#2A2A2A',
      }}
      {...props}
    >
      <Text
        style={{
          fontFamily: fonts.family.aldrich,
          fontSize: fonts.size.md,
          textAlign: 'center',
          width: '100%',
        }}
        numberOfLines={2}
        ellipsizeMode="clip"
      >
        {title}
      </Text>
      <Image
        source={characterImage}
        style={{ width: '60%', height: '60%' }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default MenuButton;
