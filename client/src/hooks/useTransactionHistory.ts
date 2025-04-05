import { useState, useEffect } from "react";
import { usePublicClient, useBlockNumber, useAccount } from "wagmi";
import { formatEther } from "viem";
import { useWalletContext } from "../context/WalletContext";

export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  isIncoming: boolean;
}

// This hook fetches transaction history for the connected wallet
export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use both wagmi's useAccount and our custom context for better compatibility
  const wagmiAccount = useAccount();
  const { address, isConnected } = useWalletContext();
  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Use the first available address
  const walletAddress = address || wagmiAccount.address;

  useEffect(() => {
    let isMounted = true;

    async function fetchTransactionHistory() {
      if (!walletAddress || !publicClient || !blockNumber) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Set a reasonable lookback for demonstration
        // In production, this might be paginated or use an external API/indexer
        const lookbackBlocks = 10;
        const blockRange = Math.min(Number(blockNumber), lookbackBlocks);

        // Track successfully processed blocks to handle errors gracefully
        const processedTxs: Transaction[] = [];

        // Process each block one by one to handle potential errors better
        for (let i = 0; i < blockRange; i++) {
          try {
            const blockNum = BigInt(Number(blockNumber) - i);

            // Get the block with full transaction objects
            const block = await publicClient.getBlock({
              blockNumber: blockNum,
              includeTransactions: true,
            });

            // Skip if we don't have transaction objects
            if (
              !block.transactions ||
              typeof block.transactions[0] === "string"
            ) {
              continue;
            }

            // Find transactions related to this address
            for (const tx of block.transactions) {
              if (typeof tx === "string") continue;

              const toAddressLower = tx.to?.toLowerCase() || "";
              const fromAddressLower = tx.from.toLowerCase();
              const userAddressLower = walletAddress.toLowerCase();

              const isIncoming = toAddressLower === userAddressLower;
              const isOutgoing = fromAddressLower === userAddressLower;

              if (isIncoming || isOutgoing) {
                processedTxs.push({
                  hash: tx.hash,
                  from: tx.from,
                  to: tx.to,
                  value: formatEther(tx.value),
                  timestamp: Number(block.timestamp),
                  isIncoming,
                });
              }
            }
          } catch (blockError) {
            console.warn(
              `Error processing block ${Number(blockNumber) - i}:`,
              blockError
            );
            // Continue with other blocks even if one fails
          }
        }

        // Safety check in case the component unmounted during async operations
        if (!isMounted) return;

        // Sort by timestamp (newest first) and update state
        processedTxs.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(processedTxs);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch transactions")
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTransactionHistory();

    // Polling interval for refreshing tx data
    const intervalId = setInterval(fetchTransactionHistory, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [walletAddress, publicClient, blockNumber]);

  // Return dummy data for testing with a special flag
  // This helps distinguish if the fetching logic is working or not
  const useDummyData = false;

  if (useDummyData) {
    // Return 3 dummy transactions for testing UI
    const now = Math.floor(Date.now() / 1000);
    const dummyTxs: Transaction[] = [
      {
        hash: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        from: "0x1234567890123456789012345678901234567890",
        to: walletAddress as string,
        value: "0.1",
        timestamp: now - 300,
        isIncoming: true,
      },
      {
        hash: "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456",
        from: walletAddress as string,
        to: "0x2345678901234567890123456789012345678901",
        value: "0.05",
        timestamp: now - 3600,
        isIncoming: false,
      },
      {
        hash: "0x789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234",
        from: "0x3456789012345678901234567890123456789012",
        to: walletAddress as string,
        value: "0.2",
        timestamp: now - 7200,
        isIncoming: true,
      },
    ];

    return {
      transactions: dummyTxs,
      isLoading: false,
      error: null,
    };
  }

  return { transactions, isLoading, error };
}
