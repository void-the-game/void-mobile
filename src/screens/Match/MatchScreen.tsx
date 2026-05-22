import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as ScreenOrientation from 'expo-screen-orientation';

import { useTheme } from '@/theme/hooks/useTheme';
import { useMultiplayerRoom } from '@/hooks/useMultiplayerRoom';
import { usePlayerProfile } from '@/hooks/usePlayerProfile';
import { useMatchPlayer } from '@/hooks/useMatchPlayer';
import { useCardPlay } from '@/hooks/useCardPlay';
import { useValidInterrupts } from '@/hooks/useValidInterrupts';
import { Paths } from '@/navigation/paths';

import {
  InterruptModal,
  ForcedDiscardModal,
  GameOverView,
  OpponentList,
  ActivityLogFeed,
  PlayerHand,
  TableCenter,
  ComboPlayModal,
  MatchTopBar,
  MatchSidePanel,
} from '@/components/organisms/Match';

export default function MatchScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

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
    syncState,
    dismissInterrupt,
    dismissError,
    resetToLobby,
  } = useMultiplayerRoom();

  const { isMyTurn, myHand, opponents, currentTurnPlayerId } = useMatchPlayer({
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

  // Força Landscape ao focar na tela, restaura Portrait ao sair
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      return () => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      };
    }, []),
  );

  // Exibe erros via Toast
  useEffect(() => {
    if (error) {
      Toast.show({ type: 'error', text1: 'Jogada inválida', text2: error });
      dismissError();
    }
  }, [error, dismissError]);

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
      {/* ── Área Principal (esquerda) ─────────────────────────────── */}
      <ScrollView
        style={styles.mainArea}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <MatchTopBar nickname={myNickname} onSync={syncState} />

        <OpponentList
          opponents={opponents}
          currentTurnPlayerId={currentTurnPlayerId}
        />

        <TableCenter
          discardPile={playerView?.discardPile ?? []}
          deckRemaining={playerView?.deck?.remaining ?? 0}
        />

        <PlayerHand
          hand={myHand}
          isMyTurn={isMyTurn}
          selectedCardId={selectedCard?.id ?? null}
          onSelectCard={handleSelectCard}
        />

        <ActivityLogFeed log={activityLog ?? []} />
      </ScrollView>

      {/* ── Painel Lateral de Ações (direita) ──────────────────────── */}
      <MatchSidePanel
        isMyTurn={isMyTurn}
        selectedCard={selectedCard}
        onConfirmPlay={handleConfirmPlay}
      />

      {/* ── Modais ───────────────────────────────────────────────────── */}
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
    flexDirection: 'row',
  },
  mainArea: {
    flex: 1,
  },
  mainContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
});
