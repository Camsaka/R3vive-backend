// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract R3certif is ERC721URIStorage, Ownable(msg.sender) {
    constructor() ERC721("Certificat R3vive", "R3C") {}

    error NotGoodPrice();
    error NotMintable();
    error NotYourRequest();

    address[] private certifOwners;
    mapping(address => bool) private ownersExists;
    mapping(address => uint256[]) private certifOwned;
    mapping (address => mapping (uint256 => bool)) private isMintable;

    uint256 private _tokenId = 0;

    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }

    function mint(address _to, string calldata _uri, uint256 _id) external payable {
        if(msg.value != 1e17) revert NotGoodPrice();
        if(!isMintable[msg.sender][_id]) revert NotMintable();
        _mint(_to, _id);
        _setTokenURI(_id, _uri);
        if (!ownersExists[_to]) {
            certifOwners.push(_to);
            ownersExists[_to] = true;
        }
        certifOwned[_to].push(_id);
        delete isMintable[msg.sender][_id];
    }

    function withdraw() external onlyOwner {
        address ownerAddress = owner();
        (bool sent, ) = ownerAddress.call{value: getBalance(address(this))}("");
        require(sent, "Failed to send Ether");
    }

    function getBalance(address _address) public view returns (uint256) {
        return _address.balance;
    }

    function getCertifOwners()
        public
        view
        onlyOwner
        returns (address[] memory)
    {
        return certifOwners;
    }

    function getCertifFor(
        address _owner
    ) public view onlyOwner returns (uint256[] memory) {
        return certifOwned[_owner];
    }

    function transferTo(address payable _to, uint256 _id) external {
        _safeTransfer(msg.sender, _to, _id);
        if (!ownersExists[_to]) {
            certifOwners.push(_to);
            ownersExists[_to] = true;
        }

        certifOwned[_to].push(_id);
        uint256[] memory newCertifOwned = new uint256[](
            certifOwned[msg.sender].length - 1
        );
        uint256 counter = 0;
        for (uint256 i = 0; i < certifOwned[msg.sender].length; ++i) {
            if (certifOwned[msg.sender][i] == _id) {} else {
                newCertifOwned[counter] = certifOwned[msg.sender][i];
                counter++;
            }
        }
        certifOwned[msg.sender] = newCertifOwned;
        console.log("token:", _id, "transfer to : ", _to);
    }

    function addTokenInConfirmationList() public{
        isMintable[msg.sender][_tokenId] = false;
        _tokenId = _tokenId + 1;
    }

    function confirmedMintablility(uint256 _id, address _owner) public onlyOwner{
        isMintable[_owner][_id] = true;
    }
    
    function getIsMintable(uint256 _id) external view returns(bool){
        return isMintable[msg.sender][_id];
    }

}
