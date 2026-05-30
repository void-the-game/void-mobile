import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';
import { useTheme } from '@/theme/hooks/useTheme';

type Navigation = StackNavigationProp<RootStackParamList>;

export default function TutorialPrompt() {
  const navigation = useNavigation<Navigation>();
  const { fonts, gutters } = useTheme();

  return (
    <SpaceBackgroundWrapper>
      <View style={[styles.content, { paddingHorizontal: gutters.lg }]}>
        <Text style={[styles.title, { fontFamily: fonts.family.aldrich }]}>
          Tutorial Void
        </Text>
        <Text
          style={[styles.description, { fontFamily: fonts.family.aldrich }]}
        >
          Antes de começar sua primeira partida, que tal ver um rápido tutorial
          sobre as regras e controles do jogo?
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() =>
              navigation.reset({
                index: 1,
                routes: [
                  { name: Paths.Home },
                  { name: Paths.Tutorial, params: { returnToHome: true } },
                ],
              })
            }
          >
            <Text
              style={[
                styles.buttonText,
                styles.primaryText,
                { fontFamily: fonts.family.aldrich },
              ]}
            >
              Sim, quero o tutorial
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: Paths.Home }],
              })
            }
          >
            <Text
              style={[
                styles.buttonText,
                styles.secondaryText,
                { fontFamily: fonts.family.aldrich },
              ]}
            >
              Não, ir para a casa
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SpaceBackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonGroup: {
    gap: 14,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  buttonText: {
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#A5B4FC',
    fontWeight: '600',
  },
});
