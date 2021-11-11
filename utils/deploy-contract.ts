/* eslint-disable node/no-missing-import */
import { getContract } from "./getContract";
import fs from "fs";
import path from "path";

export const saveEnvVar = async (envName: string, value: string) => {
  const envFilePath = path.resolve(__dirname, "..", "app", ".env.local");
  const file = fs.readFileSync(envFilePath, "utf8");
  const lines = file.split("\n");
  const index = lines.findIndex((line: string) => line.includes(envName));
  if (index === -1) {
    lines.push(`${envName}=${value}`);
  } else {
    lines.splice(index, 1, `${envName}=${value}`);
  }
  return fs.writeFileSync(envFilePath, lines.join("\n"));
};

export const deployContract = async (
  contractName: string,
  args: any[] | null,
  envName?: string
) => {
  const contract = await getContract(contractName, args);
  if (envName) {
    saveEnvVar(envName, contract.address);
  }
  console.log(`${contractName} deployed to:`, contract.address);
  return contract;
};
