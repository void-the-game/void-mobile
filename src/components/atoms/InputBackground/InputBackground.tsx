import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/hooks/useTheme';

type InputBackgroundProps = {
  width: number;
  height: number;
};

export default function InputBackground({
  width,
  height,
}: InputBackgroundProps) {
  const { colors } = useTheme();

  const pathData = `
    M 25,0
    Q 15,${height / 2} 25,${height}
    H ${width - 25}
    A ${height / 2},${height / 2} 0 0 1 ${width - 25},0
    Z
  `;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d={pathData} fill={colors.surface} />
    </Svg>
  );
}
