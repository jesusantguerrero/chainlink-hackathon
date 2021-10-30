/* eslint-disable node/no-missing-import */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { getContract } from "../utils/getContract";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;
// eslint-disable-next-line no-unused-vars
let owner: SignerWithAddress;
let user2: SignerWithAddress;
(async () => {
  [owner, user2] = await ethers.getSigners();
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
    await pcToken.mint(user2.address, "ipfs://newtoken.jpg");
    await pcToken.mint(user2.address, "ipfs://newtoken.jpg");

    await expect(
      pcToken.mint(user2.address, "ipfs://newtoken.jpg")
    ).eventually.to.rejectedWith(Error, "No more tokens available");
  });

  it("Should allow users claim tokens", async function () {
    const pcToken = await getContract("PCNFT", [2]);
    await pcToken.mint(user2.address, "ipfs://newtoken.jpg");
    await pcToken.mint(user2.address, "ipfs://newtoken.jpg");

    await expect(
      pcToken.mint(user2.address, "ipfs://newtoken.jpg")
    ).eventually.to.rejectedWith(Error, "No more tokens available");
  });
});
