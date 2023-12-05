// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract R3certif is ERC721URIStorage, Ownable(msg.sender) {
    constructor() ERC721("Certificat R3vive", "R3C") {}

    error NotOwner();
    error NotGoodPrice();

    address[] public certifOwners;
    mapping(address => bool) public ownersExists;
    mapping(address => uint256[]) public certifOwned;

    uint256 private _tokenId = 0;

    enum watchesCategory {
        LOW,
        HIGH,
        BEST
    }

    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }

    function mint(
        address _to,
        string calldata _uri
    )
        external
        payable
        // watchesCategory category
        onlyOwner
    {
        // if (category == watchesCategory.LOW) {
        //     if (msg.value != 1000000000000000000) revert NotGoodPrice();
        // }
        // if (category == watchesCategory.HIGH) {
        //     if (msg.value != 1000000000000000000) revert NotGoodPrice();
        // }
        // if (category == watchesCategory.BEST) {
        //     if (msg.value != 1000000000000000000) revert NotGoodPrice();
        // }
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _uri);
        if (!ownersExists[_to]) {
            certifOwners.push(_to);
            ownersExists[_to] = true;
        }
        certifOwned[_to].push(_tokenId);
        _tokenId = _tokenId + 1;
    }

    function withdraw() external payable onlyOwner {
        address ownerAddress = owner();
        (bool sent, ) = ownerAddress.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function getBalance(address _address) public view returns (uint256) {
        return _address.balance;
    }

    function getCertifOwners() public view returns (address[] memory) {
        return certifOwners;
    }

    function getCertifFor(
        address _owner
    ) public view returns (uint256[] memory) {
        return certifOwned[_owner];
    }

    // function transfer(address _to, uint256 _tokenId) external {
    //     if (ownerOf(_tokenId) != msg.sender) {
    //         revert NotOwner();
    //     }
    //     _safeTransfer(msg.sender, _to, _tokenId);
    //     console.log("token:", _tokenId, "transfer to : ", _to);
    // }
}
