import { Moralis } from "moralis";
import { reactive } from "vue";

interface IAppState {
  user: null | Moralis.User;
}

export const AppState = reactive<IAppState>({
  user: null,
});
