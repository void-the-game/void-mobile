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

type Navigation = StackNavigationProp<RootStackParamList>;

export default function SignIn() {
  const { colors, layout, spacing } = useTheme();
  const navigation = useNavigation<Navigation>();

  const shipIcon = (
    <Image
      source={require('@/assets/images/spaceship.webp')}
      style={{ width: 20, height: 20, tintColor: colors.text }}
    />
  );

  return (
    <SpaceBackgroundWrapper>
      <View style={[layout.flex_1, spacing.px_xl]}>
        <View style={[layout.itemsCenter]}>
          <VoidHeader />
          <AuthFormContainer
            footer={
              <View style={[spacing.mt_xl, layout.itemsCenter, { gap: 12 }]}>
                <Button
                  title="Entrar"
                  onPress={() => console.log('will go to home')}
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
            <Input
              placeholder="Usuário ou E-mail"
              withCustomFormat
              rightIcon={shipIcon}
            />
            <Input
              placeholder="Senha"
              secureTextEntry
              withCustomFormat
              rightIcon={shipIcon}
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
