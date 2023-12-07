import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-ethers";
require("dotenv").config();

const ownerPrivateKey: string = process.env.OWNER_PRIVATE_KEY!;
const infuraSepoliaURL: string = process.env.INFURA_SEPOLIA_URL!;
const infuraGoerliURL: string = process.env.INFURA_GOERLI_URL!;
const etherscanAPIKey: string = process.env.ETHERSCAN_API_KEY!;
const infuraMainnetURL: string = process.env.INFURA_MAINNET_URL!;

const config: HardhatUserConfig = {
   solidity: "0.8.20",
   networks: {
      hardhat: {
         // forking: {
         //    url: infuraMainnetURL,
         // },
         chainId : 1337
      },
      sepolia: {
         url: infuraSepoliaURL,
         accounts: [ownerPrivateKey],
      },
      goerli: {
         url: infuraGoerliURL,
         accounts: [ownerPrivateKey],
      }
   },
   etherscan: {
      apiKey: etherscanAPIKey,
   },
   gasReporter: {
      currency: "USD",
      gasPrice: 21,
      enabled: true,
   },
};

export default config;
