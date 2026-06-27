import Joi from 'joi';

export type ExerciseData = {
  categoryId: number;
  name: string;
  description: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  isActive: boolean;
};

type ValidationExerciseData = {
  error: Joi.ValidationError | undefined;
  value: ExerciseData;
};

const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'fullbody'];

export function validateExerciseData(data: any): ValidationExerciseData {
  const schema = Joi.object({
    categoryId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de categoria debe ser un numero',
      'number.integer': 'El ID de categoria debe ser un numero entero',
      'number.min': 'El ID de categoria debe ser mayor a 0',
      'any.required': 'El ID de categoria es obligatorio',
    }),
    name: Joi.string().trim().min(3).required().messages({
      'string.empty': 'El nombre del ejercicio es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'any.required': 'El nombre del ejercicio es obligatorio',
    }),
    description: Joi.string().trim().allow('').max(500).default('').messages({
      'string.max': 'La descripcion no puede superar los 500 caracteres',
    }),
    muscleGroup: Joi.string().valid(...MUSCLE_GROUPS).required().messages({
      'any.only': `El grupo muscular debe ser uno de: ${MUSCLE_GROUPS.join(', ')}`,
      'string.empty': 'El grupo muscular es obligatorio',
      'any.required': 'El grupo muscular es obligatorio',
    }),
    sets: Joi.number().integer().min(1).required().messages({
      'number.base': 'Las series deben ser un numero',
      'number.integer': 'Las series deben ser un numero entero',
      'number.min': 'Las series deben ser al menos 1',
      'any.required': 'Las series son obligatorias',
    }),
    reps: Joi.number().integer().min(1).required().messages({
      'number.base': 'Las repeticiones deben ser un numero',
      'number.integer': 'Las repeticiones deben ser un numero entero',
      'number.min': 'Las repeticiones deben ser al menos 1',
      'any.required': 'Las repeticiones son obligatorias',
    }),
    isActive: Joi.boolean().default(true).messages({
      'boolean.base': 'El estado debe ser verdadero o falso',
    }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
