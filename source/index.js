#!/usr/bin/env node
"use strict";

import TestRail from 'node-testrail';
import config from '../config.json';

const url = config.account.url;
const email = config.account.email;
const password = config.account.password;

const TR = new TestRail(url, email, password);
