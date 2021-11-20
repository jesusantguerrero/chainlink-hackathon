/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";
import { useContract } from "../composables/useContract";
import axios from "axios";

export const fetchMyItems = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
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

export interface IAsset {
  name: string;
  description: string;
  attributes: Record<string, string>;
}
export interface NFTAsset {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  price: string;
  owner: string;
  claimable: boolean;
}
