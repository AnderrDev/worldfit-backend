import { RoutinePort } from '../domain/routine.port';
import { UserPort } from '../domain/user.port';
import { Routine } from '../domain/entities/routine';
import { BusinessError } from '../shared/business-error';

// Maximo de rutinas activas que puede tener asignadas un usuario a la vez.
const MAX_RUTINAS_ACTIVAS = 5;

// Resultado del flujo de aprobacion, para que el controlador elija el codigo HTTP.
export type DecisionResult = 'ok' | 'not_found' | 'forbidden' | 'already';

export class RoutineApplication {
  private port: RoutinePort;
  private userPort: UserPort;

  constructor(port: RoutinePort, userPort: UserPort) {
    this.port = port;
    this.userPort = userPort;
  }

  async createRoutine(routine: Omit<Routine, 'id'>): Promise<number> {
    // Regla: el usuario asignado debe existir y estar activo.
    await this.validarUsuarioAsignado(routine.assignedUserId);

    // Regla: limite de rutinas activas por usuario.
    const activas = await this.port.countActiveRoutinesByUser(routine.assignedUserId);
    if (activas >= MAX_RUTINAS_ACTIVAS) {
      throw new BusinessError(
        `El usuario ya tiene el maximo de ${MAX_RUTINAS_ACTIVAS} rutinas activas`,
      );
    }

    // Toda rutina nueva nace pendiente de aprobacion.
    routine.assignmentStatus = 'pending';
    return this.port.createRoutine(routine);
  }

  async updateRoutine(id: number, routine: Partial<Routine>): Promise<boolean> {
    // Si se reasigna a otro usuario, validar que exista y este activo.
    if (routine.assignedUserId != null) {
      await this.validarUsuarioAsignado(routine.assignedUserId);
    }
    return this.port.updateRoutine(id, routine);
  }

  async deleteRoutine(id: number): Promise<boolean> {
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
    // getUserById ya filtra por status=1, asi que null = no existe o esta inactivo.
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new BusinessError('El usuario asignado no existe o no esta activo');
    }
  }
}
