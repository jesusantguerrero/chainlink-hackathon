/* eslint-disable node/no-unpublished-import */
import ethers from "ethers";

export interface IPreToken {
  id: ethers.BigNumber;
  uri: string;
  claimed: boolean;
}
