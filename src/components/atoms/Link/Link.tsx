import React from 'react';
import {
  TouchableOpacity,
  type TouchableOpacityProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';

type LinkProps = {
  children: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
} & TouchableOpacityProps;

export default function Link({ children, textStyle, ...props }: LinkProps) {
  const { colors, fonts } = useTheme();

  return (
    <TouchableOpacity {...props}>
      <Text
        style={[textStyle, { color: colors.primary, fontSize: fonts.size.sm }]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
