import { HTTPError } from '../errors/httpError';

import { ConvertResponse, GetMethod, PostMethod } from './request';

type MaybePromise<T> = T | PromiseLike<T>;

export type EndpointDefinition<ResultType, RequestArgument> = {
  query(argument: RequestArgument): {
    url: string;
    convertResponse?: ConvertResponse;
    headers?: RequestInit['headers'];
  } & (
    | {
        method: GetMethod;
        query?: Partial<RequestArgument>;
        body?: never;
      }
    | {
        method: PostMethod;
        body?: Partial<RequestArgument>;
        query?: never;
      }
  );
};

export type Endpoints = Record<string, EndpointDefinition<unknown, unknown>>;

type RequestArgumentTypeFrom<E extends EndpointDefinition<unknown, unknown>> =
  E extends EndpointDefinition<unknown, infer AT> ? AT : unknown;

type ResponseArgumentTypeFrom<E extends EndpointDefinition<unknown, unknown>> =
  E extends EndpointDefinition<infer RT, unknown> ? RT : unknown;

type EndpointBuilder = {
  query<ResultType, RequestArgument>(
    definition: EndpointDefinition<ResultType, RequestArgument>,
  ): EndpointDefinition<ResultType, RequestArgument>;
};

export type CreateFetchStoreOptions<E extends Endpoints> = {
  endpoints: (build: EndpointBuilder) => E;
  baseUrl?: string;
  errorCallback?: (error: HTTPError) => MaybePromise<void>;
};

type FetchStoreRequestState<E extends EndpointDefinition<unknown, unknown>> = {
  loading: boolean;
  loaded: boolean;
  error: HTTPError | null;
  data: ResponseArgumentTypeFrom<E> | null;
  abortController: AbortController | null;
};

export type FetchStoreState<E extends Endpoints> = {
  readonly [K in keyof E]: FetchStoreRequestState<Extract<E[K], EndpointDefinition<unknown, unknown>>>;
};

export type FetchStoreGetters<E extends Endpoints> = {
  readonly [K in keyof E as K extends string ? `${K}Computed` : never]: () => FetchStoreRequestState<
    Extract<E[K], EndpointDefinition<unknown, unknown>>
  >;
};

export type FetchStoreActions<E extends Endpoints> = {
  [K in keyof E as K extends string ? `${K}Action` : never]: (
    argument: RequestArgumentTypeFrom<E[K]>,
  ) => Promise<
    { status: 'fulfilled'; value: ResponseArgumentTypeFrom<E[K]> } | { status: 'rejected'; reason: HTTPError }
  >;
};

export type FetchStoreDefinition<E extends Endpoints> = {
  state: () => FetchStoreState<E>;
  getters: FetchStoreGetters<E>;
  actions: FetchStoreActions<E>;
};
