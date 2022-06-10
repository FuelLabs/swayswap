#!/bin/sh

# Load env_template
APP_TEST_ENV=./packages/app/.env.test
TEST_CREATED=0

# If packages/app/.env.test not exists
# create it
if [ ! -f "$APP_TEST_ENV" ]; then
    echo "Create $APP_TEST_ENV";
    ./scripts/create-test-env.sh 4001 4041 $APP_TEST_ENV;
    TEST_CREATED=1;
fi

# Run setup
NODE_ENV=test
pnpm services:setup-test

echo $1

# Run test
if [ "$1" = "--coverage" ]; then
    pnpm test:coverage
elif [ "$1" = "--e2e" ]; then
    NODE_ENV=test pnpm cy:run
    # NODE_ENV=test pnpm test:e2e
else
    pnpm test
fi

# Run cleanup
pnpm services:clean-test

# After run the tests delete .env.test
# If it was created
if [ $TEST_CREATED == 1 ]; then
    rm $APP_TEST_ENV
fi