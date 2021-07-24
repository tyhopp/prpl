# PRPL

HTML-based static site generator implementing the [PRPL pattern](https://web.dev/apply-instant-loading-with-prpl/).

## Why

- No JavaScript required
- No bundlers or config files
- No underlying framework (e.g., React, Vue, Angular)
- Standards based
- Very, very fast

## Install

`npm init prpl` or `yarn init prpl`

## Usage

Use a `<prpl>` element to interpolate content in any HTML file.

Given this HTML file,

```html
<!DOCTYPE html>
<prpl type="page" src="content/notes">
  <head>
    <title>[title]</title>
  </head>
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
<head>
  <title>Hello World!</title>
</head>
<body>
  <main>
    <h1>Hello World!</h1>
    <p>This is my first note</p>
  </main>
</body>
```
