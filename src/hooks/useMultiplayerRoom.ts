import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket, disconnectSocket } from '@/services/socket';
import type {
  RoomPhase,
  LobbyPlayer,
  GameState,
  PublicActionPayload,
  InterruptPayload,
  ForcedDiscardPayload,
  GameOverPayload,
  RoomCreatedPayload,
  RoomPlayersPayload,
  SocketErrorPayload,
} from '@/types/multiplayer.types';

// ─── Eventos (fonte: socket-events.ts do backend) ─────────────────────────────
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

// ─── Estado ───────────────────────────────────────────────────────────────────
type MultiplayerState = {
  connected: boolean;
  phase: RoomPhase;
  roomId: string | null;
  roomCode: string | null;
  players: LobbyPlayer[];
  gameState: GameState | null;
  activityLog: PublicActionPayload[];
  interrupt: InterruptPayload | null;
  forcedDiscard: ForcedDiscardPayload | null;
  gameOver: GameOverPayload | null;
  error: string | null;
  joiningRoomCode?: string | null;
  currentPlayerName?: string | null;
  currentUserId?: string | null;
};

const INITIAL: MultiplayerState = {
  connected: false,
  phase: 'waiting',
  roomId: null,
  roomCode: null,
  players: [],
  gameState: null,
  activityLog: [],
  interrupt: null,
  forcedDiscard: null,
  gameOver: null,
  error: null,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useMultiplayerRoom() {
  const [state, setState] = useState<MultiplayerState>(INITIAL);
  const stateRef = useRef(state);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const set = useCallback((partial: Partial<MultiplayerState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    const s = socketRef.current;
    if (!s.connected) {
      s.connect();
    }

    s.on('connect', () => {
      set({ connected: true });
      const current = stateRef.current;
      
      // @ts-ignore - socket.recovered flag do socket.io-client para CSR
      if (s.recovered) {
        console.log('[socket] Sessão recuperada — mantendo estado anterior');
        return;
      }

      console.log('[socket] Nova sessão — fluxo normal de conexão/fallback');

      // Auto-reconnect flow (fallback): se a gente já tinha uma sala e desconectou por muito tempo
      if (current.roomCode && current.currentPlayerName) {
         console.log('[Socket] Reconectado sem CSR! Tentando voltar para a sala:', current.roomCode);
         s.emit(EV.ROOM_JOIN, { 
           code: current.roomCode, 
           playerName: current.currentPlayerName, 
           userId: current.currentUserId 
         });
      }
    });
    
    s.on('disconnect', () => set({ connected: false }));

    // room:created → { roomId, code }
    s.on(EV.ROOM_CREATED, (payload: RoomCreatedPayload) => {
      set({
        roomId: payload.roomId,
        roomCode: payload.code,
        phase: 'waiting',
      });
    });

    // room:player_joined → { playerId, playerName, players[] }
    s.on(EV.ROOM_PLAYER_JOINED, (payload: RoomPlayersPayload) => {
      set({
        players: payload.players,
        phase: 'waiting'
      });
      // Fallback para caso o roomCode não tenha sido setado corretamente no callback do joinRoom
      setState(prev => {
        if (!prev.roomCode && prev.joiningRoomCode) {
          return { ...prev, roomCode: prev.joiningRoomCode };
        }
        return prev;
      });
    });

    // room:player_left → { playerId, players[] }
    s.on(EV.ROOM_PLAYER_LEFT, (payload: RoomPlayersPayload) => {
      set({
        players: payload.players,
      });
    });

    // state:update → GameState completo
    s.on(EV.STATE_UPDATE, (game: GameState) => {
      set({ gameState: game, phase: 'playing' });
    });

    // card:played → log público
    s.on(EV.CARD_PLAYED, (payload: PublicActionPayload) => {
      setState(prev => ({
        ...prev,
        activityLog: [payload, ...prev.activityLog].slice(0, 20),
      }));
    });

    // interrupt:available → janela de reação
    s.on(EV.INTERRUPT_AVAILABLE, (payload: InterruptPayload) => {
      set({ interrupt: payload });
    });

    // discard:required → Vórtice / Buraco Negro
    s.on(EV.DISCARD_REQUIRED, (payload: ForcedDiscardPayload) => {
      set({ forcedDiscard: payload });
    });

    // match:end → fim de jogo
    s.on(EV.MATCH_END, (payload: GameOverPayload) => {
      set({ gameOver: payload, phase: 'finished' });
    });

    // player:eliminated → marca jogador como eliminado
    s.on(EV.PLAYER_ELIMINATED, ({ playerId }: { playerId: string }) => {
      setState(prev => {
        if (!prev.gameState) return prev;
        return {
          ...prev,
          gameState: {
            ...prev.gameState,
            players: prev.gameState.players.map(p =>
              p.id === playerId ? { ...p, isEliminated: true } : p
            ),
          },
        };
      });
    });

    // error → { code, message }
    s.on(EV.ERROR, (payload: SocketErrorPayload) => {
      set({ error: payload.message });
    });

    return () => {
      Object.values(EV).forEach(ev => s.off(ev));
      s.off('connect');
      s.off('disconnect');
      disconnectSocket();
    };
  }, [set]);

  // ─── Ações ────────────────────────────────────────────────────────────────

  /** Cria sala. Payload: { playerName, userId } */
  const createRoom = useCallback((playerName: string, userId?: string | null) => {
    set({ currentPlayerName: playerName, currentUserId: userId });
    socketRef.current.emit(EV.ROOM_CREATE, { playerName, userId });
  }, [set]);

  /** Entra na sala. Payload: { code, playerName, userId } */
  const joinRoom = useCallback((code: string, playerName: string, userId?: string | null) => {
    set({ joiningRoomCode: code, currentPlayerName: playerName, currentUserId: userId });
    socketRef.current.emit(EV.ROOM_JOIN, { code, playerName, userId }, (response?: any) => {
      // Caso o backend use callbacks para retornar sucesso no join:
      if (response && response.success !== false) {
        set({ roomCode: code, roomId: response.roomId || null, phase: 'waiting' });
      }
    });
  }, [set]);

  /** Inicia partida (host). Payload: { roomId } */
  const startGame = useCallback(() => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.MATCH_START, { roomId: state.roomId });
  }, [state.roomId]);

  /** Joga carta. Payload: { roomId, cardId, targetPlayerId?, recycleCardIds?, essenceCardId? } */
  const playCard = useCallback((payload: {
    cardId: string;
    targetPlayerId?: string;
    recycleCardIds?: string[];
    essenceCardId?: string;
  }) => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.CARD_PLAY, { roomId: state.roomId, ...payload });
  }, [state.roomId]);

  /** Passa o turno. Payload: { roomId } */
  const passTurn = useCallback(() => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.TURN_PASS, { roomId: state.roomId });
  }, [state.roomId]);

  /** Reage com carta de interrupção. Payload: { roomId, cardId } */
  const playInterrupt = useCallback((cardId: string) => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.INTERRUPT_PLAY, { roomId: state.roomId, cardId });
  }, [state.roomId]);

  /** Envia descarte (Vórtice/Buraco Negro). Payload: { roomId, cardIds } */
  const sendForcedDiscard = useCallback((cardIds: string[]) => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.DISCARD_SUBMIT, { roomId: state.roomId, cardIds });
    set({ forcedDiscard: null });
  }, [state.roomId, set]);

  /** Solicita estado atual (reconexão). Payload: { roomId } */
  const syncState = useCallback(() => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.STATE_REQUEST, { roomId: state.roomId });
  }, [state.roomId]);

  /** Sai da sala. Payload: { roomId } */
  const leaveRoom = useCallback(() => {
    if (!state.roomId) return;
    socketRef.current.emit(EV.ROOM_LEAVE, { roomId: state.roomId });
    setState(INITIAL);
  }, [state.roomId]);

  const dismissInterrupt = useCallback(() => set({ interrupt: null }), [set]);
  const dismissError = useCallback(() => set({ error: null }), [set]);

  return {
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
    dismissInterrupt,
    dismissError,
  };
}