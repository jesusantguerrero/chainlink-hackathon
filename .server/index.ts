import * as dotenv from "dotenv";
dotenv.config();

import Moralis from "../_shared/moralis";

const getFights = async () => {
    try {
        const Fight = Moralis.Object.extend("Fight");
        const scheduledFights = new Moralis.Query(Fight);
        const fights = await scheduledFights.equalTo("status", "scheduled").find({ useMasterKey: true });
        console.log("Fights", fights.length);
        for (const fight of fights) {
            console.log(fight.get("requestId"), fight.get("combatId"), fight.get("eventId"));
        }
    } catch (err) {
        console.log("this is the err: ", err);
    }
}

(async () => {
    await getFights();
})()
