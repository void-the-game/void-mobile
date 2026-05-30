import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { useFonts, Aldrich_400Regular } from '@expo-google-fonts/aldrich';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const GAME_COLORS = {
  background: '#020408',
  surface: '#1F2937',
  black: '#000000',
  white: '#FFFFFF',
  green: '#10B981',
  blue: '#3B82F6',
  orange: '#F59E0B',
  purple: '#A855F7',
  transparentFix: 'rgba(0,0,0,0.01)',
};

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  delay: number;
  duration: number;
}

interface Shard {
  x: number;
  height: number;
  color: string;
  anim: Animated.Value;
  delay: number;
  duration: number;
  rotate: string;
}

function useStars(count: number): Star[] {
  const [stars] = useState<Star[]>(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      size: Math.random() < 0.7 ? 1 : Math.random() < 0.8 ? 1.5 : 2.5,
      opacity: new Animated.Value(Math.random() * 0.3 + 0.1),
      delay: Math.random() * 4000,
      duration: (2 + Math.random() * 4) * 1000,
    })),
  );

  return stars;
}

function useShards(count: number): Shard[] {
  const shardColors = [
    'rgba(16,185,129,0.40)',
    'rgba(59,130,246,0.38)',
    'rgba(245,158,11,0.32)',
    'rgba(168,85,247,0.32)',
    'rgba(255,255,255,0.18)',
  ];

  const [shards] = useState<Shard[]>(() =>
    Array.from({ length: count }, () => ({
      x: 5 + Math.random() * 90,
      height: 14 + Math.random() * 38,
      color: shardColors[Math.floor(Math.random() * shardColors.length)],
      anim: new Animated.Value(0),
      delay: Math.random() * 6000,
      duration: (5 + Math.random() * 8) * 1000,
      rotate: `${-15 + Math.random() * 30}deg`,
    })),
  );

  return shards;
}

interface Props {
  onFinish: () => void;
  duration?: number;
}

