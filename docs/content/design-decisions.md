<!--
title: Design decisions
description: Design decisions made in the development of PRPL, a modular static site generator built for longevity.
slug: /design-decisions
order: 06
-->

# Design decisions

PRPL is built for **longevity**, a concept not a lot of open source projects have as an explicit goal.

The idea is if you're building a website that will be around for 5 or 10 years, PRPL should make a compelling enough 
case to be a natural fit for the job.

This page outlines some thinking around the design decisions made in pursuit of that target.

## Source-output alignment

A major frustration in the JavaScript community is the complexity added to projects from tooling like frameworks, 
bundlers and compilers. One result of this trend is that **source code no longer looks anything like 
the output that the browser consumes**.

As the gap between source and output widens, the greater the context shift is between writing source code and 
inspecting the DOM during development. The further we get in our thinking from how the browser sees our code, 
the more layers of abstraction there are to manage.

PRPL aims to reduce the discrepancy between source code and output. This offers many benefits:

- Projects are more maintainable over time
- Development and debugging is faster
- Less time and effort is spent on complex tooling
- Easier to move away from PRPL and adopt other tools

## One-sitting source code

Many popular open source projects have a codebase that can take days or weeks to understand. PRPL seeks to avoid this by keeping the overall scope small, and making sure all code is fully typed and 
explicitly commented.

If you can understand PRPL's source code in one sitting (a few hours), you can more easily:

- Make an informed decision to adopt PRPL or not
- Have confidence that you can fix or adjust the code to your needs
- Contribute to the project

## Functions, not configuration

PRPL sidesteps the concept of a configuration file entirely, preferring to pass any optional parameters directly 
into each exported function instead. This constraint forces:

- Optional parameters to stay as few as would be acceptable for a normal function
- Functions to stay small enough that optional parameters can be easily kept track of
- The scope of the project overall to stay smaller to avoid becoming unwieldy

## Web APIs, not framework APIs

Wherever possible, PRPL leverages native web platform APIs over custom framework APIs. This is the ultimate move to 
support the goal of longevity: if the W3C and friends agree on a specification and the major browsers implement 
it, there is very little chance of that API going away.

By betting on web APIs, you:

- Do not have to waste time learning framework-specific concepts
- Can be fairly confident the code you write today will still run in 5 or 10 years
- Use the *lingua franca* of the web, providing the greatest opportunity for collaboration

---

See [platform APIs](/platforms) next.