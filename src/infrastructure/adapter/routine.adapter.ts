import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Routine as RoutineEntity } from '../entities/Routine';
import { RoutineExercise as RoutineExerciseEntity } from '../entities/RoutineExercise';
import { Routine as RoutineDomain, Difficulty, AssignmentStatus } from '../../domain/entities/routine';
import { RoutineExerciseItem } from '../../domain/entities/routine-exercise';
import { RoutinePort } from '../../domain/routine.port';

export class RoutineAdapter implements RoutinePort {
  private routineRepo: Repository<RoutineEntity>;
  private reRepo: Repository<RoutineExerciseEntity>;

  constructor() {
    this.routineRepo = AppDataSource.getRepository(RoutineEntity);
    this.reRepo = AppDataSource.getRepository(RoutineExerciseEntity);
  }

  private toDomain(r: RoutineEntity): RoutineDomain {
    return {
      id: r.id_routine,
      name: r.name_routine,
      description: r.description,
      difficulty: r.difficulty as Difficulty,
      durationMinutes: r.duration_minutes,
      exercises: (r.routineExercises ?? []).map((re) => ({
        id: re.id,
        exerciseId: re.exercise_id,
        exerciseName: re.exercise?.name_exercise,
        sets: re.sets,
        repetitions: re.repetitions,
        description: re.description,
        exerciseOrder: re.exercise_order,
        notes: re.notes,
      })),
      assignedUserId: r.assigned_user_id,
      assignmentStatus: r.assignment_status as AssignmentStatus,
      isActive: r.is_active,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  private buildReEntities(routineId: number, items: RoutineExerciseItem[]): RoutineExerciseEntity[] {
    return (items ?? []).map((item, idx) => {
      const re = new RoutineExerciseEntity();
      re.routine_id = routineId;
      re.exercise_id = item.exerciseId;
      re.sets = item.sets ?? 3;
      re.repetitions = item.repetitions ?? 10;
      re.description = item.description ?? '';
      re.exercise_order = item.exerciseOrder ?? idx + 1;
      re.notes = item.notes ?? '';
      return re;
    });
  }

  async createRoutine(routine: Omit<RoutineDomain, 'id'>): Promise<number> {
    try {
      const entity = new RoutineEntity();
      entity.assigned_user_id = routine.assignedUserId;
      entity.name_routine = routine.name;
      entity.description = routine.description ?? '';
      entity.difficulty = routine.difficulty;
      entity.duration_minutes = routine.durationMinutes ?? 0;
      entity.assignment_status = routine.assignmentStatus ?? 'pending';
      entity.is_active = routine.isActive ?? true;
      entity.routineExercises = [];

      const saved = await this.routineRepo.save(entity);

      if (routine.exercises && routine.exercises.length > 0) {
        await this.reRepo.save(this.buildReEntities(saved.id_routine, routine.exercises));
      }

      return saved.id_routine;
    } catch (error) {
      throw new Error('Error al crear la rutina');
    }
  }

  async updateRoutine(id: number, routine: Partial<RoutineDomain>): Promise<boolean> {
    try {
      const existing = await this.routineRepo.findOne({ where: { id_routine: id } });
      if (!existing) return false;

      if (routine.name != null) existing.name_routine = routine.name;
      if (routine.description != null) existing.description = routine.description;
      if (routine.difficulty != null) existing.difficulty = routine.difficulty;
      if (routine.durationMinutes != null) existing.duration_minutes = routine.durationMinutes;
      if (routine.assignedUserId != null) existing.assigned_user_id = routine.assignedUserId;
      if (routine.assignmentStatus != null) existing.assignment_status = routine.assignmentStatus;
      if (routine.isActive != null) existing.is_active = routine.isActive;

      await this.routineRepo.save(existing);

      if (routine.exercises != null) {
        await this.reRepo.delete({ routine_id: id });
        if (routine.exercises.length > 0) {
          await this.reRepo.save(this.buildReEntities(id, routine.exercises));
        }
      }

      return true;
    } catch (error) {
      throw new Error('Error al actualizar la rutina');
    }
  }

  async deleteRoutine(id: number): Promise<boolean> {
    try {
      const result = await this.routineRepo.softDelete(id);
      return !!result.affected && result.affected > 0;
    } catch (error) {
      throw new Error('Error al eliminar la rutina');
    }
  }

  async getRoutineById(id: number): Promise<RoutineDomain | null> {
    try {
      const r = await this.routineRepo.findOne({
        where: { id_routine: id, is_active: true },
        relations: ['routineExercises', 'routineExercises.exercise'],
      });
      return r ? this.toDomain(r) : null;
    } catch (error) {
      throw new Error('Error al obtener la rutina');
    }
  }

  async getAllRoutines(): Promise<RoutineDomain[]> {
    try {
      const routines = await this.routineRepo.find({
        where: { is_active: true },
        relations: ['routineExercises', 'routineExercises.exercise'],
      });
      return routines.map((r) => this.toDomain(r));
    } catch (error) {
      throw new Error('Error al obtener las rutinas');
    }
  }

  async countActiveRoutinesByUser(userId: number): Promise<number> {
    try {
      return await this.routineRepo.count({ where: { assigned_user_id: userId, is_active: true } });
    } catch (error) {
      throw new Error('Error al contar las rutinas del usuario');
    }
  }
}
