import { User } from '../../entities/user.entity';

/**
 * Puerto de salida (driven): contrato de persistencia.
 * El dominio NO conoce a Mongo ni a ninguna DB.
 */
export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
