import { Router } from 'express';
import { RoutinesController } from './routines.controller';
import { ListRoutinesUseCase } from '../../../../application/use-cases/list-routines.use-case';
import { CreateRoutineUseCase } from '../../../../application/use-cases/create-routine.use-case';
import { MongoRoutineRepository } from '../../out/persistence/mongo-routine.repository';

export function buildRoutinesRouter(): Router {
  const routineRepository = new MongoRoutineRepository();
  const listRoutines = new ListRoutinesUseCase(routineRepository);
  const createRoutine = new CreateRoutineUseCase(routineRepository);
  const controller = new RoutinesController(listRoutines, createRoutine);

  const router = Router();
  router.get('/', controller.list);
  router.post('/', controller.create);
  return router;
}
