import { Router } from 'express';
import { ExercisesController } from './exercises.controller';
import { ListExercisesUseCase } from '../../../../application/use-cases/list-exercises.use-case';
import { CreateExerciseUseCase } from '../../../../application/use-cases/create-exercise.use-case';
import { MongoExerciseRepository } from '../../out/persistence/mongo-exercise.repository';

export function buildExercisesRouter(): Router {
  const exerciseRepository = new MongoExerciseRepository();
  const listExercises = new ListExercisesUseCase(exerciseRepository);
  const createExercise = new CreateExerciseUseCase(exerciseRepository);
  const controller = new ExercisesController(listExercises, createExercise);

  const router = Router();
  router.get('/', controller.list);
  router.post('/', controller.create);
  return router;
}
