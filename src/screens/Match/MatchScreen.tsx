import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Image,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { storage } from '@/services/storage';
import { apiDev } from '@/services/api';
import { useMultiplayerRoom } from '@/hooks/useMultiplayerRoom';
import { Paths } from '@/navigation/paths';
import type { PublicActionPayload, InterruptPayload, ForcedDiscardPayload } from '@/types/multiplayer.types';

const CARD = {
  backgroundColor: 'rgba(59,130,246,0.08)',
  borderColor: 'rgba(59,130,246,0.22)',
};

const ICON_COLORS = ['#3B82F6', '#E91E63', '#10B981', '#A855F7'];

// ─── Modal: Interrupção ───────────────────────────────────────────────────────
function InterruptModal({
  visible,
  attackerName,
  cardType,
  timeoutMs,
  availableResponses,
  onRespond,
  onSkip,
}: {
  visible: boolean;
  attackerName: string;
  cardType: string;
  timeoutMs: number;
  availableResponses: string[];
  onRespond: (cardId: string) => void;
  onSkip: () => void;
}) {
  const { colors, fonts } = useTheme();
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      progress.setValue(1);
      Animated.timing(progress, {
        toValue: 0,
        duration: timeoutMs,
        useNativeDriver: false,
      }).start(() => onSkip());
    }
  }, [visible]);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.sheet, { backgroundColor: colors.background, borderColor: 'rgba(59,130,246,0.22)' }]}>
          <View style={modalStyles.handle} />
          <View style={modalStyles.titleRow}>
            <Feather name="alert-triangle" size={20} color="#EF4444" />
            <Text style={[modalStyles.title, { fontFamily: fonts.family.aldrich, color: '#EF4444' }]}>
              Reação necessária!
            </Text>
          </View>
          <Text style={[modalStyles.subtitle, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
            <Text style={{ color: '#60A5FA' }}>{attackerName}</Text> jogou {cardType}
          </Text>
          <View style={modalStyles.timerTrack}>
            <Animated.View style={[modalStyles.timerFill, { width: barWidth }]} />
          </View>
          <View style={{ gap: 8 }}>
            {availableResponses.map(cardId => (
              <TouchableOpacity
                key={cardId}
                style={[modalStyles.optionBtn, CARD]}
                onPress={() => onRespond(cardId)}
              >
                <Text style={{ color: '#60A5FA', fontFamily: fonts.family.aldrich, fontSize: 14, flex: 1 }}>
                  {cardId}
                </Text>
                <Feather name="chevron-right" size={16} color="#60A5FA" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[modalStyles.optionBtn, { backgroundColor: 'rgba(55,65,81,0.3)', borderColor: 'rgba(75,85,99,0.3)' }]}
              onPress={onSkip}
            >
              <Text style={{ color: '#64748B', fontFamily: fonts.family.aldrich, fontSize: 14 }}>
                Não reagir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Modal: Descarte obrigatório ──────────────────────────────────────────────
function ForcedDiscardModal({
  visible,
  reason,
  requiredColor,
  hand,
  onConfirm,
}: {
  visible: boolean;
  reason: 'vortex' | 'black_hole';
  requiredColor: string;
  hand: { id: string; type: string; color: string }[];
  onConfirm: (ids: string[]) => void;
}) {
  const { colors, fonts } = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  const colorCards = hand.filter(c => c.color === requiredColor);

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.sheet, { backgroundColor: colors.background, borderColor: 'rgba(239,68,68,0.3)' }]}>
          <View style={modalStyles.handle} />
          <View style={modalStyles.titleRow}>
            <Feather name="trash-2" size={20} color="#EF4444" />
            <Text style={[modalStyles.title, { fontFamily: fonts.family.aldrich, color: '#EF4444' }]}>
              {reason === 'vortex' ? 'Vórtice!' : 'Buraco Negro!'}
            </Text>
          </View>
          <Text style={[modalStyles.subtitle, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
            Descarte cartas da cor:{' '}
            <Text style={{ color: '#60A5FA' }}>{requiredColor}</Text>
          </Text>
          <View style={{ gap: 8, marginBottom: 16 }}>
            {colorCards.length === 0 ? (
              <View style={modalStyles.warningBox}>
                <Feather name="info" size={14} color="#FCA5A5" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FCA5A5', fontFamily: fonts.family.aldrich, fontSize: 13, flex: 1 }}>
                  Sem cartas dessa cor. O efeito alternativo será aplicado.
                </Text>
              </View>
            ) : (
              colorCards.map(card => {
                const sel = selected.includes(card.id);
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[
                      modalStyles.optionBtn,
                      {
                        borderColor: sel ? '#EF4444' : 'rgba(59,130,246,0.22)',
                        backgroundColor: sel ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.08)',
                      },
                    ]}
                    onPress={() => toggle(card.id)}
                  >
                    <View style={[modalStyles.colorDot, { backgroundColor: card.color }]} />
                    <Text style={{ color: '#E5E7EB', fontFamily: fonts.family.aldrich, fontSize: 14, flex: 1 }}>
                      {card.type}
                    </Text>
                    {sel && <Feather name="check" size={16} color="#EF4444" />}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
          <TouchableOpacity
            style={[
              modalStyles.primaryBtn,
              { backgroundColor: selected.length > 0 || colorCards.length === 0 ? '#EF4444' : '#374151' },
            ]}
            onPress={() => onConfirm(selected)}
          >
            <Text style={[modalStyles.primaryBtnText, { fontFamily: fonts.family.aldrich }]}>
              {colorCards.length === 0 ? 'Confirmar' : `Descartar (${selected.length})`}
            </Text>
            <Feather name="arrow-right" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Tela da partida ──────────────────────────────────────────────────────────
export default function MatchScreen() {
  const { layout, colors, fonts } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [myId, setMyId] = useState<string | null>(null);
  const [myAvatar, setMyAvatar] = useState<string | undefined>();
  const [myNickname, setMyNickname] = useState('Tripulante');

  const {
    gameState,
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
    const load = async () => {
      const [id, token] = await Promise.all([storage.getUserId(), storage.getToken()]);
      setMyId(id);
      if (id && token) {
        try {
          const res = await apiDev.get(`/profile/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data?.profile?.avatar) setMyAvatar(res.data.profile.avatar);
          if (res.data?.profile?.nickname) setMyNickname(res.data.profile.nickname);
        } catch (_) {}
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

  const isMyTurn = gameState?.currentTurnPlayerId === myId;
  const myHand: { id: string; type: string; color: string }[] =
    (gameState as any)?.playerHands?.[myId ?? ''] ?? [];

  // ─── Fim de jogo ──────────────────────────────────────────────────────────
  if (gameOver) {
    const won = gameOver.winnerId === myId;
    return (
      <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: insets.top + 16,
          }}
        >
          {myAvatar ? (
            <Image
              source={{ uri: myAvatar }}
              style={[styles.gameOverAvatar, { borderColor: won ? '#10B981' : '#EF4444' }]}
            />
          ) : (
            <AstronautIcon
              color={won ? '#10B981' : '#EF4444'}
              armColor={won ? '#064e3b' : '#5a0020'}
              armStrokeColor={won ? '#10B981' : '#EF4444'}
              size={100}
            />
          )}
          <Text style={[styles.gameOverTitle, { fontFamily: fonts.family.aldrich, color: won ? '#10B981' : '#EF4444' }]}>
            {won ? '🏆 Você venceu!' : `${gameOver.winnerName} venceu!`}
          </Text>
          {!won && (
            <Text style={[styles.gameOverSub, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
              Boa tentativa. A próxima é sua!
            </Text>
          )}
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: '#3B82F6', marginTop: 40 }]}
            onPress={() => navigation.navigate(Paths.Home as never)}
          >
            <Text style={[styles.primaryBtnText, { fontFamily: fonts.family.aldrich }]}>
              Voltar ao início
            </Text>
            <Feather name="home" size={18} color="white" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ─── Partida ──────────────────────────────────────────────────────────────
  return (
    <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
      <ScrollView
        style={layout.flex_1}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        {/* Header com avatar + status de turno */}
        <View style={styles.matchHeader}>
          {myAvatar ? (
            <Image source={{ uri: myAvatar }} style={styles.matchAvatar} />
          ) : (
            <AstronautIcon color="#3B82F6" armColor="#093075" armStrokeColor="#3B82F6" size={56} />
          )}
          <View style={{ flex: 1 }}>
            <View style={[
              styles.matchBubble,
              {
                borderColor: isMyTurn ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.35)',
                backgroundColor: isMyTurn ? 'rgba(16,185,129,0.06)' : 'rgba(30,41,59,0.95)',
              },
            ]}>
              <Text style={[styles.matchBubbleLabel, { fontFamily: fonts.family.aldrich }]}>
                {myNickname} 👾
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <Feather
                  name={isMyTurn ? 'zap' : 'clock'}
                  size={12}
                  color={isMyTurn ? '#10B981' : '#94A3B8'}
                />
                <Text style={[styles.matchBubbleStatus, { fontFamily: fonts.family.aldrich, color: isMyTurn ? '#10B981' : '#94A3B8' }]}>
                  {isMyTurn ? 'Seu turno!' : 'Aguardando...'}
                </Text>
              </View>
              <View style={[styles.bubbleTail, {
                borderRightColor: isMyTurn ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.35)',
              }]} />
            </View>
          </View>
          <TouchableOpacity onPress={syncState} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Feather name="refresh-cw" size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Oponentes */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
            Oponentes
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {gameState?.players.filter(p => p.id !== myId).map((player, i) => (
              <View
                key={player.id}
                style={[
                  styles.opponentCard,
                  {
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    borderColor: gameState.currentTurnPlayerId === player.id
                      ? 'rgba(59,130,246,0.55)'
                      : 'rgba(59,130,246,0.18)',
                  },
                ]}
              >
                <AstronautIcon
                  color={ICON_COLORS[i % ICON_COLORS.length]}
                  armColor="#1a1a1a"
                  armStrokeColor={ICON_COLORS[i % ICON_COLORS.length]}
                  size={40}
                />
                <Text
                  style={[styles.opponentName, { fontFamily: fonts.family.aldrich, color: colors.text }]}
                  numberOfLines={1}
                >
                  {player.name}
                </Text>
                <Text style={[styles.opponentCards, { fontFamily: fonts.family.aldrich }]}>
                  {player.cardCount ?? '?'} cartas
                </Text>
                {player.isEliminated && (
                  <View style={styles.eliminatedBadge}>
                    <Text style={styles.eliminatedText}>Eliminado</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Feed de atividade */}
        {activityLog.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
              Últimas jogadas
            </Text>
            <View style={[styles.logCard, CARD]}>
              {activityLog.slice(0, 5).map((item: PublicActionPayload, i) => (
                <View key={i} style={[styles.logRow, { borderBottomColor: 'rgba(59,130,246,0.1)' }]}>
                  <Text style={[styles.logText, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
                    <Text style={{ color: '#60A5FA' }}>{item.playerName}</Text>
                    {' — '}{item.effectDescription}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mão do jogador */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontFamily: fonts.family.aldrich, color: '#94A3B8' }]}>
            Sua mão ({myHand.length} cartas)
          </Text>
          {myHand.length === 0 ? (
            <View style={[styles.emptyHand, CARD]}>
              <AstronautIcon color="#374151" armColor="#1a1a1a" armStrokeColor="#374151" size={44} />
              <Text style={[{ color: '#4B5563', fontFamily: fonts.family.aldrich, fontSize: 13, marginTop: 10 }]}>
                Sem cartas na mão
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {myHand.map(card => (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.cardBtn,
                    {
                      backgroundColor: 'rgba(59,130,246,0.08)',
                      borderColor: isMyTurn ? 'rgba(59,130,246,0.55)' : 'rgba(59,130,246,0.18)',
                      opacity: isMyTurn ? 1 : 0.45,
                    },
                  ]}
                  onPress={() => isMyTurn && playCard({ cardId: card.id })}
                  disabled={!isMyTurn}
                  activeOpacity={0.75}
                >
                  <View style={[styles.cardColorBar, { backgroundColor: card.color }]} />
                  <Text
                    style={[styles.cardType, { fontFamily: fonts.family.aldrich, color: '#E2E8F0' }]}
                    numberOfLines={2}
                  >
                    {card.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Footer — passar turno */}
      {isMyTurn && (
        <View style={[styles.footerBar, { borderTopColor: 'rgba(59,130,246,0.18)', backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: '#374151', flex: 1 }]}
            onPress={passTurn}
          >
            <Feather name="skip-forward" size={16} color="white" />
            <Text style={[styles.primaryBtnText, { fontFamily: fonts.family.aldrich }]}>
              Passar turno
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de interrupção */}
      {interrupt && (
        <InterruptModal
          visible={!!interrupt}
          attackerName={interrupt.attackerName}
          cardType={interrupt.cardType}
          timeoutMs={interrupt.timeoutMs}
          availableResponses={interrupt.availableResponses}
          onRespond={cardId => { playInterrupt(cardId); dismissInterrupt(); }}
          onSkip={dismissInterrupt}
        />
      )}

      {/* Modal de descarte obrigatório */}
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
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  matchAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59,130,246,0.2)',
  },
  matchBubble: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderTopLeftRadius: 2,
  },
  matchBubbleLabel: { fontSize: 13, fontWeight: '700', color: '#E2E8F0' },
  matchBubbleStatus: { fontSize: 12 },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: 12,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  opponentCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    minWidth: 90,
    gap: 4,
  },
  opponentName: { fontSize: 12, textAlign: 'center' },
  opponentCards: { fontSize: 11, color: '#94A3B8' },
  eliminatedBadge: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  eliminatedText: { color: '#EF4444', fontSize: 9, fontWeight: '700' },
  logCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  logRow: { paddingVertical: 9, paddingHorizontal: 14, borderBottomWidth: 1 },
  logText: { fontSize: 12, lineHeight: 17 },
  emptyHand: { alignItems: 'center', paddingVertical: 28, borderRadius: 14, borderWidth: 1 },
  cardBtn: {
    width: 82,
    height: 118,
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardColorBar: { width: '100%', height: 6 },
  cardType: { fontSize: 12, textAlign: 'center', padding: 8, flex: 1 },
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
  gameOverAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    backgroundColor: 'rgba(59,130,246,0.15)',
  },
  gameOverTitle: { fontSize: 26, fontWeight: '800', marginTop: 24, textAlign: 'center' },
  gameOverSub: { fontSize: 14, marginTop: 8, textAlign: 'center' },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, padding: 24 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(148,163,184,0.3)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 16 },
  timerTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(55,65,81,0.6)',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  timerFill: { height: '100%', backgroundColor: '#EF4444', borderRadius: 2 },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    backgroundColor: 'rgba(239,68,68,0.08)',
    padding: 12,
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