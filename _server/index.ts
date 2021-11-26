const initCombat = async (requestId: string, combatId: number) => {
  const web3 = Moralis.web3ByChain("0x539"); // mainnet
  const tournament = new web3.eth.Contract(Tournament.abi, Tournament.address);
  await tournament.functions.startFight(requestId, combatId);
};

const startFights = async () => {
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
};

Moralis.Cloud.job("verifyFights", async () => {
  return startFights();
});
