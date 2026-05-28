import { randomUUID } from 'crypto';
import { ValidationError } from '@shared/domain/errors';
import {
  CreateRoutineCommand,
  CreateRoutinePort,
  RoutineDto
} from '../../domain/ports/in/routines.port';
import { RoutineRepositoryPort } from '../../domain/ports/out/routine-repository.port';
import { Routine } from '../../domain/entities/routine.entity';

export class CreateRoutineUseCase implements CreateRoutinePort {
  constructor(private readonly routineRepository: RoutineRepositoryPort) {}

  async execute(cmd: CreateRoutineCommand): Promise<RoutineDto> {
    if (!cmd.name?.trim()) {
      throw new ValidationError('Nombre de la rutina es obligatorio');
    }
    if (!cmd.ownerId) {
      throw new ValidationError('ownerId es obligatorio');
    }
    const routine = new Routine({
      id: randomUUID(),
      name: cmd.name.trim(),
      description: cmd.description ?? '',
      difficulty: cmd.difficulty ?? 'beginner',
      exerciseIds: cmd.exerciseIds ?? [],
      ownerId: cmd.ownerId,
      createdAt: new Date()
    });
    const saved = await this.routineRepository.save(routine);
    return saved.toPlain();
  }
}
