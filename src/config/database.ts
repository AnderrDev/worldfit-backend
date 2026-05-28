import mongoose from 'mongoose';
import { env } from './env.config';

/**
 * Oculta credenciales (usuario:contrasena@) de una URI de Mongo para poder
 * loguearla de forma segura.
 */
function safeMongoUri(uri: string): string {
  return uri.replace(/\/\/([^@]+)@/, '//***:***@');
}

export async function connectDatabase(): Promise<void> {
  const conn = await mongoose.connect(env.mongoUri, {
    // En produccion los indices se crean de forma controlada via migraciones
    // (migrate-mongo), no automaticamente al arrancar. En dev se mantiene
    // autoIndex para comodidad.
    autoIndex: env.nodeEnv !== 'production'
  });
  // eslint-disable-next-line no-console
  console.log(`[db] connected to ${conn.connection.host}/${conn.connection.name} (${safeMongoUri(env.mongoUri)})`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
