import Joi from 'joi';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const exerciseItemSchema = Joi.object({
  exerciseId: Joi.number().integer().min(1).required().messages({
    'number.base': 'El ID del ejercicio debe ser un numero',
    'any.required': 'El ID del ejercicio es obligatorio',
  }),
  sets: Joi.number().integer().min(1).default(3).messages({
    'number.base': 'Las series deben ser un numero',
    'number.min': 'Las series deben ser al menos 1',
  }),
  repetitions: Joi.number().integer().min(1).default(10).messages({
    'number.base': 'Las repeticiones deben ser un numero',
    'number.min': 'Las repeticiones deben ser al menos 1',
  }),
  description: Joi.string().trim().allow('').max(500).default(''),
  exerciseOrder: Joi.number().integer().min(1).default(1),
  notes: Joi.string().trim().allow('').default(''),
});

export function validateRoutineData(data: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(255).required().messages({
      'string.empty': 'El nombre de la rutina es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede superar los 255 caracteres',
      'any.required': 'El nombre de la rutina es obligatorio',
    }),
    description: Joi.string().trim().allow('').max(500).default('').messages({
      'string.max': 'La descripcion no puede superar los 500 caracteres',
    }),
    difficulty: Joi.string().valid(...DIFFICULTIES).required().messages({
      'any.only': `La dificultad debe ser una de: ${DIFFICULTIES.join(', ')}`,
      'string.empty': 'La dificultad es obligatoria',
      'any.required': 'La dificultad es obligatoria',
    }),
    durationMinutes: Joi.number().integer().min(1).default(0).messages({
      'number.base': 'La duracion debe ser un numero',
      'number.min': 'La duracion debe ser mayor a 0',
    }),
    exercises: Joi.array().items(exerciseItemSchema).default([]).messages({
      'array.base': 'Los ejercicios deben enviarse como una lista',
    }),
    assignedUserId: Joi.number().integer().required().messages({
      'number.base': 'El ID del usuario asignado debe ser un numero',
      'any.required': 'Debe indicar el usuario al que se asigna la rutina',
    }),
    isActive: Joi.boolean().default(true),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
