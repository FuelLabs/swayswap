#!/bin/sh

export PUBLIC_URL="/swayswap/"
export BUILD_PATH="dist"$PUBLIC_URL

# Clean dist folder
rm -rf dist

# Build folder with BASE_URL
pnpm exec tsc && pnpm exec vite build &&

# Copy to inside folder
cp $BUILD_PATH/index.html dist/404.html

# Run server and open on browser
pnpm exec http-server dist -o $PUBLIC_URL -c-1
