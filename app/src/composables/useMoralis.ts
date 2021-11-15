/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import Web3 from "web3/dist/web3.min";
import Moralis from "moralis/dist/moralis";
import { config } from "../config/";
import { useAppState } from "./useAppState";
import { AppState } from "./AppState";

const { setUser } = useAppState();
window.Web3 = Web3;

Moralis.initialize(config.moralisKey);
Moralis.serverURL = config.moralisServerURL;

export const useMoralis = () => {
  const login = async () => {
    const user = await Moralis.Web3.authenticate({
      provider: window.ethereum,
      signingMessage: "Please login to your wallet",
    });
    if (user) {
      setUser(user);
    }
  };

  const logout = async () => {
    return await Moralis.Web3.logout();
  };

  const init = async () => {
    if (window.ethereum) {
      const currentuser = Moralis.User.current();
      if (currentuser) {
        AppState.user = currentuser;
      }
    }
  };

  return {
    init,
    login,
    logout,
  };
};
