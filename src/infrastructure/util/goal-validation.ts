import Joi from 'joi';

export type GoalData = {
  userId: number;
  name: string;
  description: string;
  isActive: boolean;
};

type ValidationGoalData = {
  error: Joi.ValidationError | undefined;
  value: GoalData;
};

export function validateGoalData(data: any): ValidationGoalData {
  const schema = Joi.object({
    userId: Joi.number().integer().min(1).required().messages({
      'number.base': 'El ID de usuario debe ser un numero',
      'number.integer': 'El ID de usuario debe ser un numero entero',
      'number.min': 'El ID de usuario debe ser mayor a 0',
      'any.required': 'El ID de usuario es obligatorio',
    }),
    name: Joi.string().trim().min(3).max(255).pattern(/^[a-zA-ZÀ-ÿ0-9\s-]+$/).required().messages({
      'string.empty': 'El nombre del objetivo es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede superar los 255 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras, numeros, espacios y guiones',
      'any.required': 'El nombre del objetivo es obligatorio',
    }),
    description: Joi.string().trim().allow('').max(500).default('').messages({
      'string.max': 'La descripcion no puede superar los 500 caracteres',
    }),
    isActive: Joi.boolean().default(true).messages({
      'boolean.base': 'El estado debe ser verdadero o falso',
    }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
