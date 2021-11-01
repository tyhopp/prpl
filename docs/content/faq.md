<!--
title: FAQ
description: Frequently asked questions about PRPL, a modular static site generator built for longevity.
slug: /faq
order: 08
-->

# FAQ

A home for some frequently asked questions.

## Does PRPL work with X templating engine?

No, PRPL is focused entirely on HTML to minimize scope, have fewer dependencies, and encourage use of web 
standards for longevity.

You can however define your own template syntax via the [`templateRegex`](/api#options) option.

## Why does diffing happen in main instead of body?

Diffing within `<main>` instead of `<body>` allows part of the DOM to be persisted between page renders. 
This is useful if you want to persist elements like `<script>` or `<nav>`.

While it is opinionated in that the PRPL routing system expects there to be a main tag as a child of the 
body tag, it offers a great opportunity for better performance at runtime by keeping certain DOM elements from 
rerendering.

## What content file types does PRPL support?

At present, markdown and HTML content files are supported.

## Why this metadata format?

The metadata format uses the HTML comment syntax (e.g. `<!-- Comment -->`) because it is web standard. It is also 
convenient that HTML can be written alongside markdown in markdown files.

## Why is PRPL regex-based instead of AST-based?

There are a few reasons for this:

- PRPL's API is tiny with just two HTML elements
- Using an AST approach involves adding another dependency
- Given the small size of PRPL's source code, any regex edge cases not covered can be easily updated

---

See [origin story](/origin-story) next.