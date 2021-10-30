/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { getContract } from "../utils/getContract";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// eslint-disable-next-line no-unused-vars
let _owner: SignerWithAddress;
let user2: SignerWithAddress;
(async () => {
  [_owner, user2] = await ethers.getSigners();
})();
describe("PC Token", function () {
  it("Should mint a new nft token", async function () {
    const pcToken = await getContract("PCNFT", [100]);

    expect((await pcToken.totalSupply()).toNumber()).to.equal(0);
    await pcToken.mint(user2.address, "ipfs://newtoken.jpg");
    expect((await pcToken.totalSupply()).toNumber()).to.equal(1);
  });
});
