import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { WelcomeMessage } from '@/components/organisms/WelcomeMessage';
import { MenuButton } from '@/components/molecules/MenuButton';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { AstronautIcon } from '@/components/svg/svgIcons'; // Importe o componente

export default function HomeScreen() {
  const { layout, colors, spacing, gutters } = useTheme();
  const navigation = useNavigation<RootScreenProps<Paths.Home>['navigation']>();

  const menuItems = [
    {
      title: 'Editar perfil',
      icon: <AstronautIcon color="#10B981" size={80} />, // Verde
      onPress: () => navigation.navigate(Paths.EditProfile),
    },
    {
      title: 'Encontrar partida',
      icon: <AstronautIcon color="#3B82F6" size={80} />, // Azul
      onPress: () => null,
    },
    {
      title: 'Criar partida',
      icon: <AstronautIcon color="#E91E63" size={80} />, // Rosa
      onPress: () => null,
    },
    {
      title: 'Tutoriais',
      icon: <AstronautIcon color="#A855F7" size={80} />, // Roxo
      onPress: () => navigation.navigate(Paths.Tutorial),
    },
    {
      title: 'Recompensas diárias',
      icon: <AstronautIcon color="#EF4444" size={80} />, // Vermelho
      onPress: () => null,
    },
    {
      title: 'Missões',
      icon: <AstronautIcon color="#374151" size={80} />, // Preto/Cinza
      onPress: () => null,
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
                icon={item.icon} // Passe o icon em vez de characterImage
                onPress={item.onPress}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
