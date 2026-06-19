import 'dotenv/config';
import Joi from 'joi';

export type EnvironmentVars = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SCHEMA: string;
};

type ValidationEnvironmentVars = {
  error: Joi.ValidationError | undefined;
  value: EnvironmentVars;
};

function validateEnvVars(vars: NodeJS.ProcessEnv): ValidationEnvironmentVars {
  const schema = Joi.object({
    PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().allow('').required(),
    DB_NAME: Joi.string().required(),
    DB_SCHEMA: Joi.string().required(),
  }).unknown(true);

  const { error, value } = schema.validate(vars);
  return { error, value };
}

const loadEnvVars = (): EnvironmentVars => {
  const result = validateEnvVars(process.env);
  if (result.error) {
    throw new Error(`Error en variables de entorno: ${result.error.message}`);
  }
  return result.value;
};

export const ENV = loadEnvVars();
