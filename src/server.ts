import { buildApp } from './app';
import { env } from './config/env.config';
import { connectDatabase } from './config/database';

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
    const app = buildApp();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`[server] WorldFit backend listening on :${env.port} (${env.nodeEnv})`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[server] failed to start', err);
    process.exit(1);
  }
}

bootstrap();
