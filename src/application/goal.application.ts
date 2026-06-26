import { GoalPort } from '../domain/goal.port';
import { Goal } from '../domain/entities/goal';

export class GoalApplication {
  private port: GoalPort;

  constructor(port: GoalPort) {
    this.port = port;
  }

  async createGoal(goal: Omit<Goal, 'id'>): Promise<number> {
    return this.port.createGoal(goal);
  }

  async updateGoal(id: number, goal: Partial<Goal>): Promise<boolean> {
    return this.port.updateGoal(id, goal);
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.port.deleteGoal(id);
  }

  async getGoalById(id: number): Promise<Goal | null> {
    return this.port.getGoalById(id);
  }

  async getAllGoals(): Promise<Goal[]> {
    return this.port.getAllGoals();
  }
}
