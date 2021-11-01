/* eslint-disable node/no-unpublished-import */
import Web3 from "web3/dist/web3.min";
import Moralis from "moralis/dist/moralis";
import { config } from "../config/";
import { AppState } from "./AppState";

window.Web3 = Web3;

Moralis.initialize(config.moralisKey);
Moralis.serverURL = config.moralisServerURL;

export const useMoralis = () => {
  const login = async () => {
    const user = await Moralis.Web3.authenticate();
    AppState.user = user;
  };

  const logout = async () => {
    return await Moralis.Web3.logout();
  };

  return {
    login,
    logout,
  };
};
