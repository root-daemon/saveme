const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("ethers");

module.exports = buildModule("LiquidityPoolAutomation", (m) => {
  const deployer = m.getAccount(0);

  const tokenFactory = m.contract("TokenFactory", []);

  const tokenName = "Custom Token";
  const tokenSymbol = "CTK";
  const initialSupply = ethers.parseEther("1000000");

  const createTokenTx = m.call(tokenFactory, "createToken", [tokenName, tokenSymbol, initialSupply], {
    from: deployer,
  });

  const tokenAddress = m.readEventArgument(createTokenTx, "TokenCreated", "tokenAddress");

  const liquidityPool = m.contract("LiquidityPool", [tokenAddress]);

  const approveTx = m.call(tokenAddress, "approve", [liquidityPool, ethers.parseEther("50000")], {
    from: deployer,
  });

  const addLiquidityTx = m.call(
    liquidityPool,
    "addLiquidity",
    [ethers.parseEther("50000")],
    {
      from: deployer,
      value: ethers.parseEther("50"),
    }
  );

  const swapTx = m.call(
    liquidityPool,
    "swap",
    [ethers.parseEther("100")],
    {
      from: deployer,
    }
  );

  return { tokenFactory, createTokenTx, liquidityPool, approveTx, addLiquidityTx, swapTx };
});
