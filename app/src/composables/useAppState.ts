/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import Moralis from "moralis";
import { IAppState, AppState } from "./AppState";

export interface IUseAppState {
  state: IAppState;
  setUser: (user: Moralis.User) => void;
  removeUser: () => void;
}

export const useAppState = (): IUseAppState => {
  const setUser = (user: Moralis.User) => {
    AppState.user = user;
  };

  const removeUser = () => {
    AppState.user = null;
  };

  return {
    state: AppState,
    setUser,
    removeUser,
  };
};
