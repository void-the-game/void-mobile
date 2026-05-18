import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { AstronautIcon } from '@/components/svg/svgIcons';
import type { LobbyPlayer } from '@/types/multiplayer.types';

const CARD = {
  backgroundColor: 'rgba(59,130,246,0.08)',
  borderColor: 'rgba(59,130,246,0.22)',
};

function RoomPlayerAvatar({ name, avatar }: { name: string; avatar?: string }) {
  const [imageError, setImageError] = useState(false);

  if (avatar && !imageError) {
    return (
      <Image
        source={{ uri: avatar }}
        style={styles.playerAvatarImage}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <View style={styles.playerAvatarFallback}>
      <Text style={styles.playerAvatarFallbackText}>
        {name?.trim()?.charAt(0)?.toUpperCase() || '?'}
      </Text>
    </View>
  );
}

type WaitingRoomProps = {
  roomCode: string | null;
  players: LobbyPlayer[];
  isHost: boolean;
  currentUserId: string | null;
  playerAvatar?: string;
  onStartGame: () => void;
  onShare: () => void;
  onLeave: () => void;
};

export function WaitingRoom({
  roomCode,
  players,
  isHost,
  currentUserId,
  playerAvatar,
  onStartGame,
  onShare,
  onLeave,
}: WaitingRoomProps) {
  const { colors, fonts, layout } = useTheme();

  const resolvePlayerAvatar = (item: LobbyPlayer): string | undefined => {
    if (item.avatar) return item.avatar;
    if (item.id === currentUserId && playerAvatar) return playerAvatar;
    return undefined;
  };

  const renderPlayer = (item: LobbyPlayer, index: number) => (
    <View
      key={item.id}
      style={[styles.playerRow, { borderBottomColor: 'rgba(59,130,246,0.1)' }]}
    >
      <RoomPlayerAvatar name={item.name} avatar={resolvePlayerAvatar(item)} />

      <Text
        style={[
          styles.playerName,
          { fontFamily: fonts.family.aldrich, color: colors.text },
        ]}
      >
        {item.name}
      </Text>

      {index === 0 && (
        <View style={styles.hostBadge}>
          <Text
            style={[styles.hostBadgeText, { fontFamily: fonts.family.aldrich }]}
          >
            HOST
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={layout.flex_1}>
      <ScrollView
        style={layout.flex_1}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <View style={styles.pageTitleRow}>
          <TouchableOpacity
            onPress={onLeave}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="arrow-left" size={22} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              styles.pageTitle,
              { fontFamily: fonts.family.aldrich, color: colors.text },
            ]}
          >
            Sala de espera
          </Text>
        </View>

        {roomCode ? (
          <TouchableOpacity
            style={[styles.codeCard, CARD]}
            onPress={onShare}
            activeOpacity={0.8}
          >
            <View>
              <Text
                style={[
                  styles.sectionLabel,
                  { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
                ]}
              >
                Código da sala
              </Text>
              <Text
                style={[
                  styles.codeText,
                  { fontFamily: fonts.family.aldrich, color: '#3B82F6' },
                ]}
              >
                {roomCode}
              </Text>
            </View>

            <View
              style={[
                styles.shareBtn,
                {
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  borderColor: 'rgba(59,130,246,0.3)',
                },
              ]}
            >
              <Feather name="share-2" size={18} color="#3B82F6" />
              <Text
                style={{
                  color: '#3B82F6',
                  fontFamily: fonts.family.aldrich,
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                Compartilhar
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.codeCard, CARD, { gap: 12 }]}>
            <ActivityIndicator color="#3B82F6" />
            <Text
              style={{ color: '#94A3B8', fontFamily: fonts.family.aldrich }}
            >
              Criando sala...
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { fontFamily: fonts.family.aldrich, color: '#94A3B8' },
            ]}
          >
            Jogadores ({players.length})
          </Text>

          <View style={[styles.playersCard, CARD]}>
            {players.length === 0 ? (
              <View style={styles.emptyState}>
                <AstronautIcon
                  color="#374151"
                  armColor="#1a1a1a"
                  armStrokeColor="#374151"
                  size={44}
                />
                <Text
                  style={{
                    color: '#4B5563',
                    fontFamily: fonts.family.aldrich,
                    fontSize: 13,
                    marginTop: 10,
                  }}
                >
                  Aguardando jogadores...
                </Text>
              </View>
            ) : (
              players.map((p, i) => renderPlayer(p, i))
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footerBar,
          {
            borderTopColor: 'rgba(59,130,246,0.18)',
            backgroundColor: colors.background,
          },
        ]}
      >
        {isHost ? (
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: players.length >= 2 ? '#3B82F6' : '#374151' },
            ]}
            onPress={onStartGame}
            disabled={players.length < 2}
          >
            {players.length < 2 ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text
                  style={[
                    styles.primaryBtnText,
                    { fontFamily: fonts.family.aldrich },
                  ]}
                >
                  Aguardando jogadores...
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.primaryBtnText,
                    { fontFamily: fonts.family.aldrich },
                  ]}
                >
                  Iniciar partida
                </Text>
                <Feather name="play" size={18} color="white" />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.waitingRow}>
            <ActivityIndicator color="#3B82F6" size="small" />
            <Text
              style={{
                color: '#94A3B8',
                fontFamily: fonts.family.aldrich,
                fontSize: 13,
                marginLeft: 10,
              }}
            >
              Aguardando o host iniciar...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 6,
    marginTop: 4,
  },
  shareBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  playersCard: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  playerAvatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  playerAvatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.22)',
    backgroundColor: 'rgba(59,130,246,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarFallbackText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '700',
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  hostBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  hostBadgeText: {
    fontSize: 10,
    color: '#3B82F6',
    letterSpacing: 1,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerBar: {
    padding: 16,
    borderTopWidth: 1,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'center',
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
});
