"use client";
import React, { useState, useEffect } from "react";
import { Connect } from "../../components/wallet/Connect";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import {
  useTransferToken,
  useGetTokenBalance,
  useSendTransaction,
  useNativeBalance,
} from "../../hooks/useContractFunctions";
import {
  SiEthereum,
  SiBitcoin,
  SiUbiquiti,
  SiTether,
  SiSolana,
  SiRipple,
  SiLitecoin,
  SiChainlink,
  SiBinance,
  SiDogecoin,
  SiPolkadot,
  SiCardano,
} from "react-icons/si";

// Ethererum special address to represent native ETH
const ETH_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as `0x${string}`;

const coins = [
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: <SiEthereum />,
    address: ETH_ADDRESS,
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    icon: <SiBitcoin />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    icon: <SiUbiquiti />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Tether",
    symbol: "USDT",
    icon: <SiTether />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Solana",
    symbol: "SOL",
    icon: <SiSolana />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Ripple",
    symbol: "XRP",
    icon: <SiRipple />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    icon: <SiLitecoin />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    icon: <SiChainlink />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Binance Coin",
    symbol: "BNB",
    icon: <SiBinance />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    icon: <SiDogecoin />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Polkadot",
    symbol: "DOT",
    icon: <SiPolkadot />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  {
    name: "Cardano",
    symbol: "ADA",
    icon: <SiCardano />,
    address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
];

export default function TransactionPage() {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [coinType, setCoinType] = useState(coins[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, address } = useAccount();

  // For ERC20 token transfers
  const {
    transferToken,
    isPending: isTokenTransferPending,
    isSuccess: isTokenTransferSuccess,
    isError: isTokenTransferError,
    error: tokenTransferError,
  } = useTransferToken();

  // For native ETH transfers
  const {
    sendEth,
    isPending: isEthTransferPending,
    isSuccess: isEthTransferSuccess,
    isError: isEthTransferError,
    error: ethTransferError,
  } = useSendTransaction();

  // Get token balance from Wallet contract
  const { balance: tokenBalance, isLoading: isTokenBalanceLoading } =
    useGetTokenBalance(
      coinType.address === ETH_ADDRESS ? undefined : coinType.address
    );

  // Get native ETH balance directly from wallet
  const { balance: ethBalance, isLoading: isEthBalanceLoading } =
    useNativeBalance();

  const [statusMessage, setStatusMessage] = useState("");

  // Determine which balance to display
  const displayBalance =
    coinType.address === ETH_ADDRESS ? ethBalance : tokenBalance;
  const isBalanceLoading =
    coinType.address === ETH_ADDRESS
      ? isEthBalanceLoading
      : isTokenBalanceLoading;

  // Combined states for UI
  const isPending = isTokenTransferPending || isEthTransferPending;
  const isSuccess = isTokenTransferSuccess || isEthTransferSuccess;
  const isError = isTokenTransferError || isEthTransferError;
  const error = tokenTransferError || ethTransferError;

  // Handle status messages
  useEffect(() => {
    if (isPending) {
      setStatusMessage("Transaction pending...");
    } else if (isSuccess) {
      setStatusMessage("Transaction successful!");
      // Clear form
      setToAddress("");
      setAmount("");
    } else if (isError) {
      setStatusMessage(`Error: ${error?.message || "Transaction failed"}`);
    } else {
      setStatusMessage("");
    }
  }, [isPending, isSuccess, isError, error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected) {
      setStatusMessage("Please connect your wallet first");
      return;
    }

    if (!toAddress || !amount) {
      setStatusMessage("Please fill in all fields");
      return;
    }

    // Make sure toAddress is a valid Ethereum address
    if (!toAddress.startsWith("0x") || toAddress.length !== 42) {
      setStatusMessage("Please enter a valid Ethereum address");
      return;
    }

    try {
      const toAddressFormatted = toAddress as `0x${string}`;

      // Handle differently based on token type
      if (coinType.address === ETH_ADDRESS) {
        // Send native ETH
        sendEth(toAddressFormatted, amount);
      } else {
        // Send ERC20 token
        transferToken(coinType.address, toAddressFormatted, amount);
      }
    } catch (err) {
      console.error("Error submitting transaction:", err);
      setStatusMessage(
        `Error: ${(err as Error).message || "Transaction failed"}`
      );
    }
  };

  const handleCoinSelect = (coin: (typeof coins)[0]) => {
    setCoinType(coin);
    setIsModalOpen(false);
  };

  return (
    <main className="bg-background text-white min-h-screen flex flex-col items-center justify-center px-4">
      <div className="absolute top-0 right-4">
        <Connect />
      </div>
      <form
        className="bg-white/5 rounded-3xl p-6 w-full max-w-md shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-medium mb-4">You're sending</h2>
        <div className="flex flex-col justify-between items-center bg-white/5 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center justify-center w-full">
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent py-12 text-center text-6xl font-semibold w-full outline-none"
            />
          </div>
          <div
            className="flex items-center gap-2 opacity-50 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-xl text-foreground">{coinType.icon}</span>
            <span className="text-lg text-color">{coinType.symbol}</span>
          </div>
          {!isBalanceLoading && (
            <div className="mt-2 text-sm">
              Available: {displayBalance} {coinType.symbol}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">To</label>
          <input
            type="text"
            placeholder="Wallet address or ENS name"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="w-full bg-white/5 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        {statusMessage && (
          <div
            className={`mb-4 p-2 rounded text-sm ${
              isError
                ? "bg-red-900/30 text-red-200"
                : isSuccess
                ? "bg-green-900/30 text-green-200"
                : "bg-blue-900/30 text-blue-200"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!isConnected || isPending}
          className="w-full bg-foreground/10 cursor-pointer text-foreground py-3 rounded-full font-medium transition hover:bg-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isConnected
            ? "Connect Wallet to Send"
            : isPending
            ? "Sending..."
            : "Send Tokens"}
        </button>
      </form>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-background/25 backdrop-blur-lg bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-[#0d2012] rounded-2xl p-6 w-full max-w-sm shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-medium mb-4">Select a Coin</h2>
              <ul className="space-y-3">
                {coins.map((coin) => (
                  <li
                    key={coin.symbol}
                    className="flex items-center gap-4 p-3 px-4 cursor-pointer hover:bg-white/10 rounded-2xl transition"
                    onClick={() => handleCoinSelect(coin)}
                  >
                    <span className="text-2xl text-foreground">
                      {coin.icon}
                    </span>
                    <span className="text-lg font-medium">{coin.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
