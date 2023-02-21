/* eslint-disable no-empty-pattern */
// Use a test fixture to set the context so tests have access to the wallet extension.
import type { BrowserContext } from '@playwright/test';
import { chromium, test as base } from '@playwright/test';
import admZip from 'adm-zip';
import * as fs from 'fs';
import { request } from 'https';
import path from 'path';

const pathToExtension = path.join(__dirname, './dist-crx');

export const test = base.extend<{
  extensionId: string;
}>({
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

let context: BrowserContext;

test.beforeAll(async () => {
  const extensionUrl = 'https://wallet.fuel.network/app/fuel-wallet.zip';

  const zipFile = 'fuel-wallet.zip';
  const zipFileStream = fs.createWriteStream(zipFile);
  request(extensionUrl, (res) => {
    res.pipe(zipFileStream);
    // after download completed close filestream
    zipFileStream.on('finish', () => {
      zipFileStream.close();
      console.log('Download Completed');
    });
    // const zip = new admZip(zipFile);
    // zip.extractAllTo('dist-crx', true);
  }).on('error', (error) => {
    console.log('error: ', error);
  });

  context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension},`,
    ],
  });
});

test.use({
  context: ({}, use) => {
    use(context);
  },
});

export const expect = test.expect;
