/* eslint-disable node/no-unpublished-import */
import { ethers } from "hardhat";
import { Contract } from "ethers";

export const getContract = async (
  contractName: string,
  args: any[] | null = null
): Promise<Contract> => {
  const Contract = await ethers.getContractFactory(contractName);
  let contract;
  if (args) {
    contract = await Contract.deploy(...args);
  } else {
    contract = await Contract.deploy(args);
  }
  await contract.deployed();
  return contract;
};
