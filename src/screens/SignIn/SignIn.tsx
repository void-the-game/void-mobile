import { AuthFormContainer } from '@/components/organisms/AuthFormContainer';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { useTheme } from '@/theme/hooks/useTheme';
import { View, Image } from 'react-native';
import { VoidHeader } from '@/components/atoms/VoidHeader';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiDev } from '@/services/api';
import Toast from 'react-native-toast-message';
import { useState } from 'react';
import { storage } from '@/services/storage';
import { updateSocketToken } from '@/services/socket';

type Navigation = StackNavigationProp<RootStackParamList>;

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const { colors, layout, spacing } = useTheme();
  const navigation = useNavigation<Navigation>();
  const [isLoading, setIsLoading] = useState(false);

  const shipIcon = (
    <Image
      source={require('@/assets/images/spaceship.webp')}
      style={{ width: 20, height: 20, tintColor: colors.text }}
    />
  );

  const schema = yup.object().shape({
    email: yup.string().required('Campo Obrigatório').email('E-mail inválido'),
    password: yup.string().required('Campo Obrigatório'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleSignIn = (data: SignInFormData) => {
    setIsLoading(true);
    apiDev
      .post('/user/login', data)
      .then(async (resp) => {
        const { accessToken, username, id } = resp.data;

        await storage.saveToken(accessToken);
        await storage.saveUser(username);
        await storage.saveUserId(id);

        // Atualiza o token no socket existente e força reconexão com o novo usuário
        updateSocketToken(accessToken);

        try {
          // Checa se o usuário já tem um profile
          await apiDev.get(`/profile/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          // Se rodou sem erro (status 200), ele já tem o profile, vai pra Home direto
          setIsLoading(false);
          navigation.navigate(Paths.Home);
          Toast.show({
            type: 'success',
            text1: 'Bem-vindo(a) a bordo!',
            text2: 'Agora é só aproveitar o app.',
          });
        } catch {
          // Se falhou (teoricamente 404), ele manda pra criação de perfil
          setIsLoading(false);
          navigation.navigate(Paths.SetupProfile);
        }
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'Login inválido.',
          text2: 'Confira as informações e tente novamente.',
        });
        setIsLoading(false);
      });
  };

  return (
    <SpaceBackgroundWrapper>
      <View style={[layout.flex_1, spacing.px_xl]}>
        <View style={[layout.itemsCenter]}>
          <VoidHeader />
          <AuthFormContainer
            footer={
              <View style={[spacing.mt_xl, layout.itemsCenter, { gap: 12 }]}>
                <Button
                  title={isLoading ? 'Entrando' : 'Entrar'}
                  onPress={handleSubmit(handleSignIn)}
                  disabled={isLoading}
                />
                <View
                  style={{
                    height: 3,
                    backgroundColor: colors.primary,
                    width: 200,
                  }}
                />
                <Button
                  title="Criar conta"
                  onPress={() => navigation.navigate(Paths.SignUp)}
                />
              </View>
            }
          >
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
                  rightIcon={shipIcon}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Senha"
                  withCustomFormat
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  rightIcon={shipIcon}
                />
              )}
            />
            <View style={layout.selfStart}>
              <Link style={[spacing.mr_sm, spacing.ml_lg]}>
                Esqueci a senha
              </Link>
            </View>
          </AuthFormContainer>
        </View>
      </View>
    </SpaceBackgroundWrapper>
  );
}
