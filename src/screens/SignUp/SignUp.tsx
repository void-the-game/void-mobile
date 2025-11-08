import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { VoidHeader } from '@/components/atoms/VoidHeader';
import { AuthFormContainer } from '@/components/organisms/AuthFormContainer';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';
import { useTheme } from '@/theme/hooks/useTheme';
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import { apiDev } from '@/services/api';
import { Paths } from '@/navigation/paths';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

type Navigation = StackNavigationProp<RootStackParamList>;

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignUp() {
  const { layout, spacing, colors, fonts } = useTheme();
  const navigation = useNavigation<Navigation>();
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const validatePassword = (password: string) => {
    setPasswordErrors({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const isPasswordValid = () => {
    return Object.values(passwordErrors).every((isValid) => isValid);
  };

  const handleSignUp = (data: SignUpFormData) => {
    if (!isPasswordValid()) {
      Toast.show({
        type: 'error',
        text1: 'Senha inválida',
        text2: 'A senha não atende aos requisitos de segurança.',
      });
      return;
    }

    const registerData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    setIsLoading(true);
    apiDev
      .post('/user/create', registerData)
      .then(() => {
        setIsLoading(false);
        navigation.navigate(Paths.SignIn);
        Toast.show({
          type: 'success',
          text1: 'Cadastro concluído!',
          text2: 'Agora você já pode acessar sua conta.',
        });
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'Ops!',
          text2: 'Ocorreu um erro ao criar sua conta.',
        });
        setIsLoading(false);
      });
  };

  return (
    <SpaceBackgroundWrapper>
      <KeyboardAvoidingView
        style={[layout.flex_1]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[layout.flex_1, spacing.px_xl]}>
            <View style={[layout.itemsCenter]}>
              <VoidHeader />
              <AuthFormContainer
                footer={
                  <Button
                    title={isLoading ? 'Criando...' : 'Criar conta'}
                    onPress={handleSubmit(handleSignUp)}
                    disabled={isLoading}
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
                      onChangeText={(text) => {
                        onChange(text);
                        validatePassword(text);
                      }}
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

                <View style={[spacing.mt_sm, spacing.mx_sm]}>
                  <Text
                    style={{
                      color: isPasswordValid() ? colors.success : colors.error,
                      fontSize: fonts.size.xs,
                      fontFamily: fonts.family.aldrich,
                      lineHeight: 16,
                    }}
                  >
                    Senha com no mín. 8 caracteres, com maiúscula, minúscula,
                    número e símbolo.
                  </Text>
                </View>
              </AuthFormContainer>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SpaceBackgroundWrapper>
  );
}
