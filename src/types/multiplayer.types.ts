// ─── Jogador ──────────────────────────────────────────────────────────────────
export type LobbyPlayer = {
  id: string;
  name: string;
  ready?: boolean;
  cardCount?: number;
  isEliminated?: boolean;
};

export type HandCard = {
  id: string;
  type: string;
  color: string;
};

// ─── Sala ─────────────────────────────────────────────────────────────────────
export type RoomPhase = 'waiting' | 'playing' | 'finished';

// ─── Partida ──────────────────────────────────────────────────────────────────
export type GameState = {
  roomId: string;
  currentTurnPlayerId: string;
  players: LobbyPlayer[];
  playerHands: Record<string, HandCard[]>;
  turnNumber?: number;
};

// ─── Payloads do servidor ─────────────────────────────────────────────────────

/** room:created → { roomId, code } */
export type RoomCreatedPayload = {
  roomId: string;
  code: string;
};

/** room:player_joined / room:player_left → { playerId, playerName?, players[] } */
export type RoomPlayersPayload = {
  playerId: string;
  playerName?: string;
  players: { id: string; name: string }[];
};

/** card:played — log público */
export type PublicActionPayload = {
  playerId: string;
  playerName: string;
  card: { type: string; color: string };
  effectDescription: string;
};

/** interrupt:available */
export type InterruptPayload = {
  interruptType: 'steal' | 'card_played';
  attackerId: string;
  attackerName: string;
  cardType: string;
  timeoutMs: number;
  availableResponses: string[];
};

/** discard:required */
export type ForcedDiscardPayload = {
  reason: 'vortex' | 'black_hole';
  requiredColor: string;
};

/** match:end */
export type GameOverPayload = {
  winnerId: string;
  winnerName: string;
};

/** error */
export type SocketErrorPayload = {
  code: string;
  message: string;
};