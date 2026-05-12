import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  Dimensions,
  type ImageSourcePropType,
  type TouchableOpacityProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text as ThemeText } from '@/components/atoms/Text';
import { useTheme } from '@/theme/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 12) / 2;

type MenuButtonProps = {
  title: string;
  characterImage?: ImageSourcePropType;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  comingSoon?: boolean;
} & Omit<TouchableOpacityProps, 'style'>;

function MenuButton({ title, characterImage, icon, style, comingSoon, ...props }: MenuButtonProps) {
  const { colors, fonts, gutters } = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          width: CARD_WIDTH,
          minHeight: CARD_WIDTH - 20,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          paddingHorizontal: 8,
          paddingVertical: 10,
          backgroundColor: colors.surface,
          borderRadius: gutters.md,
          borderWidth: 1,
          borderColor: '#2A2A2A',
        },
        style,
      ]}
      activeOpacity={comingSoon ? 0.4 : 0.7}
      {...props}
    >
      {icon ? (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </View>
      ) : characterImage ? (
        <Image source={characterImage} style={{ width: 48, height: 48 }} resizeMode="contain" />
      ) : null}

      <ThemeText
        style={{
          fontFamily: fonts.family.aldrich,
          fontSize: fonts.size.md,
          textAlign: 'center',
          width: '100%',
        }}
        numberOfLines={2}
        ellipsizeMode="clip"
      >
        {title}
      </ThemeText>

      {comingSoon && (
        <View style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(59,130,246,0.15)',
          borderWidth: 1,
          borderColor: 'rgba(59,130,246,0.35)',
          borderRadius: 999,
          paddingHorizontal: 6,
          paddingVertical: 2,
        }}>
          <Text style={{ fontSize: 9, color: '#60A5FA', fontWeight: '700', letterSpacing: 0.5 }}>
            EM BREVE
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default MenuButton;