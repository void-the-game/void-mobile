import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { WelcomeMessage } from '@/components/organisms/WelcomeMessage';
import { MenuButton } from '@/components/molecules/MenuButton';

export default function HomeScreen() {
  const { layout, colors, spacing, gutters } = useTheme();

  const menuItems = [
    {
      title: 'Alterar personagem',
      image: require('@/assets/images/characters/green.webp'),
    },
    {
      title: 'Encontrar partida',
      image: require('@/assets/images/characters/blue.webp'),
    },
    {
      title: 'Criar partida',
      image: require('@/assets/images/characters/pink.webp'),
    },
    {
      title: 'Tutoriais',
      image: require('@/assets/images/characters/purple.webp'),
    },
    {
      title: 'Recompensas diárias',
      image: require('@/assets/images/characters/red.webp'),
    },
    {
      title: 'Missões',
      image: require('@/assets/images/characters/black.webp'),
    },
  ];

  return (
    <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
      <View style={layout.flex_1}>
        <ScrollView style={(layout.flex_1, spacing.mb_2xl, spacing.px_lg)}>
          <HomeHeader />
          <WelcomeMessage />

          <View
            style={[
              layout.row,
              layout.wrap,
              layout.justifyBetween,
              spacing.px_sm,
              { rowGap: gutters.xl },
            ]}
          >
            {menuItems.map((item) => (
              <MenuButton
                key={item.title}
                title={item.title}
                characterImage={item.image}
                onPress={() => null}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
