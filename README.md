# DKG Smart Contract

+ Set of smart contract for DKG protocol.
+ Keeps track of DKG Nodes and its epochs
## Usage

### Pre Requisites

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

## Deploy DKG Smart Contracts on Polygon Edge network(Local machine)

### Prerequisites
- [Docker](https://docs.docker.com/engine/install/)

Note: Make sure to setup validator node(Polygon Edge) on local machine before deploying DKG Smart Contracts. Repository link for validator node setup: https://github.com/arcana-network/validator-node-setup

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
