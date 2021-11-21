import { ethers } from "ethers";
import { Moralis } from "moralis";
import { reactive, computed, ComputedRef } from "vue";
import { INftDetails } from "../types";
import { fetchMyItems } from "../utils/fetchMyItems";

export interface IAppState {
  user: null | Moralis.User;
  signer: null | ethers.providers.JsonRpcSigner;
  roosters: INftDetails[];
  isLoading: boolean;
  currentNft: ComputedRef<null | INftDetails>;
  fetchMyNfts: () => Promise<void>;
}

export const AppState = reactive<IAppState>({
  user: null,
  signer: null,
  roosters: [],
  isLoading: true,
  currentNft: computed<null | INftDetails>(() => {
    return AppState.roosters.length && AppState.roosters[0]?.tokenId;
  }),
  fetchMyNfts: async () => {
    if (AppState.signer) {
      AppState.isLoading = true;
      AppState.roosters = await fetchMyItems(AppState.signer);
      AppState.isLoading = false;
    }
  },
});
