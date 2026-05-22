import { useState, useEffect } from 'react';
import { Card } from '@/types/multiplayer.types';

interface UseCardPlayParams {
  playCard: (payload: {
    cardId: string;
    recycleCardIds?: string[];
    essenceCardId?: string;
  }) => void;
  currentTurnIndex: number | undefined;
}

interface UseCardPlayReturn {
  selectedCard: Card | null;
  pendingComboCard: Card | null;
  handleSelectCard: (card: Card) => void;
  handleConfirmPlay: () => void;
  handleComboConfirmed: (payload: {
    recycleCardIds?: string[];
    essenceCardId?: string;
  }) => void;
  handleCancelCombo: () => void;
}

export function useCardPlay({
  playCard,
  currentTurnIndex,
}: UseCardPlayParams): UseCardPlayReturn {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [pendingComboCard, setPendingComboCard] = useState<Card | null>(null);

  // Limpa seleção ao trocar de turno
  useEffect(() => {
    setSelectedCard(null);
  }, [currentTurnIndex]);

  const handleSelectCard = (card: Card) => {
    setSelectedCard((prev) => (prev?.id === card.id ? null : card));
  };

  const handleConfirmPlay = () => {
    if (!selectedCard) return;

    // Se for uma carta com opção de combo, abrimos a modal de combo
    if (
      selectedCard.type === 'recycle' ||
      selectedCard.type === 'extra_power'
    ) {
      setPendingComboCard(selectedCard);
      return;
    }

    playCard({ cardId: selectedCard.id });
    setSelectedCard(null);
  };

  const handleComboConfirmed = (payload: {
    recycleCardIds?: string[];
    essenceCardId?: string;
  }) => {
    if (!pendingComboCard) return;
    playCard({
      cardId: pendingComboCard.id,
      ...payload,
    });
    setPendingComboCard(null);
    setSelectedCard(null);
  };

  const handleCancelCombo = () => {
    setPendingComboCard(null);
  };

  return {
    selectedCard,
    pendingComboCard,
    handleSelectCard,
    handleConfirmPlay,
    handleComboConfirmed,
    handleCancelCombo,
  };
}
