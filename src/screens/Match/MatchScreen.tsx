import React, { useEffect, useCallback, useMemo, useState } from 'react';
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
import type { Card } from '@/types/multiplayer.types';

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

export default function MatchScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

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
    useMatchPlayer({
      playerView,
      myId,
      mySocketId,
    });

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

  // ─── Animações baseadas no estado do backend (Socket.IO) ─────────────────
  const [drawAnimationKey, setDrawAnimationKey] = useState(0);
  const [discardAnimationKey, setDiscardAnimationKey] = useState(0);
  const [discardPreviewCard, setDiscardPreviewCard] = useState<Card | null>(
    null,
  );

  const prevHandLengthRef = React.useRef(0);
  const prevDiscardTopIdRef = React.useRef<string | null>(null);

  // Compra: dispara quando myHand.length aumenta (início de turno + extras)
  useEffect(() => {
    const prevLen = prevHandLengthRef.current;
    const currentLen = myHand.length;

    if (prevLen === 0) {
      prevHandLengthRef.current = currentLen;
      return;
    }

    if (currentLen > prevLen) {
      const diff = currentLen - prevLen;

      for (let i = 0; i < diff; i++) {
        setTimeout(() => {
          setDrawAnimationKey((v) => v + 1);
        }, i * 140);
      }
    }

    prevHandLengthRef.current = currentLen;
  }, [myHand.length]);

  // Descarte: dispara quando o topo de discardPile muda
  useEffect(() => {
    const topCard =
      playerView?.discardPile && playerView.discardPile.length > 0
        ? playerView.discardPile[playerView.discardPile.length - 1]
        : null;

    const currentTopId = topCard ? String(topCard.id ?? '') : null;
    const prevTopId = prevDiscardTopIdRef.current;

    if (currentTopId && currentTopId !== prevTopId) {
      setDiscardPreviewCard(topCard);
      setDiscardAnimationKey((v) => v + 1);
    }

    prevDiscardTopIdRef.current = currentTopId;
  }, [playerView?.discardPile]);

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
      Toast.show({
        type: 'error',
        text1: 'Jogada inválida',
        text2: error,
      });
      dismissError();
    }
  }, [error, dismissError]);

  useEffect(() => {
    if (!selectedCard) {
      setDiscardPreviewCard(null);
    }
  }, [selectedCard]);

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
        onDrawCard={() => {
          setDrawAnimationKey((v) => v + 1);
        }}
        drawAnimationKey={drawAnimationKey}
        discardAnimationKey={discardAnimationKey}
        discardPreviewCard={discardPreviewCard}
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
