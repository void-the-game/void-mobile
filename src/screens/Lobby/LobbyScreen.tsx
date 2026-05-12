import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Share,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/theme/hooks/useTheme';
import { HomeHeader } from '@/components/organisms/HomeHeader';
import { AstronautIcon } from '@/components/svg/svgIcons';
import { BottomNav, BottomTab } from '@/components/organisms/BottomNav';
import { storage } from '@/services/storage';
import { apiDev } from '@/services/api';
import { useMultiplayerRoom } from '@/hooks/useMultiplayerRoom';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import type { LobbyPlayer } from '@/types/multiplayer.types';
import { SpaceTransitionOverlay } from '@/components/organisms/SpaceTransitionOverlay/SpaceTransitionOverlay';

type Navigation = StackNavigationProp<RootStackParamList>;
type LobbyStep = 'choose' | 'waiting';

const CARD = {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.22)',
};

const ICON_COLORS = ['#3B82F6', '#E91E63', '#10B981', '#A855F7'];

function LobbyWelcome({ username, avatar }: { username: string; avatar?: string }) {
    const { fonts } = useTheme();

    return (
        <View style={welcomeStyles.wrapper}>
            {avatar ? (
                <Image source={{ uri: avatar }} style={welcomeStyles.avatar} />
            ) : (
                <AstronautIcon color="#3B82F6" armColor="#093075" armStrokeColor="#3B82F6" size={64} />
            )}

            <View style={{ flex: 1 }}>
                <View style={welcomeStyles.bubble}>
                    <Text style={[welcomeStyles.greeting, { fontFamily: fonts.family.aldrich }]}>
                        Pronto para a batalha,
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
    greeting: {
        fontSize: 11,
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    username: {
        fontSize: 15,
        color: '#E2E8F0',
        fontWeight: '700',
        marginTop: 2,
    },
});

export default function LobbyScreen() {
    const { layout, colors, fonts } = useTheme();
    const navigation = useNavigation<Navigation>();
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<BottomTab>('home');

    const [step, setStep] = useState<LobbyStep>('choose');
    const [isHost, setIsHost] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [playerAvatar, setPlayerAvatar] = useState<string | undefined>();
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
        dismissError,
    } = useMultiplayerRoom();

    useEffect(() => {
        const load = async () => {
            const [name, userId, token] = await Promise.all([
                storage.getUser(),
                storage.getUserId(),
                storage.getToken(),
            ]);

            if (name) setPlayerName(name);

            if (userId && token) {
                try {
                    const res = await apiDev.get(`/profile/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (res.data?.profile?.avatar) setPlayerAvatar(res.data.profile.avatar);
                    if (res.data?.profile?.nickname) setPlayerName(res.data.profile.nickname);
                } catch (_) { }
            }
        };

        load();
    }, []);

    useEffect(() => {
        if (roomCode) setStep('waiting');
    }, [roomCode]);

    useEffect(() => {
        if (phase === 'playing' && roomId) {
            navigation.navigate(Paths.Match as any, { roomId });
        }
    }, [phase, roomId, navigation]);

    useEffect(() => {
        if (roomCode && creatingRoom) {
            setCreatingRoom(false);
        }
    }, [roomCode, creatingRoom]);

    useEffect(() => {
        if (roomCode && joiningRoom) {
            setJoiningRoom(false);
        }
    }, [roomCode, joiningRoom]);

    useEffect(() => {
        if (phase === 'playing' && startingMatch) {
            setStartingMatch(false);
        }
    }, [phase, startingMatch]);

    useEffect(() => {
        if (error) {
            setCreatingRoom(false);
            setJoiningRoom(false);
            setStartingMatch(false);

            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: error,
            });

            dismissError();
        }
    }, [error, dismissError]);

    const handleTabChange = (tab: BottomTab) => {
  if (tab === 'home') {
    setStep('choose');
    setIsHost(false);
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
                text2: 'Informe seu nome antes de criar.',
            });
            return;
        }

        setIsHost(true);
        setCreatingRoom(true);
        createRoom(playerName.trim());
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
        joinRoom(joinCode.trim().toUpperCase(), playerName.trim());
        setJoinModalVisible(false);
    };

    const handleCloseJoinModal = () => {
        setJoinModalVisible(false);
        setJoinCode('');
    };

    const handleStartGame = () => {
        setStartingMatch(true);
        startGame();
    };

    const handleShare = () => {
        if (!roomCode) return;

        Share.share({
            message: `Entre na minha sala no Void! Código: ${roomCode}`,
        });
    };

    const renderPlayer = (item: LobbyPlayer, index: number) => (
        <View
            key={item.id}
            style={[
                styles.playerRow,
                {
                    borderBottomColor: 'rgba(59,130,246,0.1)',
                },
            ]}
        >
            <View
                style={[
                    styles.playerAvatar,
                    {
                        backgroundColor: 'rgba(59,130,246,0.1)',
                        borderColor: 'rgba(59,130,246,0.22)',
                    },
                ]}
            >
                <AstronautIcon color={ICON_COLORS[index % ICON_COLORS.length]} size={28} />
            </View>

            <Text
                style={[
                    styles.playerName,
                    {
                        fontFamily: fonts.family.aldrich,
                        color: colors.text,
                    },
                ]}
            >
                {item.name}
            </Text>

            {index === 0 && (
                <View style={styles.hostBadge}>
                    <Text
                        style={[
                            styles.hostBadgeText,
                            { fontFamily: fonts.family.aldrich },
                        ]}
                    >
                        HOST
                    </Text>
                </View>
            )}
        </View>
    );

    if (step === 'choose') {
        return (
            <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
                <ScrollView
                    style={layout.flex_1}
                    contentContainerStyle={{
                        paddingTop: insets.top + 8,
                        paddingBottom: 16,
                    }}
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
                                style={[
                                    styles.offlineText,
                                    { fontFamily: fonts.family.aldrich },
                                ]}
                            >
                                Sem conexão com o servidor
                            </Text>
                        </View>
                    )}

                    <View style={styles.menuGrid}>
                        <TouchableOpacity
                            style={[styles.menuBtn, CARD]}
                            onPress={handleCreate}
                            activeOpacity={0.75}
                        >
                            <Text
                                style={[
                                    styles.menuBtnTitle,
                                    { fontFamily: fonts.family.aldrich, color: colors.text },
                                ]}
                                numberOfLines={2}
                            >
                                Criar partida
                            </Text>

                            <View style={styles.menuBtnIcon}>
                                <AstronautIcon
                                    color="#E91E63"
                                    armColor="#5a0020"
                                    armStrokeColor="#E91E63"
                                    size={56}
                                />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuBtn, CARD]}
                            onPress={() => setJoinModalVisible(true)}
                            activeOpacity={0.75}
                        >
                            <Text
                                style={[
                                    styles.menuBtnTitle,
                                    { fontFamily: fonts.family.aldrich, color: colors.text },
                                ]}
                                numberOfLines={2}
                            >
                                Entrar na sala
                            </Text>

                            <View style={styles.menuBtnIcon}>
                                <AstronautIcon
                                    color="#3B82F6"
                                    armColor="#093075"
                                    armStrokeColor="#3B82F6"
                                    size={56}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <Modal
                    visible={joinModalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={handleCloseJoinModal}
                >
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            style={styles.modalKeyboard}
                        >
                            <View
                                style={[
                                    styles.modalCard,
                                    { backgroundColor: colors.background },
                                ]}
                            >
                                <View style={styles.modalHandle} />

                                <Text
                                    style={[
                                        styles.modalTitle,
                                        {
                                            fontFamily: fonts.family.aldrich,
                                            color: colors.text,
                                        },
                                    ]}
                                >
                                    Entrar na sala
                                </Text>

                                <Text
                                    style={[
                                        styles.modalSubtitle,
                                        { fontFamily: fonts.family.aldrich },
                                    ]}
                                >
                                    Digite o código da sala para entrar na partida
                                </Text>

                                <TextInput
                                    style={[
                                        styles.modalInput,
                                        {
                                            color: colors.text,
                                            fontFamily: fonts.family.aldrich,
                                            ...CARD,
                                        },
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
                                        {
                                            backgroundColor: joinCode.trim() ? '#3B82F6' : '#374151',
                                        },
                                    ]}
                                    onPress={handleJoin}
                                    disabled={!joinCode.trim()}
                                >
                                    <Text
                                        style={[
                                            styles.primaryBtnText,
                                            { fontFamily: fonts.family.aldrich },
                                        ]}
                                    >
                                        Confirmar entrada
                                    </Text>
                                    <Feather name="log-in" size={18} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.secondaryBtn}
                                    onPress={handleCloseJoinModal}
                                >
                                    <Text
                                        style={[
                                            styles.secondaryBtnText,
                                            { fontFamily: fonts.family.aldrich },
                                        ]}
                                    >
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
                    backgroundColor={colors.background}
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
        );
    }

    return (
        <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
            <ScrollView
                style={layout.flex_1}
                contentContainerStyle={{
                    paddingTop: insets.top + 8,
                    paddingBottom: 24,
                }}
                showsVerticalScrollIndicator={false}
            >
                <HomeHeader />

                <View style={styles.pageTitleRow}>
                    <TouchableOpacity
                        onPress={() => setStep('choose')}
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
                                style={[
                                    {
                                        color: '#3B82F6',
                                        fontFamily: fonts.family.aldrich,
                                        fontSize: 11,
                                        marginTop: 4,
                                    },
                                ]}
                            >
                                Compartilhar
                            </Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.codeCard, CARD, { gap: 12 }]}>
                        <ActivityIndicator color="#3B82F6" />
                        <Text
                            style={[
                                {
                                    color: '#94A3B8',
                                    fontFamily: fonts.family.aldrich,
                                },
                            ]}
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
                                    style={[
                                        {
                                            color: '#4B5563',
                                            fontFamily: fonts.family.aldrich,
                                            fontSize: 13,
                                            marginTop: 10,
                                        },
                                    ]}
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
                            style={[
                                {
                                    color: '#94A3B8',
                                    fontFamily: fonts.family.aldrich,
                                    fontSize: 13,
                                    marginLeft: 10,
                                },
                            ]}
                        >
                            Aguardando o host iniciar...
                        </Text>
                    </View>
                )}
            </View>

            <SpaceTransitionOverlay
                visible={startingMatch}
                title="Sincronizando tripulação..."
                subtitle="Preparando início da partida"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    pageTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 12,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '700',
    },
    offlineBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    offlineText: {
        color: '#EF4444',
        fontSize: 12,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    menuBtn: {
        width: '47%',
        aspectRatio: 1,
        borderRadius: 16,
        borderWidth: 1,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuBtnTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
    menuBtnIcon: {
        width: '65%',
        height: '65%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        borderWidth: 1,
        padding: 18,
        marginHorizontal: 16,
        marginBottom: 20,
    },
    codeText: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 5,
        marginTop: 4,
    },
    shareBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    playersCard: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        gap: 12,
    },
    playerAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerName: {
        fontSize: 14,
        flex: 1,
    },
    hostBadge: {
        backgroundColor: 'rgba(59,130,246,0.12)',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.3)',
    },
    hostBadgeText: {
        color: '#3B82F6',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 28,
    },
    footerBar: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 999,
        gap: 8,
    },
    primaryBtnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    waitingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'flex-end',
    },
    modalKeyboard: {
        width: '100%',
    },
    modalCard: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderColor: 'rgba(59,130,246,0.18)',
    },
    modalHandle: {
        width: 42,
        height: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(148,163,184,0.28)',
        alignSelf: 'center',
        marginBottom: 18,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginBottom: 16,
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 14,
    },
    secondaryBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    secondaryBtnText: {
        color: '#94A3B8',
        fontSize: 13,
    },
});