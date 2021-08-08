const pages = {
  testCSSImports: {
    route: 'plugin-css-imports',
    CSSFileName: 'plugin-css-imports.css'
  }
};

const { testCSSImports } = pages;

const CSSFetchRequestAlias = 'CSSFileRequest';

describe('CSS imports plugin', () => {
  // Force all requests to not return from cache
  before(() => {
    cy.intercept(`/${testCSSImports.CSSFileName}`, { middleware: true }, (req) => {
      req.on('before:response', (res) => {
        res.headers['cache-control'] = 'no-store';
      });
    });
  });

  it('should interpolate CSS imports', () => {
    cy.intercept('GET', `/${testCSSImports.CSSFileName}`).as(CSSFetchRequestAlias);

    cy.visit(testCSSImports.route);

    cy.wait(`@${CSSFetchRequestAlias}`)
      .its('response.body')
      .should('not.include', '@import')
      .and('include', 'h1');
  });
});
