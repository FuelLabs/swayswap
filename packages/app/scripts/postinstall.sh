#!/bin/sh

FILE=.env
if [ ! -f "$FILE" ]; then
    cp .env.example .env
fi
