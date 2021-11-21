/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import "../_shared/initDotenv";
import { deployments, ethers } from "hardhat";
import Moralis from "../_shared/moralis";

const initCombat = async (
  requestId: string,
  combatId: number,
  eventId: number
) => {
  const Tournament = await deployments.get("Tournament");
  const tournament = await ethers.getContractAt(
    "Tournament",
    Tournament.address
  );

  await tournament.functions.startFight(requestId, combatId);
};

const getFights = async () => {
  try {
    const Fight = Moralis.Object.extend("Fight");
    const scheduledFights = new Moralis.Query(Fight);
    const fights = await scheduledFights
      .equalTo("status", "scheduled")
      .find({ useMasterKey: true });
    for (const fight of fights) {
      await initCombat(
        fight.get("requestId"),
        fight.get("combatId"),
        fight.get("eventId")
      );
    }
  } catch (err) {
    console.log("this is the err: ", err);
  }
};

(async () => {
  await getFights();
})();
