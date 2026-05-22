import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { getSocket, disconnectSocket } from '@/services/socket';
import { storage } from '@/services/storage';
import type {
  RoomPhase,
  LobbyPlayer,
  PlayerView,
  PublicActionPayload,
  InterruptPayload,
  ForcedDiscardPayload,
  GameOverPayload,
  RoomCreatedPayload,
  RoomPlayersPayload,
  SocketErrorPayload,
} from '@/types/multiplayer.types';

const EV = {
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_CREATED: 'room:created',
  ROOM_PLAYER_JOINED: 'room:player_joined',
  ROOM_PLAYER_LEFT: 'room:player_left',
  MATCH_START: 'match:start',
  MATCH_END: 'match:end',
  CARD_PLAY: 'card:play',
  CARD_PLAYED: 'card:played',
  TURN_PASS: 'turn:pass',
  STATE_UPDATE: 'state:update',
  STATE_REQUEST: 'state:request',
  INTERRUPT_AVAILABLE: 'interrupt:available',
  INTERRUPT_PLAY: 'interrupt:play',
  DISCARD_REQUIRED: 'discard:required',
  DISCARD_SUBMIT: 'discard:submit',
  PLAYER_ELIMINATED: 'player:eliminated',
  PLAYER_RETURNED: 'player:returned',
  ERROR: 'error',
} as const;

export type MultiplayerState = {
  connected: boolean;
  mySocketId: string | null;
  phase: RoomPhase;
  roomId: string | null;
  roomCode: string | null;
  players: LobbyPlayer[];
  playerView: PlayerView | null;
  activityLog: PublicActionPayload[];
  interrupt: InterruptPayload | null;
  forcedDiscard: ForcedDiscardPayload | null;
  gameOver: GameOverPayload | null;
  error: string | null;
  joiningRoomCode?: string | null;
  currentPlayerName?: string | null;
  currentUserId?: string | null;
  isRoomCreator?: boolean;
};

const INITIAL: MultiplayerState = {
  connected: false,
  mySocketId: null,
  phase: 'waiting',
  roomId: null,
  roomCode: null,
  players: [],
  playerView: null,
  activityLog: [],
  interrupt: null,
  forcedDiscard: null,
  gameOver: null,
  error: null,
};

export interface MultiplayerContextValue extends MultiplayerState {
  createRoom: (playerName: string, userId?: string | null) => void;
  joinRoom: (code: string, playerName: string, userId?: string | null) => void;
  startGame: () => void;
  playCard: (payload: {
    cardId: string;
    targetPlayerId?: string;
    recycleCardIds?: string[];
    essenceCardId?: string;
  }) => void;
  passTurn: () => void;
  playInterrupt: (cardId: string) => void;
  sendForcedDiscard: (cardIds: string[]) => void;
  syncState: () => void;
  leaveRoom: () => void;
  resetToLobby: () => void;
  dismissInterrupt: () => void;
  dismissError: () => void;
}

export const MultiplayerContext = createContext<MultiplayerContextValue | null>(
  null,
);

