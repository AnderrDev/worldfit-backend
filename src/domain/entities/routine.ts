// Modelo de dominio de la rutina (NO depende de TypeORM ni de Express).
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Routine {
  id: number;
  name: string;
  description: string;
  difficulty: Difficulty;
  exerciseIds: number[]; // ids de los ejercicios que componen la rutina
  ownerId: number; // id del usuario dueno de la rutina
  status: number; // 1 = activo, 0 = inactivo (borrado logico)
}
