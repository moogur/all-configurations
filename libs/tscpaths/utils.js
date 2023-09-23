import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

export function mapPaths(paths, mapper) {
  return Object.keys(paths).reduce((accumulator, key) => {
    accumulator[key] = paths[key].map(mapper);

    return accumulator;
  });
}

export function loadConfig(file) {
  const {
    extends: ext,
    compilerOptions: { baseUrl, outDir, paths } = {
      baseUrl: undefined,
      outDir: undefined,
      paths: undefined,
    },
  } = JSON.parse(readFileSync(file, 'utf-8'));

  const config = {};

  if (baseUrl) config.baseUrl = baseUrl;
  if (outDir) config.outDir = outDir;
  if (paths) config.paths = paths;

  if (!ext) return config;

  const parentDirname = dirname(file);
  let parentConfig;

  if (ext.startsWith('.')) {
    parentConfig = loadConfig(resolve(parentDirname, ext));
  } else {
    const { tsconfig } = JSON.parse(readFileSync(resolve(parentDirname, 'node_modules', ext, 'package.json'), 'utf-8'));
    parentConfig = loadConfig(resolve(parentDirname, 'node_modules', ext, tsconfig));
  }

  return {
    ...parentConfig,
    ...config,
  };
}
