<p>
<a href="#start"><img height="30rem" src="https://raw.githubusercontent.com/arcana-network/branding/main/an_logo_light_temp.png"/></a>
<a title="MIT License" href="https://github.com/arcana-network/license/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue"/></a>
<a title="Beta release" href="https://github.com/arcana-network/dkg-smart-contract/releases"><img src="https://img.shields.io/github/v/release/arcana-network/dkg-smart-contract?style=flat-square&color=28A745"/></a>
<a title="Twitter" href="https://twitter.com/ArcanaNetwork"><img alt="Twitter URL" src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FArcanaNetwork"/></a>
</p>

# DKG Smart Contract

+ Set of smart contracts for DKG protocol.
+ Keeps track of DKG Nodes and its epochs.

*TBD Some insights on who can use this repository and for what purpose? How these DKG smart contracts can be utilized or used or updated by contributors as this is a public repository.*

## ⚙️ Installation

### Prerequisites

Before running any command, make sure to install dependencies:

```sh
$ yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the
[vscode-solidity](https://github.com/juanfranblanco/vscode-solidity) extension. The recommended approach to set the
compiler version is to add the following fields to your VSCode user settings:

```json
{
  "solidity.compileUsingRemoteVersion": "v0.8.3+commit.8d00100c",
  "solidity.defaultCompiler": "remote"
}
```

Where of course `v0.8.3+commit.8d00100c` can be replaced with any other version.

## Deployment

You can deploy DKG Smart Contracts on the following supported chains:

### Polygon Edge Network (Local machine)

**Prerequisites:**

- Install [Docker](https://docs.docker.com/engine/install/)

- Make sure that you setup the validator node (Polygon Edge) on your local machine before deploying the DKG Smart Contracts. You can access the repository for validator node [here](https://github.com/arcana-network/validator-node-setup)

**Steps:**

1. Clone the repository

```
git clone git@github.com:arcana-network/dkg-smart-contract.git
```

2. Create environment file

```
cp .env.example .env
```

3. Deploy DKG Smart Contract on Polygon Edge network(Local machine).

```
make deploy
```

## 📚 Usage

*To be updated - are there any usage instructions for this repository?*

## 💡 Support

For any queries, contact the [Arcana Support Team](mailto:support@arcana.network).

## 🤝 Contributing Guide

We welcome all contributions to this public repository from the community.

Read our [contributing guide](https://github.com/arcana-network/license/blob/main/CONTRIBUTING.md) to learn more about the our development process, how to propose bug fixes and improvements, and the code of conduct that we expect the participants to adhere to.

## ℹ️ License

This public repository from Arcana Networks is distributed under the [MIT License](https://fossa.com/blog/open-source-licenses-101-mit-license/).

For details see [Arcana License](https://github.com/arcana-network/license/blob/main/LICENSE.md).
