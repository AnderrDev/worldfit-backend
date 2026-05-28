/**
 * Puertos de entrada (driving): contratos de los casos de uso.
 * Los adaptadores in (HTTP, CLI, ...) los consumen.
 */
export interface RegisterUserCommand {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginUserCommand {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: { id: string; email: string; fullName: string };
}

export interface RegisterUserPort {
  execute(cmd: RegisterUserCommand): Promise<AuthResult>;
}

export interface LoginUserPort {
  execute(cmd: LoginUserCommand): Promise<AuthResult>;
}
