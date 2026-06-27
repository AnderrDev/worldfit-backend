import { RolePort } from '../domain/role.port';
import { Role } from '../domain/entities/role';
import { BusinessError } from '../shared/business-error';

export class RoleApplication {
  private port: RolePort;

  constructor(port: RolePort) {
    this.port = port;
  }

  async createRole(role: Omit<Role, 'id'>): Promise<number> {
    const existing = await this.port.getRoleByName(role.name);
    if (existing) {
      throw new BusinessError('Ya existe un rol con ese nombre', 409);
    }
    return this.port.createRole(role);
  }

  async updateRole(id: number, role: Partial<Role>): Promise<boolean> {
    const existing = await this.port.getRoleById(id);
    if (!existing) {
      throw new BusinessError('Rol no encontrado', 404);
    }
    if (role.name && role.name !== existing.name) {
      const duplicate = await this.port.getRoleByName(role.name);
      if (duplicate) {
        throw new BusinessError('Ya existe un rol con ese nombre', 409);
      }
    }
    return this.port.updateRole(id, role);
  }

  async deleteRole(id: number): Promise<boolean> {
    const existing = await this.port.getRoleById(id);
    if (!existing) {
      throw new BusinessError('Rol no encontrado', 404);
    }
    return this.port.deleteRole(id);
  }

  async getRoleById(id: number): Promise<Role | null> {
    return this.port.getRoleById(id);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.port.getAllRoles();
  }
}
