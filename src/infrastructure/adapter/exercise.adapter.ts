import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Exercise as ExerciseEntity } from '../entities/Exercise';
import { Exercise as ExerciseDomain, MuscleGroup } from '../../domain/entities/exercise';
import { ExercisePort } from '../../domain/exercise.port';

export class ExerciseAdapter implements ExercisePort {
  private exerciseRepository: Repository<ExerciseEntity>;

  constructor() {
    this.exerciseRepository = AppDataSource.getRepository(ExerciseEntity);
  }

  private toDomain(e: ExerciseEntity): ExerciseDomain {
    return {
      id: e.id_exercise,
      categoryId: e.category_id,
      categoryName: e.category?.name_category,
      name: e.name_exercise,
      description: e.description,
      muscleGroup: e.muscle_group as MuscleGroup,
      sets: e.sets,
      reps: e.reps,
      isActive: e.is_active,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    };
  }

  private toEntity(e: Omit<ExerciseDomain, 'id'>): ExerciseEntity {
    const entity = new ExerciseEntity();
    entity.category_id = e.categoryId;
    entity.name_exercise = e.name;
    entity.description = e.description;
    entity.muscle_group = e.muscleGroup;
    entity.sets = e.sets;
    entity.reps = e.reps;
    entity.is_active = e.isActive ?? true;
    return entity;
  }

  async createExercise(exercise: Omit<ExerciseDomain, 'id'>): Promise<number> {
    try {
      const saved = await this.exerciseRepository.save(this.toEntity(exercise));
      return saved.id_exercise;
    } catch (error) {
      throw new Error('Error al crear el ejercicio');
    }
  }

  async updateExercise(id: number, exercise: Partial<ExerciseDomain>): Promise<boolean> {
    try {
      const existing = await this.exerciseRepository.findOne({ where: { id_exercise: id } });
      if (!existing) return false;

      if (exercise.categoryId != null) existing.category_id = exercise.categoryId;
      if (exercise.name != null) existing.name_exercise = exercise.name;
      if (exercise.description != null) existing.description = exercise.description;
      if (exercise.muscleGroup != null) existing.muscle_group = exercise.muscleGroup;
      if (exercise.sets != null) existing.sets = exercise.sets;
      if (exercise.reps != null) existing.reps = exercise.reps;
      if (exercise.isActive != null) existing.is_active = exercise.isActive;

      await this.exerciseRepository.save(existing);
      return true;
    } catch (error) {
      throw new Error('Error al actualizar el ejercicio');
    }
  }

  async deleteExercise(id: number): Promise<boolean> {
    try {
      const result = await this.exerciseRepository.softDelete(id);
      return !!result.affected && result.affected > 0;
    } catch (error) {
      throw new Error('Error al eliminar el ejercicio');
    }
  }

  async getExerciseById(id: number): Promise<ExerciseDomain | null> {
    try {
      const exercise = await this.exerciseRepository.findOne({
        where: { id_exercise: id, is_active: true },
      });
      return exercise ? this.toDomain(exercise) : null;
    } catch (error) {
      throw new Error('Error al obtener el ejercicio');
    }
  }

  async getAllExercises(): Promise<ExerciseDomain[]> {
    try {
      const exercises = await this.exerciseRepository.find({ where: { is_active: true } });
      return exercises.map((e) => this.toDomain(e));
    } catch (error) {
      throw new Error('Error al obtener los ejercicios');
    }
  }
}
