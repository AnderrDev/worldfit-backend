import Joi from 'joi';

export type GoalData = {
  name: string;
  description: string;
  status: number;
};

type ValidationGoalData = {
  error: Joi.ValidationError | undefined;
  value: GoalData;
};

export function validateGoalData(data: any): ValidationGoalData {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(255).pattern(/^[a-zA-ZÀ-ÿ0-9\s-]+$/).required(),
    description: Joi.string().trim().allow('').max(500).default(''),
    status: Joi.number().valid(0, 1).default(1),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
