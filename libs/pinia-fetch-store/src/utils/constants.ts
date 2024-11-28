import { ConvertResponse } from '../types';

export const defaultFetchParameters: {
  convertResponse: ConvertResponse;
  headers: RequestInit['headers'];
} = {
  convertResponse: 'json',
  headers: {
    Accept: 'application/json; charset=utf-8',
    'Content-Type': 'application/json; charset=utf-8',
  },
};

export const additionToInitial = {
  error: null,
  data: null,
  loading: false,
  loaded: false,
  abortController: null,
} as const;
