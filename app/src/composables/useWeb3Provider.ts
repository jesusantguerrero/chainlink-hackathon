import {
  reactive,
  computed,
  onMounted,
  watch,
  ref,
  ComputedRef,
  inject,
} from "vue";
import { ethers } from "ethers";
import { AppState } from "./AppState";
import { config } from "../config";

export interface ICustomProvider {
  web3: any;
  account?: string;
  accounts: string[];
  networkId?: number;
  balance: number;
  loading: boolean;
  error: any;
  connected: boolean;
  isConnectedToValidNetwork: ComputedRef<boolean>;
  chainId: string;
  currency: string;
}

export const ProviderState = reactive<ICustomProvider>({
  web3: null,
  account: undefined,
  accounts: [],
  networkId: undefined,
  balance: 0,
  error: null,
  loading: true,
  connected: false,
  chainId: "0",
  isConnectedToValidNetwork: computed(() => {
    const decimalChain = parseInt(ProviderState.chainId, 16);
    return (
      ProviderState.chainId &&
      decimalChain === Number(config.chainId)
    );
  }),
  currency: "ETH",
});

export const signer = ref(null);

export const useWeb3Provider = (initContract: Function) => {
  const ProviderState = inject("ProviderState", {});
  const startApp = ref(initContract);

  const getBalance = async (address: string) => {
    ProviderState.balance = await ProviderState.web3.getBalance(address);
    AppState.provider = {
      ...AppState.provider,
      balance: formatBalance(ProviderState.balance),
    };
  };

  const formatBalance = (balance: string): string => {
    return Number(ethers.utils.formatEther(balance)).toFixed(4);
  };

  const getAccounts = async () => {
    ProviderState.accounts = await ProviderState.web3.listAccounts();
  };

  watch(
    () => ProviderState.account,
    async (current, previous) => {
      if (current !== previous) {
        await onChangeAccount();
        await getBalance(current);
        await getAccounts();
      }
    }
  );

  const onChangeAccount = async () => {
    ProviderState.web3 = new ethers.providers.Web3Provider(ethereum, "any");
    const user = ProviderState.web3.getSigner();
    startApp.value && (await startApp.value());
    AppState.signer = user;
  };

  const resetProviderState = async () => {
    signer.value = null;
    ProviderState.web3 = null;
    ProviderState.account = undefined;
    ProviderState.accounts = [];
    ProviderState.networkId = undefined;
    ProviderState.balance = 0;
    ProviderState.error = null;
    ProviderState.loading = true;
    ProviderState.connected = false;
    startApp.value && (await startApp.value());
  };

  onMounted(async () => {
    startApp.value && (await startApp.value());
    if (window.ethereum) {
      ProviderState.chainId = await window.ethereum.request({ method: "eth_chainId" });
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        ProviderState.accounts = accounts;
        ProviderState.account = accounts[0];
        console.log(ProviderState.account);
      });
    }
  });

  return {
    signer,
    startApp,
    getAccounts,
    resetProviderState,
  };
};

export const useWeb3 = () => {
  return inject("ProviderState", ProviderState);
};
