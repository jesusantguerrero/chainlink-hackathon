/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import "../_shared/initDotenv";
import Tournament from "../deployments/localhost/Tournament.json";
import Moralis from "../_shared/moralis";
import hre, { ethers } from "hardhat";

const initCombat = async (requestId: string, combatId: number) => {
  const tournament = new ethers.Contract(Tournament.address, Tournament.abi, hre.);
  await tournament.functions.startFight(requestId, combatId);
};

export const startScheduledFights = async () => {
  try {
    const Fight = Moralis.Object.extend("Fight");
    const scheduledFights = new Moralis.Query(Fight);
    const fights = await scheduledFights
      .equalTo("status", "scheduled")
      .find({ useMasterKey: true });
    for (const fight of fights) {
      await initCombat(fight.get("requestId"), fight.get("combatId"));
      fight.set("status", "started");
      await fight.save();
    }
  } catch (err) {
    console.log("this is the err: ");
  }
};
