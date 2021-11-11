//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol"; 
import "./RoosterBase.sol";
import "hardhat/console.sol";

contract RoosterNFT is RoosterBase, ERC721URIStorage, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _totalSupply;
    Counters.Counter public availableTokens;

    struct PreToken {
        uint id;
        uint breed;
        string uri;
        bool claimed;
    }

    address private contractOwner;
    mapping(uint => string) internal tokenToImage;
    mapping(uint => address) private tokenToClaimer;
    mapping(uint => address) private tokenToOwner;
    mapping(uint => PreToken) private minteableTokens;


    constructor(PreToken[] memory _uris) ERC721("CRF", "Crypto RoosterFight") {
        contractOwner = msg.sender;
        batchPreMint(_uris);
    }

    function mint(uint _preTokenId) public nonReentrant {
        require(totalSupply() < availableTokens.current(), "No more tokens available");
        require(minteableTokens[_preTokenId].claimed == false, "The token is already minted");
        _totalSupply.increment();
        uint tokenId = _totalSupply.current();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, minteableTokens[_preTokenId].uri);
        _generateTokenAttributes(tokenId, minteableTokens[_preTokenId].breed, string(abi.encodePacked("token ", tokenId)));
        tokenToOwner[tokenId] = msg.sender;
        minteableTokens[_preTokenId].claimed = true;
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

    function totalSupply () public view returns (uint) {
        return _totalSupply.current();
    }

    function pendingToMint() public view returns (PreToken[] memory) {
        PreToken[] memory pending = new PreToken[](availableTokens.current() - totalSupply());
        uint count = 0;
        for (uint i = 1; i <= availableTokens.current(); i++) {
            if (minteableTokens[i].claimed == false) {
                pending[count] = minteableTokens[i];
                count++;
            }
        }

        return pending;
    }

    // Tokens storage to save images to generate tokenURI programmatically
    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");
        return formatTokenURI(tokenToImage[_tokenId], _tokenId);
    }

    function formatTokenURI(string memory _imageURI, uint _tokenId) public view virtual returns (string memory) {
        Attributes memory attributes = tokenIdToAttributes[_tokenId];
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(
                    abi.encodePacked(
                        '{"name": "',attributes.name, '",',
                        '"description": "This is a description",',
                        '"image":"', 
                        _imageURI, '",',
                        '"attributes":[',
                        '{"breed":"', breedNames[uint(attributes.breed)], '"}', 
                        ']',
                        '}'
                    )
                )))
        );
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual override {
        require(_exists(tokenId), "URI set of nonexistent token");
        tokenToImage[tokenId] = _tokenURI;
    }

    function getImageURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "URI set of nonexistent token");
        return tokenToImage[tokenId];
    }

    // NFT Balances
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        super.transferFrom(from, to, tokenId);
        tokenToOwner[tokenId] = to;
    }

    function _getRoostersOf(address _owner) internal view returns (uint[] memory) {
        uint[] memory nfts = new uint[](balanceOf(_owner));
        uint counter = 0;
        for (uint i = 1; i <= _totalSupply.current(); i++) {
            if (tokenToOwner[i] == _owner) {
                nfts[counter] = i;
                counter++;
            }
        }
        return nfts;
    }

    function getRoostersByOwner(address _owner) external view returns (uint[] memory) {
        return _getRoostersOf(_owner);
    }

    function getMyRoosters() public view returns (uint[] memory) {
        return _getRoostersOf(msg.sender);
    }
}