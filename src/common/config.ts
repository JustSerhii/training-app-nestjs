import convict from 'convict';

const schema = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'ENVIRONMENT',
  },
  port: {
    doc: 'The application port.',
    format: Number,
    default: 3000,
    env: 'PORT',
  },
});

schema.validate({ allowed: 'strict' });
export const config = schema.getProperties();
