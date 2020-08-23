import { AxiosResponse } from 'axios'
import { safeResponseData } from './safeResponseData'
import { CatchError, QueryOptions, Request, RequestPayload } from './types'

export const DEFAULT_REQUEST_CATCH: CatchError = (error: Error): never => {
  throw error
}

const makePayload = <Data>(options?: QueryOptions): RequestPayload<Data> => {
  return {
    data: undefined,
    errors: undefined,
    loading: options?.initialLoading ?? true,
    message: undefined,
  }
}

export function makeRequest<Data>(
  payload: RequestPayload<Data>,
  request: Request<Data>,
  options: { isArray: boolean; catchError: CatchError },
): void {
  request()
    .then((response: AxiosResponse) => {
      const { errors, message, ...data } = safeResponseData<Data | any>(response, options.isArray)
      payload.errors = errors
      payload.message = message
      payload.data = data
      payload.loading = false
    })
    .catch((error) => {
      options.catchError(error, payload)
      payload.loading = false
    })
}

export function query<Data = any>(request: Request<Data>, options?: QueryOptions): RequestPayload<Data> {
  const payload = makePayload<Data>(options)
  makeRequest<Data>(payload, request, {
    catchError: options?.catchError ?? DEFAULT_REQUEST_CATCH,
    isArray: options?.isArray ?? false,
  })
  return payload
}

export function submit<Data = any>(
  request: Request<Data>,
  options?: QueryOptions,
): RequestPayload<Data> & { onSubmit: () => Promise<void> } {
  return {
    ...makePayload<Data>({ initialLoading: false, ...options }),
    onSubmit: async function (): Promise<void> {
      this.loading = true
      await makeRequest<Data>(this, request, {
        catchError: options?.catchError ?? DEFAULT_REQUEST_CATCH,
        isArray: options?.isArray ?? false,
      })
    },
  }
}
