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
    event FightWinner(bytes32 requestId, uint winner, address owner);
    event TournamentWinner(address winner, uint prize);

    struct Record {
        uint8 wins;
        uint8 losses;
        uint8 draws;
    }

    struct TournamentPlayer {
        uint playerId;
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
        uint houseFee;
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
        bytes32 requestId;
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

    mapping(uint => uint) public prixToCurrentEvent;
    mapping (uint => mapping(uint => bool)) public tokenToEvent; 
    mapping(uint => mapping(uint => uint)) public playerToEvent;
    mapping(bytes32 => uint) public requestIdToRamdomNumber;

    constructor(address _vrfCoodinator, address _linkToken, bytes32 _keyhash  ) VRFConsumerBase(
        _vrfCoodinator,
        _linkToken
    ) {
        contractOwner = payable(msg.sender);
        keyHash = _keyhash;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }

    function setNFTAddress(address _roosterFightAddress) public {
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

    function getPrixes() public view returns (TournamentPrix[] memory) {
        TournamentPrix[] memory result = new TournamentPrix[](prixes.length);
        for (uint i = 0; i < prixes.length; i++) {
            result[i] = prixes[i];
        }
        return result;
    }

    function addEvent(uint _prixId, uint _startDate, uint _endDate) public onlyOwner {
        uint eventId = _getTokenFor(_eventsIds, false);
        TournamentPrix storage prix = prixes[_prixId];
        prix.editions.increment();
        events.push(TournamentEvent(eventId, _prixId, uint(prix.editions.current()), _startDate, _endDate, 0, "", 0));
        prixToCurrentEvent[_prixId] = eventId;
    }

    function addParticipant(uint _tokenId, uint _eventId) public payable {
        TournamentEvent storage tEvents = events[_eventId];
        require(msg.value == prixes[tEvents.tokenId].seatFee, "Should pay the tournament fee");
        require(tokenToEvent[_tokenId][_eventId] != false, "Is already in this event");
        tEvents.seatsTaken++;
        uint playerId = players.length; 
        players.push(TournamentPlayer(playerId, _tokenId, 0, Record(0, 0, 0), payable(msg.sender)));
        playerToEvent[_eventId][playerId] = _tokenId; 
        tokenToEvent[_tokenId][_eventId] = true;
        uint percentage = (msg.value/housePercentage);
        prixes[tEvents.tokenId].prize += msg.value - percentage;
        events[_eventId].houseFee += percentage;
    }

    function getEventFee(uint _eventId) public view returns (uint) {
        return prixes[events[_eventId].prixId].seatFee;
    }

    function getEventWinner(uint _eventId) internal view returns (uint) {
        TournamentPlayer memory winner = TournamentPlayer(
            0,
            0,
            0,
            Record(0, 0, 0),
            payable(address(0))
        );
        for (uint256 index = 0; index < players.length; index++) {
            if (playerToEvent[_eventId][index] != 0 && players[index].points > winner.points) {
                winner = players[index];
            }
        }
        return winner.playerId;
    }

    function getEventParticipants(uint _eventId) public view returns (TournamentPlayer[] memory) {
        uint playerLen = events[_eventId].seatsTaken;
        TournamentPlayer[] memory ePlayers = new TournamentPlayer[](playerLen);
        for (uint256 index = 0; index < players.length; index++) {
            if (playerToEvent[_eventId][index] != 0) {
                ePlayers[index] = players[index];
            }
        }
        return ePlayers;
    }

    function prepareFight(uint _attackerPlayerId, uint _defencePlayerId, uint _eventId) public returns (bytes32, uint) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        bytes32 requestId = requestRandomness(keyHash, fee);
        uint combatId = combats.length +1;
        combats.push(MatchUp(combatId, requestId, _eventId, "", _attackerPlayerId, _defencePlayerId, true, 0));
        emit FightStarted(requestId, playerToEvent[_eventId][_attackerPlayerId], playerToEvent[_eventId][_defencePlayerId], _eventId, combatId); 
        return (requestId, combatId);       
    }

    function fulfillRandomness(bytes32 _requestId, uint _randomNumber) internal override {
        requestIdToRamdomNumber[_requestId] = _randomNumber;
    }

    function startFight(bytes32 _requestId, uint _combatId) public {
        MatchUp storage combat = combats[_combatId];
        uint winner;
        uint loser;
        
        // Token Ids 
        (winner, loser) = IRoosterFight(roosterFightAdress).fight(playerToEvent[combat.eventID][combat.attacker], playerToEvent[combat.eventID][combat.defence], requestIdToRamdomNumber[combat.requestId]);
        combat.active = false;
        combat.winner = winner;

        // Here I need players id
        uint winnerPlayerId = playerToEvent[combat.eventID][combat.attacker] == winner ? combat.attacker : combat.defence;
        uint loserPlayerId = playerToEvent[combat.eventID][combat.attacker] != winner ? combat.attacker : combat.defence;

        // Give the prizes to the winners
        players[winnerPlayerId].record.wins++;
        players[winnerPlayerId].points += 3;
        players[loserPlayerId].record.losses++;

        emit FightWinner(_requestId, winner, players[winnerPlayerId].owner);
        emit FightFinished(_requestId, combat.attacker, combat.defence, combat.eventID, combat.token);
    }

    function payout(uint _eventId) public onlyOwner {
        uint winnerId = getEventWinner(_eventId);
        uint prize = prixes[events[_eventId].prixId].prize;
        uint amount = events[_eventId].houseFee;
        events[_eventId].houseFee = 0;
        payable(contractOwner).transfer(amount);
        players[winnerId].owner.transfer(prize);
        emit TournamentWinner(players[winnerId].owner, prize);
    }
}