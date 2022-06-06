import { config } from 'dotenv';
import { resolve } from 'path';

function getEnvName() {
  if (process.env.NODE_ENV === 'production') {
    return '.env.production';
  }
  if (process.env.NODE_ENV === 'test') {
    return '.env.test';
  }
  return '.env';
}

config({
  path: resolve(process.cwd(), getEnvName()),
});
