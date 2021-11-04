pragma solidity ^0.8.4;
// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

interface IRoosterFight {
    function fight (uint _attacker, uint _defender,uint _randomNumber) external returns (uint, uint);
}

contract Tournament is Ownable, VRFConsumerBase {
    using Counters for Counters.Counter;
    event FightStarted(bytes32 requestId, uint _attacker, uint _defence, uint _eventId, uint combatId);
    event FightFinished(bytes32 requestId, uint _attacker, uint _defence, uint _eventId, uint combatId);

    struct Record {
        uint8 wins;
        uint8 losses;
        uint8 draws;
    }

    struct TournamentPlayer {
        uint tokenId;
        uint points;
        Record record;
        address payable owner;
    }

    struct TournamentEvent {
        uint tokenId;
        uint prixId;
        uint tournamentEdition;
        uint startDate;
        uint endDate;
        uint8 seatsTaken;
        string champion;
    }

    struct TournamentPrix {
        uint tokenId;
        uint prize;
        uint seatFee;
        string name;
        string lastChampion;
        string description;
        uint8 seatsLimit;
        Counters.Counter editions;
    }

    struct MatchUp {
        uint token;
        uint eventID;
        string name;
        uint attacker;
        uint defence;
        bool active;
        uint winner;
    }

    address payable public contractOwner;
    bytes32 internal keyHash;
    uint256 internal fee;    
    uint private housePercentage = 20;
    address private roosterFightAdress;
    
    Counters.Counter private _prixesIds;
    Counters.Counter private _eventsIds;
    TournamentPrix[] public prixes;
    TournamentEvent[] public events;
    TournamentPlayer[] public players;
    MatchUp[] public combats;

    mapping (uint => uint) private eventToOwnerFee; 
    mapping(uint => uint) public playerToEvent;
    mapping(bytes32 => uint) public requestIdToCombat;
    mapping(uint => MatchUp) public eventToCombat;

    constructor(address _vrfCoodinator, address _linkToken, bytes32 _keyhash  ) VRFConsumerBase(
        _vrfCoodinator,
        _linkToken
    ) {
        // 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
        // 0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        // keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        contractOwner = payable(msg.sender);
        keyHash = _keyhash;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }

    function setNFTaddress(address _roosterFightAddress) public {
        roosterFightAdress = _roosterFightAddress;
    }

    function _getTokenFor(Counters.Counter storage counter, bool before) internal returns (uint) {
        if (before) {
            counter.increment();
            return uint(counter.current());
        } else {
            uint tokenID = uint(counter.current());
            counter.increment();
            return tokenID;
        }
    }

    function addPrix(string memory _name, string memory _description, uint8 _seatsLimit, uint _seatsFee) public onlyOwner {
        uint tokenId = _getTokenFor(_prixesIds, false);
        Counters.Counter memory edition;
        prixes.push(TournamentPrix(tokenId, 0, _seatsFee, _name,"", _description, _seatsLimit, edition));
    }

    function addEvent(uint _prixId, uint _startDate, uint _endDate) public onlyOwner {
        uint tokenId = _getTokenFor(_eventsIds, false);
        TournamentPrix storage prix = prixes[_prixId];
        prix.editions.increment();
        events.push(TournamentEvent(tokenId, _prixId, uint(prix.editions.current()), _startDate, _endDate, 0, ""));
    }

    function addParticipant(uint _tokenId, uint _eventId) public payable {
        TournamentEvent storage tEvents = events[_eventId];
        require(msg.value == prixes[tEvents.tokenId].seatFee, "Should pay the tournament fee");
        tEvents.seatsTaken++;
        players.push(TournamentPlayer(_tokenId, 0, Record(0, 0, 0), payable(msg.sender)));
        uint tokenId = players.length - 1; 
        playerToEvent[tokenId] = _eventId; 
        uint percentage = (msg.value/housePercentage);
        prixes[tEvents.tokenId].prize += msg.value - percentage;
        eventToOwnerFee[_eventId] += percentage;
    }

    function getEventFee(uint _eventId) public view returns (uint) {
        return prixes[events[_eventId].prixId].seatFee;
    }

    function getEventWinner(uint _eventId) internal view returns (uint) {
        TournamentPlayer memory winner = TournamentPlayer(
            0,
            0,
            Record(0, 0, 0),
            payable(address(0))
        );
        for (uint256 index = 0; index < players.length; index++) {
            if (playerToEvent[index] == _eventId && players[index].points > winner.points) {
                winner = players[index];
            }
        }
        return winner.tokenId;
    }

    function getEventParticipants(uint _eventId) public view returns (TournamentPlayer[] memory) {
        uint playerLen = events[_eventId].seatsTaken;
        TournamentPlayer[] memory ePlayers = new TournamentPlayer[](playerLen);
        for (uint256 index = 0; index < players.length; index++) {
            if (playerToEvent[index] == _eventId) {
                ePlayers[index] = players[index];
            }
        }
        return ePlayers;
    }

    function prepareFight(uint _attacker, uint _defence, uint _eventId) public returns (bytes32) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        bytes32 requestId = requestRandomness(keyHash, fee);
        uint combatId = combats.length +1;
        combats.push(MatchUp(combatId, _eventId, "", _attacker, _defence, true, 0));
        requestIdToCombat[requestId] = combatId;
        emit FightStarted(requestId, _attacker, _defence, _eventId, combatId); 
        return requestId;       
    }

    function fulfillRandomness(bytes32 _requestId, uint _randomNumber) internal override {
        MatchUp storage combat = combats[requestIdToCombat[_requestId]];
        uint winner;
        uint loser;
        (winner, loser) = IRoosterFight(roosterFightAdress).fight(combat.attacker, combat.defence, _randomNumber);
        combat.active = false;
        combat.winner = winner;
        players[winner].record.wins++;
        players[winner].points += 3;
        players[loser].record.losses++;
        emit FightFinished(_requestId, combat.attacker, combat.defence, combat.eventID, combat.token);
    }

    function payout(uint _eventId) public onlyOwner {
        uint winnerId = getEventWinner(_eventId);
        uint prize = prixes[events[_eventId].prixId].prize;
        uint amount = eventToOwnerFee[_eventId];
        eventToOwnerFee[_eventId] = 0;
        payable(contractOwner).transfer(amount);
        players[winnerId].owner.transfer(prize);
    }
}