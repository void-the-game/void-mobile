import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';
import { Input } from '@/components/atoms/Input';
import { useTheme } from '@/theme/hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { apiDev } from '@/services/api';
import { storage } from '@/services/storage';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AvatarPickerModal } from '@/components/organisms/AvatarPickerModal';

type Navigation = StackNavigationProp<RootStackParamList>;

export default function SetupProfile() {
  const { colors, fonts, layout, gutters, spacing } = useTheme();
  const navigation = useNavigation<Navigation>();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(
    null,
  );
  const [selectedAvatarName, setSelectedAvatarName] = useState<string | null>(
    null,
  );
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProfile = async () => {
    setIsLoading(true);
    try {
      const storedToken = await storage.getToken();
      const userId = await storage.getUserId();
      const defaultUsername = await storage.getUser();

      if (!storedToken || !userId) {
        throw new Error('Sessão inválida');
      }

      const headers = { Authorization: `Bearer ${storedToken}` };
      const finalNickname =
        nickname.trim() !== '' ? nickname.trim() : defaultUsername;

      // 1. Cria o perfil base (Manda Nickname e Bio)
      // Ajuste a rota para a correspondente na sua API, geralmente POST /profile
      await apiDev.post(
        '/profile',
        {
          nickname: finalNickname,
          bio: bio.trim(),
          userId,
        },
        { headers },
      );

      // 2. Se tiver escolhido um avatar, vincula ele na segunda chamada
      if (selectedAvatarName) {
        await apiDev.patch(
          `/profile/${userId}/avatar`,
          { avatarName: selectedAvatarName },
          { headers },
        );
      }

      Toast.show({
        type: 'success',
        text1: 'Perfil Criado!',
        text2: 'Tudo pronto para sua jornada.',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Home }],
      });
    } catch (error: any) {
      console.log('Erro ao criar perfil:', error?.response?.data || error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao configurar perfil',
        text2: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SpaceBackgroundWrapper>
      <View
        style={[
          layout.flex_1,
          { paddingHorizontal: gutters.lg, paddingTop: gutters.xl * 2 },
        ]}
      >
        <View style={{ alignItems: 'center', marginBottom: gutters.xl }}>
          <Text
            style={{
              fontFamily: fonts.family.aldrich,
              fontSize: 24,
              color: '#FFF',
            }}
          >
            Olá, Viajante!
          </Text>
          <Text
            style={{
              fontFamily: fonts.family.aldrich,
              fontSize: 14,
              color: '#94A3B8',
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            Antes de decolarmos, escolha como você quer ser visto no Void.
          </Text>
        </View>

        <View style={{ alignItems: 'center', marginBottom: gutters.xl }}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setIsAvatarModalVisible(true)}
            activeOpacity={0.8}
          >
            {selectedAvatarUrl ? (
              <Image
                source={{ uri: selectedAvatarUrl }}
                style={styles.placeholderAvatar}
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Feather name="user" size={40} color="#94A3B8" />
              </View>
            )}
            <View style={styles.editAvatarBadge}>
              <Feather name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: fonts.family.aldrich,
              fontSize: 12,
              color: colors.primary,
              marginTop: 12,
            }}
          >
            Escolher Avatar
          </Text>
        </View>

        <View style={{ gap: gutters.lg, marginBottom: gutters.xl * 2 }}>
          <View>
            <Text style={styles.label}>Nickname (Opcional)</Text>
            <Input
              withCustomFormat
              placeholder="Ex: StarLord"
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
            />
          </View>

          <View>
            <Text style={styles.label}>Bio (Opcional)</Text>
            <Input
              withCustomFormat
              placeholder="Uma breve frase sobre você..."
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={150}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleCreateProfile}
          disabled={isLoading}
          style={styles.primaryButton}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Começar a Aventura</Text>
              <Feather name="arrow-right" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>

      <AvatarPickerModal
        visible={isAvatarModalVisible}
        localMode={true}
        onClose={() => setIsAvatarModalVisible(false)}
        onSelectAvatar={(avatarUrl, avatarName) => {
          setSelectedAvatarUrl(avatarUrl);
          setSelectedAvatarName(avatarName);
          setIsAvatarModalVisible(false);
        }}
      />
    </SpaceBackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
    marginLeft: 4,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  editAvatarBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
    marginBottom: 40,
  },
  primaryButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Aldrich_400Regular',
    fontWeight: 'bold',
  },
});
