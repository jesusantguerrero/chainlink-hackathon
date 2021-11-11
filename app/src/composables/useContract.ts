/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";
import { config } from "../config";

import contracts from "../contracts.json";

interface IContractDefinition {
  abi: string;
  address: string;
}


const findNetworkContracts = (
  chainId: string
): Record<string, IContractDefinition> | null => {
  return contracts.chainId === chainId ? contracts.contracts : null;
};

export const useContract = (
  contractName: string,
  provider: ethers.providers.Provider | ethers.Signer
) => {
  const contracts = findNetworkContracts("1337");
  if (contracts && contracts[contractName]) {
    const contract: IContractDefinition = contracts[contractName];
    return new ethers.Contract(contract.address, contract.abi, provider);
  }
  return null;
};
