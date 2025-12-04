import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const storage = {
  // Salvar token (criptografado)
  async saveToken(token: string) {
    await SecureStore.setItemAsync('void_token', token);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('void_token');
  },

  // Salvar username
  async saveUser(username: string) {
    await AsyncStorage.setItem('void_username', username);
  },

  async getUser(): Promise<string | null> {
    return await AsyncStorage.getItem('void_username');
  },

  // Salvar id
  async saveUserId(id: string) {
    await AsyncStorage.setItem('void_userId', id);
  },

  async getUserId(): Promise<string | null> {
    return await AsyncStorage.getItem('void_userId');
  },

  // Limpar tudo (logout/delete account)
  async clearAll(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('void_token');
      await AsyncStorage.removeItem('void_username');
      await AsyncStorage.removeItem('void_userId');
      console.log('✅ Storage limpo completamente');
    } catch (error) {
      console.error('❌ Erro ao limpar storage:', error);
    }
  },
};
