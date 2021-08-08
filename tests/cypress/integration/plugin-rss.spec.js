const rssRoute = 'rss.xml';
const feedTitle = 'Test feed';
const author = 'Ty Hopp';
const origin = 'http://localhost:8000';

const entries = {
  a: {
    title: 'A',
    slug: 'notes/a',
    date: '2020-01-01',
    description: 'A description'
  },
  b: {
    title: 'B',
    slug: 'notes/b',
    date: '2020-01-02',
    description: 'B description'
  }
};

const { a, b } = entries;
const XMLFeedRequest = 'XMLFeedRequest';
const XMLFeedRequestAlias = `@${XMLFeedRequest}`;

const parser = new DOMParser();

let feed;

describe('RSS plugin', () => {
  // Request and parse the XML DOM
  before(() => {
    cy.request(`/${rssRoute}`).then(({ body }) => {
      feed = parser.parseFromString(body, 'application/xml');
    });
  });

  it('should output a feed title', () => {
    expect(feed.querySelector('feed > title').textContent).to.equal(feedTitle);
  });

  it('should output an alternate link', () => {
    expect(feed.querySelector('feed > link').getAttribute('href')).to.equal(origin);
  });

  it('should output a last updated timestamp', () => {
    const updatedDateTimestamp = Date.parse(feed.querySelector('feed > updated').textContent);

    expect(updatedDateTimestamp).to.be.greaterThan(0);
    expect(updatedDateTimestamp).to.be.lessThan(Date.now());
  });

  it('should output an author name', () => {
    expect(feed.querySelector('feed > author > name').textContent).to.equal(author);
  });

  it('should output multiple entries', () => {
    expect(feed.querySelectorAll('feed > entry').length).to.equal(2);
  });

  it('should output entry ids', () => {
    const [entryA, entryB] = feed.querySelectorAll('feed > entry');

    expect(entryA.querySelector('id').textContent).to.equal(`${origin}/${a.slug}`);
    expect(entryB.querySelector('id').textContent).to.equal(`${origin}/${b.slug}`);
  });

  it('should output entry published timestamps', () => {
    const [entryA, entryB] = feed.querySelectorAll('feed > entry');

    const dateA = new Date(a.date);
    const isoDateA = dateA?.toISOString();

    const dateB = new Date(b.date);
    const isoDateB = dateB?.toISOString();

    expect(entryA.querySelector('published').textContent).to.equal(isoDateA);
    expect(entryB.querySelector('published').textContent).to.equal(isoDateB);
  });

  it('should output entry updated timestamps', () => {
    const [entryA, entryB] = feed.querySelectorAll('feed > entry');

    const dateA = new Date(a.date);
    const isoDateA = dateA?.toISOString();

    const dateB = new Date(b.date);
    const isoDateB = dateB?.toISOString();

    expect(entryA.querySelector('updated').textContent).to.equal(isoDateA);
    expect(entryB.querySelector('updated').textContent).to.equal(isoDateB);
  });

  it('should output entry titles', () => {
    const [entryA, entryB] = feed.querySelectorAll('feed > entry');

    expect(entryA.querySelector('title').textContent).to.equal(a.title);
    expect(entryB.querySelector('title').textContent).to.equal(b.title);
  });

  it('should output entry alternate links', () => {
    const [entryA, entryB] = feed.querySelectorAll('feed > entry');

    expect(entryA.querySelector('link').getAttribute('href')).to.equal(`${origin}/${a.slug}`);
    expect(entryB.querySelector('link').getAttribute('href')).to.equal(`${origin}/${b.slug}`);
  });

  it('should output entry authors', () => {
    const [entryA, entryB] = feed.querySelectorAll('feed > entry');

    expect(entryA.querySelector('author > name').textContent).to.equal(author);
    expect(entryB.querySelector('author > name').textContent).to.equal(author);
  });

  it('should output entry summaries', () => {
    const [entryA, entryB] = feed.querySelectorAll('feed > entry');

    expect(entryA.querySelector('summary').textContent).to.equal(a.description);
    expect(entryB.querySelector('summary').textContent).to.equal(b.description);
  });

  it('should output entry content links', () => {
    const [entryA, entryB] = feed.querySelectorAll('feed > entry');

    expect(entryA.querySelector('content').getAttribute('src')).to.equal(`${origin}/${a.slug}`);
    expect(entryB.querySelector('content').getAttribute('src')).to.equal(`${origin}/${b.slug}`);
  });
});
