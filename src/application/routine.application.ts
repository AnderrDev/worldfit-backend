import { RoutinePort } from '../domain/routine.port';
import { UserPort } from '../domain/user.port';
import { ExercisePort } from '../domain/exercise.port';
import { Routine } from '../domain/entities/routine';
import { BusinessError } from '../shared/business-error';

// Maximo de rutinas activas que puede tener asignadas un usuario a la vez.
const MAX_RUTINAS_ACTIVAS = 5;

// Resultado del flujo de aprobacion, para que el controlador elija el codigo HTTP.
export type DecisionResult = 'ok' | 'not_found' | 'forbidden' | 'already';

export class RoutineApplication {
  private port: RoutinePort;
  private userPort: UserPort;
  private exercisePort: ExercisePort;

  constructor(port: RoutinePort, userPort: UserPort, exercisePort: ExercisePort) {
    this.port = port;
    this.userPort = userPort;
    this.exercisePort = exercisePort;
  }

  async createRoutine(routine: Omit<Routine, 'id'>): Promise<number> {
    await this.validarUsuarioAsignado(routine.assignedUserId);
    await this.validarEjercicios(routine.exercises?.map((e) => e.exerciseId) ?? []);

    const activas = await this.port.countActiveRoutinesByUser(routine.assignedUserId);
    if (activas >= MAX_RUTINAS_ACTIVAS) {
      throw new BusinessError(
        `El usuario ya tiene el maximo de ${MAX_RUTINAS_ACTIVAS} rutinas activas`,
      );
    }

    routine.assignmentStatus = 'pending';
    return this.port.createRoutine(routine);
  }

  async updateRoutine(id: number, routine: Partial<Routine>): Promise<boolean> {
    const existing = await this.port.getRoutineById(id);
    if (!existing) {
      throw new BusinessError('Rutina no encontrada', 404);
    }
    if (routine.assignedUserId != null) {
      await this.validarUsuarioAsignado(routine.assignedUserId);
    }
    if (routine.exercises != null) {
      await this.validarEjercicios(routine.exercises.map((e) => e.exerciseId));
    }
    return this.port.updateRoutine(id, routine);
  }

  async deleteRoutine(id: number): Promise<boolean> {
    const existing = await this.port.getRoutineById(id);
    if (!existing) {
      throw new BusinessError('Rutina no encontrada', 404);
    }
    return this.port.deleteRoutine(id);
  }

  async getRoutineById(id: number): Promise<Routine | null> {
    return this.port.getRoutineById(id);
  }

  async getAllRoutines(): Promise<Routine[]> {
    return this.port.getAllRoutines();
  }

  // ---- Flujo de aprobacion ----

  async acceptRoutine(id: number, userId: number): Promise<DecisionResult> {
    return this.decidir(id, userId, 'accepted');
  }

  async rejectRoutine(id: number, userId: number): Promise<DecisionResult> {
    return this.decidir(id, userId, 'rejected');
  }

  // Regla central del flujo: solo el usuario asignado decide, y solo si esta pendiente.
  private async decidir(
    id: number,
    userId: number,
    decision: 'accepted' | 'rejected',
  ): Promise<DecisionResult> {
    const routine = await this.port.getRoutineById(id);
    if (!routine) return 'not_found';
    if (routine.assignedUserId !== userId) return 'forbidden';
    if (routine.assignmentStatus !== 'pending') return 'already';

    await this.port.updateRoutine(id, { assignmentStatus: decision });
    return 'ok';
  }

  private async validarUsuarioAsignado(userId: number): Promise<void> {
    // getUserById excluye los borrados logicamente: null = no existe o esta eliminado.
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new BusinessError('El usuario asignado no existe o no esta activo');
    }
  }

  private async validarEjercicios(ids: number[]): Promise<void> {
    if (!ids || ids.length === 0) return;
    for (const id of ids) {
      const exercise = await this.exercisePort.getExerciseById(id);
      if (!exercise) {
        throw new BusinessError(`El ejercicio con id ${id} no existe o no esta activo`);
      }
    }
  }
}
