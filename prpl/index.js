#!/usr/bin/env node

const { copy } = require('./src/actions/copy');
const { ensure } = require('./src/actions/ensure');
const { extract } = require('./src/actions/extract');
const { parse } = require('./src/actions/parse');

module.exports = {
  copy,
  ensure,
  extract,
  parse
};
