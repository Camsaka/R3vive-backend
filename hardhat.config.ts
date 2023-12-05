import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gui";
import "hardhat-deploy";
require("dotenv").config();

const ownerPrivateKey: string = process.env.OWNER_PRIVATE_KEY!;
const infuraSepoliaURL: string = process.env.INFURA_SEPOLIA_URL!;
const infuraGoerliURL: string = process.env.INFURA_GOERLI_URL!;
const etherscanAPIKey: string = process.env.ETHERSCAN_API_KEY!;
const infuraMainnetURL: string = process.env.INFURA_MAINNET_URL!;

const config: HardhatUserConfig = {
   solidity: "0.8.20",
   namedAccounts: {
      deployer: 0,
    },
   networks: {
      sepolia: {
         url: infuraSepoliaURL,
         accounts: [ownerPrivateKey],
      },
      goerli: {
         url: infuraGoerliURL,
         accounts: [ownerPrivateKey],
      },
      hardhat: {
         forking: {
            url: infuraMainnetURL,
         },
      },
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
