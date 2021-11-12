/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";

export interface NFTAsset {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  price: string;
  owner: string;
  claimable: boolean;
}

export interface IPreToken {
  id: ethers.BigNumber;
  uri: string;
  breed: number;
  claimed: boolean;
}
