import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from '@config/env.config';
import { swaggerSpec } from '@config/swagger';
import { errorHandler } from '@shared/infrastructure/error-handler.middleware';
import { buildUsersRouter } from '@modules/users/infrastructure/adapters/in/http/users.router';
import { buildRoutinesRouter } from '@modules/routines/infrastructure/adapters/in/http/routines.router';
import { buildExercisesRouter } from '@modules/exercises/infrastructure/adapters/in/http/exercises.router';

export function buildApp(): Application {
  const app = express();

  // Rutas parametrizables (ver env.config). Por defecto:
  //   prefijo = /api   (infraestructura: health, docs)
  //   base    = /api/v1 (endpoints de negocio, versionados)
  const { apiPrefix, apiBasePath } = env;

  // Documentacion interactiva (Swagger UI) en {prefijo}/docs.
  // Se monta antes de helmet porque la CSP por defecto de helmet bloquearia
  // los scripts inline que usa Swagger UI.
  app.use(`${apiPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get(`${apiPrefix}/docs.json`, (_req, res) => res.json(swaggerSpec));

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Health check (sin version: es un endpoint de infraestructura)
  app.get(`${apiPrefix}/health`, (_req, res) => {
    res.json({ status: 'ok', service: 'worldfit-backend' });
  });

  // Composition root: cada modulo expone un router con sus dependencias cableadas.
  // Los endpoints de negocio cuelgan de la ruta base versionada (ej. /api/v1).
  app.use(`${apiBasePath}/auth`, buildUsersRouter());
  app.use(`${apiBasePath}/routines`, buildRoutinesRouter());
  app.use(`${apiBasePath}/exercises`, buildExercisesRouter());

  app.use(errorHandler);

  return app;
}
