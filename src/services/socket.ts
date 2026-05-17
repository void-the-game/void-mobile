import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import { getDevHost } from '@/utils/network/getDevHost';

const PROD_URL = process.env.EXPO_PUBLIC_SOCKET_URL;
const FORCE_PROD = process.env.EXPO_PUBLIC_FORCE_PROD === 'true';

const getSocketURL = () => {
  if (!__DEV__ || FORCE_PROD) {
    return PROD_URL;
  }

  const debuggerHost = getDevHost();

  if (Platform.OS === 'android') {
    if (
      !debuggerHost ||
      debuggerHost === '127.0.0.1' ||
      debuggerHost === 'localhost'
    ) {
      return 'http://10.0.2.2:3000';
    }
    if (debuggerHost.match(/^(192\.168\.|10\.)/)) {
      return `http://${debuggerHost}:3000`;
    }
    return 'http://10.0.2.2:3000';
  }

  if (Platform.OS === 'ios') {
    if (
      debuggerHost &&
      debuggerHost !== '127.0.0.1' &&
      debuggerHost !== 'localhost'
    ) {
      return `http://${debuggerHost}:3000`;
    }
    return 'http://localhost:3000';
  }

  return 'http://localhost:3000';
};

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(getSocketURL(), {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
