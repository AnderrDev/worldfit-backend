import jwt from 'jsonwebtoken';

// Clave de al menos 32 caracteres para firmar los JWT.
const JWT_SECRET = 'cambia_esto_por_una_clave_de_32_o_mas_caracteres';

export class AuthApplication {
  static generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
