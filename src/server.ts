import { buildApp } from './app';
import { env } from './config/env.config';
import { connectDatabase } from './config/database';

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
    const app = buildApp();
    app.listen(env.port, () => {
      const base = `http://localhost:${env.port}`;
      // eslint-disable-next-line no-console
      console.log(
        [
          '',
          '  ✅  WorldFit backend iniciado correctamente',
          `  ├─ Entorno   : ${env.nodeEnv}`,
          `  ├─ Version   : ${env.apiVersion}`,
          '  ├─ MongoDB   : conectado a Atlas',
          `  ├─ API       : ${base}${env.apiBasePath}`,
          `  ├─ Health    : ${base}${env.apiPrefix}/health`,
          `  └─ Swagger   : ${base}${env.apiPrefix}/docs`,
          ''
        ].join('\n')
      );
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('  ❌  WorldFit backend NO pudo iniciar:\n', err);
    process.exit(1);
  }
}

bootstrap();
