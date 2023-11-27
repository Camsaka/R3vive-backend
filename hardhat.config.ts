import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const ownerPrivateKey: string = process.env.OWNER_PRIVATE_KEY!;
const infuraSepoliaURL: string = process.env.INFURA_SEPOLIA_URL!;
const infuraGoerliURL: string = process.env.INFURA_GOERLI_URL!;
const etherscanAPIKey : string = process.env.ETHERSCAN_API_KEY!;

const config: HardhatUserConfig = {
   solidity: "0.8.20",
   networks: {
      sepolia: {
         url: infuraSepoliaURL,
         accounts: [ownerPrivateKey],
      },
      goerli: {
         url: infuraGoerliURL,
         accounts: [ownerPrivateKey],
      },
   },
   etherscan: {
      apiKey: etherscanAPIKey,
   },
};

export default config;
