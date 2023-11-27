import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const OwnerPublicKey = process.env.OWNER_PUBLIC_KEY

const config: HardhatUserConfig = {
   solidity: "0.8.20",
  //  networks: {
  //     goerli: {
  //        url: process.env.INFURA_GOERLI_URL,
  //        accounts: [process.env.PRIV_KEY],
  //     },
  //  },
};

export default config;
