import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '@shared/infrastructure/error-handler.middleware';
import { buildUsersRouter } from '@modules/users/infrastructure/adapters/in/http/users.router';
import { buildRoutinesRouter } from '@modules/routines/infrastructure/adapters/in/http/routines.router';
import { buildExercisesRouter } from '@modules/exercises/infrastructure/adapters/in/http/exercises.router';

export function buildApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'worldfit-backend' });
  });

  // Composition root: cada modulo expone un router con sus dependencias cableadas
  app.use('/api/auth', buildUsersRouter());
  app.use('/api/routines', buildRoutinesRouter());
  app.use('/api/exercises', buildExercisesRouter());

  app.use(errorHandler);

  return app;
}
