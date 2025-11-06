import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { VoidHeader } from '@/components/atoms/VoidHeader';
import { AuthFormContainer } from '@/components/organisms/AuthFormContainer';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';
import { useTheme } from '@/theme/hooks/useTheme';
import { View } from 'react-native';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import { apiDev } from '@/services/api';
import { Paths } from '@/navigation/paths';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type Navigation = StackNavigationProp<RootStackParamList>;

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignUp() {
  const { layout, spacing } = useTheme();
  const navigation = useNavigation<Navigation>();

  const schema = yup.object().shape({
    username: yup.string().required('Campo Obrigatório'),
    email: yup.string().required('Campo Obrigatório').email('E-mail inválido'),
    password: yup.string().required('Campo Obrigatório'),
    passwordConfirm: yup
      .string()
      .required('Campo Obrigatório')
      .oneOf([yup.ref('password')], 'As senhas devem coincidir'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleSignUp = (data: SignUpFormData) => {
    const registerData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    apiDev
      .post('/user/create', registerData)
      .then(() => {
        navigation.navigate(Paths.SignIn);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <SpaceBackgroundWrapper>
      <View style={[layout.flex_1, spacing.px_xl]}>
        <View style={[layout.itemsCenter]}>
          <VoidHeader />
          <AuthFormContainer
            footer={
              <Button
                title="Criar conta"
                onPress={handleSubmit(handleSignUp)}
              />
            }
          >
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
                  placeholder="Senha"
                  withCustomFormat
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Confirmar Senha"
                  withCustomFormat
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.passwordConfirm?.message}
                />
              )}
            />
          </AuthFormContainer>
        </View>
      </View>
    </SpaceBackgroundWrapper>
  );
}
