#!/usr/bin/env node
"use strict";

import inquirer from 'inquirer';
import fs from 'fs';

const generateConfiguration = (data) => {
  fs.writeFileSync('test-rail.config.json', JSON.stringify({
    "account": data
  }));
  console.log('Configuration file was created successfully!');
};

inquirer.prompt([{
  type: 'input',
  name: 'url',
  message: 'Enter your TestRail account URL'
}, {
  type: 'input',
  name: 'email',
  message: 'Enter your TestRail account email'
}, {
  type: 'password',
  name: 'password',
  message: 'Enter your TestRail account password'
}]).then((answers) => {
  generateConfiguration(answers);
  process.exit(0);
});
