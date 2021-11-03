const { interpolate } = require('@prpl/core');
const { highlightCode } = require('@prpl/plugin-code-highlight');

async function build() {
    await interpolate();
    await highlightCode();
}

build();