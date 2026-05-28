import { Schema, model } from 'mongoose';
import { MuscleGroup } from '../../../../domain/entities/exercise.entity';

export interface ExerciseDocument {
  _id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
}

const ExerciseSchema = new Schema<ExerciseDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    muscleGroup: {
      type: String,
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'fullbody'],
      required: true
    },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true }
  },
  { _id: false, versionKey: false }
);

export const ExerciseModel = model<ExerciseDocument>('Exercise', ExerciseSchema);
