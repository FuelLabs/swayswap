#!/bin/sh

# Import env variables
source .env;
# Import wallet secret from docker/fuel-core/.env.docker
source ../../docker/fuel-core/.env.docker;

# Foward VITE_FUEL_PROVIDER_URL to the deploy execution
export VITE_FUEL_PROVIDER_URL=$VITE_FUEL_PROVIDER_URL;
# Export as genesis secret for TestUtils from fuels-ts SDK
export GENESIS_SECRET=$WALLET_SECRET_KEY;
# Run deploy contracts
npx ts-node deploy-contracts
