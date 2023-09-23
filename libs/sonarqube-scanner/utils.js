const childProcess = require('child_process');

function exec(command) {
  try {
    return childProcess.execSync(command).toString().trim();
  } catch (error) {
    console.log(error);

    return '';
  }
}
exports.exec = exec;

exports.branch = exec('git rev-parse --abbrev-ref HEAD');
exports.latestTag = exec('git describe --abbrev=0 --tags', '0.0.0').replace(/^v?/, '');
