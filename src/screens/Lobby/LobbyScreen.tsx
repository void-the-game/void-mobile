import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Share,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { RoomJoinIcon, RoomCreateIcon } from '@/components/svg/menuIcons';
import { BottomNav, BottomTab } from '@/components/organisms/BottomNav';
import { storage } from '@/services/storage';
import { apiDev } from '@/services/api';
import { useMultiplayerRoom } from '@/hooks/useMultiplayerRoom';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import type { LobbyPlayer } from '@/types/multiplayer.types';
import { SpaceTransitionOverlay } from '@/components/organisms/SpaceTransitionOverlay/SpaceTransitionOverlay';
import { SpaceBackgroundWrapper } from '@/components/organisms/SpaceBackgroundWrapper';

type Navigation = StackNavigationProp<RootStackParamList>;
type LobbyStep = 'browser' | 'waiting';

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

function LobbyWelcome({ username, avatar }: { username: string; avatar?: string }) {
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
                <AstronautIcon color="#3B82F6" armColor="#093075" armStrokeColor="#3B82F6" size={64} />
            )}

            <View style={{ flex: 1 }}>
                <View style={welcomeStyles.bubble}>
                    <Text style={[welcomeStyles.greeting, { fontFamily: fonts.family.aldrich }]}>
                        Acesse uma sala e reúna sua tripulação,
                    </Text>
                    <Text style={[welcomeStyles.username, { fontFamily: fonts.family.aldrich }]}>
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

