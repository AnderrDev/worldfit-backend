import bcrypt from 'bcryptjs';
import { UserPort } from '../domain/user.port';
import { User } from '../domain/entities/user';
import { AuthApplication } from './auth.application';

export class UserApplication {
  private port: UserPort;

  constructor(port: UserPort) {
    this.port = port;
  }

  async createUser(user: Omit<User, 'id'>): Promise<number> {
    // Regla de negocio: el email no debe existir antes de crear.
    const existsUser = await this.port.getUserByEmail(user.email);
    if (existsUser) {
      throw new Error('El email ya esta registrado');
    }
    // Regla de negocio: la contrasena se guarda hasheada.
    user.password = await bcrypt.hash(user.password, 12);
    return this.port.createUser(user);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.port.getUserByEmail(email);
    if (!user) throw new Error('Credenciales invalidas');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Credenciales invalidas');

    return AuthApplication.generateToken({ id: user.id, email: user.email, role: user.role });
  }

  async updateUser(id: number, user: Partial<User>): Promise<boolean> {
    // Si llega una contrasena nueva, se vuelve a hashear.
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12);
    }
    return this.port.updateUser(id, user);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.port.deleteUser(id);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.port.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.port.getUserByEmail(email);
  }

  async getAllUsers(): Promise<User[]> {
    return this.port.getAllUsers();
  }
}
