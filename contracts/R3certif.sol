// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract R3certif is ERC721URIStorage, Ownable(msg.sender){
   constructor() ERC721("Certificat R3vive", "R3C"){}

   function mint(address _to, uint256 _tokenId, string calldata _uri) external onlyOwner {
      _safeMint(_to, _tokenId);
      _setTokenURI(_tokenId, _uri);
   }

   //mint ownbale external
   //transfer public
   //burn ownable external
   //check balance internal
   //access control
   //implement metadata : {
   //    id : number
   //    marque
   //    modele
   //    numero de serie PRIVATE
   //    année de fabrication
   //    previous owners
   //    image
   //    histoire
   // }
   
   //compile
   //testing
   //deployment
}