/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import Moralis from "moralis/node";
import { useSecureString } from "../../_shared/useSecureString";
const { getEnv } = useSecureString(process.env);

const serverUrl = getEnv("MORALIS_SERVER_URL");
const appId = getEnv("MORALIS_APP_ID");
const masterKey = getEnv("MORALIS_MASTER_KEY");
const moralisSecret = getEnv("MORALIS_SECRET");

Moralis.initialize(appId, undefined, masterKey);
Moralis.serverURL = serverUrl;
Moralis.secret = moralisSecret;
export default Moralis;