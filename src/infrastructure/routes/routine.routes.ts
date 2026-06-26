import { Router } from 'express';
import { RoutineAdapter } from '../adapter/routine.adapter';
import { RoutineApplication } from '../../application/routine.application';
import { RoutineController } from '../controller/routine.controller';
import { authenticateToken, requireAdmin } from '../web/auth.middleware';

const router = Router();

// Cadena de inyeccion de dependencias: adapter -> application -> controller
const routineAdapter = new RoutineAdapter();
const routineApplication = new RoutineApplication(routineAdapter);
const routineController = new RoutineController(routineApplication);

// Consultas: cualquier usuario autenticado (JWT).
router.get('/routines', authenticateToken, (req, res) => routineController.getAllRoutines(req, res));
router.get('/routines/:id', authenticateToken, (req, res) => routineController.getRoutineById(req, res));

// Gestion (crear/editar/eliminar): solo administradores.
router.post('/routines', authenticateToken, requireAdmin, (req, res) => routineController.createRoutine(req, res));
router.put('/routines/:id', authenticateToken, requireAdmin, (req, res) => routineController.updateRoutine(req, res));
router.delete('/routines/:id', authenticateToken, requireAdmin, (req, res) => routineController.deleteRoutine(req, res));

export default router;
