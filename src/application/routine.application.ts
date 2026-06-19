import { RoutinePort } from '../domain/routine.port';
import { Routine } from '../domain/entities/routine';

export class RoutineApplication {
  private port: RoutinePort;

  constructor(port: RoutinePort) {
    this.port = port;
  }

  async createRoutine(routine: Omit<Routine, 'id'>): Promise<number> {
    return this.port.createRoutine(routine);
  }

  async updateRoutine(id: number, routine: Partial<Routine>): Promise<boolean> {
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
}
