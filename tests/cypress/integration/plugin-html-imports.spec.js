const pages = {
  testHTMLImports: {
    route: 'plugin-html-imports'
  }
};

const fragments = {
  a: {
    id: 'a',
    text: 'A fragment'
  },
  b: {
    id: 'b',
    text: 'B fragment'
  }
};

const { testHTMLImports } = pages;
const { a, b } = fragments;

describe('HTML imports plugin', () => {
  it('should interpolate HTML imports', () => {
    cy.visit(testHTMLImports.route);

    cy.get(`[data-cy=fragment-${a.id}]`).should('contain.text', a.text);
    cy.get(`[data-cy=fragment-${b.id}]`).should('contain.text', b.text);
  });
});
