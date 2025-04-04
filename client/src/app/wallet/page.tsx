"use client";

import { useState } from "react";
import {
  FaEthereum,
  FaBitcoin,
  FaChevronRight,
  FaWallet,
  FaHistory,
  FaExchangeAlt,
} from "react-icons/fa";
import { SiChainlink, SiPolkadot } from "react-icons/si";
import { Connect } from "../../components/wallet/Connect";
import BlurText from "../../components/animated/BlurText";
import CircularText from "../../components/animated/Circular";
import RotatingText from "../../components/animated/Rotate";

export default function WalletDashboard() {
  const [isConnected, setIsConnected] = useState(false);

  const mockWallet = {
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    balance: {
      eth: 3.45,
      btc: 0.12,
      link: 150,
      dot: 75,
    },
    transactions: [
      {
        id: 1,
        type: "Received",
        amount: 0.5,
        token: "ETH",
        date: "2023-04-01",
        from: "0x123...456",
      },
      {
        id: 2,
        type: "Sent",
        amount: 0.1,
        token: "BTC",
        date: "2023-03-28",
        to: "0x789...012",
      },
      {
        id: 3,
        type: "Received",
        amount: 25,
        token: "LINK",
        date: "2023-03-25",
        from: "0x345...678",
      },
    ],
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
        <h3 className="text-3xl font-semibold text-white mb-5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-foreground/10 p-3 rounded-full">
                <FaEthereum className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">Ethereum</h3>
                <p className="text-foreground">{mockWallet.balance.eth} ETH</p>
              </div>
            </div>
          </div>

          <div className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-foreground/10 p-3 rounded-full">
                <FaBitcoin className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">Bitcoin</h3>
                <p className="text-foreground">{mockWallet.balance.btc} BTC</p>
              </div>
            </div>
          </div>

          <div className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-foreground/10 p-3 rounded-full">
                <SiChainlink className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">Chainlink</h3>
                <p className="text-foreground">
                  {mockWallet.balance.link} LINK
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-foreground/10 p-3 rounded-full">
                <SiPolkadot className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">Polkadot</h3>
                <p className="text-foreground">{mockWallet.balance.dot} DOT</p>
              </div>
            </div>
          </div>
        </div>
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
          {mockWallet.transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-6 border-b border-foreground/10 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="bg-foreground/10 p-3 rounded-full">
                  {tx.type === "Received" ? (
                    <FaChevronRight className="text-green-400" />
                  ) : (
                    <FaExchangeAlt className="text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">{tx.type}</h3>
                  <p className="text-foreground text-sm">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">
                  {tx.amount} {tx.token}
                </p>
                <p className="text-foreground text-sm">
                  {tx.type === "Received" ? "From: " + tx.from : "To: " + tx.to}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors">
            <h3 className="text-xl font-medium text-white mb-2">Send</h3>
            <p className="text-foreground">Transfer assets to another wallet</p>
          </button>

          <button className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors">
            <h3 className="text-xl font-medium text-white mb-2">Receive</h3>
            <p className="text-foreground">Get your deposit address</p>
          </button>

          <button className="bg-background/20 backdrop-blur-sm p-6 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors">
            <h3 className="text-xl font-medium text-white mb-2">Swap</h3>
            <p className="text-foreground">Exchange between assets</p>
          </button>
        </div>
      </section>

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
