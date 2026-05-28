import { UnauthorizedError } from '@shared/domain/errors';
import {
  AuthResult,
  LoginUserCommand,
  LoginUserPort
} from '../../domain/ports/in/auth.port';
import { UserRepositoryPort } from '../../domain/ports/out/user-repository.port';
import { PasswordHasherPort } from '../../domain/ports/out/password-hasher.port';
import { TokenServicePort } from '../../domain/ports/out/token-service.port';
import { Email } from '../../domain/value-objects/email.vo';

export class LoginUserUseCase implements LoginUserPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(cmd: LoginUserCommand): Promise<AuthResult> {
    const email = Email.create(cmd.email);
    const user = await this.userRepository.findByEmail(email.value);
    if (!user) {
      throw new UnauthorizedError('Credenciales invalidas');
    }
    const ok = await this.passwordHasher.compare(cmd.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedError('Credenciales invalidas');
    }
    const token = this.tokenService.sign({ sub: user.id, email: user.email.value });
    return { token, user: user.toPlain() };
  }
}
