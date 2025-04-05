import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("LiquidityPoolAutomation", (m) => {
  const deployer = m.getAccount(0);

  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const liquidityPool = m.contract("LiquidityPool", [tokenAddress]);

  // const approveTx = m.call(tokenAddress, "approve", [liquidityPool, ethers.parseEther("50000")], {
  //   from: deployer,
  // });

  // const addLiquidityTx = m.call(
  //   liquidityPool,
  //   "addLiquidity",
  //   [ethers.parseEther("50000")],
  //   {
  //     from: deployer,
  //     value: ethers.parseEther("5"),
  //   }
  // );

  // const swapTx = m.call(
  //   liquidityPool,
  //   "swap",
  //   [ethers.parseEther("100")],
  //   {
  //     from: deployer,
  //   }
  // );

  return { liquidityPool };
});
