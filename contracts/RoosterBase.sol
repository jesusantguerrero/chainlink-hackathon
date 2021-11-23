//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoosterBase is Ownable {
    enum Breed{BLACK, PINTO, COLORAO, WHITE}
    string[] public breedNames = ["Black", "Pinto", "Colorao", "White"];

    struct Attributes {
        string name;
        Breed breed;
    }

    struct Record {
        uint32 wins;
        uint32 losses;
        uint32 draws;
    }

    struct Stats {
        uint hp;
        uint experience;
        uint points;
        uint strength;
        uint speed;
        uint agility;
        Record record;
    }
    
    mapping(uint => Attributes) internal tokenIdToAttributes;
    mapping(uint => Stats) internal tokenIdToStats;

    struct BreedAttributes {
        uint64 strength;
        uint64 speed;
        uint64 agility;
    }

    BreedAttributes internal blackBreed = BreedAttributes(15, 7, 7);
    BreedAttributes internal coloraoBreed = BreedAttributes(5, 5, 5);
    BreedAttributes internal pintoBreed = BreedAttributes(10, 7, 5);
    BreedAttributes internal whiteBreed = BreedAttributes(3, 10, 10);

    function getBreedAttributes(Breed _breed) view public returns(BreedAttributes memory) {
        BreedAttributes memory breeding;
        if (_breed == Breed.BLACK) {
            breeding = blackBreed;
        } else if (_breed == Breed.PINTO) {
            breeding = pintoBreed;
        } else if (_breed == Breed.COLORAO) {
            breeding = coloraoBreed;
        } else {
            breeding = whiteBreed;
        }

        return breeding;
    }

    function _generateTokenAttributes(uint _tokenId, uint _breedCode ,string memory _name) internal {
        BreedAttributes memory breedAttributes = getBreedAttributes(Breed(_breedCode));
        tokenIdToAttributes[_tokenId] = Attributes(_name,  Breed(_breedCode));
        tokenIdToStats[_tokenId] = Stats(
            100,
            0,
            0,
            breedAttributes.strength,
            breedAttributes.speed,
            breedAttributes.agility,
            Record(0, 0, 0)
        );
    }
}