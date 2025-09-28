import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  footer?: React.ReactNode;
};

export default function AuthFormContainer({ children, footer, style }: Props) {
  const { gutters, layout } = useTheme();

  return (
    <View style={[layout.fullWidth, layout.itemsCenter, style]}>
      <View style={[layout.fullWidth, { gap: gutters.md }]}>{children}</View>

      {footer && (
        <View
          style={[
            layout.itemsCenter,
            { gap: gutters.md, marginTop: gutters.lg },
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  );
}
