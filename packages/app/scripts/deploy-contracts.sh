#!/bin/sh

# Import env variables
source .env;
# Foward VITE_FUEL_PROVIDER_URL to the deploy execution
VITE_FUEL_PROVIDER_URL=$VITE_FUEL_PROVIDER_URL npx ts-node deploy-contracts
