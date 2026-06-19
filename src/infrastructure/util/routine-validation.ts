import Joi from 'joi';

export type RoutineData = {
  name: string;
  description: string;
  difficulty: string;
  exerciseIds: number[];
  ownerId: number;
  status: number;
};

type ValidationRoutineData = {
  error: Joi.ValidationError | undefined;
  value: RoutineData;
};

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export function validateRoutineData(data: any): ValidationRoutineData {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    description: Joi.string().trim().allow('').max(500).required(),
    difficulty: Joi.string().valid(...DIFFICULTIES).required(),
    exerciseIds: Joi.array().items(Joi.number().integer()).default([]),
    ownerId: Joi.number().integer().required(),
    status: Joi.number().valid(0, 1).default(1),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
}
