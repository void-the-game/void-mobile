import ApplicationNavigator from '@/navigation/Application';
import {
  useFonts as useAldrich,
  Aldrich_400Regular,
} from '@expo-google-fonts/aldrich';
import {
  useFonts as useBrunoAce,
  BrunoAce_400Regular,
} from '@expo-google-fonts/bruno-ace';

import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';

export default function App() {
  const [aldrichLoaded] = useAldrich({ Aldrich_400Regular });
  const [brunoAceLoaded] = useBrunoAce({ BrunoAce_400Regular });

  const fontsLoaded = aldrichLoaded && brunoAceLoaded;

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApplicationNavigator />
    </GestureHandlerRootView>
  );
}
