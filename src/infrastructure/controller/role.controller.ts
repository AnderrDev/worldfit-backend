import { Request, Response } from 'express';
import { RoleApplication } from '../../application/role.application';
import { validateRoleData } from '../util/role-validation';
import { validateRoleUpdate } from '../util/role-update-validation';
import { BusinessError } from '../../shared/business-error';

export class RoleController {
  private app: RoleApplication;

  constructor(app: RoleApplication) {
    this.app = app;
  }

  async createRole(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = validateRoleData(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const roleId = await this.app.createRole(value as any);
      return res.status(201).json({ message: 'Rol creado con exito', roleId });
    } catch (error) {
      if (error instanceof BusinessError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async getAllRoles(_req: Request, res: Response): Promise<Response> {
    try {
      const roles = await this.app.getAllRoles();
      return res.status(200).json(roles);
    } catch (error) {
      return res.status(500).json({ message: 'Error en la consulta de datos' });
    }
  }

  async getRoleById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const role = await this.app.getRoleById(id);
      if (!role) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      return res.status(200).json(role);
    } catch (error) {
      return res.status(500).json({ message: 'Error en la consulta de datos' });
    }
  }

  async updateRole(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const { error, value } = validateRoleUpdate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const updated = await this.app.updateRole(id, value as any);
      if (!updated) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      return res.status(200).json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
      if (error instanceof BusinessError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deleteRole(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const deleted = await this.app.deleteRole(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      return res.status(200).json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      if (error instanceof BusinessError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
