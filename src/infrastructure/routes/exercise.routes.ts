import { Router } from 'express';
import { ExerciseAdapter } from '../adapter/exercise.adapter';
import { ExerciseApplication } from '../../application/exercise.application';
import { ExerciseController } from '../controller/exercise.controller';
import { authenticateToken } from '../web/auth.middleware';

const router = Router();

// Cadena de inyeccion de dependencias: adapter -> application -> controller
const exerciseAdapter = new ExerciseAdapter();
const exerciseApplication = new ExerciseApplication(exerciseAdapter);
const exerciseController = new ExerciseController(exerciseApplication);

// Todas las rutas de ejercicios protegidas con JWT
router.post('/exercises', authenticateToken, (req, res) => exerciseController.createExercise(req, res));
router.get('/exercises', authenticateToken, (req, res) => exerciseController.getAllExercises(req, res));
router.get('/exercises/:id', authenticateToken, (req, res) => exerciseController.getExerciseById(req, res));
router.put('/exercises/:id', authenticateToken, (req, res) => exerciseController.updateExercise(req, res));
router.delete('/exercises/:id', authenticateToken, (req, res) => exerciseController.deleteExercise(req, res));

export default router;
