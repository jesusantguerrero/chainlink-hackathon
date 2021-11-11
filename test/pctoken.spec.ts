/* eslint-disable no-unused-expressions */
/* eslint-disable node/no-missing-import */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import hre from "hardhat";
import { IPreToken } from "../types/index";

chai.use(chaiAsPromised);
const { expect } = chai;
// eslint-disable-next-line no-unused-vars
let owner: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;

const toNumberArray = (tokens: IPreToken[]) => {
  return tokens.map((item) => item.id.toNumber());
};

(async () => {
  [owner, user2, user3] = await hre.ethers.getSigners();
})();

let pcToken: ethers.Contract;

beforeEach(async () => {
  await hre.deployments.fixture(["local"]);
  const RoosterFight = await hre.deployments.get("RoosterFight");
  pcToken = await hre.ethers.getContractAt(
    "RoosterFight",
    RoosterFight.address
  );
});
describe("PC Token", function () {
  it("Should mint a new nft token", async function () {
    expect((await pcToken.totalSupply()).toNumber()).to.equal(0);
    await pcToken.mint(1);
    expect((await pcToken.totalSupply()).toNumber()).to.equal(1);
  });

  it("Should not allow mint more than the limit nft's", async function () {
    await pcToken.mint(1);
    await pcToken.connect(user2).mint(2);
    await pcToken.connect(user3).mint(3);
    await pcToken.connect(user3).mint(4);
    await expect(pcToken.connect(user3).mint(5)).eventually.to.rejectedWith(
      Error,
      "No more tokens available"
    );
  });

  it("Should allow users claim tokens", async function () {
    await pcToken.connect(user2).mint(1);

    expect(await pcToken.ownerOf(1)).to.equal(user2.address);
  });

  it("Should return supply and availability", async () => {
    expect((await pcToken.totalSupply()).toNumber()).to.equal(0); // total minted;
    expect((await pcToken.pendingToMint()).length).to.equal(4); // total available to claim;
    expect(toNumberArray(await pcToken.pendingToMint())).to.eql([1, 2, 3, 4]); // total available to claim;
  });

  it("Should fail to get token URI", async () => {
    await expect(pcToken.getImageURI(1)).eventually.to.rejectedWith(
      Error,
      "URI set of nonexistent token"
    );
  });
  it("Should return the custom generated URI", async () => {
    pcToken.mint(1);
    expect(await pcToken.getImageURI(1)).to.equal(
      "https://lh3.googleusercontent.com/pnay7Gr6QdYT5V23hYlv8Dyvm1R6VfyvQgPHSrMmQJuLMHVwn8B2pth6DFHnWQZvrGPpiPP-DTPgdUFd-fa0pa7rbBwoboRP0Csu6MI=w600"
    );
    const result = await pcToken.tokenURI(1);
    expect(result).be.a("string");
  });
});

describe("Player Character", () => {
  it("Should get player level", async () => {
    expect(await pcToken.getLevel(1)).to.equal(1);
  });
  it("Should get player details", async () => {
    expect(await pcToken.getDetails(1)).to.not.be.null;
  });
});
