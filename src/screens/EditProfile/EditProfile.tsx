import { AuthFormContainer } from '@/components/organisms/AuthFormContainer';
import { Input } from '@/components/atoms/Input';
import { useTheme } from '@/theme/hooks/useTheme';
import { View, Alert, TouchableOpacity, Text } from 'react-native';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { storage } from '@/services/storage';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { apiDev } from '@/services/api';

type Navigation = StackNavigationProp<RootStackParamList>;

type EditProfileFormData = {
  username?: string;
  email?: string;
  password?: string;
};

export default function EditProfile() {
  const { colors, layout, spacing, fonts } = useTheme();
  const navigation = useNavigation<Navigation>();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarColor] = useState('#10B981');

  // Schema de validação (campos opcionais)
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

  const handleSelectAvatar = () => {
    Toast.show({
      type: 'info',
      text1: 'Em breve!',
      text2: 'Seleção de avatar será implementada em breve.',
    });
  };

  const handleUpdate = async (data: EditProfileFormData) => {
    const updateData: any = {};
    if (data.username && data.username.trim()) {
      updateData.username = data.username.trim();
    }
    if (data.email && data.email.trim()) {
      updateData.email = data.email.trim();
    }
    if (data.password && data.password.trim()) {
      updateData.password = data.password.trim();
    }

    // Se nenhum campo foi alterado
    if (Object.keys(updateData).length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Nenhuma alteração',
        text2: 'Você não alterou nenhum campo.',
      });
      return;
    }

    setIsLoading(true);

    const userId = await storage.getUserId();
    const token = await storage.getToken();

    apiDev
      .patch(`/user/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (resp) => {
        const { username } = resp.data.user;

        await storage.saveUser(username);

        setIsLoading(false);

        navigation.goBack();
        Toast.show({
          type: 'success',
          text1: 'Perfil atualizado!',
          text2: 'Suas informações foram atualizadas com sucesso.',
        });
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar',
          text2: err.response?.data?.message || 'Tente novamente mais tarde.',
        });
        setIsLoading(false);
      });
  };

  const handleDelete = () => {
    Alert.alert(
      'Deletar conta',
      'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    setIsLoading(true);

    const userId = await storage.getUserId();
    const token = await storage.getToken();

    apiDev
      .delete(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (_) => {
        await storage.clearAll();

        setIsLoading(false);
        navigation.navigate(Paths.SignIn);

        Toast.show({
          type: 'success',
          text1: 'Conta deletada',
          text2: 'Sua conta foi removida com sucesso.',
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'Erro ao deletar',
          text2: err.response?.data?.message || 'Tente novamente mais tarde.',
        });
        setIsLoading(false);
      });
  };

  return (
    <SpaceBackgroundWrapper>
      <View style={[layout.flex_1, spacing.px_xl]}>
        <View
          style={[
            layout.row,
            layout.itemsCenter,
            layout.justifyBetween,
            spacing.py_lg,
            spacing.pt_md,
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="menu" size={28} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="bell" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[layout.itemsCenter]}>
          <View style={[layout.itemsCenter, spacing.my_2xl]}>
            <View style={{ position: 'relative' }}>
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: '#3B82F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <AstronautIcon color={avatarColor} size={100} />
              </View>
              <TouchableOpacity
                onPress={handleSelectAvatar}
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#A855F7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: colors.background,
                }}
              >
                <Feather name="edit-2" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                spacing.mt_sm,
                {
                  fontFamily: fonts.family.aldrich,
                  fontSize: fonts.size.sm,
                  color: colors.text,
                },
              ]}
            >
              Alterar foto de perfil
            </Text>
          </View>

          <View style={spacing.mb_xl} />

          <AuthFormContainer
            footer={
              <View style={[spacing.mt_xl, layout.itemsCenter, { gap: 16 }]}>
                <TouchableOpacity
                  onPress={handleSubmit(handleUpdate)}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#3B82F6',
                    paddingHorizontal: 48,
                    paddingVertical: 16,
                    borderRadius: 999,
                    width: '100%',
                    alignItems: 'center',
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather
                      name="save"
                      size={20}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.family.aldrich,
                        fontSize: fonts.size.md,
                        color: 'white',
                        fontWeight: '600',
                      }}
                    >
                      {isLoading ? 'Salvando...' : 'Salvar alterações'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={isLoading}
                  style={{
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: '#EF4444',
                    paddingHorizontal: 60,
                    paddingVertical: 16,
                    borderRadius: 999,
                    width: '100%',
                    alignItems: 'center',
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather
                      name="trash-2"
                      size={20}
                      color="#EF4444"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.family.aldrich,
                        fontSize: fonts.size.md,
                        color: '#EF4444',
                        fontWeight: '600',
                      }}
                    >
                      Deletar conta
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
          >
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Nome de usuário"
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
          </AuthFormContainer>
        </View>
      </View>
    </SpaceBackgroundWrapper>
  );
}
