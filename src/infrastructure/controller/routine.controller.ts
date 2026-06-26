import { Request, Response } from 'express';
import { RoutineApplication } from '../../application/routine.application';
import { validateRoutineData } from '../util/routine-validation';
import { validateRoutineUpdate } from '../util/routine-update-validation';

export class RoutineController {
  private app: RoutineApplication;

  constructor(app: RoutineApplication) {
    this.app = app;
  }

  async createRoutine(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = validateRoutineData(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const routineId = await this.app.createRoutine(value as any);
      return res.status(201).json({ message: 'Rutina creada con exito', routineId });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async getAllRoutines(_req: Request, res: Response): Promise<Response> {
    try {
      const routines = await this.app.getAllRoutines();
      return res.status(200).json(routines);
    } catch (error) {
      return res.status(500).json({ message: 'Error en la consulta de datos' });
    }
  }

  async getRoutineById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const routine = await this.app.getRoutineById(id);
      if (!routine) {
        return res.status(404).json({ message: 'Rutina no encontrada' });
      }
      return res.status(200).json(routine);
    } catch (error) {
      return res.status(500).json({ message: 'Error en la consulta de datos' });
    }
  }

  async updateRoutine(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const { error, value } = validateRoutineUpdate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const updated = await this.app.updateRoutine(id, value as any);
      if (!updated) {
        return res.status(404).json({ message: 'Rutina no encontrada o sin cambios' });
      }
      return res.status(200).json({ message: 'Rutina actualizada correctamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deleteRoutine(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const deleted = await this.app.deleteRoutine(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Rutina no encontrada' });
      }
      return res.status(200).json({ message: 'Rutina dada de baja' });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
