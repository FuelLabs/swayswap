FROM ghcr.io/fuellabs/fuel-core:v0.8.0

ARG IP=0.0.0.0
ARG PORT=4000
ARG DB_PATH=./mnt/db/

ENV IP="${IP}"
ENV PORT="${PORT}"
ENV DB_PATH="${DB_PATH}"

# Install curl to use on
# healthcheck config
RUN apt update
RUN apt install curl -y

WORKDIR /root/

COPY chainConfig.json .
COPY start.sh .

# https://stackoverflow.com/a/44671685
# https://stackoverflow.com/a/40454758
# hadolint ignore=DL3025
CMD sh ./start.sh

EXPOSE ${PORT}
