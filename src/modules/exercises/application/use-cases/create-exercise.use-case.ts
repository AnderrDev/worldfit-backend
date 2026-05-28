import { randomUUID } from 'crypto';
import { ValidationError } from '@shared/domain/errors';
import {
  CreateExerciseCommand,
  CreateExercisePort,
  ExerciseDto
} from '../../domain/ports/in/exercises.port';
import { ExerciseRepositoryPort } from '../../domain/ports/out/exercise-repository.port';
import { Exercise } from '../../domain/entities/exercise.entity';

export class CreateExerciseUseCase implements CreateExercisePort {
  constructor(private readonly exerciseRepository: ExerciseRepositoryPort) {}

  async execute(cmd: CreateExerciseCommand): Promise<ExerciseDto> {
    if (!cmd.name?.trim()) {
      throw new ValidationError('Nombre del ejercicio es obligatorio');
    }
    if (cmd.sets <= 0 || cmd.reps <= 0) {
      throw new ValidationError('sets y reps deben ser mayores que 0');
    }
    const exercise = new Exercise({
      id: randomUUID(),
      name: cmd.name.trim(),
      muscleGroup: cmd.muscleGroup,
      sets: cmd.sets,
      reps: cmd.reps
    });
    const saved = await this.exerciseRepository.save(exercise);
    return saved.toPlain();
  }
}
