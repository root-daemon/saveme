import { WalletABI } from "../abi/WalletABI";

// Contract addresses - replace with actual deployed addresses
export const WALLET_CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;

export const EXAMPLE_TOKENS = {
  ETH: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  BTC: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  LINK: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  DOT: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
} as const;

export { WalletABI };
