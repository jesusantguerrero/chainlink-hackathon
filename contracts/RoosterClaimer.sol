//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./RoosterNFT.sol";

contract RoosterClaimer {
    function claim(address _nftContract, uint _tokenId, address _to) public {
        RoosterNFT(_nftContract).claim(_tokenId, _to);
    }
}