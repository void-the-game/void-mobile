import { useContext } from 'react';
import {
  MultiplayerContext,
  MultiplayerContextValue,
} from '@/contexts/MultiplayerContext';

export function useMultiplayerRoom(): MultiplayerContextValue {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error(
      'useMultiplayerRoom must be used within a MultiplayerProvider',
    );
  }
  return context;
}
