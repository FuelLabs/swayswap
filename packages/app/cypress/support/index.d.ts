/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Get element by aria-label
     * @example
     * cy.getByAriaLabel('Aria Label');
     * cy.getByAriaLabel('Aria Label', { log: false, timeout: 6000 });
     */
    getByAriaLabel(
      ariaLabel: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Chainable<JQuery<E>>;
  }
}
