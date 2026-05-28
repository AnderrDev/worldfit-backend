import { NextFunction, Request, Response } from 'express';
import { LoginUserPort, RegisterUserPort } from '../../../../domain/ports/in/auth.port';

/**
 * Adaptador de entrada (driving): HTTP/Express.
 * Solo conoce los puertos de entrada, no las implementaciones concretas.
 */
export class UsersController {
  constructor(
    private readonly registerUser: RegisterUserPort,
    private readonly loginUser: LoginUserPort
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUser.execute(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUser.execute(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
