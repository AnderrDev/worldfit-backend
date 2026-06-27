import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ENV } from './environment-vars';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import { Category } from '../entities/Category';
import { Exercise } from '../entities/Exercise';
import { Routine } from '../entities/Routine';
import { RoutineExercise } from '../entities/RoutineExercise';
import { Goal } from '../entities/Goal';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  schema: ENV.DB_SCHEMA,
  synchronize: true, // SOLO en desarrollo; se quita en produccion
  logging: false,
  entities: [Role, User, Category, Exercise, Routine, RoutineExercise, Goal],
});

export async function connectDB(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
    throw error;
  }
}
