describe('End-to-end Test: 😁 Happy Path', () => {
  it('should execute whole app basic flow', () => {
    cy.visit('/');

    cy.contains('button', /Launch app/i).click();

    // create a wallet and fund it
    cy.contains('button', /Create wallet/i).click();
    cy.contains('button', 'Give me ETH').click();
    cy.getByAriaLabel('Accept the use agreement').check();
    cy.contains('button', 'Get Swapping!').click();
    cy.contains('Select to token');

    // mint tokens
    cy.visit('/mint');
    cy.contains('button', 'Mint tokens').click();
    cy.contains('Token received successfully!');
    // wait to be redirected to swap page after minting
    cy.contains('Select to token');

    // go to pool page -> add liquidity page
    cy.contains('button', 'Pool').click();
    cy.contains('You do not have any open positions');
    cy.contains('button', 'Add Liquidity').click();

    const creatingPoolSelector = '[aria-label="create-pool"]';
    const addingLiquiditySelector = '[aria-label="pool-reserves"]';

    // This functions query the selector for creating a conditional
    // test flow, this is needed in order to enable tests to in already
    // initialized pool like local development
    async function getPoolSelector(
      $body: JQuery<HTMLBodyElement>,
      counter: number = 0
    ): Promise<string> {
      if (counter > 20) {
        throw new Error('Not found pool or add liquidity flow');
      }
      await new Promise((resolve) => {
        setTimeout(() => resolve(null), 200);
      });
      if ($body.find(creatingPoolSelector).length) return creatingPoolSelector;
      if ($body.find(addingLiquiditySelector).length) return addingLiquiditySelector;
      return getPoolSelector($body, counter + 1);
    }

    // check if is 'creating a pool' or 'adding liquidity'
    cy.get('body')
      .then(($body) => getPoolSelector($body))
      .then((selector: string) => {
        if (!selector) {
          // should break test
          cy.contains(creatingPoolSelector);
        }

        const hasPoolCreated = selector === addingLiquiditySelector;

        if (hasPoolCreated) {
          // validate add liquidity
          cy.contains('Enter Ether amount');
          cy.getByAriaLabel('Coin from input').type('0.2');

          // make sure preview output box shows up
          cy.getByAriaLabel('Preview Add Liquidity Output');

          // make sure pool price box shows up
          cy.getByAriaLabel('Pool Price Box');
          cy.getByAriaLabel('Add liquidity').click();
        } else {
          // validate create pool
          cy.contains('Enter Ether amount');
          cy.getByAriaLabel('Coin from input').type('0.2');
          cy.getByAriaLabel('Coin to input').type('190');
          // make sure preview output box shows up
          cy.getByAriaLabel('Preview Add Liquidity Output');
          // make sure pool price box shows up
          cy.getByAriaLabel('Pool Price Box');
          cy.contains('button', 'Create liquidity').click();
        }

        // make sure liquidity worked
        cy.contains('ETH/DAI');

        // validate swap
        cy.contains('button', 'Swap').click();
        cy.contains('Select to token');
        cy.getByAriaLabel('Coin selector to').click();
        cy.get('[role=menu').type('{enter}');
        cy.getByAriaLabel('Coin from input').type('0.1');

        // make sure loading preview output box shows up
        cy.getByAriaLabel('Preview Value Loading');
        // make sure preview output box shows up
        cy.getByAriaLabel('Preview Swap Output');

        // execute swap operation
        cy.getByAriaLabel('Swap button').click();
        cy.contains('Swap made successfully!');

        // validate that comma can be used as decimal separator
        cy.getByAriaLabel('Coin from input').type('0,2');
        cy.getByAriaLabel('Coin from input')
          .get('input')
          .should(($input) => {
            const val = $input.val();
            expect(val).to.equal('0.2');
          });

        // validate remove liquidity
        cy.contains('button', 'Pool').click();
        cy.contains('button', 'Remove liquidity').click();
        cy.getByAriaLabel('Set Maximum Balance').click();

        // make sure preview output box shows up
        cy.getByAriaLabel('Preview Remove Liquidity Output');

        // make sure current positions box shows up
        cy.getByAriaLabel('Pool Current Position');
        cy.contains('button', 'Remove liquidity').click();
        cy.contains('Liquidity removed successfully!');
      });
  });
});
