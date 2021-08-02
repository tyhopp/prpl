it('should add two numbers', () => {
  cy.visit('/')
  cy.get('h1').should('contain.text', 'PRPL Minimal Starter')
})