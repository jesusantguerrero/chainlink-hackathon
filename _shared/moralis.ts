/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import Moralis from "moralis/node";
import { useSecureString } from "./useSecureString";

const { getEnv } = useSecureString(process.env);

export const serverUrl = getEnv("MORALIS_SERVER_URL");
export const appId = getEnv("MORALIS_APP_ID");
export const masterKey = getEnv("MORALIS_MASTER_KEY");
export const moralisSecret = getEnv("MORALIS_SECRET");

Moralis.initialize(appId, undefined, masterKey);
Moralis.serverURL = serverUrl;
Moralis.secret = moralisSecret;
export default Moralis;
