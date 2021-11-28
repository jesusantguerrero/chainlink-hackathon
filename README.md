<p align="center">
<a href="https://rooster-fight.vercel.app/" target="_blank">
<img src="https://raw.githubusercontent.com/jesusantguerrero/chainlink-hackathon/master/app/src/assets/logo.svg" width="400">
</a></p>


[![codecov](https://codecov.io/gh/jesusantguerrero/chainlink-hackathon/branch/master/graph/badge.svg?token=Y153S4JEZL)](https://codecov.io/gh/jesusantguerrero/chainlink-hackathon) 


## Overview of RoosterFight
RoosterFight is a NFT game where you can claim and train a Rooster to fight and reach the top of the tournaments.

## Inspiration
I took inspiration from zed.run a virtual horse race game and a tradition of my country cockfight to bring a virtual game where users can have a like experience of raise and train a nice looking rooster and compete with others.

## Live demo
[Live in testnet](https://rooster-fight.vercel.app/)

network: [Polygon Mumbai](https://docs.polygon.technology/docs/develop/network-details/network/)


## What is does
### User Stories
- User Story: I can connect my wallet using metamask/Moralis.

- User Story: I can claim Roosters for free.

- User Story: I can participate in tournaments.

- User Story: I can fight with others roosters to win points.

- User Story: I can win if at the end of the tourmament I have more points.

## Technical Details
on the frontend i used: 
- [Vue.js 3](https://v3.vuejs.org/) as framework Framework
- [Moralis](https://moralis.io/) to manage auth and store some off-chain data as well as IPFS provider for the assets
- [ethers.js](https://docs.ethers.io/v5/) JS library for interacting with the Ethereum Blockchain and its ecosystem

Blockchain Environment:
- [Hardhat](https://hardhat.org/) - Flexible, extensible and fast Ethereum development environment for professionals.
- [hardhat-deploy]() - Provided utilities for deployments and tasks
- [Chainlink VRF]() - To get random numbers to generate damage
- [Open Zepplin]() - and their contracts and utilities forn ERC721, String, SafeMath, Counters, Ownable and not reentrancy guard
- [hashlip nft engine]() - to generate arts

### The contracts

| Contract                 | Description                                      |
|--------------------------|-----------------------------------------         |
| **RoosterBase.sol**      | Stores Attributes and Stats of tokens            |
| **RoosterNFT.sol**       | Stores Mint and Claim and NFT logic              | 
| **RoosterFight.sol**     | Stores helpers for gaming mechanics and inherit from NFT and Base | 
| **TournamentBase.sol**   | Stores tournaments (prixes) and events (Prix edition) logic |
| **Tournament.sol**       | Stores tournament matches and inherit from **TournamentBase.sol**|

## Installation

### Prerequisites

| Prerequisite                                          | Version |
| ------------------------------------------------------| ------- |
| [MetaMask](https://metamask.io/)                      |         |
| [Moralis](https://moralis.io/)                        |         |
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

