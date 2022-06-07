#!/bin/sh

# Env file
APP_TEST_ENV=./packages/app/.env.test
TEST_CREATED=0

function env_template {
    echo "VITE_FUEL_PROVIDER_URL=http://localhost:$1/graphql" > $3
    echo "VITE_FUEL_FAUCET_URL=http://localhost:$2/dispense" >> $3
    echo "VITE_CONTRACT_ID=0x0000000000000000000000000000000000000000000000000000000000000000" >> $3
    echo "VITE_TOKEN_ID=0x0000000000000000000000000000000000000000000000000000000000000000" >> $3
}

# If packages/app/.env.test not exists
# create it
if [ ! -f "$APP_TEST_ENV" ]; then
    env_template 4001 4041 $APP_TEST_ENV
    TEST_CREATED=1
fi

# Run setup
NODE_ENV=test
pnpm services:setup-test

echo $1

# Run test
if [ "$1" == "--coverage" ]; then
    pnpm test:coverage
else
    pnpm test
fi

# Run cleanup
pnpm services:clean-test

# After run the tests delete .env.test
# If it was created
if [  $TEST_CREATED == 1 ]; then
    rm $APP_TEST_ENV
fi