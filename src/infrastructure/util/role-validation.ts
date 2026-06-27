import Joi from 'joi';

export type RoleData = {
  name: string;
  description: string;
};

type ValidationRoleData = {
  error: Joi.ValidationError | undefined;
  value: RoleData;
};

export function validateRoleData(data: any): ValidationRoleData {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required().messages({
      'string.base': 'El nombre del rol debe ser texto',
      'string.empty': 'El nombre del rol es obligatorio',
      'string.min': 'El nombre del rol debe tener al menos 3 caracteres',
      'string.max': 'El nombre del rol no puede superar los 50 caracteres',
      'any.required': 'El nombre del rol es obligatorio',
    }),
    description: Joi.string().trim().allow('').max(500).default('').messages({
      'string.max': 'La descripcion no puede superar los 500 caracteres',
    }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
