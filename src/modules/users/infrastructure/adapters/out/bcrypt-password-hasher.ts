import bcrypt from 'bcryptjs';
import { PasswordHasherPort } from '../../../domain/ports/out/password-hasher.port';

export class BcryptPasswordHasher implements PasswordHasherPort {
  constructor(private readonly rounds = 10) {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
