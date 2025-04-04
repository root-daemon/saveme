import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenFactoryLPModule", (m) => {
  const deployer = m.getAccount(0);

  const tokenFactory = m.contract("TokenFactory", []);

  const tokenName = "Custom Token";
  const tokenSymbol = "CTK";
  const initialSupply = ethers.parseEther("1000000");

  const createTokenTx = m.call(
    tokenFactory,
    "createToken",
    [tokenName, tokenSymbol, initialSupply],
    {
      from: deployer,
    }
  );

  const tokenAddress = m.readEventArgument(createTokenTx, "TokenCreated", 0);

  const liquidityPool = m.contract("LiquidityPool", [tokenAddress]);

  const approveTx = m.call(
    tokenAddress,
    "approve",
    [liquidityPool, ethers.parseEther("10000")],
    {
      from: deployer,
    }
  );

  const addLiquidityTx = m.call(
    liquidityPool,
    "addLiquidity",
    [ethers.parseEther("10000")],
    {
      from: deployer,
      value: ethers.parseEther("10"),
    }
  );

  return {
    tokenFactory,
    createTokenTx,
    liquidityPool,
    approveTx,
    addLiquidityTx,
  };
});
