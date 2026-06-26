import Joi from 'joi';

// Valida unicamente el campo email.
export function validateEmail(email: any) {
  const schema = Joi.string().email().required();
  const { error, value } = schema.validate(email);
  return { error, value };
}
