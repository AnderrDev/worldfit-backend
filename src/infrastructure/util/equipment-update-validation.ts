import Joi from 'joi';

export function validateEquipmentUpdate(data: any) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(255).pattern(/^[a-zA-ZÀ-ÿ0-9\s-]+$/),
    description: Joi.string().trim().allow('').max(500),
    status: Joi.number().valid(0, 1),
  }).min(1);

  const { error, value } = schema.validate(data);
  return { error, value };
}
