import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { apiDev } from '@/services/api';
import { storage } from '@/services/storage';
import Toast from 'react-native-toast-message';

interface Avatar {
  name: string;
  url: string;
}

interface AvatarPickerModalProps {
  visible: boolean;
  currentAvatar?: string;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string, avatarName: string) => void;
  localMode?: boolean; // Se for true, ñ manda requisição, só chama onSelectAvatar
}

export function AvatarPickerModal({
  visible,
  currentAvatar,
  onClose,
  onSelectAvatar,
  localMode = false,
}: AvatarPickerModalProps) {
  const { colors, fonts, gutters } = useTheme();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchAvatars();
    }
  }, [visible]);

  const fetchAvatars = async () => {
    try {
      setLoading(true);
      const token = await storage.getToken();
      const response = await apiDev.get('/profile/avatars', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAvatars(response.data.avatars);
      }
    } catch (error) {
      console.error('Erro ao buscar avatares', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os avatares.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (avatarItem: Avatar) => {
    if (localMode) {
      onSelectAvatar(avatarItem.url, avatarItem.name);
      onClose();
      return;
    }

    try {
      setSaving(true);
      const token = await storage.getToken();
      const userId = await storage.getUserId();

      const response = await apiDev.patch(
        `/profile/${userId}/avatar`,
        { avatarName: avatarItem.name },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        onSelectAvatar(response.data.avatarUrl, avatarItem.name);
        onClose();
        Toast.show({
          type: 'success',
          text1: 'Avatar atualizado!',
          text2: 'Sua foto de perfil foi alterada.',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar avatar', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível atualizar o avatar.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderColor: 'rgba(59,130,246,0.3)',
              borderWidth: 1,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={{
                fontFamily: fonts.family.aldrich,
                fontSize: fonts.size.md,
                color: colors.text,
              }}
            >
              Escolha seu avatar
            </Text>
            <TouchableOpacity
              onPress={onClose}
              disabled={saving}
              style={{ padding: gutters.xs }}
            >
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginTop: gutters.xl }}
              />
            ) : (
              <FlatList
                data={avatars}
                numColumns={3}
                keyExtractor={(item) => item.name}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => {
                  const isSelected = currentAvatar === item.url;
                  return (
                    <TouchableOpacity
                      disabled={saving}
                      onPress={() => handleSelect(item)}
                      style={[
                        styles.avatarContainer,
                        isSelected && {
                          borderColor: colors.primary,
                          borderWidth: 2,
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: item.url }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                      {saving && isSelected && (
                        <View style={styles.savingOverlay}>
                          <ActivityIndicator size="small" color="#FFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <Text
                    style={{
                      color: colors.text,
                      textAlign: 'center',
                      marginTop: gutters.xl,
                    }}
                  >
                    Nenhum avatar disponível.
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  avatarContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
