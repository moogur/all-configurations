#! /usr/bin/env node

import * as program from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { sync } from 'globby';
import { dirname, relative, resolve } from 'path';

import { loadConfig } from './util';

program
  .version('0.0.1')
  .option('-p, --project <file>', 'path to tsconfig.json')
  .option('-s, --src <path>', 'source root path')
  .option('-o, --out <path>', 'output root path');

program.parse(process.argv);

const { project, src, out } = program;

if (!project) throw new Error('--project must be specified');
if (!src) throw new Error('--src must be specified');

const configFile = resolve(process.cwd(), project);

const srcRoot = resolve(src);

const outRoot = out && resolve(out);

console.log(`tscpaths --project ${configFile} --src ${srcRoot} --out ${outRoot}`);

const { baseUrl, outDir, paths } = loadConfig(configFile);

if (!baseUrl) throw new Error('compilerOptions.baseUrl is not set');
if (!paths) throw new Error('compilerOptions.paths is not set');
if (!outDir) throw new Error('compilerOptions.outDir is not set');

const configDir = dirname(configFile);

const basePath = resolve(configDir, baseUrl);

const outPath = outRoot || resolve(basePath, outDir);

function outFileToSrcFile(x) {
  return resolve(srcRoot, relative(outPath, x));
}

const aliases = Object.keys(paths)
  .map((alias) => ({
    prefix: alias.replace(/\*$/, ''),
    aliasPaths: paths[alias].map((p) => resolve(basePath, p.replace(/\*$/, ''))),
  }))
  .filter(({ prefix }) => prefix);

function toRelative(from, x) {
  const rel = relative(from, x);
  return (rel.startsWith('.') ? rel : `./${rel}`).replace(/\\/g, '/');
}

const exts = ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.json'];

let replaceCount = 0;

function absToRel(modulePath, outFile) {
  for (let j = 0; j < aliases.length; j++) {
    const { prefix, aliasPaths } = aliases[j];

    if (modulePath.startsWith(prefix)) {
      const modulePathRel = modulePath.substring(prefix.length);
      const srcDirectory = dirname(outFileToSrcFile(outFile));
      for (let i = 0; i < aliasPaths.length; i++) {
        const moduleSrc = resolve(aliasPaths[i], modulePathRel);
        if (existsSync(moduleSrc) || exts.some((ext) => existsSync(moduleSrc + ext))) {
          const rel = toRelative(srcDirectory, moduleSrc);
          replaceCount++;
          return rel;
        }
      }
      console.log(`could not replace ${modulePath}`);
    }
  }
  return modulePath;
}

function replaceImportStatement(orig, matched, outFile) {
  const index = orig.indexOf(matched);
  return orig.substring(0, index) + absToRel(matched, outFile) + orig.substring(index + matched.length);
}

const requireRegex = /(?:import|require)\(['"]([^'"]*)['"]\)/g;
const importRegex = /(?:import|from) ['"]([^'"]*)['"]/g;
function replaceAlias(text, outFile) {
  return text
    .replace(requireRegex, (orig, matched) => replaceImportStatement(orig, matched, outFile))
    .replace(importRegex, (orig, matched) => replaceImportStatement(orig, matched, outFile));
}

// import relative to absolute path
const files = sync(`${outPath}/**/*.{js,jsx,ts,tsx}`, {
  dot: true,
  noDir: true,
}).map((value) => resolve(value));

let changedFileCount = 0;

for (let i = 0; i < files.length; i += 1) {
  const file = files[i];
  const text = readFileSync(file, 'utf8');
  const prevReplaceCount = replaceCount;
  const newText = replaceAlias(text, file);
  if (text !== newText) {
    changedFileCount += 1;
    console.log(`${file}: replaced ${replaceCount - prevReplaceCount} paths`);
    writeFileSync(file, newText, 'utf8');
  }
}

console.log(`Replaced ${replaceCount} paths in ${changedFileCount} files`);
