import { EndpointDefinition } from '../types';

import { defaultFetchParameters } from './constants';
import { isObject } from './guards';

function convertValueToString<T>(key: string, value: T, index: number): string {
  const valueInString = `${key}=${String(value)}`;

  return index ? `&${valueInString}` : `?${valueInString}`;
}

function converterQueryToString<T>(queryParameters: T): string {
  if (isObject(queryParameters)) {
    return Object.entries(queryParameters).reduce<string>(
      (accumulator, [key, value], index) => accumulator + convertValueToString(key, value, index),
      '',
    );
  }

  return '';
}

export function prepareConfig(
  signal: AbortSignal,
  externalConfig: ReturnType<EndpointDefinition<unknown, unknown>['query']>,
  baseUrl?: string,
) {
  let url = (baseUrl ?? '') + externalConfig.url;
  const config: RequestInit = {
    signal,
    method: externalConfig.method,
    headers: externalConfig.headers ?? defaultFetchParameters.headers,
  };

  if ('body' in externalConfig) {
    config.body = externalConfig.body instanceof FormData ? externalConfig.body : JSON.stringify(externalConfig.body);
  }

  if ('queryParameters' in externalConfig) {
    url += converterQueryToString(externalConfig.queryParameters);
  }

  return {
    config,
    url,
    convertResponse: externalConfig.convertResponse ?? defaultFetchParameters.convertResponse,
  };
}
