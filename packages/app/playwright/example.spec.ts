import '../load.envs';
import type { BrowserContext, Page } from '@playwright/test';

import { test, expect } from './fixtures';

const MNEMONIC = 'demand fashion unaware upgrade upon heart bright august panel kangaroo want gaze';
const WALLET_PASSWORD = '123123123';
const ACCOUNT1 = 'Account 1';
const ACCOUNT2 = 'Account 2';

async function walletSetup(context: BrowserContext, extensionId: string) {
  const appPage = await context.newPage();

  await appPage.goto('/');

  const hasFuel = await appPage.evaluate(() => {
    return typeof window.fuel === 'object';
  });
  expect(hasFuel).toBeTruthy();

  // WALLET SETUP
  const walletPage = await context.newPage();
  await walletPage.goto(`chrome-extension://${extensionId}/popup.html`);
  const signupPage = await context.waitForEvent('page', {
    predicate: (page) => page.url().includes('sign-up'),
  });

  expect(signupPage.url()).toContain('sign-up');

  const button = signupPage.locator('button').getByText('I already have a wallet');
  await button.click();

  /** Copy words to clipboard area */
  await signupPage.evaluate(`navigator.clipboard.writeText('${MNEMONIC}')`);

  const pasteButton = signupPage.locator('button').getByText('Paste');
  await pasteButton.click();

  let nextButton = signupPage.locator('button').getByText('Next');
  await nextButton.click();

  // Enter password
  const enterPassword = signupPage.locator(`[aria-label="Your Password"]`);
  await enterPassword.type(WALLET_PASSWORD);
  // Confirm password
  const confirmPassword = signupPage.locator(`[aria-label="Confirm Password"]`);
  await confirmPassword.type(WALLET_PASSWORD);
  // Agree to T&S
  await signupPage.getByRole('checkbox').click();
  await signupPage.locator('button').getByText('Next').click();
  await signupPage.waitForSelector('text=Wallet created successfully');

  const connectPagePromise = context.waitForEvent('page');

  // Go back to app page and connect wallet
  await appPage.goto('/');

  // Connect to wallets
  const connectPage = await connectPagePromise;
  await connectPage.waitForLoadState();

  nextButton = connectPage.locator('button').getByText('Next');
  await nextButton.click();

  const changeButton = connectPage.locator('button').getByText('Change');
  await changeButton.click();

  const activateAccount1Card = connectPage.locator(`[aria-label="${ACCOUNT1}"]`);
  const switchButton = activateAccount1Card.getByRole('switch');
  await switchButton.click();

  nextButton = connectPage.locator('button').getByText('Next');
  await nextButton.click();

  const connectButton = connectPage.locator('button').getByText('Connect');
  await connectButton.click();

  return { appPage, walletPage };
}

async function walletApprove(context: BrowserContext) {
  let approvePage = context.pages().find((p) => p.url().includes('/request/transaction'));
  if (!approvePage) {
    approvePage = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('/request/transaction'),
    });
  }

  await approvePage.waitForSelector('text=Confirm');
  const approveButton = approvePage.locator('button').getByText('Confirm');
  await approveButton.click();

  const enterPasswordInput = approvePage.locator(`[aria-label="Your Password"]`);
  await enterPasswordInput.waitFor();
  await enterPasswordInput.fill(WALLET_PASSWORD);
  const confirmButton = approvePage.locator('button').getByText('Confirm Transaction');
  await confirmButton.waitFor();
  await confirmButton.click();
}

// async function addWallet(walletPage: Page, extensionId: string, accountName: string) {
//   await walletPage.goto(`chrome-extension://${extensionId}/popup.html`);

//   await walletPage.waitForSelector('[aria-label="Accounts"]');

//   // First we have to add a second account
//   const accountsButton = walletPage.locator('[aria-label="Accounts"]');
//   await accountsButton.click();

//   const addAccountButton = walletPage.locator('[aria-label="Add account"]');
//   await addAccountButton.click();

//   const accountNameInput = walletPage.locator('[aria-label="Account Name"]');
//   await accountNameInput.fill(accountName);

//   const accountFormSubmitButton = walletPage.locator('button').getByText('Create');
//   await accountFormSubmitButton.click();

//   const passwordInput = walletPage.locator('[aria-label="Your Password"]');
//   await passwordInput.fill(WALLET_PASSWORD);

//   const accountConfirmButton = walletPage.locator('button').getByText('Add Account');
//   await accountConfirmButton.click();

//   await walletPage.waitForSelector('img', { timeout: 10000 });
// }

async function switchWallet(walletPage: Page, extensionId: string, accountName: string) {
  // Switch to ACCOUNT1
  await walletPage.goto(`chrome-extension://${extensionId}/popup.html`);
  await walletPage.waitForSelector('[aria-label="Accounts"]');
  const accountsButton = walletPage.locator('[aria-label="Accounts"]');
  await accountsButton.click();
  const accountButton = walletPage.locator(`[aria-label="${accountName}"]`);
  await accountButton.waitFor();
  await accountButton.click();
}

function getPages(context: BrowserContext) {
  const pages = context.pages();
  const [walletPage] = pages.filter((page) => page.url().includes('popup'));
  const [appPage] = pages.filter((page) => page.url().includes('localhost'));
  return { appPage, walletPage };
}

test.beforeAll(async ({ context, extensionId }) => {
  await walletSetup(context, extensionId);
});

test.describe('End-to-end Test: 😁 Happy Path', () => {
  test('e2e', async ({ context, extensionId }) => {
    const { appPage, walletPage } = getPages(context);

    await appPage.goto('/');

    await appPage.locator('button', { hasText: 'Launch app' }).click();

    await appPage.locator('[aria-label="Accept the use agreement"').check();
    await appPage.locator('button', { hasText: 'Get Swapping!' }).click();
    expect(appPage.getByText('Select to token')).toBeTruthy();

    // mint tokens
    await appPage.goto('/mint');
    await appPage.locator('button', { hasText: 'Mint tokens' }).click();
    // wait to be redirected to swap page after minting
    expect(appPage.getByText('Select to token')).toBeTruthy();

    // go to pool page -> add liquidity page
    await appPage.locator('button', { hasText: 'Pool' }).click();
    expect(appPage.getByText('You do not have any open positions')).toBeTruthy();
    await appPage.locator('button', { hasText: 'Add Liquidity' }).click();

    await walletApprove(context);
  });
});
