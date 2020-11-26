# PRPL
An experimental [PRPL pattern](https://web.dev/apply-instant-loading-with-prpl/) static site generator.

## Gains
- One dependency
- One API (a single HTML element)
- No bundlers or config files
- Next.js/Gatsby speed without the kitchen sink

## Usage
Use a `<prpl>` element to interpolate content in any HTML file.

Given this HTML file,

```html
<!DOCTYPE html>
<head></head>
<body>
  <main>
    <prpl src="content/notes"></prpl>
  </main>
</body>
```

and a markdown file,

```markdown
# Hello World!

This is my first note
```

the output is:

```html
<!DOCTYPE html>
<head></head>
<body>
  <main>
    <h1 id="hello-world">Hello World!</h1>
    <p>This is my first note</p>
  </main>
</body>
```

## Project structure
```
prpl/
  └─ examples/
    └─ basic/
      ├─ content/
      ├─ src/
      └─ dist/
  └─ prpl/
```

## TODO
- [ ] Add feature to render a list of content items
- [ ] Add a zero-dependency dev server solution
- [ ] Demonstrate npm pre/post hook solution to writing remote files to the local filesystem for use