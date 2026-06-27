import Joi from 'joi';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const exerciseItemSchema = Joi.object({
  exerciseId: Joi.number().integer().min(1).required().messages({
    'number.base': 'El ID del ejercicio debe ser un numero',
    'any.required': 'El ID del ejercicio es obligatorio',
  }),
  sets: Joi.number().integer().min(1).default(3),
  repetitions: Joi.number().integer().min(1).default(10),
  description: Joi.string().trim().allow('').max(500).default(''),
  exerciseOrder: Joi.number().integer().min(1).default(1),
  notes: Joi.string().trim().allow('').default(''),
});

export function validateRoutineUpdate(data: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(255).messages({
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede superar los 255 caracteres',
    }),
    description: Joi.string().trim().allow('').max(500).messages({
      'string.max': 'La descripcion no puede superar los 500 caracteres',
    }),
    difficulty: Joi.string().valid(...DIFFICULTIES).messages({
      'any.only': `La dificultad debe ser una de: ${DIFFICULTIES.join(', ')}`,
    }),
    durationMinutes: Joi.number().integer().min(1).messages({
      'number.base': 'La duracion debe ser un numero',
      'number.min': 'La duracion debe ser mayor a 0',
    }),
    exercises: Joi.array().items(exerciseItemSchema).messages({
      'array.base': 'Los ejercicios deben enviarse como una lista',
    }),
    assignedUserId: Joi.number().integer().messages({
      'number.base': 'El ID del usuario asignado debe ser un numero',
    }),
    isActive: Joi.boolean(),
  })
    .min(1)
    .messages({ 'object.min': 'Debe enviar al menos un campo para actualizar' });

  const { error, value } = schema.validate(data);
  return { error, value };
}
