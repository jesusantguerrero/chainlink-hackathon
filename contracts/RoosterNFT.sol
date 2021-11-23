//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol"; 
import "./RoosterBase.sol";

contract RoosterNFT is RoosterBase, ERC721 {
    using Counters for Counters.Counter;
    event Minted(address indexed to, uint256 indexed tokenId);

    Counters.Counter public totalSupply;
    Counters.Counter public availableTokens;

    struct PreToken {
        uint id;
        uint breed;
        string uri;
        bool claimed;
    }

    uint public tokenLimitByOwner = 1;
    mapping(uint => string) public tokenToImage;
    mapping(uint => PreToken) internal minteableTokens;

    constructor(PreToken[] memory _uris) ERC721("CRF", "Crypto RoosterFight") {
        batchPreMint(_uris);
    }

    function mint(uint _preTokenId) public {
        require(totalSupply.current() < availableTokens.current(), "No more tokens available");
        require(minteableTokens[_preTokenId].claimed == false, "The token is already minted");
        require(balanceOf(msg.sender) < tokenLimitByOwner, "You already reached the limit");
        totalSupply.increment();
        uint tokenId = totalSupply.current();
        _mint(msg.sender, tokenId);
        tokenToImage[tokenId] = minteableTokens[_preTokenId].uri;
        _generateTokenAttributes(tokenId, minteableTokens[_preTokenId].breed, string(abi.encodePacked("token ", Strings.toString(tokenId))));
        minteableTokens[_preTokenId].claimed = true;
        emit Minted(msg.sender, tokenId);
    }

    function batchPreMint(PreToken[] memory _uris) public onlyOwner {
        require(_uris.length > 0, "Should be at least one");
        for (uint256 index = 0; index < _uris.length; index++) {
            availableTokens.increment();
            minteableTokens[availableTokens.current()] = PreToken(
                availableTokens.current(), 
                _uris[index].breed, 
                _uris[index].uri, 
                false
            );
        }
    }

    function pendingToMint() public view returns (PreToken[] memory) {
        PreToken[] memory pending = new PreToken[](availableTokens.current() - totalSupply.current());
        uint count = 0;
        for (uint i = 1; i <= availableTokens.current(); i++) {
            if (minteableTokens[i].claimed == false) {
                pending[count] = minteableTokens[i];
                count++;
            }
        }

        return pending;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");
        return _formatTokenURI(_tokenId);
    }

    function _formatTokenURI(uint _tokenId) private view returns (string memory) {
        Attributes memory attributes = tokenIdToAttributes[_tokenId];
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(
                    abi.encodePacked(
                        '{"name": "',attributes.name, '",',
                        '"description": "An nft collection",',
                        '"image":"', 
                        tokenToImage[_tokenId], '",',
                        '"attributes":[',
                        '{"breed":"', breedNames[uint(attributes.breed)], '"}', 
                        ']',
                        '}'
                    )
                )))
        );
    }

    function getRoostersOf(address _owner) public view returns (uint[] memory) {
        uint[] memory nfts = new uint[](balanceOf(_owner));
        uint counter = 0;
        for (uint i = 1; i <= totalSupply.current(); i++) {
            if (ownerOf(i) == _owner) {
                nfts[counter] = i;
                counter++;
            }
        }
        return nfts;
    }
}