export function VoidLoadingScreen({ onFinish, duration = 3200 }: Props) {
  const [fontsLoaded] = useFonts({
    Aldrich_400Regular,
  });

  const ring1Rot = useRef(new Animated.Value(0)).current;
  const ring2Rot = useRef(new Animated.Value(0)).current;
  const ring3Rot = useRef(new Animated.Value(0)).current;
  const ring4Rot = useRef(new Animated.Value(0)).current;

  const coreGlow = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(10)).current;
  const titleScale = useRef(new Animated.Value(1.04)).current;

  const barWidth = useRef(new Animated.Value(0)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;

  const blackHole1Rot = useRef(new Animated.Value(0)).current;
  const blackHole2Rot = useRef(new Animated.Value(0)).current;
  const blackHole3Rot = useRef(new Animated.Value(0)).current;

  const blackHole1Pulse = useRef(new Animated.Value(0.92)).current;
  const blackHole2Pulse = useRef(new Animated.Value(0.95)).current;
  const blackHole3Pulse = useRef(new Animated.Value(0.9)).current;

  const stars = useStars(70);
  const shards = useShards(10);

  const BAR_MAX_WIDTH = 220;

  useEffect(() => {
    Animated.loop(
      Animated.timing(ring1Rot, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(ring2Rot, {
        toValue: 1,
        duration: 4600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(ring3Rot, {
        toValue: 1,
        duration: 6200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(ring4Rot, {
        toValue: 1,
        duration: 7600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(coreGlow, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(coreGlow, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(blackHole1Rot, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(blackHole2Rot, {
        toValue: 1,
        duration: 11000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(blackHole3Rot, {
        toValue: 1,
        duration: 13000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blackHole1Pulse, {
          toValue: 1.04,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(blackHole1Pulse, {
          toValue: 0.92,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blackHole2Pulse, {
          toValue: 1.03,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(blackHole2Pulse, {
          toValue: 0.95,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blackHole3Pulse, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(blackHole3Pulse, {
          toValue: 0.9,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    stars.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(star.delay),
          Animated.timing(star.opacity, {
            toValue: 1,
            duration: star.duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.15,
            duration: star.duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    shards.forEach((shard) => {
      const loop = () => {
        shard.anim.setValue(0);

        Animated.sequence([
          Animated.delay(shard.delay),
          Animated.timing(shard.anim, {
            toValue: 1,
            duration: shard.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start(loop);
      };

      loop();
    });

    Animated.delay(250).start(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 850,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 850,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleScale, {
          toValue: 1,
          duration: 850,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });

    Animated.delay(1100).start(() => {
      Animated.timing(barOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.delay(150),
        Animated.timing(barWidth, {
          toValue: BAR_MAX_WIDTH,
          duration: 2300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: false,
        }),
      ]).start();
    });

    const finishTimer = setTimeout(onFinish, duration);

    return () => {
      clearTimeout(finishTimer);
    };
  }, [
    barOpacity,
    barWidth,
    blackHole1Pulse,
    blackHole1Rot,
    blackHole2Pulse,
    blackHole2Rot,
    blackHole3Pulse,
    blackHole3Rot,
    coreGlow,
    duration,
    onFinish,
    ring1Rot,
    ring2Rot,
    ring3Rot,
    ring4Rot,
    shards,
    stars,
    titleOpacity,
    titleScale,
    titleTranslateY,
  ]);

  const ring1Spin = ring1Rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ring2Spin = ring2Rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const ring3Spin = ring3Rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ring4Spin = ring4Rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const coreGlowOpacity = coreGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });

  const blackHole1Spin = blackHole1Rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const blackHole2Spin = blackHole2Rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const blackHole3Spin = blackHole3Rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.root}>
      {stars.map((star, i) => (
        <Animated.View
          key={i}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: star.opacity,
            },
          ]}
        />
      ))}

      {shards.map((shard, i) => {
        const translateY = shard.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, SCREEN_HEIGHT + 20],
        });

        const opacity = shard.anim.interpolate({
          inputRange: [0, 0.08, 0.9, 1],
          outputRange: [0, 1, 1, 0],
        });

        return (
          <Animated.View
            key={`shard-${i}`}
            style={[
              styles.shard,
              {
                left: `${shard.x}%` as any,
                height: shard.height,
                backgroundColor: shard.color,
                transform: [{ translateY }, { rotate: shard.rotate }],
                opacity,
              },
            ]}
          />
        );
      })}

      <View style={styles.blackHole1}>
        <Animated.View
          style={[
            styles.blackHolePulseWrap,
            { transform: [{ scale: blackHole1Pulse }] },
          ]}
        >
          <View style={styles.bhGlowLarge} />
          <Animated.View
            style={[
              styles.bhAccretionLargeGreen,
              { transform: [{ rotate: blackHole1Spin }] },
            ]}
          />
          <View style={styles.bhDustLarge} />
          <View style={styles.bhCoreLarge} />
        </Animated.View>
      </View>

      <View style={styles.blackHole2}>
        <Animated.View
          style={[
            styles.blackHolePulseWrap,
            { transform: [{ scale: blackHole2Pulse }] },
          ]}
        >
          <View style={styles.bhGlowMedium} />
          <Animated.View
            style={[
              styles.bhAccretionMediumBlue,
              { transform: [{ rotate: blackHole2Spin }] },
            ]}
          />
          <View style={styles.bhDustMedium} />
          <View style={styles.bhCoreMedium} />
        </Animated.View>
      </View>

      <View style={styles.blackHole3}>
        <Animated.View
          style={[
            styles.blackHolePulseWrap,
            { transform: [{ scale: blackHole3Pulse }] },
          ]}
        >
          <View style={styles.bhGlowSmall} />
          <Animated.View
            style={[
              styles.bhAccretionSmallPurple,
              { transform: [{ rotate: blackHole3Spin }] },
            ]}
          />
          <View style={styles.bhDustSmall} />
          <View style={styles.bhCoreSmall} />
        </Animated.View>
      </View>

      <View style={styles.portal}>
        <Animated.View
          style={[
            styles.ring,
            styles.ring1,
            { transform: [{ rotate: ring1Spin }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring2,
            { transform: [{ rotate: ring2Spin }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring3,
            { transform: [{ rotate: ring3Spin }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring4,
            { transform: [{ rotate: ring4Spin }] },
          ]}
        />

        <View style={styles.portalCore}>
          <Animated.View
            style={[styles.portalGlow, { opacity: coreGlowOpacity }]}
          />
        </View>
      </View>

      <Animated.Text
        style={[
          styles.title,
          fontsLoaded && { fontFamily: 'Aldrich_400Regular' },
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }, { scale: titleScale }],
          },
        ]}
      >
        VOID
      </Animated.Text>

      <Animated.View style={[styles.barContainer, { opacity: barOpacity }]}>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]}>
            <View style={styles.barDot} />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GAME_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  star: {
    position: 'absolute',
    backgroundColor: GAME_COLORS.white,
    borderRadius: 99,
  },

  shard: {
    position: 'absolute',
    width: 1.5,
    top: 0,
    borderRadius: 2,
  },

  blackHolePulseWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  blackHole1: {
    position: 'absolute',
    top: 84,
    left: -24,
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },

  blackHole2: {
    position: 'absolute',
    bottom: 122,
    right: -8,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  blackHole3: {
    position: 'absolute',
    top: '60%',
    left: '8%',
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bhGlowLarge: {
    position: 'absolute',
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  bhGlowMedium: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.4,
    borderColor: 'rgba(255,255,255,0.055)',
  },

  bhGlowSmall: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  bhAccretionLargeGreen: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: GAME_COLORS.transparentFix,
    borderTopColor: 'rgba(16,185,129,0.26)',
    borderRightColor: 'rgba(59,130,246,0.22)',
    borderBottomColor: 'rgba(245,158,11,0.14)',
  },

  bhAccretionMediumBlue: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: GAME_COLORS.transparentFix,
    borderBottomColor: 'rgba(59,130,246,0.24)',
    borderLeftColor: 'rgba(168,85,247,0.18)',
    borderTopColor: 'rgba(255,255,255,0.06)',
  },

  bhAccretionSmallPurple: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: GAME_COLORS.transparentFix,
    borderTopColor: 'rgba(168,85,247,0.20)',
    borderLeftColor: 'rgba(59,130,246,0.16)',
  },

  bhDustLarge: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  bhDustMedium: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },

  bhDustSmall: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  bhCoreLarge: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: GAME_COLORS.black,
  },

  bhCoreMedium: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GAME_COLORS.black,
  },

  bhCoreSmall: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GAME_COLORS.black,
  },

  portal: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },

  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
  },

  ring1: {
    width: 160,
    height: 160,
    borderColor: GAME_COLORS.transparentFix,
    borderTopColor: GAME_COLORS.green,
    borderRightColor: GAME_COLORS.green,
  },

  ring2: {
    width: 136,
    height: 136,
    borderColor: GAME_COLORS.transparentFix,
    borderTopColor: GAME_COLORS.blue,
    borderRightColor: GAME_COLORS.blue,
  },

  ring3: {
    width: 112,
    height: 112,
    borderColor: GAME_COLORS.transparentFix,
    borderTopColor: GAME_COLORS.orange,
    borderRightColor: GAME_COLORS.orange,
  },

  ring4: {
    width: 88,
    height: 88,
    borderColor: GAME_COLORS.transparentFix,
    borderTopColor: GAME_COLORS.purple,
    borderRightColor: GAME_COLORS.purple,
  },

  portalCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: GAME_COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  portalGlow: {
    position: 'absolute',
    inset: 0,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(59,130,246,0.32)',
  },

  title: {
    fontFamily:
      Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'sans-serif-condensed',
    fontSize: 50,
    letterSpacing: 12,
    color: GAME_COLORS.white,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(59,130,246,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    marginBottom: 34,
  },

  barContainer: {
    width: 220,
    alignItems: 'center',
  },

  barTrack: {
    width: 220,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },

  barFill: {
    height: 2,
    borderRadius: 999,
    backgroundColor: GAME_COLORS.green,
  },

  barDot: {
    position: 'absolute',
    right: -4,
    top: '50%',
    marginTop: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GAME_COLORS.blue,
    shadowColor: GAME_COLORS.blue,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
