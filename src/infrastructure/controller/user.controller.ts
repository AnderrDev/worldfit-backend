import { Request, Response } from 'express';
import { UserApplication } from '../../application/user.application';
import { User } from '../../domain/entities/user';
import { validateUserData } from '../util/user-validation';
import { validateUserUpdate } from '../util/user-update-validation';
import { validateEmail } from '../util/email-validation';
import { handleError, parseId } from '../web/http-response';

function toPublicUser(user: User) {
  const { password, ...rest } = user;
  return rest;
}

export class UserController {
  private app: UserApplication;

  constructor(app: UserApplication) {
    this.app = app;
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = validateUserData(req.body);
      if (error) return res.status(400).json({ message: error.message });
      const userId = await this.app.createUser(value as any);
      return res.status(201).json({ message: 'Usuario creado con exito', userId });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email y contrasena son requeridos' });
      const token = await this.app.login(email, password);
      return res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }
  }

  async getAllUsers(_req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.app.getAllUsers();
      return res.status(200).json(users.map(toPublicUser));
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) return res.status(400).json({ message: 'ID invalido' });
      const user = await this.app.getUserById(id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      return res.status(200).json(toPublicUser(user));
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = validateEmail(req.params.email);
      if (error) return res.status(400).json({ message: 'El email no tiene un formato valido' });
      const user = await this.app.getUserByEmail(req.params.email);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      return res.status(200).json(toPublicUser(user));
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) return res.status(400).json({ message: 'ID invalido' });

      const requester = (req as any).user;
      if (requester?.role !== 'admin' && requester?.id !== id) {
        return res.status(403).json({ message: 'Solo puedes modificar tu propio perfil' });
      }

      const { error, value } = validateUserUpdate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      await this.app.updateUser(id, value as any);
      return res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) return res.status(400).json({ message: 'ID invalido' });

      const requester = (req as any).user;
      if (requester?.role !== 'admin' && requester?.id !== id) {
        return res.status(403).json({ message: 'Solo puedes dar de baja tu propio usuario' });
      }

      await this.app.deleteUser(id);
      return res.status(200).json({ message: 'Usuario dado de baja' });
    } catch (error) {
      return handleError(res, error);
    }
  }
}
