import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';

type Props = {
  visible: boolean;
  title?: string;
  subtitle?: string;
};

type Star = {
  size: number;
  top: string;
  left: string;
  delay: number;
  opacity: number;
};

const STARS: Star[] = [
  { size: 4, top: '12%', left: '18%', delay: 0, opacity: 0.7 },
  { size: 3, top: '20%', left: '72%', delay: 120, opacity: 0.6 },
  { size: 2, top: '28%', left: '42%', delay: 240, opacity: 0.4 },
  { size: 5, top: '38%', left: '82%', delay: 360, opacity: 0.9 },
  { size: 3, top: '44%', left: '14%', delay: 180, opacity: 0.5 },
  { size: 2, top: '56%', left: '58%', delay: 420, opacity: 0.45 },
  { size: 4, top: '64%', left: '26%', delay: 520, opacity: 0.7 },
  { size: 3, top: '73%', left: '76%', delay: 280, opacity: 0.55 },
  { size: 2, top: '82%', left: '48%', delay: 460, opacity: 0.35 },
  { size: 4, top: '16%', left: '50%', delay: 600, opacity: 0.8 },
  { size: 2, top: '68%', left: '88%', delay: 720, opacity: 0.4 },
  { size: 3, top: '86%', left: '20%', delay: 840, opacity: 0.65 },
];

function TwinkleStar({ star }: { star: Star }) {
  const pulse = useRef(new Animated.Value(0.4)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(star.delay),
        Animated.parallel([
          Animated.timing(pulse, {
            toValue: star.opacity,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(scale, {
            toValue: 1.25,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, {
            toValue: 0.25,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(scale, {
            toValue: 0.85,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulse, scale, star.delay, star.opacity]);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: star.size,
          height: star.size,
          top: star.top as any,
          left: star.left as any,
          opacity: pulse,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

export function SpaceTransitionOverlay({
  visible,
  title = 'Sincronizando órbita...',
  subtitle = 'Preparando conexão interestelar',
}: Props) {
  const { colors, fonts } = useTheme();

  const fade = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.92)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const corePulse = useRef(new Animated.Value(0.92)).current;
  const glowPulse = useRef(new Animated.Value(0.35)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  const ringSpin = useMemo(
    () =>
      ringRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    [ringRotate]
  );

  const sweepTranslate = useMemo(
    () =>
      sweep.interpolate({
        inputRange: [0, 1],
        outputRange: [-140, 140],
      }),
    [sweep]
  );

  useEffect(() => {
    if (!visible) {
      fade.setValue(0);
      contentScale.setValue(0.92);
      ringRotate.setValue(0);
      corePulse.setValue(0.92);
      glowPulse.setValue(0.35);
      sweep.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 5,
      }),
    ]).start();

    const rotationLoop = Animated.loop(
      Animated.timing(ringRotate, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      })
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(corePulse, {
            toValue: 1.08,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(glowPulse, {
            toValue: 0.85,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(corePulse, {
            toValue: 0.94,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(glowPulse, {
            toValue: 0.3,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
      ])
    );

    const sweepLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(sweep, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          isInteraction: false,
        }),
      ])
    );

    rotationLoop.start();
    pulseLoop.start();
    sweepLoop.start();

    return () => {
      rotationLoop.stop();
      pulseLoop.stop();
      sweepLoop.stop();
    };
  }, [visible, fade, contentScale, ringRotate, corePulse, glowPulse, sweep]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: fade }]}>
        <View style={styles.backdrop}>
          {STARS.map((star, index) => (
            <TwinkleStar key={`${star.top}-${star.left}-${index}`} star={star} />
          ))}

          <Animated.View
            style={[
              styles.content,
              {
                transform: [{ scale: contentScale }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.glow,
                {
                  opacity: glowPulse,
                  transform: [{ scale: corePulse }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.ringOuter,
                {
                  borderColor: 'rgba(59,130,246,0.35)',
                  transform: [{ rotate: ringSpin }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.ringInner,
                {
                  borderColor: 'rgba(168,85,247,0.35)',
                  transform: [{ rotate: ringSpin }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.core,
                {
                  backgroundColor: '#60A5FA',
                  transform: [{ scale: corePulse }],
                },
              ]}
            />

            <View style={styles.sweepMask}>
              <Animated.View
                style={[
                  styles.sweepLine,
                  {
                    transform: [{ translateX: sweepTranslate }, { rotate: '-20deg' }],
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontFamily: fonts.family.aldrich,
                },
              ]}
            >
              {title}
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  fontFamily: fonts.family.aldrich,
                },
              ]}
            >
              {subtitle}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.28)',
  },
  ringOuter: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  ringInner: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 999,
    borderWidth: 2,
  },
  core: {
    width: 34,
    height: 34,
    borderRadius: 999,
    shadowColor: '#60A5FA',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  sweepMask: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweepLine: {
    width: 64,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    position: 'absolute',
    bottom: -8,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  subtitle: {
    position: 'absolute',
    bottom: -34,
    fontSize: 11,
    textAlign: 'center',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  star: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
}); 