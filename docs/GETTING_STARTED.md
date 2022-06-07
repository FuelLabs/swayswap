# Getting Started

## Requirements

This project includes Front-End and Contracts because of this we expect the current development workspace to be installed;

- [Node.js v16.15.0 or latest stable](https://nodejs.org/en/) we recommend use [nvm](https://github.com/nvm-sh/nvm) to install.
- [PNPM v7.1.7 or latest stable](https://pnpm.io/installation/)
- [Rust toolchain v0.16.0 or latest stable](https://www.rust-lang.org/tools/install)
- [Forc v0.14.5 or latest stable](https://fuellabs.github.io/sway/latest/introduction/installation.html)
- [Docker v0.8.2 or latest stable](https://docs.docker.com/get-docker/)
- [Docker Compose v2.6.0 or latest stable](https://docs.docker.com/get-docker/)

## Running project locally

### 📚 - Getting the Repository

1. Visit the [SwaySwap](https://github.com/FuelLabs/swayswap) repo and fork the project.
2. Then clone your forked copy to your local machine and get to work.

```sh
git clone https://github.com/FuelLabs/swayswap
cd swayswap
```

### 📦 - Install dependencies

```sh
pnpm install
```

### 📒 - Run Local Node

In this step, we are going to;

- launch a local `fuel-core` node;
- launch a local `faucet` API;
- Setup `swayswap-scripts`;
- Build and Deploy the `swayswap contracts`.

```sh
pnpm services:setup
```

### 💻 - Run Web App

Start the local development `front-end`. After running the command you can open on
you browser [http://localhost:3000](http://localhost:3000).

```
pnpm dev
```

### ✨ - First steps

This guided step-by-step tutorial will allow you to create your first liquidity pool and play around with the application

1. As you go trough the `Welcome page` you should have already mintrf some `ETH`, you can get more by clicking on the `faucet button`;
2. Go to [http://localhost:3000/mint](http://localhost:4000/mint) and mint some DAI by clicking `Mint tokens`;
3. Now you need to create a pool, you can navigate by clicking `pool` and `add liquidity` or access [http://localhost:3000/pool/add-liquidity](http://localhost:3000/pool/add-liquidity);
4. Set the inputs with some `ETH` and `DAI` and click `Create liquidity`.
5. 🎉🎉 You are all set! Now you can go back to the swap page or add more liquidity, have fun!

## 📗 Project overview

This section has a brief description of each directory, more details can be found inside each package, by clicking on the links.

- [packages/app](../packages/app/) Front-end SwaySwap Application
- [packages/contracts](../packages/contracts/) 🌴 Sway Contracts
- [packages/scripts](../packages/scripts/) SwaySwap scripts CLI
- [packages/test-utils](../packages/test-utils/) Test utilities for Jest
- [packages/config](../packages/config/) Build configurations
- [docker](../docker/) Network configurations

## 🧰 Useful scripts

To make life easier we added as many useful scripts as possible to our [package.json](../package.json). These are some of the most used during development:

```sh
pnpm <command name>
```

| Script           | Description                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| dev              | Run development server for the WebApp [packages/app](../packages/app/)                                               |
| contracts        | Build, Generate Types, Deploy [packages/contracts](./../packages/contracts). It should be use when editing contracts |
| contracts:build  | Build and Generate Types [packages/contracts](./../packages/contracts).                                              |
| contracts:deploy | Deploy the current binaries                                                                                          |
| scripts:setup    | Setup [swayswap-scripts](../packages/scripts/) used to build and deploy contracts and generate types                 |
| services:clean   | Stop and remove all development containers that are running locally                                                  |
| services:run     | Run the local network with `fuel-core` and the `faucet API`                                                          |
| services:setup   | Run the local network, setup `swayswap-scripts` and build&deploy contracts normally used on the first run            |

> Other scripts can be found at the [package.json](../package.json).

# Running tests

Please make sure you have follow the steps;

- [📚 - Getting the Repository](docs/GETTING_STARTED.md#---getting-the-repository)
- [📦 - Install dependencies](docs/GETTING_STARTED.md#---install-dependencies)
- [📒 - Run Local Node](docs/GETTING_STARTED.md#---run-local-node)

## Run tests

We are going to run all tests, against the node and contract configured on the `packages/app/.env` or `packages/app/.env.test` if the file exists.

```
pnpm test
```

## Run tests on a Local TEST Environment

With this command we are going to;

- launch a local `test` specific `fuel-core` node;
- launch a local `test` specific `faucet` API;
- Setup `swayswap-scripts`;
- Build and Deploy the `swayswap contracts` to the `test` node.
- Create a `packages/app/.env.test`
- Run all tests against the configs `packages/app/.env.test`
- Delete the local `test` specific `fuel-core` node;
- Delete the local `test` specific `faucet` API;
- Delete `packages/app/.env.test`

> !Note
> We don't delete `.env.test` you can delete it manually or edit

```
pnpm ci:test
```
