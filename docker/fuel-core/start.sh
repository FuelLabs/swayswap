#!/bin/sh

if [ "$UTXO_VALIDATION" = true ] ; then
    echo "Starting fuel-core with utxo validation";
    exec ./fuel-core --ip ${IP} --port ${PORT} --db-path ${DB_PATH} --utxo-validation --chain ./chainConfig.json
else
    echo "Starting fuel-core";
    exec ./fuel-core --ip ${IP} --port ${PORT} --db-path ${DB_PATH} --chain ./chainConfig.json
fi 
