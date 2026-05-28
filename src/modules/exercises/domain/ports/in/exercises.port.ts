import { MuscleGroup } from '../../entities/exercise.entity';

export interface ExerciseDto {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
}

export interface CreateExerciseCommand {
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
}

export interface ListExercisesPort {
  execute(): Promise<ExerciseDto[]>;
}

export interface CreateExercisePort {
  execute(cmd: CreateExerciseCommand): Promise<ExerciseDto>;
}
