<!--
title: Roadmap
description: The roadmap for PRPL, a modular static site generator built for longevity.
slug: /roadmap
order: 10
-->

# Roadmap

PRPL is a free, unfunded, [MIT-licensed](https://github.com/tyhopp/prpl/blob/master/LICENSE.md) open source project. There is no timeline for these roadmap items, but I 
thought it still useful to describe my thinking around what areas have top priority for the future.

If you would like to get involved, feel free to open an issue or PR [in the GitHub repo](https://github.com/tyhopp/prpl) and I 
will do my best to respond in a timely manner.

Many of these items seem to have clear solutions in retrospect, but if you're reading this I'm sure you're aware 
things are not as clear while you write and rewrite parts of a project during the course of its development.

## Improve cache architecture

As I mentioned in the [origin story](/origin-story#plugin-library):

> The process of writing plugins shed new light on how the architectural decisions made in PRPL core can be improved for better interop with official PRPL plugins, user-defined plugins and the PRPL dev server.

Specifically, PRPL leverages an [in-memory cache](https://github.com/tyhopp/prpl/blob/master/packages/core/src/lib/cache.ts)
that keeps the recursive operations on source and content files from having to perform repeat read operations on files. 
The original idea was for this cache to be optionally accessible by plugins to keep builds fast.

However, for plugins that mutate previously cached file content, the recursive data structure makes it 
inconvenient to update the cache so it stays sync with the file system. Another issue is these mutations 
made by plugins must also be accessible by the dev server to allow accurate live reload, which is not possible at 
present.

The cache system architecture specifically and interoperability between core, plugins and server generally 
can be improved on.

## Test coverage

PRPL has basic coverage for core and most packages, but it could always use more coverage.

## Regex edge case improvement

As I mentioned in one [FAQ](/faq#why-is-prpl-regex-based-instead-of-ast-based), PRPL is regex-based instead of 
AST-based. There are certainly edge cases that are not covered at present (e.g. things like multi-line PRPL tags), 
but given the very small scope of PRPL's two HTML elements, they are easily improved on.

## Deno support

In the [platform APIs](/platforms#deno) page I mention that Deno has been a consideration from early in the 
project's development. I would like to meet that target and seamlessly support Deno alongside Node.

---

This is the last page, thanks for reading and happy programming! 🍻