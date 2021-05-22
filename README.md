# PRPL

HTML-based static site generator implementing the [PRPL pattern](https://web.dev/apply-instant-loading-with-prpl/).

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
<prpl type="page" src="content/notes">
  <!DOCTYPE html>
  <head></head>
  <body>
    <main>
      <h1>[title]</h1>
      [body]
    </main>
  </body>
</prpl>
```

and a markdown file with some metadata,

```markdown
<!--
title: Hello world!
slug: /notes/my-first-note
date: 2020-11-26
description: This is my first note
categories: Misc
-->

This is my first note
```

the output is:

```html
<!DOCTYPE html>
<head></head>
<body>
  <main>
    <h1>Hello World!</h1>
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
