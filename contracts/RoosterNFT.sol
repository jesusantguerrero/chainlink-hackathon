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
    uint public availableTokens = 100;

    address private contractOwner;
    mapping(uint => string) internal tokenToImage;
    mapping(uint => address) private tokenToClaimer;
    mapping(uint => address) private tokenToOwner;

    constructor(uint _avaiblableTokens) ERC721("CRF", "Crypto RoosterFight") {
        availableTokens = _avaiblableTokens;
        contractOwner = msg.sender;
    }

    function mint(string memory _imageURI) public nonReentrant {
        require(availableTokens > 0, "No more tokens available");
        availableTokens = SafeMath.sub(availableTokens, 1);
        _totalSupply.increment();
        uint tokenId = _totalSupply.current();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _imageURI);
        _generateTokenAttributes(tokenId, string(abi.encodePacked("token ", tokenId)));
        tokenToOwner[tokenId] = msg.sender;
    }

    function batchMint(string[] memory _uris) public onlyOwner {
        require(_uris.length > 0, "Should be at least one");
        for (uint256 index = 0; index < _uris.length; index++) {
            mint(_uris[index]);
        }
    }

    function totalSupply () public view returns (uint) {
        return _totalSupply.current();
    }

    function pendingToMint() public view returns (uint) {
        return availableTokens - totalSupply();
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
        require(_exists(tokenId), " URI set of nonexistent token");
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