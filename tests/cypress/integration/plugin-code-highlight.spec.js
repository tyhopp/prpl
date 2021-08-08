const pages = {
  testCodeHighlight: {
    route: 'plugin-code-highlight'
  }
};

const { testCodeHighlight } = pages;

describe('Code highlight plugin', () => {
  it('should highlight code blocks', () => {
    cy.visit(testCodeHighlight.route);

    cy.get('pre > code').find('span').invoke('attr', 'class').should('include', 'token');
  });

  it('should highlight inline code', () => {
    cy.visit(testCodeHighlight.route);

    cy.get('p > code').find('span').invoke('attr', 'class').should('include', 'token');
  });
});
