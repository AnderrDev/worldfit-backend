export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'fullbody';

export interface Exercise {
  id: number;
  categoryId: number;
  categoryName?: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
