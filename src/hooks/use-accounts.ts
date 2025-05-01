import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService, { MassChatAccount } from '@/services/api';
import { toast } from 'sonner';

// Query keys
const ACCOUNTS_KEY = 'accounts';

export function useAccounts() {
  const queryClient = useQueryClient();

  // Get all accounts
  const accountsQuery = useQuery({
    queryKey: [ACCOUNTS_KEY],
    queryFn: () => apiService.getAccounts(),
  });

  // Get a single account by ID
  const useAccount = (accountId: number) => {
    return useQuery({
      queryKey: [ACCOUNTS_KEY, accountId],
      queryFn: () => apiService.getAccount(accountId),
      enabled: !!accountId, // Only run if accountId is provided
    });
  };

  // Create a new account
  const createAccountMutation = useMutation({
    mutationFn: (newAccount: MassChatAccount) => apiService.createAccount(newAccount),
    onSuccess: (data) => {
      // Invalidate and refetch accounts list
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] });
      toast.success('Account created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail?.[0]?.msg || 'Failed to create account');
    },
  });

  // Check token status
  const tokenStatusQuery = useQuery({
    queryKey: ['token-status'],
    queryFn: () => apiService.checkTokenStatus(),
    // Token status doesn't need to be frequently checked
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    // Queries
    accountsQuery,
    useAccount,
    tokenStatusQuery,

    // Mutations
    createAccount: createAccountMutation.mutateAsync,
    isCreatingAccount: createAccountMutation.isPending,
  };
} 