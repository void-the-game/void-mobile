import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AstronautIcon } from '@/components/svg/svgIcons';

interface CardBackProps {
  rotation: number;
  offsetX?: number;
  style?: ViewStyle;
}

export function CardBack({ rotation, offsetX = 0, style }: CardBackProps) {
  return (
    <View
      testID="card-back"
      style={[
        styles.card,
        {
          transform: [{ translateX: offsetX }, { rotate: `${rotation}deg` }],
        },
        style,
      ]}
    >
      <AstronautIcon color="#1E3A5F" size={28} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 45,
    height: 65,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    borderColor: 'rgba(59,130,246,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});
