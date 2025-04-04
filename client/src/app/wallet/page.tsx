"use client";

import { useState, useRef } from "react";
import {
  FaEthereum,
  FaBitcoin,
  FaChevronRight,
  FaWallet,
  FaHistory,
  FaExchangeAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { SiChainlink, SiPolkadot } from "react-icons/si";
import { Connect } from "../../components/wallet/Connect";
import BlurText from "../../components/animated/BlurText";
import CircularText from "../../components/animated/Circular";
import RotatingText from "../../components/animated/Rotate";
import { useCryptoPrice } from "../../hooks/useCryptoPrice";
import { useWallet } from "../../hooks/useWallet";
import { useAccount } from "wagmi";
import { EXAMPLE_TOKENS } from "../../lib/contract";

export default function WalletDashboard() {
  const { isConnected } = useAccount();
  const {
    prices,
    loading: pricesLoading,
    error: pricesError,
  } = useCryptoPrice();
  const {
    userTokens,
    tokenBalances,
    isLoading: walletLoading,
    addToken,
    removeToken,
    isAddTokenPending,
    isRemoveTokenPending,
    formatBalance,
  } = useWallet();

  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getCryptoPrice = (symbol: string) => {
    const crypto = prices.find(
      (p) => p.symbol.toLowerCase() === symbol.toLowerCase()
    );
    return crypto ? formatPrice(crypto.price) : "Loading...";
  };

  const getTokenBalanceByAddress = (address: string) => {
    const token = tokenBalances.find(
      (t) => t.token.toLowerCase() === address.toLowerCase()
    );
    return token ? formatBalance(token.balance) : "0";
  };

  const handleAddToken = () => {
    if (tokenAddress && amount && !isAddTokenPending) {
      addToken(tokenAddress as `0x${string}`, amount);
      setTokenAddress("");
      setAmount("");
      setIsAddModalOpen(false);
    }
  };

  const handleRemoveToken = () => {
    if (selectedToken && removeAmount && !isRemoveTokenPending) {
      removeToken(selectedToken as `0x${string}`, removeAmount);
      setSelectedToken("");
      setRemoveAmount("");
      setIsRemoveModalOpen(false);
    }
  };

  const openRemoveModal = (token: string) => {
    setSelectedToken(token);
    setIsRemoveModalOpen(true);
  };

  return (
    <main className="bg-background w-screen min-h-screen px-4 md:px-8 lg:px-32 py-16 md:py-32">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center w-full justify-between gap-12 mb-24">
        <div>
          <BlurText
            text="Your Digital"
            delay={0.01}
            animateBy="letters"
            direction="top"
            className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-1 text-white"
          />
          <BlurText
            text="Asset Hub"
            delay={0.05}
            animateBy="letters"
            direction="top"
            className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 text-foreground"
          />

          <p className="opacity-40 mb-8 max-w-lg text-white">
            Manage all your crypto assets in one secure place with real-time
            monitoring and protection.
          </p>

          <Connect />
        </div>
        <div className="relative">
          <CircularText
            text="SECURE*WALLET*DASHBOARD*"
            onHover="goBonkers"
            spinDuration={20}
            className="font-normal"
          />
          <FaWallet className="text-white opacity-30 absolute text-7xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Balance Overview Section */}
      <section className="mb-24">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-3xl font-semibold text-white">
            Your{" "}
            <RotatingText
              texts={["Balance", "Assets", "Portfolio"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-foreground inline-flex text-black overflow-hidden py-1 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </h3>
          {isConnected && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg px-4 py-2 text-white transition-colors"
            >
              <FaPlus /> Add Token
            </button>
          )}
        </div>

        {walletLoading ? (
          <div className="text-center py-12 text-white">
            Loading wallet data...
          </div>
        ) : !isConnected ? (
          <div className="text-center py-12 text-white">
            Connect your wallet to view your assets
          </div>
        ) : tokenBalances.length === 0 ? (
          <div className="text-center py-12 text-white">
            No tokens found in your wallet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-foreground/10 p-3 rounded-full">
                  <FaEthereum className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Ethereum</h3>
                  <p className="text-foreground">{getCryptoPrice("ETH")}</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-white">
                  Balance: {getTokenBalanceByAddress(EXAMPLE_TOKENS.ETH)} ETH
                </span>
                <button
                  onClick={() => openRemoveModal(EXAMPLE_TOKENS.ETH)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaMinus />
                </button>
              </div>
            </div>

            <div className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-foreground/10 p-3 rounded-full">
                  <FaBitcoin className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Bitcoin</h3>
                  <p className="text-foreground">{getCryptoPrice("BTC")}</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-white">
                  Balance: {getTokenBalanceByAddress(EXAMPLE_TOKENS.BTC)} BTC
                </span>
                <button
                  onClick={() => openRemoveModal(EXAMPLE_TOKENS.BTC)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaMinus />
                </button>
              </div>
            </div>

            <div className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-foreground/10 p-3 rounded-full">
                  <SiChainlink className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Chainlink</h3>
                  <p className="text-foreground">{getCryptoPrice("LINK")}</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-white">
                  Balance: {getTokenBalanceByAddress(EXAMPLE_TOKENS.LINK)} LINK
                </span>
                <button
                  onClick={() => openRemoveModal(EXAMPLE_TOKENS.LINK)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaMinus />
                </button>
              </div>
            </div>

            <div className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-foreground/10 p-3 rounded-full">
                  <SiPolkadot className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Polkadot</h3>
                  <p className="text-foreground">{getCryptoPrice("DOT")}</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-white">
                  Balance: {getTokenBalanceByAddress(EXAMPLE_TOKENS.DOT)} DOT
                </span>
                <button
                  onClick={() => openRemoveModal(EXAMPLE_TOKENS.DOT)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaMinus />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section className="mb-24">
        <BlurText
          text="Recent Transactions"
          delay={0.01}
          animateBy="letters"
          direction="top"
          className="text-3xl md:text-4xl font-semibold mb-8 text-white"
        />

        <div className="bg-background/20 backdrop-blur-sm rounded-lg border border-foreground/10">
          {pricesLoading || walletLoading ? (
            <div className="p-6 text-center text-white">
              Loading transactions...
            </div>
          ) : pricesError ? (
            <div className="p-6 text-center text-red-500">{pricesError}</div>
          ) : !isConnected ? (
            <div className="p-6 text-center text-white">
              Connect your wallet to view transactions
            </div>
          ) : (
            Array(3)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 border-b border-foreground/10 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-foreground/10 p-3 rounded-full">
                      {index % 2 === 0 ? (
                        <FaChevronRight className="text-green-400" />
                      ) : (
                        <FaExchangeAlt className="text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white">
                        {index % 2 === 0 ? "Received" : "Sent"}
                      </h3>
                      <p className="text-foreground text-sm">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {formatPrice(Math.random() * 1000)}
                    </p>
                    <p className="text-foreground text-sm">
                      {index % 2 === 0 ? "From: " : "To: "}0x...
                      {Math.random().toString(16).slice(2, 6)}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button
            className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors"
            onClick={() => isConnected && setIsRemoveModalOpen(true)}
          >
            <h3 className="text-xl font-medium text-white mb-2">Send</h3>
            <p className="text-foreground">Transfer assets to another wallet</p>
          </button>

          <button
            className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors"
            onClick={() => isConnected && setIsAddModalOpen(true)}
          >
            <h3 className="text-xl font-medium text-white mb-2">Receive</h3>
            <p className="text-foreground">Get your deposit address</p>
          </button>

          <button className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors">
            <h3 className="text-xl font-medium text-white mb-2">Swap</h3>
            <p className="text-foreground">Exchange between assets</p>
          </button>
        </div>
      </section>

      {/* Add Token Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-background/90 backdrop-blur-md p-8 rounded-xl border border-foreground/20 w-full max-w-md"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Add Token
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-foreground mb-2">
                  Token Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="w-full bg-background/50 border border-foreground/20 rounded-lg p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Amount</label>
                <input
                  type="text"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-background/50 border border-foreground/20 rounded-lg p-3 text-white"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-background text-white border border-foreground/20 rounded-lg p-3 hover:bg-foreground/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToken}
                  disabled={isAddTokenPending || !tokenAddress || !amount}
                  className={`flex-1 bg-foreground text-background rounded-lg p-3 hover:opacity-90 transition-colors ${
                    isAddTokenPending || !tokenAddress || !amount
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isAddTokenPending ? "Processing..." : "Add Token"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Token Modal */}
      {isRemoveModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-background/90 backdrop-blur-md p-8 rounded-xl border border-foreground/20 w-full max-w-md"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Remove Token
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-foreground mb-2">
                  Token Address
                </label>
                <input
                  type="text"
                  value={selectedToken}
                  readOnly
                  className="w-full bg-background/50 border border-foreground/20 rounded-lg p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2">Amount</label>
                <input
                  type="text"
                  placeholder="0.0"
                  value={removeAmount}
                  onChange={(e) => setRemoveAmount(e.target.value)}
                  className="w-full bg-background/50 border border-foreground/20 rounded-lg p-3 text-white"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="flex-1 bg-background text-white border border-foreground/20 rounded-lg p-3 hover:bg-foreground/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveToken}
                  disabled={
                    isRemoveTokenPending || !selectedToken || !removeAmount
                  }
                  className={`flex-1 bg-red-500 text-white rounded-lg p-3 hover:opacity-90 transition-colors ${
                    isRemoveTokenPending || !selectedToken || !removeAmount
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isRemoveTokenPending ? "Processing..." : "Remove Token"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-muted-foreground">
        <p className="text-white">
          © {new Date().getFullYear()} Secure Wallet Dashboard. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}
