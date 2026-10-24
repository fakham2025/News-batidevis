import { spawn } from 'child_process';

// Next.js dev server wrapper
// Normalizes flags like `--host 0.0.0.0` from AI Studio runner to Next.js `-H 0.0.0.0`
const rawArgs = process.argv.slice(2);
const nextArgs = ['dev'];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    nextArgs.push('-H');
  } else if (arg.startsWith('--host=')) {
    nextArgs.push('-H', arg.slice('--host='.length));
  } else {
    nextArgs.push(arg);
  }
}

// Ensure default port and host if not provided
if (!nextArgs.includes('-p') && !nextArgs.includes('--port')) {
  nextArgs.push('-p', '3000');
}
if (!nextArgs.includes('-H') && !nextArgs.includes('--hostname')) {
  nextArgs.push('-H', '0.0.0.0');
}

const child = spawn('next', nextArgs, {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '3000',
  },
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
