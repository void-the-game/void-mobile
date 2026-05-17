import Constants from 'expo-constants';

export const getDevHost = (): string | undefined => {
  return (
    Constants.expoConfig?.hostUri?.split(':').shift() ||
    Constants.manifest?.debuggerHost?.split(':').shift() ||
    // @ts-ignore
    Constants.manifest2?.extra?.expoGo?.debuggerHost?.split(':').shift()
  );
};
