const sitemapRoute = 'sitemap.xml';
const origin = 'http://localhost:8000';

const slugs = {
  notes: 'notes',
  noteA: 'notes/a',
  noteB: 'notes/b',
  pluginCSSImports: 'plugin-css-imports',
  pluginHTMLimports: 'plugin-html-imports'
};

const sitemapRequest = 'sitemapRequest';
const sitemapRequestAlias = `@${sitemapRequest}`;

const parser = new DOMParser();

let sitemap;

describe('Sitemap plugin', () => {
  // Request and parse the XML DOM
  before(() => {
    cy.request(`/${sitemapRoute}`).then(({ body }) => {
      sitemap = parser.parseFromString(body, 'application/xml');
    });
  });

  it('should output a list of urls', () => {
    // Get all urls from sitemap
    const urls = Array.from(sitemap.querySelectorAll('urlset > url')).reduce((acc, curr) => {
      const uri = curr.querySelector('loc').textContent;
      acc[uri] = uri;
      return acc;
    }, {});

    // Compare regardless of order
    for (const slug in slugs) {
      expect(urls[`${origin}/${slugs[slug]}`]).to.equal(`${origin}/${slugs[slug]}`);
    }
  });
});
