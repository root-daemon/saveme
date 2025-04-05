#!/bin/bash 

# Install dependencies
cd contract

# Deploy the contracts
bunx hardhat ignition deploy ignition/modules/TokenFactoryModule.js --network hardhat

# Deploy the contracts
bunx hardhat ignition deploy ignition/modules/LiquidityPoolAutomation.js --network hardhat

# Deploy the contracts
bunx hardhat ignition deploy ignition/modules/AnomalyGuard.js --network hardhat

# Deploy the contracts
bunx hardhat ignition deploy ignition/modules/Transfer.js --network hardhat
bunx hardhat ignition deploy ignition/modules/Wallet.js --network hardhat
