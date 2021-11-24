/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";
import { useContract } from "../composables/useContract";
import { ProviderState } from "../composables/useWeb3Provider";

export const fetchMyItems = async (signer: ethers.providers.JsonRpcSigner) => {
  const RoosterFight = useContract("RoosterFight", signer);
  let roosters =
    (await RoosterFight?.getRoostersOf(ProviderState.account)) || [];
  roosters = await Promise.all(
    roosters.map(async (item: ethers.BigNumber) => {
      const rooster = await RoosterFight?.getDetails(item.toNumber());

      return {
        tokenId: item.toNumber(),
        ...rooster,
      };
    })
  );

  return roosters;
};
