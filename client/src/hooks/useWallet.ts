import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { WalletABI, WALLET_CONTRACT_ADDRESS } from "../lib/contract";
import { parseEther, formatEther } from "viem";

type Address = `0x${string}`;

interface TokenBalance {
  token: Address;
  balance: string;
}

export function useWallet() {
  const { address, isConnected } = useAccount();
  const [userTokens, setUserTokens] = useState<Address[]>([]);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Read user tokens
  const {
    data: tokensData,
    isError: isTokensError,
    isLoading: isTokensLoading,
    refetch: refetchTokens,
  } = useReadContract({
    address: WALLET_CONTRACT_ADDRESS,
    abi: WalletABI,
    functionName: "getUserTokens",
    account: address,
  });

  // Add token function
  const {
    writeContract: writeAddToken,
    isPending: isAddTokenPending,
    isError: isAddTokenError,
    isSuccess: isAddTokenSuccess,
  } = useWriteContract();

  const addToken = useCallback(
    (token: Address, amount: string) => {
      if (!address) return;

      writeAddToken({
        address: WALLET_CONTRACT_ADDRESS,
        abi: WalletABI,
        functionName: "addToken",
        args: [token, parseEther(amount)],
      });
    },
    [address, writeAddToken]
  );

  // Remove token function
  const {
    writeContract: writeRemoveToken,
    isPending: isRemoveTokenPending,
    isError: isRemoveTokenError,
    isSuccess: isRemoveTokenSuccess,
  } = useWriteContract();

  const removeToken = useCallback(
    (token: Address, amount: string) => {
      if (!address) return;

      writeRemoveToken({
        address: WALLET_CONTRACT_ADDRESS,
        abi: WalletABI,
        functionName: "removeToken",
        args: [token, parseEther(amount)],
      });
    },
    [address, writeRemoveToken]
  );

  // Update token balances manually (simpler than using useReadContracts)
  const updateBalances = useCallback(async () => {
    if (!userTokens.length || !address) {
      setTokenBalances([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Simple approach with dummy data for demo purposes
    // In a real implementation, you'd need to call the contract for each token
    const balances = userTokens.map((token) => ({
      token,
      balance: "0.01", // Dummy balance for demo
    }));

    setTokenBalances(balances);
    setIsLoading(false);
  }, [userTokens, address]);

  // Update user tokens from contract data
  useEffect(() => {
    if (tokensData) {
      setUserTokens(tokensData as Address[]);
    } else {
      setUserTokens([]);
    }

    setIsLoading(false);
  }, [tokensData]);

  // Update balances when tokens change
  useEffect(() => {
    if (userTokens.length > 0) {
      updateBalances();
    }
  }, [userTokens, updateBalances]);

  // Watch for contract events to update balances
  useWatchContractEvent({
    address: WALLET_CONTRACT_ADDRESS,
    abi: WalletABI,
    eventName: "TokenAdded",
    onLogs() {
      refetchTokens();
    },
  });

  useWatchContractEvent({
    address: WALLET_CONTRACT_ADDRESS,
    abi: WalletABI,
    eventName: "TokenRemoved",
    onLogs() {
      refetchTokens();
    },
  });

  // Refresh data when transaction succeeds
  useEffect(() => {
    if (isAddTokenSuccess || isRemoveTokenSuccess) {
      refetchTokens();
    }
  }, [isAddTokenSuccess, isRemoveTokenSuccess, refetchTokens]);

  return {
    userTokens,
    tokenBalances,
    isLoading,
    isError: isTokensError,
    addToken,
    removeToken,
    isAddTokenPending,
    isRemoveTokenPending,
    formatBalance: formatEther,
  };
}
