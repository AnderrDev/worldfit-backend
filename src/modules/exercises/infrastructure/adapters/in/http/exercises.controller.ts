import { NextFunction, Request, Response } from 'express';
import {
  CreateExercisePort,
  ListExercisesPort
} from '../../../../domain/ports/in/exercises.port';

export class ExercisesController {
  constructor(
    private readonly listExercises: ListExercisesPort,
    private readonly createExercise: CreateExercisePort
  ) {}

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.listExercises.execute();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.createExercise.execute(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  };
}
