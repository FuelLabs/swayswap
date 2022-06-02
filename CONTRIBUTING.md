# Contributing To SwaySwap

Thanks for your interest in contributing to SwaySwap! This document outlines the process for installing dependencies and setting up SwaySwap for development, as well as some conventions on contributing to SwaySwap.

If you run into any difficulties getting started, you can always ask questions on our [Discord](https://discord.gg/xfpK4Pe).

## Setting Up a Development Workspace

A prerequisite for installing and using Sway is the Rust toolchain. Platform-specific instructions can be found [here](https://www.rust-lang.org/tools/install)

Installing `fuel-core` may require installing additional system dependencies. Instructions can be found [here](https://github.com/FuelLabs/fuel-core#building)

A prerequisite for running a Fuel node is Docker. Platform-specific installation instructions can be found [here](https://docs.docker.com/get-docker/)

The Sway toolchain and Fuel Core full node can be installed with:

```sh
cargo install forc fuel-core
```

`forc` and `fuel-core` are built and tested against the stable Rust toolchain version `1.5.8` or later. If your install fails the first time, use `rustup update` and try again.

There is no guarantee that either package will work with the `nightly` Rust toolchain, so ensure you are using `stable` with:

```sh
rustup default stable
```

This project uses `pnpm` for managing packages and dependencies. `pnpm` can be installed with:

```sh
npm install -g pnpm
```

You can install the project dependencies by running the following command in the root directory.

```sh
pnpm install
```

A Fuel and Faucet node can be run locally with:

```sh
pnpm services:run
```

Compile the Sway libraries and contracts located in the `/contracts` directory with:

```sh
pnpm contracts:build
```

This command also builds Sway type information for the frontend to use. The types can be found in the `/packages/app/src/types` directory.

Deploy the SwaySwap exchange and token contracts to the Fuel Network locally with:

```sh
pnpm contracts:deploy
```

You can also deploy using a wallet secret;

```sh
WALLET_SECRET=0x0...000 pnpm contracts:deploy
```

This command also creates a temporary wallet and sends some coins to your wallet. Copy and paste the SwaySwap contract ID and token contract ID into the `.env.example` file.

## Setup Env Variables

After installing the client dependencies in `/packages/app` the contents of `.env.example` are automatically copied to `.env`. In `.env` we have:

- `VITE_FUEL_PROVIDER_URL` - Link for the fuel node

- `VITE_FUEL_FAUCET_URL=` - Link for the fuel faucet

- `VITE_RECAPTCHA_KEY` - The site key is used to invoke recaptcha service on the website

- `VITE_CONTRACT_ID` - Id (address) of the deployed swayswap contract

- `VITE_TOKEN_ID=` - Id (address) of the deployed token contract

Before starting the development server make sure the contract ID and token ID environment variables are set to the corresponding contract addresses.

## Getting the Repository

1. Visit the [SwaySwap](https://github.com/FuelLabs/swayswap) repo and fork the project.
2. Then clone your forked copy to your local machine and get to work.

```sh
git clone https://github.com/FuelLabs/swayswap
cd swayswap
```

## Running the Client

For instructions on running and viewing the app in your browser, see the [app/README](./packages/app/README.md).

Congratulations! You've now got everything setup and are ready to start making contributions.

## Finding Something to Work On

There are many ways in which you may contribute to the SwaySwap project, some of which involve coding knowledge and some which do not. A few examples include:

- Reporting bugs
- Adding new features or bugfixes for which there is already an open issue
- Making feature requests

Check out our [Help Wanted](https://github.com/FuelLabs/swayswap/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) or [Good First Issues](https://github.com/FuelLabs/swayswap/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to find a suitable task.

If you are planning something big, for example, related to multiple components or changes current behaviors, make sure to [open an issue](https://github.com/FuelLabs/swayswap/issues/new) to discuss with us before starting on the implementation.

## Contribution Flow

This is a rough outline of what a contributor's workflow looks like:

- Make sure what you want to contribute is already tracked as an issue.
  - We may discuss the problem and solution in the issue.
- Create a Git branch from where you want to base your work. This is usually master.
- Write code, add test cases where applicable, and commit your work.
- Run tests and make sure all tests pass.
- If the PR contains any breaking changes, add the `breaking` label to your PR.
- Push your changes to a branch in your fork of the repository and submit a pull request.
  - Use one of the following tags in the title of your PR:
    - `feat:` - A new feature
    - `fix:` - A bug fix
    - `docs:` - Documentation only changes
    - `style:` - Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
    - `refactor:` - A code change that neither fixes a bug nor adds a feature
    - `perf:` - A code change that improves performance
    - `test:` - Adding missing tests or correcting existing tests
    - `build:` - Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
    - `ci:` - Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
    - `chore:` - Other changes that don't modify src or test files
    - `revert:` - Reverts a previous commit
  - Make sure to mention the issue, which is created at step 1, in the commit message.
- Your PR will be reviewed and some changes may be requested.
  - Once you've made changes, your PR must be re-reviewed and approved.
  - If the PR becomes out of date, you can use GitHub's 'update branch' button.
  - If there are conflicts, you can merge and resolve them locally. Then push to your PR branch.
    Any changes to the branch will require a re-review.
- Our CI system (Github Actions) automatically tests all authorized pull requests.
- Use Github to merge the PR once approved.

Thanks for your contributions!

### Linking Issues

Pull requests should be linked to at least one issue in the same repo.

If the pull request resolves the relevant issues, and you want GitHub to close these issues automatically after it merged into the default branch, you can use the syntax (`KEYWORD #ISSUE-NUMBER`) like this:

```
close #123
```

If the pull request links an issue but does not close it, you can use the keyword `ref` like this:

```
ref #456
```

Multiple issues should use full syntax for each issue and separate by a comma, like:

```
close #123, ref #456
```
