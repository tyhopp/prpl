# PRPL
An HTML-based static site generator implementing the [PRPL pattern](https://web.dev/apply-instant-loading-with-prpl/).

## Why
- No JavaScript required
- No bundlers or config files
- No underlying framework (e.g. React, Vue, Angular)
- Standards based
- Very, very fast

## Install
This is a bit more complicated than it will be temporarily.

- `git clone https://github.com/tyhopp/prpl.git` to download the project
- `cd prpl/prpl && npm i` to install prpl
- `cd ../examples/basic && npm run start` to start the example app

## Usage
Use a `<prpl>` element to interpolate content in any HTML file.

Given this HTML file,

```html
<!DOCTYPE html>
<head></head>
<body>
  <main>
    <prpl type="inject" src="content/notes"></prpl>
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
- [ ] Demonstrate npm pre/post hook solution to writing remote files to the local filesystem for use