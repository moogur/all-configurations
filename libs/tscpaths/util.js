import { dirname, resolve } from 'path';

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
  } = require(file);

  const config = {};

  if (baseUrl) config.baseUrl = baseUrl;
  if (outDir) config.outDir = outDir;
  if (paths) config.paths = paths;

  if (!ext) return config;

  const parentConfig = loadConfig(resolve(dirname(file), ext.startWith('.') ? ext : `node_modules/${ext}`));

  return {
    ...parentConfig,
    ...config,
  };
}
