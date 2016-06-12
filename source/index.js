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
import config from '../config.json';

fs.access(args[0], fs.R_OK, (err) => {
  if (err) {
    throw err;
  }
});

const results = require(args[0]);

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
