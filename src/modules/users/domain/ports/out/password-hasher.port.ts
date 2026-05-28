/**
 * Puerto de salida: hashing de passwords. Permite intercambiar bcrypt por argon2 sin tocar dominio.
 */
export interface PasswordHasherPort {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
