import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseURL = () => {
  if (!__DEV__) {
    return 'https://sua-api-producao.com/api';
  }

  // Tentar pegar o IP do host
  const debuggerHost =
    Constants.expoConfig?.hostUri?.split(':').shift() ||
    Constants.manifest?.debuggerHost?.split(':').shift() ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost?.split(':').shift();

  console.log('🔍 debuggerHost detectado:', debuggerHost);
  console.log('📱 Platform:', Platform.OS);

  // Android - Verificar se é emulador ou device físico
  if (Platform.OS === 'android') {
    // Se o IP detectado for localhost (127.0.0.1), é Android Emulator
    if (
      !debuggerHost ||
      debuggerHost === '127.0.0.1' ||
      debuggerHost === 'localhost'
    ) {
      console.log('⚠️ Android Emulator detectado - usando 10.0.2.2');
      return 'http://10.0.2.2:3000/api';
    }

    // Se for um IP de rede (192.168.x.x, 10.x.x.x), é device físico
    if (debuggerHost && debuggerHost.match(/^(192\.168\.|10\.)/)) {
      const url = `http://${debuggerHost}:3000/api`;
      console.log('✅ Android Device físico - usando IP:', url);
      return url;
    }

    // Fallback para emulador
    console.log('⚠️ Fallback: Android Emulator');
    return 'http://10.0.2.2:3000/api';
  }

  // iOS - localhost funciona no simulator
  if (Platform.OS === 'ios') {
    // Se tiver IP detectado e não for localhost, usar (device físico)
    if (
      debuggerHost &&
      debuggerHost !== '127.0.0.1' &&
      debuggerHost !== 'localhost'
    ) {
      const url = `http://${debuggerHost}:3000/api`;
      console.log('✅ iOS Device físico - usando IP:', url);
      return url;
    }

    console.log('⚠️ iOS Simulator - usando localhost');
    return 'http://localhost:3000/api';
  }

  // Web
  console.log('⚠️ Fallback: Web/Localhost');
  return 'http://localhost:3000/api';
};

export const apiDev = axios.create({
  baseURL: getBaseURL(),
});

if (__DEV__) {
  console.log('🌐 API Base URL FINAL:', apiDev.defaults.baseURL);
}
