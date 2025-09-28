import { useTheme } from '@/theme/hooks/useTheme';
import { View } from 'react-native';

export type StarProps = {
  top?: number;
  left?: number;
  size: number;
};

export default function Star({ top, left, size }: StarProps) {
  const { colors, layout } = useTheme();

  return (
    <View
      style={[
        layout.absolute,
        {
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.accent,
          opacity: 0.8,
        },
      ]}
    />
  );
}
