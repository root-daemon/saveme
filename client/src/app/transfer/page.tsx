'use client'
import React, { useState } from 'react'
import { Connect } from '../../components/wallet/Connect'
import { motion, AnimatePresence } from 'framer-motion'
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
    SiCardano
} from 'react-icons/si'

const coins = [
    { name: 'Ethereum', symbol: 'ETH', icon: <SiEthereum /> },
    { name: 'Bitcoin', symbol: 'BTC', icon: <SiBitcoin /> },
    { name: 'USD Coin', symbol: 'USDC', icon: <SiUbiquiti /> },
    { name: 'Tether', symbol: 'USDT', icon: <SiTether /> },
    { name: 'Solana', symbol: 'SOL', icon: <SiSolana /> },
    { name: 'Ripple', symbol: 'XRP', icon: <SiRipple /> },
    { name: 'Litecoin', symbol: 'LTC', icon: <SiLitecoin /> },
    { name: 'Chainlink', symbol: 'LINK', icon: <SiChainlink /> },
    { name: 'Binance Coin', symbol: 'BNB', icon: <SiBinance /> },
    { name: 'Dogecoin', symbol: 'DOGE', icon: <SiDogecoin /> },
    { name: 'Polkadot', symbol: 'DOT', icon: <SiPolkadot /> },
    { name: 'Cardano', symbol: 'ADA', icon: <SiCardano /> },
]

export default function TransactionPage() {
    const [toAddress, setToAddress] = useState('')
    const [amount, setAmount] = useState('')
    const [coinType, setCoinType] = useState(coins[0])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isWalletConnected, setIsWalletConnected] = useState(false) // State to track wallet connection

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log({ toAddress, amount, coinType })
    }

    const handleCoinSelect = (coin: { name: string, symbol: string, icon: any }) => {
        setCoinType(coin)
        setIsModalOpen(false)
    }

    const handleWalletConnect = () => {
        // Logic to connect the wallet
        setIsWalletConnected(true)
    }

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
                <button
                    type="submit"
                    className="w-full bg-foreground/10 cursor-pointer text-foreground py-3 rounded-full font-medium transition"
                    onClick={!isWalletConnected ? handleWalletConnect : undefined}
                >
                    Send Tokens
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
                                        <span className="text-2xl text-foreground">{coin.icon}</span>
                                        <span className="text-lg font-medium">{coin.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
