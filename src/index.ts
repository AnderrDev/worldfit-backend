import 'reflect-metadata';
import { App } from './infrastructure/web/app';
import { ServerBootstrap } from './infrastructure/bootstrap/server.bootstrap';
import { connectDB } from './infrastructure/config/database';

(async () => {
  try {
    await connectDB();
    const app = new App().getApp();
    const server = new ServerBootstrap(app);
    await server.init();
  } catch (error) {
    console.error('Error al iniciar la aplicacion', error);
  }
})();
