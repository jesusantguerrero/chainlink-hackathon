# Chainlink Hackathon Project
[![codecov](https://codecov.io/gh/jesusantguerrero/chainlink-hackathon/branch/master/graph/badge.svg?token=Y153S4JEZL)](https://codecov.io/gh/jesusantguerrero/chainlink-hackathon)

## User Stories

- User Story: I can connect my wallet using metamask.

- User Story: I can claim NFTRoosters.

- User Story: I can participate in tournaments.

- User Story: I can fight with others roosters to win points.

- User Story: I can win if at the end of the tourmament I have more points.

## Technical Details
In the following application tried to cover all main aspects of solidity and smart contract topics

- Use external contracts and libraries
- Protect external configuration functions with Ownable
- Use VRFCoordinator to generate radom number decide the damage
- Implement ERC721 Interface
- Testing the contracts

In addition to the following Dapp topics

- Connecting a wallet (Metamask)
- Connect a frontend with a smart contract (ethers.js)
- Listen events from the contracts

## The contracts

| Contract                 | Description                                      |
|--------------------------|-----------------------------------------         |
| **RoosterBase.sol**      | Stores Attributes and States of tokens           |
| **RoosterNFT.sol**       | Stores Mint and Claim and NFT logic              | 
| **RoosterFight.sol**     | Stores helpers and inherit from NFT and Base     | 
| **Tournament.sol**       | Stores Tournament and fight logic                |

## Built with
Frontend:
- [Vue.js 3](https://v3.vuejs.org/) - The Progressive JavaScript Framework
- [ethers.js](https://docs.ethers.io/v5/) - JS library for interacting with the Ethereum Blockchain and its ecosystem

Blockchain Environment:
- [Hardhat](https://hardhat.org/) - Flexible, extensible and fast Ethereum development environment for professionals.
- [hardhat-deploy]

## Installation

### Prerequisites

| Prerequisite                                          | Version |
| ------------------------------------------------------| ------- |
| [MetaMask](https://metamask.io/)                                          |         |
| npm (comes with Node) or yarn (used)                  | `~ ^12.20.0`|
| npm (comes with Node) or yarn (used)                  | `~ ^6.14.8`  |

```shell
node -v
mongo --version
```
#### Cloning the repo

1. Open a Terminal in your projects directory 
2. Clone this repo

```shell
$ git clone https://github.com/jesusantguerrero/chainlink-hackathon.git
```

### setup
```bash
# Install NPM dependencies
npm install
# or If you like yarn
yarn install

```

copy .env.example to .env and change the API KEY:

```bash
cp .env.example .env
```

### running

```bash
# Start the local blockchain in a separate terminal
npm run contract:serve

# Deploy the contracts to the local blockchain
npm run contract:deploy

# run the frontend SPA
npm run dev
```

### testing
```
npm run contract:test
npm run contract:coverage
```

