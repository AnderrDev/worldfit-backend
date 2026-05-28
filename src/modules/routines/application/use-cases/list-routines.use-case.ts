import { ListRoutinesPort, RoutineDto } from '../../domain/ports/in/routines.port';
import { RoutineRepositoryPort } from '../../domain/ports/out/routine-repository.port';

export class ListRoutinesUseCase implements ListRoutinesPort {
  constructor(private readonly routineRepository: RoutineRepositoryPort) {}

  async execute(): Promise<RoutineDto[]> {
    const list = await this.routineRepository.findAll();
    return list.map((r) => r.toPlain());
  }
}
