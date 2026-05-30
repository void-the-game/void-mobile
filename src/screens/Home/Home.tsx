import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { WelcomeMessage } from '@/components/organisms/WelcomeMessage';
import { MenuButton } from '@/components/molecules/MenuButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  FindMatchIcon,
  TutorialsIcon,
  RewardsIcon,
  MissionsIcon,
  RoomJoinIcon,
} from '@/components/svg/menuIcons';
import { BottomNav, BottomTab } from '@/components/organisms/BottomNav';
import { storage } from '@/services/storage';
import { apiDev } from '@/services/api';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';

function LevelBar({ level = 7, current = 650, max = 1000 }) {
  const pct = Math.min((current / max) * 100, 100);

  return (
    <View style={levelStyles.wrapper}>
      <View style={levelStyles.labelRow}>
        <Text style={levelStyles.label}>Nível {level}</Text>
        <Text style={levelStyles.xp}>
          {current} / {max} XP
        </Text>
      </View>

      <View style={levelStyles.track}>
        <View style={[levelStyles.fill, { width: `${pct}%` as any }]} />
      </View>
    </View>
  );
}

const levelStyles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 12,
    fontWeight: '600',
    color: '#60A5FA',
  },
  xp: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 11,
    color: '#94A3B8',
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.15)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#3B82F6',
  },
});

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  disabled: boolean;
};

export default function HomeScreen() {
  const { layout, colors } = useTheme();
  const navigation = useNavigation<RootScreenProps<Paths.Home>['navigation']>();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<BottomTab>('home');
  const [profile, setProfile] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const userId = await storage.getUserId();
          const token = await storage.getToken();
          if (!userId || !token) return;

          const response = await apiDev.get(`/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success && response.data.profile) {
            setProfile(response.data.profile);
          }
        } catch (error: any) {
          console.log('Error fetching profile in Home:', error.message);
        }
      };

      fetchProfile();
    }, []),
  );

  const cardStyle = {
    backgroundColor: colors.cardBackground,
    borderColor: colors.cardBorder,
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Jogar agora',
      icon: <FindMatchIcon color="#E91E63" size={48} />,
      onPress: () => {
        Toast.show({
          type: 'info',
          text1: 'Em breve',
          text2: 'O matchmaking rápido estará disponível nas próximas versões.',
          visibilityTime: 2500,
        });
      },
      disabled: false,
    },
    {
      title: 'Salas',
      icon: <RoomJoinIcon color="#3B82F6" size={48} />,
      onPress: () => navigation.navigate(Paths.Lobby, undefined as any),
      disabled: false,
    },
    {
      title: 'Tutoriais',
      icon: <TutorialsIcon color="#A855F7" size={56} />,
      onPress: () =>
        navigation.navigate(Paths.Tutorial, { returnToHome: true }),
      disabled: false,
    },
    {
      title: 'Recompensas diárias',
      icon: <RewardsIcon color="#F59E0B" size={48} />,
      onPress: () => null,
      disabled: true,
    },
    {
      title: 'Missões',
      icon: <MissionsIcon color="#F59E0B" size={48} />,
      onPress: () => null,
      disabled: true,
    },
  ];

  const handlePress = (item: MenuItem) => {
    if (item.disabled) {
      Toast.show({
        type: 'info',
        text1: 'Em breve!',
        text2: 'Desculpe, ainda estamos trabalhando nisso..',
        visibilityTime: 2500,
      });
      return;
    }

    item.onPress();
  };

  const handleTabChange = (tab: BottomTab) => {
    if (tab === 'profile') {
      navigation.navigate(Paths.EditProfile, undefined as any);
      return;
    }

    setActiveTab(tab);
  };

  return (
    <SpaceBackgroundWrapper>
      <View style={layout.flex_1}>
        <HomeHeader />

        <ScrollView
          style={layout.flex_1}
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{
            paddingBottom: 96 + insets.bottom,
          }}
        >
          <WelcomeMessage
            avatar={profile?.avatar}
            username={profile?.nickname}
          />
          <LevelBar
            level={profile?.level ?? 1}
            current={profile?.points ?? 0}
            max={1000}
          />

          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <MenuButton
                key={item.title}
                title={item.title}
                icon={item.icon}
                onPress={() => handlePress(item)}
                comingSoon={item.disabled}
                style={[cardStyle, item.disabled && { opacity: 0.45 }]}
              />
            ))}
          </View>
        </ScrollView>

        <BottomNav
          active={activeTab}
          onChange={handleTabChange}
          backgroundColor="transparent"
        />
      </View>
    </SpaceBackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
