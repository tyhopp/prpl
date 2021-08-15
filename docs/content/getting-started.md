<!--
title: Getting started
slug: /getting-started
order: 2
-->

# Getting started

If would like to run a PRPL site immediately, run the initializer in your terminal:

```shell
npx -y create-prpl@latest
```

The initializer ([`create-prpl`](https://github.com/tyhopp/create-prpl/blob/master/index.js)) does the following things:

- Clone the [`prpl-starter-minimal`](https://github.com/tyhopp/prpl-starter-minimal) repo
- Remove the git history from `prpl-starter-minimal`
- Install [`@prpl/core`](https://github.com/tyhopp/prpl/blob/master/packages/core/README.md) and [`@prpl/server`](https://github.com/tyhopp/prpl/blob/master/packages/server/README.md)
- Run the server locally at http://localhost:8000

### Write your website

From here you can rename `prpl-starter-minimal` to whatever you want your project to be named and adjust the project 
files to your liking. The structure of a PRPL site looks like this:

```asciidoc
our-lovely-repo
  └─ content
  └─ dist
  └─ src
```

- `content` is where you keep your content files written in markdown or HTML
- `dist` is the output directory that PRPL clears and writes to when you run the build command
- `src` is where you keep your source code files written in HTML, CSS and JavaScript

The reason for this opinionated project structure is to achieve [source-output alignment](/docs/source-output-alignment), a topic discussed in greater detail later.

### Commands

The basic bin commands used by PRPL are:

- `prpl`, which runs the main [`@prpl/core`](https://github.com/tyhopp/prpl/blob/master/packages/core/README.md) 
  interpolation function
- `prpl-server`, which runs the [`@prpl/server`](https://github.com/tyhopp/prpl/blob/master/packages/server/README.md) local development server
  
If you initialized your site with [`create-prpl`](https://github.com/tyhopp/create-prpl/blob/master/index.js), those 
commands are mapped to npm scripts:

- `npm run build`
- `npm run dev`

### Deploy your website

PRPL outputs static HTML files, so you can host your site wherever you like easily. A recommended solution is 
[Netlify](https://www.netlify.com).

---

See the [API reference](/api) next.