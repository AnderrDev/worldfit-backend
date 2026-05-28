import dotenv from 'dotenv';

dotenv.config();

/**
 * Normaliza un prefijo de ruta: asegura que empiece con "/" y no termine con "/".
 * Ej: "api/" -> "/api", "/api" -> "/api", "" -> "".
 */
function normalizePrefix(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (trimmed === '') return '';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

// Prefijo base de la API (infraestructura: health, docs). Configurable via .env.
const apiPrefix = normalizePrefix(process.env.API_PREFIX ?? '/api');
// Version de la API para los endpoints de negocio. Configurable via .env.
const apiVersion = (process.env.API_VERSION ?? 'v1').trim().replace(/^\/+|\/+$/g, '');
// Ruta base versionada (ej. "/api/v1"). De aqui cuelgan auth, routines, exercises.
const apiBasePath = `${apiPrefix}/${apiVersion}`;

export const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/worldfit',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  // Rutas parametrizables
  apiPrefix,
  apiVersion,
  apiBasePath
};
