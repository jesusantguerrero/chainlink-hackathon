//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol"; 
import "./PCBase.sol";

contract PCNFT is ERC721URIStorage, PCBase, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint;
    Counters.Counter private _totalSupply;
    uint private availableTokens = 100;
    uint private claimersTokenLimit = 1;
    
    address private contractOwner;
    mapping(uint => string) internal tokenToImage;
    mapping(uint => bool) private tokenToClaimed;
    mapping(address => uint) private claimers;
    mapping(address => uint) private claimerTokensCount;

    constructor(uint _avaiblableTokens) ERC721("IBX", "Insane Box") {
        availableTokens = _avaiblableTokens;
        contractOwner = msg.sender;
    }

    function mint(address _to, string memory _imageURI) public onlyOwner {
        require(availableTokens > 0, "No more tokens available");
        availableTokens = availableTokens.sub(1);
        _totalSupply.increment();
        uint tokenId = _totalSupply.current();
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _imageURI);
        _generateTokenAttributes(tokenId, string(abi.encodePacked("token ", tokenId)));
        if (_to != contractOwner) {
            _claim(tokenId, _to);
        }
    }

    function batchMint(string[] memory _uris) public onlyOwner {
        require(_uris.length > 0, "Should be at least one");
        for (uint256 index = 0; index < _uris.length; index++) {
            mint(msg.sender, _uris[index]);
        }
    }

    function getAvailableNFTs() public view returns (uint) {
        return availableTokens;
    }

    function totalSupply () public view returns (uint) {
        return _totalSupply.current();
    }

    // allow users to claim tokens
    function _claim (uint _tokenId, address _claimer) private {
        require(claimerTokensCount[_claimer] < claimersTokenLimit, "Claimer has reached the limit");
        tokenToClaimed[_tokenId] = true;
        claimers[_claimer] = _tokenId;
        claimerTokensCount[_claimer] = claimerTokensCount[_claimer].add(1);
    }

    function claim(uint _tokenId, address _to) public {
        require(_exists(_tokenId), "This token doent exist");
        require(tokenToClaimed[_tokenId] != true , "This token is taken");
        _claim(_tokenId, _to);
        transferFrom(contractOwner, _to, _tokenId);
    }

    function pendingToClaim() public view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < _totalSupply.current(); i++) {
            if (tokenToClaimed[i] != true) {
                count++;
            }
        }
        return  totalSupply() - count;
    }

    // Tokens storage to save images to generate tokenURI programmatically
  
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory imageURI = tokenToImage[tokenId];

        return formatTokenURI(imageURI);
        
    }

    function formatTokenURI(string memory _imageURI) public view virtual returns (string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(
                    abi.encodePacked(
                        '{"name": "CryptoRooster 1",',
                        '"description": "This is a description",',
                        '"image":', 
                        _imageURI, 
                        '"}'
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
}