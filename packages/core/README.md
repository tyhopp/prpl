# @prpl/core

This module interpolates your content into HTML.

## Usage

Can be used via the `prpl` CLI command, or in CJS/ESM. Example in ESM:

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

## Dependencies

`@prpl/core` has one dependency: [`marked`](https://github.com/markedjs/marked), a markdown compiler. Reasons 
for relying on it include:

- It is not practical to implement a markdown compiler within the PRPL library
- It is fair to assume that most users will author content in markdown given its ubiquity  
- [`marked`](https://github.com/markedjs/marked) itself has zero dependencies and is actively maintained

In the future it may make sense to externalize this dependency, but given the above reasons it is included for now.