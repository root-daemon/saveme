#!/bin/bash 
cd contract
bunx hardhat ignition deploy ignition/modules/TokenFactoryModule.js --network hardhat
bunx hardhat ignition deploy ignition/modules/LiquidityPoolAutomation.js --network hardhat
bunx hardhat ignition deploy ignition/modules/AnomalyGuard.js --network hardhat
bunx hardhat ignition deploy ignition/modules/Transfer.js --network hardhat
bunx hardhat ignition deploy ignition/modules/Wallet.js --network hardhat
