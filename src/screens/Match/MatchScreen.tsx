import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { storage } from '@/services/storage';
import { apiDev } from '@/services/api';
import { useMultiplayerRoom } from '@/hooks/useMultiplayerRoom';
import { Paths } from '@/navigation/paths';
import * as ScreenOrientation from 'expo-screen-orientation';

import { InterruptModal } from '@/components/organisms/Match/InterruptModal';
import { ForcedDiscardModal } from '@/components/organisms/Match/ForcedDiscardModal';
import { GameOverView } from '@/components/organisms/Match/GameOverView';
import { MatchHeader } from '@/components/organisms/Match/MatchHeader';
import { OpponentList } from '@/components/organisms/Match/OpponentList';
import { ActivityLogFeed } from '@/components/organisms/Match/ActivityLogFeed';
import { PlayerHand } from '@/components/organisms/Match/PlayerHand';
import { TableCenter } from '@/components/organisms/Match/TableCenter';

export default function MatchScreen() {
  const { layout, colors, fonts } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [myId, setMyId] = useState<string | null>(null);
  const [myAvatar, setMyAvatar] = useState<string | undefined>();
  const [myNickname, setMyNickname] = useState('Tripulante');

  const {
    playerView,
    activityLog,
    interrupt,
    forcedDiscard,
    gameOver,
    error,
    playCard,
    passTurn,
    playInterrupt,
    sendForcedDiscard,
    syncState,
    dismissInterrupt,
    dismissError,
  } = useMultiplayerRoom();

  useEffect(() => {
    // Força a tela para horizontal (Landscape)
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // Retorna para o padrão do app (Portrait) ao sair
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      const [id, token] = await Promise.all([
        storage.getUserId(),
        storage.getToken(),
      ]);
      setMyId(id);
      if (id && token) {
        try {
          const res = await apiDev.get(`/profile/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data?.profile?.avatar) setMyAvatar(res.data.profile.avatar);
          if (res.data?.profile?.nickname)
            setMyNickname(res.data.profile.nickname);
        } catch {}
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (error) {
      Toast.show({ type: 'error', text1: 'Jogada inválida', text2: error });
      dismissError();
    }
  }, [error]);

  const myPlayerIndex = playerView?.players.findIndex((p) => p.id === myId);
  const isMyTurn =
    playerView?.currentTurnIndex === myPlayerIndex &&
    playerView?.phase === 'play';

  const me = playerView?.players.find((p) => p.id === myId);
  const myHand = Array.isArray(me?.hand) ? me.hand : [];

  if (gameOver) {
    return (
      <GameOverView
        won={gameOver.winnerId === myId}
        winnerName={gameOver.winnerName}
        myAvatar={myAvatar}
        onGoHome={() => navigation.navigate(Paths.Home as never)}
      />
    );
  }

  return (
    <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
      <ScrollView
        style={layout.flex_1}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <MatchHeader
          myAvatar={myAvatar}
          myNickname={myNickname}
          isMyTurn={isMyTurn}
          onSync={syncState}
        />

        <OpponentList
          opponents={playerView?.players?.filter((p) => p.id !== myId) || []}
          currentTurnPlayerId={
            playerView?.players?.[playerView?.currentTurnIndex]?.id
          }
        />

        <TableCenter
          discardPile={playerView?.discardPile || []}
          deckRemaining={playerView?.deck?.remaining || 0}
        />

        <ActivityLogFeed log={activityLog || []} />

        <PlayerHand
          hand={myHand}
          isMyTurn={isMyTurn}
          onPlayCard={(cardId) => playCard({ cardId })}
        />
      </ScrollView>

      {isMyTurn && (
        <View
          style={[
            styles.footerBar,
            {
              borderTopColor: 'rgba(59,130,246,0.18)',
              backgroundColor: colors.background,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: '#374151', flex: 1 }]}
            onPress={passTurn}
          >
            <Feather name="skip-forward" size={16} color="white" />
            <Text
              style={[
                styles.primaryBtnText,
                { fontFamily: fonts.family.aldrich },
              ]}
            >
              Passar turno
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {interrupt && (
        <InterruptModal
          visible={!!interrupt}
          attackerName={interrupt.attackerName}
          cardType={interrupt.cardType}
          timeoutMs={interrupt.timeoutMs}
          availableResponses={interrupt.availableResponses}
          onRespond={(cardId) => {
            playInterrupt(cardId);
            dismissInterrupt();
          }}
          onSkip={dismissInterrupt}
        />
      )}

      {forcedDiscard && (
        <ForcedDiscardModal
          visible={!!forcedDiscard}
          reason={forcedDiscard.reason}
          requiredColor={forcedDiscard.requiredColor}
          hand={myHand}
          onConfirm={sendForcedDiscard}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footerBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 999,
    gap: 8,
  },
  primaryBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
