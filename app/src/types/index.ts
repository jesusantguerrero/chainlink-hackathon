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

export interface INftDetails {
  tokenId: number;
  name: string;
  image: string;
  hp: number;
  experience: number;
  level: number;
  wins: number;
  losses: number;
  strength: number;
  speed: number;
  agility: number;
}
export interface IPreToken {
  id: ethers.BigNumber;
  uri: string;
  breed: number;
  claimed: boolean;
}

export interface IAsset {
  name: string;
  description: string;
  attributes: Record<string, string>;
}

export interface IRecord {
  wins: number;
  losses: number;
  draws: number;
}
export interface IPlayer {
  playerId: number;
  tokenId: number;
  name: string;
  image: string;
  record: IRecord;
  points: number;
  owner: string;
}

export interface ICombat {
  id: number;
  attacker: ethers.BigNumber;
  defense: ethers.BigNumber;
  winner: ethers.BigNumber;
}
