import { execSync } from 'child_process';

console.log('Checking Python availability...');
try {
  const pythonVersion = execSync('python3 --version', { encoding: 'utf-8' });
  console.log('Python version:', pythonVersion.trim());

  try {
    const pipList = execSync('pip3 list || pip list', { encoding: 'utf-8' });
    console.log('Pip packages list (truncated):', pipList.split('\n').slice(0, 10).join('\n'));
  } catch (pipErr: any) {
    console.log('pip is not available or error listing packages:', pipErr.message);
  }
} catch (err: any) {
  console.log('Python3 is not available in the container path:', err.message);
}
