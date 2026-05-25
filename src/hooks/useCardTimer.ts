import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/types/multiplayer.types';

const TURN_DURATION_MS = 20_000;

interface UseCardTimerParams {
  isMyTurn: boolean;
  myHand: Card[];
  currentTurnIndex: number | undefined;
  onAutoPlay: (card: Card) => void;
}

interface UseCardTimerReturn {
  /** Progresso de 1.0 (início) a 0.0 (expirado) */
  progress: number;
  /** Segundos restantes */
  secondsLeft: number;
}

/**
 * Controla o timer de turno do jogador local.
 * - Só corre quando `isMyTurn === true`
 * - Reseta ao mudar de turno (`currentTurnIndex`)
 * - Ao expirar, joga automaticamente a primeira carta da mão
 */
export function useCardTimer({
  isMyTurn,
  myHand,
  currentTurnIndex,
  onAutoPlay,
}: UseCardTimerParams): UseCardTimerReturn {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlayedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reseta quando o turno muda
  useEffect(() => {
    setElapsed(0);
    autoPlayedRef.current = false;
  }, [currentTurnIndex]);

  // Inicia/para o intervalo baseado em isMyTurn
  useEffect(() => {
    if (!isMyTurn) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 100;
        if (next >= TURN_DURATION_MS) {
          clearTimer();
          return TURN_DURATION_MS;
        }
        return next;
      });
    }, 100);

    return clearTimer;
  }, [isMyTurn, clearTimer]);

  // Auto-play ao expirar
  useEffect(() => {
    if (
      isMyTurn &&
      elapsed >= TURN_DURATION_MS &&
      !autoPlayedRef.current &&
      myHand.length > 0
    ) {
      autoPlayedRef.current = true;
      onAutoPlay(myHand[0]);
    }
  }, [elapsed, isMyTurn, myHand, onAutoPlay]);

  const progress = Math.max(0, 1 - elapsed / TURN_DURATION_MS);
  const secondsLeft = Math.ceil((TURN_DURATION_MS - elapsed) / 1000);

  return { progress, secondsLeft };
}
