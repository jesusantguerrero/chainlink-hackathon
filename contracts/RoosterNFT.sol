//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol"; 
import "./RoosterBase.sol";
import "hardhat/console.sol";

contract RoosterNFT is ERC721URIStorage, RoosterBase, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _totalSupply;
    uint public availableTokens = 100;
    uint private claimersTokenLimit = 1;
    uint private claimedTokensCount = 0;

    address private contractOwner;
    address private claimerAddress;
    mapping(uint => string) internal tokenToImage;
    mapping(uint => address) private tokenToClaimer;
    mapping(uint => address) private tokenToOwner;
    mapping(address => uint) private claimerTokensCount;

    constructor(uint _avaiblableTokens) ERC721("CRF", "Crypto RoosterFight") {
        availableTokens = _avaiblableTokens;
        contractOwner = msg.sender;
    }

    function setClaimerAddress(address _claimer) public onlyOwner {
        claimerAddress = _claimer;
        setApprovalForAll(claimerAddress, true);
    }

    function mint(address _to, string memory _imageURI) public onlyOwner {
        require(availableTokens > 0, "No more tokens available");
        availableTokens = SafeMath.sub(availableTokens, 1);
        _totalSupply.increment();
        uint tokenId = _totalSupply.current();
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _imageURI);
        _generateTokenAttributes(tokenId, string(abi.encodePacked("token ", tokenId)));
        if (_to != contractOwner) {
            _claim(tokenId, _to);
        }
        tokenToOwner[tokenId] = _to;
    }

    function batchMint(string[] memory _uris) public onlyOwner {
        require(_uris.length > 0, "Should be at least one");
        for (uint256 index = 0; index < _uris.length; index++) {
            mint(msg.sender, _uris[index]);
        }
    }

    function totalSupply () public view returns (uint) {
        return _totalSupply.current();
    }

    // allow users to claim tokens
    function _claim (uint _tokenId, address _claimer) private {
        require(claimerTokensCount[_claimer] < claimersTokenLimit, "Claimer has reached the limit");
        tokenToClaimer[_tokenId] = _claimer;
        claimerTokensCount[_claimer] = SafeMath.add(claimerTokensCount[_claimer], 1);
        claimedTokensCount = SafeMath.add(claimedTokensCount, 1);
    }

    function claim(uint _tokenId, address _to) public {
        require(_exists(_tokenId), "This token doent exist");
        require(tokenToClaimer[_tokenId] == address(0) , "This token is taken");
        _claim(_tokenId, _to);
        transferFrom(contractOwner, _to, _tokenId);
    }

    function pendingToClaim() public view returns (uint[] memory) {
        uint[] memory claimableList = new uint[](totalSupply() - claimedTokensCount);
        uint count = 0;
        for (uint i = 1; i <= totalSupply(); i++) {
            if (tokenToClaimer[i] == address(0)) {
                claimableList[count] = i;
                count++;
            }
        }

        return claimableList;
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
                        '{"name": "CryptoRooster 1",',
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