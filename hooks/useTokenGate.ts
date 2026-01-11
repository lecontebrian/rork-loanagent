import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { TOKEN_ACTIONS } from '@/constants/premium';

type ActionType = keyof typeof TOKEN_ACTIONS;

export function useTokenGate() {
  const { tokens, subscriptionTier, consumeToken } = useApp();
  const router = useRouter();

  const checkAndConsumeToken = useCallback((actionType: ActionType, onSuccess: () => void): boolean => {
    const action = TOKEN_ACTIONS[actionType];
    
    if (tokens >= action.cost) {
      const success = consumeToken();
      if (success) {
        console.log(`✅ Token consumed for ${action.name}. Remaining: ${tokens - 1}`);
        onSuccess();
        return true;
      }
    }
    
    console.log(`❌ Insufficient tokens for ${action.name}. Current: ${tokens}, Required: ${action.cost}`);
    router.push('/premium');
    return false;
  }, [tokens, consumeToken, router]);

  const canAfford = useCallback((actionType: ActionType): boolean => {
    const action = TOKEN_ACTIONS[actionType];
    return tokens >= action.cost;
  }, [tokens]);

  const getTokenInfo = useCallback((actionType: ActionType) => {
    const action = TOKEN_ACTIONS[actionType];
    return {
      name: action.name,
      cost: action.cost,
      description: action.description,
      canAfford: tokens >= action.cost,
      currentTokens: tokens,
    };
  }, [tokens]);

  return {
    tokens,
    subscriptionTier,
    checkAndConsumeToken,
    canAfford,
    getTokenInfo,
    navigateToPremium: () => router.push('/premium'),
  };
}
