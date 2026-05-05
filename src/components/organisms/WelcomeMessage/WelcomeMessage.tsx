import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { storage } from '@/services/storage';
import { useFocusEffect } from '@react-navigation/native';
import { AstronautIcon } from '@/components/svg/svgIcons';

function WelcomeMessage() {
  const { fonts } = useTheme();
  const [username, setUsername] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const loadUsername = async () => {
        const user = await storage.getUser();
        if (user) setUsername(user);
      };
      loadUsername();
    }, []),
  );

  return (
    <View style={styles.wrapper}>
      <AstronautIcon
        color="#3B82F6"
        armColor="#093075"
        armStrokeColor="#3B82F6"
        size={64}
      />
      <View style={styles.bubbleWrapper}>
        <View style={styles.bubble}>
          <Text style={[styles.greeting, { fontFamily: fonts.family.aldrich }]}>
            Bem-vindo(a) de volta,
          </Text>
          <Text style={[styles.username, { fontFamily: fonts.family.aldrich }]}>
            {username || 'Tripulante'} 👾
          </Text>
          <View style={styles.tail} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flex: 1,
    gap: 6,
  },
  bubble: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderTopLeftRadius: 2,
  },
  tail: {
    position: 'absolute',
    left: -8,
    top: 12,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'rgba(59,130,246,0.35)',
  },
  greeting: {
    fontSize: 11,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  username: {
    fontSize: 15,
    color: '#E2E8F0',
    fontWeight: '700',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 2,
  },
});

export default WelcomeMessage;
