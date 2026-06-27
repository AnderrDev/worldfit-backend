import Joi from 'joi';

export function validateUserUpdate(data: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(255).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).messages({
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede superar los 255 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
    }),
    email: Joi.string().email().messages({
      'string.email': 'El email no tiene un formato valido',
    }),
    password: Joi.string().min(6).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/).messages({
      'string.min': 'La contrasena debe tener al menos 6 caracteres',
      'string.pattern.base': 'La contrasena debe incluir al menos una letra y un numero',
    }),
    roleId: Joi.number().integer().min(1).messages({
      'number.base': 'El ID de rol debe ser un numero',
      'number.min': 'El ID de rol debe ser mayor a 0',
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
