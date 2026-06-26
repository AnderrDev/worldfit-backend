import Joi from 'joi';

// Validacion parcial para actualizar: todos los campos son opcionales,
// pero debe llegar al menos uno y no se permiten campos extra.
export function validateUserUpdate(data: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
    email: Joi.string().email(),
    password: Joi.string().min(6).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
    role: Joi.string().valid('user', 'admin'),
    status: Joi.number().valid(0, 1),
  })
    .min(1);

  const { error, value } = schema.validate(data);
  return { error, value };
}
