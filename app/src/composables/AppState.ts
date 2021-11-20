import { ethers } from "ethers";
import { Moralis } from "moralis";
import { reactive } from "vue";
import { INftDetails } from "../types";

export interface IAppState {
  user: null | Moralis.User;
  signer: null | ethers.providers.JsonRpcSigner;
  roosters: INftDetails[];
  isLoading: boolean;
}

export const AppState = reactive<IAppState>({
  user: null,
  signer: null,
  roosters: [],
  isLoading: true,
});
