/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import { ethers } from "ethers";
import { deployments } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { autoFundCheck, networkConfig } from "../helper-hardhat-config";
import Moralis from "../_shared/moralis";

const getAvailableTokens = async () => {
  const Metadata = new Moralis.Query("Metadata");
  const preTokens = await Metadata.find();
  const breedTypes = ["Black", "Colorao", "Pinto", "White"];
  return preTokens.map((preToken) => {
    const attributes = preToken.get("attributes");
    const breedType = attributes.find(
      (attribute: Record<string, string>) => attribute.trait_type === "Breed"
    ).value;

    return {
      id: preToken.get("edition"),
      breed: breedTypes.findIndex((breed: string) => breed === breedType),
      uri: preToken.get("image_url"),
      claimed: false,
    };
  });
};

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
  const preMintedTokens = await getAvailableTokens();
  const RoosterFight = await deploy("RoosterFight", {
    from: deployer,
    log: true,
    args: [preMintedTokens],
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

  if (
    chainId === "1337" &&
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
