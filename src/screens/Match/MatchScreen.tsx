import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import * as ScreenOrientation from 'expo-screen-orientation';

import { useTheme } from '@/theme/hooks/useTheme';
import { useMultiplayerRoom } from '@/hooks/useMultiplayerRoom';
import { usePlayerProfile } from '@/hooks/usePlayerProfile';
import { useMatchPlayer } from '@/hooks/useMatchPlayer';
import { useCardPlay } from '@/hooks/useCardPlay';
import { useValidInterrupts } from '@/hooks/useValidInterrupts';
import { useCardTimer } from '@/hooks/useCardTimer';
import { Paths } from '@/navigation/paths';
import { StarField } from '@/components/molecules/StarField';
import { FloatingGlowDots } from '@/components/organisms/FloatingGlowDots/FloatingGlowDots';
import { generateStarCoordinates } from '@/utils/generateStarCoordinates';

import {
  InterruptModal,
  ForcedDiscardModal,
  GameOverView,
  ComboPlayModal,
  OpponentArea,
  TableArea,
  PlayerArea,
  HUDOverlay,
  ActivityLogOverlay,
} from '@/components/organisms/Match';

import { VoidLoadingScreen } from '@/screens/LoadingScreen/LoadingScreen';

export default function MatchScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

  const stars = useMemo(() => generateStarCoordinates({ quantity: 30 }), []);

  const { myId, myAvatar, myNickname } = usePlayerProfile();

  const {
    playerView,
    activityLog,
    interrupt,
    forcedDiscard,
    gameOver,
    mySocketId,
    error,
    playCard,
    playInterrupt,
    sendForcedDiscard,
    dismissInterrupt,
    dismissError,
    resetToLobby,
  } = useMultiplayerRoom();

  const { isMyTurn, myHand, opponents, currentTurnPlayerId, me } =
    useMatchPlayer({ playerView, myId, mySocketId });

  const {
    selectedCard,
    pendingComboCard,
    handleSelectCard,
    handleConfirmPlay,
    handleComboConfirmed,
    handleCancelCombo,
  } = useCardPlay({ playCard, currentTurnIndex: playerView?.currentTurnIndex });

  const validInteractions = useValidInterrupts({ interrupt, myHand });

  const { progress: timerProgress } = useCardTimer({
    isMyTurn,
    myHand,
    currentTurnIndex: playerView?.currentTurnIndex,
    onAutoPlay: (card) => {
      playCard({ cardId: card.id });
    },
  });

  const deckRef = useRef<View>(null);
  const discardRef = useRef<View>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const lockLandscape = async () => {
        if (!isActive) return;
        await ScreenOrientation.unlockAsync();
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
      };

      lockLandscape();

      return () => {
        isActive = false;
        ScreenOrientation.unlockAsync().then(() => {
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP,
          );
        });
      };
    }, []),
  );

  useEffect(() => {
    if (error) {
      Toast.show({ type: 'error', text1: 'Jogada inválida', text2: error });
      dismissError();
    }
  }, [error, dismissError]);

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <StatusBar hidden />
        <VoidLoadingScreen
          duration={3200}
          onFinish={() => setIsLoading(false)}
        />
      </>
    );
  }

  // ── Game over ───────────────────────────────────────────────────────────────
  if (gameOver) {
    const isWinner =
      gameOver.winnerId === myId || gameOver.winnerId === mySocketId;

    return (
      <GameOverView
        won={isWinner}
        winnerName={gameOver.winnerName}
        myAvatar={myAvatar}
        onGoHome={() => {
          resetToLobby();
          navigation.navigate(Paths.Lobby as never);
        }}
      />
    );
  }

  // ── Match ───────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar hidden />

      <StarField stars={stars} style={StyleSheet.absoluteFillObject} />
      <FloatingGlowDots />

      <OpponentArea
        opponent={opponents[0]}
        isOpponentTurn={currentTurnPlayerId === opponents[0]?.id}
      />

      <TableArea
        discardPile={playerView?.discardPile ?? []}
        deckRemaining={playerView?.deck?.remaining ?? 0}
        onDrawCard={() => playCard({ cardId: '__draw__' })}
        deckRef={deckRef}
        discardRef={discardRef}
      />

      <PlayerArea
        hand={myHand}
        isMyTurn={isMyTurn}
        selectedCardId={selectedCard?.id ?? null}
        onSelectCard={handleSelectCard}
        playerName={myNickname}
        playerAvatar={me?.avatar ?? myAvatar}
      />

      <HUDOverlay
        isMyTurn={isMyTurn}
        selectedCard={selectedCard}
        onConfirmPlay={handleConfirmPlay}
        timerProgress={timerProgress}
      />

      <ActivityLogOverlay log={activityLog ?? []} />

      {interrupt ? (
        <InterruptModal
          visible={!!interrupt}
          attackerName={interrupt.attackerName}
          cardType={interrupt.cardType}
          timeoutMs={interrupt.timeoutMs}
          availableResponses={validInteractions}
          onRespond={(cardId) => {
            playInterrupt(cardId);
            dismissInterrupt();
          }}
          onSkip={dismissInterrupt}
        />
      ) : null}

      <ComboPlayModal
        visible={!!pendingComboCard}
        comboCard={pendingComboCard}
        hand={myHand}
        onConfirm={handleComboConfirmed}
        onCancel={handleCancelCombo}
      />

      {forcedDiscard ? (
        <ForcedDiscardModal
          visible={!!forcedDiscard}
          reason={forcedDiscard.reason}
          requiredColor={forcedDiscard.requiredColor}
          hand={myHand}
          onConfirm={sendForcedDiscard}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
});
