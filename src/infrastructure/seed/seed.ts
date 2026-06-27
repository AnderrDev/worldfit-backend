import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import { Category } from '../entities/Category';
import { Exercise } from '../entities/Exercise';
import { Routine } from '../entities/Routine';
import { RoutineExercise } from '../entities/RoutineExercise';
import { Goal } from '../entities/Goal';

export async function seedDatabase(): Promise<void> {
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const categoryRepo = AppDataSource.getRepository(Category);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const routineRepo = AppDataSource.getRepository(Routine);
  const reRepo = AppDataSource.getRepository(RoutineExercise);
  const goalRepo = AppDataSource.getRepository(Goal);

  const ADMIN_EMAIL = 'admin@worldfit.com';
  const yaExiste = await userRepo.findOne({ where: { email: ADMIN_EMAIL } });
  if (yaExiste) {
    console.log('Seed: los datos de prueba ya existen, no se hace nada.');
    return;
  }

  const adminRole = await roleRepo.save(
    roleRepo.create({ name_role: 'admin', description: 'Administrador del sistema' }),
  );
  const userRole = await roleRepo.save(
    roleRepo.create({ name_role: 'user', description: 'Usuario regular' }),
  );
  console.log('Seed: roles creados (admin, user)');

  const admin = userRepo.create({
    role_id: adminRole.id_role,
    name_user: 'Administrador WorldFit',
    email: ADMIN_EMAIL,
    password: await bcrypt.hash('Admin123', 12),
    is_active: true,
  });
  const demo = userRepo.create({
    role_id: userRole.id_role,
    name_user: 'Usuario Demo',
    email: 'demo@worldfit.com',
    password: await bcrypt.hash('Demo123', 12),
    is_active: true,
  });
  await userRepo.save([admin, demo]);
  console.log('Seed: usuarios creados (admin@worldfit.com / demo@worldfit.com)');

  const [catFuerza, catCardio] = await categoryRepo.save(
    categoryRepo.create([
      { name_category: 'Fuerza', description: 'Ejercicios para ganar fuerza muscular.', is_active: true },
      { name_category: 'Cardio', description: 'Ejercicios cardiovasculares y de resistencia.', is_active: true },
      { name_category: 'Flexibilidad', description: 'Estiramientos y movilidad.', is_active: true },
    ]),
  );
  console.log('Seed: categorias creadas');

  const [pressBanca, sentadilla, dominadas, plancha] = await exerciseRepo.save(
    exerciseRepo.create([
      {
        category_id: catFuerza.id_category,
        name_exercise: 'Press de banca',
        description: 'Acostado en banca, empuja la barra hacia arriba.',
        muscle_group: 'chest',
        sets: 4,
        reps: 10,
        is_active: true,
      },
      {
        category_id: catFuerza.id_category,
        name_exercise: 'Sentadilla',
        description: 'Baja flexionando rodillas y caderas con barra.',
        muscle_group: 'legs',
        sets: 4,
        reps: 12,
        is_active: true,
      },
      {
        category_id: catFuerza.id_category,
        name_exercise: 'Dominadas',
        description: 'Eleva el cuerpo hasta superar la barbilla.',
        muscle_group: 'back',
        sets: 3,
        reps: 8,
        is_active: true,
      },
      {
        category_id: catCardio.id_category,
        name_exercise: 'Plancha abdominal',
        description: 'Manten el cuerpo recto en antebrazos y pies.',
        muscle_group: 'core',
        sets: 3,
        reps: 1,
        is_active: true,
      },
    ]),
  );
  console.log('Seed: ejercicios creados');

  const rutina = routineRepo.create({
    assigned_user_id: demo.id_user,
    name_routine: 'Rutina full body para principiantes',
    description: 'Entrenamiento de cuerpo completo, ideal para empezar en el gimnasio.',
    difficulty: 'beginner',
    duration_minutes: 60,
    assignment_status: 'pending',
    is_active: true,
  });
  const rutinaGuardada = await routineRepo.save(rutina);

  await reRepo.save([
    reRepo.create({ routine_id: rutinaGuardada.id_routine, exercise_id: pressBanca.id_exercise, sets: 4, repetitions: 10, exercise_order: 1, notes: 'Barra olimpica' }),
    reRepo.create({ routine_id: rutinaGuardada.id_routine, exercise_id: sentadilla.id_exercise, sets: 4, repetitions: 12, exercise_order: 2, notes: 'Rodillas alineadas' }),
    reRepo.create({ routine_id: rutinaGuardada.id_routine, exercise_id: dominadas.id_exercise, sets: 3, repetitions: 8, exercise_order: 3, notes: '' }),
    reRepo.create({ routine_id: rutinaGuardada.id_routine, exercise_id: plancha.id_exercise, sets: 3, repetitions: 1, exercise_order: 4, notes: '60 segundos por serie' }),
  ]);
  console.log('Seed: rutina creada y asignada a demo@worldfit.com');

  await goalRepo.save(
    goalRepo.create([
      { user_id: demo.id_user, name_goal: 'Perder peso', description: 'Reducir grasa corporal de forma saludable.', is_active: true },
      { user_id: demo.id_user, name_goal: 'Ganar musculo', description: 'Aumentar masa muscular (hipertrofia).', is_active: true },
      { user_id: admin.id_user, name_goal: 'Mantenerse activo', description: 'Conservar un estilo de vida saludable.', is_active: true },
    ]),
  );
  console.log('Seed: objetivos creados');
}
