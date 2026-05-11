import { Input } from '@/components/atoms/Input';
import { useTheme } from '@/theme/hooks/useTheme';
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { storage } from '@/services/storage';
import { Feather } from '@expo/vector-icons';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { apiDev } from '@/services/api';
import { AvatarPickerModal } from '@/components/organisms/AvatarPickerModal';
import { StatCard } from '@/components/molecules/StatCard';
import { BottomNav, BottomTab } from '@/components/organisms/BottomNav';

type Navigation = StackNavigationProp<RootStackParamList>;

type EditProfileFormData = {
  username?: string;
  email?: string;
  password?: string;
};

interface ProfileData {
  userId: string;
  nickname: string;
  avatar: string;
  bio: string;
  points: number;
  level: number;
  winRate: number;
  ranking: number;
  gamesPlayed: number;
}

export default function EditProfile() {
  const { colors, layout, spacing, fonts, gutters } = useTheme();
  const navigation = useNavigation<Navigation>();
  const [isLoading, setIsLoading] = useState(false);

  // Profile State
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Profile Editable Fields
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');

  // Avatar Modal State
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  // Schema de validação (campos da conta)
  const schema = yup.object().shape({
    username: yup.string().notRequired(),
    email: yup.string().email('E-mail inválido').notRequired(),
    password: yup
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .notRequired(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(schema) as any,
  });

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const userId = await storage.getUserId();
      const token = await storage.getToken();
      if (!userId || !token) return;

      const response = await apiDev.get(`/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.profile) {
        setProfile(response.data.profile);
        setNickname(response.data.profile.nickname || '');
        setBio(response.data.profile.bio || '');
      }
    } catch (error: any) {
      console.error(
        'Erro ao buscar perfil:',
        error.response?.data || error.message,
      );
      // Se não existir perfil, talvez não precise quebrar.
    } finally {
      setLoadingProfile(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const handleTabChange = (tab: BottomTab) => {
    if (tab === 'home') {
      navigation.navigate(Paths.Home);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const userId = await storage.getUserId();
      const token = await storage.getToken();

      await apiDev.patch(
        `/profile/${userId}`,
        { nickname, bio },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Toast.show({
        type: 'success',
        text1: 'Perfil salvo!',
        text2: 'Suas informações públicas foram atualizadas.',
      });
      fetchProfile(); // recarregar dados novos
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: err.response?.data?.message || 'Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAccount = async (data: EditProfileFormData) => {
    const updateData: any = {};
    if (data.username && data.username.trim())
      updateData.username = data.username.trim();
    if (data.email && data.email.trim()) updateData.email = data.email.trim();
    if (data.password && data.password.trim())
      updateData.password = data.password.trim();

    if (Object.keys(updateData).length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Nenhuma alteração na conta fornecida.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const userId = await storage.getUserId();
      const token = await storage.getToken();

      const resp = await apiDev.patch(`/user/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.data.user?.username) {
        await storage.saveUser(resp.data.user.username);
      }

      Toast.show({ type: 'success', text1: 'Conta atualizada!' });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar conta',
        text2: err.response?.data?.message || 'Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Deletar conta',
      'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ],
    );
  };

  const confirmDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const userId = await storage.getUserId();
      const token = await storage.getToken();

      await apiDev.delete(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await storage.clearAll();
      navigation.navigate(Paths.SignIn);

      Toast.show({
        type: 'success',
        text1: 'Conta deletada',
        text2: 'Sua conta foi removida com sucesso.',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao deletar',
        text2: err.response?.data?.message || 'Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SpaceBackgroundWrapper>
      <View
        style={[
          styles.headerContainer,
          {
            paddingHorizontal: gutters.lg,
            paddingTop: gutters.xl,
            paddingBottom: gutters.sm,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: fonts.family.aldrich,
            fontSize: fonts.size.lg,
            color: '#FFF',
          }}
        >
          Meu Perfil
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: gutters.lg,
          paddingBottom: 100,
        }}
      >
        {/* ====================================================
            SEÇÃO A: PERFIL PÚBLICO & ESTATÍSTICAS
        ==================================================== */}
        <View style={styles.section}>
          {loadingProfile ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginVertical: 40 }}
            />
          ) : (
            <>
              {/* Avatar */}
              <View style={[layout.itemsCenter, spacing.my_xl]}>
                <View style={{ position: 'relative' }}>
                  <View style={styles.avatarWrapper}>
                    {profile?.avatar ? (
                      <Image
                        source={{ uri: profile.avatar }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <AstronautIcon color="#3B82F6" size={80} />
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => setAvatarModalVisible(true)}
                    style={[
                      styles.editAvatarBtn,
                      { borderColor: colors.background },
                    ]}
                  >
                    <Feather name="edit-2" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Informações Públicas Editáveis */}
              <Input
                placeholder="Nickname"
                value={nickname}
                onChangeText={setNickname}
                withCustomFormat
              />
              <View style={{ marginBottom: 12 }}>
                <Input
                  placeholder="Bio curta..."
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  maxLength={120}
                  withCustomFormat
                />
              </View>

              <TouchableOpacity
                onPress={handleUpdateProfile}
                disabled={isLoading}
                style={[
                  styles.primaryButton,
                  { opacity: isLoading ? 0.6 : 1, marginBottom: gutters.xl },
                ]}
              >
                <Feather name="save" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Salvar Nick/Bio</Text>
              </TouchableOpacity>

              {/* Estatísticas */}
              <View style={styles.statsGrid}>
                <StatCard
                  label="Nível"
                  value={profile?.level ?? 1}
                  icon={<Feather name="star" size={20} color="#3B82F6" />}
                />
                <StatCard
                  label="Pontos"
                  value={profile?.points ?? 0}
                  icon={<Feather name="award" size={20} color="#F59E0B" />}
                />
                <StatCard
                  label="Partidas"
                  value={profile?.gamesPlayed ?? 0}
                  icon={<Feather name="play" size={20} color="#A855F7" />}
                />
                <StatCard
                  label="Taxa de Vitória"
                  value={`${profile?.winRate ?? 0}%`}
                  icon={<Feather name="percent" size={20} color="#10B981" />}
                />
              </View>
              {profile?.ranking ? (
                <View style={{ width: '100%', marginBottom: 12 }}>
                  <StatCard
                    label="Ranking Global"
                    value={`#${profile.ranking}`}
                    icon={<Feather name="globe" size={20} color="#E91E63" />}
                  />
                </View>
              ) : null}
            </>
          )}
        </View>

        {/* Separador */}
        <View
          style={[
            styles.separator,
            { backgroundColor: 'rgba(255,255,255,0.1)' },
          ]}
        />

        {/* ====================================================
            SEÇÃO B: CONFIGURAÇÕES DA CONTA (O antigo EditProfile)
        ==================================================== */}
        <View style={styles.section}>
          <Text
            style={{
              fontFamily: fonts.family.aldrich,
              fontSize: fonts.size.md,
              color: colors.text,
              marginBottom: gutters.md,
            }}
          >
            Segurança da Conta
          </Text>

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Nome"
                withCustomFormat
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="E-mail"
                withCustomFormat
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Nova senha"
                withCustomFormat
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <View style={[spacing.mt_xl, layout.itemsCenter, { gap: 16 }]}>
            <TouchableOpacity
              onPress={handleSubmit(handleUpdateAccount)}
              disabled={isLoading}
              style={[styles.primaryButton, { opacity: isLoading ? 0.6 : 1 }]}
            >
              <Feather name="lock" size={20} color="white" />
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações de Conta'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteAccount}
              disabled={isLoading}
              style={[styles.dangerButton, { opacity: isLoading ? 0.6 : 1 }]}
            >
              <Feather name="trash-2" size={20} color="#EF4444" />
              <Text style={styles.dangerButtonText}>Deletar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Seleção de Avatar */}
      <AvatarPickerModal
        visible={avatarModalVisible}
        currentAvatar={profile?.avatar}
        onClose={() => setAvatarModalVisible(false)}
        onSelectAvatar={(newAvatar) => {
          if (profile) setProfile({ ...profile, avatar: newAvatar });
        }}
      />
      <BottomNav
        active="profile"
        onChange={handleTabChange}
        backgroundColor="transparent"
      />
    </SpaceBackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,130,246,0.18)',
    backgroundColor: 'transparent',
  },
  section: {
    marginTop: 16,
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 32,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59,130,246,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  editAvatarBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#EF4444',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});
