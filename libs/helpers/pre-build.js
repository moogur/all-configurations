const { readFileSync, writeFileSync } = require('fs');

const { latestTag } = require('./index');

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

packageJson.version = latestTag;

writeFileSync('package.json', JSON.stringify(packageJson, null, 2), { encoding: 'utf8' });
