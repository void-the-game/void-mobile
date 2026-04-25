import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { Text } from '@/components/atoms/Text';
import Icon from 'react-native-vector-icons/Feather';
import { storage } from '@/services/storage';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75; // 75% da largura da tela

type Navigation = StackNavigationProp<RootStackParamList>;

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const { colors, spacing, fonts } = useTheme();
  const navigation = useNavigation<Navigation>();
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleLogout = async () => {
    try {
      await storage.clearAll();

      Toast.show({
        type: 'success',
        text1: 'Até logo!',
        text2: 'Você foi desconectado com sucesso.',
      });

      onClose();
      navigation.navigate(Paths.SignIn);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao sair',
        text2: 'Tente novamente.',
      });
    }
  };

  const menuItems = [
    {
      icon: 'settings',
      label: 'Configurações',
      onPress: () => {
        onClose();
        Toast.show({
          type: 'info',
          text1: 'Em breve!',
          text2: 'Configurações serão implementadas em breve.',
        });
      },
    },
    {
      icon: 'help-circle',
      label: 'Ajuda',
      onPress: () => {
        onClose();
        Toast.show({
          type: 'info',
          text1: 'Em breve!',
          text2: 'Central de ajuda será implementada em breve.',
        });
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: colors.background,
              transform: [{ translateX: slideAnim }],
              borderRightWidth: 1,
              borderRightColor: colors.primary,
            },
          ]}
        >
          <View
            style={[
              styles.header,
              spacing.p_xl,
              { borderBottomWidth: 1, borderBottomColor: colors.primary },
            ]}
          >
            <Text
              style={{
                fontFamily: fonts.family.aldrich,
                fontSize: fonts.size.xl,
                color: colors.text,
              }}
            >
              Menu
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[spacing.p_lg, { flex: 1 }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                style={[
                  styles.menuItem,
                  spacing.p_md,
                  spacing.mb_sm,
                  {
                    backgroundColor: colors.background,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.primary + '40',
                  },
                ]}
              >
                <Icon name={item.icon} size={20} color={colors.text} />
                <Text
                  style={{
                    fontFamily: fonts.family.aldrich,
                    fontSize: fonts.size.md,
                    color: colors.text,
                    marginLeft: 16,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[spacing.p_lg, spacing.pb_2xl]}>
            <TouchableOpacity
              onPress={handleLogout}
              style={[
                styles.logoutButton,
                spacing.p_md,
                {
                  backgroundColor: '#EF4444',
                  borderRadius: 8,
                },
              ]}
            >
              <Icon name="log-out" size={20} color="white" />
              <Text
                style={{
                  fontFamily: fonts.family.aldrich,
                  fontSize: fonts.size.md,
                  color: 'white',
                  marginLeft: 16,
                  fontWeight: '600',
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
