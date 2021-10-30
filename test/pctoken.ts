/* eslint-disable node/no-missing-import */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { getContract } from "../utils/getContract";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import hre from "hardhat";

chai.use(chaiAsPromised);
const { expect } = chai;
// eslint-disable-next-line no-unused-vars
let owner: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;

(async () => {
  [owner, user2, user3] = await hre.ethers.getSigners();
})();

describe("PC Token", function () {
  it("Should mint a new nft token", async function () {
    const pcToken = await getContract("PCNFT", [100]);

    expect((await pcToken.totalSupply()).toNumber()).to.equal(0);
    await pcToken.mint(user2.address, "ipfs://newtoken.jpg");
    expect((await pcToken.totalSupply()).toNumber()).to.equal(1);
  });

  it("Should not allow mint more than the limit nft's", async function () {
    const pcToken = await getContract("PCNFT", [2]);
    await pcToken.mint(owner.address, "ipfs://newtoken.jpg");
    await pcToken.mint(user2.address, "ipfs://newtoken.jpg");

    await expect(
      pcToken.mint(user3.address, "ipfs://newtoken.jpg")
    ).eventually.to.rejectedWith(Error, "No more tokens available");
  });

  it("Should allow users claim tokens", async function () {
    const pcToken = await getContract("PCNFT", [2]);
    await pcToken.batchMint(["ipfs://token1.jpg", "ipfs://token2.jpg"]);
    await pcToken.claim(1, user2.address);

    expect(await pcToken.ownerOf(1)).to.equal(user2.address);
  });
  it("Should prevent users from claiming 2+ tokens", async function () {
    const pcToken = await getContract("PlayerHelper", [2]);
    await pcToken.batchMint(["ipfs://token1.jpg", "ipfs://token2.jpg"]);
    await pcToken.claim(1, user2.address);

    await expect(pcToken.claim(2, user2.address)).eventually.to.rejectedWith(
      Error,
      "Claimer has reached the limit"
    );
  });
});

describe("Player Character", () => {
  let pcToken: ethers.Contract;
  beforeEach(async () => {
    pcToken = await getContract("PlayerHelper", [100]);
  });

  it("get player level", async () => {
    expect(await pcToken.getLevel(1)).to.equal(1);
  });
});
