import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenServicePort } from '../../../domain/ports/out/token-service.port';
import { env } from '@config/env.config';

export class JwtTokenService implements TokenServicePort {
  sign(payload: Record<string, unknown>): string {
    const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
    return jwt.sign(payload, env.jwtSecret, options);
  }

  verify<T = Record<string, unknown>>(token: string): T {
    return jwt.verify(token, env.jwtSecret) as T;
  }
}
