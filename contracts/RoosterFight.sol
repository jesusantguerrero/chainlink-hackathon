//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./RoosterNFT.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract RoosterFight is RoosterNFT {
    using SafeMath for uint32;
    using SafeMath for uint;
    struct Level {
        uint min;
        uint max;
    }

    Level[] public levels;
    uint public bonusLevel = 5;

    constructor(PreToken[] memory _uris) RoosterNFT(_uris) {
        levels.push(Level(0, 100));
        levels.push(Level(100, 1000));
        levels.push(Level(1000, 10000));
        levels.push(Level(10000, 100000));
    }

    modifier onlyOwnerOf(uint _id) {
        require(ownerOf(_id) == msg.sender, "Only tokenowner call");
        _;
    }

    function getLevel(uint256 _tokenId) public view returns (uint32) {
        Stats memory stats = tokenIdToStats[_tokenId];
        uint32 level = 0;
        for (uint32 i = 0; i < levels.length; i++) {
            if (levels[i].min >= stats.experience && stats.experience <= levels[i].max) {
                return level= i+1;
                
            }
        }
        return level;
    }

    function getDetails(uint _tokenId) external view returns (
        string memory name,
        string memory image,
        string memory breed,
        uint hp,
        uint experience,
        uint level,
        uint speed,
        uint agility,
        uint strength,
        uint32 wins,
        uint32 losses
    ) {
        Attributes memory attributes = tokenIdToAttributes[_tokenId];
        Stats memory stats = tokenIdToStats[_tokenId];
        image = tokenToImage[_tokenId];
        uint playerLevel = getLevel(_tokenId);

        return (
            attributes.name,
            image,
            breedNames[uint(attributes.breed)],
            stats.hp,
            stats.experience,
            playerLevel,
            stats.speed,
            stats.agility,
            stats.strength,
            stats.record.wins,
            stats.record.losses
        );
    }

    function sendAttack(uint _attacker, uint _randomNumber) internal view returns(uint) {
        uint level = getLevel(_attacker);
        uint maxDamage = tokenIdToStats[_attacker].strength + tokenIdToStats[_attacker].speed + (level * bonusLevel);
        uint damage = (_randomNumber % maxDamage) + tokenIdToStats[_attacker].strength;
        return damage;
    }

    function simulateRound(uint _attackerId, uint _targetId, uint[] memory _randomNumber) public returns (uint, uint, uint, uint) {
        uint myAttack = sendAttack(_attackerId, _randomNumber[0]);
        uint enemyAttack = sendAttack(_targetId, _randomNumber[1]);
        uint winner = myAttack > enemyAttack ? _attackerId : _targetId;
        uint loser = winner == _attackerId ? _targetId : _attackerId;
        tokenIdToStats[winner].points = tokenIdToStats[winner].points.add(3);
        tokenIdToStats[loser].points = tokenIdToStats[loser].points.add(1);
        tokenIdToStats[winner].record.wins = uint32(tokenIdToStats[winner].record.wins.add(1));
        tokenIdToStats[loser].record.losses = uint32(tokenIdToStats[loser].record.losses.add(1));
        return (winner, loser, myAttack, enemyAttack);
    }

    function setName (uint _tokenId, string memory _name) public onlyOwnerOf(_tokenId) {
        tokenIdToAttributes[_tokenId].name = _name;
    }

    function getAvailablePoints(uint _tokenId) public view returns (uint) {
        return tokenIdToStats[_tokenId].points;
    }

    function distributePoints(uint _tokenId, uint _strength, uint _speed, uint _agility) public onlyOwnerOf(_tokenId) {
        uint points = _strength + _speed + _agility;
        require(points <= tokenIdToStats[_tokenId].points, "Not enough points");
        tokenIdToStats[_tokenId].points = tokenIdToStats[_tokenId].points.sub(uint(points));
        tokenIdToStats[_tokenId].strength = tokenIdToStats[_tokenId].strength.add(_strength);
        tokenIdToStats[_tokenId].speed = tokenIdToStats[_tokenId].speed.add(_speed);
        tokenIdToStats[_tokenId].agility = tokenIdToStats[_tokenId].agility.add(_agility);
    }
}