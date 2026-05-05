import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { WelcomeMessage } from '@/components/organisms/WelcomeMessage';
import { MenuButton } from '@/components/molecules/MenuButton';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  FindMatchIcon,
  CreateMatchIcon,
  TutorialsIcon,
  RewardsIcon,
  MissionsIcon,
} from '@/components/svg/menuIcons';

// ── Barra de nível ─────────────────────────────────────────────
function LevelBar({ level = 7, current = 650, max = 1000 }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <View style={levelStyles.wrapper}>
      <View style={levelStyles.labelRow}>
        <Text style={levelStyles.label}>Nível {level}</Text>
        <Text style={levelStyles.xp}>{current} / {max} XP</Text>
      </View>
      <View style={levelStyles.track}>
        <View style={[levelStyles.fill, { width: `${pct}%` as any }]} />
      </View>
    </View>
  );
}

const levelStyles = StyleSheet.create({
  wrapper: { marginTop: 8, marginBottom: 16, paddingHorizontal: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 12, fontWeight: '600', color: '#60A5FA' },
  xp: { fontSize: 11, color: '#94A3B8' },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.15)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 999, backgroundColor: '#3B82F6' },
});

// ── Menu inferior ──────────────────────────────────────────────
type BottomTab = 'home' | 'friends' | 'ranking' | 'profile';

const TABS: { key: BottomTab; label: string; icon: string }[] = [
  { key: 'home',    label: 'Início',  icon: 'home-outline' },
  { key: 'friends', label: 'Amigos',  icon: 'people-outline' },
  { key: 'ranking', label: 'Ranking', icon: 'trophy-outline' },
  { key: 'profile', label: 'Perfil',  icon: 'person-outline' },
];

function BottomNav({
  active,
  onChange,
  backgroundColor,
}: {
  active: BottomTab;
  onChange: (tab: BottomTab) => void;
  backgroundColor: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[navStyles.bar, { backgroundColor, paddingBottom: insets.bottom || 16 }]}>
      {TABS.map((t) => {
        const focused = active === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            style={navStyles.tab}
            onPress={() => onChange(t.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
          >
            <Ionicons
              name={(focused ? t.icon.replace('-outline', '') : t.icon) as any}
              size={22}
              color={focused ? '#3B82F6' : '#64748B'}
            />
            <Text style={[navStyles.label, focused && navStyles.labelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const navStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,130,246,0.18)',
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 11, color: '#64748B' },
  labelActive: { color: '#3B82F6', fontWeight: '600' },
});

// ── Tela ───────────────────────────────────────────────────────
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
  const [activeTab, setActiveTab] = React.useState<BottomTab>('home');

  const cardStyle = {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.22)',
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Encontrar partida',
      icon: <FindMatchIcon color="#3B82F6" size={48} />,
      onPress: () => null,
      disabled: false,
    },
    {
      title: 'Criar partida',
      icon: <CreateMatchIcon color="#E91E63" size={48} />,
      onPress: () => null,
      disabled: false,
    },
    {
      title: 'Tutoriais',
      icon: <TutorialsIcon color="#A855F7" size={56} />,
      onPress: () => navigation.navigate(Paths.Tutorial),
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

  return (
    <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
      <ScrollView
        style={layout.flex_1}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 16,
        }}
      >
        <HomeHeader />
        <WelcomeMessage />
        <LevelBar level={7} current={650} max={1000} />

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            paddingHorizontal: 16,
            marginTop: 4,
          }}
        >
          {menuItems.map((item) => (
            <MenuButton
              key={item.title}
              title={item.title}
              icon={item.icon}
              onPress={() => handlePress(item)}
              comingSoon={item.disabled}
              style={[
                cardStyle,
                item.disabled && { opacity: 0.45 },
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNav
        active={activeTab}
        onChange={setActiveTab}
        backgroundColor={colors.background}
      />
    </View>
  );
}