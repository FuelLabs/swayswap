BLACKLIST=swayswap-scripts,@swayswap/test-utils,@swayswap/config,fuels,typechain-target-fuels
pnpm -r exec updates -e $BLACKLIST -u
pnpm install
