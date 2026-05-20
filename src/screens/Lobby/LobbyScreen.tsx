import React, { useEffect, useState, useCallback } from 'react';
import { View, Share } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/theme/hooks/useTheme';
import { BottomNav, BottomTab } from '@/components/organisms/BottomNav';
import { storage } from '@/services/storage';
import { apiDev } from '@/services/api';
import { useMultiplayerRoom } from '@/hooks/useMultiplayerRoom';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { SpaceTransitionOverlay } from '@/components/organisms/SpaceTransitionOverlay/SpaceTransitionOverlay';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';

import { LobbyBrowser } from '@/components/organisms/Lobby/LobbyBrowser';
import { JoinRoomModal } from '@/components/organisms/Lobby/JoinRoomModal';
import { WaitingRoom } from '@/components/organisms/Lobby/WaitingRoom';

type Navigation = StackNavigationProp<RootStackParamList>;
type LobbyStep = 'browser' | 'waiting';

export default function LobbyScreen() {
  const { layout } = useTheme();
  const navigation = useNavigation<Navigation>();
  const [activeTab, setActiveTab] = useState<BottomTab>('home');

  const [step, setStep] = useState<LobbyStep>('browser');
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState<string | undefined>();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [startingMatch, setStartingMatch] = useState(false);

  const {
    connected,
    phase,
    roomId,
    roomCode,
    players,
    error,
    isRoomCreator,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    dismissError,
  } = useMultiplayerRoom();

  const isHost =
    players.length > 0 ? players[0].name === playerName : !!isRoomCreator;

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const userId = await storage.getUserId();
          const token = await storage.getToken();
          if (!userId || !token) return;

          setCurrentUserId(userId);

          const response = await apiDev.get(`/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success && response.data.profile) {
            const { nickname, avatar } = response.data.profile;
            if (nickname) setPlayerName(nickname);
            if (avatar) setPlayerAvatar(avatar);
          }
        } catch (err: any) {
          console.log('Error fetching profile in Lobby:', err.message);
        }
      };

      fetchProfile();
    }, []),
  );

  useEffect(() => {
    if (roomCode) setStep('waiting');
  }, [roomCode]);

  useEffect(() => {
    if (phase === 'playing' && roomId) {
      navigation.navigate(Paths.Match as any, { roomId });
    }
  }, [phase, roomId, navigation]);

  useEffect(() => {
    if (roomCode && creatingRoom) setCreatingRoom(false);
  }, [roomCode, creatingRoom]);

  useEffect(() => {
    if (roomCode && joiningRoom) setJoiningRoom(false);
  }, [roomCode, joiningRoom]);

  useEffect(() => {
    if (phase === 'playing' && startingMatch) setStartingMatch(false);
  }, [phase, startingMatch]);

  useEffect(() => {
    if (error) {
      setCreatingRoom(false);
      setJoiningRoom(false);
      setStartingMatch(false);
      Toast.show({ type: 'error', text1: 'Erro', text2: error });
      dismissError();
    }
  }, [error, dismissError]);

  const handleTabChange = (tab: BottomTab) => {
    if (tab === 'home') {
      setStep('browser');
      setJoinCode('');
      setJoinModalVisible(false);
      navigation.navigate(Paths.Home as any);
      return;
    }

    if (tab === 'profile') {
      navigation.navigate(Paths.EditProfile as any);
      return;
    }

    setActiveTab(tab);
  };

  const handleCreate = () => {
    if (!playerName.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Atenção',
        text2: 'Informe seu nome antes de criar uma sala.',
      });
      return;
    }

    setCreatingRoom(true);
    createRoom(playerName.trim(), currentUserId);
  };

  const handleJoin = () => {
    if (!playerName.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Atenção',
        text2: 'Informe seu nome antes de entrar.',
      });
      return;
    }

    if (!joinCode.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Atenção',
        text2: 'Informe o código da sala.',
      });
      return;
    }

    setJoiningRoom(true);
    joinRoom(joinCode.trim().toUpperCase(), playerName.trim(), currentUserId);
    setJoinModalVisible(false);
  };

  const handleStartGame = () => {
    // Toast.show({
    //   type: 'info',
    //   text1: 'Partida em preparação',
    //   text2:
    //     'A conexão entre jogadores já funciona, mas o fluxo completo da partida ainda está em construção.',
    //   visibilityTime: 2800,
    // });

    setStartingMatch(true);

    startGame();
  };

  const handleShare = () => {
    if (!roomCode) return;
    Share.share({
      message: `Entre na minha sala no Void! Código: ${roomCode}`,
    });
  };

  return (
    <SpaceBackgroundWrapper>
      <View style={layout.flex_1}>
        {step === 'browser' ? (
          <LobbyBrowser
            connected={connected}
            playerName={playerName}
            playerAvatar={playerAvatar}
            onCreateRoom={handleCreate}
            onOpenJoinModal={() => setJoinModalVisible(true)}
          />
        ) : (
          <WaitingRoom
            roomCode={roomCode}
            players={players}
            isHost={isHost}
            currentUserId={currentUserId}
            playerAvatar={playerAvatar}
            onStartGame={handleStartGame}
            onShare={handleShare}
            onLeave={() => {
              leaveRoom();
              setStep('browser');
            }}
          />
        )}

        {step === 'browser' && (
          <>
            <JoinRoomModal
              visible={joinModalVisible}
              joinCode={joinCode}
              onJoinCodeChange={setJoinCode}
              onJoin={handleJoin}
              onClose={() => {
                setJoinModalVisible(false);
                setJoinCode('');
              }}
            />

            <BottomNav
              active={activeTab}
              onChange={handleTabChange}
              backgroundColor="transparent"
            />
          </>
        )}

        <SpaceTransitionOverlay
          visible={creatingRoom}
          title="Abrindo fenda espacial..."
          subtitle="Criando a sala da missão"
        />

        <SpaceTransitionOverlay
          visible={joiningRoom}
          title="Acoplando à nave..."
          subtitle="Entrando na sala informada"
        />
      </View>
    </SpaceBackgroundWrapper>
  );
}
