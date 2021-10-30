pragma solidity ^0.8.4;

import "./PCNFT.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract PlayerHelper is PCNFT {
    using SafeMath for uint32;
    struct Level {
        uint min;
        uint max;
    }

    Level[] public levels;

    constructor(uint _totalSupply) PCNFT(_totalSupply) {
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

    function getPCDetails(uint _tokenId) external view returns (
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
}