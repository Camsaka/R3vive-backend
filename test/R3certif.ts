import { ethers } from "hardhat";
const { expect } = require("chai");

describe("R3certif contract", function () {
   async function deployR3Certif() {
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await ethers.getSigners();
      const hardhatToken = await ethers.deployContract("R3certif");

      return { hardhatToken, owner, otherAccount };
   }
   
   //Deployement section
   describe("Deployment", function () {
      it("Should has the correct name and symbol", async function () {
         const { hardhatToken, owner } = await deployR3Certif();
         const total = await hardhatToken.balanceOf(owner.address);
         expect(total).to.equal(0);
         expect(await hardhatToken.name()).to.equal("Certificat R3vive");
         expect(await hardhatToken.symbol()).to.equal("R3C");
      });
   });

   //Mint NFT section
   describe("Mint certif", function () {
      it("Should mint a token with token ID 1 & 2 to address1", async function () {
         //deployment
         const { hardhatToken, owner, otherAccount } = await deployR3Certif();
         const address1 = otherAccount.address;
         //first mint test
         await hardhatToken.mint(
            address1,
            1,
            "https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage"
         );
         expect(await hardhatToken.ownerOf(1)).to.equal(address1);
         expect(await hardhatToken.balanceOf(address1)).to.equal(1);

         //second mint test
         await hardhatToken.mint(
            address1,
            2,
            "https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage"
         );
         expect(await hardhatToken.ownerOf(2)).to.equal(address1);
         expect(await hardhatToken.balanceOf(address1)).to.equal(2);
      });
   });
});
