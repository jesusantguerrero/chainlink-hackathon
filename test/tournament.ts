/* eslint-disable node/no-missing-import */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { getContract } from "../utils/getContract";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";
import {
  autoFundCheck,
  networkConfig,
  getNetworkIdFromName,
} from "../helper-hardhat-config";

chai.use(chaiAsPromised);
const { expect } = chai;
// eslint-disable-next-line no-unused-vars
let owner: SignerWithAddress;

(async () => {
  [owner] = await hre.ethers.getSigners();
})();

describe("Tournament unit tests", async () => {
  let tournament, linkToken, vrfCoordinator;

  beforeEach(async () => {
    await hre.deployments.fixture(["mocks"]);
    console.log(hre.deployments, "Oh oh pero y klk?");
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

  it("Should sum 1 + 1", () => {
    expect(1 + 1).to.equal(2);
  });
});
