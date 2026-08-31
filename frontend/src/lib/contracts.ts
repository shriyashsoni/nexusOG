import testnetDeployments from "../deployments/deployments-0g-testnet.json";
import hardhatDeployments from "../deployments/deployments-hardhat.json";

export interface ContractAddresses {
  Guardian: string;
  AgentRegistry: string;
  WOG: string;
  NexusVault: string;
}

export const getContractAddresses = (chainId: number | undefined): ContractAddresses => {
  if (chainId === 31337) {
    return hardhatDeployments.contracts;
  }
  // Default to 0G Galileo Testnet
  return testnetDeployments.contracts;
};
