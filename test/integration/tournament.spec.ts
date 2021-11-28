/* eslint-disable no-unused-expressions */
/* eslint-disable node/no-missing-import */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { getContract } from "../../utils/getContract";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";
import {
  autoFundCheck,
  networkConfig,
  getNetworkIdFromName,
} from "../../helper-hardhat-config";
import { ethers } from "ethers";
import premintedTokens from "../mock/premintedTokens";

chai.use(chaiAsPromised);
const { expect } = chai;
// eslint-disable-next-line no-unused-vars
let owner: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;

(async () => {
  [owner, user2, user3] = await hre.ethers.getSigners();
})();

let tournament: ethers.Contract,
  linkToken: ethers.Contract,
  vrfCoordinator: ethers.Contract,
  pcToken: ethers.Contract;

beforeEach(async () => {
  await setupContracts();
});

describe("Tournament integration tests", async () => {
  it("Should fail to add participants if payment is not present", async () => {
    await mintTokens([user2, user3]);
    await expect(
      tournament.connect(user2).addParticipant(1, 0)
    ).eventually.to.rejectedWith(Error, "Should pay the tournament fee");
  });

  it("Should not allow not owned tokens as participant", async () => {
    await mintTokens([user2, user3]);

    // tournament registration
    const eventFee = await tournament.getEventFee(0);
    await expect(
      tournament.connect(user3).addParticipant(1, 0, { value: eventFee })
    ).eventually.to.rejectedWith(Error, "has to be owner");
  });
  it("Should add participants", async () => {
    await mintTokens([user2, user3]);

    // tournament registration
    const eventFee = await tournament.getEventFee(0);
    await tournament.connect(user2).addParticipant(1, 0, { value: eventFee });
    await tournament.connect(user3).addParticipant(2, 0, { value: eventFee });
    expect((await tournament.getEventParticipants(0)).length).to.equal(2);
  });
  it("Should fail if participant attempt to join twice", async () => {
    await mintTokens([user2, user3]);

    // tournament registration
    const eventFee = await tournament.getEventFee(0);
    await tournament.connect(user2).addParticipant(1, 0, { value: eventFee });
    await expect(
      tournament.connect(user2).addParticipant(1, 0, { value: eventFee })
    ).eventually.to.rejectedWith(Error, "Is already in this event");
  });
  it("Should fail simulate a tournament fight because of link", async () => {
    await mintTokens([user2, user3]);

    // tournament registration
    const eventFee = await tournament.getEventFee(0);
    await tournament.connect(user2).addParticipant(1, 0, { value: eventFee });
    await tournament.connect(user3).addParticipant(2, 0, { value: eventFee });

    //  fights
    await expect(tournament.prepareFight(0, 1, 0)).eventually.to.rejectedWith(
      Error,
      "Not enough LINK"
    );
  });
  it("Should simulate a tournament fight", async () => {
    await mintTokens([user2, user3]);

    // tournament registration
    const eventFee = await tournament.getEventFee(0);
    await tournament.connect(user2).addParticipant(1, 0, { value: eventFee });
    await tournament.connect(user3).addParticipant(2, 0, { value: eventFee });

    await fundTournamentContract();

    //  fights
    const trx = await tournament.prepareFight(0, 1, 0);
    const receipt = await trx.wait(1);
    const requestId = receipt.events[2].topics[1];
    expect((await tournament.getMatchesForEvent(0)).length).to.equal(1);
    expect(receipt.events[3].event).to.equal("FightStarted");
    expect(requestId).to.not.be.null;

    // wait 60 secs for oracle to callback
    await new Promise((resolve) => setTimeout(resolve, 30000));

    const result = await tournament.startFight(requestId, 0);
    const trx2 = await result.wait(1);
    const events2 = trx2.events.map((evt: ethers.Event) => evt.event);
    expect(events2).to.eql(["FightRound", "FightRound", "FightFinished"]);
    expect(await tournament.combatLogs(0, 1, 0)).to.eql({ matchId: 0 });
    await tournament.payout(0);

    // shouldn't start the same fight twice
    await expect(tournament.prepareFight(0, 1, 0)).eventually.to.rejectedWith(
      Error,
      "Fight already exists"
    );
    await expect(
      tournament.startFight(requestId, 0)
    ).eventually.to.rejectedWith(Error, "Combat already finished");
  });
  it("Should simulate multiples tournament fight", async () => {
    await mintTokens([user2, user3]);

    // tournament registration
    const eventFee = await tournament.getEventFee(0);
    await tournament.connect(user2).addParticipant(1, 0, { value: eventFee });
    await tournament.connect(user3).addParticipant(2, 0, { value: eventFee });

    await fundTournamentContract();

    //  fights
    await prepareFight(0, 1, 0, user2);
    await prepareFight(1, 0, 0, user3);
  });
});

async function prepareFight(
  attackerPlayerId: number,
  defensePlayerId: number,
  eventId: number,
  owner: SignerWithAddress
): Promise<string> {
  const trx = await tournament
    .connect(owner)
    .prepareFight(attackerPlayerId, defensePlayerId, eventId);
  const receipt = await trx.wait(1);
  return receipt.events[2].topics[1] || "";
}

async function setupContracts() {
  await hre.deployments.fixture(["mocks"]);
  const LinkToken = await hre.deployments.get("LinkToken");
  const VRFCoordinatorMock = await hre.deployments.get("VRFCoordinatorMock");
  linkToken = await hre.ethers.getContractAt("LinkToken", LinkToken.address);
  vrfCoordinator = await hre.ethers.getContractAt(
    "VRFCoordinatorMock",
    VRFCoordinatorMock.address
  );
  pcToken = await getContract("RoosterFight", [premintedTokens]);
  const networkId = await getNetworkIdFromName("localhost");
  const keyHash = networkConfig[networkId || 1].keyHash || "";
  tournament = await getContract("Tournament", [
    vrfCoordinator.address,
    linkToken.address,
    keyHash,
  ]);
  // create tournaments
  createTournaments();
  // Token registration
  await tournament.setNFTAddress(pcToken.address);
}

async function fundTournamentContract() {
  if (
    await autoFundCheck(
      tournament.address,
      "localhost",
      linkToken.address,
      "Nothing more"
    )
  ) {
    await hre.run("fund-link", {
      contract: tournament.address,
      linkaddress: linkToken.address,
    });
  }
}

async function createTournaments() {
  await tournament.addPrix(
    "Amateur League",
    "Tournament for new cock fighters",
    8,
    ethers.utils.parseEther("100")
  );
  const startDate = new Date().getTime();
  const endDate = startDate + 7;
  await tournament.addEvent(0, startDate, endDate);
}

async function mintTokens(addresses: SignerWithAddress[]) {
  let count = 1;
  for (const address of addresses) {
    await pcToken.connect(address).mint(count);
    count++;
  }
}
