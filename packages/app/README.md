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

> ⚠️ If is your first time running the project you should start on [here](../../docs/GETTING_STARTED.md)

Install all dependencies with `pnpm`:

```sh
pnpm install
```

This command also copies the contents of `.env.example` in a newly created `.env` file, which the frontend will use to interact with your deployed contracts. Before starting the development server make sure the contract id and token id environment variables are set to the corresponding contract addresses.

Then, run the development server:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages by modifying `src/pages`. The page auto-updates as you edit the file.

## Project Structure

- [/public](./public/) contains publicly accessible assets;
- [/src](./src/) contains frontend code (assets, components, hooks, etc).

### Environment variables

| name                      | description                                                                   |
| ------------------------- | ----------------------------------------------------------------------------- |
| VITE_FUEL_PROVIDER_URL    | Fuel-core network url normally set as `http://localhost:4000` for development |
| VITE_FUEL_FAUCET_URL      | Faucet API url normally set as `http://localhost:4040` for development        |
| VITE_FAUCET_RECAPTCHA_KEY | Recaptcha key used only on live environment                                   |
| VITE_CONTRACT_ID          | Exchange contract id this is automatically set by the `swayswap-scripts`      |
| VITE_TOKEN_ID             | Token contract id this is automatically set by the `swayswap-scripts`         |
