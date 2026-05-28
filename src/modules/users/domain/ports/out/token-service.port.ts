/**
 * Puerto de salida: emision de tokens. La aplicacion no conoce JWT.
 */
export interface TokenServicePort {
  sign(payload: Record<string, unknown>): string;
  verify<T = Record<string, unknown>>(token: string): T;
}
