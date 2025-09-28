import { useTheme } from '@/theme/hooks/useTheme';
import React from 'react';
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type TextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
} & RNTextProps;

export default function Text({ children, style, ...props }: TextProps) {
  const { colors, fonts } = useTheme();

  return (
    <RNText
      style={[
        {
          fontFamily: fonts.family.aldrich,
          fontSize: fonts.size.md,
          color: colors.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
