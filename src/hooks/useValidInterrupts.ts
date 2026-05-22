import { Card, InterruptPayload } from '@/types/multiplayer.types';

interface UseValidInterruptsParams {
  interrupt: InterruptPayload | null;
  myHand: Card[];
}

/**
 * Pure derived-value hook that filters the player's hand to cards that are
 * valid responses to the current interrupt.
 *
 * Filtering rules (based on attackType):
 *  - starts with 'steal_'                          → nullify, block_steal, reflect
 *  - starts with 'swap' | is 'vortex' | 'black_hole' → nullify only
 *  - interrupt is null or any other type           → []
 */
export function useValidInterrupts({
  interrupt,
  myHand,
}: UseValidInterruptsParams): Card[] {
  if (interrupt === null) {
    return [];
  }

  const attackType = interrupt.cardType;
  let allowedTypes: string[] = [];

  if (attackType.startsWith('steal_')) {
    allowedTypes = ['nullify', 'block_steal', 'reflect'];
  } else if (
    attackType.startsWith('swap') ||
    attackType === 'vortex' ||
    attackType === 'black_hole'
  ) {
    allowedTypes = ['nullify'];
  } else {
    return [];
  }

  return myHand.filter((c) => allowedTypes.includes(c.type));
}
