import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Routine as RoutineEntity } from '../entities/Routine';
import { Routine as RoutineDomain, Difficulty } from '../../domain/entities/routine';
import { RoutinePort } from '../../domain/routine.port';

export class RoutineAdapter implements RoutinePort {
  private routineRepository: Repository<RoutineEntity>;

  constructor() {
    this.routineRepository = AppDataSource.getRepository(RoutineEntity);
  }

  private toDomain(routine: RoutineEntity): RoutineDomain {
    return {
      id: routine.id_routine,
      name: routine.name_routine,
      description: routine.description,
      difficulty: routine.difficulty as Difficulty,
      // simple-array guarda como texto; lo volvemos a numeros.
      exerciseIds: (routine.exercise_ids ?? []).map((value) => Number(value)),
      ownerId: routine.owner_id,
      status: routine.status_routine,
    };
  }

  private toEntity(routine: Omit<RoutineDomain, 'id'>): RoutineEntity {
    const entity = new RoutineEntity();
    entity.name_routine = routine.name;
    entity.description = routine.description;
    entity.difficulty = routine.difficulty;
    entity.exercise_ids = routine.exerciseIds;
    entity.owner_id = routine.ownerId;
    entity.status_routine = routine.status ?? 1;
    return entity;
  }

  async createRoutine(routine: Omit<RoutineDomain, 'id'>): Promise<number> {
    try {
      const newRoutine = this.toEntity(routine);
      const saved = await this.routineRepository.save(newRoutine);
      return saved.id_routine;
    } catch (error) {
      throw new Error('Error al crear la rutina');
    }
  }

  async updateRoutine(id: number, routine: Partial<RoutineDomain>): Promise<boolean> {
    try {
      const existing = await this.routineRepository.findOne({ where: { id_routine: id } });
      if (!existing) return false;

      if (routine.name != null) existing.name_routine = routine.name;
      if (routine.description != null) existing.description = routine.description;
      if (routine.difficulty != null) existing.difficulty = routine.difficulty;
      if (routine.exerciseIds != null) existing.exercise_ids = routine.exerciseIds;
      if (routine.ownerId != null) existing.owner_id = routine.ownerId;
      if (routine.status != null) existing.status_routine = routine.status;

      await this.routineRepository.save(existing);
      return true;
    } catch (error) {
      throw new Error('Error al actualizar la rutina');
    }
  }

  // BORRADO LOGICO: status en 0
  async deleteRoutine(id: number): Promise<boolean> {
    try {
      const existing = await this.routineRepository.findOne({ where: { id_routine: id } });
      if (!existing) return false;
      existing.status_routine = 0;
      await this.routineRepository.save(existing);
      return true;
    } catch (error) {
      throw new Error('Error al eliminar la rutina');
    }
  }

  async getRoutineById(id: number): Promise<RoutineDomain | null> {
    try {
      const routine = await this.routineRepository.findOne({ where: { id_routine: id } });
      return routine ? this.toDomain(routine) : null;
    } catch (error) {
      throw new Error('Error al obtener la rutina');
    }
  }

  async getAllRoutines(): Promise<RoutineDomain[]> {
    try {
      const routines = await this.routineRepository.find();
      return routines.map((r) => this.toDomain(r));
    } catch (error) {
      throw new Error('Error al obtener las rutinas');
    }
  }
}
