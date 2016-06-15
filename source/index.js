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

const config = require(configPath);
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
const project = config.account.project;

const TR = new TestRail(url, email, password);

// Check if account data in TestRail is correct.
TR.getUserByEmail(email, (user) => {
  if (typeof user === 'undefined') {
    throw new Error('There is no account in TestRail. See help to set correct user data.');
  }
});

if (typeof results.tests === 'undefined' || !results.tests.length) {
  throw new Error('There are no test cases.');
}

/**
 * Class as helper for node-testrail functionality.
 */
class TestRailHelper {

  /**
   * Get id of project by name.
   * @param name
   * @param tests
   */
  constructor(name, tests) {
    this.projectName = name;
    this.tests = tests;
    TR.getProjects((d) => {
      const projects = JSON.parse(d);
      for (let i = 0; i < projects.length; i++) {
        if (projects[i].name == this.projectName) {
          this.projectId = projects[i].id;
          break;
        }
      }

      if (typeof this.projectId === 'undefined') {
        throw new Error('There are no project with entered name.');
      }

      let amountTests = this.tests.length;
      for (let i = 0; i < amountTests; i++) {
        this.test = this.tests[i];
        this.manageSuites();
      }
    });
  }

  /**
   * Get id of suite by name or create new one.
   */
  manageSuites() {
    this.suiteName = this.test.suite || 'Master';
    TR.getSuites(this.projectId, (d) => {
      const suites = JSON.parse(d);
      for (let i = 0; i < suites.length; i++) {
        if (suites[i].name == suiteName) {
          this.suiteId = suites[i].id;
          break;
        }
      }

      if (typeof this.suiteId === 'undefined') {
        TR.addSuite(this.projectId, this.suiteName, null, (d) => {
          let suite = JSON.parse(d);
          this.suiteId = suite.id;
          this.manageSections();
        });
      }
      else {
        this.manageSections();
      }
    });
  }

  /**
   * Get id of section by name or create new one.
   */
  manageSections() {
    this.sectionName = this.test.section || 'Test Cases';
    TR.getSections(this.projectId, this.suiteId, (d) => {
      const sections = JSON.parse(d);
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].name == this.sectionName) {
          this.sectionId = sections[i].id;
          break;
        }
      }

      if (typeof this.sectionId === 'undefined') {
        TR.addSection(this.projectId, this.suiteId, null, this.sectionName, (d) => {
          let section = JSON.parse(d);
          this.sectionId = section.id;
          this.manageTestCases();
        });
      }
      else {
        this.manageTestCases();
      }
    });
  }

  /**
   * Get id of test case by name or create new one.
   */
  manageTestCases() {
    TR.getCases(this.projectId, this.suiteId, this.sectionId, (d) => {
      const cases = JSON.parse(d);
    });
  }
}

new TestRailHelper(project, results.tests);
