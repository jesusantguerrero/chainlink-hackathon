export const config = {
  moralisKey: secureString("VITE_MORALIS_KEY"),
  moralisServerURL: secureString("VITE_MORALIS_SERVER_URL"),
  nftAddress: secureString("VITE_NFT_ADDRESS"),
  claimerAddress: secureString("VITE_CLAIMER_ADDRESS"),
  rpcURL: secureString("VITE_RPC_URL", "http://localhost:8545"),
};

function secureString(key: string, defaultValue = ""): string {
  const value = import.meta.env[key];
  return typeof value === "string" ? value : defaultValue;
}
