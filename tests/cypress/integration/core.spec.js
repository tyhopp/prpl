const pages = {
  index: {
    route: '/',
    title: 'PRPL Test Site'
  },
  notes: {
    route: 'notes',
    title: 'Notes'
  }
};

const content = {
  a: {
    id: 'a',
    title: 'A',
    slug: 'notes/a',
    date: '2020-01-01',
    description: 'A description',
    body: 'A body'
  },
  b: {
    id: 'b',
    title: 'B',
    slug: 'notes/b',
    date: '2020-01-02',
    description: 'B description',
    body: 'B body'
  }
};

const misc = {
  other: 'Misc'
};

const { index, notes } = pages;
const { a, b } = content;

describe('Files without PRPL tags', () => {
  it('should be copied without interpolation', () => {
    cy.visit(index.route);

    cy.get('h1').should('contain.text', index.title);
  });
});

describe('PRPL lists', () => {
  it('should interpolate a list of content items', () => {
    cy.visit(notes.route);

    cy.get(`[data-cy=list-item-${a.id}]`);
    cy.get(`[data-cy=list-item-${b.id}]`);
  });

  it('should interpolate templates', () => {
    cy.visit(notes.route);

    cy.get(`[data-cy=list-item-${a.id}-slug]`).invoke('attr', 'href').should('equal', a.slug);
    cy.get(`[data-cy=list-item-${a.id}-title]`).should('have.text', a.title);
    cy.get(`[data-cy=list-item-${a.id}-description]`).should('have.text', a.description);
    cy.get(`[data-cy=list-item-${a.id}-date]`).should('have.text', a.date);

    cy.get(`[data-cy=list-item-${b.id}-slug]`).invoke('attr', 'href').should('equal', b.slug);
    cy.get(`[data-cy=list-item-${b.id}-title]`).should('have.text', b.title);
    cy.get(`[data-cy=list-item-${b.id}-description]`).should('have.text', b.description);
    cy.get(`[data-cy=list-item-${b.id}-date]`).should('have.text', b.date);
  });

  it('should render non template markup as is', () => {
    cy.visit(notes.route);

    cy.get(`[data-cy=list-item-${a.id}-other]`).should('have.text', misc.other);
    cy.get(`[data-cy=list-item-${b.id}-other]`).should('have.text', misc.other);
  });
});

describe('PRPL pages', () => {
  it('should interpolate templates', () => {
    cy.visit(a.slug);

    cy.get('[data-cy=page-meta-title]').should('have.text', a.title);
    cy.get('[data-cy=page-title]').should('have.text', a.title);
    cy.get('[data-cy=page-date]').should('have.text', a.date);
    cy.get('[data-cy=page-body]').should('include.text', a.body);

    cy.visit(b.slug);

    cy.get('[data-cy=page-meta-title]').should('have.text', b.title);
    cy.get('[data-cy=page-title]').should('have.text', b.title);
    cy.get('[data-cy=page-date]').should('have.text', b.date);
    cy.get('[data-cy=page-body]').should('include.text', b.body);
  });

  it('should render non template markup as is', () => {
    cy.visit(a.slug);

    cy.get('[data-cy=page-other]').should('have.text', misc.other);

    cy.visit(b.slug);

    cy.get('[data-cy=page-other]').should('have.text', misc.other);
  });
});
