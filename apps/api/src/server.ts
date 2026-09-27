import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.API_PORT, () => {
  console.log(`ReqFlow API listening on http://localhost:${env.API_PORT}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received; closing HTTP server.`);
  server.close((error) => {
    if (error) {
      console.error('Failed to close HTTP server cleanly.', error);
      process.exitCode = 1;
      return;
    }

    process.exitCode = 0;
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
