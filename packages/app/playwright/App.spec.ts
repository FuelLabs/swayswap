import '../load.envs';
import type { BrowserContext } from '@playwright/test';
import { sleep } from 'fuels';

import { test, expect } from './fixtures';

const MNEMONIC = 'demand fashion unaware upgrade upon heart bright august panel kangaroo want gaze';
const WALLET_PASSWORD = '$123Ran123Dom123!';
const ACCOUNT1 = 'Account 1';

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

  const nextButton = signupPage.locator('button').getByText('Next');
  await nextButton.click();

  // Enter password
  const enterPassword = signupPage.locator(`[aria-label="Your Password"]`);
  await enterPassword.type(WALLET_PASSWORD);
  // Confirm password
  const confirmPassword = signupPage.locator(`[aria-label="Confirm Password"]`);
  await confirmPassword.type(WALLET_PASSWORD);

  // This is needed to dismiss the password security popup
  await signupPage.click('body');

  // Agree to T&S
  await signupPage.getByRole('checkbox').check();
  expect(signupPage.getByRole('checkbox')).toBeChecked();
  await signupPage.locator('button').getByText('Next').click();
  expect(signupPage.getByText('Wallet created successfully'))
    .toBeVisible()
    .then(async () => {
      // Navigate to add network and add test network
      await walletPage.goto(`chrome-extension://${extensionId}/popup.html#/networks/add`);
      await walletPage.reload({ waitUntil: 'load' });
      await walletPage.locator('[aria-label="Network name"]').fill('test');
      await walletPage
        .locator('[aria-label="Network URL"]')
        .fill(process.env.VITE_FUEL_PROVIDER_URL!);
      await walletPage.locator('button', { hasText: 'Create' }).click();
    });

  return { appPage, walletPage };
}

async function walletApprove(context: BrowserContext) {
  let approvePage = context.pages().find((p) => p.url().includes('/request/transaction'));
  if (!approvePage) {
    approvePage = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('/request/transaction'),
    });
  }

  const approveButton = approvePage.locator('button').getByText('Confirm');
  await approveButton.click({ timeout: 15000 });
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
  test('e2e', async ({ context }) => {
    const { appPage } = getPages(context);

    await appPage.goto('/');

    await appPage.locator('button', { hasText: 'Launch app' }).first().click();

    await appPage.locator('[aria-label="Accept the use agreement"]').check();
    const connectPagePromise = context.waitForEvent('page');
    await appPage.locator('button', { hasText: 'Get Swapping!' }).click();

    await appPage.reload();

    // Expect to be taken to swap pages
    expect(appPage.getByText('Select to token')).toBeTruthy();

    // Connect to wallet
    const connectPage = await connectPagePromise;
    await connectPage.waitForLoadState();

    let nextButton = connectPage.locator('button').getByText('Next');
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

    // mint tokens
    await appPage.goto('/mint');
    await appPage.locator('button', { hasText: 'Mint tokens' }).click();

    await walletApprove(context);

    const mintSuccess = appPage.getByText('Token received successfully!');
    await mintSuccess.waitFor();

    // wait to be redirected to swap page after minting
    expect(appPage.getByText('Select to token')).toBeTruthy();

    // go to pool page -> add liquidity page
    await appPage.locator('button').getByText('Pool').click();
    expect(appPage.getByText('You do not have any open positions')).toBeVisible({ timeout: 15000 });
    await appPage.locator('button', { hasText: 'Add Liquidity' }).click();

    const addingLiquiditySelector = '[aria-label="pool-reserves"]';

    const hasPoolBeenCreated = await appPage.locator(addingLiquiditySelector).isVisible();

    if (hasPoolBeenCreated) {
      expect(appPage.getByText('Enter Ether amount')).toBeVisible();
      await appPage.locator('[aria-label="Coin from input"]').fill('0.2');
      expect(appPage.locator('[aria-label="Preview Add Liquidity Output"]')).toBeVisible();
      expect(appPage.locator('[aria-label="Pool Price Box"]')).toBeVisible();
      await appPage.locator('[aria-label="Add liquidity"]').click();
    } else {
      expect(appPage.getByText('Enter Ether amount')).toBeVisible({ timeout: 15000 });
      await appPage.locator('[aria-label="Coin from input"]').fill('0.2');
      await appPage.locator('[aria-label="Coin to input"]').fill('190');
      expect(appPage.locator('[aria-label="Preview Add Liquidity Output"]')).toBeVisible();
      expect(appPage.locator('[aria-label="Pool Price Box"]')).toBeVisible();
      expect(appPage.locator('[aria-label="Create liquidity"]')).toBeEnabled({ timeout: 30000 });
      await appPage.locator('button').getByText('Create liquidity').click();
    }

    await walletApprove(context);

    expect(appPage.getByText('ETH/DAI')).toBeVisible({ timeout: 15000 });

    // validate swap
    await appPage.locator('button', { hasText: 'Swap' }).click();
    expect(appPage.getByText('Select to token')).toBeVisible({ timeout: 15000 });
    await appPage.locator('[aria-label="Coin selector to"]').click();
    await appPage.locator('li').first().click();
    await appPage.locator('[aria-label="Coin from input"]').fill('0.1');

    expect(appPage.locator('[aria-label="Preview Value Loading"]').first()).toBeVisible({
      timeout: 15000,
    });
    expect(appPage.locator('[aria-label="Preview Swap Output"]').first()).toBeVisible({
      timeout: 15000,
    });

    await appPage.locator('[aria-label="Swap button"]').click();
    await walletApprove(context);
    const swapSuccess = appPage.getByText('Swap made successfully!');
    await swapSuccess.waitFor({ timeout: 15000 });

    // validate that a comma can be used as a decimal separator
    await appPage.locator('[aria-label="Coin from input"]').fill('0,2');
    expect(appPage.locator('[aria-label="Coin from input"]')).toHaveValue('02');

    // validate remove liquidity
    await appPage.locator('button', { hasText: 'Pool' }).click();
    await appPage.locator('button', { hasText: 'Remove liquidity' }).click();
    await appPage.locator('[aria-label="Set Maximum Balance"]').click();

    // make sure preview output box show up
    expect(appPage.locator('[aria-label="Preview Remove Liquidity Output"]')).toBeVisible();

    // make sure current positions box show up
    expect(appPage.locator('[aria-label="Pool Current Position"]')).toBeVisible();
    await appPage.locator('button', { hasText: 'Remove liquidity' }).click();
    await walletApprove(context);
    const liquidityRemovedSuccess = appPage.getByText('Liquidity removed successfully');
    await liquidityRemovedSuccess.waitFor({ timeout: 15000 });
  });
});
