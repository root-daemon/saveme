import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { WalletABI, WALLET_CONTRACT_ADDRESS } from "../lib/contract";
import { parseEther, formatEther } from "viem";
import { useState, useEffect } from "react";

type Address = `0x${string}`;

// Hook for getting user tokens
export function useGetUserTokens() {
  const { address, isConnected } = useAccount();

  const {
    data: userTokens,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: WALLET_CONTRACT_ADDRESS,
    abi: WalletABI,
    functionName: "getUserTokens",
    account: address,
  });

  return {
    userTokens: (userTokens || []) as Address[],
    isLoading,
    isError,
    error,
    refetch,
  };
}

// Hook for getting token balance
export function useGetTokenBalance(tokenAddress?: Address) {
  const { address, isConnected } = useAccount();

  const {
    data: balance,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: WALLET_CONTRACT_ADDRESS,
    abi: WalletABI,
    functionName: "getTokenBalance",
    args: tokenAddress ? [tokenAddress] : undefined,
    account: address,
    query: {
      enabled: Boolean(isConnected && tokenAddress),
    },
  });

  return {
    balance: balance ? formatEther(balance as bigint) : "0",
    isLoading,
    isError,
    error,
    refetch,
  };
}

// Hook for adding tokens
export function useAddToken() {
  const { address, isConnected } = useAccount();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    writeContract,
    isPending,
    isError,
    error,
    isSuccess: writeSuccess,
    reset,
  } = useWriteContract();

  useEffect(() => {
    if (writeSuccess) {
      setIsSuccess(true);
      // Reset after a delay
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [writeSuccess]);

  const addToken = async (tokenAddress: Address, amount: string) => {
    if (!isConnected || !address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      writeContract({
        address: WALLET_CONTRACT_ADDRESS,
        abi: WalletABI,
        functionName: "addToken",
        args: [tokenAddress, parseEther(amount)],
      });
    } catch (err) {
      console.error("Error adding token:", err);
    }
  };

  return {
    addToken,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
}

// Hook for removing tokens
export function useRemoveToken() {
  const { address, isConnected } = useAccount();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    writeContract,
    isPending,
    isError,
    error,
    isSuccess: writeSuccess,
    reset,
  } = useWriteContract();

  useEffect(() => {
    if (writeSuccess) {
      setIsSuccess(true);
      // Reset after a delay
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [writeSuccess]);

  const removeToken = async (tokenAddress: Address, amount: string) => {
    if (!isConnected || !address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      writeContract({
        address: WALLET_CONTRACT_ADDRESS,
        abi: WalletABI,
        functionName: "removeToken",
        args: [tokenAddress, parseEther(amount)],
      });
    } catch (err) {
      console.error("Error removing token:", err);
    }
  };

  return {
    removeToken,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
}

// Hook for getting all token balances
export function useGetAllBalances() {
  const { userTokens, isLoading: tokensLoading } = useGetUserTokens();
  const [tokenBalances, setTokenBalances] = useState<
    Array<{ token: Address; balance: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!userTokens || userTokens.length === 0 || !isConnected) {
        setTokenBalances([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // For demo purposes, using dummy data
        // In a real implementation, you'd fetch each balance
        const balances = userTokens.map((token) => ({
          token,
          balance: "0.01", // Placeholder value
        }));

        setTokenBalances(balances);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!tokensLoading) {
      fetchBalances();
    }
  }, [userTokens, tokensLoading, isConnected, address]);

  return {
    tokenBalances,
    isLoading: isLoading || tokensLoading,
  };
}

// Unified hook for wallet functionality
export function useWalletFunctions() {
  const { userTokens, refetch: refetchTokens } = useGetUserTokens();
  const {
    addToken,
    isPending: isAddPending,
    isSuccess: isAddSuccess,
  } = useAddToken();
  const {
    removeToken,
    isPending: isRemovePending,
    isSuccess: isRemoveSuccess,
  } = useRemoveToken();
  const { tokenBalances, isLoading } = useGetAllBalances();
  const { address, isConnected } = useAccount();

  // Refresh data when operations succeed
  useEffect(() => {
    if (isAddSuccess || isRemoveSuccess) {
      refetchTokens();
    }
  }, [isAddSuccess, isRemoveSuccess, refetchTokens]);

  return {
    userTokens,
    tokenBalances,
    isLoading,
    addToken,
    removeToken,
    isAddPending,
    isRemovePending,
    address,
    isConnected,
  };
}
