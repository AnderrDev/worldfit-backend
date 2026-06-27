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
  const DEMO_EMAIL = 'demo@worldfit.com';

  const ensureRole = async (name_role: string, description: string) => {
    const existing = await roleRepo.findOne({ where: { name_role } });
    if (existing) return existing;
    return roleRepo.save(roleRepo.create({ name_role, description }));
  };

  const ensureUser = async (
    email: string,
    name_user: string,
    role_id: number,
    plainPassword: string,
  ) => {
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) return existing;
    return userRepo.save(
      userRepo.create({
        role_id,
        name_user,
        email,
        password: await bcrypt.hash(plainPassword, 12),
        is_active: true,
      }),
    );
  };

  const ensureCategory = async (name_category: string, description: string) => {
    const existing = await categoryRepo.findOne({ where: { name_category } });
    if (existing) return existing;
    return categoryRepo.save(categoryRepo.create({ name_category, description, is_active: true }));
  };

  const ensureExercise = async (data: {
    category_id: number;
    name_exercise: string;
    description: string;
    muscle_group: string;
    sets: number;
    reps: number;
  }) => {
    const existing = await exerciseRepo.findOne({ where: { name_exercise: data.name_exercise } });
    if (existing) return existing;
    return exerciseRepo.save(exerciseRepo.create({ ...data, is_active: true }));
  };

  const ensureRoutine = async (data: {
    assigned_user_id: number;
    name_routine: string;
    description: string;
    difficulty: string;
    duration_minutes: number;
  }) => {
    const existing = await routineRepo.findOne({ where: { name_routine: data.name_routine } });
    if (existing) return existing;
    return routineRepo.save(
      routineRepo.create({ ...data, assignment_status: 'pending', is_active: true }),
    );
  };

  const ensureGoal = async (data: { user_id: number; name_goal: string; description: string }) => {
    const existing = await goalRepo.findOne({ where: { user_id: data.user_id, name_goal: data.name_goal } });
    if (existing) return existing;
    return goalRepo.save(goalRepo.create({ ...data, is_active: true }));
  };

  const adminRole = await ensureRole('admin', 'Administrador del sistema');
  const userRole = await ensureRole('user', 'Usuario regular');
  console.log('Seed: roles verificados');

  const admin = await ensureUser(ADMIN_EMAIL, 'Administrador WorldFit', adminRole.id_role, 'Admin123');
  const demo = await ensureUser(DEMO_EMAIL, 'Usuario Demo', userRole.id_role, 'Demo123');
  console.log('Seed: usuarios verificados');

  const catFuerza = await ensureCategory('Fuerza', 'Ejercicios para ganar fuerza muscular.');
  const catCardio = await ensureCategory('Cardio', 'Ejercicios cardiovasculares y de resistencia.');
  await ensureCategory('Flexibilidad', 'Estiramientos y movilidad.');
  console.log('Seed: categorias verficadas');

  const pressBanca = await ensureExercise({
    category_id: catFuerza.id_category,
    name_exercise: 'Press de banca',
    description: 'Acostado en banca, empuja la barra hacia arriba.',
    muscle_group: 'chest',
    sets: 4,
    reps: 10,
  });
  const sentadilla = await ensureExercise({
    category_id: catFuerza.id_category,
    name_exercise: 'Sentadilla',
    description: 'Baja flexionando rodillas y caderas con barra.',
    muscle_group: 'legs',
    sets: 4,
    reps: 12,
  });
  const dominadas = await ensureExercise({
    category_id: catFuerza.id_category,
    name_exercise: 'Dominadas',
    description: 'Eleva el cuerpo hasta superar la barbilla.',
    muscle_group: 'back',
    sets: 3,
    reps: 8,
  });
  const plancha = await ensureExercise({
    category_id: catCardio.id_category,
    name_exercise: 'Plancha abdominal',
    description: 'Manten el cuerpo recto en antebrazos y pies.',
    muscle_group: 'core',
    sets: 3,
    reps: 1,
  });
  console.log('Seed: ejercicios verificados');

  const rutina = await ensureRoutine({
    assigned_user_id: demo.id_user,
    name_routine: 'Rutina full body para principiantes',
    description: 'Entrenamiento de cuerpo completo, ideal para empezar en el gimnasio.',
    difficulty: 'beginner',
    duration_minutes: 60,
  });

  const existingRoutineExercises = await reRepo.find({ where: { routine_id: rutina.id_routine } });
  if (existingRoutineExercises.length === 0) {
    await reRepo.save([
      reRepo.create({ routine_id: rutina.id_routine, exercise_id: pressBanca.id_exercise, sets: 4, repetitions: 10, exercise_order: 1, notes: 'Barra olimpica' }),
      reRepo.create({ routine_id: rutina.id_routine, exercise_id: sentadilla.id_exercise, sets: 4, repetitions: 12, exercise_order: 2, notes: 'Rodillas alineadas' }),
      reRepo.create({ routine_id: rutina.id_routine, exercise_id: dominadas.id_exercise, sets: 3, repetitions: 8, exercise_order: 3, notes: '' }),
      reRepo.create({ routine_id: rutina.id_routine, exercise_id: plancha.id_exercise, sets: 3, repetitions: 1, exercise_order: 4, notes: '60 segundos por serie' }),
    ]);
  }
  console.log('Seed: rutina verificada y asignada a demo@worldfit.com');

  await ensureGoal({ user_id: demo.id_user, name_goal: 'Perder peso', description: 'Reducir grasa corporal de forma saludable.' });
  await ensureGoal({ user_id: demo.id_user, name_goal: 'Ganar musculo', description: 'Aumentar masa muscular (hipertrofia).' });
  await ensureGoal({ user_id: admin.id_user, name_goal: 'Mantenerse activo', description: 'Conservar un estilo de vida saludable.' });
  console.log('Seed: objetivos verificados');
}
