import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import { Home, SignIn, SignUp, EditProfile, SetupProfile } from '@/screens';
import TutorialScreen from '@/screens/Tutorial/TutorialScreen';
import TutorialPrompt from '@/screens/TutorialPrompt/TutorialPrompt';
import LobbyScreen from '@/screens/Lobby/LobbyScreen';
import MatchScreen from '@/screens/Match/MatchScreen';
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
          <Stack.Screen
            component={TutorialPrompt}
            name={Paths.TutorialPrompt}
          />
          <Stack.Screen component={EditProfile} name={Paths.EditProfile} />
          <Stack.Screen component={SetupProfile} name={Paths.SetupProfile} />
          <Stack.Screen component={LobbyScreen} name={Paths.Lobby} />
          <Stack.Screen component={MatchScreen} name={Paths.Match} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast
        config={{
          success: (props) => (
            <BaseToast
              {...props}
              style={{
                borderLeftColor: '#10B981',
                backgroundColor: '#262251',
              }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 15,
                fontWeight: '600',
                color: 'white',
              }}
              text2Style={{
                fontSize: 13,
                color: 'white',
              }}
            />
          ),
          error: (props) => (
            <ErrorToast
              {...props}
              style={{
                borderLeftColor: '#EF4444',
                backgroundColor: '#262251',
              }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 15,
                fontWeight: '600',
                color: 'white',
              }}
              text2Style={{
                fontSize: 13,
                color: 'white',
              }}
            />
          ),
          info: (props) => (
            <ErrorToast
              {...props}
              style={{
                borderLeftColor: '#50BBE9',
                backgroundColor: '#262251',
              }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 15,
                fontWeight: '600',
                color: 'white',
              }}
              text2Style={{
                fontSize: 13,
                color: 'white',
              }}
            />
          ),
        }}
      />
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
