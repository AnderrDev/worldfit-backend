import { RoutineExerciseItem } from './routine-exercise';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type AssignmentStatus = 'pending' | 'accepted' | 'rejected';

export interface Routine {
  id: number;
  name: string;
  description: string;
  difficulty: Difficulty;
  durationMinutes?: number;
  exercises?: RoutineExerciseItem[];
  assignedUserId: number;
  assignmentStatus: AssignmentStatus;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
