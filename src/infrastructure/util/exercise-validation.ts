import Joi from 'joi';

export type ExerciseData = {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  status: number;
};

type ValidationExerciseData = {
  error: Joi.ValidationError | undefined;
  value: ExerciseData;
};

const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'fullbody'];

export function validateExerciseData(data: any): ValidationExerciseData {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    muscleGroup: Joi.string().valid(...MUSCLE_GROUPS).required(),
    sets: Joi.number().integer().min(1).required(),
    reps: Joi.number().integer().min(1).required(),
    status: Joi.number().valid(0, 1).default(1),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
