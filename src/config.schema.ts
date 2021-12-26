import * as Joi from '@hapi/joi';
export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(5000),
  DB_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_EXPIRATION_TIME: Joi.number().required()
});
