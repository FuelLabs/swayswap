/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Get element by aria-label
     * @example
     * cy.getByAriaLabel('Aria Label');
     * cy.getByAriaLabel('Aria Label', { log: false, timeout: 6000 });
     */
    getByAriaLabel(ariaLabel: string, options?: any): Chainable<any>;
  }
}
