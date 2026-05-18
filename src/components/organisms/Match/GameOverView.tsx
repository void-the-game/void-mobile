import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function GameOverView({
  won,
  winnerName,
  myAvatar,
  onGoHome,
}: {
  won: boolean;
  winnerName: string;
  myAvatar?: string;
  onGoHome: () => void;
}) {
  const { colors, fonts, layout } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
        }}
      >
        {myAvatar ? (
          <Image
            source={{ uri: myAvatar }}
            style={[
              styles.gameOverAvatar,
              { borderColor: won ? '#10B981' : '#EF4444' },
            ]}
          />
        ) : (
          <AstronautIcon
            color={won ? '#10B981' : '#EF4444'}
            armColor={won ? '#064e3b' : '#5a0020'}
            armStrokeColor={won ? '#10B981' : '#EF4444'}
            size={100}
          />
        )}
        <Text
          style={[
            styles.gameOverTitle,
            {
              fontFamily: fonts.family.aldrich,
              color: won ? '#10B981' : '#EF4444',
            },
          ]}
        >
          {won ? '🏆 Você venceu!' : `${winnerName} venceu!`}
        </Text>
        {!won && (
          <Text
            style={[
              styles.gameOverSub,
              { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
            ]}
          >
            Boa tentativa. A próxima é sua!
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: '#3B82F6', marginTop: 40 },
          ]}
          onPress={onGoHome}
        >
          <Text
            style={[
              styles.primaryBtnText,
              { fontFamily: fonts.family.aldrich },
            ]}
          >
            Voltar ao início
          </Text>
          <Feather name="home" size={18} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gameOverAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    backgroundColor: 'rgba(59,130,246,0.15)',
  },
  gameOverTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 24,
    textAlign: 'center',
  },
  gameOverSub: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    gap: 8,
  },
  primaryBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
