import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TransferModule", (m) => {
  const transferModule = m.contract("TransferTo", []);

  return { transferModule };
});
