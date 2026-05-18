import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { RoomJoinIcon, RoomCreateIcon } from '@/components/svg/menuIcons';

const CARD = {
  backgroundColor: 'rgba(59,130,246,0.08)',
  borderColor: 'rgba(59,130,246,0.22)',
};

function LobbyWelcome({
  username,
  avatar,
}: {
  username: string;
  avatar?: string;
}) {
  const { fonts } = useTheme();
  const [imageError, setImageError] = useState(false);

  return (
    <View style={welcomeStyles.wrapper}>
      {avatar && !imageError ? (
        <Image
          source={{ uri: avatar }}
          style={welcomeStyles.avatar}
          onError={() => setImageError(true)}
        />
      ) : (
        <AstronautIcon
          color="#3B82F6"
          armColor="#093075"
          armStrokeColor="#3B82F6"
          size={64}
        />
      )}

      <View style={{ flex: 1 }}>
        <View style={welcomeStyles.bubble}>
          <Text
            style={[
              welcomeStyles.greeting,
              { fontFamily: fonts.family.aldrich },
            ]}
          >
            Acesse uma sala e reúna sua tripulação,
          </Text>
          <Text
            style={[
              welcomeStyles.username,
              { fontFamily: fonts.family.aldrich },
            ]}
          >
            {username || 'Tripulante'} 👾
          </Text>
          <View style={welcomeStyles.tail} />
        </View>
      </View>
    </View>
  );
}

const welcomeStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59,130,246,0.2)',
  },
  bubble: {
    backgroundColor: 'rgba(30,41,59,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderTopLeftRadius: 2,
  },
  tail: {
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
    borderRightColor: 'rgba(59,130,246,0.35)',
  },
  greeting: { fontSize: 11, color: '#94A3B8', letterSpacing: 0.5 },
  username: { fontSize: 15, color: '#E2E8F0', fontWeight: '700', marginTop: 2 },
});

type LobbyBrowserProps = {
  connected: boolean;
  playerName: string;
  playerAvatar?: string;
  onCreateRoom: () => void;
  onOpenJoinModal: () => void;
};

export function LobbyBrowser({
  connected,
  playerName,
  playerAvatar,
  onCreateRoom,
  onOpenJoinModal,
}: LobbyBrowserProps) {
  const { colors, fonts } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <HomeHeader />
      <LobbyWelcome username={playerName} avatar={playerAvatar} />

      {!connected && (
        <View
          style={[
            styles.offlineBanner,
            {
              borderColor: 'rgba(239,68,68,0.3)',
              backgroundColor: 'rgba(239,68,68,0.08)',
            },
          ]}
        >
          <Feather name="wifi-off" size={14} color="#EF4444" />
          <Text
            style={[styles.offlineText, { fontFamily: fonts.family.aldrich }]}
          >
            Sem conexão com o servidor
          </Text>
        </View>
      )}

      <View style={styles.actionStack}>
        <TouchableOpacity
          style={[styles.groupCard, CARD]}
          onPress={onCreateRoom}
          activeOpacity={0.85}
        >
          <View style={styles.groupHeader}>
            <RoomCreateIcon color="#E91E63" size={48} />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.groupTitle,
                  { fontFamily: fonts.family.aldrich, color: colors.text },
                ]}
              >
                Criar nova sala
              </Text>
              <Text
                style={[
                  styles.groupSubtitle,
                  { fontFamily: fonts.family.aldrich },
                ]}
              >
                Gere um código de sala e convide outros jogadores
              </Text>
            </View>
            <Feather name="arrow-right" size={18} color="#E91E63" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.groupCard, CARD]}
          onPress={onOpenJoinModal}
          activeOpacity={0.85}
        >
          <View style={styles.groupHeader}>
            <Feather name="log-in" size={22} color="#3B82F6" />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.groupTitle,
                  { fontFamily: fonts.family.aldrich, color: colors.text },
                ]}
              >
                Entrar com código
              </Text>
              <Text
                style={[
                  styles.groupSubtitle,
                  { fontFamily: fonts.family.aldrich },
                ]}
              >
                Use um código compartilhado para entrar em uma sala existente
              </Text>
            </View>
            <Feather name="arrow-right" size={18} color="#3B82F6" />
          </View>
        </TouchableOpacity>

        <View style={[styles.groupCard, CARD]}>
          <View style={styles.groupHeader}>
            <RoomJoinIcon color="#3B82F6" size={48} />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.groupTitle,
                  { fontFamily: fonts.family.aldrich, color: colors.text },
                ]}
              >
                Salas disponíveis
              </Text>
              <Text
                style={[
                  styles.groupSubtitle,
                  { fontFamily: fonts.family.aldrich },
                ]}
              >
                Em breve você poderá visualizar e entrar em salas públicas por
                aqui
              </Text>
            </View>
          </View>

          <View style={styles.emptyRoomsState}>
            <Text
              style={[
                styles.emptyRoomsText,
                { fontFamily: fonts.family.aldrich },
              ]}
            >
              Nenhuma listagem disponível no momento
            </Text>
            <Text
              style={[
                styles.emptyRoomsSubtext,
                { fontFamily: fonts.family.aldrich },
              ]}
            >
              Por enquanto, você pode criar uma nova sala ou entrar usando um
              código
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionStack: {
    paddingHorizontal: 16,
    gap: 12,
  },
  groupCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  groupSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  emptyRoomsState: {
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.18)',
    backgroundColor: 'rgba(59,130,246,0.04)',
    borderRadius: 12,
    padding: 14,
  },
  emptyRoomsText: {
    fontSize: 13,
    color: '#E2E8F0',
    marginBottom: 6,
  },
  emptyRoomsSubtext: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  offlineText: {
    fontSize: 12,
    color: '#EF4444',
  },
});
