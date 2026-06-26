import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './infrastructure/config/database';
import { User } from './infrastructure/entities/User';
import { Exercise } from './infrastructure/entities/Exercise';
import { Routine } from './infrastructure/entities/Routine';

/**
 * Script de datos de prueba (seed).
 *
 * Crea un usuario administrador, un usuario normal, un catalogo de ejercicios
 * y una rutina asignada al usuario normal. Es idempotente: si el admin ya
 * existe, no vuelve a insertar nada.
 *
 * Ejecutar con:  npm run seed
 */
async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Conectado a la base de datos (seed)');

  const userRepo = AppDataSource.getRepository(User);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const routineRepo = AppDataSource.getRepository(Routine);

  const ADMIN_EMAIL = 'admin@worldfit.com';

  // Idempotencia: si ya existe el admin, asumimos que ya se sembro.
  const yaExiste = await userRepo.findOne({ where: { email: ADMIN_EMAIL } });
  if (yaExiste) {
    console.log('Los datos de prueba ya existen. No se hace nada.');
    await AppDataSource.destroy();
    return;
  }

  // ---- Usuarios ----
  const admin = userRepo.create({
    name_user: 'Administrador WorldFit',
    email: ADMIN_EMAIL,
    password: await bcrypt.hash('Admin123', 12),
    role_user: 'admin',
    status_user: 1,
  });

  const usuario = userRepo.create({
    name_user: 'Usuario Demo',
    email: 'demo@worldfit.com',
    password: await bcrypt.hash('Demo123', 12),
    role_user: 'user',
    status_user: 1,
  });

  await userRepo.save([admin, usuario]);
  console.log('Usuarios creados: admin@worldfit.com / demo@worldfit.com');

  // ---- Ejercicios (catalogo) ----
  const ejercicios = exerciseRepo.create([
    {
      name_exercise: 'Press de banca',
      description: 'Acostado en banca, empuja la barra hacia arriba trabajando el pecho.',
      muscle_group: 'chest',
      sets: 4,
      reps: 10,
      status_exercise: 1,
    },
    {
      name_exercise: 'Sentadilla',
      description: 'Con la barra sobre la espalda, baja flexionando rodillas y caderas.',
      muscle_group: 'legs',
      sets: 4,
      reps: 12,
      status_exercise: 1,
    },
    {
      name_exercise: 'Dominadas',
      description: 'Cuelga de la barra y eleva el cuerpo hasta superar la barbilla.',
      muscle_group: 'back',
      sets: 3,
      reps: 8,
      status_exercise: 1,
    },
    {
      name_exercise: 'Plancha abdominal',
      description: 'Manten el cuerpo recto apoyado en antebrazos y punta de pies.',
      muscle_group: 'core',
      sets: 3,
      reps: 1,
      status_exercise: 1,
    },
  ]);

  const ejerciciosGuardados = await exerciseRepo.save(ejercicios);
  console.log(`Ejercicios creados: ${ejerciciosGuardados.length}`);

  // ---- Rutina asignada al usuario demo ----
  const rutina = routineRepo.create({
    name_routine: 'Rutina full body para principiantes',
    description: 'Entrenamiento de cuerpo completo, ideal para empezar en el gimnasio.',
    difficulty: 'beginner',
    exercises: ejerciciosGuardados, // relacion ManyToMany
    assigned_user_id: usuario.id_user,
    status_routine: 1,
  });

  await routineRepo.save(rutina);
  console.log('Rutina creada y asignada a demo@worldfit.com');

  await AppDataSource.destroy();
  console.log('Seed completado con exito.');
}

seed().catch((error) => {
  console.error('Error ejecutando el seed:', error);
  process.exit(1);
});
