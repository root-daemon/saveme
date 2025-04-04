import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenFactoryModule", (m) => {
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

  return { tokenFactory, createTokenTx };
});
