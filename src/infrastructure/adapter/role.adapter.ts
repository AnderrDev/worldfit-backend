import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Role as RoleEntity } from '../entities/Role';
import { Role as RoleDomain } from '../../domain/entities/role';
import { RolePort } from '../../domain/role.port';

export class RoleAdapter implements RolePort {
  private repo: Repository<RoleEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(RoleEntity);
  }

  private toDomain(r: RoleEntity): RoleDomain {
    return { id: r.id_role, name: r.name_role, description: r.description };
  }

  async createRole(role: Omit<RoleDomain, 'id'>): Promise<number> {
    try {
      const entity = new RoleEntity();
      entity.name_role = role.name;
      entity.description = role.description ?? '';
      const saved = await this.repo.save(entity);
      return saved.id_role;
    } catch (error) {
      throw new Error('Error al crear el rol');
    }
  }

  async updateRole(id: number, role: Partial<RoleDomain>): Promise<boolean> {
    try {
      const existing = await this.repo.findOne({ where: { id_role: id } });
      if (!existing) return false;
      if (role.name != null) existing.name_role = role.name;
      if (role.description != null) existing.description = role.description;
      await this.repo.save(existing);
      return true;
    } catch (error) {
      throw new Error('Error al actualizar el rol');
    }
  }

  async deleteRole(id: number): Promise<boolean> {
    try {
      const existing = await this.repo.findOne({ where: { id_role: id } });
      if (!existing) return false;
      await this.repo.remove(existing);
      return true;
    } catch (error: any) {
      if (error?.code === '23503') {
        const { BusinessError } = await import('../../shared/business-error');
        throw new BusinessError('No se puede eliminar el rol porque esta asignado a uno o mas usuarios', 409);
      }
      throw new Error('Error al eliminar el rol');
    }
  }

  async getRoleById(id: number): Promise<RoleDomain | null> {
    try {
      const r = await this.repo.findOne({ where: { id_role: id } });
      return r ? this.toDomain(r) : null;
    } catch (error) {
      throw new Error('Error al obtener el rol');
    }
  }

  async getRoleByName(name: string): Promise<RoleDomain | null> {
    try {
      const r = await this.repo.findOne({ where: { name_role: name } });
      return r ? this.toDomain(r) : null;
    } catch (error) {
      throw new Error('Error al obtener el rol');
    }
  }

  async getAllRoles(): Promise<RoleDomain[]> {
    try {
      return (await this.repo.find()).map((r) => this.toDomain(r));
    } catch (error) {
      throw new Error('Error al obtener los roles');
    }
  }
}
