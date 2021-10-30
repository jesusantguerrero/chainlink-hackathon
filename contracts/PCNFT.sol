//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PCNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint;
    Counters.Counter private _totalSupply;
    uint private availableTokens = 100;

    constructor(uint _avaiblableTokens) ERC721("IBX", "Insane Box") {
        availableTokens = _avaiblableTokens;
    }

    function mint(address _to, string memory _tokenURI) public onlyOwner {
        require(availableTokens > 0, "No more tokens available");
        availableTokens.sub(1);
        _totalSupply.increment();
        uint tokenId = _totalSupply.current();
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function totalSupply () public view returns (uint) {
        return _totalSupply.current();
    }
}