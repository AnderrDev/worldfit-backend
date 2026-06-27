import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User as UserEntity } from '../entities/User';
import { User as UserDomain } from '../../domain/entities/user';
import { UserPort } from '../../domain/user.port';

export class UserAdapter implements UserPort {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  private toDomain(user: UserEntity): UserDomain {
    return {
      id: user.id_user,
      roleId: user.role_id,
      role: user.role?.name_role,
      name: user.name_user,
      email: user.email,
      password: user.password,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  private toEntity(user: Omit<UserDomain, 'id'>): UserEntity {
    const entity = new UserEntity();
    entity.role_id = user.roleId ?? 1;
    entity.name_user = user.name;
    entity.email = user.email;
    entity.password = user.password;
    entity.is_active = user.isActive ?? true;
    return entity;
  }

  async createUser(user: Omit<UserDomain, 'id'>): Promise<number> {
    try {
      const saved = await this.userRepository.save(this.toEntity(user));
      return saved.id_user;
    } catch (error) {
      throw new Error('Error al crear el usuario');
    }
  }

  async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
    try {
      const existing = await this.userRepository.findOne({ where: { id_user: id }, relations: ['role'] });
      if (!existing) return false;
      if (user.name != null) existing.name_user = user.name;
      if (user.email != null) existing.email = user.email;
      if (user.password != null) existing.password = user.password;
      if (user.roleId != null) existing.role_id = user.roleId;
      if (user.isActive != null) existing.is_active = user.isActive;
      await this.userRepository.save(existing);
      return true;
    } catch (error) {
      throw new Error('Error al actualizar el usuario');
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await this.userRepository.softDelete(id);
      return !!result.affected && result.affected > 0;
    } catch (error) {
      throw new Error('Error al eliminar el usuario');
    }
  }

  async getUserById(id: number): Promise<UserDomain | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id_user: id, is_active: true }, relations: ['role'] });
      return user ? this.toDomain(user) : null;
    } catch (error) {
      throw new Error('Error al obtener el usuario');
    }
  }

  async getUserByEmail(email: string): Promise<UserDomain | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email, is_active: true }, relations: ['role'] });
      return user ? this.toDomain(user) : null;
    } catch (error) {
      throw new Error('Error al obtener el usuario');
    }
  }

  async getAllUsers(): Promise<UserDomain[]> {
    try {
      const users = await this.userRepository.find({ where: { is_active: true }, relations: ['role'] });
      return users.map((u) => this.toDomain(u));
    } catch (error) {
      throw new Error('Error al obtener los usuarios');
    }
  }
}
