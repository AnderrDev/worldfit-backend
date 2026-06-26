import Joi from 'joi';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

// Validacion parcial para actualizar una rutina.
export function validateRoutineUpdate(data: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3),
    description: Joi.string().trim().allow('').max(500),
    difficulty: Joi.string().valid(...DIFFICULTIES),
    exerciseIds: Joi.array().items(Joi.number().integer()),
    assignedUserId: Joi.number().integer(),
    status: Joi.number().valid(0, 1),
  }).min(1);

  const { error, value } = schema.validate(data);
  return { error, value };
}
