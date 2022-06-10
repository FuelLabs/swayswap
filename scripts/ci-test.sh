#!/bin/bash

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
if [ "$1" == "--coverage" ]; then
    pnpm test:coverage
    TEST_RESULT=$?
else
    pnpm test
    TEST_RESULT=$?
fi

# Run cleanup
pnpm services:clean-test

# After run the tests delete .env.test
# If it was created
if [ $TEST_CREATED == 1 ]; then
    rm $APP_TEST_ENV
fi

exit $TEST_RESULT