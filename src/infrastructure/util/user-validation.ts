import Joi from 'joi';

export type UserData = {
  name: string;
  email: string;
  password: string;
  role: string;
  status: number;
};

type ValidationUserData = {
  error: Joi.ValidationError | undefined;
  value: UserData;
};

export function validateUserData(data: any): ValidationUserData {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
    status: Joi.number().valid(0, 1).default(1),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
