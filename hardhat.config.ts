import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";

import "./tasks/accounts";
import "./tasks/clean";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { NetworkUserConfig } from "hardhat/types";
import { HardhatConfig } from "./types";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

// Ensure that we have all the environment variables we need.
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}

let infuraApiKey: string;
if (!process.env.INFURA_API_KEY) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
} else {
  infuraApiKey = process.env.INFURA_API_KEY;
}

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url: string = "https://" + network + ".infura.io/v3/" + infuraApiKey;
  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url,
  };
}

const config: HardhatConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    goerli: createTestnetConfig("goerli"),
    kovan: createTestnetConfig("kovan"),
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
    mumbai: {
      accounts: [
        "0x88baea1c45c1434e494604f48a39eedb780ba71086d109b78cc3b7d41aa49773",
        "0x6dbf99b051530d6de5580498d21b12400d9948db2077218fbe1a4eb8e0344a6f",
        "0xeddd2422c75dd49d02e4cde7fed0a906ca296707c06829c3cbbdb28829bf39e1",
        "0x3aa05e8a75e03a09b504314686599e8a68cd05a1c0e59f53cf7a112029d423ea",
        "0xf524cf351ba57c3967219a6514bcdd5b79523b08d88eb71fa58b1940bb9f30e0",
        "0xf30105f5658983d74d018d56f00d288671c9835ae62700d0e6c220f8c3ab0fb5",
        "0x8c4513e9f0dee96823b4f720f89df2b2c42b925d992bea266c4aae2b3d53e954",
      ],
      chainId: 80001,
      url: "https://rpc-mumbai.maticvigil.com/v1/839c4f1f04664475d4214b7eb9c0b487746fa5eb",
      gasPrice: 50000000000,
    },
    ethermint: {
      accounts: process.env.CONTRACT_OWNER ? [process.env.CONTRACT_OWNER] : [],
      url: "https://blockchain-testnet.arcana.network",
      chainId: 9000,
    },
    arcana: {
      accounts: [
        "0x88baea1c45c1434e494604f48a39eedb780ba71086d109b78cc3b7d41aa49773",
        "0x6dbf99b051530d6de5580498d21b12400d9948db2077218fbe1a4eb8e0344a6f",
        "0xeddd2422c75dd49d02e4cde7fed0a906ca296707c06829c3cbbdb28829bf39e1",
        "0x3aa05e8a75e03a09b504314686599e8a68cd05a1c0e59f53cf7a112029d423ea",
        "0xf524cf351ba57c3967219a6514bcdd5b79523b08d88eb71fa58b1940bb9f30e0",
        "0xf30105f5658983d74d018d56f00d288671c9835ae62700d0e6c220f8c3ab0fb5",
        "0x8c4513e9f0dee96823b4f720f89df2b2c42b925d992bea266c4aae2b3d53e954",
      ],
      chainId: 1337,
      url: "https://hardhat.arcana.network/",
      gasPrice: 50000000000,
    },
    arcanadev: {
      accounts: process.env.CONTRACT_OWNER ? [process.env.CONTRACT_OWNER] : [],
      url: "https://blockchain-dev.arcana.network",
      chainId: 40404,
    },
    arcanabeta: {
      accounts: process.env.BETA_CONTRACT_OWNER ? [process.env.BETA_CONTRACT_OWNER] : [],
      url: "https://blockchain001-testnet.arcana.network/",
      chainId: 40405,
    },
    polygonDev: {
      url: "http://127.0.0.1:10002/",
      chainId: 100,
      accounts: [
        "0x88baea1c45c1434e494604f48a39eedb780ba71086d109b78cc3b7d41aa49773",
        "0x1068e1d200d2bd3140445afec1ac7829f0012b87ff6c646f6b01023c95db13c8",
        "0xa11c0370501f00f2ebe942b81a546e05b919a09bc9c45ea78a7181bbabcfa4f8",
      ],
    },
    localNetwork: {
      accounts: process.env.CONTRACT_OWNER ? [process.env.CONTRACT_OWNER] : [],
      url: process.env.LOCAL_NETWORK,
      chainId: 100,
      gasPrice: 50000000000,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.2",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: "PIG155ZD21F51VZA46TMI48RNYCF8Y6FUP",
  },
};

export default config;
