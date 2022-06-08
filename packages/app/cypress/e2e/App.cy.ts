describe('App flow', () => {
  it('valida whole app flow', async () => {
    cy.visit('http://localhost:3000');

    // create a wallet and fund it
    cy.contains('button', 'Create wallet').click();
    cy.contains('button', 'Give me ETH').click();
    cy.contains('button', 'Go to Swap').click();
    cy.contains('Enter amount');

    // mint tokens
    cy.visit('http://localhost:3000/mint');
    cy.contains('button', 'Mint tokens').click();
    cy.contains('Token received successfully!');
    // wait to be redirected to swap page after minting
    cy.contains('Enter amount');

    // go to pool page -> add liquidity page
    cy.contains('button', 'Pool').click();
    cy.contains('You do not have any open positions');
    cy.contains('button', 'Add Liquidity').click();

    const creatingPoolSelector = '[aria-label="create-pool"]';
    const addingLiquiditySelector = '[aria-label="pool-reserves"]';

    // check if is 'creating a pool' or 'adding liquidity'
    cy.get('body')
      .then(($body) => {
        if ($body.find(creatingPoolSelector).length) return creatingPoolSelector;
        if ($body.find(addingLiquiditySelector).length) return addingLiquiditySelector;
      })
      .then((selector) => {
        const hasPoolCreated = selector === addingLiquiditySelector;

        if (hasPoolCreated) {
          // validate add liquidity
          cy.contains('Enter Ether amount');
          cy.get('[aria-label="Coin From Input"]').type('0.2');

          // make sure preview output box shows up
          cy.get('[aria-label="preview-add-liquidity-output"]');

          // make sure pool price box shows up
          cy.get('[aria-label="pool-price"]');
          cy.contains('button', 'Add liquidity').click();
        } else {
          // validate create pool
          cy.contains('Enter Ether amount');
          cy.get('[aria-label="Coin From Input"]').type('0.2');
          cy.get('[aria-label="Coin To Input"]').type('190');

          // make sure preview output box shows up
          cy.get('[aria-label="preview-add-liquidity-output"]');

          // make sure pool price box shows up
          cy.get('[aria-label="pool-price"]');
          cy.contains('button', 'Create liquidity').click();
        }

        // make sure liquidity worked
        cy.contains('ETH/DAI');

        // validate swap
        cy.contains('button', 'Swap').click();
        cy.contains('Enter amount');
        cy.get('[aria-label="Coin From Input"]').type('0.1');
        // make sure preview output box shows up
        cy.get('[aria-label="preview-swap-output"]');

        // make sure "swap" button comes from inside swap page only
        cy.contains('[aria-label="swap-submit-button"]', 'Swap').click();
        cy.contains('Swap made successfully!');

        //validate remove liquidity
        cy.contains('button', 'Pool').click();
        cy.contains('button', 'Remove liquidity').click();
        cy.get('.coinSelector--maxButton').click();
        // make sure preview output box shows up
        cy.get('[aria-label="preview-remove-liquidity-output"]');
        // make sure current positions box shows up
        cy.get('[aria-label="pool-current-position"]');
        cy.contains('button', 'Remove liquidity').click();
        cy.contains('Liquidity removed successfully!');
      });
  });
});
