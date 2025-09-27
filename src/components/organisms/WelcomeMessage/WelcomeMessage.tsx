import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { Text } from '@/components/atoms/Text';

function WelcomeMessage() {
  const { layout, spacing, fonts } = useTheme();

  return (
    <View style={[layout.row, layout.itemsEnd, layout.selfEnd, spacing.my_lg]}>
      <View style={styles.bubble}>
        <Text
          style={[
            fonts.style.alignCenter,
            { fontFamily: fonts.family.aldrich, color: '#000' },
          ]}
        >
          Bem vindo de volta tripulante!
        </Text>
        <View style={styles.tail} />
      </View>
      <Image
        source={require('@/assets/images/characters/astronaut-head.webp')}
        style={{ width: 50, height: 50, marginLeft: 10 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderRadius: 12,
    position: 'relative',
    maxWidth: 200,
  },
  tail: {
    position: 'absolute',
    right: -10,
    bottom: 5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E0E0E0',
    transform: [{ rotate: '60deg' }],
  },
});

export default WelcomeMessage;
