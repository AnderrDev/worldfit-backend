import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';
import { ENV } from '../config/environment-vars';
import userRoutes from '../routes/user.routes';
import exerciseRoutes from '../routes/exercise.routes';
import routineRoutes from '../routes/routine.routes';
import categoryRoutes from '../routes/category.routes';
import equipmentRoutes from '../routes/equipment.routes';
import goalRoutes from '../routes/goal.routes';

// Ruta base versionada (URI versioning). Ej: /api/v1
// Se arma desde variables de entorno para no repetir la version por todos lados.
export const API_BASE = `${ENV.API_PREFIX}/${ENV.API_VERSION}`;

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
    // Chequeo de estado (publico): util para comprobar que la API responde.
    this.app.get(`${API_BASE}/health`, (_req, res) => {
      res.status(200).json({ status: 'ok', service: 'worldfit-backend', version: ENV.API_VERSION });
    });

    // Documentacion interactiva (Swagger UI). Se deja en {prefix}/docs (sin version).
    this.app.use(`${ENV.API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Todos los recursos de negocio cuelgan de la ruta base versionada.
    this.app.use(API_BASE, userRoutes);
    this.app.use(API_BASE, exerciseRoutes);
    this.app.use(API_BASE, routineRoutes);
    this.app.use(API_BASE, categoryRoutes);
    this.app.use(API_BASE, equipmentRoutes);
    this.app.use(API_BASE, goalRoutes);

    // Red de seguridad 1: ruta no encontrada -> 404 en JSON (no el HTML de Express).
    this.app.use((_req, res) => {
      res.status(404).json({ message: 'Ruta no encontrada' });
    });

    // Red de seguridad 2: manejador de errores global (errores no controlados,
    // p. ej. JSON malformado en el body).
    this.app.use(
      (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        if (err?.type === 'entity.parse.failed') {
          return res.status(400).json({ message: 'El cuerpo de la peticion no es un JSON valido' });
        }
        console.error('[error]', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
      },
    );
  }

  getApp(): express.Application {
    return this.app;
  }
}