export function MultiplayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MultiplayerState>(INITIAL);
  const stateRef = useRef(state);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const set = useCallback((partial: Partial<MultiplayerState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    const s = socketRef.current;

    const connectSocket = async () => {
      if (!s.connected) {
        try {
          const token = await storage.getToken();
          if (token) {
            s.auth = { token };
          }
        } catch (err) {
          console.log('[MultiplayerRoom] Erro ao buscar token:', err);
        }
        s.connect();
      }
    };

    connectSocket();

    s.on('connect', () => {
      set({ connected: true, mySocketId: s.id ?? null });
      const current = stateRef.current;

      // @ts-ignore
      if (s.recovered) {
        console.log('[socket] Sessão recuperada — mantendo estado anterior');
        return;
      }

      console.log('[socket] Nova sessão — fluxo normal de conexão/fallback');

      if (current.roomCode && current.currentPlayerName) {
        console.log(
          '[Socket] Reconectado sem CSR! Tentando voltar para a sala:',
          current.roomCode,
        );
        s.emit(EV.ROOM_JOIN, {
          code: current.roomCode,
          playerName: current.currentPlayerName,
          userId: current.currentUserId,
        });
      }
    });

    s.on('disconnect', () => set({ connected: false }));

    s.on(EV.ROOM_CREATED, (payload: RoomCreatedPayload) => {
      set({
        roomId: payload.roomId,
        roomCode: payload.code,
        phase: 'waiting',
      });
    });

    s.on(EV.ROOM_PLAYER_JOINED, (payload: RoomPlayersPayload) => {
      set({
        players: payload.players,
        phase: 'waiting',
      });
      setState((prev) => {
        if (!prev.roomCode && prev.joiningRoomCode) {
          return { ...prev, roomCode: prev.joiningRoomCode };
        }
        return prev;
      });
    });

    s.on(EV.ROOM_PLAYER_LEFT, (payload: RoomPlayersPayload) => {
      set({
        players: payload.players,
      });
    });

    s.on(EV.STATE_UPDATE, (game: PlayerView) => {
      set({ playerView: game, phase: 'playing' });
    });

    s.on(EV.CARD_PLAYED, (payload: PublicActionPayload) => {
      setState((prev) => ({
        ...prev,
        activityLog: [payload, ...prev.activityLog].slice(0, 20),
      }));
    });

    s.on(EV.INTERRUPT_AVAILABLE, (payload: InterruptPayload) => {
      set({ interrupt: payload });
    });

    s.on(EV.DISCARD_REQUIRED, (payload: ForcedDiscardPayload) => {
      set({ forcedDiscard: payload });
    });

    s.on(EV.MATCH_END, (payload: GameOverPayload) => {
      set({ gameOver: payload, phase: 'finished' });
    });

    s.on(EV.PLAYER_ELIMINATED, ({ playerId }: { playerId: string }) => {
      setState((prev) => {
        if (!prev.playerView) return prev;
        return {
          ...prev,
          playerView: {
            ...prev.playerView,
            players: prev.playerView.players.map((p) =>
              p.id === playerId ? { ...p, isEliminated: true } : p,
            ),
          },
        };
      });
    });

    s.on(EV.ERROR, (payload: SocketErrorPayload) => {
      set({ error: payload.message });
    });

    return () => {
      Object.values(EV).forEach((ev) => s.off(ev));
      s.off('connect');
      s.off('disconnect');
      disconnectSocket();
    };
  }, [set]);

  const createRoom = useCallback(
    (playerName: string, userId?: string | null) => {
      set({
        currentPlayerName: playerName,
        currentUserId: userId,
        isRoomCreator: true,
      });
      socketRef.current.emit(EV.ROOM_CREATE, { playerName, userId });
    },
    [set],
  );

  const joinRoom = useCallback(
    (code: string, playerName: string, userId?: string | null) => {
      set({
        joiningRoomCode: code,
        currentPlayerName: playerName,
        currentUserId: userId,
        isRoomCreator: false,
      });
      socketRef.current.emit(
        EV.ROOM_JOIN,
        { code, playerName, userId },
        (response?: any) => {
          if (response && response.success !== false) {
            set({
              roomCode: code,
              roomId: response.roomId || null,
              phase: 'waiting',
            });
          }
        },
      );
    },
    [set],
  );

  const startGame = useCallback(() => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.MATCH_START, { roomId: state.roomId });
  }, [state.roomId]);

  const playCard = useCallback(
    (payload: {
      cardId: string;
      targetPlayerId?: string;
      recycleCardIds?: string[];
      essenceCardId?: string;
    }) => {
      if (!state.roomId) return;
      socketRef.current.emit(EV.CARD_PLAY, {
        roomId: state.roomId,
        ...payload,
      });
    },
    [state.roomId],
  );

  const passTurn = useCallback(() => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.TURN_PASS, { roomId: state.roomId });
  }, [state.roomId]);

  const playInterrupt = useCallback(
    (cardId: string) => {
      if (!state.roomId) return;
      socketRef.current.emit(EV.INTERRUPT_PLAY, {
        roomId: state.roomId,
        cardId,
      });
    },
    [state.roomId],
  );

  const sendForcedDiscard = useCallback(
    (cardIds: string[]) => {
      if (!state.roomId) return;
      socketRef.current.emit(EV.DISCARD_SUBMIT, {
        roomId: state.roomId,
        cardIds,
      });
      set({ forcedDiscard: null });
    },
    [state.roomId, set],
  );

  const syncState = useCallback(() => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.STATE_REQUEST, { roomId: state.roomId });
  }, [state.roomId]);

  const leaveRoom = useCallback(() => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.ROOM_LEAVE, { roomId: state.roomId });
    setState(INITIAL);
  }, [state.roomId]);

  const resetToLobby = useCallback(() => {
    set({
      phase: 'waiting',
      playerView: null,
      gameOver: null,
      error: null,
      activityLog: [],
      interrupt: null,
      forcedDiscard: null,
    });
  }, [set]);

  const dismissInterrupt = useCallback(() => set({ interrupt: null }), [set]);
  const dismissError = useCallback(() => set({ error: null }), [set]);

  const value = {
    ...state,
    createRoom,
    joinRoom,
    startGame,
    playCard,
    passTurn,
    playInterrupt,
    sendForcedDiscard,
    syncState,
    leaveRoom,
    resetToLobby,
    dismissInterrupt,
    dismissError,
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
}
