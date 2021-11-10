/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import { ethers } from "ethers";
import { deployments } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { autoFundCheck, networkConfig } from "../helper-hardhat-config";
import { saveEnvVar } from "../utils/deploy-contract";

//   Mint the initial tokens
const premintedTokens = [
  {
    id: 0,
    breed: 0,
    uri: "https://lh3.googleusercontent.com/pnay7Gr6QdYT5V23hYlv8Dyvm1R6VfyvQgPHSrMmQJuLMHVwn8B2pth6DFHnWQZvrGPpiPP-DTPgdUFd-fa0pa7rbBwoboRP0Csu6MI=w600",
    claimed: false,
  },
  {
    id: 0,
    breed: 0,
    uri: "https://lh3.googleusercontent.com/bs5rirjgoAV5VQNFwp2EiVurf15o2bbNOIu_sac-nXnP3UTDVh6n2xVCIBLHCwG1odiJ656iP7fzmVPkSEqBYWs1HX73sSsU9FGo=w600",
    claimed: false,
  },
  {
    id: 0,
    breed: 0,
    uri: "https://lh3.googleusercontent.com/ioC2jjM0CTXuTCKWHJCsenkO0rmmcWczzlBt25_hbMP_mfaRh5iYAkckwoY1I6tzWM3vNR6RRotyFuOeVk9dUSCWW5GLyK6InmTUNQ=w600",
    claimed: false,
  },
];

const SetupContract: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deploy, get } = deployments;
  const { deployer } = await hre.getNamedAccounts();
  const chainId = (await hre.getChainId()) || "31337";

  interface IChainLink {
    linkTokenAddress?: string;
    vrfCoordinatorAddress?: string;
  }
  const chainLink: IChainLink = {
    linkTokenAddress: "",
    vrfCoordinatorAddress: "",
  };

  // If we are on a local development network, we need to deploy mocks!

  if (chainId === "1337") {
    const linkToken = await get("LinkToken");
    const vrfCoordinator = await get("VRFCoordinatorMock");
    chainLink.linkTokenAddress = linkToken.address;
    chainLink.vrfCoordinatorAddress = vrfCoordinator.address;
  } else {
    // Otherwise, we can use the real contracts deployed on the mainnet.
    chainLink.linkTokenAddress = networkConfig[chainId].linkToken;
    chainLink.vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator;
  }

  const keyHash = networkConfig[chainId].keyHash || "";
  const RoosterFight = await deploy("RoosterFight", {
    from: deployer,
    log: true,
    args: [premintedTokens],
  });

  const Tournament = await deploy("Tournament", {
    from: deployer,
    log: true,
    args: [
      chainLink.vrfCoordinatorAddress,
      chainLink.linkTokenAddress,
      keyHash,
    ],
  });

  const tournament = await hre.ethers.getContractAt(
    "Tournament",
    Tournament.address
  );

  tournament.setNFTAddress(RoosterFight.address);

  // Create the initial tournament
  await tournament.functions.addPrix(
    "Rooster fight I",
    "First tournament of rooster fight",
    10,
    ethers.utils.parseEther("0.1")
  );
  const startDate = new Date();
  const endDate = startDate.getTime() + 1000 * 60 * 60 * 24 * 7;
  await tournament.functions.addEvent(0, new Date().getTime(), endDate);

  await saveEnvVar("VITE_NFT_ADDRESS", RoosterFight.address);
  await saveEnvVar("VITE_TOURNAMENT_ADDRESS", Tournament.address);

  if (
    chainLink.linkTokenAddress &&
    (await autoFundCheck(
      Tournament.address,
      "localhost",
      chainLink.linkTokenAddress,
      "Nothing more"
    ))
  ) {
    await hre.run("fund-link", {
      contract: Tournament.address,
      linkaddress: chainLink.linkTokenAddress,
    });
  }
};

export default SetupContract;
SetupContract.tags = ["local"];
