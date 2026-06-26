import Joi from 'joi';

export type EquipmentData = {
  name: string;
  description: string;
  status: number;
};

type ValidationEquipmentData = {
  error: Joi.ValidationError | undefined;
  value: EquipmentData;
};

export function validateEquipmentData(data: any): ValidationEquipmentData {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(255).pattern(/^[a-zA-ZÀ-ÿ0-9\s-]+$/).required(),
    description: Joi.string().trim().allow('').max(500).default(''),
    status: Joi.number().valid(0, 1).default(1),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
