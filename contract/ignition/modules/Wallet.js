import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployTokens", (m) => {
  const wallet = m.contract("Wallet", []);

  return { wallet };
});
