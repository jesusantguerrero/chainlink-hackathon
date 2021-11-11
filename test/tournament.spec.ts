/* eslint-disable no-unused-expressions */
/* eslint-disable node/no-missing-import */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { getContract } from "../utils/getContract";
import hre from "hardhat";
import {
  autoFundCheck,
  networkConfig,
  getNetworkIdFromName,
} from "../helper-hardhat-config";
import { ethers } from "ethers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Tournament unit tests", async () => {
  let tournament: ethers.Contract,
    linkToken: ethers.Contract,
    vrfCoordinator: ethers.Contract;

  beforeEach(async () => {
    await hre.deployments.fixture(["mocks", "local"]);
    const LinkToken = await hre.deployments.get("LinkToken");
    const VRFCoordinatorMock = await hre.deployments.get("VRFCoordinatorMock");
    linkToken = await hre.ethers.getContractAt("LinkToken", LinkToken.address);
    vrfCoordinator = await hre.ethers.getContractAt(
      "VRFCoordinatorMock",
      VRFCoordinatorMock.address
    );

    const networkId = await getNetworkIdFromName("localhost");
    const keyHash = networkConfig[networkId || 1].keyHash || "";
    tournament = await getContract("Tournament", [
      vrfCoordinator.address,
      linkToken.address,
      keyHash,
    ]);

    if (
      await autoFundCheck(
        tournament.address,
        "localhost",
        linkToken.address,
        "Nothing more"
      )
    ) {
      await hre.run("fund-link", {
        contract: tournament.address,
        linkaddress: linkToken.address,
      });
    }
  });

  it("Should create a prix", async () => {
    await tournament.addPrix(
      "Amateur League",
      "Tournament for new cock fighters",
      8,
      ethers.utils.parseEther("0.05")
    );
  });

  it("Should create a tournament event", async () => {
    await tournament.addPrix(
      "Amateur League",
      "Tournament for new cock fighters",
      8,
      ethers.utils.parseEther("0.05")
    );
    const startDate = new Date().getTime();
    const endDate = startDate + 7;

    expect(await tournament.addEvent(0, startDate, endDate));
  });
});
