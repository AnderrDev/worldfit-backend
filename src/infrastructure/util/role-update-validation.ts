import Joi from 'joi';

export function validateRoleUpdate(data: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).messages({
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre del rol debe tener al menos 3 caracteres',
      'string.max': 'El nombre del rol no puede superar los 50 caracteres',
    }),
    description: Joi.string().trim().allow('').max(500).messages({
      'string.max': 'La descripcion no puede superar los 500 caracteres',
    }),
  })
    .min(1)
    .messages({ 'object.min': 'Debe enviar al menos un campo para actualizar' });

  const { error, value } = schema.validate(data);
  return { error, value };
}
