import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import { Home, SignIn, SignUp } from '@/screens';
import TutorialScreen from '@/screens/Tutorial/TutorialScreen';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={SignIn} name={Paths.SignIn} />
          <Stack.Screen component={SignUp} name={Paths.SignUp} />
          <Stack.Screen component={Home} name={Paths.Home} />
          <Stack.Screen component={TutorialScreen} name={Paths.Tutorial} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast
        config={{
          success: (props) => (
            <BaseToast
              {...props}
              style={{
                borderLeftColor: '#10B981', // Verde (mantém a borda lateral)
                backgroundColor: '#262251', // Seu fundo roxo
              }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 15,
                fontWeight: '600',
                color: 'white', // Texto branco
              }}
              text2Style={{
                fontSize: 13,
                color: 'white', // Texto branco
              }}
            />
          ),
          error: (props) => (
            <ErrorToast
              {...props}
              style={{
                borderLeftColor: '#EF4444', // Vermelho (mantém a borda lateral)
                backgroundColor: '#262251', // Seu fundo roxo
              }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 15,
                fontWeight: '600',
                color: 'white', // Texto branco
              }}
              text2Style={{
                fontSize: 13,
                color: 'white', // Texto branco
              }}
            />
          ),
        }}
      />
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
