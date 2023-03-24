FROM ghcr.io/fuellabs/fuel-core:v0.17.3

ARG IP=0.0.0.0
ARG PORT=4000
ARG DB_PATH=./mnt/db/

ENV IP="${IP}"
ENV PORT="${PORT}"
ENV DB_PATH="${DB_PATH}"
ENV MIN_GAS_PRICE="${MIN_GAS_PRICE}"
ENV CONSENSUS_KEY="${CONSENSUS_KEY}"

# Install curl to use on
# healthcheck config
RUN apt update
RUN apt install curl -y

WORKDIR /root/

COPY chainConfig.json .

CMD exec ./fuel-core run \
    --ip ${IP} \
    --port ${PORT} \
    --db-path ${DB_PATH} \
    --min-gas-price ${MIN_GAS_PRICE} \
    --vm-backtrace \
    --poa-instant=true \
    --consensus-key ${CONSENSUS_KEY} \
    --utxo-validation \
    --chain ./chainConfig.json

EXPOSE ${PORT}
