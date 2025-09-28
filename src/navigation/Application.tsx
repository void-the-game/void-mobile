import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import { Home, SignIn, SignUp } from '@/screens';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={SignIn} name={Paths.SignIn} />
          <Stack.Screen component={SignUp} name={Paths.SignUp} />
          <Stack.Screen component={Home} name={Paths.Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
