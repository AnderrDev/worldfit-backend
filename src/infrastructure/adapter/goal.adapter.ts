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

  private toDomain(g: GoalEntity): GoalDomain {
    return {
      id: g.id_goal,
      userId: g.user_id,
      name: g.name_goal,
      description: g.description,
      isActive: g.is_active,
      createdAt: g.created_at,
      updatedAt: g.updated_at,
    };
  }

  private toEntity(g: Omit<GoalDomain, 'id'>): GoalEntity {
    const entity = new GoalEntity();
    entity.user_id = g.userId;
    entity.name_goal = g.name;
    entity.description = g.description ?? '';
    entity.is_active = g.isActive ?? true;
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
      if (goal.userId != null) existing.user_id = goal.userId;
      if (goal.name != null) existing.name_goal = goal.name;
      if (goal.description != null) existing.description = goal.description;
      if (goal.isActive != null) existing.is_active = goal.isActive;
      await this.goalRepository.save(existing);
      return true;
    } catch (error) {
      throw new Error('Error al actualizar el objetivo');
    }
  }

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
      const g = await this.goalRepository.findOne({ where: { id_goal: id, is_active: true } });
      return g ? this.toDomain(g) : null;
    } catch (error) {
      throw new Error('Error al obtener el objetivo');
    }
  }

  async getGoalByName(name: string): Promise<GoalDomain | null> {
    try {
      const g = await this.goalRepository.findOne({ where: { name_goal: name, is_active: true } });
      return g ? this.toDomain(g) : null;
    } catch (error) {
      throw new Error('Error al obtener el objetivo');
    }
  }

  async getGoalByNameAndUserId(name: string, userId: number): Promise<GoalDomain | null> {
    try {
      const g = await this.goalRepository.findOne({
        where: { name_goal: name, user_id: userId, is_active: true },
      });
      return g ? this.toDomain(g) : null;
    } catch (error) {
      throw new Error('Error al obtener el objetivo');
    }
  }

  async getAllGoals(): Promise<GoalDomain[]> {
    try {
      const goals = await this.goalRepository.find({ where: { is_active: true } });
      return goals.map((g) => this.toDomain(g));
    } catch (error) {
      throw new Error('Error al obtener los objetivos');
    }
  }
}
