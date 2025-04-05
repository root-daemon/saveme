import {
  useReadContract,
  useWriteContract,
  useSendTransaction as useWagmiSendTransaction,
  useBalance,
} from "wagmi";
import { WalletABI, WALLET_CONTRACT_ADDRESS } from "../lib/contract";
import { parseEther, formatEther } from "viem";
import { useState, useEffect } from "react";
import { useWalletContext } from "../context/WalletContext";

type Address = `0x${string}`;

// Hook for getting native ETH balance
export function useNativeBalance() {
  const { address, isConnected } = useWalletContext();

  const {
    data: balanceData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBalance({
    address,
  });

  return {
    balance: balanceData?.formatted || "0",
    symbol: balanceData?.symbol || "ETH",
    isLoading,
    isError,
    error,
    refetch,
  };
}

// Hook for getting user tokens
export function useGetUserTokens() {
  const { address, isConnected } = useWalletContext();

  const {
    data: tokens,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: WALLET_CONTRACT_ADDRESS,
    abi: WalletABI,
    functionName: "getUserTokens",
    account: address,
    query: {
      enabled: Boolean(isConnected),
    },
  });

  return {
    tokens: tokens as Address[] | undefined,
    userTokens: tokens as Address[] | undefined,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// Hook for getting token balance
export function useGetTokenBalance(tokenAddress?: Address) {
  const { address, isConnected } = useWalletContext();

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
  const { address, isConnected } = useWalletContext();
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
  const { address, isConnected } = useWalletContext();
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

// Hook for transferring tokens
export function useTransferToken() {
  const { address, isConnected } = useWalletContext();
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

  const transferToken = async (
    tokenAddress: Address,
    toAddress: Address,
    amount: string
  ) => {
    if (!isConnected || !address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      writeContract({
        address: WALLET_CONTRACT_ADDRESS,
        abi: WalletABI,
        functionName: "transferToken",
        args: [tokenAddress, toAddress, parseEther(amount)],
      });
    } catch (err) {
      console.error("Error transferring token:", err);
    }
  };

  return {
    transferToken,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
}

// Hook for getting all balances
export function useGetAllBalances() {
  const { tokens, isLoading: tokensLoading } = useGetUserTokens();
  const [tokenBalances, setTokenBalances] = useState<
    { token: Address; balance: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useWalletContext();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!tokens || tokens.length === 0 || !isConnected) {
        setTokenBalances([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // For demo purposes, using dummy data
        // In a real implementation, you'd fetch each balance
        const balances = tokens.map((token) => ({
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
  }, [tokens, tokensLoading, isConnected, address]);

  return {
    tokenBalances,
    isLoading: isLoading || tokensLoading,
  };
}

// Unified hook for wallet functionality
export function useWalletFunctions() {
  const { tokens, userTokens, refetch: refetchTokens } = useGetUserTokens();
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
  const { address, isConnected } = useWalletContext();

  // Refresh data when operations succeed
  useEffect(() => {
    if (isAddSuccess || isRemoveSuccess) {
      refetchTokens();
    }
  }, [isAddSuccess, isRemoveSuccess, refetchTokens]);

  return {
    tokens,
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

// Hook for sending native ETH
export function useSendTransaction() {
  const { address, isConnected } = useWalletContext();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    sendTransaction,
    isPending,
    isError,
    error,
    isSuccess: wagmiIsSuccess,
    reset,
  } = useWagmiSendTransaction();

  useEffect(() => {
    if (wagmiIsSuccess) {
      setIsSuccess(true);
      // Reset after a delay
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [wagmiIsSuccess]);

  const sendEth = async (toAddress: Address, amount: string) => {
    if (!isConnected || !address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      sendTransaction({
        to: toAddress,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error("Error sending ETH:", err);
    }
  };

  return {
    sendEth,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
}
