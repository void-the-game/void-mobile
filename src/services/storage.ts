import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const storage = {
  // Salvar token (criptografado)
  async saveToken(token: string) {
    await SecureStore.setItemAsync('@void:token', token);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('@void:token');
  },

  // Salvar username
  async saveUser(username: string) {
    await AsyncStorage.setItem('@void:username', username);
  },

  async getUser(): Promise<string | null> {
    return await AsyncStorage.getItem('@void:username');
  },
};
