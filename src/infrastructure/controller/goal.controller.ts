import { Request, Response } from 'express';
import { GoalApplication } from '../../application/goal.application';
import { validateGoalData } from '../util/goal-validation';
import { validateGoalUpdate } from '../util/goal-update-validation';
import { handleError, parseId } from '../web/http-response';

export class GoalController {
  private app: GoalApplication;

  constructor(app: GoalApplication) {
    this.app = app;
  }

  async createGoal(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = validateGoalData(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const goalId = await this.app.createGoal(value);
      return res.status(201).json({ message: 'Objetivo creado con exito', goalId });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAllGoals(_req: Request, res: Response): Promise<Response> {
    try {
      const goals = await this.app.getAllGoals();
      return res.status(200).json(goals);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getGoalById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const goal = await this.app.getGoalById(id);
      if (!goal) {
        return res.status(404).json({ message: 'Objetivo no encontrado' });
      }
      return res.status(200).json(goal);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateGoal(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const { error, value } = validateGoalUpdate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      await this.app.updateGoal(id, value);
      return res.status(200).json({ message: 'Objetivo actualizado correctamente' });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async deleteGoal(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      await this.app.deleteGoal(id);
      return res.status(200).json({ message: 'Objetivo dado de baja' });
    } catch (error) {
      return handleError(res, error);
    }
  }
}
