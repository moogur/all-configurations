import { preparedError, HTTPError, baseHttpError520WithCustomMessage } from './errors';
import {
  CreateFetchStoreOptions,
  EndpointDefinition,
  Endpoints,
  FetchStoreActions,
  FetchStoreDefinition,
  FetchStoreGetters,
  FetchStoreState,
  HttpStatus,
} from './types';
import { prepareConfig, additionToInitial } from './utils';

// TODO сделано на основе - https://github.com/AgajLumbardh/pinia-fetch-store
function buildState<E extends Endpoints>(endpoints: E): FetchStoreState<E> {
  const result = Object.keys(endpoints).map((key) => ({
    [key]: { ...additionToInitial },
  }));

  return Object.assign({}, ...result);
}

function buildGetters<E extends Endpoints>(endpoints: E): FetchStoreGetters<E> {
  const result = Object.keys(endpoints).map((key) => ({
    [key + 'Computed']: (state: FetchStoreState<E>) => ({
      loading: state?.[key]?.loading,
      loaded: state?.[key]?.loaded,
      error: state?.[key]?.error,
      data: state?.[key]?.data,
      abortController: state?.[key]?.abortController,
    }),
  }));

  return Object.assign({}, ...result);
}

function buildActions<E extends Endpoints>({
  endpoints,
  baseUrl,
  errorCallback,
}: { endpoints: E } & Omit<CreateFetchStoreOptions<E>, 'endpoints'>): FetchStoreActions<E> {
  const actions: any = {};

  Object.entries(endpoints).forEach(([key, value]) => {
    actions[key + 'Action'] = async function (parameters: unknown) {
      try {
        const requestState = this?.[key];

        if (requestState?.loading) throw baseHttpError520WithCustomMessage('This request is already being executed');
        const preparedParams = value.query(parameters);
        if (preparedParams.cached && requestState?.loaded) return { status: 'fulfilled', value: requestState.data };

        this[key].abortController = new AbortController();
        this[key].loading = true;

        const preparedConfig = prepareConfig(this[key].abortController.signal, preparedParams, baseUrl);
        const response = await fetch(preparedConfig.url, preparedConfig.config);

        if (response.ok) {
          const data =
            response.status === HttpStatus.NO_CONTENT ? undefined : await response[preparedConfig.convertResponse]();

          this[key] = {
            ...additionToInitial,
            loaded: true,
            data,
          };

          return { status: 'fulfilled', value: data };
        }

        throw new HTTPError(response, new Request(preparedConfig.url, preparedConfig.config));
      } catch (error: unknown) {
        const formattedError = preparedError(error);

        await errorCallback?.(formattedError);

        this[key] = {
          ...additionToInitial,
          error: formattedError,
        };

        return { status: 'rejected', reason: formattedError };
      }
    };
  });

  return actions;
}

export function createFetchStore<E extends Endpoints>({
  endpoints,
  baseUrl,
  errorCallback,
}: CreateFetchStoreOptions<E>): FetchStoreDefinition<E> {
  const definitions = endpoints({
    query<ResultType, RequestArgument>(definition: EndpointDefinition<ResultType, RequestArgument>) {
      return definition;
    },
  });

  const result = {
    state: () => buildState(definitions),
    getters: buildGetters(definitions),
    actions: buildActions({ endpoints: definitions, baseUrl, errorCallback }),
  };

  return result;
}
