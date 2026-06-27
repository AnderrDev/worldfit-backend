import Joi from 'joi';

export type UserData = {
  name: string;
  email: string;
  password: string;
  roleId: number;
  isActive: boolean;
};

type ValidationUserData = {
  error: Joi.ValidationError | undefined;
  value: UserData;
};

export function validateUserData(data: any): ValidationUserData {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).required().messages({
      'string.base': 'El nombre debe ser texto',
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
      'any.required': 'El nombre es obligatorio',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'El email no tiene un formato valido',
      'string.empty': 'El email es obligatorio',
      'any.required': 'El email es obligatorio',
    }),
    password: Joi.string().min(6).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/).required().messages({
      'string.empty': 'La contrasena es obligatoria',
      'string.min': 'La contrasena debe tener al menos 6 caracteres',
      'string.pattern.base': 'La contrasena debe incluir al menos una letra y un numero',
      'any.required': 'La contrasena es obligatoria',
    }),
    roleId: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'El ID de rol debe ser un numero',
      'number.integer': 'El ID de rol debe ser un numero entero',
      'number.min': 'El ID de rol debe ser mayor a 0',
    }),
    isActive: Joi.boolean().default(true).messages({
      'boolean.base': 'El estado debe ser verdadero o falso',
    }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
