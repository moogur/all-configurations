#! /usr/bin/env node

const path = require('path');
const { Command } = require('commander');
const { exec } = require('@moogur/helpers');

const packageJson = require('./package.json');

const program = new Command();
program
  .version(packageJson.version)
  .option('-s, --src <path>', 'source path')
  .option('-o, --out <path>', 'output build directory');

program.parse(process.argv);

let { src, out } = program;

if (!out) out = './dist';
if (!src) src = './src';

// build
exec(`rm -fr ${out}`);
exec(`ncc build ${src}/main.ts --minify --out ${out}`);

// add swagger
exec(`cp node_modules/swagger-ui-dist/swagger-ui.css ${out}/swagger-ui.css`);
exec(`cp node_modules/swagger-ui-dist/swagger-ui-bundle.js ${out}/swagger-ui-bundle.js`);
exec(`cp node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js ${out}/swagger-ui-standalone-preset.js`);

// add migrations
const tempDirMigration = '.' + path.resolve('/', 'temp-dist', src);

exec('tsc --outDir temp-dist');
exec(
  `if [ -d ${tempDirMigration} ]; then if [ -d ${tempDirMigration}/migrations ]; then cp -r ${tempDirMigration}/migrations ${out}; fi; else if [ -d temp-dist/migrations ]; then cp -r temp-dist/migrations ${out}; fi; fi`,
);
exec('rm -fr temp-dist');

// delete side files
exec(`find ${out} -type f -iname "*.d.ts" -delete`);
exec(`find ${out} -empty -type d -delete`);
