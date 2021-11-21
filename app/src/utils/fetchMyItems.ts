/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";
import { useContract } from "../composables/useContract";

export const fetchMyItems = async (signer: ethers.providers.JsonRpcSigner) => {
  const Cockfighter = useContract("RoosterFight", signer);

  let roosters = await Cockfighter?.functions.getMyRoosters();
  roosters = await Promise.all(
    roosters[0].map(async (item: ethers.BigNumber) => {
      const rooster = await Cockfighter?.getDetails(item.toNumber());

      return {
        tokenId: item.toNumber(),
        ...rooster,
      };
    })
  );

  return roosters;
};
