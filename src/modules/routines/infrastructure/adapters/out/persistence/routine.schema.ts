import { Schema, model } from 'mongoose';
import { Difficulty } from '../../../../domain/entities/routine.entity';

export interface RoutineDocument {
  _id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  exerciseIds: string[];
  ownerId: string;
  createdAt: Date;
}

const RoutineSchema = new Schema<RoutineDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    exerciseIds: { type: [String], default: [] },
    ownerId: { type: String, required: true },
    createdAt: { type: Date, required: true, default: () => new Date() }
  },
  { _id: false, versionKey: false }
);

export const RoutineModel = model<RoutineDocument>('Routine', RoutineSchema);
