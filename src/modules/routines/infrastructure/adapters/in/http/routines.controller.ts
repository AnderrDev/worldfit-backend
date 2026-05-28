import { NextFunction, Request, Response } from 'express';
import {
  CreateRoutinePort,
  ListRoutinesPort
} from '../../../../domain/ports/in/routines.port';

export class RoutinesController {
  constructor(
    private readonly listRoutines: ListRoutinesPort,
    private readonly createRoutine: CreateRoutinePort
  ) {}

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.listRoutines.execute();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.createRoutine.execute(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  };
}
