import { Difficulty } from '../../entities/routine.entity';

export interface RoutineDto {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  exerciseIds: string[];
  ownerId: string;
  createdAt: string;
}

export interface CreateRoutineCommand {
  name: string;
  description: string;
  difficulty: Difficulty;
  exerciseIds: string[];
  ownerId: string;
}

export interface ListRoutinesPort {
  execute(): Promise<RoutineDto[]>;
}

export interface CreateRoutinePort {
  execute(cmd: CreateRoutineCommand): Promise<RoutineDto>;
}
