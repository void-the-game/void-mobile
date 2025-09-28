import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleProp, ViewStyle } from 'react-native';
import { Star } from '@/components/atoms/Star';

type StarItem = {
  top: number;
  left: number;
  size: number;
};

type Props = {
  stars: StarItem[];
  style?: StyleProp<ViewStyle>;
};

export default function StarField({ stars, style }: Props) {
  const globalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(globalAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(globalAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [globalAnim]);

  return (
    <View style={style}>
      {stars.map((star, i) => {
        const phase = (i / stars.length) * Math.PI * 2;
        const opacity = globalAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [
            0.3 + 0.7 * Math.sin(phase),
            0.3 + 0.7 * Math.sin(phase + Math.PI),
          ],
        });

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              opacity,
            }}
          >
            <Star size={star.size} />
          </Animated.View>
        );
      })}
    </View>
  );
}
