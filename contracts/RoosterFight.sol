//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./RoosterNFT.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract RoosterFight is RoosterNFT {
    using SafeMath for uint32;
    struct Level {
        uint min;
        uint max;
    }

    Level[] public levels;
    uint public bonusLevel = 5;

    constructor(uint _totalSupply) RoosterNFT(_totalSupply) {
        levels.push(Level(0, 100));
        levels.push(Level(100, 1000));
        levels.push(Level(1000, 10000));
        levels.push(Level(10000, 100000));
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

    function sendAttack(uint _attacker, uint _target, uint _randomNumber) internal returns(uint) {
        uint level = getLevel(_attacker);
        uint maxDamage = tokenIdToStats[_attacker].strength + tokenIdToStats[_attacker].speed + (level * bonusLevel);
        uint damage = _randomNumber % maxDamage;
        tokenIdToStats[_target].hp -= SafeMath.sub(tokenIdToStats[_target].hp, damage);
        return damage;
    }

    function fight(uint _attackerId, uint _targetId, uint _randomNumber) public returns (uint, uint) {
        uint myAttack = sendAttack(_attackerId, _targetId, _randomNumber);
        uint enemyAttack = sendAttack(_targetId, _attackerId, _randomNumber);
       
        uint winner = myAttack > enemyAttack ? _attackerId : _targetId;
        uint losser = winner == _attackerId ? _targetId : _attackerId;
        return (winner, losser);
    }
}