import childProcess from 'child_process';

export function exec(command) {
  try {
    return childProcess.execSync(command).toString().trim();
  } catch (error) {
    console.log(error);

    return '';
  }
}
