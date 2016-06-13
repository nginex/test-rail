#!/usr/bin/env node
"use strict";

// Check if arguments exist.
const args = process.argv.slice(2);
if (!args.length) {
  throw new Error('There are no arguments. See help.');
}

// Import configs and modules.
import TestRail from 'node-testrail';
import fs from 'fs';
import path from 'path';

let configPath = path.resolve('', 'test-rail.config.json');
fs.chmodSync(configPath, '755');
fs.accessSync(configPath, fs.R_OK);

import config from '../test-rail.config.json';
if (typeof config.account === 'undefined') {
  require('./message.js');
  process.exit(0);
}

let resultsPath = args[0];

// Check if path to file with results is absolute.
if (!path.isAbsolute(resultsPath)) {
  resultsPath = path.resolve('', resultsPath);
}

fs.access(resultsPath, fs.R_OK, (err) => {
  if (err) {
    throw err;
  }
});

const results = require(resultsPath);

const url = config.account.url;
const email = config.account.email;
const password = config.account.password;

const TR = new TestRail(url, email, password);

// Check if account data in TestRail is correct.
TR.getUserByEmail(email, (user) => {
  if (typeof user === 'undefined') {
    throw new Error('There is no account in TestRail. See help to set correct user data.');
  }
});
