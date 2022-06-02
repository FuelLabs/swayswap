#!/bin/bash

set -o errexit # abort on nonzero exitstatus
set -o nounset # abort on unbound variable

PLATFORM=""
get_architecture() {
    local _ostype _cputype
    _ostype="$(uname -s)"
    _arch="$(uname -m)"

    case "$_ostype" in
    Linux)
        _ostype="linux"
        ;;
    Darwin)
        _ostype="darwin"
        ;;
    *)
        err "unsupported os type: $_ostype"
        ;;
    esac

    case "$_arch" in
        x86_64 | x86-64 | x64 | amd64)
            _arch="amd64"
            ;;
        aarch64 | arm64)
            _arch="arm64"
            ;;
        *)
            err "unsupported cpu type: $_cputype"
            ;;
    esac

    PLATFORM="${_ostype}_${_arch}"
}

# Populate RETVAL
get_architecture
echo "$PLATFORM"
echo "Download forc"
curl -sL https://github.com/FuelLabs/sway/releases/download/v0.14.5/forc-binaries-$PLATFORM.tar.gz | 7z zx
forc-binaries/forc --version
