import { ethers } from "ethers";

export const formatMaskedWallet = (account: string): string => {
  const first = account.slice(0, 4);
  const last = account.slice(-4);
  return `${first}***${last}`;
};

const networks: Record<number, string> = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  42: "Kovan",
  137: "Polygon",
  80001: "Mumbai",
  1337: "Localhost",
  5777: "Ganache",
};

export const getChainName = (chainId: number | string) => {
  return networks[Number(chainId)] || "Unknown";
};

export const formatEther = (value: string | number): string => {
  return Number(ethers.utils.formatEther(value)).toFixed(4);
}