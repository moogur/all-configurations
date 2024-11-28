import { HttpStatus } from "../types/httpStatus";

export class HTTPError extends Error {
  public response: Response;

  public request: Request | null;

  constructor(response: Response, request: Request | null) {
    const code = response.status || response.status === 0 ? response.status : '';
    const title = response.statusText || '';
    const status = `${code} ${title}`.trim();
    const reason = status ? `status code ${status}` : 'an unknown error';

    super(`Request failed with ${reason}`);

    this.name = 'HTTPError';
    this.response = response;
    this.request = request;
  }
}

const emptyResponse = {
  ok: false,
  redirected: false,
  type: 'error',
  url: '',
  clone: () => new Response(),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  headers: new Headers(),
  formData: () => Promise.resolve(new FormData()),
  blob: () => Promise.resolve(new Blob()),
  json: () => Promise.resolve(),
  text: () => Promise.resolve(''),
  body: null,
  bodyUsed: false,
  bytes: undefined,
} as const;

export const baseHttpError499 = new HTTPError({ ...emptyResponse, status: HttpStatus.ABORT, statusText: 'AbortError' }, null);
export const baseHttpError520 = new HTTPError({ ...emptyResponse, status: HttpStatus.UNKNOWN, statusText: 'Unknown Error' }, null);
export const baseHttpError524 = new HTTPError({ ...emptyResponse, status: HttpStatus.TIMEOUT, statusText: 'TimeoutError' }, null);
