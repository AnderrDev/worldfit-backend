import Joi from 'joi';

export function validateGoalUpdate(data: any) {
  const schema = Joi.object({
    userId: Joi.number().integer().min(1).messages({
      'number.base': 'El ID de usuario debe ser un numero',
      'number.min': 'El ID de usuario debe ser mayor a 0',
    }),
    name: Joi.string().trim().min(3).max(255).pattern(/^[a-zA-ZÀ-ÿ0-9\s-]+$/).messages({
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede superar los 255 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras, numeros, espacios y guiones',
    }),
    description: Joi.string().trim().allow('').max(500).messages({
      'string.max': 'La descripcion no puede superar los 500 caracteres',
    }),
    isActive: Joi.boolean().messages({
      'boolean.base': 'El estado debe ser verdadero o falso',
    }),
  })
    .min(1)
    .messages({ 'object.min': 'Debe enviar al menos un campo para actualizar' });

  const { error, value } = schema.validate(data);
  return { error, value };
}
