/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";

export interface ICustomProvider {
  web3: any;
  account?: string;
  accounts: string[];
  networkId?: number;
  balance: number;
  loading: boolean;
  error: any;
  connected: boolean;
  isConnectedToValidNetwork: boolean;
  chainId: string;
  currency: string;
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

export interface ITournamentWithEvent {
  id: number;
  name: string;
  description: string;
  seats: number;
  eventId: number;
  edition: number;
  startDate: number;
  endDate: number;
  seatsTaken: number;
  fee: number;
  realFee: number;
}

export interface INftDetails {
  tokenId: number;
  name: string;
  breed: string;
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
  token: number;
  eventId: number;
  attacker: ethers.BigNumber;
  defense: ethers.BigNumber;
  winner: ethers.BigNumber;
  date: number;
  active: boolean;
  attackerToken?: INftDetails;
  defenseToken?: INftDetails;
}
