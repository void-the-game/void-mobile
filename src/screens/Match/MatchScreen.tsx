import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as ScreenOrientation from 'expo-screen-orientation';

import { useTheme } from '@/theme/hooks/useTheme';
import { storage } from '@/services/storage';
import { apiDev } from '@/services/api';
import { useMultiplayerRoom } from '@/hooks/useMultiplayerRoom';
import { Paths } from '@/navigation/paths';
import { Card } from '@/types/multiplayer.types';

import { InterruptModal } from '@/components/organisms/Match/InterruptModal';
import { ForcedDiscardModal } from '@/components/organisms/Match/ForcedDiscardModal';
import { GameOverView } from '@/components/organisms/Match/GameOverView';
import { OpponentList } from '@/components/organisms/Match/OpponentList';
import { ActivityLogFeed } from '@/components/organisms/Match/ActivityLogFeed';
import { PlayerHand } from '@/components/organisms/Match/PlayerHand';
import { TableCenter } from '@/components/organisms/Match/TableCenter';

export default function MatchScreen() {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();

  const [myId, setMyId] = useState<string | null>(null);
  const [myAvatar, setMyAvatar] = useState<string | undefined>();
  const [myNickname, setMyNickname] = useState('Tripulante');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const {
    playerView,
    activityLog,
    interrupt,
    forcedDiscard,
    gameOver,
    mySocketId,
    error,
    playCard,
    passTurn,
    playInterrupt,
    sendForcedDiscard,
    syncState,
    dismissInterrupt,
    dismissError,
  } = useMultiplayerRoom();

  // Força Landscape ao montar, restaura Portrait ao desmontar
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };
  }, []);

  // Carrega perfil do jogador
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

  // Exibe erros via Toast
  useEffect(() => {
    if (error) {
      Toast.show({ type: 'error', text1: 'Jogada inválida', text2: error });
      dismissError();
    }
  }, [error, dismissError]);

  // Limpa seleção ao trocar de turno
  useEffect(() => {
    setSelectedCard(null);
  }, [playerView?.currentTurnIndex]);

  // ─── Lógica de identificação do jogador ──────────────────────────────────────
  // Espelha o padrão do test-client: tenta casar por userId (p.id) e,
  // como fallback, por socketId (p.socketId) — cobrindo todos os cenários do backend.
  const me = playerView?.players.find(
    (p) =>
      (myId && p.id === myId) ||
      (mySocketId && (p.id === mySocketId || p.socketId === mySocketId)),
  );

  const myPlayerIndex = playerView?.players.findIndex(
    (p) =>
      (myId && p.id === myId) ||
      (mySocketId && (p.id === mySocketId || p.socketId === mySocketId)),
  );

  const isMyTurn =
    playerView !== null &&
    myPlayerIndex !== undefined &&
    myPlayerIndex >= 0 &&
    playerView.currentTurnIndex === myPlayerIndex &&
    playerView.phase === 'play';

  const myHand: Card[] = Array.isArray(me?.hand) ? (me!.hand as Card[]) : [];

  const opponents =
    playerView?.players.filter(
      (p) =>
        !(myId && p.id === myId) &&
        !(mySocketId && (p.id === mySocketId || p.socketId === mySocketId)),
    ) ?? [];

  const currentTurnPlayerId =
    playerView?.players?.[playerView?.currentTurnIndex]?.id;

  // ─── Confirmar jogada de carta selecionada ───────────────────────────────────
  const handleConfirmPlay = () => {
    if (!selectedCard) return;
    playCard({ cardId: selectedCard.id });
    setSelectedCard(null);
  };

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
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Área Principal (esquerda) ─────────────────────────────── */}
      <ScrollView
        style={styles.mainArea}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Apelido compacto + sincronização */}
        <View style={styles.topBar}>
          <Text
            style={[styles.nicknameLabel, { fontFamily: fonts.family.aldrich }]}
          >
            {myNickname}
          </Text>
          <TouchableOpacity onPress={syncState} style={styles.syncBtn}>
            <Feather name="refresh-cw" size={13} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <OpponentList
          opponents={opponents}
          currentTurnPlayerId={currentTurnPlayerId}
        />

        <TableCenter
          discardPile={playerView?.discardPile || []}
          deckRemaining={playerView?.deck?.remaining || 0}
        />

        <PlayerHand
          hand={myHand}
          isMyTurn={isMyTurn}
          selectedCardId={selectedCard?.id ?? null}
          onSelectCard={(card) =>
            setSelectedCard((prev) => (prev?.id === card.id ? null : card))
          }
        />

        <ActivityLogFeed log={activityLog || []} />
      </ScrollView>

      {/* ── Painel Lateral de Ações (direita) ──────────────────────── */}
      <View
        style={[
          styles.sidePanel,
          {
            borderLeftColor: 'rgba(59,130,246,0.15)',
            backgroundColor: 'rgba(0,0,0,0.35)',
          },
        ]}
      >
        {/* Indicador de turno */}
        <View
          style={[
            styles.turnBadge,
            {
              backgroundColor: isMyTurn
                ? 'rgba(16,185,129,0.15)'
                : 'rgba(239,68,68,0.1)',
              borderColor: isMyTurn ? '#10B981' : '#EF4444',
            },
          ]}
        >
          <Feather
            name={isMyTurn ? 'zap' : 'clock'}
            size={14}
            color={isMyTurn ? '#10B981' : '#EF4444'}
          />
          <Text
            style={[
              styles.turnBadgeText,
              {
                fontFamily: fonts.family.aldrich,
                color: isMyTurn ? '#10B981' : '#EF4444',
              },
            ]}
          >
            {isMyTurn ? 'Seu Turno' : 'Aguardando'}
          </Text>
        </View>

        {/* Carta selecionada */}
        {selectedCard && (
          <View
            style={[styles.selectedInfo, { borderColor: selectedCard.color }]}
          >
            <View
              style={[
                styles.selectedColorDot,
                { backgroundColor: selectedCard.color },
              ]}
            />
            <Text
              style={[
                styles.selectedText,
                { fontFamily: fonts.family.aldrich },
              ]}
              numberOfLines={2}
            >
              {selectedCard.type}
            </Text>
          </View>
        )}

        {/* Botão Jogar Carta */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.primaryBtn,
            (!isMyTurn || !selectedCard) && styles.disabledBtn,
          ]}
          onPress={handleConfirmPlay}
          disabled={!isMyTurn || !selectedCard}
          activeOpacity={0.8}
        >
          <Feather
            name="play"
            size={15}
            color={!isMyTurn || !selectedCard ? '#4B5563' : 'white'}
          />
          <Text
            style={[
              styles.actionBtnText,
              {
                fontFamily: fonts.family.aldrich,
                color: !isMyTurn || !selectedCard ? '#4B5563' : 'white',
              },
            ]}
          >
            Jogar Carta
          </Text>
        </TouchableOpacity>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Botão Passar Turno */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.secondaryBtn,
            !isMyTurn && styles.disabledBtn,
          ]}
          onPress={passTurn}
          disabled={!isMyTurn}
          activeOpacity={0.8}
        >
          <Feather
            name="skip-forward"
            size={14}
            color={!isMyTurn ? '#4B5563' : '#94A3B8'}
          />
          <Text
            style={[
              styles.actionBtnText,
              {
                fontFamily: fonts.family.aldrich,
                color: !isMyTurn ? '#4B5563' : '#94A3B8',
              },
            ]}
          >
            Passar
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Modais ───────────────────────────────────────────────────── */}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nicknameLabel: {
    color: '#94A3B8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  syncBtn: {
    padding: 6,
  },
  // ── Painel lateral ──
  sidePanel: {
    width: 110,
    borderLeftWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
  },
  turnBadge: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 4,
  },
  turnBadgeText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  selectedInfo: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 6,
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  selectedColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectedText: {
    color: '#E2E8F0',
    fontSize: 9,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  actionBtn: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
  },
  primaryBtn: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.5)',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(55,65,81,0.4)',
    borderColor: 'rgba(75,85,99,0.5)',
  },
  disabledBtn: {
    backgroundColor: 'rgba(31,41,55,0.3)',
    borderColor: 'rgba(55,65,81,0.3)',
  },
  actionBtnText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
