// Modelo de dominio (NO depende de TypeORM ni de Express).
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  status: number; // 1 = activo, 0 = inactivo (borrado logico)
}
