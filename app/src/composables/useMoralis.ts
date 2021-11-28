/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import Web3 from "web3/dist/web3.min";
import Moralis from "moralis/dist/moralis";
import { config } from "../config/";
import { useAppState } from "./useAppState";
import { ProviderState, useWeb3Provider } from "./useWeb3Provider";
import { AppState } from "./AppState";
import { fetchMyItems } from "../utils/fetchMyItems";
import { useMessage } from "../utils/useMessage";

const { setUser } = useAppState();
window.Web3 = Web3;

Moralis.initialize(config.moralisKey);
Moralis.serverURL = config.moralisServerURL;

const initUser = async (user: Moralis.User) => {
  setUser(user);
  ProviderState.account = user.attributes.accounts[0];
  AppState.isLoading = true;
  setTimeout(async () => {
    if (AppState.signer) {
      AppState.roosters = await fetchMyItems(AppState.signer);
      AppState.isLoading = false;
    }
  }, 1000);
};

const logout = async () => {
  await Moralis.User?.logOut();
  ProviderState.account = "";
  AppState.user = Moralis.User.current();
};

export const initProvider = () => {
  const init = async () => {
    if (window.ethereum) {
      const currentUser = Moralis.User.current();
      if (currentUser) {
        initUser(currentUser);
      }
    }
  };

  useWeb3Provider(init, logout);
};

const { setMessage } = useMessage();
export const useMoralis = () => {
  const login = async () => {
    if (!ProviderState.isConnectedToValidNetwork) {
      setMessage("Please connect to the correct network");
      return;
    }
    const user = await Moralis.Web3.authenticate({
      provider: window.ethereum,
      chainId: Number(config.chainId),
    });

    if (user) {
      initUser(user);
    }

    return user;
  };

  return {
    login,
    logout,
  };
};

export const useFight = () => {
  const saveFight = async (
    requestId: string,
    combatId: string,
    eventId: number,
    attackerTokenId: number,
    defenderTokenId: number,
    status = "scheduled"
  ) => {
    const Fight = Moralis.Object.extend("Fight");
    const newFight = new Fight();
    newFight.set("requestId", requestId);
    newFight.set("combatId", combatId);
    newFight.set("eventId", eventId);
    newFight.set("attackerTokenId", attackerTokenId);
    newFight.set("defenderTokenId", defenderTokenId);
    newFight.set("winnerTokenId", 0);
    newFight.set("status", status);

    newFight.save();
  };

  return {
    saveFight,
  };
};
