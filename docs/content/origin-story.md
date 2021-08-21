<!--
title: Origin Story
slug: /origin-story
order: 11
-->

# Origin Story

Many companies share their origin story, but few open source projects do. I thought it might be useful and/or 
interesting to share the path taken building PRPL.

## Fascination with Gatsby

The ideas implemented in PRPL trace back to my fascination with [Gatsby](https://www.gatsbyjs.com). After building 
and maintaining several Gatsby sites, I noticed that while the developer experience and runtime performance was 
phenomenal in the moment, the sites tended to decay over time if not actively tended to due to Gatsby related changes 
and large dependency trees.

I wanted to understand exactly how Gatsby achieved the runtime performance it did, so I dove deep into Gatsby's source 
code to understand what makes it fast. It turns out that [Gatsby implemented the PRPL pattern](https://www.gatsbyjs.com/docs/prpl-pattern/), a strategy that inspired the name of this project.

Even more interesting, I found that while the foundation for the prefetch and routing systems boil down to simply
prefetching JSON and the [`history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
web API respectively, the implementations in the Gatsby source were fairly large and complex.

## 2 years of web components

These ideas swirled around in my head while I spent 2 years working with web components at the [Singapore Exchange](https://www.sgx.com).
At SGX we made decisions based on **longevity**, taking drastic steps to minimize exposure to third party code and 
build strictly on web standards.

While there were naturally parts of this strategy that had adverse effects on productivity, it was also a major contributing factor to our ability to meet the unique challenges of building 
software for a major financial exchange.

The juxtaposition between the design decisions behind Gatsby and those we made at SGX was striking. I wanted to be 
able to build sites with the fantastic runtime speed and developer experience of Gatsby but with web 
standards and near-zero dependencies like we had at SGX.

With no other open source projects out there I could find striking this balance, some loose ideas started to form in 
my mind around what a new project might look like.

## Client-side experiments

Putting aside the basic functionality of a static site generator and assuming HTML is prerendered at build time, 
I started hacking on minimal ideas for achieving Gatsby-like performance at runtime. I found one idea particularly 
compelling: while the [PRPL pattern](https://web.dev/apply-instant-loading-with-prpl/) as described by Google 
focused naturally on loading non-HTML resources after the initial request for HTML, I could apply the PRPL pattern 
to HTML pages themselves.

I put together a tiny experiment that would become the basis for the prefetch and routing systems PRPL has today. A 
prefetch script checks the initial page for same-origin anchor tags and schedules those page's HTML to be requested 
in a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and
stored in [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) for later access 
by the router. When a link is clicked, the router attempts to access the stored HTML and diffs the current page's 
HTML if it exists, otherwise gracefully degrades to the browser's native routing mechanism.

## Static site generator functionality

The client-side experiment turned out fairly well and I turned my gaze to basic static site generation. If there is 
no prerendered HTML, the client-size systems could not work. I knew from experience that many static site generators 
have an extensive API that creates a large gap between hello world and a real world implementation. I to avoid 
that pitfall and have PRPL do just two things, abstractly speaking:

- Interpolate content into a template to output new pages
- Interpolate content into a single page as a list

The difference is subtle. Both processes take content files as input, but one outputs new files and another 
outputs a single file.

These targets defined, I decided on an opinionated stance of adhering as closely to web standards as possible. That 
means only HTML source code templates are supported, and PRPL's API would exist natively alongside other HTML 
elements.

## Towards production readiness

The core static site generator created, I knew at this point that this project would likely see the light of day. 
Being responsible for it, I wanted to make it as maintainable as possible with extensive documentation, full types 
and a relatively small amount of source code.

It was at this point where I made the tradeoff to adopt [TypeScript](https://www.typescriptlang.org) and [Lerna](https://lerna.js.org).
TypeScript is not a web standard, but it does provide type safety, another form of documentation, and a means for 
developers to conveniently and confidently integrate with projects written in it. Lerna is one of the few established 
ways to stay productive while publishing a library of modules in a monorepo.

## Plugin library

With the project on solid architectural footing and some experience dogfooding PRPL on my own sites, it became clear 
that there are a few functionalities most sites need at build time outside the core functionality of PRPL. I 
built tiny plugins for things like sitemap and RSS feed generation, HTML and CSS import resolution and code 
syntax highlighting.

The process of writing plugins shed new light on how the architectural decisions made in PRPL core can be improved 
to better interop with official PRPL plugins, user-defined plugins and the PRPL dev server.

## This website and beyond

Lastly, I wrote this documentation website with PRPL and had a blast doing it. It is challenging to experience 
issues with things like the dev server and have to stop writing content to go fix it first, but that's a natural 
part of the process.

If you made it this far, thank you for reading! I'm not sure where "origin" stops and the "roadmap" begins, but I 
suppose that's what they call the present.

---

See the [roadmap](/roadmap) next.