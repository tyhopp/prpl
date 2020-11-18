# PRPL
An experimental [PRPL pattern](https://web.dev/apply-instant-loading-with-prpl/) static site generator.

## Structure
```
prpl/
  ├─ content/
  ├─ dist/
  ├─ prpl/ [1]
  └─ src/
```

[1] Currently, the `prpl` framework package is colocated here while in development. The idea is eventually to have it as a node module.

In addition, the [prefetch](/src/prefetch.js) and [router](/src/router.js) scripts are also colocated. The idea is they will exist as packages exported from the `prpl` npm package.

## How it works
1. You write your site in `src/`.
2. You write your content in markdown in `content/`.
3. When you build your site `prpl` will:
    - Check your `content/` directory for files
    - Transform markdown files to html
    - Find the associated template in `src/` (e.g. `/content/notes/my-first-note.md` corresponds to `/src/notes/note.html`)
    - Inject the html into the template where a `<prpl></prpl>` tag is found
    - Write the completed file to `/dist` in the associated location (e.g. `/dist/notes/my-first-note.html`)

## TODO
- [ ] Add feature to render a list of content items
- [ ] Add a zero-dependency dev server solution

## Reference
- See readme from an [earlier repo](https://github.com/tyhopp/prpl-html) for more notes about how the [prefetch](/src/prefetch.js) and [router](/src/router.js) packages work in tandem to achieve the PRPL pattern.