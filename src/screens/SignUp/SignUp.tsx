import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { VoidHeader } from '@/components/atoms/VoidHeader';
import { AuthFormContainer } from '@/components/organisms/AuthFormContainer';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';
import { useTheme } from '@/theme/hooks/useTheme';
import { View } from 'react-native';

export default function SignUp() {
  const { layout, spacing } = useTheme();

  return (
    <SpaceBackgroundWrapper>
      <View style={[layout.flex_1, spacing.px_xl]}>
        <View style={[layout.itemsCenter]}>
          <VoidHeader />
          <AuthFormContainer
            footer={
              <Button
                title="Criar conta"
                onPress={() => console.log('signup')}
              />
            }
          >
            <Input placeholder="Nome" withCustomFormat />
            <Input placeholder="E-mail" withCustomFormat />
            <Input placeholder="Senha" secureTextEntry withCustomFormat />
            <Input
              placeholder="Confirmar Senha"
              secureTextEntry
              withCustomFormat
            />
          </AuthFormContainer>
        </View>
      </View>
    </SpaceBackgroundWrapper>
  );
}
