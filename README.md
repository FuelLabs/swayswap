# ⚡️ SwaySwap

[![License](https://img.shields.io/github/license/FuelLabs/swayswap)](https://github.com/FuelLabs/swayswap)
[![Issues Open](https://img.shields.io/github/issues/FuelLabs/swayswap)](https://github.com/FuelLabs/swayswap)
[![Github Forks](https://img.shields.io/github/forks/FuelLabs/swayswap)](https://github.com/FuelLabs/swayswap)
[![Github Stars](https://img.shields.io/github/stars/FuelLabs/swayswap)](https://github.com/FuelLabs/swayswap)


## Live links

- [Latest release](https://fuellabs.github.io/swayswap)
- [Master branch](https://swayswap.vercel.app/create-wallet)

Short description

<!-- ![SwaySwap Interface](cover.png) -->

## About the Project

About the project

## Getting Started

<!-- 1. [Set up your environment](#set-up-env-variables) -->

A prerequisite for installing and using Sway is the Rust toolchain.  Platform-specific instructions can be found [here](https://www.rust-lang.org/tools/install)

Installing `fuel-core` may require installing additional system dependencies.  Instructions can be found [here](https://github.com/FuelLabs/fuel-core#building)

A prerequisite for running a fuel node is docker.  Platform-specific installation instructions can be found [here](https://docs.docker.com/get-docker/)

The Sway toolchain and Fuel Core full node can be installed with:
```
cargo install forc fuel-core
```
`forc` and `fuel-core` are built and tested against the stable Rust toolchain version 1.5.8 or later.  IF your install fails the first time, use `rustup update` and try again.

There is no guarantee that either package will work with the `nightly` Rust toolchain, so ensure you are using `stable` with:
```
rustup default stable
```

This project uses pnpm for managing packages and dependencies.  pnpm can be installed with:
```
npm install -g pnpm
```

You can install the project dependencies by running the following command in the root directory.
```
pnpm install
```

A fuel node can be run locally with:
```
docker compose up
```

Compile the Sway libraries and contracts located in the `/contracts` directory with:
```
pnpm build-contracts
```
This command also builds Sway type information for the frontend to use.  The types can be found in the `/packages/app/src/types` directory.

Deploy the swayswap exhance and token contracts to the fuel network locally with:
```
pnpm deploy-contracts
```
This command also creates a temporary wallet and sends some coins to your wallet.  Copy and paste the swayswap contract id and token contract id into the .env.example file.

For information about running the client go [here](./packages/app/README.md)

## Setup Env Variables
After installing the client dependencies in `/packages/app` the contents of `.env.example` are automatically copied to `.env`.  In `.env` we have:

VITE_FUEL_PROVIDER_URL - Link for the fuel node

VITE_CONTRACT_ID - Id (address) of the deployed swayswap contract

VITE_TOKEN_ID= Id (address) of the deployed token contract

VITE_RECAPTCHA_SITE_KEY - The site key is used to invoke recaptcha service on the website

VITE_FUEL_FAUCET_URL= Link for the fuel faucet

After deploying the swayswap and token contracts make sure to copy and paste the swayswap and token contract ids into .env before running the development server.

<!--
### Set up ENV Variables
	TO-DO: Add infos about .env on the root README.md
	https://github.com/FuelLabs/swayswap/issues/62
-->

<!--
## Contributing

TODO: https://github.com/FuelLabs/swayswap/issues/54
-->

## Project Structure
`/contracts` contains all of the Sway libraries and contracts used in this project.

`/docker` contains the files necessary to run a fuel node locally.

`/packages` contains the directories necessary to run the client.

## License

The primary license for this repo is `Apache 2.0`, see [`LICENSE`](./LICENSE).
