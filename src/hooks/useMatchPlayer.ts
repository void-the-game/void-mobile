import { Card, PlayerInfo, PlayerView } from '@/types/multiplayer.types';

export interface UseMatchPlayerParams {
  playerView: PlayerView | null;
  myId: string | null;
  mySocketId: string | null;
}

export interface UseMatchPlayerReturn {
  me: PlayerInfo | undefined;
  myPlayerIndex: number;
  isMyTurn: boolean;
  myHand: Card[];
  opponents: PlayerInfo[];
  currentTurnPlayerId: string | undefined;
}

export function useMatchPlayer({
  playerView,
  myId,
  mySocketId,
}: UseMatchPlayerParams): UseMatchPlayerReturn {
  if (!playerView) {
    return {
      me: undefined,
      myPlayerIndex: -1,
      isMyTurn: false,
      myHand: [],
      opponents: [],
      currentTurnPlayerId: undefined,
    };
  }

  const { players, currentTurnIndex, phase } = playerView;

  // Dual matching: primary by userId, fallback by socketId
  const matchPlayer = (p: PlayerInfo): boolean => {
    if (myId && p.id === myId) return true;
    if (mySocketId && (p.id === mySocketId || p.socketId === mySocketId))
      return true;
    return false;
  };

  const me = players.find(matchPlayer);
  const myPlayerIndex = players.findIndex(matchPlayer);

  const isMyTurn =
    myPlayerIndex >= 0 &&
    currentTurnIndex === myPlayerIndex &&
    phase === 'play';

  const myHand: Card[] = Array.isArray(me?.hand) ? (me!.hand as Card[]) : [];

  const opponents = players.filter((p) => !matchPlayer(p));

  const currentTurnPlayerId =
    playerView?.players?.[playerView.currentTurnIndex]?.id;

  return {
    me,
    myPlayerIndex,
    isMyTurn,
    myHand,
    opponents,
    currentTurnPlayerId,
  };
}
