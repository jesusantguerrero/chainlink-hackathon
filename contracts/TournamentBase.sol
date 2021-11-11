pragma solidity ^0.8.4;
// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract TournamentBase is Ownable {
    using Counters for Counters.Counter;
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
        uint64 combatsCount;
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


    address payable public contractOwner;
    uint private housePercentage = 20;
    address internal roosterFightAdress;
    
    Counters.Counter private _prixesIds;
    Counters.Counter private _eventsIds;
    TournamentPrix[] public prixes;
    TournamentEvent[] public events;
    TournamentPlayer[] public players;

    mapping(uint => uint) public prixToCurrentEvent;
    mapping (uint => mapping(uint => bool)) public tokenToEvent; 
    mapping(uint => mapping(uint => uint)) public eventToPlayer;

    constructor()  {
        contractOwner = payable(msg.sender);
    }

    function setNFTAddress(address _roosterFightAddress) public {
        roosterFightAdress = _roosterFightAddress;
    }

    function _getTokenFor(Counters.Counter storage counter) internal returns (uint) {
        uint tokenID = uint(counter.current());
        counter.increment();
        return tokenID;
    }

    function addPrix(string memory _name, string memory _description, uint8 _seatsLimit, uint _seatsFee) public onlyOwner {
        uint tokenId = _getTokenFor(_prixesIds);
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
        uint eventId = _getTokenFor(_eventsIds);
        TournamentPrix storage prix = prixes[_prixId];
        prix.editions.increment();
        events.push(TournamentEvent(eventId, _prixId, uint(prix.editions.current()), _startDate, _endDate, 0, "", 0, 0));
        prixToCurrentEvent[_prixId] = eventId;
    }

    function addParticipant(uint _tokenId, uint _eventId) public payable {
        TournamentEvent storage tEvents = events[_eventId];
        require(msg.value == prixes[tEvents.tokenId].seatFee, "Should pay the tournament fee");
        require(tokenToEvent[_tokenId][_eventId] == false, "Is already in this event");
        tEvents.seatsTaken++;
        uint playerId = players.length; 
        players.push(TournamentPlayer(playerId, _tokenId, 0, Record(0, 0, 0), payable(msg.sender)));
        eventToPlayer[_eventId][playerId] = _tokenId; 
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
            if (eventToPlayer[_eventId][index] != 0 && players[index].points > winner.points) {
                winner = players[index];
            }
        }
        return winner.playerId;
    }

    function getEventParticipants(uint _eventId) public view returns (TournamentPlayer[] memory) {
        uint playerLen = events[_eventId].seatsTaken;
        TournamentPlayer[] memory ePlayers = new TournamentPlayer[](playerLen);
        for (uint256 index = 0; index < players.length; index++) {
            if (eventToPlayer[_eventId][index] != 0) {
                ePlayers[index] = players[index];
            }
        }
        return ePlayers;
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