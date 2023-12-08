import { ethers } from "hardhat";
const { expect } = require("chai");
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("R3certif contract", function () {
   async function deployR3Certif() {
      //Contracts are deployed using the first signer/account by default

      const [owner, otherAccount] = await ethers.getSigners();
      const hardhatToken = await ethers.deployContract("R3certif");
      return { hardhatToken, owner, otherAccount };
   }

   //Deployement section
   describe("Deployment", function () {
      it("Should has the correct name and symbol", async function () {
         const { hardhatToken, owner, otherAccount } = await loadFixture(
            deployR3Certif
         );
         const total = await hardhatToken.balanceOf(owner.address);
         expect(total).to.equal(0);
         expect(await hardhatToken.name()).to.equal("Certificat R3vive");
         expect(await hardhatToken.symbol()).to.equal("R3C");
      });
   });

   //Mint NFT section
   describe("Mint certif", function () {
      it("Should mint 2 certif with token ID 0 & 1 to address1", async function () {
         //deployment
         const { hardhatToken, owner, otherAccount } = await loadFixture(
            deployR3Certif
         );
         const address1 = otherAccount.address;

         await hardhatToken.connect(otherAccount).addTokenInConfirmationList();
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(0));

         await hardhatToken.connect(owner).confirmedMintablility(0, address1);
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(0));
         //first mint test
         await hardhatToken.connect(otherAccount).mint(
            address1,
            "https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage",
            0,
            { value: ethers.parseUnits("0.1", "ether") }
         );
         expect(await hardhatToken.ownerOf(0)).to.equal(address1);
         expect(await hardhatToken.balanceOf(address1)).to.equal(1);

         // //second mint test
         await hardhatToken.connect(otherAccount).addTokenInConfirmationList();
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(1));

         await hardhatToken.connect(owner).confirmedMintablility(1, address1);
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(1));

         await hardhatToken.connect(otherAccount).mint(
            address1,
            "https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage",
            1,
            { value: ethers.parseUnits("0.1", "ether") }
         );
         expect(await hardhatToken.ownerOf(0)).to.equal(address1);
         expect(await hardhatToken.balanceOf(address1)).to.equal(2);

            expect(await hardhatToken.getBalance(hardhatToken.getAddress())).to.equal(ethers.parseEther("0.2"));

            const certifOwners = await hardhatToken.getCertifOwners();
            const certifOwnedByAddress1 = await hardhatToken.getCertifFor(
               address1
            );

            // console.log(certifOwners);
            // console.log(certifOwnedByAddress1);
            expect(certifOwners[0]).to.equal(address1);
            expect(certifOwnedByAddress1.length).to.equal(2);
            expect(certifOwnedByAddress1[0]).to.equal(0);
            expect(certifOwnedByAddress1[1]).to.equal(1);
      });
   });

   //Withdraw section
   describe("Withdraw", function () {
      it("Send 2 ether to the contract with address1 and withdraw on owner address", async function () {
         //deployment
         const { hardhatToken, owner, otherAccount } = await loadFixture(
            deployR3Certif
         );

         //send 2 ethers to the contract
         await otherAccount.sendTransaction({
            to: hardhatToken.getAddress(),
            value: ethers.parseEther("2"),
         });

         //check balance of the contract
         expect(
            await hardhatToken.getBalance(hardhatToken.getAddress())
         ).to.equal(ethers.parseEther("2"));

         //getBalance of the owner before withdraw
         const balanceOwnerBeforeWithdraw = await hardhatToken.getBalance(
            owner.address
         );

         //execute withdraw function
         await hardhatToken.withdraw();

         //check both of owner and contract address balance
         expect(
            await hardhatToken.getBalance(hardhatToken.getAddress())
         ).to.equal(0);
         expect(
            (await hardhatToken.getBalance(owner.address)) >
               balanceOwnerBeforeWithdraw
         );
      });
   });

   describe("Receive and fallback functions", function () {
      // receive
      it("Should receive 1 eth with receive function", async function () {
         const { hardhatToken, owner, otherAccount } = await loadFixture(
            deployR3Certif
         );
         await owner.sendTransaction({
            to: hardhatToken.getAddress(),
            value: ethers.parseEther("1"),
         });
         expect(
            await hardhatToken.getBalance(await hardhatToken.getAddress())
         ).to.equal(ethers.parseEther("1"));
      });

      // fallback
      it("Should receive 1 eth with fallback function", async function () {
         const { hardhatToken, owner, otherAccount } = await loadFixture(
            deployR3Certif
         );
         await owner.sendTransaction({
            to: hardhatToken.getAddress(),
            value: ethers.parseEther("1"),
            data: "0x5444",
         });
         expect(
            await hardhatToken.getBalance(await hardhatToken.getAddress())
         ).to.equal(ethers.parseEther("1"));
      });
   });

   describe("Transfer NFT", function () {
      it("Should mint and transfer a certificate from address1 to owner address ", async function () {
         const { hardhatToken, owner, otherAccount } = await deployR3Certif();
         const address1 = otherAccount.address;

         
         await hardhatToken.connect(otherAccount).addTokenInConfirmationList();
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(0));

         await hardhatToken.connect(owner).confirmedMintablility(0, address1);
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(0));
         
         //mint
         await hardhatToken.connect(otherAccount).mint(
            address1,
            "https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage",
            0,
            { value: ethers.parseUnits("0.1", "ether") }
         );

         await hardhatToken.connect(otherAccount).addTokenInConfirmationList();
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(1));

         await hardhatToken.connect(owner).confirmedMintablility(1, address1);
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(1));
         
         //mint
         await hardhatToken.connect(otherAccount).mint(
            address1,
            "https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage",
            1,
            { value: ethers.parseUnits("0.1", "ether") }
         );

         await hardhatToken.connect(otherAccount).addTokenInConfirmationList();
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(2));

         await hardhatToken.connect(owner).confirmedMintablility(2, address1);
         console.log(await hardhatToken.connect(otherAccount).getIsMintable(2));
         
         //mint
         await hardhatToken.connect(otherAccount).mint(
            address1,
            "https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage",
            2,
            { value: ethers.parseUnits("0.1", "ether") }
         );

         console.log(await hardhatToken.getCertifOwners());
         console.log("certif address1 :", await hardhatToken.getCertifFor(address1));
         console.log("certif owner :", await hardhatToken.getCertifFor(owner));

         expect(await hardhatToken.ownerOf(0)).to.equal(address1);
         expect(await hardhatToken.ownerOf(1)).to.equal(address1);
         expect(await hardhatToken.ownerOf(2)).to.equal(address1);
         expect(await hardhatToken.balanceOf(address1)).to.equal(3);
         expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);

         //transfer
         await hardhatToken.connect(otherAccount).transferTo(owner, 1);

         console.log(await hardhatToken.getCertifOwners());
         console.log("certif address1 :", await hardhatToken.getCertifFor(address1));
         console.log("certif owner :", await hardhatToken.getCertifFor(owner));

         expect(await hardhatToken.ownerOf(0)).to.equal(address1);
         expect(await hardhatToken.ownerOf(1)).to.equal(owner.address);
         expect(await hardhatToken.balanceOf(address1)).to.equal(2);
         expect(await hardhatToken.balanceOf(owner.address)).to.equal(1);

         //transfer
         await hardhatToken.connect(owner).transferTo(address1, 1);

         console.log(await hardhatToken.getCertifOwners());
         console.log("certif address1 :", await hardhatToken.getCertifFor(address1));
         console.log("certif owner :", await hardhatToken.getCertifFor(owner));

         expect(await hardhatToken.ownerOf(0)).to.equal(address1);
         expect(await hardhatToken.ownerOf(1)).to.equal(address1);
         expect(await hardhatToken.balanceOf(address1)).to.equal(3);
         expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);

      });
   });
});
