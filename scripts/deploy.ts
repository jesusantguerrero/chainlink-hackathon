/* eslint-disable node/no-missing-import */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { deployContract } from "./deploy-contract";

async function main() {
  const NFT = await deployContract("RoosterFight", [100], "VITE_NFT_ADDRESS");
  const claimer = await deployContract(
    "RoosterClaimer",
    null,
    "VITE_CLAIMER_ADDRESS"
  );
  await NFT.functions.batchMint([
    "https://lh3.googleusercontent.com/pnay7Gr6QdYT5V23hYlv8Dyvm1R6VfyvQgPHSrMmQJuLMHVwn8B2pth6DFHnWQZvrGPpiPP-DTPgdUFd-fa0pa7rbBwoboRP0Csu6MI=w600",
    "https://lh3.googleusercontent.com/bs5rirjgoAV5VQNFwp2EiVurf15o2bbNOIu_sac-nXnP3UTDVh6n2xVCIBLHCwG1odiJ656iP7fzmVPkSEqBYWs1HX73sSsU9FGo=w600",
    "https://lh3.googleusercontent.com/ioC2jjM0CTXuTCKWHJCsenkO0rmmcWczzlBt25_hbMP_mfaRh5iYAkckwoY1I6tzWM3vNR6RRotyFuOeVk9dUSCWW5GLyK6InmTUNQ=w600",
  ]);
  NFT.functions.setClaimerAddress(claimer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
