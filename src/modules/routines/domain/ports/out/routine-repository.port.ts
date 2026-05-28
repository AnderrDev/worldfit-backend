import { Routine } from '../../entities/routine.entity';

export interface RoutineRepositoryPort {
  findAll(): Promise<Routine[]>;
  findById(id: string): Promise<Routine | null>;
  save(routine: Routine): Promise<Routine>;
  delete(id: string): Promise<void>;
}
