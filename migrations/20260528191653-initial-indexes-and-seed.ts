import { Db, MongoClient } from 'mongodb';

/**
 * Migracion inicial:
 *  1. Crea el indice unico de `email` en la coleccion de usuarios.
 *  2. Siembra un catalogo base de ejercicios (idempotente, por _id fijo).
 *
 * Nota de buena practica: las migraciones usan el driver nativo de MongoDB
 * (no los modelos de Mongoose) para quedar desacopladas de los modelos de la
 * app, que pueden cambiar con el tiempo.
 */

// _id fijos para que el seed sea idempotente y el rollback sea preciso.
const SEED_EXERCISES = [
  { _id: 'seed-bench-press', name: 'Press de banca', muscleGroup: 'chest', sets: 4, reps: 10 },
  { _id: 'seed-squat', name: 'Sentadilla', muscleGroup: 'legs', sets: 4, reps: 8 },
  { _id: 'seed-deadlift', name: 'Peso muerto', muscleGroup: 'back', sets: 4, reps: 6 },
  { _id: 'seed-pullup', name: 'Dominadas', muscleGroup: 'back', sets: 3, reps: 10 },
  { _id: 'seed-overhead-press', name: 'Press militar', muscleGroup: 'shoulders', sets: 3, reps: 10 },
  { _id: 'seed-biceps-curl', name: 'Curl de biceps', muscleGroup: 'arms', sets: 3, reps: 12 },
  { _id: 'seed-plank', name: 'Plancha', muscleGroup: 'core', sets: 3, reps: 30 },
  { _id: 'seed-burpees', name: 'Burpees', muscleGroup: 'fullbody', sets: 3, reps: 15 }
];

export async function up(db: Db, _client: MongoClient): Promise<void> {
  // 1) Indice unico de email. Usamos el nombre por defecto que genera Mongoose
  // ("email_1") para que sea idempotente y no choque con el autoIndex de dev.
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // 2) Seed del catalogo de ejercicios via upsert (idempotente).
  const ops = SEED_EXERCISES.map((ex) => ({
    updateOne: {
      filter: { _id: ex._id },
      update: { $set: ex },
      upsert: true
    }
  }));
  await db.collection('exercises').bulkWrite(ops);
}

export async function down(db: Db, _client: MongoClient): Promise<void> {
  // Rollback: quitar el seed y el indice creado.
  await db.collection('exercises').deleteMany({ _id: { $in: SEED_EXERCISES.map((e) => e._id) } });
  await db.collection('users').dropIndex('email_1');
}
