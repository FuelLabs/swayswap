# ViteJS Boilerplate

This project is just a simple ViteJS boilerplate ready to go.

## Stack Used

- [ViteJS](https://vitejs.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [FontSource](https://fontsource.org/)
- [Apollo GraphQL](https://www.apollographql.com/)

## Getting Started

Install all dependencies with pnpm

```bash
pnpm install
```

This command also copies the contents of .env.example in a newly created .env file, which the frontend will use to interact with your deployed contracts. Before starting the development server make sure the contract id and token id environment variables are set to the corresponding contract addresses.

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages by modifying `src/pages`. The page auto-updates as you edit the file.

## Project Structure

`/deploy-contracts` contains code to deploy the swayswap and token contracts, and create and fund a wallet.

`/public` contains publicly accessible assets.

`/scripts` contains shell scripts for building and deploying Sway contracts.

`/src` contains frontend code (assets, components, hooks, etc).
