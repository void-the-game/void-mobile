// ─── Jogador ──────────────────────────────────────────────────────────────────
export type LobbyPlayer = {
  id: string;
  name: string;
  avatar?: string;
  ready?: boolean;
  cardCount?: number;
  isEliminated?: boolean;
};

// ─── Partida e Componentes do Jogo ───────────────────────────────────────────

export enum CardType {
  Essence = 'essence',
  Joker = 'joker',
  BlackHole = 'black_hole',
  Vortex = 'vortex',
  BuyPlus1 = 'buy_plus_1',
  BuyPlus2 = 'buy_plus_2',
  StealNextOne = 'steal_next_1',
  StealPrevOne = 'steal_prev_1',
  StealAnyOne = 'steal_any_1',
  Trap = 'trap',
  Recycle = 'recycle',
  BlockPurchase = 'block_purchase',
  SwapNextHand = 'swap_next_hand',
  SwapPrevHand = 'swap_prev_hand',
  SwapAnyHand = 'swap_any_hand',
  ExtraPower = 'extra_power',
  BlockSteal = 'block_steal',
  Reflect = 'reflect',
  Nullify = 'nullify',
}

export enum GamePhase {
  Idle = 'idle',
  Draw = 'draw',
  Play = 'play',
  Resolve = 'resolve',
  React = 'react',
  End = 'end',
}

export enum TurnDirection {
  Clockwise = 'clockwise',
  CounterClockwise = 'counter_clockwise',
}

export interface Card {
  id: string;
  type: CardType;
  color: string;
}

export interface PlayerInfo {
  id: string;
  socketId: string;
  name: string;
  avatar?: string;
  isEliminated: boolean;
  canReturn: boolean;
  hand: Card[] | { count: number };
}

export type RoomPhase = 'waiting' | 'playing' | 'finished';

export interface PlayerView {
  roomId: string;
  players: PlayerInfo[];
  deck: { remaining: number };
  discardPile: Card[];
  currentTurnIndex: number;
  direction: TurnDirection;
  turnNumber: number;
  phase: GamePhase;
  pendingInterrupt: any | null;
  pendingDiscard: any | null;
  blockPurchaseTurnsRemaining: number;
  purchaseBlockedThisTurn: boolean;
  hasPlayedCardThisTurn: boolean;
}

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
  players: LobbyPlayer[];
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
