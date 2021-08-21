<!--
title: API reference
slug: /api
order: 03
-->

# API Reference

PRPL has a deliberately small API surface area to minimize the gap between a hello world and real world 
implementation. There are just two interfaces that can be used in HTML source files: [`page`](/api#page-tags) and 
[`list`](/api#list-tags).

## Page tags

A PRPL page tag looks like this, with required `type` and `src` attributes:

```html
<prpl type="page" src="content"></prpl>
```

PRPL page tags are used when you have an HTML source file or "template", and you want to render many pages using 
that template but with different content. For example:

Given this source HTML file in `src/index.html`:

```html
<!DOCTYPE html>
<prpl type="page" src="content">
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

and this content markdown file in `content/hello-world.md`:

```markdown
<!--
title: Hello world!
slug: /hello-world
-->

This is my first note
```

the output is this file in `dist/hello-world.html`:

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

- The `src` attribute in the page tag points to a directory of markdown or HTML content files
- An output file will be generated for each file in the content directory
- The location in the file system of the source file determines the location of the output files

See the [source code handling page tags in @prpl/core](https://github.com/tyhopp/prpl/blob/master/packages/core/src/interpolate/interpolate-page.ts).

## List tags

A PRPL list tag looks like this, with required attributes `type` and `src` and optional attributes `sort-by`, 
`direction` and `limit`:

```html
<prpl type="list" src="content"></prpl>
```

PRPL list tags are used when you have an HTML source file or "template", and you want to render a list within that 
same template using content files. For example:

Given this source HTML file in `src/index.html`:

```html
<!DOCTYPE html>
<head>
  <title>My home page</title>
</head>
<body>
  <main>
    <ul>
      <prpl type="list" src="content">
        <li>
          <a href="[slug]">[title]</a>
        </li>
      </prpl>
    </ul>
  </main>
</body>
```

and this content markdown file in `content/hello-world.md`:

```markdown
<!--
title: Hello world!
slug: /hello-world
-->

This is my first note
```

the output is this file in `dist/index.html`:


```html
<!DOCTYPE html>
<head>
  <title>My home page</title>
</head>
<body>
  <main>
    <ul>
      <li>
        <a href="/hello-world">Hello world!</a>
      </li>
    </ul>
  </main>
</body>
```

- The `src` attribute in the page tag points to a directory of markdown or HTML content files
- A DOM tree will be generated for each file in the content directory

### Sort, direction and limit

The `list` tag using the optional attributes `sort-by`, `direction` and `limit` looks like this:

```html
<prpl type="list" src="content" sort-by="title" direction="asc" limit="2"></prpl>
```

- `sort-by` is a metadata key in your content file
- `direction` is the direction to sort by, either `asc` or `desc` for ascending and descending
- `limit` is the number of items to list

Additional notes:

- `sort-by` uses the [`Array.prototype.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) web API
- The only special cases handled at present are dates, if the metadata key is `date` or `time`

See the [source code handling list tags in @prpl/core](https://github.com/tyhopp/prpl/blob/master/packages/core/src/interpolate/interpolate-list.ts).

## Content metadata

Every content file must have metadata or "frontmatter" at the top of the file with required keys `title` and `slug`:

```html
<!--
title: Hello world!
slug: /hello-world
-->
```

You can define as many keys as you like and consume them within `page` and `list` tags.

## Serve and build CLI commands

PRPL can be used from the command line with these commands:

- `prpl` to interpolate your site. `@prpl/core` must be installed to run this command
- `prpl-server` to run the dev server locally. `@prpl/server` must be installed to run this command

## CommonJS node interface

PRPL can also be used within Node via CommonJS modules. A build script might look like:

```javascript
const { interpolate } = require('@prpl/core');

async function build() {
  await interpolate();
}

build();
```

## ESM node interface

PRPL can also be used within Node via ECMAScript modules. A build script might look like:

```javascript
import { interpolate } from '@prpl/core';

await interpolate();
```

## Options

PRPL has no configuration files, but there are a few options that can be passed to the core `interpolate` function:

```javascript
import { interpolate } from '@prpl/core';

// Default options
const options = {
  noClientJS: false,
  templateRegex: (key) => new RegExp(`\\[${key}\\]`, 'g'),
  markedOptions: {}
};

async function build() {
  await interpolate({ options });
}

build();
```

- `noClientJS` will output zero client-side JavaScript. Your site will no longer take advantage of the prefetch and 
  router systems PRPL offers and will use the browser's native routing and caching systems instead
- `templateRegex` lets you define the how you want PRPL to look for things to replace during interpolation. The 
  default is `[my-metadata-key]`, but you can define `{my-metadata-key}` or `{{ my-metadata-key }}` or whatever suits 
  your preference
- `markedOptions` are options you can pass to [`marked`](https://marked.js.org/using_advanced#options), the only 
  dependency of `@prpl/core`

---

See [plugins](/plugins) next.