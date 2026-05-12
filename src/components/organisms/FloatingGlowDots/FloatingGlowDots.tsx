import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type Dot = {
  top: string;
  left: string;
  color: string;
  delay: number;
  maxOpacity: number;
};

const DOT_SIZE = 4;

const DOTS: Dot[] = [
  { top: '10%', left: '12%', color: '#3B82F6', delay: 0, maxOpacity: 0.70 },
  { top: '16%', left: '74%', color: '#22C55E', delay: 280, maxOpacity: 0.70 },
  { top: '32%', left: '38%', color: '#EAB308', delay: 620, maxOpacity: 0.70 },
  { top: '36%', left: '86%', color: '#A855F7', delay: 420, maxOpacity: 0.17 },
  { top: '57%', left: '66%', color: '#22C55E', delay: 540, maxOpacity: 0.15 },
  { top: '69%', left: '10%', color: '#EAB308', delay: 1080, maxOpacity: 0.13 },
  { top: '76%', left: '82%', color: '#A855F7', delay: 760, maxOpacity: 0.70 },
  { top: '88%', left: '30%', color: '#3B82F6', delay: 1180, maxOpacity: 0.14 },
  { top: '84%', left: '64%', color: '#22C55E', delay: 860, maxOpacity: 0.70 },
];

function GlowDot({ dot }: { dot: Dot }) {
  const opacity = useRef(new Animated.Value(0.08)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(dot.delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: dot.maxOpacity,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(scale, {
            toValue: 1.18,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.06,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(scale, {
            toValue: 0.92,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [dot.delay, dot.maxOpacity, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          top: dot.top as any,
          left: dot.left as any,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: dot.color,
          opacity,
          transform: [{ scale }],
          shadowColor: dot.color,
        },
      ]}
    />
  );
}

export function FloatingGlowDots() {
  return (
    <View pointerEvents="none" style={styles.container}>
      {DOTS.map((dot, index) => (
        <GlowDot key={`${dot.top}-${dot.left}-${index}`} dot={dot} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  dot: {
    position: 'absolute',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
});