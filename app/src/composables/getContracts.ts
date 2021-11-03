/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";
import { config } from "../config";

import NFT from "../../../artifacts/contracts/RoosterFight.sol/RoosterFight.json";

export const getContracts = (
  provider: ethers.providers.Provider | ethers.Signer
) => {
  if (!config.nftAddress) return {};
  const Cockfighter = new ethers.Contract(config.nftAddress, NFT.abi, provider);

  return {
    Cockfighter,
  };
};
