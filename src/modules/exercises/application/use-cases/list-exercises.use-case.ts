import { ExerciseDto, ListExercisesPort } from '../../domain/ports/in/exercises.port';
import { ExerciseRepositoryPort } from '../../domain/ports/out/exercise-repository.port';

export class ListExercisesUseCase implements ListExercisesPort {
  constructor(private readonly exerciseRepository: ExerciseRepositoryPort) {}

  async execute(): Promise<ExerciseDto[]> {
    const list = await this.exerciseRepository.findAll();
    return list.map((e) => e.toPlain());
  }
}
