import type { Paths } from '@/navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Home]: undefined;
  [Paths.SignIn]: undefined;
  [Paths.SignUp]: undefined;
  [Paths.Tutorial]: { returnToHome?: boolean };
  [Paths.TutorialPrompt]: undefined;
  [Paths.EditProfile]: undefined;
  [Paths.SetupProfile]: undefined;

  // Multiplayer
  Lobby: undefined;
  Match: { roomId: string };
};
