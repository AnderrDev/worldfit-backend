import { Router } from 'express';
import { UsersController } from './users.controller';
import { RegisterUserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../../../application/use-cases/login-user.use-case';
import { MongoUserRepository } from '../../out/persistence/mongo-user.repository';
import { BcryptPasswordHasher } from '../../out/bcrypt-password-hasher';
import { JwtTokenService } from '../../out/jwt-token-service';

/**
 * Composition root del modulo Users.
 * Aqui se cablean los puertos con sus adaptadores concretos.
 */
export function buildUsersRouter(): Router {
  const userRepository = new MongoUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();

  const registerUser = new RegisterUserUseCase(userRepository, passwordHasher, tokenService);
  const loginUser = new LoginUserUseCase(userRepository, passwordHasher, tokenService);

  const controller = new UsersController(registerUser, loginUser);

  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  return router;
}
