#!/bin/sh

# Import env variables
source .env;
# Foward REACT_APP_FUEL_PROVIDER_URL to the deploy execution
REACT_APP_FUEL_PROVIDER_URL=$REACT_APP_FUEL_PROVIDER_URL npx ts-node deploy-contracts