export default function LobbyScreen() {
    const { layout, colors, fonts } = useTheme();
    const navigation = useNavigation<Navigation>();
    const insets = useSafeAreaInsets();
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
        createRoom,
        joinRoom,
        startGame,
        leaveRoom,
        dismissError,
    } = useMultiplayerRoom();

    const isHost = players.length > 0 && players[0].name === playerName;

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
        }, [])
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

    const resolvePlayerAvatar = (item: LobbyPlayer): string | undefined => {
        if (item.avatar) return item.avatar;
        if (item.id === currentUserId && playerAvatar) return playerAvatar;
        return undefined;
    };

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
        Toast.show({
            type: 'info',
            text1: 'Partida em preparação',
            text2: 'A conexão entre jogadores já funciona, mas o fluxo completo da partida ainda está em construção.',
            visibilityTime: 2800,
        });

        setStartingMatch(false);
    };

    const handleShare = () => {
        if (!roomCode) return;
        Share.share({ message: `Entre na minha sala no Void! Código: ${roomCode}` });
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
                    <Text style={[styles.hostBadgeText, { fontFamily: fonts.family.aldrich }]}>
                        HOST
                    </Text>
                </View>
            )}
        </View>
    );

    if (step === 'browser') {
        return (
            <SpaceBackgroundWrapper>
                <View style={layout.flex_1}>
                    <ScrollView
                        style={layout.flex_1}
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
                                <Text style={[styles.offlineText, { fontFamily: fonts.family.aldrich }]}>
                                    Sem conexão com o servidor
                                </Text>
                            </View>
                        )}

                        <View style={styles.actionStack}>
                            <TouchableOpacity
                                style={[styles.groupCard, CARD]}
                                onPress={handleCreate}
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
                                        <Text style={[styles.groupSubtitle, { fontFamily: fonts.family.aldrich }]}>
                                            Gere um código de sala e convide outros jogadores
                                        </Text>
                                    </View>
                                    <Feather name="arrow-right" size={18} color="#E91E63" />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.groupCard, CARD]}
                                onPress={() => setJoinModalVisible(true)}
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
                                        <Text style={[styles.groupSubtitle, { fontFamily: fonts.family.aldrich }]}>
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
                                        <Text style={[styles.groupSubtitle, { fontFamily: fonts.family.aldrich }]}>
                                            Em breve você poderá visualizar e entrar em salas públicas por aqui
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.emptyRoomsState}>
                                    <Text style={[styles.emptyRoomsText, { fontFamily: fonts.family.aldrich }]}>
                                        Nenhuma listagem disponível no momento
                                    </Text>
                                    <Text style={[styles.emptyRoomsSubtext, { fontFamily: fonts.family.aldrich }]}>
                                        Por enquanto, você pode criar uma nova sala ou entrar usando um código
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <Modal
                        visible={joinModalVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => {
                            setJoinModalVisible(false);
                            setJoinCode('');
                        }}
                    >
                        <View style={styles.modalOverlay}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                style={styles.modalKeyboard}
                            >
                                <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
                                    <View style={styles.modalHandle} />

                                    <Text
                                        style={[
                                            styles.modalTitle,
                                            { fontFamily: fonts.family.aldrich, color: colors.text },
                                        ]}
                                    >
                                        Entrar na sala
                                    </Text>

                                    <Text style={[styles.modalSubtitle, { fontFamily: fonts.family.aldrich }]}>
                                        Digite o código da sala para se conectar à tripulação
                                    </Text>

                                    <TextInput
                                        style={[
                                            styles.modalInput,
                                            { color: colors.text, fontFamily: fonts.family.aldrich, ...CARD },
                                        ]}
                                        placeholder="Ex: ABC123"
                                        placeholderTextColor="#4B5563"
                                        value={joinCode}
                                        onChangeText={setJoinCode}
                                        autoCapitalize="characters"
                                        autoCorrect={false}
                                        maxLength={10}
                                    />

                                    <TouchableOpacity
                                        style={[
                                            styles.primaryBtn,
                                            { backgroundColor: joinCode.trim() ? '#3B82F6' : '#374151' },
                                        ]}
                                        onPress={handleJoin}
                                        disabled={!joinCode.trim()}
                                    >
                                        <Text style={[styles.primaryBtnText, { fontFamily: fonts.family.aldrich }]}>
                                            Confirmar entrada
                                        </Text>
                                        <Feather name="log-in" size={18} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.secondaryBtn}
                                        onPress={() => {
                                            setJoinModalVisible(false);
                                            setJoinCode('');
                                        }}
                                    >
                                        <Text style={[styles.secondaryBtnText, { fontFamily: fonts.family.aldrich }]}>
                                            Cancelar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </Modal>

                    <BottomNav
                        active={activeTab}
                        onChange={handleTabChange}
                        backgroundColor="transparent"
                    />

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

    return (
        <SpaceBackgroundWrapper>
            <View style={layout.flex_1}>
                <ScrollView
                    style={layout.flex_1}
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    <HomeHeader />

                    <View style={styles.pageTitleRow}>
                        <TouchableOpacity
                            onPress={() => {
                                leaveRoom();
                                setStep('browser');
                            }}
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
                            onPress={handleShare}
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
                            <Text style={{ color: '#94A3B8', fontFamily: fonts.family.aldrich }}>
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
                            onPress={handleStartGame}
                            disabled={players.length < 2}
                        >
                            {players.length < 2 ? (
                                <>
                                    <ActivityIndicator color="white" size="small" />
                                    <Text style={[styles.primaryBtnText, { fontFamily: fonts.family.aldrich }]}>
                                        Aguardando jogadores...
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text style={[styles.primaryBtnText, { fontFamily: fonts.family.aldrich }]}>
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
        </SpaceBackgroundWrapper>
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
    quickPlayFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 6,
        marginTop: 4,
    },
    quickPlayText: {
        fontSize: 13,
        color: '#E91E63',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalKeyboard: {
        justifyContent: 'flex-end',
    },
    modalCard: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 36,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.2)',
        gap: 12,
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(148,163,184,0.3)',
        alignSelf: 'center',
        marginBottom: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        letterSpacing: 2,
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
    secondaryBtn: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    secondaryBtnText: {
        color: '#64748B',
        fontSize: 14,
    },
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
    waitingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
});