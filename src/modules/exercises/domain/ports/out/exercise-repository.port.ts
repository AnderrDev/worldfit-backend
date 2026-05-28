import { Exercise } from '../../entities/exercise.entity';

export interface ExerciseRepositoryPort {
  findAll(): Promise<Exercise[]>;
  findById(id: string): Promise<Exercise | null>;
  save(exercise: Exercise): Promise<Exercise>;
}
