#! /usr/bin/env node

const { Command } = require('commander');
const scanner = require('sonarqube-scanner');
const { latestTag, branch } = require('@moogur/helpers');

const packageJson = require('./package.json');

const program = new Command();
program
  .version(packageJson.version)
  .option('-s, --src <path>', 'source root path')
  .option('-c, --coverage <path>', 'output path to test coverage')
  .option('-n, --projectName <name>', 'project name')
  .option('-k, --projectKey <key>', 'project key')
  .option('-t, --skipTests', 'do I need to skip tests');

program.parse(process.argv);

let { coverage, src, projectName, projectKey, skipTests } = program;

if (!projectName) throw new Error('--projectName must be specified');
if (!projectKey) throw new Error('--projectKey must be specified');
if (!src) src = 'src';

let testConfig = {};
if (!skipTests) {
  if (!coverage) coverage = 'coverage';

  testConfig = {
    'sonar.tests': src,
    'sonar.test.inclusions': `${src}/**/tests/**/*.(spec|test).ts`,
    'sonar.typescript.lcov.reportPaths': `${coverage}/unit/lcov.info`,
    'sonar.testExecutionReportPaths': `${coverage}/unit/test-reporter.xml`,
  };
}

// run scanner
scanner.cli(
  [`-Dsonar.login=${process.env['SONAR_TOKEN']}`, `-Dsonar.branch.name=${process.env['ANALYZE_BRANCH'] ?? branch}`],
  {
    serverUrl: String(process.env['SONAR_HOST_URL']),
    options: {
      'sonar.projectName': projectName,
      'sonar.projectKey': projectKey,
      'sonar.projectVersion': process.env['LATEST_TAG'] ?? latestTag,
      'sonar.language': 'ts',
      'sonar.projectBaseDir': '.',
      'sonar.sources': src,
      'sonar.exclusions': `${src}/**/tests/**/*,${src}/configs/**/*,${src}/migrations/**/*`,
      ...testConfig,
    },
  },
  process.exit,
);
