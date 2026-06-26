import express from 'express';
import cors from 'cors';
import userRoutes from '../routes/user.routes';
import exerciseRoutes from '../routes/exercise.routes';
import routineRoutes from '../routes/routine.routes';

export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json()); // necesario para leer el body de las peticiones
    this.app.use(cors()); // permite consumir la API desde el front
  }

  private routes(): void {
    this.app.use('/api', userRoutes);
    this.app.use('/api', exerciseRoutes);
    this.app.use('/api', routineRoutes);
  }

  getApp(): express.Application {
    return this.app;
  }
}
