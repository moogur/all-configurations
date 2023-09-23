import childProcess from 'child_process';

function exec(command) {
  try {
    return childProcess.execSync(command).toString().trim();
  } catch (error) {
    console.log(error);

    return '';
  }
}

export const branch = exec('git rev-parse --abbrev-ref HEAD');
export const latestTag = exec('git describe --abbrev=0 --tags', '0.0.0').replace(/^v?/, '');
