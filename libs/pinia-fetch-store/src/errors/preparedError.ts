import { isObject } from '../utils/guards';
import { baseHttpError499, baseHttpError520, baseHttpError524, HTTPError } from './httpError';

export function preparedError(error: unknown): HTTPError {
  if (error instanceof HTTPError) return error;

  if (isObject(error) && 'name' in error) {
    if (error.name === 'TimeoutError') return baseHttpError524;
    if (error.name === 'AbortError') return baseHttpError499;
  }

  return baseHttpError520;
}
