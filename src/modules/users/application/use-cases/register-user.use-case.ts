import { randomUUID } from 'crypto';
import { ValidationError } from '@shared/domain/errors';
import {
  AuthResult,
  RegisterUserCommand,
  RegisterUserPort
} from '../../domain/ports/in/auth.port';
import { UserRepositoryPort } from '../../domain/ports/out/user-repository.port';
import { PasswordHasherPort } from '../../domain/ports/out/password-hasher.port';
import { TokenServicePort } from '../../domain/ports/out/token-service.port';
import { Email } from '../../domain/value-objects/email.vo';
import { User } from '../../domain/entities/user.entity';

export class RegisterUserUseCase implements RegisterUserPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(cmd: RegisterUserCommand): Promise<AuthResult> {
    const email = Email.create(cmd.email);

    const existing = await this.userRepository.findByEmail(email.value);
    if (existing) {
      throw new ValidationError('Ya existe un usuario con ese email');
    }
    if (!cmd.password || cmd.password.length < 6) {
      throw new ValidationError('Password debe tener al menos 6 caracteres');
    }
    if (!cmd.fullName?.trim()) {
      throw new ValidationError('Nombre completo es obligatorio');
    }

    const passwordHash = await this.passwordHasher.hash(cmd.password);
    const user = new User({
      id: randomUUID(),
      email,
      fullName: cmd.fullName.trim(),
      passwordHash,
      createdAt: new Date()
    });
    const saved = await this.userRepository.save(user);
    const token = this.tokenService.sign({ sub: saved.id, email: saved.email.value });

    return { token, user: saved.toPlain() };
  }
}
