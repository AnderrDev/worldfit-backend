import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Goal as GoalEntity } from '../entities/Goal';
import { Goal as GoalDomain } from '../../domain/entities/goal';
import { GoalPort } from '../../domain/goal.port';

export class GoalAdapter implements GoalPort {
  private goalRepository: Repository<GoalEntity>;

  constructor() {
    this.goalRepository = AppDataSource.getRepository(GoalEntity);
  }

  private toDomain(goal: GoalEntity): GoalDomain {
    return {
      id: goal.id_goal,
      name: goal.name_goal,
      description: goal.description,
    };
  }

  private toEntity(goal: Omit<GoalDomain, 'id'>): GoalEntity {
    const entity = new GoalEntity();
    entity.name_goal = goal.name;
    entity.description = goal.description;
    return entity;
  }

  async createGoal(goal: Omit<GoalDomain, 'id'>): Promise<number> {
    try {
      const saved = await this.goalRepository.save(this.toEntity(goal));
      return saved.id_goal;
    } catch (error) {
      throw new Error('Error al crear el objetivo');
    }
  }

  async updateGoal(id: number, goal: Partial<GoalDomain>): Promise<boolean> {
    try {
      const existing = await this.goalRepository.findOne({ where: { id_goal: id } });
      if (!existing) return false;

      if (goal.name != null) existing.name_goal = goal.name;
      if (goal.description != null) existing.description = goal.description;

      await this.goalRepository.save(existing);
      return true;
    } catch (error) {
      throw new Error('Error al actualizar el objetivo');
    }
  }

  // BORRADO LOGICO con softDelete: marca deleted_at.
  async deleteGoal(id: number): Promise<boolean> {
    try {
      const result = await this.goalRepository.softDelete(id);
      return !!result.affected && result.affected > 0;
    } catch (error) {
      throw new Error('Error al eliminar el objetivo');
    }
  }

  async getGoalById(id: number): Promise<GoalDomain | null> {
    try {
      const goal = await this.goalRepository.findOne({ where: { id_goal: id } });
      return goal ? this.toDomain(goal) : null;
    } catch (error) {
      throw new Error('Error al obtener el objetivo');
    }
  }

  async getGoalByName(name: string): Promise<GoalDomain | null> {
    try {
      const goal = await this.goalRepository.findOne({ where: { name_goal: name } });
      return goal ? this.toDomain(goal) : null;
    } catch (error) {
      throw new Error('Error al obtener el objetivo');
    }
  }

  async getAllGoals(): Promise<GoalDomain[]> {
    try {
      const goals = await this.goalRepository.find();
      return goals.map((g) => this.toDomain(g));
    } catch (error) {
      throw new Error('Error al obtener los objetivos');
    }
  }
}
