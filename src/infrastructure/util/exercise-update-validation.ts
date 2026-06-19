import Joi from 'joi';

const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'fullbody'];

// Validacion parcial para actualizar un ejercicio.
export function validateExerciseUpdate(data: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3),
    muscleGroup: Joi.string().valid(...MUSCLE_GROUPS),
    sets: Joi.number().integer().min(1),
    reps: Joi.number().integer().min(1),
    status: Joi.number().valid(0, 1),
  }).min(1);

  const { error, value } = schema.validate(data);
  return { error, value };
}
