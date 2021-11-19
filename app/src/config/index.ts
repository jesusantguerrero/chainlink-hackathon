/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import { useSecureString } from "../../../_shared/useSecureString";
const { getEnv } = useSecureString(import.meta.env);

export const config = {
  moralisKey: getEnv("VITE_MORALIS_KEY"),
  moralisServerURL: getEnv("VITE_MORALIS_SERVER_URL"),
  nftAddress: getEnv("VITE_NFT_ADDRESS"),
  claimerAddress: getEnv("VITE_CLAIMER_ADDRESS"),
  tournamentAddress: getEnv("VITE_TOURNAMENT_ADDRESS"),
  rpcURL: getEnv("VITE_RPC_URL", "http://localhost:8545"),
};
