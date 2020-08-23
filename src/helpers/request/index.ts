import { AxiosResponse } from 'axios'
import { safeResponseData } from '../safeResponseData'
import { CatchError, QueryOptions, Request, RequestPayload } from '../types'

export const DEFAULT_REQUEST_CATCH: CatchError = (error: Error): never => {
  throw error
}

export const makePayload = <Data>(options?: QueryOptions): RequestPayload<Data> => {
  return {
    data: undefined,
    errors: undefined,
    loading: options?.initialLoading ?? true,
    message: undefined,
  }
}

function processResponse<Data>(
  response: AxiosResponse<Data>,
  payload: RequestPayload<Data>,
  options: { isArray: boolean; catchError: CatchError },
): void {
  const { errors, message, ...data } = safeResponseData<Data | any>(response, options.isArray)
  payload.errors = errors
  payload.message = message
  payload.data = data
  payload.loading = false
}

export async function makeRequest<Data>(
  request: Request<Data>,
  payload: RequestPayload<Data>,
  options: { isArray: boolean; catchError: CatchError },
): Promise<void> {
  return request()
    .then((response: AxiosResponse<Data>) => processResponse(response, payload, options))
    .catch((error) => {
      options.catchError(error, payload)
      payload.loading = false
    })
}
