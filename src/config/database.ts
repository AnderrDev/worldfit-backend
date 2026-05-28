import mongoose from 'mongoose';
import { env } from './env.config';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log(`[db] connected to ${env.mongoUri}`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
