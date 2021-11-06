/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";
import { getContracts } from "../composables/getContracts";
import axios from "axios";

export const fetchMyItems = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const { Cockfighter } = getContracts(signer);

  let roosters = await Cockfighter?.functions.getMyRoosters();
  roosters = await Promise.all(
    roosters[0].map(async (item: ethers.BigNumber) => {
      const tokenURI = await Cockfighter?.tokenURI(item.toNumber());
      const rooster = await axios(tokenURI)
        .then(({ data }) => data)
        .catch(() => {
          return {};
        });

      return {
        tokenId: item.toNumber(),
        ...rooster,
      };
    })
  );

  return roosters;
};

export interface NFTAsset {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  price: string;
  owner: string;
  claimable: boolean;
}
