import { useTheme } from '@/theme/hooks/useTheme';
import { Text } from '@/components/atoms/Text';
import React from 'react';
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  type TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}

export default function Button({ title, ...props }: ButtonProps) {
  const { colors, fonts } = useTheme();

  return (
    <TouchableOpacity {...props}>
      <Text
        style={{
          color: colors.primary,
          fontSize: fonts.size.xl,
          fontFamily: fonts.family.aldrich,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
